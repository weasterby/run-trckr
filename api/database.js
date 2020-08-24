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
        name: results.rows[0].completed ? results.rows[0].name : null
    }

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
