const database = require('./database');

module.exports.checkGroupAuth = async function(require, user, group_id, contest_id){
    let role;
    if(user.active_group === group_id && user.active_contest === contest_id) {
        console.debug("Found cached group for User", user.id);
        role = user.active_role.toString().toLowerCase();
    } else {
        console.debug("Checking database for group permissions for user", user.id)
        let foundRole = await database.getRole(user.id, group_id, contest_id);
        if (foundRole !== null) {
            role = foundRole.toString().toLowerCase();
            user.active_role = foundRole;
            user.active_group = group_id;
            user.active_contest = contest_id;
        }
    }

    let result = false;
    switch (require) {
        case "owner":
            result = role === "owner";
            break;

        case "admin":
            result = role === "owner" || role === "admin";
            break;

        case "member":
            result = role === "owner" || role === "admin" || role === "member";
            break;

        default:
            result = false;
            break;
    }
    return result;
};

