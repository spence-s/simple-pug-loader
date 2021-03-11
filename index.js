const path = require('path');
const loaderUtils = require('loader-utils');
const nodeResolve = require('resolve').sync;
const walk = require('pug-walk');

/*
 * Enusre pug and runtime are from same version
 */
const pugPath = require.resolve('pug');
const pug = require(pugPath);
const runtimePath = nodeResolve('pug-runtime', {
  basedir: path.dirname(pugPath)
});

module.exports = function (source) {
  /*
   * All the cool loaders do it
   */
  if (this.cacheable) this.cacheable(true);

  /*
   * Options and context
   */
  const loaderContext = this;
  const options = loaderUtils.getOptions(this) || {};
  const filename = loaderContext.resourcePath;

  let func;

  source = typeof source === 'string' ? source : source.toString();

  /*
   * The plugin is hooked into right before pug "links" the included files,
   * which means right before it inlines the included file content into the
   * template. Here, we remove raw includes and replace them with
   * "- require("path/to/include.notpug")
   */
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
            node.file.fullPath
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

    /*
     * Compile the pug
     */
    const compilation = pug.compileClientWithDependenciesTracked(
      source,
      pugOptions
    );

    func = compilation.body;

    /*
     * Let webpack know to watch the dependencies
     */
    if (compilation.dependencies && compilation.dependencies.length > 0)
      for (const dep of compilation.dependencies)
        loaderContext.addDependency(dep);
  } catch (error) {
    /*
     * Catch errors if needed
     */
    loaderContext.callback(error);
    return;
  }

  /*
   * Add the runtime dependency
   */
  const requireRuntimeString =
    'var pug = require(' +
    loaderUtils.stringifyRequest(loaderContext, '!' + runtimePath) +
    ');\n\n';

  const compiled =
    requireRuntimeString + func + '\n\nmodule.exports = template';

  /*
   * Return the compiled function to be processes as a JS module now
   */
  loaderContext.callback(null, compiled);
};
