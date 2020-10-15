var through = require('through2')
module.exports = function (resourcesStream) {
  // console.log(resourcesStream)
  function doSomething(file, encoding, callback) {
    var buffer = new Buffer.from(file.contents).toString('utf-8')
    // var d = buffer

    buffer = buffer.replace(/console.log\([^\)]*\)(;?)/g, "")
    // console.log(buffer)

    file.contents = Buffer.from(buffer)

    callback(null, file);
  }

  return through.obj(doSomething);
}