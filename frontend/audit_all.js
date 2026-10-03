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
console.log(`Found ${files.length} files in ${srcDir}`);

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
        // Check all referenced identifiers in JSX and expressions
        programPath.traverse({
          JSXIdentifier(jsxIdPath) {
            const name = jsxIdPath.node.name;
            // Check if it starts with capital letter (React component)
            if (/^[A-Z]/.test(name)) {
              if (!programPath.scope.hasBinding(name) && !['React', 'Fragment', 'Suspense'].includes(name)) {
                console.error(`ERROR in ${file}: Undefined JSX Component "${name}"`);
                totalErrors++;
              }
            }
          },
          Identifier(idPath) {
            // Check if used as variable/expression (not property key, not param declaration)
            const parent = idPath.parent;
            if (
              idPath.isReferencedIdentifier() &&
              !['window', 'document', 'console', 'setTimeout', 'clearTimeout', 'setInterval', 'clearInterval', 'Math', 'Date', 'JSON', 'Object', 'Array', 'String', 'Number', 'Boolean', 'Promise', 'Set', 'Map', 'Error', 'parseInt', 'parseFloat', 'encodeURIComponent', 'decodeURIComponent', 'localStorage', 'sessionStorage', 'fetch', 'alert', 'confirm', 'prompt', 'process', 'Intl'].includes(idPath.node.name)
            ) {
              const name = idPath.node.name;
              if (!idPath.scope.hasBinding(name)) {
                console.error(`ERROR in ${file}: Undefined Identifier "${name}" at line ${idPath.node.loc?.start?.line}`);
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

console.log(`\nAudit complete: ${totalErrors} errors found.`);
process.exit(totalErrors > 0 ? 1 : 0);
