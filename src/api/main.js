var fs = require('fs');

fs.readFile('input.txt', function (err, data) {
  if(err){
    console.log(err.stack);
    return;
  }
  console.log(data.toString());
});
console.log('程序执行完毕');


var asyncReadFile = async function(){
  var f1 = await readFile('/etc/fstab');
  var f2 = await readFile('/etc/shells');
  console.log(f1.toString());
  console.log(f2.toString());
};
