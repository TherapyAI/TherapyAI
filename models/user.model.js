const mongoose = require('mongoose');
const schema = new mongoose.Schema({
    name: {
        type: String
    } ,
    lastNames:{
        type: String
    } ,
    email: {
        type: String
    } ,
    password: {
        type: String
    }
})

module.exports = mongoose.model('User', schema);