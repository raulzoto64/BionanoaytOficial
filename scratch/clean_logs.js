const fs = require('fs');
const path = require('path');

function walk(dir, callback) {
  fs.readdirSync(dir).forEach( f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ?
      walk(dirPath, callback) : callback(path.join(dir, f));
  });
};

const srcDir = path.join(process.cwd(), 'src');

walk(srcDir, (filePath) => {
  if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    const filteredLines = lines.filter(line => !line.includes('console.log'));
    if (lines.length !== filteredLines.length) {
      fs.writeFileSync(filePath, filteredLines.join('\n'), 'utf8');
      console.log(`Cleaned logs from: ${filePath}`);
    }
  }
});
