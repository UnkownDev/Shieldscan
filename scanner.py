# backend/scanner.py
import re

def scan_code(code):
    issues = []

    if re.search(r'AKIA[0-9A-Z]{16}', code):
        issues.append({
            "type": "AWS Access Key",
            "severity": "critical",
            "message": "Hardcoded AWS key detected – rotate immediately"
        })

    if re.search(r'AIza[0-9A-Za-z\\-_]{35}', code):
        issues.append({
            "type": "Google API Key",
            "severity": "high",
            "message": "Exposed Google Cloud API key"
        })

    if re.search(r"'.*\b(OR|AND)\s+1\s*[=<>]", code, re.IGNORECASE):
        issues.append({
            "type": "SQL Injection",
            "severity": "high",
            "message": "Suspicious SQLi payload"
        })

    if re.search(r'<script[^>]*>.*</script>', code, re.IGNORECASE):
        issues.append({
            "type": "XSS",
            "severity": "medium",
            "message": "Potential cross-site scripting (XSS)"
        })

    return issues