"use strict";

var _chai = require("chai");

var _utils = require("./utils");

describe('kebabCase', function () {
  it('should convert strings to kebab case', function () {
    (0, _chai.expect)((0, _utils.kebabCase)('')).to.equal('');
    (0, _chai.expect)((0, _utils.kebabCase)('testIdent')).to.equal('test-ident');
    (0, _chai.expect)((0, _utils.kebabCase)('TestIdent')).to.equal('test-ident');
    (0, _chai.expect)((0, _utils.kebabCase)('testIdent123')).to.equal('test-ident123');
    (0, _chai.expect)((0, _utils.kebabCase)('test123Ident')).to.equal('test123-ident');
  });
});
describe('kebabCaseDeep', function () {
  it('should handle complex objects properly', function () {
    (0, _chai.expect)((0, _utils.kebabCaseDeep)({
      keyOne: [{
        subKeyOne: '1',
        subKeyTwo: [2, 4]
      }],
      keyTwo: {
        subKeyThree: [{
          subSubKeyOne: null
        }],
        subKeyFour: ['valOne', 'valueTwo']
      }
    })).to.deep.equal({
      'key-one': [{
        'sub-key-one': '1',
        'sub-key-two': [2, 4]
      }],
      'key-two': {
        'sub-key-three': [{
          'sub-sub-key-one': null
        }],
        'sub-key-four': ['valOne', 'valueTwo']
      }
    });
  });
});