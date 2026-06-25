import json
import re
from typing import Dict, Any, List
from ..models import Candidate, JobDescription

# Domain synonym categories for semantic mapping
SKILL_SYNONYMS = {
    "python": ["python", "py", "pyspark", "django", "fastapi", "flask"],
    "javascript": ["javascript", "js", "react", "next.js", "node.js", "vue", "angular", "jquery", "typescript"],
    "typescript": ["typescript", "ts", "angular", "react", "next.js"],
    "react": ["react", "reactjs", "react.js", "next.js", "redux"],
    "node.js": ["node.js", "nodejs", "node", "express"],
    "aws": ["aws", "s3", "ec2", "rds", "lambda", "ecs", "eks", "cloudformation"],
    "sql": ["sql", "mysql", "postgresql", "postgres", "sqlite", "oracle", "mssql", "db2"],
    "spark": ["spark", "apache spark", "pyspark", "hadoop", "databricks"],
    "kafka": ["kafka", "apache kafka", "event streaming"],
    "kubernetes": ["kubernetes", "k8s", "docker", "containers"],
    "tensorflow": ["tensorflow", "tf", "keras", "deep learning", "neural networks"],
    "pytorch": ["pytorch", "torch", "deep learning", "transformers"],
}

def compute_semantic_similarity(candidate_skills: List[Dict[str, Any]], jd: Dict[str, Any]) -> float:
    """Computes a semantic fit score between candidate skills and JD must-have/nice-to-have skills."""
    must_have = [s.lower() for s in jd.get("must_have_skills", [])]
    nice_to_have = [s.lower() for s in jd.get("nice_to_have_skills", [])]
    
    if not must_have:
        return 50.0  # Default baseline
        
    candidate_skills_lower = {s["skill_name"].lower(): s for s in candidate_skills}
    
    must_have_matches = 0
    nice_to_have_matches = 0
    
    # Check must-have matches (direct or semantic)
    for skill in must_have:
        if skill in candidate_skills_lower:
            must_have_matches += 1.0
        else:
            # Check synonyms
            syns = SKILL_SYNONYMS.get(skill, [])
            match_found = False
            for syn in syns:
                if syn in candidate_skills_lower:
                    must_have_matches += 0.75  # Partial match weight
                    match_found = True
                    break
            if not match_found:
                # Check general domain match (e.g. candidate has python, JD asks for pytorch)
                # We can check if any candidate skill shares a synonym group with the requested skill
                for cand_skill in candidate_skills_lower:
                    if skill in SKILL_SYNONYMS.get(cand_skill, []):
                        must_have_matches += 0.5
                        break
                        
    # Check nice-to-have matches
    for skill in nice_to_have:
        if skill in candidate_skills_lower:
            nice_to_have_matches += 1.0
        else:
            syns = SKILL_SYNONYMS.get(skill, [])
            for syn in syns:
                if syn in candidate_skills_lower:
                    nice_to_have_matches += 0.75
                    break
                    
    # Calculate score
    must_have_ratio = must_have_matches / len(must_have) if must_have else 1.0
    nice_to_have_ratio = nice_to_have_matches / len(nice_to_have) if nice_to_have else 1.0
    
    # Weighted average: 80% Must-have, 20% Nice-to-have
    semantic_score = (must_have_ratio * 80.0) + (nice_to_have_ratio * 20.0)
    return min(100.0, max(0.0, semantic_score))

def evaluate_candidate(candidate_data: Dict[str, Any], jd: Dict[str, Any], weights: Dict[str, float] = None) -> Dict[str, Any]:
    """Evaluates all candidate signals based on a parsed profile and structured JD.
    
    Returns a dictionary of all sub-scores, penalties, and final aggregated ranking score.
    """
    if weights is None:
        # Default Weights matching hackathon specifications
        weights = {
            "semantic_fit": 0.30,
            "experience_relevance": 0.15,
            "career_growth": 0.10,
            "skill_freshness": 0.10,
            "project_impact": 0.10,
            "learning_velocity": 0.10,
            "potential_to_hire": 0.10,
            "behavioral_score": 0.05
        }
        
    skills = candidate_data.get("skills", [])
    experiences = candidate_data.get("experiences", [])
    projects = candidate_data.get("projects", [])
    
    # 1. Semantic Fit Score (30%)
    semantic_fit = compute_semantic_similarity(skills, jd)
    
    # 2. Experience Relevance Score (15%)
    # Sum only durations of experiences relevant to the job description domain or title
    required_years = jd.get("experience_years", 3)
    relevant_years = 0.0
    
    role_terms = set(re.findall(r'\w+', jd.get("role", "").lower()))
    domain_terms = set(re.findall(r'\w+', jd.get("domain", "").lower()))
    
    for exp in experiences:
        exp_role = exp.get("role", "").lower()
        exp_desc = exp.get("description", "").lower()
        duration = exp.get("duration_years", 0.0)
        
        # Check relevance
        is_relevant = False
        # Title keyword match
        if any(term in exp_role for term in role_terms if len(term) > 3):
            is_relevant = True
        # Domain keyword match in role or description
        elif any(term in exp_role or term in exp_desc for term in domain_terms if len(term) > 3):
            is_relevant = True
            
        if is_relevant:
            relevant_years += duration
            
    # Score experience relative to requirements
    if required_years > 0:
        experience_relevance = (relevant_years / required_years) * 100.0
    else:
        experience_relevance = 100.0
    experience_relevance = min(100.0, max(0.0, experience_relevance))
    
    # 3. Career Growth Score (10%)
    # Analyze title progression (intern -> developer -> senior -> lead -> principal)
    growth_points = 50.0  # baseline
    title_progression = []
    
    for exp in reversed(experiences):  # Chronological order
        role = exp.get("role", "").lower()
        if "intern" in role or "trainee" in role:
            title_progression.append(1)
        elif "junior" in role or "associate" in role or "jr" in role:
            title_progression.append(2)
        elif "senior" in role or "sr" in role:
            title_progression.append(4)
        elif "lead" in role or "principal" in role or "architect" in role or "manager" in role:
            title_progression.append(5)
        else:
            title_progression.append(3)  # Standard developer
            
    # Check if there is progression (increase in levels over time)
    if len(title_progression) > 1:
        increases = sum(1 for i in range(1, len(title_progression)) if title_progression[i] > title_progression[i-1])
        growth_points += increases * 20.0
        
    # Give bonus if the current/latest role is senior/leadership
    if title_progression and title_progression[-1] >= 4:
        growth_points += 15.0
        
    career_growth = min(100.0, max(0.0, growth_points))
    
    # 4. Skill Freshness Score (10%)
    # Calculate exponential decay of skills based on last_used year
    # E.g. last_used in 2025/2026 = 1.0, 2024 = 0.9, 2023 = 0.75, 2022 = 0.5, older = 0.2
    freshness_scores = []
    must_have = [s.lower() for s in jd.get("must_have_skills", [])]
    
    # Create mapped dictionary of candidate skills
    cand_skills_map = {s["skill_name"].lower(): s for s in skills}
    
    for skill in must_have:
        last_used = None
        if skill in cand_skills_map:
            last_used = cand_skills_map[skill].get("last_used")
        else:
            # Check synonyms
            syns = SKILL_SYNONYMS.get(skill, [])
            for syn in syns:
                if syn in cand_skills_map:
                    last_used = cand_skills_map[syn].get("last_used")
                    break
                    
        if last_used:
            latency = 2026 - last_used  # current evaluation year is 2026
            if latency <= 0:
                freshness_scores.append(1.0)
            elif latency == 1:
                freshness_scores.append(0.9)
            elif latency == 2:
                freshness_scores.append(0.75)
            elif latency == 3:
                freshness_scores.append(0.5)
            else:
                freshness_scores.append(0.2)
        else:
            freshness_scores.append(0.0)  # Missing skill freshness is 0
            
    skill_freshness = (sum(freshness_scores) / len(freshness_scores) * 100.0) if freshness_scores else 75.0
    
    # 5. Project Impact Score (10%)
    # Evaluate project descriptions for outcomes, scale, complexity
    project_scores = []
    for proj in projects:
        score = proj.get("impact_score", 7.0) * 10.0  # Scale 1-10 to 1-100
        desc = proj.get("description", "").lower()
        
        # Look for business outcome keywords (reduced, increased, optimized, saved, launched, migrates)
        outcome_bonus = 0.0
        if any(w in desc for w in ["reduced", "saved", "%", "increased", "optimized", "uptime", "migration", "scaled", "revenue"]):
            outcome_bonus += 10.0
            
        project_scores.append(min(100.0, score + outcome_bonus))
        
    project_impact = (sum(project_scores) / len(project_scores)) if project_scores else 70.0
    
    # 6. Learning Velocity Score (10%)
    # Rate of technology adoption over the timeline
    # 1. Unique years listed in skills (measures continuity of learning)
    skill_years = [s.get("last_used") for s in skills if s.get("last_used")]
    unique_years = len(set(skill_years))
    
    # 2. Technologies adopted in the latest years (2025-2026)
    new_techs_recent = sum(1 for s in skills if s.get("last_used") and s["last_used"] >= 2025)
    
    velocity_points = 40.0  # baseline
    velocity_points += unique_years * 10.0
    velocity_points += new_techs_recent * 10.0
    
    # Certification and project diversity bonus
    if len(projects) > 1:
        velocity_points += 10.0
        
    learning_velocity = min(100.0, max(20.0, velocity_points))

    
    # 7. Potential-to-Hire Score (10%)
    # Measures how quickly candidate will adapt and grow into a key hire
    potential_to_hire = (learning_velocity * 0.4) + (career_growth * 0.3) + (skill_freshness * 0.3)
    
    # 8. Behavioral Activity Score (5%)
    # Extracted signals like Github links, certifications, publications, hackathons
    behavioral_points = 60.0  # baseline
    raw_resume_text = candidate_data.get("raw_text", "").lower()
    
    if "github" in raw_resume_text:
        behavioral_points += 15.0
    if any(cert in raw_resume_text for cert in ["certified", "certification", "aws certified", "pmp", "scrum"]):
        behavioral_points += 15.0
    if "hackathon" in raw_resume_text:
        behavioral_points += 10.0
        
    behavioral_score = min(100.0, behavioral_points)
    
    # 9. Penalties (Risk Score)
    risk_penalty = 0.0
    
    # Risk A: Job Hopping (average experience duration < 1.5 years, for candidates with > 1 job)
    if len(experiences) >= 2:
        avg_tenure = sum(exp.get("duration_years", 0.0) for exp in experiences) / len(experiences)
        if avg_tenure < 1.5:
            risk_penalty += 10.0  # Job hopper penalty
            
    # Risk B: Skill Gaps (missing key must-have skills)
    missing_must_have = 0
    for skill in must_have:
        if skill not in cand_skills_map:
            # Check synonyms
            syns = SKILL_SYNONYMS.get(skill, [])
            if not any(syn in cand_skills_map for syn in syns):
                missing_must_have += 1
                
    if missing_must_have > 0:
        risk_penalty += min(20.0, missing_must_have * 5.0)  # Skill gap penalty
        
    # Calculate weighted overall score
    weighted_score = (
        (semantic_fit * weights["semantic_fit"]) +
        (experience_relevance * weights["experience_relevance"]) +
        (career_growth * weights["career_growth"]) +
        (skill_freshness * weights["skill_freshness"]) +
        (project_impact * weights["project_impact"]) +
        (learning_velocity * weights["learning_velocity"]) +
        (potential_to_hire * weights["potential_to_hire"]) +
        (behavioral_score * weights["behavioral_score"])
    )
    
    # Deduct risk penalty
    final_score = max(0.0, weighted_score - risk_penalty)
    
    # Generate Digital Twin Archetype
    digital_twin = generate_digital_twin_metadata(
        final_score, semantic_fit, career_growth, learning_velocity, skills, experiences
    )
    
    return {
        "overall_score": round(final_score, 1),
        "semantic_fit": round(semantic_fit, 1),
        "experience_relevance": round(experience_relevance, 1),
        "career_growth": round(career_growth, 1),
        "skill_freshness": round(skill_freshness, 1),
        "project_impact": round(project_impact, 1),
        "learning_velocity": round(learning_velocity, 1),
        "potential_to_hire": round(potential_to_hire, 1),
        "behavioral_score": round(behavioral_score, 1),
        "risk_penalty": round(risk_penalty, 1),
        "digital_twin": digital_twin
    }

def generate_digital_twin_metadata(
    final_score: float, semantic_fit: float, career_growth: float, 
    learning_velocity: float, skills: List[Dict[str, Any]], experiences: List[Dict[str, Any]]
) -> Dict[str, Any]:
    """Generates Digital Twin metadata including Archetype, Strengths, Weaknesses, and Growth Predictions."""
    # Determine Archetype
    if learning_velocity >= 85.0 and career_growth >= 75.0:
        archetype = "Emerging Technical Leader"
    elif learning_velocity >= 85.0:
        archetype = "High-Velocity Adaptor"
    elif semantic_fit >= 90.0 and len(skills) < 6:
        archetype = "Deep Domain Specialist"
    elif len(skills) >= 10:
        archetype = "Versatile Full-Stack Builder"
    else:
        archetype = "Solid Core Engineer"
        
    # Generate Strengths
    strengths = []
    if learning_velocity >= 80.0:
        strengths.append("Rapidly acquires new technologies and frameworks")
    if career_growth >= 75.0:
        strengths.append("Demonstrates strong progression in responsibilities and leadership")
    if semantic_fit >= 80.0:
        strengths.append("High alignment with core technical stack requirements")
        
    # Core technical strengths based on skills
    skill_names = [s["skill_name"].lower() for s in skills]
    if "aws" in skill_names or "gcp" in skill_names or "azure" in skill_names:
        strengths.append("Practical experience with cloud architecture and deployment")
    if "python" in skill_names and "sql" in skill_names:
        strengths.append("Solid data processing and database design capabilities")
    if len(strengths) < 3:
        strengths.append("Demonstrates structured project execution and delivery")
        
    # Generate Weaknesses / Areas for Growth
    weaknesses = []
    # If experiences are short
    if len(experiences) >= 2:
        avg_tenure = sum(exp.get("duration_years", 0.0) for exp in experiences) / len(experiences)
        if avg_tenure < 1.8:
            weaknesses.append("Shorter tenures suggest potential risk of job hopping")
            
    # Skill gaps or lack of leadership
    leadership_keywords = ["lead", "manager", "architect", "principal", "founded", "head"]
    has_leadership = any(any(kw in exp.get("role", "").lower() for kw in leadership_keywords) for exp in experiences)
    if not has_leadership:
        weaknesses.append("Limited formal technical leadership or management exposure")
        
    if len(skills) < 4:
        weaknesses.append("Fewer secondary skills; could benefit from broadening tech stack")
    if not weaknesses:
        weaknesses.append("Needs transition support into higher scope roles")
        
    # Growth Predictions
    growth = []
    latest_role = experiences[0].get("role", "Engineer") if experiences else "Engineer"
    
    if archetype == "Emerging Technical Leader":
        growth.append(f"Ready to transition from {latest_role} to Engineering Manager / Tech Lead within 12 months.")
    elif archetype == "High-Velocity Adaptor":
        growth.append(f"Highly suited for fast-paced R&D teams or new product developments; expected promotion path: {latest_role} -> Senior Engineer.")
    elif archetype == "Deep Domain Specialist":
        growth.append("Prime candidate for Technical Architect track within their specific domain.")
    else:
        growth.append("Steady growth expected along IC (Individual Contributor) tracks.")
        
    growth.append("With structured mentoring, can expand skills into cross-functional tech domains.")
    
    return {
        "archetype": archetype,
        "strengths": strengths[:3],
        "weaknesses": weaknesses[:2],
        "growth_prediction": growth
    }


def generate_xai_explanations(candidate_data: Dict[str, Any], scores: Dict[str, Any], jd: Dict[str, Any]) -> Dict[str, str]:
    """Generate plain-English, human-readable explanations for each score component (XAI)."""
    skills = candidate_data.get("skills", [])
    experiences = candidate_data.get("experiences", [])
    must_have = jd.get("must_have_skills", [])
    skill_names = [s["skill_name"] for s in skills]
    
    explanations = {}
    
    # Semantic Fit
    semantic_fit = scores.get("semantic_fit", 0)
    matching_skills = [s for s in must_have if any(s.lower() in sk.lower() or sk.lower() in s.lower() for sk in skill_names)]
    if semantic_fit >= 85:
        explanations["semantic_fit"] = f"Strong alignment: candidate has {len(matching_skills)}/{len(must_have)} must-have skills."
    elif semantic_fit >= 70:
        explanations["semantic_fit"] = f"Good alignment: candidate covers {len(matching_skills)}/{len(must_have)} core skills."
    else:
        explanations["semantic_fit"] = f"Moderate fit: candidate has gaps in required tech stack."
    
    # Learning Velocity
    learning_velocity = scores.get("learning_velocity", 0)
    recent_skills = [s["skill_name"] for s in skills if s.get("last_used", 0) >= 2025]
    if learning_velocity >= 85:
        explanations["learning_velocity"] = f"Exceptional: adopted {len(recent_skills)} new technologies recently. Rapid learner."
    elif learning_velocity >= 70:
        explanations["learning_velocity"] = f"Strong: has {len(recent_skills)} recent tech adoptions showing consistent growth."
    else:
        explanations["learning_velocity"] = f"Steady: accumulated skills over time with recent activity."
    
    # Career Growth
    career_growth = scores.get("career_growth", 0)
    latest_role = experiences[0].get("role", "") if experiences else ""
    if career_growth >= 80:
        explanations["career_growth"] = f"Strong progression trajectory toward {latest_role}. Ready for leadership roles."
    elif career_growth >= 60:
        explanations["career_growth"] = f"Steady progression: {len(experiences)} roles showing advancing responsibility."
    else:
        explanations["career_growth"] = f"Early-stage career with {len(experiences)} positions."
    
    # Potential-to-Hire
    potential = scores.get("potential_to_hire", 0)
    if potential >= 85:
        explanations["potential_to_hire"] = f"High-potential hire: strong learning velocity + career growth. Quick 12-month ROI."
    elif potential >= 70:
        explanations["potential_to_hire"] = f"Solid potential: demonstrated ability to learn and grow. 3-4 week ramp."
    else:
        explanations["potential_to_hire"] = f"Stable hire with predictable onboarding needs."
    
    return explanations


def calculate_skill_debt(candidate_data: Dict[str, Any], jd: Dict[str, Any]) -> Dict[str, Any]:
    """Analyze skill gaps and predict time-to-productivity based on learning velocity."""
    candidate_skills_lower = {s["skill_name"].lower(): s for s in candidate_data.get("skills", [])}
    must_have = [s.lower() for s in jd.get("must_have_skills", [])]
    nice_to_have = [s.lower() for s in jd.get("nice_to_have_skills", [])]
    
    # Find missing must-have skills
    missing_critical = []
    for skill in must_have:
        if skill not in candidate_skills_lower:
            syns = SKILL_SYNONYMS.get(skill, [])
            if not any(syn in candidate_skills_lower for syn in syns):
                missing_critical.append(skill)
    
    # Find missing nice-to-have
    missing_nice = []
    for skill in nice_to_have:
        if skill not in candidate_skills_lower:
            syns = SKILL_SYNONYMS.get(skill, [])
            if not any(syn in candidate_skills_lower for syn in syns):
                missing_nice.append(skill)
    
    # Estimate time-to-productivity based on learning velocity
    velocity_scores = [s.get("last_used", 2020) for s in candidate_data.get("skills", [])]
    avg_velocity = sum(velocity_scores) / len(velocity_scores) if velocity_scores else 2020
    velocity_index = min(100, max(50, (avg_velocity - 2020) * 10))
    
    if velocity_index >= 80:
        weeks_per_skill = 1.5
    elif velocity_index >= 70:
        weeks_per_skill = 2.5
    else:
        weeks_per_skill = 4.0
    
    estimated_weeks = len(missing_critical) * weeks_per_skill + len(missing_nice) * weeks_per_skill * 0.5
    
    return {
        "missing_critical": missing_critical,
        "missing_nice": missing_nice,
        "estimated_weeks_to_productivity": round(estimated_weeks, 1),
        "skill_debt_severity": "high" if len(missing_critical) >= 2 else "medium" if len(missing_critical) == 1 else "low"
    }
