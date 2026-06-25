"""Advanced features: Skill Demand Forecasting and Bias Detection."""

from typing import Dict, List, Any, Tuple

# Tech skill demand trends (simplified forecasting for 2025-2027)
SKILL_DEMAND_TRENDS = {
    "python": {"current": 95, "2025": 98, "2026": 99, "2027": 100, "trend": "stable_high"},
    "typescript": {"current": 85, "2025": 90, "2026": 93, "2027": 95, "trend": "rising"},
    "rust": {"current": 60, "2025": 70, "2026": 78, "2027": 85, "trend": "rising_fast"},
    "kotlin": {"current": 45, "2025": 50, "2026": 55, "2027": 60, "trend": "rising_slow"},
    "go": {"current": 70, "2025": 75, "2026": 78, "2027": 80, "trend": "rising"},
    "java": {"current": 90, "2025": 88, "2026": 85, "2027": 82, "trend": "declining"},
    "react": {"current": 92, "2025": 94, "2026": 95, "2027": 96, "trend": "stable_high"},
    "vue": {"current": 60, "2025": 62, "2026": 63, "2027": 63, "trend": "stable"},
    "angular": {"current": 70, "2025": 68, "2026": 65, "2027": 62, "trend": "declining"},
    "aws": {"current": 88, "2025": 90, "2026": 91, "2027": 92, "trend": "stable_high"},
    "gcp": {"current": 65, "2025": 70, "2026": 74, "2027": 77, "trend": "rising"},
    "kubernetes": {"current": 80, "2025": 85, "2026": 88, "2027": 90, "trend": "rising"},
    "ai": {"current": 75, "2025": 88, "2026": 95, "2027": 98, "trend": "rising_very_fast"},
    "llm": {"current": 70, "2025": 85, "2026": 92, "2027": 97, "trend": "rising_very_fast"},
    "prompt engineering": {"current": 60, "2025": 78, "2026": 85, "2027": 88, "trend": "rising_very_fast"},
    "docker": {"current": 85, "2025": 87, "2026": 88, "2027": 88, "trend": "stable_high"},
    "sql": {"current": 95, "2025": 94, "2026": 93, "2027": 92, "trend": "stable_high"},
    "nosql": {"current": 75, "2025": 78, "2026": 80, "2027": 81, "trend": "rising"},
}

def forecast_skill_demand(skill: str, year: int = 2026) -> Dict[str, Any]:
    """Forecast demand for a specific skill in a given year."""
    skill_lower = skill.lower()
    
    if skill_lower not in SKILL_DEMAND_TRENDS:
        return {
            "skill": skill,
            "demand_score": 50,  # Default neutral demand
            "trend": "unknown",
            "forecast": "Unknown skill"
        }
    
    trend_data = SKILL_DEMAND_TRENDS[skill_lower]
    year_key = str(year)
    
    demand_score = trend_data.get(year_key, trend_data["current"])
    
    return {
        "skill": skill,
        "demand_score": demand_score,
        "trend": trend_data["trend"],
        "current_demand": trend_data["current"],
        "forecast_2026": trend_data["2026"],
        "forecast_2027": trend_data["2027"]
    }

def get_emerging_skills() -> List[str]:
    """Return list of emerging/trending skills (rising trends)."""
    emerging = []
    for skill, data in SKILL_DEMAND_TRENDS.items():
        if "rising" in data["trend"]:
            emerging.append(skill)
    return sorted(emerging, key=lambda s: SKILL_DEMAND_TRENDS[s]["2026"], reverse=True)

def get_declining_skills() -> List[str]:
    """Return list of declining skills."""
    declining = []
    for skill, data in SKILL_DEMAND_TRENDS.items():
        if "declining" in data["trend"]:
            declining.append(skill)
    return declining

def calculate_skill_future_value(candidate_skills: List[Dict[str, Any]]) -> Tuple[float, List[str]]:
    """
    Calculate future value of candidate's skillset based on demand forecasting.
    Returns (future_value_score, emerging_skills_found)
    """
    future_value = 0.0
    emerging_skills_match = []
    
    for skill_obj in candidate_skills:
        skill_name = skill_obj.get("skill_name", "").lower()
        
        forecast = forecast_skill_demand(skill_name)
        demand_2026 = forecast.get("forecast_2026", 50)
        trend = forecast.get("trend", "")
        
        # Bonus points for having emerging skills
        if "rising" in trend:
            if "very_fast" in trend:
                future_value += 15.0  # Highest bonus for very fast rising
                emerging_skills_match.append(skill_name)
            elif "fast" in trend:
                future_value += 10.0
                emerging_skills_match.append(skill_name)
            else:
                future_value += 5.0
        
        # Scale by demand score
        future_value += (demand_2026 / 100.0) * 3.0
    
    future_value_score = min(100.0, max(0.0, future_value))
    return future_value_score, emerging_skills_match

# Bias Detection: Flags for underrepresented characteristics
UNDERREPRESENTED_INDICATORS = {
    "gender_diversity": ["she", "her", "ms.", "mrs."],
    "age_diversity": ["recent graduate", "fresh", "junior", "internship"],
    "experience_diversity": ["bootcamp", "self-taught", "transition", "career change"],
    "geographic_diversity": ["remote", "relocation", "visa"],
}

def detect_potential_bias(candidate_data: Dict[str, Any], job_data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Detect potential biases in candidate evaluation that could disadvantage certain groups.
    Returns warnings/flags for recruiter awareness.
    """
    flags = {
        "potential_age_bias": False,
        "potential_gender_bias": False,
        "potential_geographic_bias": False,
        "potential_experience_bias": False,
        "risk_factors": []
    }
    
    candidate_text = (
        candidate_data.get("raw_text", "") +
        candidate_data.get("resume_summary", "")
    ).lower()
    
    # Check for potential age bias (e.g., excessive emphasis on recent experience, trendy skills only)
    experiences = candidate_data.get("experiences", [])
    if experiences:
        avg_tenure = sum(exp.get("duration_years", 0) for exp in experiences) / len(experiences)
        if avg_tenure > 5 and len(experiences) > 3:
            # Mature career with multiple roles - ensure we're not age-biasing against senior candidates
            pass
    
    # Check for gender bias indicators in resume
    gender_indicators = sum(1 for indicator in UNDERREPRESENTED_INDICATORS["gender_diversity"] 
                           if indicator in candidate_text)
    if gender_indicators > 0:
        flags["potential_gender_bias"] = True
        flags["risk_factors"].append("Resume may indicate gender - ensure evaluation is merit-based")
    
    # Check for geographic/visa needs
    if any(term in candidate_text for term in ["visa", "sponsorship", "relocation"]):
        flags["potential_geographic_bias"] = True
        flags["risk_factors"].append("Geographic/visa considerations present - apply same standards to all candidates")
    
    # Check for career transition/non-traditional background
    if any(term in candidate_text for term in ["bootcamp", "self-taught", "transition", "career change"]):
        flags["potential_experience_bias"] = True
        flags["risk_factors"].append("Non-traditional background detected - evaluate skills equally with traditional paths")
    
    # Check job description for biased language
    jd_text = (
        job_data.get("raw_text", "") if isinstance(job_data, dict) else ""
    ).lower()
    
    if any(term in jd_text for term in ["ninja", "rockstar", "guru", "cult", "young", "energetic", "fit our culture"]):
        flags["risk_factors"].append("JD contains potentially biased language - review for fairness")
    
    return flags

def calculate_bias_adjusted_score(
    base_score: float,
    candidate_data: Dict[str, Any],
    job_data: Dict[str, Any],
    bias_weight: float = 0.05
) -> Tuple[float, Dict[str, Any]]:
    """
    Calculate bias-adjusted score with transparency about flags.
    Returns adjusted_score and bias_report.
    """
    bias_report = detect_potential_bias(candidate_data, job_data)
    
    # Don't penalize candidates; just flag for recruiter review
    adjusted_score = base_score
    
    # Ensure we're not systematically undercounting certain groups
    # (This is informational - actual scoring doesn't change)
    
    return adjusted_score, bias_report
