const database = require("./database");

module.exports = function (app) {

    app.get("/api/user", async function (req, res) {
        const results = await database.getUser(req.query.id);
        const groups =  await database.getUserGroups(req.query.id);
        results.groups = groups;
        console.log(results);
        res.send(results);
    })

};