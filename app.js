//Requires
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

//Import Routes
let appRoutes = require('./routes/app');
let usuarioRoutes = require('./routes/usuario');
let loginRoutes = require('./routes/login');
let hospitalRoutes = require('./routes/hospital');
let medicoRoutes = require('./routes/medico');
let busquedaRoutes = require('./routes/busqueda');
let uploadRoutes = require('./routes/upload');
let imgRoutes = require('./routes/imagen');

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

//Mostrar recursos de imagenes || OPCIONAL || RESTRICCION
//Server Index Config
// const serverIndex = require('serve-index');
// app.use(express.static(__dirname + '/'));
// app.use('/uploads', serverIndex(__dirname + '/uploads'));

//Routes
app.use('/usuario', usuarioRoutes);
app.use('/login', loginRoutes);
app.use('/hospital', hospitalRoutes);
app.use('/medico', medicoRoutes);
app.use('/busqueda', busquedaRoutes);
app.use('/upload', uploadRoutes);
app.use('/img', imgRoutes);
app.use('/', appRoutes);

//Hear port
app.listen(3000, () => {
    console.log('Servidor corriendo en puerto 3000: \x1b[32m%s\x1b[0m', 'online');
});