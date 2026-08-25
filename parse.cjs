const fs = require('fs');
const html = fs.readFileSync('C:/Users/TechilyFly/.gemini/antigravity-ide/brain/7369497f-c64e-4241-816c-9e79084e44ba/.system_generated/steps/892/content.md', 'utf-8');

// Also extract names
const nameRegex = /<span[^>]*data-consumer-name-typography=\"true\"[^>]*>(.*?)<\/span>/g;
let names = [];
let m;
while ((m = nameRegex.exec(html)) !== null) {
  names.push(m[1].trim());
}

// Extract reviews
const regex = /<p[^>]*data-service-review-text-typography=\"true\"[^>]*>(.*?)<\/p>/g;
let reviews = [];
while ((m = regex.exec(html)) !== null) {
  reviews.push(m[1].replace(/<[^>]*>?/gm, '').trim()); // Strip internal HTML tags like <br>
}

// Print them out
for (let i = 0; i < Math.min(names.length, reviews.length); i++) {
  console.log(`Name: ${names[i]}\nReview: ${reviews[i]}\n---`);
}
