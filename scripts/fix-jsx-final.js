const fs = require('fs');
const path = require('path');

// Read the file
const filePath = path.join(__dirname, '../app/admin/contributions/page.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// Split into lines
const lines = content.split('\n');

console.log('Analyzing JSX structure...');

// Count divs throughout the file
let divCount = 0;
let lineCount = 0;
let issues = [];

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  lineCount++;
  
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
    issues.push(`Line ${lineCount}: Too many closing divs (count: ${divCount})`);
  }
}

console.log(`Total lines: ${lineCount}`);
console.log(`Final div count: ${divCount}`);
console.log('Issues found:', issues);

// If there are issues, try to fix them
if (divCount !== 0 || issues.length > 0) {
  console.log('Attempting to fix JSX structure...');
  
  // Find the main return statement
  let returnIndex = -1;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('return (') || lines[i].includes('return(')) {
      returnIndex = i;
      break;
    }
  }
  
  if (returnIndex !== -1) {
    console.log(`Found return statement at line ${returnIndex + 1}`);
    
    // Count divs from return to end
    let returnDivCount = 0;
    for (let i = returnIndex; i < lines.length; i++) {
      const line = lines[i];
      const openingMatches = line.match(/<div/g);
      const closingMatches = line.match(/<\/div>/g);
      
      if (openingMatches) {
        returnDivCount += openingMatches.length;
      }
      if (closingMatches) {
        returnDivCount -= closingMatches.length;
      }
    }
    
    console.log(`Div count from return to end: ${returnDivCount}`);
    
    // If there are missing closing divs, add them before the final closing
    if (returnDivCount > 0) {
      console.log(`Adding ${returnDivCount} missing closing div(s)...`);
      
      // Find the last closing div before the final closing
      let lastClosingDivIndex = -1;
      for (let i = lines.length - 1; i >= 0; i--) {
        if (lines[i].includes('</div>')) {
          lastClosingDivIndex = i;
          break;
        }
      }
      
      if (lastClosingDivIndex !== -1) {
        // Add missing closing divs
        for (let i = 0; i < returnDivCount; i++) {
          lines.splice(lastClosingDivIndex + 1, 0, '        </div>');
        }
        console.log('Added missing closing divs');
      }
    }
  }
}

// Write the fixed content back
const fixedContent = lines.join('\n');
fs.writeFileSync(filePath, fixedContent, 'utf8');
console.log('File has been updated.');

// Verify the fix
console.log('\nVerifying fix...');
const newContent = fs.readFileSync(filePath, 'utf8');
const newLines = newContent.split('\n');
let newDivCount = 0;

for (let i = 0; i < newLines.length; i++) {
  const line = newLines[i];
  const openingMatches = line.match(/<div/g);
  const closingMatches = line.match(/<\/div>/g);
  
  if (openingMatches) {
    newDivCount += openingMatches.length;
  }
  if (closingMatches) {
    newDivCount -= closingMatches.length;
  }
}

console.log(`New div count: ${newDivCount}`);
if (newDivCount === 0) {
  console.log('✅ JSX structure is now balanced!');
} else {
  console.log('❌ JSX structure still has issues');
} 