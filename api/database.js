const { Pool } = require('pg');
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 10
});

module.exports.createUser = async function(profile){
    const client = await pool.connect();
    await client.query("BEGIN;");
    let results;
    try {
        results = await client.query("INSERT INTO users(id, name, last_login) VALUES ($1, $2, CURRENT_TIMESTAMP)\n" +
            "ON CONFLICT (id) DO UPDATE\n" +
            "SET last_login = (NOW() AT TIME ZONE 'utc')\n" +
            "RETURNING id, name, completed;",
            [profile.id, profile.displayName]);
        await client.query("COMMIT;");
    }
    catch (e){
        console.error(e);
        await client.query("ROLLBACK;");
        throw(e);
    }
    finally {
        client.release();
    }

    return {
        id: results.rows[0].id,
        name: results.rows[0].completed ? results.rows[0].name : null,
        active_group: null,
        active_contest: null,
        active_role: null
    }

};

module.exports.getRole = async function(user_id, group_id, contest_id) {
    const client = await pool.connect();
    await client.query("BEGIN;");
    let results;
    try {
        results = await client.query("SELECT role FROM user_contests WHERE \"user\" = $1 AND \"group\" = $2 AND contest = $3",
            [user_id, group_id, contest_id]);
        await client.query("COMMIT;");
    }
    catch (e) {
        console.error(e);
        await client.query("ROLLBACK;");
        throw(e);
    }
    finally {
        client.release();
    }
    if (results !== undefined && results.rows.length > 0)
        return results.rows[0].role;
    else
        return null;
};

module.exports.getUser = async function(id) {
    const client = await pool.connect();
    await client.query("BEGIN;");
    let results;
    try {
        results = await client.query("SELECT id, name, email, created, completed, strava_connected, updated FROM users WHERE id = $1", [id]);
        await client.query("COMMIT;");
    }
    catch (e) {
        console.error(e);
        await client.query("ROLLBACK;");
        throw(e);
    }
    finally {
        client.release();
    }
    if (results !== undefined)
        return results.rows[0];
    else
        throw new Error("user not found");
};

module.exports.getUserGroups = async function(id) {
    const client = await pool.connect();
    await client.query("BEGIN;");
    let results;
    try {
        results = await client.query("SELECT contest.group_id, contest.contest_id, contest.name, contest.group_name, contest.description, \"user\".role FROM\n" +
            "contests AS contest INNER JOIN user_contests AS \"user\" on contest.group_id = \"user\".\"group\" and contest.contest_id = \"user\".contest\n" +
            "WHERE \"user\".\"user\" = $1;", [id]);
        await client.query("COMMIT;");
    }
    catch (e) {
        console.error(e);
        await client.query("ROLLBACK;");
        throw(e);
    }
    finally {
        client.release();
    }
    if (results !== undefined)
        return results.rows;
    else
        return {};
};

module.exports.updateUser = async function(id, data) {
    let queryString = "UPDATE users SET ";
    const keys = Object.keys(data);
    let values = Object.values(data);
    values.push(id);
    let i;
    for(i = 0; i < keys.length; i++) {
        queryString += keys[i] + " = $" + (i+1) + ", ";
    }
    queryString += "completed = true, updated = (NOW() AT TIME ZONE 'utc') WHERE id = $" + (i+1);
    console.debug(queryString);
    console.debug("with values");
    console.debug(values);

    const client = await pool.connect();
    await client.query("BEGIN;");
    try {
        await client.query(queryString, values);
        await client.query("COMMIT;");
    }
    catch (e) {
        console.error(e);
        await client.query("ROLLBACK;");
        throw(e);
    }
    finally {
        client.release();
    }

    return true;

};

module.exports.getGroupActivities = async function(group_id, contest_id) {
    const client = await pool.connect();
    await client.query("BEGIN;");
    let results;
    try {
        results = await client.query("SELECT activity.name, activity.start_date, activity.start_date_local, activity.timezone, " +
            "activity.distance, activity.distance_mi, activity.distance_km, activity.moving_time, activity.elapsed_time," +
            "activity.average_speed, activity.total_elevation_gain, activity.type, activity.average_pace_standard, \"user\".name AS athlete FROM\n" +
            "contest_activities AS contest\n" +
            "LEFT JOIN activities AS activity\n" +
            "ON contest.activity = activity.id\n" +
            "LEFT JOIN users AS \"user\"\n" +
            "ON activity.\"user\" = \"user\".id\n" +
            "WHERE contest.contest = $1 AND contest.\"group\" = $2 AND activity.complete = true\n" +
            "ORDER BY start_date_local DESC;", [contest_id, group_id]);
        await client.query("COMMIT;");
    }
    catch (e) {
        console.error(e);
        await client.query("ROLLBACK;");
        throw(e);
    }
    finally {
        client.release();
    }
    if (results !== undefined)
        return results.rows;
    else
        return {};
};

module.exports.getMyGroupActivities = async function(group_id, contest_id, user_id) {
    const client = await pool.connect();
    await client.query("BEGIN;");
    let results;
    try {
        results = await client.query("SELECT activity.name, activity.start_date, activity.start_date_local, activity.timezone, " +
            "activity.distance, activity.distance_mi, activity.distance_km, activity.moving_time, activity.elapsed_time," +
            "activity.average_speed, activity.total_elevation_gain, activity.type, activity.average_pace_standard, \"user\".name AS athlete FROM\n" +
            "contest_activities AS contest\n" +
            "LEFT JOIN activities AS activity\n" +
            "ON contest.activity = activity.id\n" +
            "LEFT JOIN users AS \"user\"\n" +
            "ON activity.\"user\" = \"user\".id\n" +
            "WHERE contest.contest = $1 AND contest.\"group\" = $2 AND contest.\"user\" = $3 AND activity.complete = true\n" +
            "ORDER BY start_date_local DESC;", [contest_id, group_id, user_id]);
        await client.query("COMMIT;");
    }
    catch (e) {
        console.error(e);
        await client.query("ROLLBACK;");
        throw(e);
    }
    finally {
        client.release();
    }
    if (results !== undefined)
        return results.rows;
    else
        return {};
};

module.exports.getGroupLeaderBoard = async function(group_id, contest_id) {
    const client = await pool.connect();
    await client.query("BEGIN;");
    let results;
    try {
        results = await client.query("SELECT \"user\".name, SUM(challenge.points) AS total_points FROM\n" +
            "user_challenges AS challenge\n" +
            "LEFT JOIN users AS \"user\" ON challenge.\"user\" = \"user\".id\n" +
            "WHERE challenge.\"group\" = $1 AND challenge.contest = $2\n" +
            "GROUP BY challenge.\"user\", \"user\".name\n" +
            "ORDER BY total_points DESC;", [group_id, contest_id]);
        await client.query("COMMIT;");
    }
    catch (e) {
        console.error(e);
        await client.query("ROLLBACK;");
        throw(e);
    }
    finally {
        client.release();
    }
    if (results !== undefined)
        return results.rows;
    else
        return {};
};

module.exports.getCurrentContests = async function(group_id, contest_id, timestamp) {
    const client = await pool.connect();
    await client.query("BEGIN;");
    let results;
    try {
        results = await client.query("SELECT name, description, start_date, end_date, awards\n" +
            "FROM challenges WHERE \"group\" = $1 AND contest = $2\n" +
            "AND start_date < $3 AND end_date > $3;", [group_id, contest_id, timestamp]);
        await client.query("COMMIT;");
    }
    catch (e) {
        console.error(e);
        await client.query("ROLLBACK;");
        throw(e);
    }
    finally {
        client.release();
    }
    if (results !== undefined)
        return results.rows;
    else
        return {};
};