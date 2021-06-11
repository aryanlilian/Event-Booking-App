const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send("Hello world");
})

app.listen(8000, () => console.log('Server is listening on port 8000'));