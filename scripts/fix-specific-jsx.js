const fs = require('fs');
const path = require('path');

// Read the file
const filePath = path.join(__dirname, '../app/admin/contributions/page.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// Get lines around the problematic area
const lines = content.split('\n');
const startLine = Math.max(0, 1240);
const endLine = Math.min(lines.length, 1252);

console.log('Lines around the problematic area:');
for (let i = startLine; i < endLine; i++) {
  console.log(`${i + 1}: ${lines[i]}`);
}

// Check the structure around line 1248
console.log('\nChecking structure...');

// Count divs from the beginning to line 1248
let divCount = 0;
for (let i = 0; i < 1248; i++) {
  const line = lines[i];
  const openingMatches = line.match(/<div/g);
  const closingMatches = line.match(/<\/div>/g);
  
  if (openingMatches) {
    divCount += openingMatches.length;
  }
  if (closingMatches) {
    divCount -= closingMatches.length;
  }
}

console.log(`Div count at line 1248: ${divCount}`);

// Check if there's a missing closing div
if (divCount > 0) {
  console.log('Missing closing div detected. Attempting to fix...');
  
  // Find the last closing div before line 1248
  let lastClosingDivIndex = -1;
  for (let i = 1247; i >= 0; i--) {
    if (lines[i].includes('</div>')) {
      lastClosingDivIndex = i;
      break;
    }
  }
  
  if (lastClosingDivIndex !== -1) {
    // Insert a closing div after the last one
    lines.splice(lastClosingDivIndex + 1, 0, '        </div>');
    console.log('Added missing closing div');
  }
}

// Write the fixed content back
const fixedContent = lines.join('\n');
fs.writeFileSync(filePath, fixedContent, 'utf8');
console.log('File has been updated.'); 