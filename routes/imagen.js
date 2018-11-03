const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');

app.get('/:tipo/:img', (req, res, next) => {

    let tipo = req.params.tipo;
    let img = req.params.img;

    const tipos = ['usuarios', 'medicos', 'hospitales'];

    if (tipos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: `Tipos válidos: ${tipos.join(', ')}`,
            errors: {message: 'Tipo inválido'}
        });
    }

    let pathImagen = path.resolve(__dirname, `../uploads/${tipo}/${img}`);

    if (fs.existsSync(pathImagen)) {
        res.sendFile(pathImagen);
    } else {
        let pathNoImage = path.resolve(__dirname, '../assets/no-img.jpg');
        res.sendFile(pathNoImage);
    }

});

module.exports = app;