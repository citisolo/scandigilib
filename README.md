# scandigilib [![Build Status](https://travis-ci.org/citisolo/scandigilib.svg?branch=master)](https://travis-ci.org/citisolo/scandigilib)  
> [![Coverage Status](https://coveralls.io/repos/github/citisolo/scandigilib/badge.svg?branch=master)](https://coveralls.io/github/citisolo/scandigilib?branch=master)


> A library that generates thumbnails and metadata database for a digital library

## Install

Install with [npm](https://www.npmjs.com/)

```sh
$ npm i scandigilib
```

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

Pull requests and stars are always welcome. For bugs and feature requests, [please create an issue](#please create an issue)

## Author

**kwadwo amankwa**

* [github/](https://github.com/citisolo)
* [twitter/](http://twitter.com/)

## License

Copyright © 2018 [kwadwo amankwa](#kwadwo amankwa)
Licensed under the ISC license.

***

_This file was generated by [readme-generator](https://github.com/jonschlinkert/readme-generator) on November 16, 2018._
