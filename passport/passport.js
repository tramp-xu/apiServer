// import { Strategy, ExtractJwt } from "passport-jwt"
import config from '../config/index'
import passport from 'passport'
import { Strategy as GitHubStrategy } from 'passport-github'
import User from '../models/admin/admin'

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

/**
 * Sign in with GitHub.
 */
passport.use(new GitHubStrategy({
  clientID: 'c33b77a006664f707c5f',
  clientSecret: '466391b30d1354ad2fa13d2757d0bdcc05d8c1ee',
  callbackURL: '/auth/github/callback',
  passReqToCallback: true
}, (req, accessToken, refreshToken, profile, done) => {
  if (req.user) {
    User.findOne({ github: profile.id }, (err, existingUser) => {
      if (existingUser) {
        req.flash('errors', { msg: 'There is already a GitHub account that belongs to you. Sign in with that account or delete it, then link it with your current account.' });
        done(err);
      } else {
        User.findById(req.user.id, (err, user) => {
          if (err) { return done(err); }
          user.github = profile.id;
          user.tokens.push({ kind: 'github', accessToken });
          user.profile.name = user.profile.name || profile.displayName;
          user.profile.picture = user.profile.picture || profile._json.avatar_url;
          user.profile.location = user.profile.location || profile._json.location;
          user.profile.website = user.profile.website || profile._json.blog;
        });
      }
    });
  } else {
    User.findOne({ github: profile.id }, (err, existingUser) => {
      if (err) { return done(err); }
      if (existingUser) {
        return done(null, existingUser);
      }
      User.findOne({ email: profile._json.email }, (err, existingEmailUser) => {
        if (err) { return done(err); }
        if (existingEmailUser) {
          req.flash('errors', { msg: 'There is already an account using this email address. Sign in to that account and link it with GitHub manually from Account Settings.' });
          done(err);
        } else {
          const user = new User();
          user.email = profile._json.email;
          user.github = profile.id;
          user.tokens.push({ kind: 'github', accessToken });
          user.profile.name = profile.displayName;
          user.profile.picture = profile._json.avatar_url;
          user.profile.location = profile._json.location;
          user.profile.website = profile._json.blog;
          user.save((err) => {
            done(err, user);
          });
        }
      });
    });
  }
}));

/**
 * Login Required middleware.
 */
exports.isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
};

/**
 * Authorization Required middleware.
 */
exports.isAuthorized = (req, res, next) => {
  const provider = req.path.split('/').slice(-1)[0];
  const token = req.user.tokens.find(token => token.kind === provider);
  if (token) {
    next();
  } else {
    res.redirect(`/auth/${provider}`);
  }
};

// let opts = {}

// opts.jwtFromRequest  = ExtractJwt.fromAuthHeaderAsBearerToken()
// opts.secretOrKey = config.session.secret
// // 目标平台地址
// // opts.issuer = "https://www.jianshu.com"
// // 本项目地址
// // opts.audience = 'localhost:8080'

// let strategy = new Strategy(opts, (jwt_payload, next) => {
//   console.log('payload received', jwt_payload);
//   let user = users.find(user => user.id === jwt_payload.id)

//   if (user) {
//     next(null, user)
//   } else {
//     next(null, false)
//   }
// })

// passport.use(strategy)

// module.exports = passport
