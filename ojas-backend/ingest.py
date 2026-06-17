import json
import os
import chromadb
from google import genai
from dotenv import load_dotenv

def main():
    # Load environment variables
    load_dotenv()
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        print("Error: GEMINI_API_KEY not found in .env")
        return

    # Initialize Gemini client
    client = genai.Client(api_key=api_key)
    embedding_model = "models/gemini-embedding-2"

    # Initialize ChromaDB
    db_path = "./chroma_db"
    collection_name = "ayurveda_knowledge"
    
    print(f"Connecting to ChromaDB at {db_path}...")
    chroma_client = chromadb.PersistentClient(path=db_path)
    
    # Create or get the collection
    collection = chroma_client.get_or_create_collection(name=collection_name)
    
    # Read JSON data
    print("Reading ayurveda_chunks.json...")
    with open("ayurveda_chunks.json", "r", encoding="utf-8") as f:
        data = json.load(f)

    # Process each chunk
    for item in data:
        chunk_id = str(item["id"])
        topic = item["topic"]
        text = item["text"]
        
        print(f"Generating embedding for chunk {chunk_id} (Topic: {topic})...")
        
        # Generate embedding
        response = client.models.embed_content(
            model=embedding_model,
            contents=text
        )
        # Handle the structure returned by GenAI SDK
        embedding = response.embeddings[0].values
        
        # Extract subtopic as topic for simplicity, or just set it
        subtopic = topic
        
        # Add to ChromaDB
        collection.upsert(
            ids=[chunk_id],
            embeddings=[embedding],
            documents=[text],
            metadatas=[{"topic": topic, "subtopic": subtopic, "source": topic}]
        )
        print(f"Successfully added chunk {chunk_id} to ChromaDB.")

    print("\nIngestion complete! Your ChromaDB is ready.")

if __name__ == "__main__":
    main()
