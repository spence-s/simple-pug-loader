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

`simple-pug-loader` does the same thing but better for many use cases.

Pug loader, while it can work well, has not been well maintained. It suffers from many issues that cause it to not respect normal pug scoping rules
and it also handles includes and mixins clunkily. It uses its own - somewhat complicated - way of parsing out includes and mixins and then using webpack requires to get the code loaded into the module correctly.
While this works satisfactorily many times, with more complexities in the pug code, you end up running into a lot of weird and unexpected issues with the front end
templates it creates and weird bugs arise from where variables aren't being passed to included templates and mixins properly. Because of the odd way it requires
some instances of pug templates, templates don't respond and rebuild correctly as expected when watching using `webpack --watch`. You can see a lot of the same gripes
over and over in the [issues](https://github.com/pugjs/pug-loader/issues).

This loader is just a simple wrapper around pugs `compileClientWithDependenciesTracked` function. The loader tells webpack
to track any dependencies using pugs own methods of tracking rather than monkey patching it with a custom function/pug plugin like `pug-loader` does. Then we give webpack
the list of dependencies for the file, so it never gets confused on what to build when a file changes.

We only a slight change to pugs algorithm when an `include` is not another pug file, but rather a different file type altogether.
This is called a `raw include` under the hood. In the case of raw includes, we then tell webpack require the raw module independently of pug as a string.
This embeds the raw file right in the pug template as a string as is intended in most cases and the file is tracked as a dependencie properly in webpack.

While I haven't seen the exact reasons for `pug-loader` forcing webpack requires in the situations it does, I'm sure there is one and if you run across cases where this loader doesn't work for you, but `pug-loader` does, please file an issue!

I personally haven't found use cases that do not benefit from the simpler approach I am employing with this plugin yet.

My use personal use case is that I render many templates both server and client side and I want predictability from both.

### Versions
This loader will work best on Webpack 5 and likely 4. No guarantee for any lesser versions. Please file issues for webpack 4 or 5 problems.

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

Try to use `require` for all your embedded resources, to process them with webpack.

```pug
div
  img(src=require("./my/image.png"))
```

Remember, you need to configure loaders for these file types too. You might be interested in the [file loader][file-loader].

If a non-pug resource is included with `include resource.whatever`, `simple-pug-loader` will load it as a raw string automatically.

## Contributors

| Name               | Website                    |
| ------------------ | -------------------------- |
| **Spencer Snyder** | <https://spencersnyder.io> |

## License

[MIT](LICENSE) © [Spencer Snyder](https://spencersnyder.io)

##

[npm]: https://www.npmjs.com/
[yarn]: https://yarnpkg.com/
