const { raw } = require("mysql2");
const model = require("../models/equipmentModel.js");

module.exports.forgingEquipment = (req, res, next) =>
    {
        if(req.body.name == undefined || req.body.classID == undefined || req.body.hp == undefined || req.body.atk == undefined || req.body.def == undefined || req.body.skillpoints == undefined)
        {
            res.status(400).json({"message":"Missing required data"});
            return;
        }
    
        const data = {
            name: req.body.name,
            classID: req.body.classID,
            level_required: req.body.level_required,
            hp: req.body.hp,
            atk: req.body.atk,
            def: req.body.def,
            skillpoints: req.body.skillpoints
        }
    
        const callback = (error, results, fields) => {
            if (error) {
                res.status(500).json({
                    message : "Interval server error."
                });
            } else {
                console.log(results)
                res.status(201).json({
                    message :"Equipment forged successfully.",
                    equipmentId : results.insertId
                });
            }
        }
    
        model.insertEquipment(data, callback);
    }

module.exports.readAllEquipment = (req, res, next) =>
    {
        const callback = (error, results, fields) => {
            if (error) {
                console.error("Error readAllEquipment:", error);
                res.status(500).json(error);
            } 
            else res.status(200).json(results);
        }
    
        model.selectAll(callback);
    }

module.exports.readEquipmentByID = (req, res, next) =>
    {
        const data = {
            id: req.params.id
        }
    
        const callback = (error, results, fields) => {
            if (error) {
                console.error("Error readEquipmentByNumber:", error);
                res.status(500).json(error);
            } else {
                if(results.length == 0) 
                {
                    res.status(404).json({
                        message: "Equipment not found"
                    });
                }
                else res.status(200).json(results[0]);
            }
        }
    
        model.selectEquipmentByID(data, callback);
    }

module.exports.deleteEquipmentByID = (req, res, next) =>
    {
        const data = {
            id: req.params.id
        }
    
        const callback = (error, results, fields) => {
            if (error) {
                console.error("Error deleteEquipmentByNumber:", error);
                res.status(500).json(error);
            } else {
                if(results.affectedRows == 0) 
                {
                    res.status(404).json({
                        message: "Equipment not found."
                    });
                }
                else res.status(204).send(); // 204 No Content            
            }
        }
    
        model.deleteByNumber(data, callback);
    }       

module.exports.checkEquipmentExistByNumber = (req, res, next) =>
    {
        const data = {
            number: req.params.equipmentId
        }
    
        const callback = (error, results, fields) => {
            if (error) {
                console.error("Error readEquipmentByNumber:", error);
                res.status(500).json(error);
            } else {
                if(results.length == 0) 
                {
                    res.status(404).json({
                        message: "Equipment not found"
                    });
                }
                else {
                next ();
                // res.status(200).json(results[0]);
                }
            }
        }
    
        model.selectById(data, callback);
    }

module.exports.purchaseEquipment = (req, res, next) => {
    if (req.body.user_id === undefined || req.body.id === undefined) {
        res.status(400).send("Error: user_id or id (equipment) is undefined");
        return;
    }

    const data = {
        user_id: req.body.user_id,
        id: req.body.id
    };

    const callback = (error, results) => {
        if (error) {
            console.error("Error purchaseEquipment:", error);
            res.status(400).json({ message: error.message });
        } else {
            res.status(201).json({
                message: `Purchase successful: User ${data.user_id} bought Equipment ${data.id}.`,
            });
        }
    };

    model.insertPurchase(data, callback);
};
    