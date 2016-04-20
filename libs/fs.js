var fs = require('fs');
var utils = require('./utils');
var isObject = utils.isObject;
var isVaildObject = utils.isVaildObject;
var mergeObject = utils.mergeObject;

var errors = {};
errors['404'] = 'filename or filepath required';
errors['-1'] = 'object required to update JSON';

exports.readJSON = function(filename, callback) {
  if (!filename) return callback(new Error(errors['404']));
  if (!callback) return this.readJSONSync(filename);
  return fs.readFile(filename, function(err, data) {
    if (err) return callback(err);
    try {
      return callback(null, JSON.parse(data));
    } catch (err) {
      return callback(err);
    }
  });
}

exports.readJSONSync = function(filename) {
  if (!filename) return callback(new Error(errors['404']));
  try {
    var data = fs.readFileSync(filename);
    return JSON.parse(data);
  } catch (err) {
    if (err.code === 'ENOENT') throw new Error(errors['404'])
    throw err;
  }
}

exports.writeJSON = function(filename, data, callback) {
  if (!filename) {
    if (!callback) throw new Error(errors['404'])
    return callback(new Error(errors['404']));
  }
  if (!callback) return this.writeJSONSync(filename, data);
  var d = data || {};
  try {
    var json = JSON.stringify(d);
  } catch (err) {
    return callback(err);
  }
  return fs.writeFile(filename, json, callback);
}

exports.writeJSONSync = function(filename, data) {
  if (!filename) return callback(new Error(errors['404']));
  var d = data || {};
  try {
    var json = JSON.stringify(d);
    fs.writeFileSync(filename, json);
    return d;
  } catch (err) {
    throw err;
  }
}

exports.updateJSON = function(filename, data, callback) {
  if (!filename) {
    if (!callback) throw new Error(errors['404']);
    return callback(new Error(errors['404']));
  }
  if (!callback) return this.updateJSONSync(filename, data);
  if (!isObject(data)) return callback(new Error(errors['-1']));
  var self = this;
  return this.readJSON(filename, function(err, before) {
    if (err) {
      if (err.code === 'ENOENT') {
        return this.writeJSON(filename, data, callback);
      }
      return callback(err);
    }
    return self.writeJSON(
      filename,
      !isVaildObject(data) ? {} : mergeObject(before, data),
      callback
    );
  });
}

exports.updateJSONSync = function(filename, data) {
  if (!filename) return callback(new Error(errors['404']));
  if (!isObject(data)) return callback(new Error(errors['-1']));
  try {
    var before = this.readJSONSync(filename);
  } catch (err) {
    //FIXME: better error handling
    if (err.message === 'filename or filepath required') return this.writeJSONSync(filename, data);
    throw err;
  }
  return this.writeJSONSync(
    filename,
    !isVaildObject(data) ? {} : mergeObject(before, data)
  );
}

Object.keys(fs).forEach(function(method) {
  exports[method] = fs[method];
});
