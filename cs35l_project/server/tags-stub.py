#!/usr/bin/env python3


import sys
import json

def generate_tags_stub(title, text):
    return {"tags": ["this", "is", "a", "test", "double"]}

if __name__ == "__main__":
    try:
        input_data = json.loads(sys.stdin.read())
        title = input_data.get("title", "")
        text = input_data.get("text", "")
        
        result = generate_tags_stub(title, text)
        print(json.dumps(result))
        
    except json.JSONDecodeError:
        print(json.dumps({"error": "Invalid JSON input"}))
        sys.exit(1)
    except Exception as e:
        print(json.dumps({"error": str(e)}))
        sys.exit(1)
