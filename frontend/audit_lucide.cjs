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
let missingImportsCount = 0;

files.forEach(file => {
  const code = fs.readFileSync(file, 'utf-8');
  try {
    const ast = babel.parse(code, {
      sourceType: 'module',
      plugins: ['jsx', 'typescript']
    });

    const importedLucideIcons = new Set();
    const allImportedNames = new Set();

    traverse(ast, {
      ImportDeclaration(importPath) {
        const source = importPath.node.source.value;
        importPath.node.specifiers.forEach(spec => {
          allImportedNames.add(spec.local.name);
          if (source === 'lucide-react') {
            importedLucideIcons.add(spec.local.name);
          }
        });
      }
    });

    // Known common Lucide icons pattern: PascalCase with typical icon suffixes
    traverse(ast, {
      JSXIdentifier(jsxPath) {
        const name = jsxPath.node.name;
        // If it looks like a component and is not locally declared or imported
        if (/^[A-Z][a-zA-Z0-9]+$/.test(name)) {
          const binding = jsxPath.scope.getBinding(name);
          if (!binding && !['React', 'Fragment', 'Suspense'].includes(name)) {
            // Check if it's member expression like Context.Provider
            if (jsxPath.parent.type !== 'JSXMemberExpression') {
              console.error(`❌ MISSING COMPONENT / ICON in ${path.relative(__dirname, file)}: <${name}> (Line ${jsxPath.node.loc?.start?.line})`);
              missingImportsCount++;
            }
          }
        }
      },
      Identifier(idPath) {
        if (idPath.isReferencedIdentifier()) {
          const name = idPath.node.name;
          // Ignore built-ins
          const builtins = new Set([
            'React', 'window', 'document', 'console', 'setTimeout', 'clearTimeout', 
            'setInterval', 'clearInterval', 'Math', 'Date', 'JSON', 'Object', 'Array', 
            'String', 'Number', 'Boolean', 'Promise', 'Set', 'Map', 'Error', 'parseInt', 
            'parseFloat', 'encodeURIComponent', 'decodeURIComponent', 'encodeURI', 'decodeURI',
            'localStorage', 'sessionStorage', 'fetch', 'alert', 'confirm', 'prompt', 'process', 'Intl',
            'undefined', 'NaN', 'Infinity', 'eval', 'isNaN', 'isFinite',
            'FormData', 'URLSearchParams', 'FileReader', 'navigator', 'Blob', 'URL', 'Image', 'Audio',
            'Event', 'CustomEvent', 'MutationObserver', 'IntersectionObserver', 'ResizeObserver'
          ]);
          if (!builtins.has(name) && !idPath.scope.getBinding(name)) {
            // Check if it's not a property access like obj.prop
            const parent = idPath.parent;
            if (parent.type === 'MemberExpression' && parent.property === idPath.node && !parent.computed) {
              return;
            }
            if (parent.type === 'ObjectProperty' && parent.key === idPath.node && !parent.computed) {
              return;
            }
            console.error(`❌ UNDEFINED VARIABLE/ICON in ${path.relative(__dirname, file)}: ${name} (Line ${idPath.node.loc?.start?.line})`);
            missingImportsCount++;
          }
        }
      }
    });
  } catch (err) {
    console.error(`Parse error in ${file}:`, err.message);
  }
});

console.log(`\n========================================`);
if (missingImportsCount === 0) {
  console.log(`🎉 PERFECT! 0 missing imports or undefined references found across all ${files.length} files.`);
} else {
  console.log(`⚠️ Total missing references: ${missingImportsCount}`);
}
console.log(`========================================\n`);

process.exit(missingImportsCount > 0 ? 1 : 0);
