'use strict';

/***********************************************************************************************************************************************
 * CREATE
 ***********************************************************************************************************************************************
 * @description Inserts a new document into the db.
 */
var q = require('q');

module.exports = function(Transactions) {
  /**
   * Creates a new record.
   * @param  {[type]} collection [description]
   * @param  {[type]} spec       [description]
   * @return {[type]}            [description]
   */
  function create(collection, spec) {
    var def = q.defer();

    // Validate
    Transactions.validate({type: 'Create', data:spec}).then(function() {
      // Commit to DB.
      collection.insert(spec.record,  function(err, result) {
        if(err) {
          err = Transactions.Messages.Create.error(err);

          Transactions.Logger.log({type: 'error', message: err}).then(function() {
            def.reject(err);
          });
        } else {
          Transactions.Logger.log({type: 'success', message: Transactions.Messages.Create.success(Transactions.Logger.log.format(result))}).then(function() {
            def.resolve(result);
          });
        }
      });
    }, function(errs) {
      Transactions.Messages.All.Validation.error('CREATE', errs).then(function(message) {
        def.reject(message);
      });
    });

    return def.promise;
  }

  return create;
};