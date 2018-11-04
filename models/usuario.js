const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

const rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol válido'
};

let usuarioSchema = new Schema({
    nombre: {type: String, required: [true, 'El nombre es necesario']},
    email: {type: String, unique: true, required: [true, 'El correo es necesario']},
    password: {type: String, required: [true, 'La contraseña es necesaria']},
    img: {type: String},
    role: {type: String, required: true, default: 'USER_ROLE', enum: rolesValidos},
    google: {type: Boolean, default: false}
});

usuarioSchema.plugin(uniqueValidator, {message: '{PATH} debe ser único'});

let Usuario = mongoose.model('Usuario', usuarioSchema);

module.exports = Usuario;