const babel = require('babel-core');
const types = require('babel-types');

let visitor = {
    ImportDeclaration(path, ref = {opts: {}}) {
        let node = path.node;
        let {specifiers} = node;
        if (ref.opts.library === node.source.value && !types.isImportDefaultSpecifier(specifiers[0])) {
            let newImports = specifiers.map(specifier => (
                types.importDeclaration([types.importDefaultSpecifier(specifier.local)], types.stringLiteral(`${node.source.value}/${specifier.local.name}`))
            ));
           path.replaceWithMultiple(newImports);
        }
    }
}

module.exports = function(babel) {
    return {visitor}
};
