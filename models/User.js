const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

const UserModelSchema = new Schema({
    /* Login Schema */
    username: {
        type: String,
        required: true,
        unique: true
    },
    user_password: {
        type: String,
        required: true
    },
    user_type: {
        type: String,
        required: true
    },
    /* User Details */
    firstname: {
        type: String,
        required: true,
        default: 'default'
    },
    lastname: {
        type: String,
        required: true,
        default: 'default'
    },
    license_no: {
        type: String,
        required: true,
        default: 'default'
    },
    email_add: {
        type: String,
        default: 'default'
    },
    user_age: {
        type: Number,
        required: true,
        default: 0
    },
    user_dob: {
        type: Date,
        default: Date.now
    },
    /* Car Details */
    car_details: {
        car_make: {
            type: String,
            required: true,
            default: 'default'
        },
        car_model: {
            type: String,
            required: true,
            default: 'default'
        },
        car_year: {
            type: String,
            required: true,
            default: 'default'
        },
        car_plate_no: {
            type: String,
            required: true,
            default: 'default'
        }
    },
    /* Appointment details */
    appointment: {
        appointment_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Appointment'
        },
        testType: {
            type: String,
            default: ''
        },
        isPass: {
            type: Boolean,
            default: false
        },
        comment: {
            type: String,
            default: ''
        }
    }
});

// Data encryption on license number before updating from G2 form
UserModelSchema.pre('findOneAndUpdate', function(next) {
    const user = this.getUpdate();
    encryptLicenseNo(user, next);
});

// Data encryption on user password before saving to database
UserModelSchema.pre('save', function(next) {
    const user = this;
    
    // 10 rounds of hashing
    bcrypt.hash(user.user_password, 10, (error, hash) => {
        user.user_password = hash;
        next();
    });
});

// Function to encrypt license number
const encryptLicenseNo = (user, next) => {
    // 10 rounds of hashing
    bcrypt.hash(user.license_no, 10, (error, hash) => {
        user.license_no = hash;
        next();
    });
}

// Define the schema using mongoose driver
const UserModel = mongoose.model('User', UserModelSchema);
module.exports = UserModel;