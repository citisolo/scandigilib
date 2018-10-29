const fs = require('fs');
const walk = require('walkdir');
const readChunk = require('read-chunk');
const fileType = require('file-type');
const pdf = require('pdf-parse');
const PDF = require('pdfinfo');
const Path = require('path');
const PDFImage = require('pdf-image').PDFImage;
const jsonfile = require('jsonfile')
//const buffer = readChunk.sync('unicorn.png', 0, 4100);

var NUMFILES = 0;

function createNewPath(oldPath, prefix){

  let newPath = Path.basename(oldPath);
  newPath = prefix + newPath;

  return newPath;
}

function extractMetadata(filepath, outdir){
  //Get Metadata
  //let dataBuffer = fs.readFileSync(filepath);
  var pdf = PDF(filepath);
  //console.log('Reached');
  pdf.info(function(err, meta){
    console.log(filepath);

    if (err){
      throw err;
    }
    //add filepath to metada
    meta.path = filepath;

    //Create a new path to save metadata file
    let newPath = createNewPath(filepath, outdir);
    newPath = newPath + ".json";


    var pdfImage = new PDFImage(filepath);
    pdfImage.convertPage(0)
    .then(function (imagePath) {
      //create thumbnail and save to metadata
      let newImagePath = createNewPath(imagePath, outdir);
      meta.thumbnail = newImagePath;
      //console.log(imagePath);
      //console.log(meta)
      //write the metadata to file
      jsonfile.writeFile(newPath, meta)
        .then(function(res){
          console.log('write successful: %s', newPath)
          fs.rename(imagePath, newImagePath, function (err){
            if (err) throw err;
            //console.log('Move complete.');
          });

        })
        .catch(function(err){
          console.log('write unsuccessful:%s', filepath)
          console.log(err);
        })
    })
    .catch(function (err) {
      console.log(filepath)
      console.log(err)
    })

    //console.log('pdf info:', meta)
  })
}

// function extractThumbnail(filepath, outdir) {
//   var pdfImage = new PDFImage(filepath);
//   pdfImage.convertPage(0)
//   .then(function (imagePath) {
//     let newImagePath = Path.basename(imagePath);
//     newImagePath = outdir + newImagePath;
//     fs.rename(imagePath, newImagePath, function (err){
//       if (err) throw err;
//       //console.log('Move complete.');
//     });
//     console.log(imagePath);
//   })
//   .catch(function (err) {
//     console.log(filepath)
//     console.log(err)
//   })
// }

function processPDF (filepath, outdir){
  if (!fs.existsSync(filepath) || !fs.existsSync(outdir)) {
    throw new Error("filepath and outdir must be defined");
    return;
  }

  extractMetadata(filepath, outdir);
  //extractThumbnail(path);

}

function myAsyncFunction(filepath, outdir) {
  let metadata = []
  return new Promise((resolve, reject) => {
    walk.sync(dir, function(filepath, stat){
      if(!fs.lstatSync(filepath).isDirectory()){
        const fileTypeInfo = fileType(readChunk.sync(filepath, 0, 4100));
        //console.log("found: %s", filepath)
        //console.log(fileType(buffer))
        if (fileTypeInfo != null && fileTypeInfo.ext === "pdf"){
          processPDF(filepath, outdir);
        }
        // if (fileTypeInfo != null && fileTypeInfo.ext === "png"){
        //   fs.unlink(path , function (err) {
        //     if (err) throw err;
        //     console.log('%s: Deletion sucessful.', path);
        //   });
        // }
      }
    })
  });
}

function scanPDFdir(dir, outdir, func) {

    if (!fs.existsSync(dir) || !fs.existsSync(outdir)) {
      throw new Error("dir and outdir must be defined");
      return;
    }

    walk(dir, function(filepath, stat){
      if(!fs.lstatSync(filepath).isDirectory()){
        const fileTypeInfo = fileType(readChunk.sync(filepath, 0, 4100));
        //console.log("found: %s", filepath)
        //console.log(fileType(buffer))
        if (fileTypeInfo != null && fileTypeInfo.ext === "pdf"){
          processPDF(filepath, outdir);
        }
        // if (fileTypeInfo != null && fileTypeInfo.ext === "png"){
        //   fs.unlink(path , function (err) {
        //     if (err) throw err;
        //     console.log('%s: Deletion sucessful.', path);
        //   });
        // }
      }
    })
}

module.exports.processPDF = processPDF;
module.exports.scanPDFdir = scanPDFdir;
