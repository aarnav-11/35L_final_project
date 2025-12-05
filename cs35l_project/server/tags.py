
#!/usr/bin/env python3

from google import genai
import os
import dotenv
import sys
import json
# The client gets the API key from the environment variable `GEMINI_API_KEY`.
dotenv.load_dotenv()
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")

def generate_tags(title, text):
    try:
        client = genai.Client(api_key=GEMINI_API_KEY)
        response = client.models.generate_content(
            model="gemini-2.5-flash", contents=f"Generate 3-5 relevant tags for this note: {title} {text}. Return only a comma-separated array of tags."
        )
        
        # Parse the response text into an array of tags
        tags_text = response.text.strip()
        tags = [tag.strip() for tag in tags_text.split(',') if tag.strip()]
        
        return {"tags": tags}
    except Exception as e:
        return {"error": str(e)}

if __name__ == "__main__":
    # Read input from stdin (JSON format)
    try:
        input_data = json.loads(sys.stdin.read())
        title = input_data.get("title", "")
        text = input_data.get("text", "")
        
        result = generate_tags(title, text)
        print(json.dumps(result))
        
    except json.JSONDecodeError:
        print(json.dumps({"error": "Invalid JSON input"}))
        sys.exit(1)
    except Exception as e:
        print(json.dumps({"error": str(e)}))
        sys.exit(1)