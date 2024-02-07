'use strict';

/***********************************************************************************************************************************************
 * TRANSACTIONS
 ***********************************************************************************************************************************************
 * @description Transaction wrapper/entry.
 */
var q = require('q');

module.exports = function(Archives) {
  var Transactions = {Logger: Archives.Logger};
  //
  // TRANSACTION MESSAGES
  //------------------------------------------------------------------------------------------//
  // @description Map for return states.
  Transactions.Messages = {
    Create: {
      success: function(rec) { return'The Archives were able to create the requested record: '+ rec},
      error: function(err) { return 'The Archives were able to create the requested record: '+ err},
      ERR_NO_DATA: 'No data provided.'
    },
    Read: {
      success: function(rec) { return 'The Archives were able to locate the requested record: ' + rec},
      error: function(err) {return 'The Archives were unable to complete the query: '+ err},
      ERR_NO_QUERY: 'No query provided.'
    },
    Update: {
      success: function(rec) { return 'The Archives were able to update the requested record: ' + rec},
      error: function(err) { return 'The Archives were unable to update the requested archive: '+ err},
      ERR_NO_RECORD: 'No data provided.',
      ERR_RECORD_NOT_FOUND: 'Could not locate record to update.',
      ERR_NO_DATA: 'No data provided.'
    },
    Delete: {
      success: function(rec) { return 'The Archives were able to remove the requested archive: '+  rec},
      error: function(err) { return 'The Archives were unable to remove the requested archive: '+ err},
      ERR_NO_RECORD: 'No data provided.',
      ERR_RECORD_NOT_FOUND: 'Could not locate record to update.'
    },
    All: {
      Validation: {
        error: function(type, errs) { return Transactions.Logger.log({type: 'archives.error',
          message: 'Transaction validation failed on: '+ type +' with: '+ Transactions.Logger.log.format(errs)})}
      }
    }
  };

  //
  // ARCHIVE TRANSACTION VALIDATORS
  //------------------------------------------------------------------------------------------//
  // @description
  Transactions.Validators = {
    Create: {
      record: Transactions.Messages.Create.ERR_NO_DATA
    },
    Read: {
      query: Transactions.Messages.Read.ERR_NO_QUERY
    },
    Update: {
      record: Transactions.Messages.Update.ERR_NO_RECORD,
      data: Transactions.Messages.Update.ERR_NO_DATA
    },
    Delete: {
      record: Transactions.Messages.Delete.ERR_NO_RECORD
    }
  };

  /**
   * Validates a transaction request
   * @param spec
   */
  Transactions.validate = function(spec) {
    var def = q.defer(),
      failed = {},
      strategy = Transactions.Validators[spec.type];

    for(var validator in strategy) {
      if(!spec.data[validator])  {
        failed[validator] = strategy[validator];
      }
    }

    if(Object.keys(failed).length) {
      def.reject(failed);
    } else {
      def.resolve();
    }

    return def.promise;
  };

  /**
   * TRANSACTION API
   */
  Transactions.find = require('./find')(Transactions);
  Transactions.create = require('./create')(Transactions);
  Transactions.update = require('./update')(Transactions);
  Transactions.delete = require('./delete')(Transactions);

  return Transactions;
};