
var async = require('async');
module.exports = function(app) {
  //data sources
  var mongoDs = app.dataSources.mongoDs;
  //create all models
  async.parallel({
    resolutes: async.apply(createResolutes),
    resolutions: async.apply(createResolutions),
  }, function(err, results) {
    if (err) throw err;
    createReviews(results.resolutes, results.resolutions, function(err) {
      console.log('> models created sucessfully');
    });
  });
  //create resolutes
  function createResolutes(cb) {
    mongoDs.automigrate('Resolute', function(err) {
      if (err) return cb(err);
      var Resolute = app.models.Resolute;
      Resolute.create([
        {email: 'foo@bar.com', password: 'foobar'},
        {email: 'john@doe.com', password: 'johndoe'},
        {email: 'jane@doe.com', password: 'janedoe'}
      ], cb);
    });
  }
  //create resolutions
  //TODO: Consider creating actionable tasks or integrate with a task tool 
  function createResolutions(cb) {
    mongoDs.automigrate('Resolution', function(err) {
      if (err) return cb(err);
      var Resolution = app.models.Resolution;
      var DAY_IN_MILLISECONDS = 1000 * 60 * 60 * 24;
      Resolution.create([
        {
            title: 'Write a novel', 
            description: 'Sign up to nanowrimo and aim to complete 50,000 words', 
            created: Date.now() - (DAY_IN_MILLISECONDS * 2)
        },
        {
            title: 'Lose weight', 
            description: 'Follow the paleo diet daily', 
            created: Date.now() - (DAY_IN_MILLISECONDS * 2)
        },
        {
            title: 'Run a marathon', 
            description: 'To run the London marathin I need to train for 3 month beforehand', 
            created: Date.now() - (DAY_IN_MILLISECONDS * 2)
        },
      ], cb);
    });
  }
  //create reviews
  function createReviews(resolutes, resolutions, cb) {
    mongoDs.automigrate('Review', function(err) {
      if (err) return cb(err);
      var Review = app.models.Review;
      var DAY_IN_MILLISECONDS = 1000 * 60 * 60 * 24;
      Review.create([
        {
          date: Date.now() - (DAY_IN_MILLISECONDS * 4),
          rating: 5,
          comments: 'Awesome - keep up the good work Foo!',
          publisherId: resolutes[0].id,
          resolutionId: resolutions[0].id,
        },
        {
          date: Date.now() - (DAY_IN_MILLISECONDS * 3),
          rating: 5,
          comments: 'John - you have inspired me!',
          publisherId: resolutes[1].id,
          resolutionId: resolutions[0].id,
        },
        {
          date: Date.now() - (DAY_IN_MILLISECONDS * 2),
          rating: 4,
          comments: 'Go John!',
          publisherId: resolutes[1].id,
          resolutionId: resolutions[1].id,
        },
        {
          date: Date.now() - (DAY_IN_MILLISECONDS),
          rating: 4,
          comments: 'Rather you than me Jane. I could never run 26 miles.',
          publisherId: resolutes[2].id,
          resolutionId: resolutions[2].id,
        }
      ], cb);
    });
  }
};