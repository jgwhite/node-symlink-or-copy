var fs = require('fs')
var path = require('path')
var copyDereferenceSync = require('copy-dereference').sync

var isWindows = process.platform === 'win32'

module.exports = symlinkOrCopy
function symlinkOrCopy () {
  throw new Error("This function does not exist. Use require('symlink-or-copy').sync")
}

module.exports.sync = symlinkOrCopySync
function symlinkOrCopySync (srcPath, destPath) {
  if (false) {
    // We might be able to optimize this case in the future, for instance by
    // detecting whether we have rights to create symlinks, or perhaps even
    // creating junctions.
    copyDereferenceSync(srcPath, destPath)
  } else {
    if (fs.lstatSync(srcPath).isSymbolicLink()) {
      // When we encounter symlinks, follow them. This prevents indirection
      // from growing out of control.
      // Note: At the moment `realpathSync` on Node is 70x slower than native,
      // because it doesn't use the standard library's `realpath`:
      // https://github.com/joyent/node/issues/7902
      // Can someone please send a patch to Node? :)
      srcPath = fs.realpathSync(srcPath)
    }

    // else if (srcPath[0] !== '/') {
      // Resolve relative paths.
      // Note: On Mac and Linux (unlike Windows), process.cwd() never contains
      // symlink components, due to the way getcwd is implemented. As a
      // result, it's correct to use naive string concatenation in this code
      // path instead of the slower path.resolve(). (It seems unnecessary in
      // principle that path.resolve() is slower. Does anybody want to send a
      // patch to Node?)
      // srcPath = process.cwd() + '/' + srcPath
    // }

    srcPath = path.resolve(srcPath)
    var stat = fs.statSync(srcPath);

    if(stat.isDirectory()) {
        fs.symlinkSync(srcPath, destPath, 'dir')
    } else if(stat.isFile()) {
        fs.symlinkSync(srcPath, destPath, 'file')
    } else {
        fs.symlinkSync(srcPath, destPath)
    }
  }
}
