const model = require("../models/inventoryModel.js");

module.exports.readAllInventory = (req, res, next) =>
    {
        const callback = (error, results, fields) => {
            if (error) {
                console.error("Error readAllInventory:", error);
                res.status(500).json(error);
            } 
            else res.status(200).json(results);
        }
    
        model.selectAll(callback);
    }

module.exports.readInventoryById = (req, res, next) =>
    {
        const data = {
            id: req.params.id
        }
            
        const callback = (error, results, fields) => {
            if (error) {
                console.error("Error readInventoryById:", error);
                res.status(500).json(error);
            } else {
                if(results.length == 0) 
                {
                    res.status(404).json({
                        message: "Inventory not found"
                    });
                }
                else res.status(200).json(results[0]);
            }
        }
            
        model.selectInventoryById(data, callback);
    }

module.exports.readInventoryByUserId = (req, res, next) =>
    {
        const data = {
            id: req.params.id
        }
            
        const callback = (error, results, fields) => {
            if (error) {
                console.error("Error readInventoryById:", error);
                res.status(500).json(error);
            } else {
                if(results.length == 0) 
                {
                    res.status(404).json({
                        message: "User inventory not found"
                    });
                }
                else res.status(200).json(results);
            }
        }
            
        model.selectInventoryByUserId(data, callback);
    }

