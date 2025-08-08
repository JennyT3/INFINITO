const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../app/admin/contributions/page.tsx');

console.log('🔧 Fixing JSX main tag issue...');

try {
  // Read the file
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Split into lines
  const lines = content.split('\n');
  
  console.log(`📄 File has ${lines.length} lines`);
  
  // Find the problematic </main> tag (around line 1021)
  let mainCloseIndex = -1;
  for (let i = 1020; i < 1025; i++) {
    if (lines[i] && lines[i].includes('</main>')) {
      mainCloseIndex = i;
      console.log(`📍 Found </main> at line ${i + 1}: ${lines[i]}`);
      break;
    }
  }
  
  if (mainCloseIndex === -1) {
    console.log('❌ Could not find </main> tag around line 1021');
    return;
  }
  
  // Remove the </main> tag from its current position
  lines.splice(mainCloseIndex, 1);
  console.log(`🗑️  Removed </main> from line ${mainCloseIndex + 1}`);
  
  // Find the correct position to add </main> (before the final closing divs)
  let insertIndex = -1;
  for (let i = lines.length - 10; i < lines.length; i++) {
    if (lines[i] && lines[i].includes('</div>') && lines[i + 1] && lines[i + 1].includes('</div>')) {
      insertIndex = i;
      break;
    }
  }
  
  if (insertIndex === -1) {
    // If not found, add before the last closing div
    insertIndex = lines.length - 3;
  }
  
  // Insert </main> at the correct position
  lines.splice(insertIndex, 0, '        </main>');
  console.log(`✅ Added </main> at line ${insertIndex + 1}`);
  
  // Write the corrected content back
  const correctedContent = lines.join('\n');
  fs.writeFileSync(filePath, correctedContent, 'utf8');
  
  console.log('✅ JSX main tag issue fixed!');
  
  // Verify the fix
  console.log('\n🔍 Verifying the fix...');
  const verifyContent = fs.readFileSync(filePath, 'utf8');
  const verifyLines = verifyContent.split('\n');
  
  let mainOpenCount = 0;
  let mainCloseCount = 0;
  
  for (let i = 0; i < verifyLines.length; i++) {
    const line = verifyLines[i];
    if (line.includes('<main')) mainOpenCount++;
    if (line.includes('</main>')) mainCloseCount++;
  }
  
  console.log(`📊 Main tags: ${mainOpenCount} opening, ${mainCloseCount} closing`);
  
  if (mainOpenCount === mainCloseCount) {
    console.log('✅ Main tags are balanced!');
  } else {
    console.log('❌ Main tags are not balanced!');
  }
  
} catch (error) {
  console.error('❌ Error fixing JSX:', error.message);
} 