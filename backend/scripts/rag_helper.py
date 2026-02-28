from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

# load corpus
with open("../outputs/rag_corpus.txt", "r", encoding="utf-8") as f:
    corpus = [line.strip() for line in f if len(line.strip()) > 10]

vectorizer = TfidfVectorizer(stop_words="english")
tfidf_matrix = vectorizer.fit_transform(corpus)

def retrieve_context(query, top_k=3):
    query_vec = vectorizer.transform([query])
    similarities = cosine_similarity(query_vec, tfidf_matrix)[0]
    top_indices = similarities.argsort()[-top_k:][::-1]
    return "\n".join([corpus[i] for i in top_indices])
