import os
import re

with open("src/app/components/AdminPanel.tsx", "r", encoding="utf8") as f:
    text = f.read()

# Replace the original statCards with empty, because it's already redefined higher up by my previous replacement.
text = re.sub(r"  const statCards = \[\n    \{ label: 'Total Visitors', arabic: 'إجمالي الزوار'[\s\S]*?\}\n  \];\n", "", text)

with open("src/app/components/AdminPanel.tsx", "w", encoding="utf8") as f:
    f.write(text)

print("Done")
