const express  = require('express');
const songRoutes = require("./routes/song.route.js")

const cors = require('cors');



const app= express()

app.use(cors());

app.use(express.json())

app.use('/', songRoutes);


module.exports = app;