import json

with open("data/keywords.json") as f:
    data = json.load(f)

def detect_risks(clauses):
    results = []

    for clause in clauses:
        clause_lower = clause.lower()

        for category, info in data.items():
            keywords = info["keywords"]

            for word in keywords:
                if word in clause_lower:
                    results.append({
                        "clause": clause,
                        "category": category,
                        "explanation": info["explanation"],
                        "severity": info["severity"]
                    })
                    break

    return results