import json
from fastapi import FastAPI, UploadFile, File, Form, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from typing import List, Dict, Any, Optional
from pydantic import BaseModel
import io

from .database import engine, Base, get_db
from .models import JobDescription, Candidate, CandidateExperience, CandidateSkill, CandidateProject
from .services.parser import extract_text_from_pdf, parse_job_description, parse_resume
from .services.ai_engine import evaluate_candidate
from .services import github_service

# Initialize Database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="TalentPulse AI API")

# Setup CORS for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For local development/demo
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class WeightsInput(BaseModel):
    semantic_fit: float
    experience_relevance: float
    career_growth: float
    skill_freshness: float
    project_impact: float
    learning_velocity: float
    potential_to_hire: float
    behavioral_score: float

class SimulatorInput(BaseModel):
    weights: WeightsInput
    must_have_skills: Optional[List[str]] = None
    min_experience_years: Optional[int] = None
    seniority: Optional[str] = None

@app.get("/api/health")
def health_check():
    return {"status": "healthy"}

@app.post("/api/job-description")
def upload_job_description(
    text: str = Form(...),
    db: Session = Depends(get_db)
):
    # Clear previous job descriptions for the demo
    db.query(JobDescription).delete()
    
    # Parse JD
    parsed_jd = parse_job_description(text)
    
    # Save to DB
    db_jd = JobDescription(
        role=parsed_jd["role"],
        must_have_skills=json.dumps(parsed_jd["must_have_skills"]),
        nice_to_have_skills=json.dumps(parsed_jd["nice_to_have_skills"]),
        seniority=parsed_jd["seniority"],
        experience_years=parsed_jd["experience_years"],
        leadership=parsed_jd["leadership"],
        domain=parsed_jd["domain"],
        raw_text=text
    )
    db.add(db_jd)
    db.commit()
    db.refresh(db_jd)
    
    # Also, if candidates already exist, re-evaluate them with the new JD
    recalculate_all_candidates(db, parsed_jd)
    
    return parsed_jd

@app.get("/api/job-description")
def get_job_description(db: Session = Depends(get_db)):
    jd = db.query(JobDescription).first()
    if not jd:
        return {}
    return {
        "id": jd.id,
        "role": jd.role,
        "must_have_skills": json.loads(jd.must_have_skills),
        "nice_to_have_skills": json.loads(jd.nice_to_have_skills),
        "seniority": jd.seniority,
        "experience_years": jd.experience_years,
        "leadership": jd.leadership,
        "domain": jd.domain,
        "raw_text": jd.raw_text
    }

@app.post("/api/upload-resume")
async def upload_resume(
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    if not file.filename.endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF resumes are supported.")
        
    file_bytes = await file.read()
    resume_text = extract_text_from_pdf(file_bytes)
    
    if not resume_text:
        raise HTTPException(status_code=400, detail="Could not extract text from PDF.")
        
    # Parse candidate details
    parsed_cand = parse_resume(resume_text)
    
    # Check if candidate name already exists, if so delete to overwrite
    db.query(Candidate).filter(Candidate.name == parsed_cand["name"]).delete()
    db.commit()
    
    # Save candidate profile (scores initialized to 0)
    db_candidate = Candidate(
        name=parsed_cand["name"],
        email=parsed_cand.get("email"),
        phone=parsed_cand.get("phone"),
        github_url=parsed_cand.get("github_url"),
        linkedin_url=parsed_cand.get("linkedin_url"),
        resume_summary=parsed_cand.get("resume_summary"),
        raw_text=resume_text
    )
    db.add(db_candidate)
    db.commit()
    db.refresh(db_candidate)
    
    # Save Experiences
    for exp in parsed_cand.get("experiences", []):
        db_exp = CandidateExperience(
            candidate_id=db_candidate.id,
            company=exp["company"],
            role=exp["role"],
            start_date=exp.get("start_date"),
            end_date=exp.get("end_date"),
            description=exp.get("description"),
            duration_years=exp.get("duration_years", 0.0)
        )
        db.add(db_exp)
        
    # Save Skills
    for skill in parsed_cand.get("skills", []):
        db_skill = CandidateSkill(
            candidate_id=db_candidate.id,
            skill_name=skill["skill_name"],
            years_used=skill.get("years_used", 0.0),
            last_used=skill.get("last_used")
        )
        db.add(db_skill)
        
    # Save Projects
    for proj in parsed_cand.get("projects", []):
        db_proj = CandidateProject(
            candidate_id=db_candidate.id,
            title=proj["title"],
            description=proj.get("description"),
            impact_score=proj.get("impact_score", 7.0)
        )
        db.add(db_proj)
        
    db.commit()
    
    # Evaluate candidate against the active Job Description (if available)
    jd_record = db.query(JobDescription).first()
    if jd_record:
        jd = {
            "role": jd_record.role,
            "must_have_skills": json.loads(jd_record.must_have_skills),
            "nice_to_have_skills": json.loads(jd_record.nice_to_have_skills),
            "experience_years": jd_record.experience_years,
            "seniority": jd_record.seniority,
            "leadership": jd_record.leadership,
            "domain": jd_record.domain
        }
        scores = evaluate_candidate(parsed_cand, jd)
        
        # Update scores in DB
        db_candidate.overall_score = scores["overall_score"]
        db_candidate.semantic_fit = scores["semantic_fit"]
        db_candidate.experience_relevance = scores["experience_relevance"]
        db_candidate.career_growth = scores["career_growth"]
        db_candidate.skill_freshness = scores["skill_freshness"]
        db_candidate.project_impact = scores["project_impact"]
        db_candidate.learning_velocity = scores["learning_velocity"]
        db_candidate.potential_to_hire = scores["potential_to_hire"]
        db_candidate.behavioral_score = scores["behavioral_score"]
        db_candidate.risk_penalty = scores["risk_penalty"]
        
        # Digital Twin
        db_candidate.digital_twin_archetype = scores["digital_twin"]["archetype"]
        db_candidate.digital_twin_strengths = json.dumps(scores["digital_twin"]["strengths"])
        db_candidate.digital_twin_weaknesses = json.dumps(scores["digital_twin"]["weaknesses"])
        db_candidate.digital_twin_growth = json.dumps(scores["digital_twin"]["growth_prediction"])
        
        db.commit()
        db.refresh(db_candidate)
        
    return {"message": "Resume uploaded and analyzed.", "candidate_id": db_candidate.id, "name": db_candidate.name}

@app.get("/api/candidates")
def get_candidates(db: Session = Depends(get_db)):
    candidates = db.query(Candidate).order_by(Candidate.overall_score.desc()).all()
    result = []
    for c in candidates:
        result.append({
            "id": c.id,
            "name": c.name,
            "email": c.email,
            "phone": c.phone,
            "github_url": c.github_url,
            "linkedin_url": c.linkedin_url,
            "overall_score": c.overall_score,
            "semantic_fit": c.semantic_fit,
            "experience_relevance": c.experience_relevance,
            "career_growth": c.career_growth,
            "skill_freshness": c.skill_freshness,
            "project_impact": c.project_impact,
            "learning_velocity": c.learning_velocity,
            "potential_to_hire": c.potential_to_hire,
            "behavioral_score": c.behavioral_score,
            "risk_penalty": c.risk_penalty,
            "digital_twin": {
                "archetype": c.digital_twin_archetype,
                "strengths": json.loads(c.digital_twin_strengths) if c.digital_twin_strengths else [],
                "weaknesses": json.loads(c.digital_twin_weaknesses) if c.digital_twin_weaknesses else [],
                "growth_prediction": json.loads(c.digital_twin_growth) if c.digital_twin_growth else []
            },
            "resume_summary": c.resume_summary
        })
    return result

@app.get("/api/candidates/{candidate_id}")
def get_candidate_details(candidate_id: int, db: Session = Depends(get_db)):
    c = db.query(Candidate).filter(Candidate.id == candidate_id).first()
    if not c:
        raise HTTPException(status_code=404, detail="Candidate not found")
        
    experiences = [{
        "company": exp.company,
        "role": exp.role,
        "start_date": exp.start_date,
        "end_date": exp.end_date,
        "description": exp.description,
        "duration_years": exp.duration_years
    } for exp in c.experiences]
    
    skills = [{
        "skill_name": sk.skill_name,
        "years_used": sk.years_used,
        "last_used": sk.last_used
    } for sk in c.skills]
    
    projects = [{
        "title": proj.title,
        "description": proj.description,
        "impact_score": proj.impact_score
    } for proj in c.projects]
    
    return {
        "id": c.id,
        "name": c.name,
        "email": c.email,
        "phone": c.phone,
        "github_url": c.github_url,
        "linkedin_url": c.linkedin_url,
        "overall_score": c.overall_score,
        "semantic_fit": c.semantic_fit,
        "experience_relevance": c.experience_relevance,
        "career_growth": c.career_growth,
        "skill_freshness": c.skill_freshness,
        "project_impact": c.project_impact,
        "learning_velocity": c.learning_velocity,
        "potential_to_hire": c.potential_to_hire,
        "behavioral_score": c.behavioral_score,
        "risk_penalty": c.risk_penalty,
        "digital_twin": {
            "archetype": c.digital_twin_archetype,
            "strengths": json.loads(c.digital_twin_strengths) if c.digital_twin_strengths else [],
            "weaknesses": json.loads(c.digital_twin_weaknesses) if c.digital_twin_weaknesses else [],
            "growth_prediction": json.loads(c.digital_twin_growth) if c.digital_twin_growth else []
        },
        "resume_summary": c.resume_summary,
        "experiences": experiences,
        "skills": skills,
        "projects": projects
    }

@app.get("/api/candidates/{candidate_id}/github-stats")
def get_candidate_github_stats(candidate_id: int, db: Session = Depends(get_db)):
    c = db.query(Candidate).filter(Candidate.id == candidate_id).first()
    if not c:
        raise HTTPException(status_code=404, detail="Candidate not found")
        
    username = None
    if c.github_url:
        username = github_service.extract_github_username(c.github_url)
    
    if not username:
        # Fallback to extracting from raw text
        username = github_service.extract_github_username(c.raw_text or "")
        
    if not username:
        return {"has_github": False, "username": None, "repos": [], "languages": {}, "engagement_score": 0}
        
    signals = github_service.get_github_candidate_signals(username)
    if not signals or not signals.get("github_profile"):
        # Fallback to mock data if API limits hit or offline
        candidate_skills = [sk.skill_name for sk in c.skills]
        main_lang = candidate_skills[0] if candidate_skills else "Python"
        other_lang = candidate_skills[1] if len(candidate_skills) > 1 else "TypeScript"
        
        mock_repos = [
            {
                "name": f"{main_lang.lower()}-performance-tuner",
                "description": f"Optimized multi-threaded compiler and runtime parser built in {main_lang}.",
                "language": main_lang,
                "stars": 42,
                "forks": 8,
                "updated_at": "2026-05-10T12:00:00Z",
                "url": f"https://github.com/{username}/{main_lang.lower()}-performance-tuner"
            },
            {
                "name": f"distributed-scheduler",
                "description": "Lightweight distributed task scheduler with pluggable backends.",
                "language": other_lang,
                "stars": 15,
                "forks": 3,
                "updated_at": "2026-06-01T15:30:00Z",
                "url": f"https://github.com/{username}/distributed-scheduler"
            }
        ]
        mock_languages = {main_lang: 15, other_lang: 8, "SQL": 5}
        
        return {
            "has_github": True,
            "username": username,
            "public_repos": 12,
            "followers": 8,
            "engagement_score": 65.0,
            "repos": mock_repos,
            "languages": mock_languages,
            "is_mock": True
        }
        
    return {
        "has_github": True,
        "username": username,
        "public_repos": signals.get("github_public_repos", 0),
        "followers": signals.get("github_followers", 0),
        "engagement_score": round(signals.get("github_engagement_score", 0), 1),
        "repos": signals.get("github_repos", []),
        "languages": signals.get("github_languages", {}),
        "is_mock": False
    }

@app.post("/api/simulator/rankings")
def simulate_rankings(input_data: SimulatorInput, db: Session = Depends(get_db)):
    jd_record = db.query(JobDescription).first()
    if not jd_record:
        raise HTTPException(status_code=400, detail="No active Job Description found. Please upload a JD first.")
        
    # Prepare simulated Job Description from input filters if provided, else use DB JD
    jd = {
        "role": jd_record.role,
        "must_have_skills": input_data.must_have_skills if input_data.must_have_skills is not None else json.loads(jd_record.must_have_skills),
        "nice_to_have_skills": json.loads(jd_record.nice_to_have_skills),
        "experience_years": input_data.min_experience_years if input_data.min_experience_years is not None else jd_record.experience_years,
        "seniority": input_data.seniority if input_data.seniority is not None else jd_record.seniority,
        "leadership": jd_record.leadership,
        "domain": jd_record.domain
    }
    
    weights_dict = input_data.weights.model_dump()
    
    candidates = db.query(Candidate).all()
    result = []
    
    for c in candidates:
        # Re-construct parsed candidate dict for scoring
        cand_dict = {
            "name": c.name,
            "email": c.email,
            "phone": c.phone,
            "resume_summary": c.resume_summary,
            "raw_text": c.raw_text,
            "skills": [{"skill_name": sk.skill_name, "years_used": sk.years_used, "last_used": sk.last_used} for sk in c.skills],
            "experiences": [{"company": exp.company, "role": exp.role, "start_date": exp.start_date, "end_date": exp.end_date, "description": exp.description, "duration_years": exp.duration_years} for exp in c.experiences],
            "projects": [{"title": proj.title, "description": proj.description, "impact_score": proj.impact_score} for proj in c.projects]
        }
        
        # Evaluate using custom weights and simulated JD
        scores = evaluate_candidate(cand_dict, jd, weights_dict)
        
        result.append({
            "id": c.id,
            "name": c.name,
            "email": c.email,
            "phone": c.phone,
            "github_url": c.github_url,
            "linkedin_url": c.linkedin_url,
            "overall_score": scores["overall_score"],
            "semantic_fit": scores["semantic_fit"],
            "experience_relevance": scores["experience_relevance"],
            "career_growth": scores["career_growth"],
            "skill_freshness": scores["skill_freshness"],
            "project_impact": scores["project_impact"],
            "learning_velocity": scores["learning_velocity"],
            "potential_to_hire": scores["potential_to_hire"],
            "behavioral_score": scores["behavioral_score"],
            "risk_penalty": scores["risk_penalty"],
            "digital_twin": scores["digital_twin"],
            "resume_summary": c.resume_summary
        })
        
    # Sort results by overall score desc
    result.sort(key=lambda x: x["overall_score"], reverse=True)
    return result

@app.delete("/api/candidates")
def reset_database(db: Session = Depends(get_db)):
    db.query(Candidate).delete()
    db.query(JobDescription).delete()
    db.commit()
    return {"message": "Database successfully reset."}

def recalculate_all_candidates(db: Session, parsed_jd: Dict[str, Any]):
    """Utility to update scores for all existing candidates when a new JD is uploaded."""
    candidates = db.query(Candidate).all()
    for c in candidates:
        cand_dict = {
            "name": c.name,
            "email": c.email,
            "phone": c.phone,
            "resume_summary": c.resume_summary,
            "raw_text": c.raw_text,
            "skills": [{"skill_name": sk.skill_name, "years_used": sk.years_used, "last_used": sk.last_used} for sk in c.skills],
            "experiences": [{"company": exp.company, "role": exp.role, "start_date": exp.start_date, "end_date": exp.end_date, "description": exp.description, "duration_years": exp.duration_years} for exp in c.experiences],
            "projects": [{"title": proj.title, "description": proj.description, "impact_score": proj.impact_score} for proj in c.projects]
        }
        
        scores = evaluate_candidate(cand_dict, parsed_jd)
        
        c.overall_score = scores["overall_score"]
        c.semantic_fit = scores["semantic_fit"]
        c.experience_relevance = scores["experience_relevance"]
        c.career_growth = scores["career_growth"]
        c.skill_freshness = scores["skill_freshness"]
        c.project_impact = scores["project_impact"]
        c.learning_velocity = scores["learning_velocity"]
        c.potential_to_hire = scores["potential_to_hire"]
        c.behavioral_score = scores["behavioral_score"]
        c.risk_penalty = scores["risk_penalty"]
        
        c.digital_twin_archetype = scores["digital_twin"]["archetype"]
        c.digital_twin_strengths = json.dumps(scores["digital_twin"]["strengths"])
        c.digital_twin_weaknesses = json.dumps(scores["digital_twin"]["weaknesses"])
        c.digital_twin_growth = json.dumps(scores["digital_twin"]["growth_prediction"])
        
    db.commit()

@app.post("/api/batch-upload-resumes")
async def batch_upload_resumes(
    files: List[UploadFile] = File(...),
    db: Session = Depends(get_db)
):
    """Upload multiple resume PDFs and process them in batch."""
    results = []
    errors = []
    
    for file in files:
        try:
            if not file.filename.endswith('.pdf'):
                errors.append({"filename": file.filename, "error": "Only PDF files are supported"})
                continue
            
            file_bytes = await file.read()
            resume_text = extract_text_from_pdf(file_bytes)
            
            if not resume_text:
                errors.append({"filename": file.filename, "error": "Could not extract text from PDF"})
                continue
            
            # Parse candidate
            parsed_cand = parse_resume(resume_text)
            
            # Delete existing candidate with same name
            db.query(Candidate).filter(Candidate.name == parsed_cand["name"]).delete()
            db.commit()
            
            # Save candidate
            db_candidate = Candidate(
                name=parsed_cand["name"],
                email=parsed_cand.get("email"),
                phone=parsed_cand.get("phone"),
                resume_summary=parsed_cand.get("resume_summary"),
                raw_text=resume_text
            )
            db.add(db_candidate)
            db.commit()
            db.refresh(db_candidate)
            
            # Save related data
            for exp in parsed_cand.get("experiences", []):
                db.add(CandidateExperience(
                    candidate_id=db_candidate.id,
                    company=exp["company"],
                    role=exp["role"],
                    start_date=exp.get("start_date"),
                    end_date=exp.get("end_date"),
                    description=exp.get("description"),
                    duration_years=exp.get("duration_years", 0.0)
                ))
            
            for skill in parsed_cand.get("skills", []):
                db.add(CandidateSkill(
                    candidate_id=db_candidate.id,
                    skill_name=skill["skill_name"],
                    years_used=skill.get("years_used", 0.0),
                    last_used=skill.get("last_used")
                ))
            
            for proj in parsed_cand.get("projects", []):
                db.add(CandidateProject(
                    candidate_id=db_candidate.id,
                    title=proj["title"],
                    description=proj.get("description"),
                    impact_score=proj.get("impact_score", 7.0)
                ))
            
            db.commit()
            
            # Evaluate candidate if JD exists
            jd_record = db.query(JobDescription).first()
            if jd_record:
                jd = {
                    "role": jd_record.role,
                    "must_have_skills": json.loads(jd_record.must_have_skills),
                    "nice_to_have_skills": json.loads(jd_record.nice_to_have_skills),
                    "experience_years": jd_record.experience_years,
                    "seniority": jd_record.seniority,
                    "leadership": jd_record.leadership,
                    "domain": jd_record.domain
                }
                scores = evaluate_candidate(parsed_cand, jd)
                
                db_candidate.overall_score = scores["overall_score"]
                db_candidate.semantic_fit = scores["semantic_fit"]
                db_candidate.experience_relevance = scores["experience_relevance"]
                db_candidate.career_growth = scores["career_growth"]
                db_candidate.skill_freshness = scores["skill_freshness"]
                db_candidate.project_impact = scores["project_impact"]
                db_candidate.learning_velocity = scores["learning_velocity"]
                db_candidate.potential_to_hire = scores["potential_to_hire"]
                db_candidate.behavioral_score = scores["behavioral_score"]
                db_candidate.risk_penalty = scores["risk_penalty"]
                
                db_candidate.digital_twin_archetype = scores["digital_twin"]["archetype"]
                db_candidate.digital_twin_strengths = json.dumps(scores["digital_twin"]["strengths"])
                db_candidate.digital_twin_weaknesses = json.dumps(scores["digital_twin"]["weaknesses"])
                db_candidate.digital_twin_growth = json.dumps(scores["digital_twin"]["growth_prediction"])
                
                db.commit()
            
            results.append({
                "filename": file.filename,
                "candidate_id": db_candidate.id,
                "name": db_candidate.name,
                "status": "success"
            })
            
        except Exception as e:
            errors.append({"filename": file.filename, "error": str(e)})
    
    return {
        "uploaded": len(results),
        "failed": len(errors),
        "results": results,
        "errors": errors
    }

@app.get("/api/export-rankings")
def export_rankings_csv(db: Session = Depends(get_db)):
    """Export current candidate rankings as CSV."""
    import csv
    
    candidates = db.query(Candidate).order_by(Candidate.overall_score.desc()).all()
    
    # Create CSV in memory
    output = io.StringIO()
    writer = csv.writer(output)
    
    # Header
    writer.writerow([
        "Rank",
        "Name",
        "Email",
        "Phone",
        "Overall Score",
        "Semantic Fit",
        "Experience Relevance",
        "Career Growth",
        "Skill Freshness",
        "Project Impact",
        "Learning Velocity",
        "Potential-to-Hire",
        "Behavioral Score",
        "Risk Penalty",
        "Digital Twin Archetype",
        "Top Strengths",
        "Growth Areas",
        "Resume Summary"
    ])
    
    # Rows
    for rank, c in enumerate(candidates, 1):
        strengths = json.loads(c.digital_twin_strengths) if c.digital_twin_strengths else []
        weaknesses = json.loads(c.digital_twin_weaknesses) if c.digital_twin_weaknesses else []
        
        writer.writerow([
            rank,
            c.name,
            c.email or "",
            c.phone or "",
            round(c.overall_score or 0, 2),
            round(c.semantic_fit or 0, 2),
            round(c.experience_relevance or 0, 2),
            round(c.career_growth or 0, 2),
            round(c.skill_freshness or 0, 2),
            round(c.project_impact or 0, 2),
            round(c.learning_velocity or 0, 2),
            round(c.potential_to_hire or 0, 2),
            round(c.behavioral_score or 0, 2),
            round(c.risk_penalty or 0, 2),
            c.digital_twin_archetype or "N/A",
            "; ".join(strengths[:3]) if strengths else "N/A",
            "; ".join(weaknesses[:2]) if weaknesses else "N/A",
            c.resume_summary or ""
        ])
    
    output.seek(0)
    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=talent-pulse-rankings.csv"}
    )
