const database = require("./database");
const jsonValidator = require("./jsonValidator")()

module.exports = function (app) {

    app.get("/api/user", async function (req, res) {
        try {
            const id = req.user.id;
            console.log("GET /api/user for user ID", id);
            const results = await database.getUser(id);
            const groups = await database.getUserGroups(id);
            results.groups = groups;
            console.log(results);
            res.send({success: true, data: results});
        } catch (e) {
            res.status(500);
            res.send({success: false, message: "Unknown error"});
        }
    });

    app.put("/api/user", async function (req, res) {
        try {
            const id = req.user.id;
            if (id !== undefined) {
                if (jsonValidator.validate("userUpdate", req.body)) {
                    await database.updateUser(id, req.body);
                    res.send({success: true, data: null});
                } else {
                    res.status(400);
                    res.send({success: false, message: "Invalid data"});
                }
                res.send();
            } else {
                res.status(401);
                res.send({success: false, message: "User not found"});
            }
        } catch (e) {
            res.status(500);
            res.send({success: false, message: "Unknown error"});
        }

    });

    app.get("/api/user/groups", async function (req, res) {
        try {
            const id = req.user.id;
            console.log("GET /api/user for user ID", id);
            const groups = await database.getUserGroups(id);
            console.log(groups);
            res.send({success: true, data: groups});
        } catch (e) {
            res.status(500);
            res.send({success: false, message: "Unknown error"});
        }
    });

    app.all('/api/*', function (req, res) {
        res.status(404);
        res.send({success: false, message: "Invalid endpoint"})
    })

};