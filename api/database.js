const { Pool } = require('pg');
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 10
});

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
    }
    finally {
        client.release();
    }
    if (results !== undefined)
        return results.rows[0];
    else
        return {};
};

module.exports.getUserGroups = async function(id) {
    const client = await pool.connect();
    await client.query("BEGIN;");
    let results;
    try {
        results = await client.query("SELECT contest.group_id, contest.contest_id, contest.name, contest.group_name, contest.description, \"user\".role FROM\n" +
            "contests AS contest INNER JOIN user_contests AS \"user\" on contest.group_id = \"user\".\"group\" and contest.contest_id = \"user\".contest\n" +
            "WHERE \"user\".\"id\" = $1;", [id]);
        await client.query("COMMIT;");
    }
    catch (e) {
        console.error(e);
        await client.query("ROLLBACK;");
    }
    finally {
        client.release();
    }
    if (results !== undefined)
        return results.rows;
    else
        return {};
};
