const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../app/admin/contributions/page.tsx');

console.log('🧹 Cleaning up file end...');

try {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Split into lines
  const lines = content.split('\n');
  
  // Find the last proper closing structure
  let lastValidIndex = -1;
  for (let i = lines.length - 1; i >= 0; i--) {
    const line = lines[i].trim();
    if (line === '}') {
      lastValidIndex = i;
      break;
    }
  }
  
  if (lastValidIndex === -1) {
    console.log('❌ Could not find proper closing structure');
    return;
  }
  
  // Remove everything after the last valid closing brace
  const cleanedLines = lines.slice(0, lastValidIndex + 1);
  
  // Write back the cleaned content
  fs.writeFileSync(filePath, cleanedLines.join('\n'), 'utf8');
  
  console.log('✅ File end cleaned successfully!');
  console.log(`📝 Removed ${lines.length - cleanedLines.length} duplicate lines`);
  
} catch (error) {
  console.error('❌ Error cleaning file end:', error.message);
  process.exit(1);
} 