const pool = require('../services/db');

module.exports.selectAll = (callback) =>
    {
        const SQLSTATMENT = `
        SELECT * FROM enemy;
        `;
    
        pool.query(SQLSTATMENT, callback);
    }

module.exports.selectEnemyByNumber = (data, callback) =>
    {
        const SQLSTATMENT = `
        SELECT * FROM enemy
        WHERE number = ?;
        `;
        const VALUES = [data.number];
        
        pool.query(SQLSTATMENT, VALUES, callback);
    }