const mongoose = require('mongoose');
let Schema = mongoose.Schema;

let hospitalSchema = new Schema({
    nombre: {type: String, required: [true, 'El nombre es necesario']},
    img: {type: String},
    usuario: {type: Schema.Types.ObjectId, ref: 'Usuario'}
}, {collection: 'hospitales'});

let Hospital = mongoose.model('Hospital', hospitalSchema);

module.exports = Hospital;