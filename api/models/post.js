const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    postImage: { type: String },
    comments : { type: Array, default: []},
    date: { type: Date,  required: true },
    quoUsername: { type: String },
    likes: { type: Array, default: [] }
})

module.exports = mongoose.model('Post', postSchema);