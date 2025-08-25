const pool = require('../services/db');

module.exports.selectAll = (callback) =>
    {
        const SQLSTATMENT = `
        SELECT * FROM Player;
        `;
    
        pool.query(SQLSTATMENT, callback);
    }

module.exports.selectPlayerById = (data, callback) =>
    {
        const SQLSTATMENT = `
        SELECT * FROM Player
        WHERE id = ?;
        `;
        const VALUES = [data.id];
        
        pool.query(SQLSTATMENT, VALUES, callback);
    }

module.exports.deletePlayerById = (data, callback) =>
    {
        const SQLSTATMENT = `
        DELETE FROM player
        WHERE id = ?;
        `;
        const VALUES = [data.id];
        
        pool.query(SQLSTATMENT, VALUES, callback);
    }

module.exports.insertPlayer = (data, callback) =>
    {
        const SQLSTATMENT = `
        INSERT INTO Player (user_id, name, level, class)
        VALUES (?, ?, 1, ?);
        `;
    const VALUES = [data.user_id, data.name, data.class];
        
    pool.query(SQLSTATMENT, VALUES, callback);
    }    

module.exports.selectQuestAvailable = (data, callback) =>
    {
        const SQLSTATMENT = `
        SELECT q.*
        FROM quests q
        JOIN Player p ON p.id = ?
        WHERE p.level >= q.level_required;
        `;
        const VALUES = [data.id];
        
        pool.query(SQLSTATMENT, VALUES, callback);
    }
    
module.exports.selectArmorByPlayerID = (data, callback) =>
    {
        const SQLSTATMENT = `
        SELECT armor_id
        FROM player
        WHERE id = ?
        `;
        const VALUES = [data.id];
        
        pool.query(SQLSTATMENT, VALUES, callback);
    }    

module.exports.selectWeaponByPlayerID = (data, callback) =>
    {
        const SQLSTATMENT = `
        SELECT weapon_id
        FROM player
        WHERE id = ?
        `;
        const VALUES = [data.id];
                
        pool.query(SQLSTATMENT, VALUES, callback);
    }            

module.exports.insertLevel = (data, callback) => 
    {
        // First, fetch the skillpoints for the given challenge_id
        const getLevelSQL = `SELECT level_reward FROM quests WHERE quests_id = ?`;
            
        pool.query(getLevelSQL, [data.id], (err, results) => {
            if (err) {
                callback(err, null);
                return;
            }
            
            if (results.length === 0) {
                callback({ message: "Quest not found" }, null);
                return;
            }
            
            let level = results[0].level_reward; // Award the quest level 
            
            // Now, update the user's skillpoints
            const updateSQL = `
            START TRANSACTION; 
            UPDATE Player
            SET level = level + ?
            WHERE user_id = ? and id = ?;
            COMMIT;
            `;
            
            pool.query(updateSQL, [level, data.user_id, data.player_id], callback);
        });
    };
    
    module.exports.updateEquipmentPlayer = (data, callback) => {
        // Step 1: Get player's class and level
        const getPlayerQuery = `SELECT class, level FROM Player WHERE id = ? AND user_id = ?`;
        
        pool.query(getPlayerQuery, [data.id, data.user_id], (err, playerResult) => {
            if (err) return callback(err);
    
            if (playerResult.length === 0) {
                return callback({ status: 404, message: "Player not found" });
            }
    
            const playerClass = playerResult[0].class;
            const playerLevel = playerResult[0].level;
    
            // Step 2: Get equipment's required class and level
            const getEquipmentQuery = `
                SELECT c.name as class_name, e.level_required
                FROM class c 
                JOIN equipment e ON c.number = e.classID 
                WHERE e.id = (SELECT equipment_id FROM user_inventory WHERE inventory_id = ?)
            `;
    
            pool.query(getEquipmentQuery, [data.inventory_id], (err, equipResult) => {
                if (err) return callback(err);
    
                if (equipResult.length === 0) {
                    return callback({ status: 404, message: "Equipment not found" });
                }
    
                const equipmentClass = equipResult[0].class_name;
                const requiredLevel = equipResult[0].level_required;
    
                // Step 3: Validate class match
                if (playerClass !== equipmentClass) {
                    return callback({ status: 400, message: "Class mismatch: Player cannot equip this item" });
                }
    
                // Step 4: Validate level requirement
                if (playerLevel < requiredLevel) {
                    return callback({ status: 400, message: `Level too low: Required level ${requiredLevel}, but player is level ${playerLevel}` });
                }
    
                // Step 5: Proceed with the equipment update if validation passes
                const SQLSTATEMENT = `
                -- Insert previous weapon back into inventory only if the new equipment is a weapon (odd ID)
                INSERT INTO user_inventory (equipment_id, user_id)
                SELECT weapon_id, user_id
                FROM Player
                WHERE id = ? AND user_id = ? 
                AND weapon_id IS NOT NULL 
                AND weapon_id != (SELECT e.id FROM equipment e 
                                  JOIN user_inventory ui ON e.id = ui.equipment_id 
                                  WHERE ui.inventory_id = ?)
                AND (SELECT e.id FROM equipment e 
                     JOIN user_inventory ui ON e.id = ui.equipment_id 
                     WHERE ui.inventory_id = ?) % 2 = 1 -- New equipment is a weapon
                LIMIT 1;
    
                -- Insert previous armor back into inventory only if the new equipment is an armor (even ID)
                INSERT INTO user_inventory (equipment_id, user_id)
                SELECT armor_id, user_id
                FROM Player
                WHERE id = ? AND user_id = ? 
                AND armor_id IS NOT NULL 
                AND armor_id != (SELECT e.id FROM equipment e 
                                  JOIN user_inventory ui ON e.id = ui.equipment_id 
                                  WHERE ui.inventory_id = ?)
                AND (SELECT e.id FROM equipment e 
                     JOIN user_inventory ui ON e.id = ui.equipment_id 
                     WHERE ui.inventory_id = ?) % 2 = 0 -- New equipment is an armor
                LIMIT 1;
    
                -- Update player's weapon and armor based on conditions
                UPDATE Player
                SET 
                    weapon_id = CASE 
                        WHEN (
                            (SELECT c.name FROM class c 
                             JOIN equipment e ON c.number = e.classID 
                             JOIN user_inventory ui ON e.id = ui.equipment_id 
                             WHERE ui.inventory_id = ?) 
                            = Player.class 
                        ) 
                        AND (
                            (SELECT e.level_required FROM equipment e 
                             JOIN user_inventory ui ON e.id = ui.equipment_id 
                             WHERE ui.inventory_id = ?) 
                            <= Player.level
                        ) 
                        AND (
                            (SELECT e.id FROM equipment e 
                             JOIN user_inventory ui ON e.id = ui.equipment_id 
                             WHERE ui.inventory_id = ?) % 2 = 1
                        )
                        THEN (SELECT e.id FROM equipment e 
                              JOIN user_inventory ui ON e.id = ui.equipment_id 
                              WHERE ui.inventory_id = ?)
                        ELSE weapon_id 
                    END,
            
                    armor_id = CASE 
                        WHEN (
                            (SELECT c.name FROM class c 
                             JOIN equipment e ON c.number = e.classID 
                             JOIN user_inventory ui ON e.id = ui.equipment_id 
                             WHERE ui.inventory_id = ?) 
                            = Player.class 
                        ) 
                        AND (
                    (SELECT e.level_required FROM equipment e 
                     JOIN user_inventory ui ON e.id = ui.equipment_id 
                     WHERE ui.inventory_id = ?) 
                    <= Player.level
                        ) 
                        AND (
                            (SELECT e.id FROM equipment e 
                             JOIN user_inventory ui ON e.id = ui.equipment_id 
                             WHERE ui.inventory_id = ?) % 2 = 0
                        )
                        THEN (SELECT e.id FROM equipment e 
                             JOIN user_inventory ui ON e.id = ui.equipment_id 
                             WHERE ui.inventory_id = ?)
                        ELSE armor_id 
                    END
                WHERE id = ? AND user_id = ?;
    
                -- Delete from inventory only if it's actually equipped
                DELETE FROM user_inventory
                WHERE inventory_id = ?
                AND (
                    equipment_id = (SELECT weapon_id FROM Player WHERE id = ? AND weapon_id IS NOT NULL)
                    OR equipment_id = (SELECT armor_id FROM Player WHERE id = ? AND armor_id IS NOT NULL)
                );
                `;
    
                const VALUES = [
                    data.id, data.user_id, data.inventory_id, data.inventory_id,
                    data.id, data.user_id, data.inventory_id, data.inventory_id,
                    data.inventory_id, data.inventory_id, data.inventory_id, data.inventory_id,
                    data.inventory_id, data.inventory_id, data.inventory_id, data.inventory_id,
                    data.id, data.user_id,
                    data.inventory_id, data.id, data.id
                ];
                
                pool.query(SQLSTATEMENT, VALUES, callback);
            });
        });
    };
    
    
    module.exports.updatePlayerName = (data, callback) =>
        {
            const SQLSTATMENT = `
            UPDATE Player
            SET name = ?
            WHERE id = ?;
            `;
        const VALUES = [data.name, data.id];
        
        pool.query(SQLSTATMENT, VALUES, callback);
        }

        module.exports.selectTopTen = (callback) =>
            {
                const SQLSTATMENT = `
                SELECT p.name, p.class, p.level, 
                       COALESCE(e1.name, 'None') AS weapon, 
                       COALESCE(e2.name, 'None') AS armor
                FROM Player p
                LEFT JOIN equipment e1 ON p.weapon_id = e1.id  -- LEFT JOIN to include players without weapons
                LEFT JOIN equipment e2 ON p.armor_id = e2.id   -- LEFT JOIN to include players without armor
                ORDER BY p.level DESC
                LIMIT 10;
                `;
            
                pool.query(SQLSTATMENT, callback);
            }
        