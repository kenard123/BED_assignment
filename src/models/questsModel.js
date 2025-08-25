const pool = require('../services/db');

module.exports.selectAllQuests = (callback) =>
    {
        const SQLSTATMENT = `
        SELECT * FROM quests;
        `;
    
        pool.query(SQLSTATMENT, callback);
    }

module.exports.selectQuestsById = (data, callback) =>
    {
        const SQLSTATMENT = `
        SELECT * FROM quests
        WHERE quests_id = ?;
        `;
        const VALUES = [data.id];
        
        pool.query(SQLSTATMENT, VALUES, callback);
    }

    module.exports.insertCompleteRecord = (data, callback) =>
        {
            const SQLSTATMENT = `
            INSERT INTO PlayerCompletion (user_id, player_id, creation_date, quests_id)
            VALUES (?, ?, ?, ?);
            `;
        const VALUES = [data.user_id, data.player_id, data.creation_date, data.id];
            
        pool.query(SQLSTATMENT, VALUES, callback);
        }    

 // Fetch the required level for a quest
module.exports.getQuestLevelRequirement = (questId, callback) => {
    const SQL = `SELECT level_required FROM quests WHERE quests_id = ?`;
    pool.query(SQL, [questId], callback);
};

// Fetch the player's level
module.exports.getPlayerLevel = (userId, playerId, callback) => {
    const SQL = `SELECT level FROM Player WHERE user_id = ? AND id = ?`;
    pool.query(SQL, [userId, playerId], callback);
};       