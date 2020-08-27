const clientPool = require('../db/clientPool');

module.exports.saveAccessToken = async function(oauth) {
    const foregroundClient = await clientPool.getNewClient(false);
    const client = foregroundClient.client;
    await client.query("BEGIN;");
    try {
        await client.query("INSERT INTO users(id, access_token, refresh_token, token_type, expires_at, updated, strava_connected)\n" +
            "VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP, true) ON CONFLICT (id) DO UPDATE \n" +
            "SET access_token = $2, refresh_token = $3, token_type = $4, expires_at = $5,\n" +
            "    updated = CURRENT_TIMESTAMP, strava_connected = true;",
            [oauth.athlete.id, oauth.access_token, oauth.refresh_token, oauth.token_type, new Date(oauth.expires_at * 1000).toISOString()]);
        await client.query("COMMIT;");
    }
    catch (e){
        console.error(e);
        await client.query("ROLLBACK;");
        throw(e);
    }
    finally {
        foregroundClient.releaseClient();
    }

    return null;
};