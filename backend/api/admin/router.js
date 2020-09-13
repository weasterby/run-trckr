const database = require("./database");

module.exports = function (app) {
    app.post("/api/admin/apply_challenges", async function(req, res) {
        if(req.headers.authorization && req.headers.authorization === ("Bearer " + process.env.ADMIN_API_TOKEN)){
            console.log("Applying challenges");
            res.send({success: true, message: "Applying challenges"})

            try {
                const daily_contests = await database.getActiveChallenges();
                for (const contest of daily_contests) {
                    try {
                        let params = contest.challenge_params || {};
                        params.start_date = contest.start_date;
                        params.end_date = contest.end_date;
                        params.group_id = contest.group;
                        params.contest_id = contest.contest;

                        let award = null;
                        let points = 0;
                        if(contest.awards && (contest.default_award || contest.default_award === 0) && contest.awards.length > contest.default_award){
                            award = contest.default_award;
                            points = contest.awards[contest.default_award].points;
                        }

                        if (contest.template_details.award_type === "Activity") {
                            const activities = await database.runQueryWithParams(contest.template_details.activity_query, params);
                            let activity_ids = [];
                            let user_ids = [];
                            for (const activity of activities) {
                                activity_ids.push(activity.id);
                                user_ids.push(activity.user);
                            }
                            await database.awardChallengesInBulk(contest.group, contest.contest, contest.id, award, points, user_ids, activity_ids);
                        }
                        else if (contest.template_details.award_type === "User") {
                            const users = await database.runQueryWithParams(contest.template_details.user_query, params);
                            let user_ids = [];
                            for (const user of users) {
                                user_ids.push(user.user);
                            }
                            await database.awardChallengesInBulk(contest.group, contest.contest, contest.id, award, points, user_ids);
                        }
                    } catch (e) {}
                }
            } catch (e) {}

        } else {
            res.status(403);
            res.send({success: false, message: "Authorization credentials invalid"})
        }
    })
};