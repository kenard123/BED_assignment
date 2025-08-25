const model = require("../models/userModel.js");

module.exports.login = (req, res, next) => {
    try { 
        const requiredFields = ['username', 'password'];

        for (const field of requiredFields) {
            if (req.body[field] === undefined || req.body[field] === "") {
                res.status(400).json({ message: `${field} is undefined or empty` });
                return;
            }
        };

        const data = {
            username: req.body.username,
            password: res.locals.hash
        };

        const callback = (error, results) => {
            if(error){
                console.error("Error login callback: ", error);
                res.status(500).json(error);
            } else {
                if(results.length == 0){
                    res.status(404).json({message: "User not found"}); 
                } else {
                    res.locals.userId = results[0].user_id
                    res.locals.hash = results[0].password
                    next();
                }
            }
        };

        model.login(data, callback);

    } catch (error) {
        console.error("Error login: ", error);
        res.status(500).json(error);
    }
};

module.exports.checkUsernameOrEmailExist = (req, res, next) => {
    try {
        const requiredFields = ['username', 'email'];

        for (const field of requiredFields) {
            if (req.body[field] === undefined || req.body[field] === "") {
                res.status(400).json({ message: `${field} is undefined or empty` });
                return;
            }
        };
    
        const data = {
            email: req.body.email,
            username: req.body.username
        };

        const callback = (error, results) => {
            if(error){
                console.error("Error readUserByEmailAndUsername callback: ", error);
                res.status(500).json(error);
            } else {
                if(results[1].length != 0 || results[0].length != 0){
                    res.status(409).json({message: "Username or email already exists"});
                } else {
                    next();
                }
            }
        };

        model.readUserByEmailAndUsername(data, callback);

    } catch (error) {
        console.error("Error readUserByEmailAndUsername: ", error);
        res.status(500).json(error);
    }

};

module.exports.register = (req, res, next) => {
        try { 
            const data = {
                email: req.body.email,
                username: req.body.username,
                password: res.locals.hash
            };
    
            const callback = (error, results) => {
                if(error){
                    console.error("Error register callback: ", error);
                    res.status(500).json(error);
                } else {
                    next();
                }
            };
    
            model.register(data, callback);
    
        } catch (error) {
            console.error("Error register: ", error);
            res.status(500).json(error);
        }
};

module.exports.createNewUser = (req, res, next) =>
    {
        if(req.body.username == undefined)
        {
            res.status(400).send("Error: username is undefined");
            return;
        }
    
        const data = {
            username: req.body.username,
            skillpoints: 0
        }
    
        const callback = (error, results, fields) => {
            if (error) {
                console.error("Error createNewUser:", error);
                res.status(500).json(error);
            } else {
                res.status(201).json(results);
            }
        }
    
        model.insertNewUser(data, callback);
    }

module.exports.readAllUser = (req, res, next) =>
    {
        const callback = (error, results, fields) => {
            if (error) {
            console.error("Error readAllUser:", error);
            res.status(500).json(error);
            } 
            else res.status(200).json(results);
        }
        
        model.selectAll(callback);
    }

module.exports.readUserById = (req, res, next) =>
    {
        const data = {
            id: req.params.id
        }
            
        const callback = (error, results, fields) => {
            if (error) {
                console.error("Error readUserById:", error);
                res.status(500).json(error);
            } else {
                if(results.length == 0) 
                {
                    res.status(404).json({
                        message: "User not found"
                    });
                }
                else res.status(200).json(results[0]);
            }
        }
            
        model.selectUserById(data, callback);
    }    

module.exports.updateUserById = (req, res, next) =>
    {
        if(req.body.username == undefined)
        {
            res.status(400).json({
                message: "Error: username or skillpoints is undefined"
            });
            return;
        }
    
        const data = {
            id: req.params.id,
            username: req.body.username,
            skillpoints: req.body.skillpoints
        }
        
        const callback = (error, results, fields) => {
            if (error) {
                console.error("Error updateUserById:", error);
                res.status(500).json(error);
            } else {
                if(results.affectedRows == 0) 
                {
                    res.status(404).json({
                        message: "User not found"
                    });
                }
                else res.status(204).send(); // 204 No Content
            }
        }
    
        model.updateById(data, callback);
    }    

module.exports.readEquipmentAvailablePurchase = (req, res, next) =>
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
                        message: "All equipment not available to purchase"
                    });
                }
                else res.status(200).json(results);
            }
        }
    
        model.selectEquipmentAvailable(data, callback);
    }

module.exports.readPlayerByUserID = (req, res, next) =>
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
                        message: "User or player not found"
                    });
                }
                else res.status(200).json(results);
            }
        }
    
        model.selectPlayerById(data, callback);
    }     

module.exports.addChallengeSkillpoints = (req, res) => {
    // Normalize the 'completed' field to lowercase
    const completedValue = String(req.body.completed).toLowerCase();

    // Validate if 'completed' is either "true" or "false"
    if (completedValue !== "true" && completedValue !== "false") {
        return res.status(400).json({ message: "Error: 'completed' must be true or false" });
    }

    // Prepare the data
    const data = {
        id: req.params.id, // challenge_id
        user_id: req.body.user_id,
        completed: completedValue === "true" // Convert completed to boolean
    };

    // Fetch the challenge skillpoints and update the user's skillpoints
    model.insertSkillpoints(data, (error, results) => {
        if (error) {
            console.error("Error updating skillpoints:", error);
            res.status(500).json(error);
        } else {
            if (results.affectedRows === 0) {
                res.status(404).json({ message: "User not found" });
            } else {
                res.status(200).json({ message: "Skill points updated successfully" });
            }
        }
    });
};
