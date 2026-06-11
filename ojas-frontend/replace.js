const fs = require('fs');
const path = require('path');

const mappings = {
  '#c06080': 'ojas-accent',
  '#1c1917': 'ojas-dark-text',
  '#faf6f0': 'ojas-light-surface',
  '#f4efea': 'ojas-cream-bg',
  '#fdf6ec': 'ojas-warm-card'
};

function processContent(content) {
  let newContent = content;
  for (const [hex, colorName] of Object.entries(mappings)) {
    // 1. Replace tailwind arbitrary values e.g. text-[#c06080] -> text-ojas-accent
    const tailwindRegex = new RegExp('\\\\[' + hex + '\\\\]', 'gi');
    newContent = newContent.replace(tailwindRegex, colorName);

    // 2. Replace raw hex in inline styles, svg fills etc.
    const rawRegex = new RegExp(hex, 'gi');
    newContent = newContent.replace(rawRegex, `var(--${colorName})`);
  }
  return newContent;
}

function walk(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      if (!fullPath.includes('.next') && !fullPath.includes('node_modules') && !fullPath.includes('.git')) {
        walk(fullPath);
      }
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts') || fullPath.endsWith('.css')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      const newContent = processContent(content);
      if (content !== newContent) {
        fs.writeFileSync(fullPath, newContent, 'utf8');
        console.log('Updated: ' + fullPath);
      }
    }
  }
}

walk('c:/Users/sys/Downloads/ojas baby lil/ojas-wellness-app-main/ojas-frontend/app');
