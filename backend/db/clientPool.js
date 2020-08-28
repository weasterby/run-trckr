const maxConnections = {
    foreground: 10,
    background: 5
};
const warnAt = .75;

const { Pool } = require('pg');
const pools = {
    foreground: new Pool({
        connectionString: process.env.DATABASE_URL,
        max: maxConnections.foreground
    }),
    background: new Pool({
        connectionString: process.env.DATABASE_URL,
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
