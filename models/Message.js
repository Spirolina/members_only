const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const MessageSchema = new Schema({
    author: { type: mongoose.SchemaTypes.ObjectId, ref: 'User', required: true },
    content: { type: mongoose.SchemaTypes.String, required: true },
    date: {type: mongoose.SchemaTypes.Date, default: Date.now() }
})


module.exports = mongoose.model('Message', MessageSchema);