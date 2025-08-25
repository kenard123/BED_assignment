const model = require("../models/playersModel.js");
const jwt = require('jsonwebtoken'); // If using JWT for authentication

module.exports.readAllPlayers = (req, res, next) =>
    {
        const callback = (error, results, fields) => {
            if (error) {
                console.error("Error readAllPlayers:", error);
                res.status(500).json(error);
            } 
            else res.status(200).json(results);
        }
    
        model.selectAll(callback);
    }

module.exports.readPlayerById = (req, res, next) =>
    {
        const data = {
            id: req.params.id
        }
            
        const callback = (error, results, fields) => {
            if (error) {
                console.error("Error readPlayerById:", error);
                res.status(500).json(error);
            } else {
                if(results.length == 0) 
                {
                    res.status(404).json({
                        message: "Player not found"
                    });
                }
                else res.status(200).json(results[0]);
            }
        }
            
        model.selectPlayerById(data, callback);
    }    

module.exports.deletePlayerById = (req, res, next) =>
    {
        const data = {
            id: req.params.id
        }
        
        const callback = (error, results, fields) => {
            if (error) {
                console.error("Error deletePlayerById:", error);
                res.status(500).json(error);
            } else {
                if(results.affectedRows == 0) 
                {
                    res.status(404).json({
                        message: "Player not found."
                    });
                }
                else res.status(204).send(); // 204 No Content            
            }
        }
        
       model.deletePlayerById(data, callback);
    }
    
module.exports.createPlayer = (req, res, next) =>
    {
        if(req.body.user_id == undefined || req.body.name == undefined || req.body.class == undefined) 
        {
            res.status(400).send("Error: user_id, name or class is undefined");
            return;
        }
        
        const data = {
            user_id: req.body.user_id,
            name: req.body.name,
            class: req.body.class
        }
        
        const callback = (error, results, fields) => {
            if (error) {
                console.error("Error createPlayer:", error);
                res.status(500).json(error);
            } else {
                res.status(201).json(`Player ID ${results.insertId} is inserted successfully`);
                req.body.playerId = results.insertId
            }
        }
    
        model.insertPlayer(data, callback);
    }

module.exports.readQuestAvailable = (req, res, next) =>
    {
        const data = {
            id: req.params.id
        }
    
        const callback = (error, results, fields) => {
            if (error) {
                res.status(500).json(error);
            } else {
                if(results.length == 0) 
                {
                    res.status(404).json({
                        message: "The player is not found in system"
                    });
                }
                else res.status(200).json(results);
            }
        }
    
        model.selectQuestAvailable(data, callback);
    }

    module.exports.readArmorByPlayerID = (req, res, next) =>
        {
            const data = {
                id: req.params.id
            }
        
            const callback = (error, results, fields) => {
                if (error) {
                    res.status(500).json(error);
                } else {
                    if(results.length == 0) 
                    {
                        res.status(404).json({
                            message: "The player is not found in system"
                        });
                    }
                }
                // Override req.params.id temporarily
                req.params.id = results[0].armor_id; 
                next();
            }
        
            model.selectArmorByPlayerID(data, callback);
        }

        module.exports.readWeaponByPlayerID = (req, res, next) =>
            {
                const data = {
                    id: req.params.id
                }
            
                const callback = (error, results, fields) => {
                    if (error) {
                        res.status(500).json(error);
                    } else {
                        if(results.length == 0) 
                        {
                            res.status(404).json({
                                message: "The player is not found in system"
                            });
                        }
                    }
                    // Override req.params.id temporarily
                    req.params.id = results[0].weapon_id; 
                    next();
                }
            
                model.selectWeaponByPlayerID(data, callback);
            }        

module.exports.addQuestLevel = (req, res) => {
    const data = {
        id: req.params.id, 
        user_id: req.body.user_id,
        player_id: req.body.player_id
    };

    // Fetch the challenge skillpoints and update the user's skillpoints
    model.insertLevel(data, (error, results) => {
        if (error) {
            console.error("Error updating level:", error);
            res.status(500).json(error);
        } else {
            if (results.affectedRows === 0) {
                res.status(404).json({ message: "Player not found" });
            } else {
                res.status(200).json({ message: "Level updated successfully" });
            }
        }
    });
};

module.exports.wearEquipmentByID = (req, res, next) =>
    {
        if(req.body.inventory_id == undefined || req.body.user_id == undefined)
        {
            res.status(400).json({
                message: "Error: inventory_id or user_id is undefined"
            });
            return;
        }
    
        const data = {
            id: req.params.id,
            inventory_id: req.body.inventory_id,
            user_id: req.body.user_id
        }
        
        const callback = (error, results, fields) => {
            if (error) {
                console.error("Error wearEquipmentById:", error);
                res.status(500).json(error);
            } else {
                if(results.length === 0)
                {
                    res.status(404).json({
                        message: "Player not found"
                    });
                }
                else res.status(204).send(); // 204 No Content
            }
        }
    
        model.updateEquipmentPlayer(data, callback);
    }    

    module.exports.editPlayerName = (req, res, next) =>
        {
            if(req.body.name == undefined)
            {
                res.status(400).json({
                    message: "Error: name is undefined"
                });
                return;
            }
        
            const data = {
                id: req.params.id,
                name: req.body.name
            }
            
            const callback = (error, results, fields) => {
                if (error) {
                    console.error("Error editNameById:", error);
                    res.status(500).json(error);
                } else {
                    if(results.length === 0)
                    {
                        res.status(404).json({
                            message: "Player not found"
                        });
                    }
                    else res.status(204).send(); // 204 No Content
                }
            }
        
            model.updatePlayerName(data, callback);
        }    

        module.exports.getTopTenPlayers = (req, res, next) =>
            {
                const callback = (error, results, fields) => {
                    if (error) {
                        console.error("Error readTopTenPlayers:", error);
                        res.status(500).json(error);
                    } 
                    else res.status(200).json(results);
                }
            
                model.selectTopTen(callback);
            }
    