def simplify(text):
    replacements = {
        "third parties": "other companies",
        "non-refundable": "no money back",
        "automatically renew": "renew automatically"
    }

    for k, v in replacements.items():
        text = text.replace(k, v)

    return text