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

module.exports.getAccessToken = async function(id) {
    const foregroundClient = await clientPool.getNewClient(true);
    const client = foregroundClient.client;
    await client.query("BEGIN;");
    let results
    try {
        results = await client.query("SELECT access_token, refresh_token, expires_at FROM users WHERE id = $1",
            [id]);
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

    if(results !== null && results.rows.length > 0)
        return results.rows[0];
    else
        return null;
};

module.exports.updateAccessToken = async function(id, oauth) {
    const foregroundClient = await clientPool.getNewClient(true);
    const client = foregroundClient.client;
    await client.query("BEGIN;");
    try {
        await client.query("UPDATE users SET access_token = $2, \n" +
            "refresh_token = $3, expires_at = $4\n" +
            "WHERE id = $1",
            [id, oauth.access_token, oauth.refresh_token, new Date(oauth.expires_at * 1000).toISOString()]);
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

module.exports.createActivity = async function(activityId, userId) {
    const foregroundClient = await clientPool.getNewClient(true);
    const client = foregroundClient.client;
    await client.query("BEGIN;");
    try {
        await client.query("INSERT INTO activities(id, \"user\") \n" +
            "VALUES ($1, $2)\n" +
            "ON CONFLICT (id) DO NOTHING",
            [activityId, userId]);
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

module.exports.updateActivity = async function(id, activity, require_update) {
    const foregroundClient = await clientPool.getNewClient(true);
    const client = foregroundClient.client;
    await client.query("BEGIN;");
    let results;
    try {
        results = await client.query("UPDATE activities SET name = $1, description = $2, distance = $3, moving_time = $4, \n" +
            "elapsed_time = $5, total_elevation_gain = $6, elev_high = $7, elev_low = $8, type = $9, start_date = $10, \n" +
            "start_date_local = $11, timezone = $12, start_latlng = $13, end_latlng = $14, achievement_count = $15, \n" +
            "photo_count = $16, total_photo_count = $17, map = $18, manual = $19, workout_type = $20, average_speed = $21,\n" +
            "max_speed = $22, photos = $23, segment_count = $24, complete = true, require_update = $25,\n" +
            "updated = CURRENT_TIMESTAMP WHERE id = $26 RETURNING start_date_local;",
            [activity.name, activity.description, activity.distance, activity.moving_time, activity.elapsed_time,
                activity.total_elevation_gain, activity.elev_high, activity.elev_low, activity.type, activity.start_date,
                activity.start_date_local, activity.timezone, activity.start_latlng, activity.end_latlng, activity.achievement_count,
                activity.photo_count, activity.total_photo_count, activity.map, activity.manual, activity.workout_type,
                activity.average_speed, activity.max_speed, activity.photos, activity.segment_efforts.length, require_update,
            id]);
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

    if (results !== undefined && results.rows.length > 0)
        return results.rows[0].start_date_local;
};

module.exports.deleteActivity = async function(id) {
    const foregroundClient = await clientPool.getNewClient(true);
    const client = foregroundClient.client;
    await client.query("BEGIN;");
    try {
        await client.query("DELETE FROM activities" +
            "WHERE id = $1",
            [id]);
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

module.exports.getUserContestsForDate = async function(id, date) {
    const foregroundClient = await clientPool.getNewClient(true);
    const client = foregroundClient.client;
    await client.query("BEGIN;");
    let results;
    try {
        results = await client.query("SELECT contests.group_id, contests.contest_id FROM user_contests\n" +
            "LEFT JOIN contests on user_contests.\"group\" = contests.group_id and user_contests.contest = contests.contest_id\n" +
            "WHERE user_contests.\"user\" = $1 AND contests.start_date < $2 AND contests.end_date > $2;",
            [id, date]);
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

    if (results !== undefined && results.rows.length > 0)
        return results.rows;
};

module.exports.relateActivityToContest = async function(athlete, activity, group_ids, contest_ids) {
    const foregroundClient = await clientPool.getNewClient(true);
    const client = foregroundClient.client;
    await client.query("BEGIN;");
    try {
        await client.query(" INSERT INTO contest_activities(\"user\", \"group\", contest, activity)\n" +
            "VALUES ($1, unnest($2::INT[]), unnest($3::INT[]), $4)\n" +
            "ON CONFLICT (activity, contest, \"group\") DO NOTHING;",
            [athlete, group_ids, contest_ids, activity]);
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