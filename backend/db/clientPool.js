const maxConnections = {
    foreground: 10,
    background: 5
};
const warnAt = .75;

var pg = require("pg");
require("pg-essential").patch(pg);
const pools = {
    foreground: new pg.Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: {rejectUnauthorized: (process.env.DATABASE_REJECT_UNAUTHORIZED_SSL == "true") || false},
        max: maxConnections.foreground
    }),
    background: new pg.Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: {rejectUnauthorized: (process.env.DATABASE_REJECT_UNAUTHORIZED_SSL == "true") || false},
        max: maxConnections.background
    })
};


let currentConnections = {
    foreground: 0,
    background: 0
};

module.exports.getNewClient = async function(background) {
    let client;
    if(background){
        client = await pools.background.connect();
        currentConnections.background++;
        console.debug("Acquiring background client %i of %i", currentConnections.background, maxConnections.background);
        if(currentConnections.background / maxConnections.background >= warnAt)
            console.warn("%d utilization of background clients", currentConnections.background / maxConnections.background);
    } else {
        client = await pools.foreground.connect();
        currentConnections.foreground++;
        console.debug("Acquiring foreground client %i of %i", currentConnections.foreground, maxConnections.foreground);
        if(currentConnections.foreground / maxConnections.foreground >= warnAt)
            console.warn("%d utilization of background clients", currentConnections.foreground / maxConnections.foreground);
    }

    return {
        client: client,
        releaseClient: function () {
            client.release();
            if(background) {
                currentConnections.background--;
                console.debug("Releasing background client");
            } else {
                currentConnections.foreground--;
                console.debug("Releasing foreground client");
            }
        }
    }
};

module.exports.getPool = function (background) {
    if (background)
        return pools.background;
    else
        return pools.foreground;
};

