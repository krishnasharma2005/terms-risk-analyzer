def calculate_score(results):
    weights = {
    "liability": 3,
    "payment": 2,
    "termination": 3,
    "data_sharing": 2,
    "auto_renewal": 2
    }

    count = sum(weights[r["category"]] for r in results)

    if count <= 2:
        return "Low"
    elif count <= 5:
        return "Medium"
    return "High"