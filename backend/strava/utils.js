const database = require('./database');

module.exports.getAuthToken = async function(userId, stravaApi){
    let accessToken = null;

    try {
        const results = await database.getAccessToken(userId);
        if (results !== null && results.access_token !== null) {
            const currentTime = new Date(new Date().getTime() + 5 * 60000);
            const refreshTime = Date.parse(results.expires_at);
            if (refreshTime < currentTime) {
                console.debug("Refreshing access token for user", userId);
                const refresh = await stravaApi.oauth.refreshToken(results.refresh_token);
                await database.updateAccessToken(userId, refresh);
                accessToken = refresh.access_token;
            } else {
                accessToken = results.access_token;
            }
        }
    } catch (e) {
        console.error(e);
    }

    return accessToken;
};