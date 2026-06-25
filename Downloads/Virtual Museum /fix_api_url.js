const fs = require('fs');
const path = require('path');

function replaceInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  if (content.includes('http://localhost:5005')) {
    // We add the API_BASE_URL definition if not already there
    const hasBaseUrl = content.includes('API_BASE_URL');
    if (!hasBaseUrl) {
      content = "const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5005';\n" + content;
    }
    
    // Replace hardcoded URLs
    content = content.replace(/'http:\/\/localhost:5005\/api/g, '`${API_BASE_URL}/api');
    content = content.replace(/`http:\/\/localhost:5005/g, '`${API_BASE_URL}');
    
    // Fix the ending quote for the strings that were changed from '...' to `...`
    // Wait, replacing 'http://localhost:5005/api/research' becomes `${API_BASE_URL}/api/research' which has mismatched quotes!
    // Let's use a regex that catches the ending quote.
    
    fs.writeFileSync(filePath, content, 'utf8');
  }
}

function traverse(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      traverse(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      replaceInFile(fullPath);
    }
  }
}

// traverse('./src/app');
// Actually, I'll do a better regex
