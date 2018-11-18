const fs = require('fs');
const walk = require('walkdir');
const PDF = require('pdfinfo');
const Path = require('path');
const PDFImage = require('pdf-image').PDFImage;
const EventEmitter = require('events');
const loki = require('lokijs');




var books = null;
var db = null;

function databaseInitialize() {
	collection = db.getCollection('books');
	if (collection === null) {
		books = db.addCollection('books');
	} else {
		books = collection;
	}
}



function createNewPath(oldPath, prefix) {

	let newPath = Path.basename(oldPath);

	newPath = Path.join(prefix, newPath);

	return newPath;
}

class DataEmitter extends EventEmitter {
	// constructor(){
	//   this.JOBS = [];
	//
	//   this.on('addJob', function(){
	//     this.JOBS.push("0");
	//   })
	//
	//   this.on('removeJob',function(){
	//       this.JOBS.pop();
	//       if (this.JOBS.length < 1){
	//         this.emit('jobsFinished');
	//       }
	//     })
	//
	//   this.on('jobsFinished',function(func){
	//       func();
	//   })
	// }
}

const metaThumbnailEmitter = new DataEmitter()

const metaDataEmitter = new DataEmitter();

// class DataEmit extends EventEmitter {
// 	constructor(outdir){
//     this.outdir = outdir;
// 	}
//
// 	onFileInput(data){
//
// 	}
//
// 	onFileFinished(metadata){
//
// 	}
//
// 	onThumbnailInput(metadata){
//
// 	}
//
// 	onThumbnailImageMade(metada){
//
// 	}
//
// 	onThumbnailFinished(metadata){
//
// 	}
//
// 	onPipelineFinished(metadata){
//
// 	}
//
// }

metaThumbnailEmitter.on('jobFinished', function(metadata) {
	console.log("WRITING DATABASE...");
	books.insert(metadata);
	db.saveDatabase();
});

metaThumbnailEmitter.on('imageMade', function(metadata, outdir) {
	let newImagePath = createNewPath(metadata.imagePath, outdir);
	fs.rename(metadata.imagePath, newImagePath, function(err) {
		if (err != null) {
			console.log(err);
		}
		console.log('write successful: %s', newImagePath);
		metadata = Object.assign(metadata, {
			imagePath: newImagePath
		});
		//metadata.imagePath = newImagePath;
		metaThumbnailEmitter.emit('jobFinished', metadata);
	});
});

metaThumbnailEmitter.on('input', function(metadata, outdir) {
	let filepath = metadata.path;
	var pdfImage = new PDFImage(filepath);
	pdfImage.convertPage(0)
		.then(function(imagePath) {
			//metadata.imagePath = imagePath
			metadata = Object.assign(metadata, {
				imagePath: imagePath
			});
			metaThumbnailEmitter.emit('imageMade', metadata, outdir);
		})
		.catch(function(err) {
			console.log(filepath);
			console.log(err);
		});
});

metaDataEmitter.on('jobFinished', function(metadata, outdir) {
	//console.log(metadata);
	metaThumbnailEmitter.emit('input', metadata, outdir);
});

metaDataEmitter.on('input', function(file, outdir) {
	var pdf = PDF(file);
	pdf.info(function(err, metadata) {
		//console.log(file);
		if (err) {
			//FIXME: handle this better
			console.log(file);
			console.log(err);
			return;
		}
		//meta.path = file;
		metadata = Object.assign(metadata, {
			path: file
		});
		metaDataEmitter.emit('jobFinished', metadata, outdir);

	});

});

function scanFile(filepath, outdir) {
	if (!fs.lstatSync(filepath).isDirectory()) {
		let ext = Path.extname(filepath);
		if (ext === ".pdf") {
			metaDataEmitter.emit('input', filepath, outdir);
		}
	}
}

function walkdir(dir, outdir) {

	var walkEmitter = walk(dir);

	walkEmitter.on('file', function(filepath, stat) {
		if (!fs.lstatSync(filepath).isDirectory()) {
			let ext = Path.extname(filepath);
			if (ext === ".pdf") {
				scanFile(filepath, outdir);
			}
		}
	})

}

function scanPDF(file, outdir) {
	if (!fs.existsSync(file) || !fs.existsSync(outdir)) {
		throw new Error("<file> and <outdir> must be defined");
	}

	let databasePath = createNewPath("database.json", outdir);
	db = new loki(databasePath, {
		autoload: true,
		autoloadCallback: databaseInitialize,
		// autosave: true,
		// autosaveInterval: 4000
	});

	var interval = setInterval(function() {
		if (books === null) {
			console.log("waiting for database...");
		} else {
			clearInterval(interval);
			if (!fs.lstatSync(file).isDirectory()) {
				let ext = Path.extname(file);
				if (ext === ".pdf") {
					scanFile(file, outdir);
				}
			}
		}
	}, 1500);
}

//TODO: implement
function scanEPUBdir() {

}

function scanPDFdir(dir, outdir) {
	if (!fs.existsSync(dir) || !fs.existsSync(outdir)) {
		throw new Error("<dir> and <outdir> must be defined");
	}

	let databasePath = createNewPath("database.json", outdir);
	db = new loki(databasePath, {
		autoload: true,
		autoloadCallback: databaseInitialize,
		// autosave: true,
		// autosaveInterval: 4000
	});

	console.log("WALKING DIRECTORY...");

	var interval = setInterval(function() {
		if (books === null) {
			console.log("waiting for database...");
		} else {
			clearInterval(interval);
			walkdir(dir, outdir);
		}
	}, 1500);
}

module.exports.scanPDFdir = scanPDFdir;
module.exports.scanPDF = scanPDF;
