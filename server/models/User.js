const connection = require('../config/db');
const bcrypt = require('bcryptjs');

const User = {
    register: async (userData) => {
        const salt = await bcrypt.genSalt(10);
        userData.password = await bcrypt.hash(userData.password, salt);
        const query = `INSERT INTO Users (username, password, email, role) VALUES (?, ?, ?, ?)`;
        return new Promise((resolve, reject) => {
            connection.query(query, [userData.username, userData.password, userData.email, userData.role], (err, result) => {
                if (err) reject(err);
                resolve(result);
            });
        });
    }
};

module.exports = User;
