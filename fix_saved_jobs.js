const fs = require('fs');

const file = 'src/app/saved-jobs/SavedJobsClient.tsx';

try {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/\\`/g, '`').replace(/\\\$/g, '$');
  fs.writeFileSync(file, content);
  console.log(`Fixed ${file}`);
} catch (err) {
  console.error(`Error fixing ${file}:`, err);
}
