import json

found = {}

with open('/Users/mdsunny/.gemini/antigravity-ide/brain/0f77c54e-8d1b-4151-a390-3e71800b4c3f/.system_generated/logs/transcript_full.jsonl') as f:
    for line in f:
        try:
            data = json.loads(line)
            if data.get('type') == 'PLANNER_RESPONSE':
                for tc in data.get('tool_calls', []):
                    if tc.get('name') in ['multi_replace_file_content', 'replace_file_content']:
                        args = tc.get('args', {})
                        chunks = args.get('ReplacementChunks', [])
                        if not chunks and 'TargetContent' in args:
                            chunks = [args]
                        for chunk in chunks:
                            target = chunk.get('TargetContent', '')
                            if 'const manuscripts =' in target: found['manuscripts'] = target
                            if 'const mockResults =' in target: found['mockResults'] = target
                            if 'const categories =' in target: found['categories'] = target
                            if 'const symbolData' in target: found['symbolData'] = target
                            if 'const roots' in target: found['roots'] = target
                            if 'const cipherHistory =' in target: found['cipherHistory'] = target
                            if 'const symbols =' in target: found['symbols'] = target
        except Exception as e:
            pass

import os
os.makedirs('server/recovery', exist_ok=True)
for k, v in found.items():
    with open(f'server/recovery/{k}.txt', 'w') as f:
        f.write(v)
    print(f"Recovered {k}")
