
var async = require('async');
module.exports = function(app) {
  //data sources
  var mongoDs = app.dataSources.mongoDs;
  //create all models
  async.auto({
    create_resolutes: async.apply(createResolutes),
    create_resolutions: ['create_resolutes', async.apply(createResolutions)],
    create_reviews: ['create_resolutes','create_resolutions', async.apply(createReviews)]
  }, function(err, results) {
    console.log('err = ', err);
    console.log('results = ', results);
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
  
  function createResolutions(cb, dependencies) {
    mongoDs.automigrate('Resolution', function(err) {
      if (err) return cb(err);
      var Resolution = app.models.Resolution;
      var DAY_IN_MILLISECONDS = 1000 * 60 * 60 * 24;
      Resolution.create([
        {
            title: 'Write a novel', 
            description: 'Sign up to nanowrimo and aim to complete 50,000 words', 
            created: Date.now() - (DAY_IN_MILLISECONDS * 2),
            resolutId: dependencies.create_resolutes[2].id
        },
        {
            title: 'Lose weight', 
            description: 'Follow the paleo diet daily', 
            created: Date.now() - (DAY_IN_MILLISECONDS * 2),
            resolutId: dependencies.create_resolutes[1].id
        },
        {
            title: 'Run a marathon', 
            description: 'To run the London marathin I need to train for 3 month beforehand', 
            created: Date.now() - (DAY_IN_MILLISECONDS * 2),
            resolutId: dependencies.create_resolutes[0].id
        },
      ], cb);
    });
  }
  //create reviews
  function createReviews(cb, dependencies) {
    mongoDs.automigrate('Review', function(err) {
      if (err) return cb(err);
      var Review = app.models.Review;
      var DAY_IN_MILLISECONDS = 1000 * 60 * 60 * 24;
      Review.create([
        {
          date: Date.now() - (DAY_IN_MILLISECONDS * 4),
          rating: 5,
          comments: 'Awesome - keep up the good work Jane! - Foo',
          reviewerId: dependencies.create_resolutes[0].id,
          resolutionId: dependencies.create_resolutions[0].id,
        },
        {
          date: Date.now() - (DAY_IN_MILLISECONDS * 3),
          rating: 5,
          comments: 'Jane - you have inspired me! - John',
          reviewerId: dependencies.create_resolutes[1].id,
          resolutionId: dependencies.create_resolutions[0].id,
        },
        {
          date: Date.now() - (DAY_IN_MILLISECONDS * 2),
          rating: 4,
          comments: 'Go John!',
          reviewerId: dependencies.create_resolutes[0].id,
          resolutionId: dependencies.create_resolutions[1].id,
        },
        {
          date: Date.now() - (DAY_IN_MILLISECONDS),
          rating: 4,
          comments: 'Rather you than me foo. I could never run 26 miles - Jane.',
          reviewerId: dependencies.create_resolutes[2].id,
          resolutionId: dependencies.create_resolutions[2].id,
        }
      ], cb);
    });
  }
};