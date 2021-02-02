# simple-pug-loader

[![build status](https://img.shields.io/travis/com/Spence-S/simple-pug-loader.svg)](https://travis-ci.com/Spence-S/better-pug-loader)
[![code coverage](https://img.shields.io/codecov/c/github/Spence-S/simple-pug-loader.svg)](https://codecov.io/gh/Spence-S/better-pug-loader)
[![code style](https://img.shields.io/badge/code_style-XO-5ed9c7.svg)](https://github.com/sindresorhus/xo)
[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![made with lass](https://img.shields.io/badge/made_with-lass-95CC28.svg)](https://lass.js.org)
[![license](https://img.shields.io/github/license/Spence-S/simple-pug-loader.svg)](LICENSE)
[![npm downloads](https://img.shields.io/npm/dt/simple-pug-loader.svg)](https://npm.im/better-pug-loader)

> Pug template loader for webpack that's better and more straight forward than the original

## Table of Contents

- [Why Another Pug Loader](#why-another-pug-loader)
- [Install](#install)
- [Usage](#usage)
- [Contributors](#contributors)
- [License](#license)

## Why Another Pug Loader

The defacto loader for compiling pug templates is [`pug-loader`](https://github.com/pugjs/pug-loader).

`simple-pug-loader` does the same thing, only better for many use cases.

#### Problems with pug-loader

Pug loader, while it can work well, has not been well maintained. It suffers from many issues that cause it to not respect normal pug scoping rules and it also handles includes and mixins a bit clunkily. It uses its own - somewhat complicated - way of parsing out includes and mixins and then replaces them with `require` statements in order to get the code loaded into the module correctly. While this works satisfactorily many times, with more complexities in the pug code, you end up running into a lot of unexpected issues when the webpack `require` works completely different from pug `include`. Because of the odd way it requires some of the included pug templates, the templates are "orphaned" in the webpack dependency graph and don't respond correctly using `webpack --watch`, they either don't rebuild at all - or they rebuild the orphaned module and not the parent, so it makes watching untrust worthy. You can see a lot of the same gripes over and over in the [issues](https://github.com/pugjs/pug-loader/issues).

#### What does simple-pug-loader do better?

This loader is just a simple wrapper around pugs `compileClientWithDependenciesTracked` function. We compile directly using pug, then we hand the list of dependencies for the file straight to webpack so it never gets confused on what to build when a file changes. Because it's just pug and no sugar - it's just a lot more predictable.

#### Caveats

We _only_ slightly change pugs algorithm when an `include` is not referencing another pug file but rather a different file type altogether. This is called a `raw include` under the hood. We do this because in some cases, pug doesn't compile to a valid JS function when these files are processed and webpack will throw errors. In the case of raw includes, we make webpack require the raw module independently. If you have not defined a way for webpack to handle the included file-type - an error will be thrown. The file is tracked as a dependency in webpack properly according to whatever rules you have set.

As a consequence of this, locals and variables will not be available in the non-pug include. If you, for instance, include an svg file in your template like `include ../imgs/logo.svg`. You would need to have a block in webpack telling it to handle svgs by adding an [asset type](https://webpack.js.org/guides/asset-modules/) for svg in webpack 5 or using raw or file loader in webpack 4 and below.

#### Personal Needs

While I haven't seen the exact reasons for `pug-loader` forcing webpack requires in the situations it does, I'm sure there are good reasons for it and if you run across cases where this loader doesn't work for you and `pug-loader` does, please file an issue! I will try to prioritize getting anything working for anyone who wants to use a more stable and maintained pug loader.

My use personal use case is that I render many templates both server and client side and I want predictability from both and everything I have tested thus far has benefitted from this simpler approach that I am employing with this plugin.

### Webpack Versions

This loader will work best on Webpack 5 and likely 4 and node 12+. No guarantee for any lesser versions. Please file issues for webpack 4 or 5 problems.

## Install

[npm][]:

```sh
npm install -d simple-pug-loader
```

[yarn][]:

```sh
yarn add -D simple-pug-loader
```

## Usage

In you webpack config.

```js
...,
module: {
  rules: [
    {
      test: /\.pug$/,
      use: [
        {
          loader: 'simple-pug-loader'
        }
      ]
    }
  ]
},
...
```

### Options

The following [options] are available to be set for the loader. They are all mapped directly to Pug options, unless pointed out otherwise. These are all the same as `pug-loader`.

- `doctype`
  - Unlike Pug, it defaults to `"html"` if not set
- `globals`
- `self`
- `plugins`
  - Note that you cannot specify any Pug plugins implementing `read` or `resolve` hooks, as those are reserved for the loader
- `pretty`
- `filters`
- `root`
  - webpack uses its own file resolving mechanism, so while it is functionally equivalent to the Pug option with the same name, it is implemented differently

### Embedded resources

For clarity you should try to use `require` for all your raw includes and embedded resources.

```pug
div
  img(src=require("./my/image.png"))
```

If a non-pug resource is included with `include resource.whatever`, `simple-pug-loader` will change it to a require call under the hood automatically.

## Contributors

| Name               | Website                    |
| ------------------ | -------------------------- |
| **Spencer Snyder** | <https://spencersnyder.io> |

## License

[MIT](LICENSE) © [Spencer Snyder](https://spencersnyder.io)

##

[npm]: https://www.npmjs.com/
[yarn]: https://yarnpkg.com/
