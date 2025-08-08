const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../app/admin/contributions/page.tsx');

console.log('🔧 Fixing JSX errors in admin contributions page...');

try {
  // Read the file
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Split into lines
  const lines = content.split('\n');
  
  console.log(`📄 File has ${lines.length} lines`);
  
  // Check the problematic area (lines 1245-1255)
  console.log('\n🔍 Checking lines 1245-1255:');
  for (let i = 1244; i < Math.min(1255, lines.length); i++) {
    console.log(`${i + 1}: ${lines[i]}`);
  }
  
  // Look for any unclosed divs or parentheses
  let openDivs = 0;
  let openParens = 0;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const divMatches = line.match(/<div/g);
    const closeDivMatches = line.match(/<\/div/g);
    const openParenMatches = line.match(/\(/g);
    const closeParenMatches = line.match(/\)/g);
    
    if (divMatches) openDivs += divMatches.length;
    if (closeDivMatches) openDivs -= closeDivMatches.length;
    if (openParenMatches) openParens += openParenMatches.length;
    if (closeParenMatches) openParens -= closeParenMatches.length;
    
    // Check for potential issues around line 1248-1251
    if (i >= 1247 && i <= 1250) {
      if (openDivs < 0) {
        console.log(`⚠️  Line ${i + 1}: Too many closing divs`);
      }
      if (openParens < 0) {
        console.log(`⚠️  Line ${i + 1}: Too many closing parentheses`);
      }
    }
  }
  
  console.log(`\n📊 Final count: ${openDivs} unclosed divs, ${openParens} unclosed parentheses`);
  
  if (openDivs === 0 && openParens === 0) {
    console.log('✅ JSX structure appears balanced');
  } else {
    console.log('❌ JSX structure has issues');
  }
  
  // Check for any loose "div" text
  const looseDivPattern = /\bdiv\b(?!.*[<>])/g;
  const looseDivMatches = content.match(looseDivPattern);
  
  if (looseDivMatches) {
    console.log('⚠️  Found loose "div" text:', looseDivMatches);
  }
  
  // Check for any syntax issues around the end
  const lastLines = lines.slice(-10);
  console.log('\n🔍 Last 10 lines:');
  lastLines.forEach((line, index) => {
    console.log(`${lines.length - 10 + index + 1}: ${line}`);
  });
  
  console.log('\n✅ Analysis complete. If issues found, manual correction may be needed.');
  
} catch (error) {
  console.error('❌ Error analyzing file:', error.message);
} 