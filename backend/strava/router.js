const database = require('./database');
const stravaApi = require('strava-v3');
stravaApi.config({
   "client_id": process.env.STRAVA_CLIENT_ID,
   "client_secret": process.env.STRAVA_CLIENT_SECRET,
   "redirect_uri": "http://localhost:3000/strava/auth/callback"
});

const requiredScope = ["profile:read_all", "activity:read"];

module.exports = function (app) {
    app.get("/strava/auth", function (req, res) {
        res.redirect(stravaApi.oauth.getRequestAccessURL({"scope": requiredScope.join(","), "approval_prompt": "force"}));
    });

    app.get("/strava/auth/callback", async function(req, res) {
        let grantedScope, code;
        try {
            grantedScope = req.query.scope;
            code = req.query.code;
            console.log("Getting access code for", grantedScope);
            let includesScope = true;
            for (const scope of requiredScope) {
                includesScope = includesScope && grantedScope.includes(scope);
            }
            if(!includesScope) {
                res.status(400);
                res.send("Invalid scope, please try again");
                return;
            }
            res.redirect('/leaderboard');
        } catch (e) {
            res.status(500);
            res.send("Unknown server error, try again later");
        }
        try {
            console.log("Saving token");
            const oauth = await stravaApi.oauth.getToken(code);
            await database.saveAccessToken(oauth);
        } catch (e) {
            console.log(e);
        }
    });
};