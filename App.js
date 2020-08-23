require('dotenv').config();

const express = require('express');
const app = express();
const path = require('path');

app.use(express.static(path.join(__dirname, "/client/build")));

require('./client/router')(app);
require('./api/router')(app);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`run trckr is running on port ${ PORT }`);
});
