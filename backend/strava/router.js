const database = require('./database');
const utils = require('./utils');
const stravaApi = require('strava-v3');
stravaApi.config({
   "client_id": process.env.STRAVA_CLIENT_ID,
   "client_secret": process.env.STRAVA_CLIENT_SECRET,
   "redirect_uri": process.env.HOST_NAME + "/strava/auth/callback"
});
const webhooks = require('./webhooks');
webhooks.setup(stravaApi, database);

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

    app.get('/strava/webhook', function (req, res) {
        // Your verify token. Should be a random string.
        const VERIFY_TOKEN = "STRAVA";
        // Parses the query params
        let mode = req.query['hub.mode'];
        let token = req.query['hub.verify_token'];
        let challenge = req.query['hub.challenge'];
        // Checks if a token and mode is in the query string of the request
        if (mode && token) {
            // Verifies that the mode and token sent are valid
            if (mode === 'subscribe' && token === VERIFY_TOKEN) {
                // Responds with the challenge token from the request
                console.log('WEBHOOK_VERIFIED');
                res.json({"hub.challenge": challenge});
            } else {
                // Responds with '403 Forbidden' if verify tokens do not match
                res.sendStatus(403);
            }
        }
    });

    app.post('/strava/webhook', async function (req, res) {
        const payload = req.body;
        res.status(200);
        res.send("Success!");

        await webhooks.newEvent(payload);
    });

    app.get('/strava/*', function (req, res) {
        res.status(404);
        res.send('Resource not found')
    });
};