const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const employeeSchema = new Schema({
    name: String,
    age: Number,
    class: String,
    subjects: [String],
    attendance: Number
});

module.exports = mongoose.model('Employee', employeeSchema);
