const pool = require('../services/db');

module.exports.insertEquipment = (data, callback) =>
    {
        const SQLSTATMENT = `
        INSERT INTO equipment (name, classID, level_required, hp, atk, def, skillpoints)
        VALUES (?, ?, ?, ?, ?, ?, ?);
        `;
    const VALUES = [data.name, data.classID, data.level_required, data.hp, data.atk, data.def, data.skillpoints];
    
    pool.query(SQLSTATMENT, VALUES, callback);
    }

module.exports.selectAll = (callback) =>
    {
        const SQLSTATMENT = `
        SELECT * FROM equipment;
        `;
    
        pool.query(SQLSTATMENT, callback);
    }

module.exports.selectEquipmentByID = (data, callback) =>
    {
        const SQLSTATMENT = `
        SELECT * FROM equipment
        WHERE id = ?;
        `;
        const VALUES = [data.id];
    
        pool.query(SQLSTATMENT, VALUES, callback);
    }

module.exports.deleteByNumber = (data, callback) =>
    {
        const SQLSTATMENT = `
        DELETE FROM equipment
        WHERE id = ?;
        `;
    const VALUES = [data.number];
    
    pool.query(SQLSTATMENT, VALUES, callback);
    }

    module.exports.insertPurchase = (data, callback) => {
        const GET_EQUIPMENT_COST_SQL = `SELECT skillpoints FROM equipment WHERE id = ?`;
    
        pool.query(GET_EQUIPMENT_COST_SQL, [data.id], (error, results) => {
            if (error) return callback(error, null);
            if (results.length === 0) return callback({ message: `Error: Equipment ${data.id} not found.` }, null);
    
            const cost = results[0].skillpoints;
    
            const CHECK_SKILLPOINTS_SQL = `SELECT skillpoints FROM User WHERE user_id = ?`;
            pool.query(CHECK_SKILLPOINTS_SQL, [data.user_id], (error, results) => {
                if (error) return callback(error, null);
                if (results.length === 0) return callback({ message: `Error: User ${data.user_id} not found.` }, null);
    
                const userSkillPoints = results[0].skillpoints;
                if (userSkillPoints < cost) {
                    return callback({ message: `Error: User ${data.user_id} does not have enough skill points. Please complete challenge to earn more skillpoints` }, null);
                }
    
                // Start Transaction
                const SQLSTATEMENT = `
                    START TRANSACTION;
    
                    UPDATE User 
                    SET skillpoints = skillpoints - ?
                    WHERE user_id = ? AND skillpoints >= ?;
    
                    INSERT INTO user_inventory (user_id, equipment_id)
                    VALUES (?, ?);
    
                    COMMIT;
                `;
    
                const VALUES = [
                    cost, data.user_id, cost, // Deduct skill points
                    data.user_id, data.id // Add equipment to inventory
                ];
    
                pool.query(SQLSTATEMENT, VALUES, (error, results) => {
                    if (error) {
                        // If any error occurs, rollback the transaction
                        const ROLLBACK_SQL = `ROLLBACK;`;
                        pool.query(ROLLBACK_SQL, (rollbackError) => {
                            if (rollbackError) return callback(rollbackError, null);
                            return callback(error, null);
                        });
                    } else {
                        // If everything goes well, return the success response
                        callback(null, results);
                    }
                });
            });
        });
    };
    