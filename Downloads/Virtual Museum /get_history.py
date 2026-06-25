import json
import sys

files_to_find = [
    "src/app/components/halls/HistoryHall.tsx",
    "src/app/components/halls/QuranHall.tsx",
    "src/app/components/halls/CryptographyHall.tsx",
    "src/app/components/halls/SemanticsHall.tsx",
    "src/app/components/halls/SemioticsHall.tsx",
    "src/app/components/halls/ManuscriptHall.tsx",
    "src/app/components/halls/AILabHall.tsx"
]

results = {}

with open("/Users/mdsunny/.gemini/antigravity-ide/brain/0f77c54e-8d1b-4151-a390-3e71800b4c3f/.system_generated/logs/transcript_full.jsonl", "r") as f:
    for line in f:
        data = json.loads(line)
        if data.get("type") == "VIEW_FILE" and data.get("status") == "DONE":
            content = data.get("content", "")
            for filepath in files_to_find:
                if filepath in content and filepath not in results:
                    results[filepath] = content

for filepath, content in results.items():
    with open(f"original_{filepath.split('/')[-1]}", "w") as out:
        out.write(content)
        print(f"Saved original {filepath}")

