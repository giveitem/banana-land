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
const AWS = require('aws-sdk');
AWS.config.update({
    accessKeyId: 'AKIA2MDSAAMNQELGPNAT',
    secretAccessKey: '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',
    region: 'us-east-1',
});
const dynamodb = new AWS.DynamoDB.DocumentClient();

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

async function DynamoQuery(req, res) {
    const dynamoDbParams = {
        TableName: 'UserInformation',
        Limit: 4,
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

module.exports = {
    query,
    changeDB
}