//Requires
const express = require('express');
const mongoose = require('mongoose');

//Initialization
const app = express();

// DB Connection
mongoose.connect('mongodb://localhost:27017/hospitalDB', {useNewUrlParser: true}, (err, res) => {
    if (err) throw err;

    console.log('BD: \x1b[32m%s\x1b[0m', 'online');
});

//Routes
app.get('/', (req, res, next) => {
    res.status(403).json({
        ok: true,
        message: 'Correctly processed request'
    });
});

//Hear port
app.listen(3000, () => {
    console.log('Servidor corriendo en puerto 3000: \x1b[32m%s\x1b[0m', 'online');
});