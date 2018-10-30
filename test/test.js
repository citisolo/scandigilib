'use strict';

var expect = require('chai').expect;
const assert = require('chai').assert;
var scanpdf = require('../index');

describe('#scandir', () => {
  // it('should throw error on incorrect input', (done) => {
  //   expect(()=>{scanpdf.scanPDFdir("/home/redbandit/Desktop/Projects/Wisdom")}).to.throw(/dir and outdir must be defined/);
  //   //assert.throws(()=>{scanpdf.scanPDFdir("/home/redbandit/Desktop/Projects/Wisdom")});
  //   done();
  // })

  it('should scan directory without crashing', (done) => {
    scanpdf.scanPDFdir("/home/redbandit/Desktop/Projects/Wisdom", "./tmp/")
    done();
  })

})
