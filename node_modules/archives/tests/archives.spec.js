'use strict';

/***********************************************************************************************************************************************
 * PERSISTENCE TESTS
 ***********************************************************************************************************************************************
 * @description
 */

var vows = require('vows');
var assert = require('assert');
var reporter = require('vows/lib/vows/reporters/spec');

var Archives = require('../')({DB: {name: 'test'}});

var Data = {};
Data.User = {name: 'TEST USER', age: 31};

// Module passthroughs.
var needs = {vows:vows, Archives:Archives, Data: Data, reporter: reporter, assert: assert};

Archives.start().then(function() {
  //
  // ARCHIVE VALIDATION TESTS
  //------------------------------------------------------------------------------------------//
  // @description

  //
  // ARCHIVE VALIDATION TESTS
  //------------------------------------------------------------------------------------------//
  // @description
  require('./archives.transactions.spec.js')(needs);
});