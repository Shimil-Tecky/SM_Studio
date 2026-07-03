const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      if (!file.includes('node_modules') && !file.includes('.git') && !file.includes('dist')) {
        results = results.concat(walk(file));
      }
    } else {
      if (file.endsWith('.jsx') || file.endsWith('.js') || file.endsWith('.css') || file.endsWith('.html')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walk('.');
const patterns = [/order/i, /item/i, /cart/i, /checkout/i, /price/i];

files.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  const lines = content.split('\n');
  lines.forEach((line, idx) => {
    patterns.forEach(pat => {
      // Exclude things like border, items mapping in array if they match align-items, etc.
      // But let's print matches that look relevant.
      if (pat.test(line)) {
        // Exclude common false positives
        if (line.includes('borderRadius') || line.includes('borderBottom') || line.includes('border-') || line.includes('alignItems') || line.includes('justifyContent')) {
          return;
        }
        console.log(`${file}:${idx + 1}: [${pat.source}] ${line.trim()}`);
      }
    });
  });
});
