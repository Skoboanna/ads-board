const mongoose = require('mongoose');

module.exports = mongoose.model('ads', {
    category: String,
    content: String,
    price: Number,
    user: {
        ref: 'users',
        type: mongoose.Schema.Types.ObjectId,
    },
    date: Date
});