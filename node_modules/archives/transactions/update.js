'use strict';

/***********************************************************************************************************************************************
 * UPDATE
 ***********************************************************************************************************************************************
 * @description updates a record within the db.
 */
var q = require('q');

module.exports = function(Transactions) {
  /**
   * Updates a record within the archive
   * @param  {[type]} collection [description]
   * @param  {[type]} spec       [description]
   * @return {[type]}            [description]
   */
  function update(collection, spec) {
    var def = q.defer();

    Transactions.validate({type:'Update', data: spec}).then(function() {
      collection.update(spec.record, {$set: spec.data}, {w:1}, function(err, concern) {
        if(err && !concern) {
          err = Transactions.Messages.Create.error(err);

          Transactions.Logger.log({type: 'error', message: err}).then(function() {
            def.reject(err);
          });
        } else {
          Transactions.Logger.log({type: 'success', message: Transactions.Messages.Update.success(Transactions.Logger.log.format(spec.data))}).then(function() {
            Transactions.find(collection, {query: spec.data}).then(function(data) {
              def.resolve(data);
            }, function(err) {
              def.reject(err);
            });
          });
        }
      });
    }, function(errs) {
      Transactions.Messages.All.Validation.error('UPDATE', errs).then(function(message) {
        def.reject(message);
      });
    });

    return def.promise;
  }

  return update;
};