require('dotenv').config();

require('https').globalAgent.options.rejectUnauthorized = false;

const express = require('express');
const app = express();
const path = require('path');

app.use(express.static(path.join(__dirname, "/client/build")));

require('./login')(app);
require('./backend/router')(app);
require('./client/router')(app);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`run trckr is running on port ${ PORT }`);
});
