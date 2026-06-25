import os
import sys

# Add backend directory to path so we can import app
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.services.ai_engine import evaluate_candidate

def test_scoring_calculations():
    # 1. Mock Job Description
    jd = {
        "role": "Senior Data Platform Engineer",
        "must_have_skills": ["Python", "Spark", "AWS", "SQL"],
        "nice_to_have_skills": ["Kafka", "Snowflake"],
        "experience_years": 5,
        "seniority": "Senior",
        "leadership": True,
        "domain": "Data Engineering"
    }

    # 2. Mock Candidate A: Stagnant but has skills (e.g. John Doe)
    cand_a = {
        "name": "John Doe",
        "skills": [
            {"skill_name": "Python", "years_used": 6.0, "last_used": 2024},
            {"skill_name": "Spark", "years_used": 5.0, "last_used": 2024},
            {"skill_name": "AWS", "years_used": 5.5, "last_used": 2024},
            {"skill_name": "SQL", "years_used": 7.0, "last_used": 2025}
        ],
        "experiences": [
            {
                "company": "Enterprise DataWorks",
                "role": "Data Engineer",
                "start_date": "2020",
                "end_date": "Present",
                "duration_years": 6.0,
                "description": "Maintain core data warehouse pipelines using Apache Spark and Scala/Python."
            }
        ],
        "projects": [
            {"title": "Spark ETL Pipeline Optimization", "description": "Optimized daily processing of 50TB logs.", "impact_score": 8.0}
        ]
    }

    # 3. Mock Candidate B: Fast growth, high velocity (e.g. Sarah Connor)
    cand_b = {
        "name": "Sarah Connor",
        "skills": [
            {"skill_name": "Python", "years_used": 3.5, "last_used": 2026},
            {"skill_name": "AWS", "years_used": 3.0, "last_used": 2026},
            {"skill_name": "React", "years_used": 4.0, "last_used": 2025},
            {"skill_name": "SQL", "years_used": 4.5, "last_used": 2026},
            {"skill_name": "Docker", "years_used": 2.0, "last_used": 2026}
        ],
        "experiences": [
            {
                "company": "Nexus AI Solutions",
                "role": "Senior Software Engineer & Team Lead",
                "start_date": "2024",
                "end_date": "Present",
                "duration_years": 2.0,
                "description": "Lead developer for healthcare diagnostics. Architected python AWS pipelines."
            },
            {
                "company": "ByteCraft Corp",
                "role": "Software Engineer",
                "start_date": "2022",
                "end_date": "2024",
                "duration_years": 2.0,
                "description": "Developed web applications using React and Node.js."
            }
        ],
        "projects": [
            {"title": "AI Patient Diagnostic Pipeline", "description": "Designed ML pipeline using Python and AWS.", "impact_score": 9.5}
        ]
    }

    # Run evaluations
    scores_a = evaluate_candidate(cand_a, jd)
    scores_b = evaluate_candidate(cand_b, jd)

    print("\n--- Evaluation Results ---")
    print(f"Candidate: {cand_a['name']}")
    print(f"  Overall Score: {scores_a['overall_score']}")
    print(f"  Semantic Fit: {scores_a['semantic_fit']}")
    print(f"  Learning Velocity: {scores_a['learning_velocity']}")
    print(f"  Potential-to-Hire: {scores_a['potential_to_hire']}")
    print(f"  Digital Twin Archetype: {scores_a['digital_twin']['archetype']}")
    
    print(f"\nCandidate: {cand_b['name']}")
    print(f"  Overall Score: {scores_b['overall_score']}")
    print(f"  Semantic Fit: {scores_b['semantic_fit']}")
    print(f"  Learning Velocity: {scores_b['learning_velocity']}")
    print(f"  Potential-to-Hire: {scores_b['potential_to_hire']}")
    print(f"  Digital Twin Archetype: {scores_b['digital_twin']['archetype']}")

    # Verify predictions
    # Sarah Connor should have higher Learning Velocity and Potential-to-Hire
    assert scores_b["learning_velocity"] > scores_a["learning_velocity"], "Sarah should have higher velocity"
    assert scores_b["potential_to_hire"] > scores_a["potential_to_hire"], "Sarah should have higher future potential"
    print("\nScoring verification: SUCCESS!")

if __name__ == "__main__":
    test_scoring_calculations()
