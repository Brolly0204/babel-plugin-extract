# babel插件编写

> 编写一个模块按需打包的babel插件

当我们导入lodash中指定的工具函数时 会将整个lodash打包进来

```
import {flattenDeep, chunk} from 'lodash'

```

换成按需引入的写法 但是这样写有些麻烦 我们想由上面写法 自动分解为下面写法 所以我们就编写一个babel插件

```
import flattenDeep from 'lodash/flattenDeep'
import chunk from 'lodash/chunk'
```

##

Install package

```
npm i babel-core -D
npm i babel-types -D
```

## 插件编写

在当前工程的node_modules下创建一个babel-plugin-extract目录 里面创建index.js

```
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

```

## 配置.babelrc

```
{
    "presets": [
        "env",
        "stage-0"
    ],
    "plugins": [
        [
            "extract", // 配置插件
            {
                "library": "lodash" // 指定使用范围
            }
        ]
    ]
}

```

## build

```
npm run build // 此时编译后的bundle.js变小了
```

## 源码地址
先npm install 然后将源码目录中babel-plugin-extract目录 挪到 node_modules下，npm run build
[babel-plugin-extract](https://github.com/Lwenli1224/babel-plugin-extract)




## 参考
[Babel 插件开发指南](https://github.com/brigand/babel-plugin-handbook/blob/master/translations/zh-Hans/README.md#asts)
[Babel 从零入门](http://web.jobbole.com/91277/)
[Babel plugin](https://babeljs.cn/docs/plugins/)
