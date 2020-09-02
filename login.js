const passport = require('passport');
const StravaStrategy = require('passport-strava-oauth2').Strategy;
const session = require('express-session');
const bodyParser = require('body-parser');

module.exports = function(app) {

    passport.serializeUser(function(user, done) {
        done(null, user);
    });

    passport.deserializeUser(function(obj, done) {
        done(null, obj);
    });

    passport.use(new StravaStrategy({
            clientID: process.env.STRAVA_CLIENT_ID,
            clientSecret: process.env.STRAVA_CLIENT_SECRET,
            callbackURL: "/login/callback"
        },
        function(accessToken, refreshToken, profile, done) {
            // asynchronous verification, for effect...
            process.nextTick(async function() {

                // To keep the example simple, the user's Strava profile is returned to
                // represent the logged-in user.  In a typical application, you would want
                // to associate the Strava account with a user record in your database,
                // and return that user instead.
                user = await require('./backend/api/database').createUser(profile);
                console.log(user);
                return done(null, user);
            });
        }
    ));

    app.use(bodyParser.json());

    app.use(session({
        secret: process.env.SESSION_SECRET,
        resave: true,
        saveUninitialized: true,
        cookie: { secure: (process.env.SESSION_SECURE_ENABLED == "true") || false }
    }));

    app.use(passport.initialize());
    app.use(passport.session());

    app.get('/login',
        passport.authenticate('strava', {session: true}));

    app.get('/login/callback',
        passport.authenticate('strava', { failureRedirect: '/login' }),
        function(req, res) {
            // Successful authentication, redirect home.
            res.redirect('/login/redirect');
        });

    app.get('/login/redirect', async function (req, res) {
        console.debug("Redirecting from login");
        try {
            const id = req.user.id;
            if (id !== undefined) {
                const results = await require('./backend/api/database').getUser(id);
                if (results.strava_connected === true) {
                    res.redirect('/leaderboard');
                } else {
                    res.redirect('/strava/auth');
                }
            } else {
                res.redirect('/');
            }
        } catch (e) {
            res.redirect('/');
        }
    });

    app.get('/logout', function (req, res) {
        req.logout();
        res.redirect('/');
    })

};
