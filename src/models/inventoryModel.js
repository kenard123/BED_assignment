const pool = require('../services/db');

module.exports.selectAll = (callback) =>
    {
        const SQLSTATMENT = `
        SELECT * FROM user_inventory;
        `;
    
        pool.query(SQLSTATMENT, callback);
    }

module.exports.selectInventoryById = (data, callback) =>
    {
        const SQLSTATMENT = `
        SELECT * FROM user_inventory
        WHERE inventory_id = ?;
        `;
        const VALUES = [data.id];
        
        pool.query(SQLSTATMENT, VALUES, callback);
    }    

module.exports.selectInventoryByUserId = (data, callback) =>
    {
        const SQLSTATMENT = `
        SELECT * FROM user_inventory
        WHERE user_id = ?;
        `;
        const VALUES = [data.id];
        
        pool.query(SQLSTATMENT, VALUES, callback);
    }
    