let stravaApi;
let database;
const utils = require('./utils');
let webhookId;

module.exports.setup = async function (newStravaApi, newDatabase) {
    stravaApi = newStravaApi;
    database = newDatabase;

    if (process.env.STRAVA_WEBHOOKS_ENABLED == "true") {
        const currentWebhooks = await stravaApi.pushSubscriptions.list({});
        if (currentWebhooks === undefined || currentWebhooks.length <= 0) {
            console.log("Creating new webhook");
            const newWebhook = await stravaApi.pushSubscriptions.create({
                callback_url: process.env.STRAVA_WEBHOOK_HOST + "/strava/webhook",
                verify_token: process.env.STRAVA_WEBHOOK_VERIFY_TOKEN
            });
            if (newWebhook === undefined || newWebhook.id === undefined) {
                console.error("Could not create webhook");
            } else {
                webhookId = newWebhook.id;
            }
        } else {
            console.log("Webhook already exists");
            webhookId = currentWebhooks[0].id;
        }
        console.debug("Webhook ID:", webhookId);
    }
};

module.exports.newEvent = async function (event) {
    console.debug("New webhook event:", event);
    try {
        if (process.env.STRAVA_WEBHOOKS_ENABLED != "true" || event.subscription_id === webhookId) {
            const athlete = event.owner_id;
            const access_token = await utils.getAuthToken(athlete, stravaApi);
            const strava = new stravaApi.client(access_token);

            if (event.object_type === "activity") {
                const activityId = event.object_id;
                const eventType = event.aspect_type;

                if (eventType === "create") {
                    database.createActivity(activityId, athlete);
                }

                if (eventType === "create" || eventType === "update") {
                    const activity = await strava.activities.get({id: activityId});
                    const start_date = await database.updateActivity(activityId, activity, true);

                    let group_ids = [];
                    let contest_ids = [];
                    const relevantContests = await database.getUserContestsForDate(athlete, start_date);

                    for (const row of relevantContests) {
                        group_ids.push(row.group_id);
                        contest_ids.push(row.contest_id);
                    }
                    await database.relateActivityToContest(athlete, activityId, group_ids, contest_ids);
                }

                if (event === "delete") {
                    await database.deleteActivity(activityId);
                }
            }
        } else {
            console.log("Webhook event from unauthorized client");
        }
    } catch (e) {
        console.error(e);
    }
};
