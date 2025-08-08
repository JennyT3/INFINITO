const fs = require('fs');
const path = require('path');

// Read the file
const filePath = path.join(__dirname, '../app/admin/contributions/page.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// Split into lines
const lines = content.split('\n');

console.log('Complete JSX structure analysis...');

// Find the main return statement
let returnIndex = -1;
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('return (') || lines[i].includes('return(')) {
    returnIndex = i;
    break;
  }
}

if (returnIndex === -1) {
  console.log('❌ No return statement found');
  process.exit(1);
}

console.log(`Found return statement at line ${returnIndex + 1}`);

// Analyze the JSX structure from return to end
let divCount = 0;
let jsxStructure = [];
let issues = [];

for (let i = returnIndex; i < lines.length; i++) {
  const line = lines[i];
  const lineNumber = i + 1;
  
  // Count opening divs
  const openingMatches = line.match(/<div/g);
  if (openingMatches) {
    divCount += openingMatches.length;
    console.log(`Line ${lineNumber}: +${openingMatches.length} div(s) opened`);
  }
  
  // Count closing divs
  const closingMatches = line.match(/<\/div>/g);
  if (closingMatches) {
    divCount -= closingMatches.length;
    console.log(`Line ${lineNumber}: -${closingMatches.length} div(s) closed`);
  }
  
  // Check for potential issues
  if (divCount < 0) {
    issues.push(`Line ${lineNumber}: Too many closing divs (count: ${divCount})`);
  }
  
  jsxStructure.push({
    line: lineNumber,
    content: line,
    divCount: divCount
  });
}

console.log(`\nFinal div count: ${divCount}`);
console.log('Issues found:', issues);

// If there are issues, fix them
if (divCount !== 0 || issues.length > 0) {
  console.log('\nFixing JSX structure...');
  
  // Find the last closing div before the final closing
  let lastClosingDivIndex = -1;
  for (let i = lines.length - 1; i >= returnIndex; i--) {
    if (lines[i].includes('</div>')) {
      lastClosingDivIndex = i;
      break;
    }
  }
  
  if (lastClosingDivIndex !== -1 && divCount > 0) {
    console.log(`Adding ${divCount} missing closing div(s) after line ${lastClosingDivIndex + 1}...`);
    
    // Add missing closing divs
    for (let i = 0; i < divCount; i++) {
      lines.splice(lastClosingDivIndex + 1, 0, '        </div>');
    }
  }
  
  // Write the fixed content back
  const fixedContent = lines.join('\n');
  fs.writeFileSync(filePath, fixedContent, 'utf8');
  console.log('✅ File has been updated with fixed JSX structure.');
} else {
  console.log('✅ JSX structure is already balanced!');
}

// Final verification
console.log('\nFinal verification...');
const newContent = fs.readFileSync(filePath, 'utf8');
const newLines = newContent.split('\n');
let finalDivCount = 0;

for (let i = 0; i < newLines.length; i++) {
  const line = newLines[i];
  const openingMatches = line.match(/<div/g);
  const closingMatches = line.match(/<\/div>/g);
  
  if (openingMatches) {
    finalDivCount += openingMatches.length;
  }
  if (closingMatches) {
    finalDivCount -= closingMatches.length;
  }
}

console.log(`Final div count: ${finalDivCount}`);
if (finalDivCount === 0) {
  console.log('✅ JSX structure is now perfectly balanced!');
} else {
  console.log('❌ JSX structure still has issues');
} 