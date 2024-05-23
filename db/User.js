const { Schema, default: mongoose } = require('mongoose');

const UserSchema = new Schema({
	first_name: { type: String, required: false },
	id: { type: Number, required: true, unique: true },
	phone: { type: Number, required: false },
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
