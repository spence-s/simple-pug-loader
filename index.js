const path = require('path');
const loaderUtils = require('loader-utils');
const nodeResolve = require('resolve').sync;
const dedent = require('dedent');
const walk = require('pug-walk');

const pugPath = require.resolve('pug');

const runtimePath = nodeResolve('pug-runtime', {
  basedir: path.dirname(pugPath)
});

const rawLoaderPath = nodeResolve('raw-loader', { basedir: __dirname });

const pug = require(pugPath);

module.exports = function (source) {
  // All the cool loaders do it
  if (this.cacheable) this.cacheable(true);

  // Options and context
  const loaderContext = this;
  const options = loaderUtils.getOptions(this) || {};
  const filename = loaderContext.resourcePath;

  let func;

  source = typeof source === 'string' ? source : source.toString();

  const plugin = {
    preLink(ast) {
      return walk(ast, (node, replace) => {
        if (
          node.type === 'RawInclude' &&
          node.file &&
          path.extname(node.file.fullPath) !== '.pug'
        ) {
          const val = `require(${loaderUtils.stringifyRequest(
            loaderContext,
            rawLoaderPath + '?esModule=false!' + node.file.fullPath
          )})`;

          replace({
            type: 'Code',
            val,
            buffer: true,
            mustEscape: false,
            isInline: false,
            line: node.line,
            filename: node.filename
          });
        }
      });
    }
  };

  try {
    const pugOptions = {
      filename,
      doctype: options.doctype || 'html',
      pretty: options.pretty,
      self: options.self,
      compileDebug: loaderContext.debug || false,
      globals: ['require'].concat(options.globals || []),
      name: 'template',
      inlineRuntimeFunctions: false,
      filters: options.filters,
      plugins: [plugin].concat(options.plugins || [])
    };

    // Compile the pug
    const compilation = pug.compileClientWithDependenciesTracked(
      source,
      pugOptions
    );

    func = compilation.body;

    // Let webpack know to watch the dependencies
    if (compilation.dependencies && compilation.dependencies.length > 0)
      compilation.dependencies.forEach((dep) =>
        loaderContext.addDependency(dep)
      );
  } catch (error) {
    // Catch errors if needed
    loaderContext.callback(error);
    return;
  }

  // Add the runtime dependency
  const requireRuntimeString =
    'var pug = require(' +
    loaderUtils.stringifyRequest(loaderContext, '!' + runtimePath) +
    ');\n\n';

  // Return the compiled function to be processes as a JS module now
  loaderContext.callback(
    null,
    dedent`
    ${requireRuntimeString}
    ${func.toString()}
    module.exports = template;
    `
  );
};
