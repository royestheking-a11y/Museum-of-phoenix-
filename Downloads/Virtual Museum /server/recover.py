import json

vars_to_find = {
    'manuscripts': 'const manuscripts = [',
    'categories': 'const categories = [',
    'symbolData': 'const symbolData: Record<string, SE[]> = {',
    'roots': 'const roots: Root[] = [',
    'cipherHistory': 'const cipherHistory = [',
    'mockResults': 'const mockResults = [',
    'symbols': 'const symbols = [',
    'artifacts': 'const artifacts = [',
    'periods': 'const periods = ['
}

found_content = {k: None for k in vars_to_find.keys()}

with open('/Users/mdsunny/.gemini/antigravity-ide/brain/0f77c54e-8d1b-4151-a390-3e71800b4c3f/.system_generated/logs/transcript_full.jsonl') as f:
    for line in f:
        try:
            data = json.loads(line)
            if data.get('type') == 'VIEW_FILE' or data.get('type') == 'RUN_COMMAND':
                content = data.get('content', '')
                if not content: continue
                for k, v in vars_to_find.items():
                    if v in content and not found_content[k]:
                        print(f"Found {k} in step {data.get('step_index')}")
                        found_content[k] = content
        except Exception as e:
            pass

import os
os.makedirs('recovery', exist_ok=True)
for k, content in found_content.items():
    if content:
        with open(f'recovery/{k}.txt', 'w') as f:
            f.write(content)
