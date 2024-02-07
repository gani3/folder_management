'use strict';

/***********************************************************************************************************************************************
 * MOAR DOTS LOGGER
 ***********************************************************************************************************************************************
 * @description
 */
var chalk = require('chalk');
var q = require('q');

module.exports = function(opts) {

  // Init with default
  opts = opts || {};

  //
  // TYPES
  //------------------------------------------------------------------------------------------//
  // @description
  var types = {};

  types.error = {label: chalk.bold.underline.red('ERROR: ')};
  types.warn = {label: chalk.bold.underline.yellow('WARN: ')};
  types.info = {label: chalk.bold.underline.cyan('NOTICE: ')};
  types.default = {label: chalk.bold.underline.white('LOG: ')};
  types.success = {label: chalk.bold.underline.green('SUCCESS: ')};

  //
  // MODE
  //------------------------------------------------------------------------------------------//
  // @description
  var config = {mode: (opts.mode || 'development')};

  //
  // MODES
  //------------------------------------------------------------------------------------------//
  // @description
  var modes = {};

  // Make these more robust in the future
  modes.development = {types: types, console: true};
  modes.production = {types: types, console: true};
  modes.testing = {types: types, console: false};

  //
  // LOG
  //------------------------------------------------------------------------------------------//
  // @description Responsible for printing type and formating message
  function log(opts) {
    var def = q.defer(),
      message = (modes[config.mode].types[(opts.type || 'default')].label + chalk.gray(log.format(opts.message)));

    if(modes[config.mode].console) { console.log(message); }

    def.resolve(message);

    return def.promise;
  }

  /**
   * Throws a runtime exception
   * @param spec
   */
  log.throw = function(spec) {
    var message = (chalk.bold.underline.red(spec.label) + chalk.yellow(spec.message));
    // Do not understand why the throw is not being output to the console.
    console.log(message);
    // Halt run time.
    throw new Error(message);
  };

  /**
   * Format message based on type
   * @param message
   * @returns {*}
   */
  log.format = function(message) {
    return (log.format[message.constructor] || log.format[String])(message);
  };

  /**
   * String formatter
   * @param message
   * @returns {*}
   */
  log.format[String] = function(message) {
    return message;
  };

  /**
   * Number formatter
   * @param message
   * @returns {*}
   */
  log.format[Number] = function(message) {
    return message;
  };

  /**
   * Boolean formatter
   * @param message
   */
  log.format[Boolean] = function(message) {
    return message;
  };

  /**
   * Array formatter
   * @param message
   */
  log.format[Array] = function(message) {
    var str = '[';

    message.forEach(function(itm) {
      str += (log.format(itm) + '\n');
    });

    str +=']';

    return str;
  };

  /**
   * Object formatter
   * @param message
   * @returns {string}
   */
  log.format[Object] = function(message) {
    var str = '\n {';

    for(var prop in message) {
      str += ('\n \t' +prop + ' : ' + log.format(message[prop]) + '\n');
    }

    str += '}';

    return str;
  };

  return {
    config: config,
    log: log,
    throw: log.throw,
    format: log.format
  };
};