const fs = require('fs');
const path = require('path');
const babel = require('@babel/parser');
const traverse = require('@babel/traverse').default;

const srcDir = path.join(__dirname, 'src');

function getAllFiles(dir, exts = ['.jsx', '.js']) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getAllFiles(filePath, exts));
    } else {
      if (exts.includes(path.extname(file))) {
        results.push(filePath);
      }
    }
  });
  return results;
}

const files = getAllFiles(srcDir);
console.log(`Scanning ${files.length} source files in ${srcDir} for undefined components and references...\n`);

let totalErrors = 0;

files.forEach(file => {
  const code = fs.readFileSync(file, 'utf-8');
  try {
    const ast = babel.parse(code, {
      sourceType: 'module',
      plugins: ['jsx', 'typescript']
    });

    traverse(ast, {
      Program(programPath) {
        programPath.traverse({
          JSXIdentifier(jsxIdPath) {
            const name = jsxIdPath.node.name;
            if (/^[A-Z]/.test(name)) {
              if (!programPath.scope.hasBinding(name) && !['React', 'Fragment', 'Suspense'].includes(name)) {
                console.error(`[UNDEFINED COMPONENT] ${path.relative(__dirname, file)}: <${name}> at line ${jsxIdPath.node.loc?.start?.line}`);
                totalErrors++;
              }
            }
          }
        });
      }
    });
  } catch (err) {
    console.error(`Parse error in ${file}:`, err.message);
    totalErrors++;
  }
});

if (totalErrors === 0) {
  console.log(`\n✅ ALL ${files.length} FILES VERIFIED! Zero undefined components or missing icon imports.`);
} else {
  console.error(`\n❌ Found ${totalErrors} missing imports/undefined components.`);
}

process.exit(totalErrors > 0 ? 1 : 0);
