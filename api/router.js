const database = require("./database");
const jsonValidator = require("./jsonValidator")();
const auth = require("./authorization");

module.exports = function (app) {

    app.get("/api/user", async function (req, res) {
        try {
            const id = req.user.id;
            if (id !== undefined) {
                console.log("GET /api/user for user ID", id);
                const results = await database.getUser(id);
                const groups = await database.getUserGroups(id);
                results.groups = groups;
                console.log(results);
                res.send({success: true, data: results});
            } else {
                res.status(401);
                res.send({success: false, message: "User not found"});
            }
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
            if (id !== undefined) {
                const id = req.user.id;
                console.log("GET /api/user for user ID", id);
                const groups = await database.getUserGroups(id);
                res.send({success: true, data: groups});
            } else {
                res.status(400);
                res.send({success: false, message: "Invalid data"});
            }
        } catch (e) {
            res.status(500);
            res.send({success: false, message: "Unknown error"});
        }
    });

    app.get("/api/group/:group_id/:contest_id/activities/all", async function (req, res) {
        try {
            const id = req.user.id;
            if (id !== undefined && await auth.checkGroupAuth("member", req.user, req.params.group_id, req.params.contest_id)) {
                console.log("GET group activities for group", req.params.group_id, req.params.contest_id);
                const groups = await database.getGroupActivities(req.params.group_id, req.params.contest_id);
                res.send({success: true, data: groups});
            } else {
                console.debug("Unauthorized");
                res.status(401);
                res.send({success: false, message: "User not in group"});
            }
        } catch (e) {
            res.status(500);
            res.send({success: false, message: "Unknown error"});
        }
    });

    app.get("/api/group/:group_id/:contest_id/activities/me", async function (req, res) {
        try {
            const id = req.user.id;
            if (id !== undefined && await auth.checkGroupAuth("member", req.user, req.params.group_id, req.params.contest_id)) {
                console.log("GET group activities for group", req.params.group_id, req.params.contest_id);
                const groups = await database.getMyGroupActivities(req.params.group_id, req.params.contest_id, id);
                res.send({success: true, data: groups});
            } else {
                console.debug("Unauthorized");
                res.status(401);
                res.send({success: false, message: "User not in group"});
            }
        } catch (e) {
            res.status(500);
            res.send({success: false, message: "Unknown error"});
        }
    });

    app.get("/api/group/:group_id/:contest_id/leaderboard", async function (req, res) {
        try {
            const id = req.user.id;
            if (id !== undefined && await auth.checkGroupAuth("member", req.user, req.params.group_id, req.params.contest_id)) {
                console.log("GET leader board for group", req.params.group_id, req.params.contest_id);
                const leaderboard = await database.getGroupLeaderBoard(req.params.group_id, req.params.contest_id);
                res.send({success: true, data: leaderboard});
            } else {
                console.debug("Unauthorized");
                res.status(401);
                res.send({success: false, message: "User not in group"});
            }
        } catch (e) {
            res.status(500);
            res.send({success: false, message: "Unknown error"});
        }
    });

    app.get("/api/group/:group_id/:contest_id/challenges", async function (req, res) {
        try {
            const id = req.user.id;
            if (id !== undefined && await auth.checkGroupAuth("member", req.user, req.params.group_id, req.params.contest_id)) {
                const d = new Date();
                console.log("GET leader board for group", req.params.group_id, req.params.contest_id);
                const leaderboard = await database.getCurrentContests(req.params.group_id, req.params.contest_id, d.toISOString());
                res.send({success: true, data: leaderboard});
            } else {
                console.debug("Unauthorized");
                res.status(401);
                res.send({success: false, message: "User not in group"});
            }
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