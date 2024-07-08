const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserModelSchema = new Schema({
    firstname: String,
    lastname: String,
    license_no: String,
    email_add: String,
    user_age: Number,
    user_dob: Date,
    car_details: {
        car_make: String,
        car_model: String,
        car_year: String,
        car_plate_no: String
    }
});

// Define the schema using mongoose driver
const UserModel = mongoose.model('User', UserModelSchema);
module.exports = UserModel;