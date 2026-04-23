from nltk.tokenize import sent_tokenize
import nltk

nltk.download('punkt')

def split_clauses(text):
    return sent_tokenize(text)