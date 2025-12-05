#!/usr/bin/env python3

from google.genai import Client
import os, dotenv, sys, json

# load .env
dotenv.load_dotenv()
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")

if not GEMINI_API_KEY:
    print(json.dumps({"error": "GEMINI_API_KEY is missing"}))
    exit(1)

client = Client(api_key=GEMINI_API_KEY)   # <-- NEW CORRECT FORMAT

def generate_tags(title, text):
    try:
        response = client.models.generate_content(
            model="gemini-2.0-flash",  # stable + fast for tagging
            contents=f"Generate 3-5 relevant topic tags for this note: {title}\n{text}. "
                     f"Return ONLY a comma-separated list of tags, nothing else."
        )

        tags_raw = response.text.strip()
        tags = [t.strip() for t in tags_raw.split(",") if t.strip()]
        return {"tags": tags}

    except Exception as e:
        return {"error": str(e)}

if __name__ == "__main__":
    try:
        data = json.loads(sys.stdin.read())
        result = generate_tags(data.get("title",""), data.get("text",""))
        print(json.dumps(result))
    except Exception as e:
        print(json.dumps({"error": str(e)}))
        exit(1)
