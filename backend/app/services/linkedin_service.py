"""LinkedIn Integration Service (lightweight, public-profile extraction).

Notes:
- LinkedIn's official API requires OAuth and partner access. This module attempts
  a best-effort public-profile fetch by requesting the LinkedIn public URL and
  extracting common Open Graph metadata. It is a fallback and not a replacement
  for an authenticated LinkedIn API integration.
"""

import re
import requests
from typing import Dict, Any, Optional


def extract_linkedin_username(text: str) -> Optional[str]:
    """Extract LinkedIn username from resume text or URL.

    Accepts URLs like:
      - https://www.linkedin.com/in/username
      - linkedin.com/in/username
      - linkedin.com/pub/username
    """
    if not text:
        return None

    patterns = [
        r"linkedin\.com/in/([a-zA-Z0-9\-_%]+)",
        r"linkedin\.com/pub/([a-zA-Z0-9\-_%]+)",
    ]
    for pattern in patterns:
        m = re.search(pattern, text, re.IGNORECASE)
        if m:
            return m.group(1).strip('/')
    return None


def _extract_meta(html: str, key: str) -> str:
    """Helper to extract content from meta tags using triple-quoted f-strings

    to avoid syntax issues with nested quotes.
    """
    # Pattern targeting property="key" or property='key'
    property_pattern = fr"""<meta[^>]+property=["']{re.escape(key)}["'][^>]+content=["']([^"']+)["']"""
    m = re.search(property_pattern, html, re.IGNORECASE)
    if m:
        return m.group(1).strip()
        
    # Fallback pattern targeting name="key" or name='key'
    name_pattern = fr"""<meta[^>]+name=["']{re.escape(key)}["'][^>]+content=["']([^"']+)["']"""
    m = re.search(name_pattern, html, re.IGNORECASE)
    if m:
        return m.group(1).strip()
        
    return ""


def fetch_linkedin_profile(username: str) -> Dict[str, Any]:
    """Best-effort fetch of public LinkedIn profile metadata.

    Returns a dict with keys like: `username`, `profile_url`, `title`, `description`, `image`.
    This does not use authenticated APIs and may be rate-limited by LinkedIn.
    """
    if not username:
        return {}

    url = f"https://www.linkedin.com/in/{username}"
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0 Safari/537.36"
    }

    try:
        resp = requests.get(url, headers=headers, timeout=6)
        if resp.status_code != 200:
            return {"profile_url": url, "status_code": resp.status_code}

        html = resp.text

        title = _extract_meta(html, "og:title") or _extract_meta(html, "twitter:title")
        description = _extract_meta(html, "og:description") or _extract_meta(html, "twitter:description")
        image = _extract_meta(html, "og:image") or _extract_meta(html, "twitter:image")

        # Very light heuristics for headline/location (if present in title/description)
        headline = title
        summary = description

        return {
            "username": username,
            "profile_url": url,
            "title": title,
            "headline": headline,
            "summary": summary,
            "image": image,
        }
    except Exception as e:
        print(f"Error fetching LinkedIn profile for {username}: {e}")
        return {}