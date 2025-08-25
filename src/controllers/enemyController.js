const model = require("../models/enemyModel.js");

module.exports.readAllEnemy = (req, res, next) =>
    {
        const callback = (error, results, fields) => {
            if (error) {
                console.error("Error readAllEnemy:", error);
                res.status(500).json(error);
            } 
            else res.status(200).json(results);
        }
    
        model.selectAll(callback);
    }

module.exports.readEnemyByNumber = (req, res, next) =>
    {
        const data = {
            number: req.params.number
        }
            
        const callback = (error, results, fields) => {
            if (error) {
                console.error("Error readEnemyByNumber:", error);
                res.status(500).json(error);
            } else {
                if(results.length == 0) 
                {
                    res.status(404).json({
                        message: "Enemy not found"
                    });
                }
                else res.status(200).json(results[0]);
            }
        }
            
        model.selectEnemyByNumber(data, callback);
    }        