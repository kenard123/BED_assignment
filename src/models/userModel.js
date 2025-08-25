const pool = require('../services/db');

module.exports.login = (data, callback) => {

    const SQLSTATEMENT = `
        SELECT *
        FROM User
        WHERE username = ?;
    `;

    VALUES = [data.username];
    
    pool.query(SQLSTATEMENT, VALUES, callback);
};

module.exports.readUserByEmailAndUsername = (data, callback) => {

    const SQLSTATEMENT = `
        SELECT User.email
        FROM User  
        WHERE email = ?;

        SELECT User.username
        FROM User
        WHERE username = ?;
    `;

    VALUES = [data.email, data.username];

    pool.query(SQLSTATEMENT, VALUES, callback);
};

module.exports.register = (data, callback) => {

    const SQLSTATEMENT = `
        INSERT INTO User (username, email, password)
        VALUES (?, ?, ?);
    `;

    VALUES = [data.username, data.email, data.password];

    pool.query(SQLSTATEMENT, VALUES, callback);
};

module.exports.insertNewUser = (data, callback) =>
    {
        const SQLSTATMENT = `
        INSERT INTO User (username, skillpoints)
        VALUES (?, ?);
        `;
    const VALUES = [data.username, data.skillpoints];
    
    pool.query(SQLSTATMENT, VALUES, callback);
    }
    
module.exports.selectAll = (callback) =>
{
    const SQLSTATMENT = `
    SELECT * FROM User;
    `;

    pool.query(SQLSTATMENT, callback);
}

module.exports.selectUserById = (data, callback) =>
    {
        const SQLSTATMENT = `
        SELECT * FROM User
        WHERE user_id = ?;
        `;
        const VALUES = [data.id];
        
        pool.query(SQLSTATMENT, VALUES, callback);
    }

module.exports.updateById = (data, callback) =>
    {
        const SQLSTATMENT = `
        UPDATE User
        SET username = ?, skillpoints = ?
        WHERE user_id = ?;
        `;
    const VALUES = [data.username, data.skillpoints, data.id];
    
    pool.query(SQLSTATMENT, VALUES, callback);
    }

module.exports.selectEquipmentAvailable = (data, callback) =>
    {
        const SQLSTATMENT = `
        SELECT e.*
        FROM equipment e
        JOIN User u ON u.user_id = ?
        WHERE u.skillpoints >= e.skillpoints;
        `;
        const VALUES = [data.id];
        
        pool.query(SQLSTATMENT, VALUES, callback);
    }

    module.exports.selectPlayerById = (data, callback) =>
        {
            const SQLSTATMENT = `
            SELECT * FROM player
            WHERE user_id = ?;
            `;
            const VALUES = [data.id];
            
            pool.query(SQLSTATMENT, VALUES, callback);
        }     

module.exports.insertSkillpoints = (data, callback) => {
    // First, fetch the skillpoints for the given challenge_id
    const getSkillpointsSQL = `SELECT skillpoints FROM fitnesschallenge WHERE challenge_id = ?`;

    pool.query(getSkillpointsSQL, [data.id], (err, results) => {
        if (err) {
            callback(err, null);
            return;
        }

        if (results.length === 0) {
            callback({ message: "Challenge not found" }, null);
            return;
        }

        let skillpoints = 0;

        // If challenge completed, award challenge skillpoints, else award 5 skillpoints
        if (data.completed) {
            skillpoints = results[0].skillpoints; // Award the challenge's skillpoints
        } else {
            skillpoints = 5; // Award 5 skillpoints if challenge failed
        }

        // Now, update the user's skillpoints
        const updateSQL = `
            START TRANSACTION; 
            UPDATE User 
            SET skillpoints = skillpoints + ?
            WHERE user_id = ?;
            COMMIT;
        `;

        pool.query(updateSQL, [skillpoints, data.user_id], callback);
    });
};
