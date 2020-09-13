const clientPool = require('../../db/clientPool');

let pg = require('pg');
require('pg-spice').patch(pg);

module.exports.getActiveChallenges = async function(){
    const backgroundClient = await clientPool.getNewClient(true);
    const client = backgroundClient.client;
    await client.query("BEGIN;");
    let results;
    try {
        results = await client.query("SELECT challenge.*, row_to_json(template.*) AS \"template_details\" FROM challenges AS challenge\n" +
            "LEFT JOIN challenge_templates AS template ON challenge.template = template.id\n" +
            "WHERE challenge.auto_apply_after IS NOT NULL AND challenge.auto_apply_after <= CURRENT_TIMESTAMP AND\n" +
            "challenge.start_date <= CURRENT_TIMESTAMP AND challenge.end_date >= (CURRENT_TIMESTAMP - interval '3 day');");
        await client.query("COMMIT;");
    }
    catch (e){
        console.error(e);
        await client.query("ROLLBACK;");
        throw(e);
    }
    finally {
        backgroundClient.releaseClient();
    }

    if (results && results.rows)
        return results.rows;
    else
        return [];
};

module.exports.runQueryWithParams = async function(query, params){
    const backgroundClient = await clientPool.getNewClient(true);
    const client = backgroundClient.client;
    await client.query("BEGIN;");
    let results;
    try {
        results = await client.execute(query, params);
        await client.query("COMMIT;");
    }
    catch (e){
        console.error(e);
        await client.query("ROLLBACK;");
        throw(e);
    }
    finally {
        backgroundClient.releaseClient();
    }

    if (results && results.rows)
        return results.rows;
    else
        return [];
};

module.exports.awardChallengesInBulk = async function (group, contest, challenge, award, points, users, activities) {
    let query;
    let values;
    if (activities && activities.length > 0) {
        query = "INSERT INTO user_challenges(\"group\", contest, challenge, award, points, \"user\", activity)\n" +
            "VALUES($1, $2, $3, $4, $5, UNNEST($6::INT[]), UNNEST($7::BIGINT[]))\n" +
            "ON CONFLICT (\"user\", challenge) DO NOTHING;";
        values = [group, contest, challenge, award, points, users, activities];
    } else {
        query = "INSERT INTO user_challenges(\"group\", contest, challenge, award, points, \"user\")\n" +
            "VALUES($1, $2, $3, $4, $5, UNNEST($6::INT[]))\n" +
            "ON CONFLICT (\"user\", challenge) DO NOTHING;"
        values = [group, contest, challenge, award, points, users];
    }


    const backgroundClient = await clientPool.getNewClient(true);
    const client = backgroundClient.client;
    await client.query("BEGIN;");
    try {
        await client.execute(query, values);
        await client.query("COMMIT;");
    }
    catch (e){
        console.error(e);
        await client.query("ROLLBACK;");
        throw(e);
    }
    finally {
        backgroundClient.releaseClient();
    }

    return null;
};