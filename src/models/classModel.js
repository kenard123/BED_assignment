const pool = require('../services/db');

module.exports.selectAll = (callback) =>
    {
        const SQLSTATMENT = `
        SELECT * FROM class;
        `;
    
        pool.query(SQLSTATMENT, callback);
    }

module.exports.selectClassByNumber = (data, callback) =>
    {
        const SQLSTATMENT = `
        SELECT * FROM class
        WHERE number = ?;
        `;
        const VALUES = [data.number];
        
        pool.query(SQLSTATMENT, VALUES, callback);
    }
