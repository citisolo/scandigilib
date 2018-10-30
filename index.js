const fs = require('fs');
const walk = require('walkdir');
const readChunk = require('read-chunk');
const fileType = require('file-type');
const pdf = require('pdf-parse');
const PDF = require('pdfinfo');
const Path = require('path');
const PDFImage = require('pdf-image').PDFImage;
const jsonfile = require('jsonfile');
const ASQ = require("asynquence");
//const buffer = readChunk.sync('unicorn.png', 0, 4100);

var NUMFILES = 0;

const renameFileCallback =  function (err){
  if (err) throw err;
  //console.log('Move complete.');
}

const writeFileCallback = function(res){
  console.log('write successful: %s', newPath)
  fs.rename(imagePath, newImagePath, renameFileCallback);

}

const getImageCallback = function (imagePath) {
  //create thumbnail and save to metadata
  let newImagePath = createNewPath(imagePath, outdir);
  meta.thumbnail = newImagePath;
  //console.log(imagePath);
  //console.log(meta)
  //write the metadata to file
  jsonfile.writeFile(newPath, meta)
    .then(writeFileCallback)
    .catch(function(err){
      console.log('write unsuccessful:%s', filepath)
      console.log(err);
    })
}

const getMetaDataCallback = function(err, meta){
    //console.log(filepath);

    if (err){
      throw err;
    }

    return meta;
    //add filepath to metada
    // meta.path = filepath;
    //
    // //Create a new path to save metadata file
    // let newPath = createNewPath(filepath, outdir);
    // newPath = newPath + ".json";


    // var pdfImage = new PDFImage(filepath);
    // pdfImage.convertPage(0)
    // .then(getImageCallback)
    // .catch(function (err) {
    //   console.log(filepath)
    //   console.log(err)
    // })

    //console.log('pdf info:', meta)
  }

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
  pdf.info(getMetaDataCallback)
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


function scanPDFdir(dir, outdir, func) {
    var filesToScan = [];
    if (!fs.existsSync(dir) || !fs.existsSync(outdir)) {
      throw new Error("dir and outdir must be defined");
      return;
    }

    console.log("WALKING DIRECTORY...");
    var emitter = walk(dir);

    emitter.on('file', function(filepath, stat){
      if(!fs.lstatSync(filepath).isDirectory()){
        const fileTypeInfo = fileType(readChunk.sync(filepath, 0, 4100));
        //console.log("found: %s", filepath)
        //console.log(fileType(buffer))
        if (fileTypeInfo != null && fileTypeInfo.ext === "pdf"){
          filesToScan.push(filepath);
          //processPDF(filepath, outdir);
        }
        // if (fileTypeInfo != null && fileTypeInfo.ext === "png"){
        //   fs.unlink(filepath , function (err) {
        //     if (err) throw err;
        //     console.log('%s: Deletion sucessful.', filepath);
        //   });
        // }
      }
    })

    emitter.on('end', function (filename, stat){
      console.log("GETTING FILE METADA...");
      let files = filesToScan;
      let res = files.map(function(filepath){
          return new Promise((resolve, reject) => {
            var pdf = PDF(filepath)
            pdf.info(function(err, meta){
                //console.log(filepath);

                if (err){
                  reject(err);
                }
                meta.path = filepath;
                return resolve(meta);
            })
          })
          // let options = {
          //     max: 0,
          // }
          //
          // let dataBuffer = fs.readFileSync(filepath)
          // return pdf(fs.readFileSync(filepath), options).then(function(data){
          //     return {path:filepath, numpages: data.numpages, info: data.info, metadata: data.metadata};
          // });
      });

      Promise.all(res)
      .then(function(files){
        console.log("CREATING FILE THUMBNAILS...");
         res = files.map(function(data){
           let filepath = data.path
           var pdfImage = new PDFImage(filepath);
           return pdfImage.convertPage(0)
                 .then(function(imagePath){
                   data.imagePath = imagePath
                   return data;
                 })
                 .catch(function (err) {
                   console.log(filepath)
                   console.log(err)
                 })
         })

         Promise.all(res)
         .then(function(files){
           console.log("MOVING THUMBNAILS...");
           let res = files.map(function(file){
               let newImagePath = createNewPath(file.imagePath, outdir);

               return new Promise((resolve, reject) => {
                   fs.rename(file.imagePath, newImagePath,  function (err) {
                     if (err != null) {
                         console.log(err);
                         reject(err);
                     }
                     console.log('write successful: %s', newImagePath);
                     file.imagePath = newImagePath;
                     return resolve(file);
                   });
                 });
               });

           Promise.all(res)
           .then(function(metadata){
             console.log("WRITING DATABASE...");
             //console.log(files);
             let databasePath = createNewPath("database.json", outdir);
             jsonfile.writeFile(databasePath, metadata)
               .then(function(data){
                 console.log('write successful: %s', databasePath)
               })
               .catch(function(err){
                 console.log('json file write unsuccessful: %s',databasePath)
                 console.log(err);
               })
           });
         })
      })
    })

    // ASQ(function(done){
    //   console.log("WALKING DIRECTORY...");
    //   var emitter = walk(dir);
    //
    //   emitter.on('file', function(filepath, stat){
    //     if(!fs.lstatSync(filepath).isDirectory()){
    //       const fileTypeInfo = fileType(readChunk.sync(filepath, 0, 4100));
    //       //console.log("found: %s", filepath)
    //       //console.log(fileType(buffer))
    //       if (fileTypeInfo != null && fileTypeInfo.ext === "pdf"){
    //         filesToScan.push(filepath);
    //         //processPDF(filepath, outdir);
    //       }
    //       // if (fileTypeInfo != null && fileTypeInfo.ext === "png"){
    //       //   fs.unlink(filepath , function (err) {
    //       //     if (err) throw err;
    //       //     console.log('%s: Deletion sucessful.', filepath);
    //       //   });
    //       // }
    //     }
    //   })
    //
    //   emitter.on('end', function (filename, stat){
    //     done(filesToScan);
    //   })
    // })
    // .then(function(done, files){
    //   //console.log(files);
    //   console.log("GETTING FILE METADA...");
    //
    //   let res = files.map(function(filepath){
    //
    //       return new Promise((resolve, reject) => {
    //         var pdf = PDF(filepath)
    //         pdf.info(function(err, meta){
    //             //console.log(filepath);
    //
    //             if (err){
    //               reject(err);
    //             }
    //             meta.path = filepath;
    //             return resolve(meta);
    //         })
    //       })
    //       // let options = {
    //       //     max: 0,
    //       // }
    //       //
    //       // let dataBuffer = fs.readFileSync(filepath)
    //       // return pdf(fs.readFileSync(filepath), options).then(function(data){
    //       //     return {path:filepath, numpages: data.numpages, info: data.info, metadata: data.metadata};
    //       // });
    //   });
    //
    //   Promise.all(res)
    //   .then(function(data){
    //     done(data);
    //   })
    // })
    // .then(function(done, files){
    //   console.log("CREATING FILE THUMBNAILS...");
    //    res = files.map(function(data){
    //      let filepath = data.path
    //      var pdfImage = new PDFImage(filepath);
    //      return pdfImage.convertPage(0)
    //            .then(function(imagePath){
    //              data.imagePath = imagePath
    //              return data;
    //            })
    //            .catch(function (err) {
    //              console.log(filepath)
    //              console.log(err)
    //            })
    //    })
    //
    //    Promise.all(res)
    //    .then(function(res){
    //      done(res);
    //    })
    // })
    // .then(function(done, files){
    //   console.log("MOVING THUMBNAILS...");
    //   let res = files.map(function(file){
    //     let newImagePath = createNewPath(file.imagePath, outdir);
    //
    //     return new Promise((resolve, reject) => {
    //         fs.rename(file.imagePath, newImagePath,  function (err) {
    //           if (err != null) {
    //               console.log(err);
    //               reject(err);
    //           }
    //           console.log('write successful: %s', newImagePath);
    //           file.imagePath = newImagePath;
    //           return resolve(file);
    //         });
    //       });
    //     });
    //
    //     Promise.all(res)
    //     .then(function(data){
    //       done(data);
    //     });
    //
    //   })
    //   .then(function(done, metadata){
    //     console.log("WRITING DATABASE...");
    //     //console.log(files);
    //     let databasePath = createNewPath("database.json", outdir);
    //     jsonfile.writeFile(databasePath, metadata)
    //       .then(function(data){
    //         console.log('write successful: %s', databasePath)
    //       })
    //       .catch(function(err){
    //         console.log('json file write unsuccessful: %s',databasePath)
    //         console.log(err);
    //       })
    //   });

}

module.exports.processPDF = processPDF;
module.exports.scanPDFdir = scanPDFdir;
