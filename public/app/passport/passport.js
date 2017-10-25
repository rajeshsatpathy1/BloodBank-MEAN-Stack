FacebookStrategy    = require('passport-facebook').Strategy;
var User            = require('../../../app/models/user');
var session         = require('express-session');
var jwt             = require('jsonwebtoken');  //To keep the user logged in

var secret      = 'NCrypTed';   //Secret for JSON web token

module.exports = function(app, passport) {
  // Start Passport Configuration Settings
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(session({ secret: 'keyboard cat', resave: false, saveUninitialized: true, cookie: { secure: false } }));
  // End Passport Configuration Settings

  // Serialize users once logged in   
  passport.serializeUser(function(user, done) {
      // Check if the user has an active account
      if (user.active) {
          // Check if user's social media account has an error
          if (user.error) {
              token = 'unconfirmed/error'; // Set url to different error page
          } else {
              token = jwt.sign({ username: user.username, email: user.email }, secret, { expiresIn: '24h' }); // If account active, give user token
          }
      } else {
          token = 'inactive/error'; // If account not active, provide invalid token for use in redirecting later
      }
      done(null, user.id); // Return user object
  });



  // Deserialize Users once logged out    
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user); // Complete deserializeUser and return done
    });
  });


    // Facebook Strategy    
    passport.use(new FacebookStrategy({
      clientID: '123264275037960',
      clientSecret: '886fbff3c7e0250c04f4dec511bafcc8',
      callbackURL: "http://localhost:8880/auth/facebook/callback",
      profileFields: ['id', 'displayName', 'photos', 'email']
  },
  function(accessToken, refreshToken, profile, done) {
    console.log(profile);
      User.findOne({ email: profile._json.email }).select('username active password email').exec(function(err, user) {
          if (err) done(err);

          if (user && user !== null) {
              done(null, user);
          } else {
              done(err);
          }
      });
  }
));
    
    app.get('/auth/facebook/callback',passport.authenticate('facebook', { failureRedirect: '/login' }),
    function(req, res) {
      //console.log(token);
      res.redirect('/facebook/' + token);
    });
    app.get('/auth/facebook',passport.authenticate('facebook', { scope: 'email' }));

    
    return passport;
}