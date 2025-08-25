const model = require("../models/challengeModel");

module.exports.createNewChallenge = (req, res, next) =>
    {
        if(req.body.challenge == undefined || req.body.user_id == undefined ||req.body.skillpoints == undefined)
        {
            res.status(400).send("Error: challenge, creator_id or skillpoints is undefined");
            return;
        }
    
        const data = {
            challenge: req.body.challenge,
            creator_id: req.body.user_id,
            skillpoints: req.body.skillpoints
        }
    
        const callback = (error, results, fields) => {
            if (error) {
                console.error("Error createNewChallenge:", error);
                res.status(500).json(error);
            } else {
                res.status(201).json({
                message: "Challenge created successfully",
                });
            }
        }
    
        model.insertSingle(data, callback);
    }

module.exports.readAllChallenge = (req, res, next) =>
    {
        const callback = (error, results, fields) => {
            if (error) {
            console.error("Error readAllChallenge:", error);
            res.status(500).json(error);
            } 
            else res.status(200).json(results);
        }
            
        model.selectAllChallenge(callback);
    }

module.exports.updateChallengeById = (req, res, next) =>
    {
        if(req.body.user_id == undefined || req.body.challenge == undefined || req.body.skillpoints == undefined)
        {
            res.status(400).json({
                message: "Missing required data."
            });
            return;
        }
    
        const data = {
            id: req.params.id,
            creator_id: req.body.user_id,
            challenge: req.body.challenge,
            skillpoints: req.body.skillpoints
        }
    
        const callback = (error, results, fields) => {
            if (error) {
                console.error("Error updateChallengeById:", error);
                res.status(500).json(error);
            } else {
                if(results.affectedRows == 0) 
                {
                    res.status(404).json({
                        message: "Challenge not found"
                    });
                }
                else {
                    console.log(results)
                    res.status(204).send(); // 204 No Content
                }
            }
        }
    
        model.updateChallengeById(data, callback);
    }    

module.exports.deleteChallengeById = (req, res, next) =>
    {
        const data = {
            id: req.params.id
        }
        
        const callback = (error, results, fields) => {
            if (error) {
                console.error("Error deleteChallengeById:", error);
                res.status(500).json(error);
            } else {
                if(results.affectedRows == 0) 
                {
                    res.status(404).json({
                        message: "Challenge not found."
                    });
                }
                else res.status(204).send(); // 204 No Content            
            }
        }
        
        model.deleteChallengeById(data, callback);
    }     

module.exports.createCompleteRecord = (req, res, next) =>
    {
        if(req.body.user_id == undefined || req.body.completed == undefined || req.body.creation_date == undefined || req.body.notes == undefined) 
        {
            res.status(400).send("Error: creator_id, completed, creation_date or notes is undefined");
            return;
        }
        
        const data = {
            id: req.params.id,
            user_id: req.body.user_id,
            completed: req.body.completed,
            creation_date: req.body.creation_date,
            notes: req.body.notes
        }
        
        const callback = (error, results, fields) => {
            if (error) {
                console.error("Error createChallengeRecord:", error);
                res.status(500).json(error);
            } else {
                // res.status(201).json(results);
                // res.status(201).json(`User ID ${results.insertId} is inserted successfully`);
                // req.body.playerId = results.id
                next();
            }
        }
    
        model.insertCompleteRecord(data, callback);
    }

module.exports.readChallengeById = (req, res, next) =>
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
                        message: "No user has try this challenge"
                    });
                }
                else res.status(200).json(results);
            }
        }
    
        model.selectChallengeById(data, callback);
    }    

module.exports.readChallengeDoneByUserId = (req, res, next) =>
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
                        message: "User not found."
                    });
                }
                else res.status(200).json(results);
            }
        }
    
        model.selectChallengeDoneByUserId(data, callback);
    }        

    module.exports.updateChallengeNotes = (req, res, next) =>
        {
            if(req.body.notes == undefined)
            {
                res.status(400).json({
                    message: "Missing required data."
                });
                return;
            }
        
            const data = {
                id: req.params.id,
                complete_id: req.params.complete_id,
                notes: req.body.notes
            }
        
            const callback = (error, results, fields) => {
                if (error) {
                    console.error("Error updateChallengeNotes:", error);
                    res.status(500).json(error);
                } else {
                    if(results.affectedRows == 0) 
                    {
                        res.status(404).json({
                            message: "Challenge not found"
                        });
                    }
                    else {
                        res.status(204).send(); // 204 No Content
                    }
                }
            }
        
            model.updateChallengeNotes(data, callback);
        }       

        module.exports.readAllReview = (req, res, next) =>
            {
                const callback = (error, results, fields) => {
                    if (error) {
                    console.error("Error readAllReview:", error);
                    res.status(500).json(error);
                    } 
                    else res.status(200).json(results);
                }
                    
                model.selectAllReview(callback);
            }

            module.exports.readReviewByID = (req, res, next) =>
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
                                    message: "No review"
                                });
                            }
                            else res.status(200).json(results);
                        }
                    }
                
                    model.selectReviewById(data, callback);
                }    

            module.exports.readAllReviewByChallengeID = (req, res, next) =>
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
                                    message: "No user create review for this challenge"
                                });
                            }
                            else res.status(200).json(results);
                        }
                    }
                
                    model.selectAllReviewByChallengeId(data, callback);
                }    

                module.exports.createReviewByChallengeID = (req, res, next) =>
                    {
                        if(req.body.rating == undefined)
                            {
                                res.status(400).send("Error: rating is undefined");
                                return;
                            }
                            else if(req.body.rating > 5 || req.body.rating < 1)
                            {
                                res.status(400).send("Error: rating can only be between 1 to 5");
                                return;
                            }
                            else if(req.body.user_id == undefined)
                            {
                                res.status(400).send("Error: user_id is undefined");
                                return;
                            }
                        // if(req.body.user_id == undefined || req.body.rating == undefined || req.body.review == undefined) 
                        // {
                        //     res.status(400).send("Error: user_id, rating or review is undefined");
                        //     return;
                        // }
                        
                        const data = {
                            id: req.params.id,
                            user_id: req.body.user_id,
                            rating: req.body.rating,
                            review: req.body.review
                        }
                        
                        const callback = (error, results, fields) => {
                            if (error) {
                                console.error("Error createReviewRecord:", error);
                                res.status(500).json(error);
                            } else {
                                res.status(201).json(results);
                            }
                        }
                    
                        model.insertReviewRecord(data, callback);
                    }

                    module.exports.deleteReviewByChallengeReviewId = (req, res, next) =>
                        {
                            const data = {
                                id: req.params.id,
                                review_id: req.params.review_id
                            }
                            
                            const callback = (error, results, fields) => {
                                if (error) {
                                    console.error("Error deleteReviewById:", error);
                                    res.status(500).json(error);
                                } else {
                                    if(results.affectedRows == 0) 
                                    {
                                        res.status(404).json({
                                            message: "Review not found."
                                        });
                                    }
                                    else res.status(204).send(); // 204 No Content            
                                }
                            }
                            
                            model.deleteReviewByChallengeReviewId(data, callback);
                        }   

                        module.exports.editReviewByChallengeReviewId = (req, res, next) =>
                            {
                                if(req.params.id == undefined)
                                    {
                                        res.status(400).send("Error: challenge_id is undefined");
                                        return;
                                    } else if (req.params.review_id == undefined) {
                                        res.status(400).send("Error: review_id is undefined");
                                        return;
                                    } else if(req.body.rating == undefined)
                                    {
                                        res.status(400).send("Error: rating is undefined");
                                        return;
                                    }
                                    else if(req.body.rating > 5 || req.body.rating < 1)
                                    {
                                        res.status(400).send("Error: rating can only be between 1 to 5");
                                        return;
                                    }
                                    else if(req.body.review == undefined)
                                    {
                                        res.status(400).send("Error: review is undefined");
                                        return;
                                    }
                            
                                const data = {
                                    id: req.params.id,
                                    review_id: req.params.review_id,
                                    rating: req.body.rating,
                                    review: req.body.review
                                }
                            
                                const callback = (error, results, fields) => {
                                    if (error) {
                                        console.error("Error updateReviewById:", error);
                                        res.status(500).json(error);
                                    } else {
                                        res.status(204).send();
                                    }
                                }
                            
                                model.updateReviewByChallengeReviewId(data, callback);
                            }
                            
                            module.exports.deleteReviewById = (req, res, next) =>
                                {
                                    const data = {
                                        id: req.params.id
                                    }
                                    
                                    const callback = (error, results, fields) => {
                                        if (error) {
                                            console.error("Error deleteReviewById:", error);
                                            res.status(500).json(error);
                                        } else {
                                            if(results.affectedRows == 0) 
                                            {
                                                res.status(404).json({
                                                    message: "Review not found."
                                                });
                                            }
                                            else res.status(204).send(); // 204 No Content            
                                        }
                                    }
                                    
                                    model.deleteReviewById(data, callback);
                                }
                                
                                module.exports.editReviewById = (req, res, next) =>
                                    {
                                        if(req.params.id == undefined)
                                            {
                                                res.status(400).send("Error: review_id is undefined");
                                                return;
                                            } else if(req.body.rating == undefined)
                                            {
                                                res.status(400).send("Error: rating is undefined");
                                                return;
                                            }
                                            else if(req.body.rating > 5 || req.body.rating < 1)
                                            {
                                                res.status(400).send("Error: rating can only be between 1 to 5");
                                                return;
                                            }
                                            else if(req.body.review == undefined)
                                            {
                                                res.status(400).send("Error: review is undefined");
                                                return;
                                            }
                                    
                                        const data = {
                                            id: req.params.id,
                                            rating: req.body.rating,
                                            review: req.body.review
                                        }
                                    
                                        const callback = (error, results, fields) => {
                                            if (error) {
                                                console.error("Error updateReviewById:", error);
                                                res.status(500).json(error);
                                            } else {
                                                res.status(204).send();
                                            }
                                        }
                                    
                                        model.updateReviewById(data, callback);
                                    }
        