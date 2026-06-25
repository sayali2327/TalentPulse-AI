from sqlalchemy import Column, Integer, String, Float, Boolean, ForeignKey, Text
from sqlalchemy.orm import relationship
from .database import Base

class JobDescription(Base):
    __tablename__ = "job_descriptions"

    id = Column(Integer, primary_key=True, index=True)
    role = Column(String, index=True)
    must_have_skills = Column(Text)  # JSON-serialized list
    nice_to_have_skills = Column(Text)  # JSON-serialized list
    seniority = Column(String)
    experience_years = Column(Integer)
    leadership = Column(Boolean, default=False)
    domain = Column(String)
    raw_text = Column(Text)

class Candidate(Base):
    __tablename__ = "candidates"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    email = Column(String, nullable=True)
    phone = Column(String, nullable=True)
    github_url = Column(String, nullable=True)
    linkedin_url = Column(String, nullable=True)
    
    # Core Evaluation Scores
    overall_score = Column(Float, default=0.0)
    semantic_fit = Column(Float, default=0.0)
    experience_relevance = Column(Float, default=0.0)
    career_growth = Column(Float, default=0.0)
    skill_freshness = Column(Float, default=0.0)
    project_impact = Column(Float, default=0.0)
    learning_velocity = Column(Float, default=0.0)
    potential_to_hire = Column(Float, default=0.0)
    behavioral_score = Column(Float, default=0.0)
    risk_penalty = Column(Float, default=0.0)
    
    # Digital Twin Fields
    digital_twin_archetype = Column(String, nullable=True)
    digital_twin_strengths = Column(Text, nullable=True)  # JSON-serialized list
    digital_twin_weaknesses = Column(Text, nullable=True)  # JSON-serialized list
    digital_twin_growth = Column(Text, nullable=True)  # JSON-serialized list
    
    resume_summary = Column(Text, nullable=True)
    raw_text = Column(Text, nullable=True)

    # Relationships
    experiences = relationship("CandidateExperience", back_populates="candidate", cascade="all, delete-orphan")
    skills = relationship("CandidateSkill", back_populates="candidate", cascade="all, delete-orphan")
    projects = relationship("CandidateProject", back_populates="candidate", cascade="all, delete-orphan")

class CandidateExperience(Base):
    __tablename__ = "candidate_experiences"

    id = Column(Integer, primary_key=True, index=True)
    candidate_id = Column(Integer, ForeignKey("candidates.id"))
    company = Column(String)
    role = Column(String)
    start_date = Column(String, nullable=True)
    end_date = Column(String, nullable=True)
    description = Column(Text, nullable=True)
    duration_years = Column(Float, default=0.0)

    candidate = relationship("Candidate", back_populates="experiences")

class CandidateSkill(Base):
    __tablename__ = "candidate_skills"

    id = Column(Integer, primary_key=True, index=True)
    candidate_id = Column(Integer, ForeignKey("candidates.id"))
    skill_name = Column(String, index=True)
    years_used = Column(Float, default=0.0)
    last_used = Column(Integer, nullable=True)  # Year, e.g., 2025

    candidate = relationship("Candidate", back_populates="skills")

class CandidateProject(Base):
    __tablename__ = "candidate_projects"

    id = Column(Integer, primary_key=True, index=True)
    candidate_id = Column(Integer, ForeignKey("candidates.id"))
    title = Column(String)
    description = Column(Text, nullable=True)
    impact_score = Column(Float, default=5.0)  # scale 1-10

    candidate = relationship("Candidate", back_populates="projects")
