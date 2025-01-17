'use strict';

var expect = require('chai').expect;
const assert = require('chai').assert;
const scanpdf = require('../index');
const fs = require('fs');

//Create the tmp directory.
var dir = './test/tmp';

if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
}


describe('#scandir', () => {
  // it('should throw error on incorrect input', (done) => {
  //   expect(()=>{scanpdf.scanPDFdir("/home/redbandit/Desktop/Projects/Wisdom")}).to.throw(/dir and outdir must be defined/);
  //   //assert.throws(()=>{scanpdf.scanPDFdir("/home/redbandit/Desktop/Projects/Wisdom")});
  //   done();
  // })

  it('should scan directory without crashing', (done) => {
    scanpdf.scanPDFdir("./test/librarydata/100MB", "./test/tmp/");
    done();
  }).timeout(1000000);

  // it('should save to correct directory without adding trailing slash to [outdir]', (done) => {
  //
  //   empty('./test/tmp', false, (res) => {
  //     if(res.error){
  //       done();
  //     }
  //     else{
  //       scanpdf.scanPDFdir("./test/librarydata/100MB", "./test/tmp");
  //
  //     }
  //
  //   })
  //   done();
  // }).timeout(1000000);

  // it('should scan directory without crashing', (done) => {
  //   scanpdf.scanPDFdir("./test/librarydata/librarydata/1GB", "./test/tmp/")
  //   done();
  // }).timeout(1000000)
  //
  // it('should scan directory without crashing', (done) => {
  //   scanpdf.scanPDFdir("./test/librarydata/5GB", "./test/tmp/")
  //   done();
  // }).timeout(1000000)
  //
  // it('should scan directory without crashing', (done) => {
  //   scanpdf.scanPDFdir("./test/librarydata/10GB", "./test/tmp/")
  //   done();
  // }).timeout(1000000)

})

describe('#scanfile', () => {

  it('should scan file without crashing', (done) => {
    scanpdf.scanPDF("./test/librarydata/100MB/01_kingsley.pdf", "./test/tmp/");
    done();
  }).timeout(1000000);
})
