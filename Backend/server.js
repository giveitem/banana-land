const express = require('express');
var cors = require('cors');
const routes = require('./routes');
const config = require('./config.json')
const app = express();
app.use(cors({ credentials: true, origin: ['http://localhost:3000'] }));
app.get('/rds', routes.query);

app.get('/hello', (req, res) => {
    res.send('Hello World!')
});
app.listen(config.server_port, () => {
    console.log(`Server running at http://${config.server_host}:${config.server_port}/`);
});