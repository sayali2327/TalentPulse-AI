"""GitHub API Integration Service for Candidate Profiling."""

import os
import re
from typing import Dict, Any, Optional
import requests
from datetime import datetime, timedelta

GITHUB_API_BASE = "https://api.github.com"
GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")

def extract_github_username(text: str) -> Optional[str]:
    """Extract GitHub username from resume text or URL."""
    patterns = [
        r'github\.com/([a-zA-Z0-9_-]+)',
        r'@([a-zA-Z0-9_-]+)\s*(?:github|GitHub)',
    ]
    for pattern in patterns:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            return match.group(1)
    return None

def fetch_github_profile(username: str) -> Dict[str, Any]:
    """Fetch GitHub user profile data."""
    if not username:
        return {}
    
    try:
        headers = {}
        if GITHUB_TOKEN:
            headers["Authorization"] = f"token {GITHUB_TOKEN}"
        
        url = f"{GITHUB_API_BASE}/users/{username}"
        response = requests.get(url, headers=headers, timeout=5)
        
        if response.status_code == 200:
            data = response.json()
            return {
                "username": username,
                "public_repos": data.get("public_repos", 0),
                "followers": data.get("followers", 0),
                "following": data.get("following", 0),
                "bio": data.get("bio", ""),
                "company": data.get("company", ""),
                "location": data.get("location", ""),
                "created_at": data.get("created_at", ""),
                "updated_at": data.get("updated_at", ""),
            }
    except Exception as e:
        print(f"Error fetching GitHub profile for {username}: {e}")
    
    return {}

def fetch_github_repos(username: str, limit: int = 10) -> list:
    """Fetch recent repositories for a GitHub user."""
    if not username:
        return []
    
    try:
        headers = {}
        if GITHUB_TOKEN:
            headers["Authorization"] = f"token {GITHUB_TOKEN}"
        
        url = f"{GITHUB_API_BASE}/users/{username}/repos"
        params = {
            "sort": "updated",
            "per_page": limit,
            "type": "owner"
        }
        response = requests.get(url, headers=headers, params=params, timeout=5)
        
        if response.status_code == 200:
            repos = response.json()
            return [
                {
                    "name": repo.get("name", ""),
                    "description": repo.get("description", ""),
                    "language": repo.get("language", ""),
                    "stars": repo.get("stargazers_count", 0),
                    "forks": repo.get("forks_count", 0),
                    "updated_at": repo.get("updated_at", ""),
                    "url": repo.get("html_url", ""),
                }
                for repo in repos
            ]
    except Exception as e:
        print(f"Error fetching repos for {username}: {e}")
    
    return []

def fetch_github_contributions(username: str) -> Dict[str, Any]:
    """Calculate GitHub contribution metrics."""
    if not username:
        return {"contribution_score": 0, "recent_activity": 0}
    
    try:
        headers = {}
        if GITHUB_TOKEN:
            headers["Authorization"] = f"token {GITHUB_TOKEN}"
        
        # Fetch events to measure recent activity
        url = f"{GITHUB_API_BASE}/users/{username}/events/public"
        params = {"per_page": 100}
        response = requests.get(url, headers=headers, params=params, timeout=5)
        
        if response.status_code == 200:
            events = response.json()
            
            # Count events in last 30 days
            now = datetime.utcnow()
            thirty_days_ago = now - timedelta(days=30)
            recent_events = 0
            
            for event in events:
                event_date = datetime.fromisoformat(event["created_at"].replace("Z", "+00:00")).replace(tzinfo=None)
                if event_date > thirty_days_ago:
                    recent_events += 1
            
            # Contribution score: 0-100 based on activity frequency
            contribution_score = min(100, recent_events * 2)
            
            return {
                "contribution_score": contribution_score,
                "recent_activity": recent_events,
                "total_events_fetched": len(events)
            }
    except Exception as e:
        print(f"Error fetching contributions for {username}: {e}")
    
    return {"contribution_score": 0, "recent_activity": 0}

def fetch_github_languages(username: str) -> Dict[str, int]:
    """Aggregate programming languages from user's repositories."""
    if not username:
        return {}
    
    repos = fetch_github_repos(username, limit=30)
    languages = {}
    
    for repo in repos:
        lang = repo.get("language")
        if lang:
            languages[lang] = languages.get(lang, 0) + 1
    
    return languages

def get_github_candidate_signals(username: str) -> Dict[str, Any]:
    """Aggregate all GitHub signals into candidate profile data."""
    profile = fetch_github_profile(username)
    if not profile:
        return {}
    
    repos = fetch_github_repos(username, limit=10)
    contributions = fetch_github_contributions(username)
    languages = fetch_github_languages(username)
    
    # Calculate GitHub engagement score (0-100)
    github_engagement_score = (
        min(profile.get("public_repos", 0) * 2, 30) +  # repos (max 30 points)
        min(profile.get("followers", 0) * 0.5, 25) +    # followers (max 25 points)
        contributions.get("contribution_score", 0) * 0.4 # contributions (max 40 points)
    )
    github_engagement_score = min(100, max(0, github_engagement_score))
    
    return {
        "github_username": username,
        "github_profile": profile,
        "github_repos": repos[:5],  # Top 5 repos
        "github_languages": languages,
        "github_engagement_score": github_engagement_score,
        "github_contribution_score": contributions.get("contribution_score", 0),
        "github_recent_activity": contributions.get("recent_activity", 0),
        "github_public_repos": profile.get("public_repos", 0),
        "github_followers": profile.get("followers", 0),
    }
