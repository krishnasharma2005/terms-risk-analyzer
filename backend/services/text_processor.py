from backend.nlp.segment import split_clauses
from backend.nlp.detector import detect_risks
from backend.nlp.scorer import calculate_score
from backend.nlp.simplifier import simplify
import re

def clean_text(text):
    # Fix broken words (wi thin → within)
    text = re.sub(r'\b(\w)\s+(\w)\b', r'\1\2', text)
    
    # Remove extra spaces
    text = re.sub(r'\s+', ' ', text)

    return text
def process_text(text):
    clauses = split_clauses(text)
    risks = detect_risks(clauses)

    for r in risks:
        r["simplified"] = simplify(r["clause"])

    summary = generate_summary(risks)
    overall = overall_risk(risks)

    return {
        "risks": risks,
        "summary": summary,
        "overall_risk": overall
    }
def generate_summary(risks):
    summary = {}
    
    for r in risks:
        category = r["category"]
        severity = r["severity"]

        if category not in summary:
            summary[category] = {
                "count": 0,
                "severity": severity
            }

        summary[category]["count"] += 1

    return summary
def overall_risk(risks):
    score = 0

    for r in risks:
        if r["severity"] == "High":
            score += 3
        elif r["severity"] == "Medium":
            score += 2
        else:
            score += 1

    if score <= 3:
        return "Low"
    elif score <= 8:
        return "Medium"
    else:
        return "High"