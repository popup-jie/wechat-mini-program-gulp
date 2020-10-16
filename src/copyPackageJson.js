
const path = require('path')
const fs = require('fs-extra')

const copyPackageJson = () => {
  try {
    let file = fs.readFileSync(path.join(process.cwd(), '/', 'package.json'), 'utf8')
    const newFormat = file
      .replace(/(\r\n\t|\n|\r\t)/gm, '')
      .replace(/}{/g, '},{');
    let nowPackJson = JSON.parse(newFormat)

    let filepaht = path.join(__dirname, '../package.json')
    let readable = fs.readFileSync(filepaht, 'utf8');
    const readableFormat = readable
      .replace(/(\r\n\t|\n|\r\t)/gm, '')
      .replace(/}{/g, '},{');
    let gulpPackJson = JSON.parse(readableFormat)
    delete gulpPackJson['devDependencies']['commander']
    delete gulpPackJson['devDependencies']['fs-extra']

    Object.assign(nowPackJson['devDependencies'], gulpPackJson['dependencies'])

    fs.writeFile(path.join(process.cwd(), '/', 'package.json'), JSON.stringify(nowPackJson, null, "\t"), (err) => { })

  } catch (e) {
    // console.log(e)
    let readable = fs.createReadStream(path.join(__dirname, '../package.json'));
    let writable = fs.createWriteStream(path.join(process.cwd(), '/', 'package.json'));
    readable.pipe(writable)
  }
}

module.exports = { copyPackageJson }