const fs = require('fs');

const files = [
  'src/app/jobs/[id]/JobDetailClient.tsx',
  'src/app/my-applications/MyApplicationsClient.tsx',
  'src/app/my-jobs/MyJobsClient.tsx',
  'src/app/profile/ProfileRatingClient.tsx'
];

for (const file of files) {
  try {
    let content = fs.readFileSync(file, 'utf8');
    content = content.replace(/\\`/g, '`').replace(/\\\$/g, '$');
    
    if (file === 'src/app/my-jobs/MyJobsClient.tsx') {
      content = content.replace('                      Button>', '                      </Button>');
    }
    
    fs.writeFileSync(file, content);
    console.log(`Fixed ${file}`);
  } catch (err) {
    console.error(`Error fixing ${file}:`, err);
  }
}
