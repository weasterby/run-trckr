const stravaApi = require('strava-v3');
stravaApi.config({
    "client_id": process.env.STRAVA_CLIENT_ID,
    "client_secret": process.env.STRAVA_CLIENT_SECRET
});

module.exports = stravaApi;