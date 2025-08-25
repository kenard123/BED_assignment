const model = require("../models/questsModel");

module.exports.readAllQuests = (req, res, next) =>
    {
        const callback = (error, results, fields) => {
            if (error) {
            console.error("Error readAllQuests:", error);
            res.status(500).json(error);
            } 
            else res.status(200).json(results);
        }
            
        model.selectAllQuests(callback);
    }

module.exports.readQuestsById = (req, res, next) =>
    {
        const data = {
            id: req.params.id
        }
            
        const callback = (error, results, fields) => {
            if (error) {
                console.error("Error readQuestsById:", error);
                res.status(500).json(error);
            } else {
                if(results.length == 0) 
                {
                    res.status(404).json({
                        message: "Quests not found"
                    });
                }
                else res.status(200).json(results[0]);
            }
        }
            
        model.selectQuestsById(data, callback);
    }    

module.exports.createCompleteRecord = (req, res, next) => {
    if (req.body.user_id == undefined || req.body.player_id == undefined || req.body.creation_date == undefined) {
        res.status(400).send("Error: user_id, player_id, or creation_date is undefined");
        return;
    }

    const data = {
        id: req.params.id,
        user_id: req.body.user_id,
        player_id: req.body.player_id,
        creation_date: req.body.creation_date
    };

    // Fetch the quest's level requirement from the model
    model.getQuestLevelRequirement(data.id, (questErr, questResults) => {
        if (questErr) {
            console.error("Error fetching quest details:", questErr);
            res.status(500).json(questErr);
            return;
        }

        if (questResults.length === 0) {
            res.status(404).json({ message: "Quest not found" });
            return;
        }

        const levelRequired = questResults[0].level_required;

        // Fetch the player's current level from the model
        model.getPlayerLevel(data.user_id, data.player_id, (playerErr, playerResults) => {
            if (playerErr) {
                console.error("Error fetching player level:", playerErr);
                res.status(500).json(playerErr);
                return;
            }

            if (playerResults.length === 0) {
                res.status(404).json({ message: "Player not found" });
                return;
            }

            const playerLevel = playerResults[0].level;

            // Validate if the player's level is sufficient
            if (playerLevel < levelRequired) {
                res.status(403).json({ message: "Player level too low to accept this quest" });
                return;
            }

            // Proceed with inserting the record if validation passes
            model.insertCompleteRecord(data, (error, results) => {
                if (error) {
                    console.error("Error creating quest record:", error);
                    res.status(500).json(error);
                } else {
                    next();
                }
            });
        });
    });
};
