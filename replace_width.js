import fs from 'fs';
import path from 'path';

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else {
      if(file.endsWith('.astro')) results.push(file);
    }
  });
  return results;
}

const files = walk('./src');
files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let newContent = content
    // Standard section containers
    .replace(/container mx-auto px-[a-zA-Z0-9\-]* sm:px-[a-zA-Z0-9\-]* max-w-[a-zA-Z0-9\-]*/g, 'w-[95%] mx-auto')
    .replace(/container mx-auto px-[a-zA-Z0-9\-]* max-w-[a-zA-Z0-9\-]*/g, 'w-[95%] mx-auto')
    
    // Navbar flex containers
    .replace(/container mx-auto px-[a-zA-Z0-9\-]* flex/g, 'w-[95%] mx-auto flex')
    .replace(/container mx-auto px-[a-zA-Z0-9\-]* py-[a-zA-Z0-9\-]* flex/g, 'w-[95%] mx-auto py-4 flex')
    
    // Testimonials / Process specialized grids
    .replace(/container mx-auto px-[a-zA-Z0-9\-]* sm:px-[a-zA-Z0-9\-]* text-center/g, 'w-[95%] mx-auto text-center')
    
    // Any remaining loose containers
    .replace(/class="container mx-auto /g, 'class="w-[95%] mx-auto ')
    .replace(/class="container mx-auto"/g, 'class="w-[95%] mx-auto"');

  if(content !== newContent) {
    fs.writeFileSync(file, newContent);
    console.log('Updated ' + file);
  }
});
