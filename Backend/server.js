const express = require('express');
var cors = require('cors');
const routes = require('./routes');
const config = require('./config.json')
const app = express();
const AWS = require('aws-sdk');
require('dotenv').config();
AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});
const s3 = new AWS.S3();

app.use(cors({ credentials: true, origin: ['http://localhost:3002', 'http://localhost:3000'] }));
app.get('/rds', routes.query);
app.get('/changeDB', routes.changeDB);
app.get('/ddb', routes.dynamoQuery)
app.get('/hello', (req, res) => {
    res.send('Hello World!')
});
app.get('/count_rds', routes.count_rds);

//Define a route to fetch the list of S3 objects
app.get('/api/aws-objects', (req, res) => {
    const params = {
        Bucket: 'banana-backup-deshi',
    };
    s3.listObjectsV2(params, (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'An error occurred while fetching objects from S3.' });
        } else {
            console.log(data.Contents);
            res.json(data.Contents);
        }
    });
});

app.get('/api/aws-objects-2', (req, res) => {
    const params = {
        Bucket: 'banana-backup-deshi-ohio',
    };

    s3.listObjectsV2(params, (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'An error occurred while fetching objects from S3.' });
        } else {
            console.log(data.Contents);
            res.json(data.Contents);
        }
    });
});


app.listen(config.server_port, () => {
    console.log(`Server running at http://${config.server_host}:${config.server_port}/`);
});