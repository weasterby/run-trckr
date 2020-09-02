module.exports = function (app) {

    require('./api/router')(app);
    require('./strava/router')(app);

};