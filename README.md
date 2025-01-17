# scandigilib [![Build Status](https://travis-ci.org/citisolo/scandigilib.svg?branch=master)](https://travis-ci.org/citisolo/scandigilib)  
> [![Coverage Status](https://coveralls.io/repos/github/citisolo/scandigilib/badge.svg?branch=master)](https://coveralls.io/github/citisolo/scandigilib?branch=master)


> A library that generates thumbnails and metadata database for a digital library

## Install

Install with [npm](https://www.npmjs.com/)

```sh
$ npm i scandigilib
```
Depends on the pdf-image library so ensure you have convert, gs, and pdfinfo (part of poppler) commands. see [pdf-image](https://www.npmjs.com/package/pdf-image#ubuntu) for installation instructions.

Note: if you are getting the error 'convert-im6.q16: not authorized ... ; try the following fix:

For the file /etc/ImageMagick-6/policy.xml (or /etc/ImageMagick/policy.xml) make the following changes:
```
    comment line

    <!-- <policy domain="coder" rights="none" pattern="MVG" /> -->

    change line

    <policy domain="coder" rights="none" pattern="PDF" />

    to

    <policy domain="coder" rights="read|write" pattern="PDF" />

    add line

    <policy domain="coder" rights="read|write" pattern="LABEL" />
```
for more details see this fix on [Stackoverflow](https://stackoverflow.com/questions/42928765/convertnot-authorized-aaaa-error-constitute-c-readimage-453)


## Usage

### Scanning a whole directory.

This recursively scans the directory generating a thumbnail and metadata for
each file, storing the thumbnails and a database.json(for the metadata) file in the destination directory.  

```js
var scandigilib = require('scandigilib');

scandigilib.scanPDFdir([path-to-src-dir], [path-to-dest-dir]);

```

### Scanning a single file.

This generates a thumbnail which is stored at the destination directory and adds a single entry into the database.json file in the destination directory.


```js
var scandigilib = require('scandigilib');

scandigilib.scanPDF([path-to-src-file], [path-to-dest-dir]);

```

## Running tests

Install dev dependencies:

```sh
$ npm i -d && npm test
```

## Contributing

Pull requests and stars are always welcome. For bugs and feature requests, [please create an issue](https://github.com/citisolo/scandigilib/issues/new)

## Author

**kwadwo amankwa**

* [github/](https://github.com/citisolo)
* [twitter/](http://twitter.com/)

## License

Copyright © 2018 [kwadwo amankwa](#kwadwo amankwa)
Licensed under the ISC license.

***

_This file was generated by [readme-generator](https://github.com/jonschlinkert/readme-generator) on November 16, 2018._
