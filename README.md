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

`simple-pug-loader` does the same thing, only better and more predictable for most use cases.

#### Problems with pug-loader

`pug-loader`, while it can work well, has not been well maintained. `simple-pug-loader` gets regular updates and strives to behave like the pug loaders behave in browserify and rollup.

`pug-loader` attempts to use webpack file resolutions to handle includes and dependencies from pug, which causes unexpected results at times and causes client side pug templates to behave differently than server side pug templates. `simple-pug-loader` attempts to use pug as much as possible for file resolutions so templates behave the same way on the client side as they do server side.

Because of the above, `pug-loader` does not follow the same scoping and variable rules when using includes so it will have weird side effects where webpack doesn't track all pug dependencies properly or properly pass locals around in complex situations.

You can see a lot of the same gripes over and over again in the pug issues.
[issues](https://github.com/pugjs/pug-loader/issues).

#### Caveats: Raw Includes

We _only_ bypass pugs algorithms when an `include` is not referencing another pug file but rather a different file type altogether.
This is called a `raw include` under the hood. In the case of raw includes, we make webpack require the raw module independently. If you have not defined a way for webpack to handle the included file-type - an error will be thrown.

As a consequence of this, locals and variables will not be available in a non-pug include. If you, for instance, include an svg file in your template like `include ../imgs/logo.svg`. You would need to have a block in webpack telling it to handle svgs by adding an [asset type](https://webpack.js.org/guides/asset-modules/) for svg in webpack 5 or using raw or file loader in webpack 4 and below.

### Webpack Versions

This loader will work best on Webpack 5 and likely 4 and node 12+. No guarantee for any lesser versions. Please file issues for webpack 4 or 5 problems.

## Install

[npm][]:

```sh
npm install simple-pug-loader --save-dev
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
- `root` || `basedir`
  - Unlike `pug-loader`, `simple-pug-loader` uses pug for all file resolution

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
