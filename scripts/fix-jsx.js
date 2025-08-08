const fs = require('fs');
const path = require('path');

// Read the file
const filePath = path.join(__dirname, '../app/admin/contributions/page.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// Count opening and closing divs
const openingDivs = (content.match(/<div/g) || []).length;
const closingDivs = (content.match(/<\/div>/g) || []).length;

console.log(`Opening divs: ${openingDivs}`);
console.log(`Closing divs: ${closingDivs}`);
console.log(`Difference: ${openingDivs - closingDivs}`);

// Check for unclosed tags
const lines = content.split('\n');
let divCount = 0;
let issues = [];

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  const lineNumber = i + 1;
  
  // Count opening divs
  const openingMatches = line.match(/<div/g);
  if (openingMatches) {
    divCount += openingMatches.length;
  }
  
  // Count closing divs
  const closingMatches = line.match(/<\/div>/g);
  if (closingMatches) {
    divCount -= closingMatches.length;
  }
  
  // Check for potential issues
  if (divCount < 0) {
    issues.push(`Line ${lineNumber}: Too many closing divs`);
  }
}

console.log(`Final div count: ${divCount}`);
console.log('Issues found:', issues);

// If there are issues, try to fix them
if (divCount !== 0 || issues.length > 0) {
  console.log('Attempting to fix JSX structure...');
  
  // Add missing closing div if needed
  if (divCount > 0) {
    // Find the last closing div and add one more
    const lastClosingDivIndex = content.lastIndexOf('</div>');
    if (lastClosingDivIndex !== -1) {
      content = content.slice(0, lastClosingDivIndex + 6) + '\n    </div>\n' + content.slice(lastClosingDivIndex + 6);
    }
  }
  
  // Write the fixed content back
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('File has been updated. Please check the structure.');
} else {
  console.log('No JSX structure issues found.');
} 