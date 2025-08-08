const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../app/admin/contributions/page.tsx');

console.log('🔧 Fixing JSX structure in admin contributions page...');

try {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Remove the misplaced </main> tag around line 1248
  const lines = content.split('\n');
  const fixedLines = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Skip the problematic </main> tag around line 1248
    if (line.trim() === '</main>' && i > 1240 && i < 1250) {
      console.log(`⚠️  Removing misplaced </main> tag at line ${i + 1}`);
      continue;
    }
    
    // Skip the problematic closing div and parenthesis
    if (line.trim() === '</div>' && i === 1249) {
      console.log(`⚠️  Removing problematic </div> at line ${i + 1}`);
      continue;
    }
    
    if (line.trim() === ');' && i === 1250) {
      console.log(`⚠️  Removing problematic closing parenthesis at line ${i + 1}`);
      continue;
    }
    
    fixedLines.push(line);
  }
  
  // Add proper closing tags at the end
  fixedLines.push('        </main>');
  fixedLines.push('      </div>');
  fixedLines.push('    </div>');
  fixedLines.push('  );');
  fixedLines.push('}');
  
  const fixedContent = fixedLines.join('\n');
  
  // Write the fixed content back
  fs.writeFileSync(filePath, fixedContent, 'utf8');
  
  console.log('✅ JSX structure fixed successfully!');
  console.log('📝 Changes made:');
  console.log('  - Removed misplaced </main> tag');
  console.log('  - Removed problematic </div> and closing parenthesis');
  console.log('  - Added proper closing structure at the end');
  
} catch (error) {
  console.error('❌ Error fixing JSX structure:', error.message);
  process.exit(1);
} 