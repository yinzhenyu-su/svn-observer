const config = {};
const fs = require('fs');

module.exports = new Promise((resolve, reject) => {
  fs.readdir(__dirname, { encoding: 'utf-8' }, (err, files) => {
    if (!err) {
      files
        .filter((file) => file !== 'index.js')
        .forEach((file) => {
          config[file.split('.')[0]] = require(`./${file}`);
          resolve(config);
        });
    } else {
      reject(err);
    }
  });
});
