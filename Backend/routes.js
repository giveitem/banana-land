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

// ddb config
const AWS1 = require('aws-sdk');
AWS1.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
});


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
            // console.log(result)
            res.json({
                result: result.data
            })
        })
        .catch(err => {
            console.log(err)
        })

}

async function dynamoQuery(req, res) {
    const dynamodb = new AWS1.DynamoDB.DocumentClient();
    const dynamoDbParams = {
        TableName: 'UserInformation',
        Limit: 10,
    };

    try {
        const dynamoDbResult = await dynamodb.scan(dynamoDbParams).promise();

        res.json({
            result: dynamoDbResult.Items,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }

}
async function count_rds(req, res) {
    const client = new pg.Client(
        Config
    );
    await client.connect()
    const result = await client.query('SELECT COUNT(*) FROM public.user_info')
    await client.end()
    res.json({
        result: result.rows
    })
}

module.exports = {
    query,
    changeDB,
    dynamoQuery,
    count_rds
}