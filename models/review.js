const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
	body: String,
	rating: Number,
	date: Date,
	edited: {
		edited: Boolean,
		date: Date
	},
	author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('Review', reviewSchema);
