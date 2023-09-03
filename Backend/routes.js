// import { Client } from 'pg'
const pg = require('pg');
const axios = require('axios');
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
    const result = await client.query('SELECT * FROM public.user_info ORDER BY id DESC LIMIT 10')
    await client.end()
    res.json({
        result: result.rows
    })
}

async function changeDB(req, res) {
    axios.post(process.env.AWS_LAMBDA_ENDPOINT)
        .then(result => {
            console.log(result)
            res.json({
                result: result.data
            })
        })
        .catch(err => {
            console.log(err)
        })

}
module.exports = {
    query,
    changeDB
}