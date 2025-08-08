const fs = require('fs');
const path = require('path');

// Read the working file
const filePath = path.join(__dirname, '../app/admin/contributions/page.tsx.working');
let content = fs.readFileSync(filePath, 'utf8');

// Split into lines
const lines = content.split('\n');

console.log('Manually fixing JSX structure...');

// Find the main return statement and ensure proper structure
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
  let divCount = 0;
  let returnLines = [];
  
  for (let i = returnIndex; i < lines.length; i++) {
    const line = lines[i];
    returnLines.push(line);
    
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
  }
  
  console.log(`Div count from return to end: ${divCount}`);
  
  // If there are missing closing divs, add them
  if (divCount > 0) {
    console.log(`Adding ${divCount} missing closing div(s)...`);
    
    // Find the last closing div before the final closing
    let lastClosingDivIndex = -1;
    for (let i = returnLines.length - 1; i >= 0; i--) {
      if (returnLines[i].includes('</div>')) {
        lastClosingDivIndex = i;
        break;
      }
    }
    
    if (lastClosingDivIndex !== -1) {
      // Add missing closing divs
      for (let i = 0; i < divCount; i++) {
        returnLines.splice(lastClosingDivIndex + 1, 0, '        </div>');
      }
      console.log('Added missing closing divs');
    }
  }
  
  // Replace the return section with the fixed version
  const beforeReturn = lines.slice(0, returnIndex);
  const afterReturn = returnLines;
  
  const fixedLines = [...beforeReturn, ...afterReturn];
  const fixedContent = fixedLines.join('\n');
  
  // Write to the main file
  const mainFilePath = path.join(__dirname, '../app/admin/contributions/page.tsx');
  fs.writeFileSync(mainFilePath, fixedContent, 'utf8');
  console.log('File has been updated with fixed JSX structure.');
}

// Verify the fix
console.log('\nVerifying fix...');
const newContent = fs.readFileSync(path.join(__dirname, '../app/admin/contributions/page.tsx'), 'utf8');
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