'use strict';

/***********************************************************************************************************************************************
 * ARCHIVE VALIDATION TESTS
 ***********************************************************************************************************************************************
 * @description
 */


module.exports = function(data) {
  var vows = data.vows;
  var Archives = data.Archives;
  var Data = data.Data;
  var reporter = data.reporter;
  var assert = data.assert;

  vows.describe('ARCHIVES:CREATE:VALIDATION').addBatch({
    'when attempting to insert a record into the database with correct data': {
      topic: function() {
        var self = this;

        Archives.Transactions.validate({type: 'Create', data: {record: Data.User}}).then(function(data) {
          self.callback(null, data)
        });
      },
      'We should have no errors': function(e, data) {
        assert.equal(data, undefined);
      }
    },
    'when attempting to insert a record into the database with incorrect data': {
      topic: function() {
        var self = this;

        Archives.Transactions.validate({type: 'Create', data: {records: null}}).then(function(data) {
          console.log(data, 'wat');
          self.callback(null, data)
        }, function(data) {
          console.log(data, 'err')
          self.callback(null, data)
        });
      },
      'We should have errors': function(e, data) {
        console.log(e, data)
        assert.isDefined(data);
        assert.isNotZero(Object.keys(data).length);
      }
    }
  }).run({reporter: reporter});
};