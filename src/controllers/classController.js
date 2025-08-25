const model = require("../models/classModel.js");

module.exports.readAllClass = (req, res, next) =>
    {
        const callback = (error, results, fields) => {
            if (error) {
                console.error("Error readAllClass:", error);
                res.status(500).json(error);
            } 
            else res.status(200).json(results);
        }
    
        model.selectAll(callback);
    }

    module.exports.readClassByNumber = (req, res, next) =>
        {
            const data = {
                number: req.params.number
            }
                
            const callback = (error, results, fields) => {
                if (error) {
                    console.error("Error readClassByNumber:", error);
                    res.status(500).json(error);
                } else {
                    if(results.length == 0) 
                    {
                        res.status(404).json({
                            message: "Class not found"
                        });
                    }
                    else res.status(200).json(results[0]);
                }
            }
                
            model.selectClassByNumber(data, callback);
        }