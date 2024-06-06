const sql = require('mssql');

const config = {
    server: process.env.SQL_SERVER,
    database: process.env.SQL_DATABASE,
    authentication: {
        type: 'default',
        options: {
            // Empty when using Windows Authentication
            userName: process.env.SQL_USER,
            password: process.env.SQL_PASSWORD,
        },
    },
    options: {
        trustedConnection: true,
        trustServerCertificate: true
    },
};

module.exports = async function connectSQLServer() {
    try {
        await sql.connect(config);
        console.log('Connected to sql');
    } catch (err) {
        console.error('Error connecting to sql:', err);
    }
};