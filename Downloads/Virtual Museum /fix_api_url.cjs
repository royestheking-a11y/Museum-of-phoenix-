const fs = require('fs');
const path = require('path');

function replaceInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  if (content.includes('http://localhost:5005')) {
    const hasBaseUrl = content.includes('API_BASE_URL');
    if (!hasBaseUrl) {
      content = "const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5005';\n" + content;
    }
    
    // Replace 'http://localhost:5005/api...' with `${API_BASE_URL}/api...`
    content = content.replace(/'http:\/\/localhost:5005\/([^']*)'/g, '`${API_BASE_URL}/$1`');
    // Replace `http://localhost:5005${...}` with `${API_BASE_URL}${...}`
    content = content.replace(/`http:\/\/localhost:5005([^`]*)`/g, '`${API_BASE_URL}$1`');
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Fixed', filePath);
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

traverse('./src/app');
