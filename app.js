//Requires
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

//Import Routes
let appRoutes = require('./routes/app');
let usuarioRoutes = require('./routes/usuario');
let loginRoutes = require('./routes/login');

//Initialization
const app = express();

//Body Parser
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// DB Connection
mongoose.connect('mongodb://localhost:27017/hospitalDB', {useCreateIndex: true, useNewUrlParser: true}, (err, res) => {
    if (err) throw err;

    console.log('BD: \x1b[32m%s\x1b[0m', 'online');
});

//Routes
app.use('/usuario', usuarioRoutes);
app.use('/login', loginRoutes);
app.use('/', appRoutes);

//Hear port
app.listen(3000, () => {
    console.log('Servidor corriendo en puerto 3000: \x1b[32m%s\x1b[0m', 'online');
});