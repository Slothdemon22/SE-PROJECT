const fs = require('fs');
const path = require('path');

function walkDir(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(walkDir(fullPath));
    } else if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx')) {
      results.push(fullPath);
    }
  }
  return results;
}

const files = walkDir('src');
let fixedCount = 0;

for (const file of files) {
  try {
    let content = fs.readFileSync(file, 'utf8');
    const originalContent = content;
    content = content.replace(/\\`/g, '`').replace(/\\\$/g, '$');
    
    if (content !== originalContent) {
      fs.writeFileSync(file, content);
      console.log(`Fixed ${file}`);
      fixedCount++;
    }
  } catch (err) {
    console.error(`Error fixing ${file}:`, err);
  }
}
console.log(`Fixed ${fixedCount} files total.`);
