const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: { type: mongoose.SchemaTypes.String, required: true, unique: true },
    hash: { type: mongoose.SchemaTypes.String, required: true },
    salt: { type: mongoose.SchemaTypes.String, required: true },
    member: { type: mongoose.SchemaTypes.Boolean, default: false },
    admin: { type: mongoose.SchemaTypes.Boolean, default: false},
})


module.exports = mongoose.model('User', UserSchema);