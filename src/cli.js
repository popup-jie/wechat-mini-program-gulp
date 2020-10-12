exports.run = function (type, name) {
  var exec = require('child_process').exec;
  console.log(type)
  var cmd = `npm run ${type}`;

  exec(cmd, function (err, stdout, stderr) {
    console.log(err)
    console.log(stdout)
    console.log(stderr)
  });

  console.log('文件已启动， crtl + y 结束进程')
}