const fs = require('fs');
const path = require('path');

const hallsDir = path.join(__dirname, '../src/app/components/halls');
const halls = ['History', 'Quran', 'Cryptography', 'Semiotics', 'Semantics', 'Manuscript', 'AILab'];

let allArtifacts = [];

halls.forEach(hall => {
  const filePath = path.join(hallsDir, `${hall}Hall.tsx`);
  if (!fs.existsSync(filePath)) return;
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Extract the `const artifacts = [...]` block
  const startMatch = content.indexOf('const artifacts = [');
  if (startMatch === -1) return;
  
  let openBrackets = 0;
  let inString = false;
  let stringChar = '';
  let endMatch = -1;
  
  for (let i = startMatch + 18; i < content.length; i++) {
    const char = content[i];
    if (inString) {
      if (char === stringChar && content[i-1] !== '\\') {
        inString = false;
      }
    } else {
      if (char === "'" || char === '"' || char === '`') {
        inString = true;
        stringChar = char;
      } else if (char === '[') {
        openBrackets++;
      } else if (char === ']') {
        openBrackets--;
        if (openBrackets === 0) {
          endMatch = i;
          break;
        }
      }
    }
  }
  
  if (endMatch !== -1) {
    let arrayContent = content.substring(startMatch + 18, endMatch + 1);
    
    // Replace React elements with strings, e.g. <Cloud size="1em" ... /> -> "Cloud"
    arrayContent = arrayContent.replace(/<([A-Za-z0-9]+)[^>]*\/>/g, '"$1"');
    
    // Replace unquoted keys with quoted keys
    arrayContent = arrayContent.replace(/([{,]\s*)([a-zA-Z0-9_]+)\s*:/g, '$1"$2":');
    
    // Replace single quotes with double quotes
    arrayContent = arrayContent.replace(/'/g, '"');
    
    // Fix trailing commas
    arrayContent = arrayContent.replace(/,\s*}/g, '}').replace(/,\s*]/g, ']');

    try {
      // It might not parse cleanly if there are complex expressions, so we can use eval
      // Actually, since we replaced components, eval might work.
      let artifacts = eval('(' + content.substring(startMatch + 18, endMatch + 1).replace(/<([A-Za-z0-9]+)[^>]*\/>/g, '"$1"') + ')');
      
      artifacts.forEach(a => {
        a.hall = hall;
        allArtifacts.push(a);
      });
      console.log(`Extracted ${artifacts.length} artifacts from ${hall}Hall.tsx`);
    } catch (e) {
      console.error(`Error parsing artifacts in ${hall}Hall.tsx`, e);
    }
  }
});

fs.writeFileSync(path.join(__dirname, 'artifacts_data.json'), JSON.stringify(allArtifacts, null, 2));
console.log('Total artifacts extracted:', allArtifacts.length);
