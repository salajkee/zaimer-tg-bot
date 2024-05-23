const { Schema, default: mongoose } = require('mongoose')

const RequestSchema = new Schema({
	phone: { type: Number, required: true },
	name: { type: String, required: true },
	amount: { type: String, required: true },
	term: { type: String, required: true },
	story: { type: String, required: false },
	deposit: { type: String, required: false },
	pinfl: { type: String, required: false },
	passportOrIdCard: { type: String, required: false },
})

const Request = mongoose.model('Request', RequestSchema)

module.exports = Request
