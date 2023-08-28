// import { Client } from 'pg'
const pg = require('pg');
const Config = {
    host: process.env.RDS_HOSTNAME,
    port: process.env.RDS_PORT,
    database: process.env.RDS_DB_NAME,
    user: process.env.RDS_USERNAME,
    password: process.env.RDS_PASSWORD
}



async function query(req, res) {
    const client = new pg.Client(
        Config
    );
    await client.connect()
    const result = await client.query('SELECT * FROM public.user_info LIMIT 4')
    await client.end()
    res.json({
        result: result.rows
    })
}
module.exports = {
    query
}