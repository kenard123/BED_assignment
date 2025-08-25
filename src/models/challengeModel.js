const pool = require('../services/db');

module.exports.insertSingle = (data, callback) =>
    {
        const checkSkillpointsSQL = `SELECT skillpoints FROM User WHERE user_id = ?`;

        pool.query(checkSkillpointsSQL, [data.creator_id], (error, results) => {
            if (error) {
                return callback({ status: 500, message: "Error fetching user skill points" }, null);
            }
    
            if (results.length === 0) {
                return callback({ status: 404, message: "User not found" }, null);
            }
    
            const currentSkillpoints = results[0].skillpoints;
    
            if (currentSkillpoints < data.skillpoints) {
                return callback({ status: 400, message: "Not enough skill points to create the challenge" }, null);
            }

            
        const SQLSTATMENT = `
        INSERT INTO FitnessChallenge (challenge, creator_id, skillpoints)
        VALUES (?, ?, ?);

        UPDATE User 
        SET skillpoints = skillpoints - ?
        WHERE user_id = ? AND skillpoints >= ?;
        `;
        const VALUES = [
            data.challenge, data.creator_id, data.skillpoints,
            data.skillpoints, data.creator_id, data.skillpoints
        ];
        
        pool.query(SQLSTATMENT, VALUES, callback);
    });
}

module.exports.selectAllChallenge = (callback) =>
    {
        const SQLSTATMENT = `
        SELECT * FROM FitnessChallenge;
        `;
    
        pool.query(SQLSTATMENT, callback);
    }

module.exports.updateChallengeById = (data, callback) =>
    {
        const SQLSTATMENT = `
        UPDATE FitnessChallenge 
        SET creator_id = ?, challenge = ?, skillpoints = ?
        WHERE challenge_id = ?;
        `;
        const VALUES = [data.creator_id, data.challenge, data.skillpoints, data.id];
    
        pool.query(SQLSTATMENT, VALUES, callback);
    }

module.exports.deleteChallengeById = (data, callback) =>
    {
        const SQLSTATMENT = `
        DELETE FROM FitnessChallenge 
        WHERE challenge_id = ?;
        `;
        const VALUES = [data.id];
        
        pool.query(SQLSTATMENT, VALUES, callback);
    }
        
module.exports.insertCompleteRecord = (data, callback) =>
    {
        const SQLSTATMENT = `
        INSERT INTO UserCompletion (user_id, completed, creation_date, notes, challenge_id)
        VALUES (?, ?, ?, ?, ?);
        `;
    const VALUES = [data.user_id, data.completed, data.creation_date, data.notes, data.id];
        
    pool.query(SQLSTATMENT, VALUES, callback);
    }

module.exports.selectChallengeById = (data, callback) =>
    {
        const SQLSTATMENT = `
        SELECT user_id, completed, creation_date, notes
        FROM UserCompletion
        WHERE challenge_id = ?;
        `;
        const VALUES = [data.id];
        
        pool.query(SQLSTATMENT, VALUES, callback);
    }

module.exports.selectChallengeDoneByUserId = (data, callback) =>
    {
        const SQLSTATMENT = `
        SELECT user_id, complete_id, challenge_id, completed, creation_date, notes
        FROM UserCompletion
        WHERE user_id = ?;
        `;
        const VALUES = [data.id];
        
        pool.query(SQLSTATMENT, VALUES, callback);
    }    

module.exports.updateChallengeNotes = (data, callback) =>
    {
        const SQLSTATMENT = `
        UPDATE usercompletion
        SET notes = ?
        WHERE complete_id = ? and user_id = ?
        `;
        const VALUES = [data.notes, data.complete_id, data.id];
    
        pool.query(SQLSTATMENT, VALUES, callback);
    }        

module.exports.selectAllReview = (callback) =>
    {
        const SQLSTATMENT = `
        SELECT * FROM challengereviews;
        `;
    
        pool.query(SQLSTATMENT, callback);
    }

    module.exports.selectReviewById = (data, callback) =>
        {
            const SQLSTATMENT = `
            SELECT * FROM challengereviews
            WHERE review_id = ?;
            `;
            const VALUES = [data.id];
            
            pool.query(SQLSTATMENT, VALUES, callback);
        }

module.exports.selectAllReviewByChallengeId = (data, callback) =>
    {
        const SQLSTATMENT = `
        SELECT * FROM challengereviews
        WHERE challenge_id = ?;
        `;
        const VALUES = [data.id];
        
        pool.query(SQLSTATMENT, VALUES, callback);
    }

module.exports.insertReviewRecord = (data, callback) =>
    {
        const SQLSTATMENT = `
        INSERT INTO challengereviews (challenge_id, user_id, rating, review)
        VALUES (?, ?, ?, ?);
        `;
    const VALUES = [data.id, data.user_id, data.rating, data.review];
        
    pool.query(SQLSTATMENT, VALUES, callback);
    }

module.exports.deleteReviewByChallengeReviewId = (data, callback) =>
    {
        const SQLSTATMENT = `
        DELETE FROM challengereviews
        WHERE review_id = ? and challenge_id = ?;
        `;
        const VALUES = [data.review_id, data.id];
        
        pool.query(SQLSTATMENT, VALUES, callback);
    }

module.exports.updateReviewByChallengeReviewId = (data, callback) =>
    {
        const SQLSTATMENT = `
        UPDATE challengereviews
        SET rating = ?, review = ?
        WHERE challenge_id = ? and review_id = ?
        `;
        const VALUES = [data.rating, data.review, data.id, data.review_id];
    
        pool.query(SQLSTATMENT, VALUES, callback);
    }        

    module.exports.deleteReviewById = (data, callback) =>
        {
            const SQLSTATMENT = `
            DELETE FROM challengereviews
            WHERE review_id = ?;
            `;
            const VALUES = [data.id];
            
            pool.query(SQLSTATMENT, VALUES, callback);
        }

        module.exports.updateReviewById = (data, callback) =>
            {
                const SQLSTATMENT = `
                UPDATE challengereviews
                SET rating = ?, review = ?
                WHERE review_id = ?
                `;
                const VALUES = [data.rating, data.review, data.id];
            
                pool.query(SQLSTATMENT, VALUES, callback);
            }        
    