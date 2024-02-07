'use strict';

/***********************************************************************************************************************************************
 * FIND
 ***********************************************************************************************************************************************
 * @description Document look-up
 */
var q = require('q');

module.exports = function(Transactions) {
  /**
   * Returns the result of a query
   * @param  {[type]} collection [description]
   * @param  {[type]} spec       [description]
   * @return {[type]}            [description]
   */
  function find(collection, spec) {
    var def = q.defer();

    // Validate transaction data
    Transactions.validate({type: 'Read', data:spec}).then(function() {

      // Location records
      collection.find(spec.query).toArray(function(err, items) {
        if(err) {
          err = Transactions.Messages.Read.error(err);

          Transactions.Logger.log({type: 'error', message: err}).then(function() {
            def.reject(err);
          });
        } else {
          Transactions.Logger.log({type: 'success', message: Transactions.Messages.Read.success(Transactions.Logger.log.format(items))}).then(function() {
            def.resolve(items);
          });
        }
      });
    }, function(errs) {
      Transactions.Messages.All.Validation.error('FIND', errs).then(function(message) {
        def.reject(message);
      });
    });

    return def.promise;
  }

  return find;
};