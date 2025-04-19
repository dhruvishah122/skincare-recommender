from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Allow CORS for all origins (Node will be calling this)

# Load dataset and model
df = pd.read_csv("skinpro.csv")

def get_product_type(name):
    name = name.lower()
    if "serum" in name:
        return "serum"
    elif "mask" in name:
        return "mask"
    elif "moisturizer" in name or "cream" in name:
        return "moisturizer"
    elif "face wash" in name or "cleanser" in name:
        return "face wash"
    elif "toner" in name:
        return "toner"
    elif "sunscreen" in name:
        return "sunscreen"
    else:
        return "other"

df["Product_Type"] = df["Product"].apply(get_product_type)
df['combined_text'] = df['Product_Type'] + " " + df['Skin type'].fillna('') + " " + df['Concern'].fillna('')

model = SentenceTransformer('all-MiniLM-L6-v2')
product_embeddings = model.encode(df['combined_text'].tolist(), convert_to_tensor=True)

def recommend_products(user_query, top_n=10):
    user_embedding = model.encode([user_query], convert_to_tensor=True)
    similarities = cosine_similarity(user_embedding.cpu().numpy(), product_embeddings.cpu().numpy())[0]
    top_indices = similarities.argsort()[-top_n:][::-1]
    recommended = df.iloc[top_indices][['Product', 'Skin type', 'Concern', 'product_url']]
    return recommended.to_dict(orient='records')

@app.route('/recommend', methods=['POST'])
def recommend():
    data = request.json
    user_query = data.get("query", "")
    if not user_query:
        return jsonify({"error": "Query is required"}), 400
    
    recommendations = recommend_products(user_query)
    return jsonify({"recommendations": recommendations})

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=8090)
