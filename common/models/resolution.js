module.exports = function(Resolution) {
    Resolution.status == function(cb) {
        var response = 'dummy function to be removed';
        cb(null, response);
    };
    Resolution.remoteMethod(
    'status',
    {
      http: {path: '/status', verb: 'get'},
      returns: {arg: 'status', type: 'string'}
    }
  );
};
