<!-- source: https://docs.rollbar.com/docs/importing-or-requiring-rollbar.md -->

# Importing or Requiring Rollbar

**Overview**
JavaScript developers often working with Typescript, a variant of ECMAScript to help make their code more readable, efficient and maintainable. This guide is to help you understand how you can install Rollbar if you were to use either Typescript or ECMAScript (ES5, ES6, ES7, ES8, ES9).

***

# Typescript

Correct import syntax depends on the project tsconfig `compilerOptions.module` value.

## module: ‘commonjs’

For Node.js and for projects that target es5 compiled code, `module: ‘commonjs’` is the default and most common module setting, as it will produce compatible module loading for the target.

Rollbar’s Typescript export uses `export = ` syntax and its import statement should use `import = require()` syntax. Note that this is specific to Typescript and isn’t valid syntax in other environments.

[block:code]
{
  "codes": [
    {
      "code": "import Rollbar = require('rollbar')",
      "language": "typescript"
    }
  ]
}
[/block]

See: \[<https://www.typescriptlang.org/docs/handbook/modules.html#export--and-import--require>] (<https://www.typescriptlang.org/docs/handbook/modules.html#export--and-import--require>)

## module: ‘es2015’ (or ‘es6’, ‘esnext’)

For targets higher than es5, the most common module settings are ‘es2015’, ‘es6’, or ‘esnext’. These won’t allow the above `import = require()` syntax. Instead, use es6 import syntax:

[block:code]
{
  "codes": [
    {
      "code": "import Rollbar from 'rollbar';",
      "language": "typescript"
    }
  ]
}
[/block]

## esModuleInterop

The es6 import syntax requires setting `esModuleInterop` in the tsconfig `compilerOptions`.

See: \[<https://www.typescriptlang.org/tsconfig#esModuleInterop>] (<https://www.typescriptlang.org/tsconfig#esModuleInterop>)

## Namespace import syntax (not recommended)

Namespace import syntax will work in some project configurations and not in others:

[block:code]
{
  "codes": [
    {
      "code": "import * as Rollbar from ‘rollbar’ // not recommended",
      "language": "typescript"
    }
  ]
}
[/block]

For example, this works in Angular through version 8, but will no longer work in Angular 9. This is not a recommended syntax.

***

# ECMAScript

For versions, ES6, ES7, ES8, and ES9 use the following code example to import Rollbar.

[block:code]
{
  "codes": [
    {
      "code": "// ES6, ES7, ES8, ES9\nimport Rollbar from \"rollbar\";",
      "language": "javascript"
    }
  ]
}
[/block]

If you are using ES5, import Rollbar using this sample code snippet.

[block:code]
{
  "codes": [
    {
      "code": "// ES5\nvar Rollbar = require('rollbar');",
      "language": "javascript"
    }
  ]
}
[/block]