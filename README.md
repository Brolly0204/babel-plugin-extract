# babel插件编写

> 编写一个模块按需加载的babel插件

当我们导入lodash中指定的工具函数时 会将整个lodash打包进来

```
import {flattenDeep, chunk} from 'lodash'

```

换成按需引入的写法 但是这样写有些麻烦 我们想由上面写法 自动分解为下面写法 所以我们就编写一个babel插件

```
import flattenDeep from 'lodash/flattenDeep'
import chunk from 'lodash/chunk'
```

## Install package

```
npm i babel-core -D
npm i babel-types -D
```

## 插件编写

在当前工程的node_modules下创建一个babel-plugin-extract目录 里面创建index.js

```

const babel = require('babel-core');
const types = require('babel-types');

// 将import {flattenDeep, chunk} from 'lodash' 转化为下面这种写法:
// import flattenDeep from 'lodash/flattenDepp'
// import chunk from 'lodash/chunk'

// Babel将源码转换AST之后，通过遍历AST树（其实就是一个js对象），对树做一些修改，然后再将AST转成code，即成源码。
let visitor = {
    // import 语句解析时触发该函数
    ImportDeclaration(path, ref = {opts: {}}) {  //path 语句抽象语法树 opts 插件参数
        let node = path.node;
        let {specifiers} = node; // 导入的包的说明符 是个数组集合
        // 确认导入库 是否是 .babelrc library属性指定库 以及 如果不是默认导入 才进行按需导入加载
        if (ref.opts.library === node.source.value && !types.isImportDefaultSpecifier(specifiers[0])) {
            let newImports = specifiers.map(specifier => ( // 遍历 出导入的每个包的说明描述符
                types.importDeclaration([types.importDefaultSpecifier(specifier.local)],
                // 生成import语句如 import chunk from 'lodash/chunk'
                types.stringLiteral(`${node.source.value}/${specifier.local.name}`))
            ));

            // 将原有语句写法替换掉 新写法
           path.replaceWithMultiple(newImports);
        }
    }
}

module.exports = function(babel) { // 将插件导出
    return {visitor} // 属性名固定为visitor
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
                "library": "lodash" // 指定处理的库
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
[剖析Babel](http://web.jobbole.com/90993/)
[Babel 插件开发指南](https://github.com/brigand/babel-plugin-handbook/blob/master/translations/zh-Hans/README.md#asts)
[Babel 从零入门](http://web.jobbole.com/91277/)
[Babel plugin](https://babeljs.cn/docs/plugins/)
[AST 抽象语法树在线转换](http://astexplorer.net/)
[babel-types](https://www.npmjs.com/package/babel-types)
