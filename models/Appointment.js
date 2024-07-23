const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AppointmentModelSchema = new Schema ({
    /* Appointment Schema */
    date: {
        type: Date,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    isTimeSlotAvailable: {
        type: Boolean,
        require: true,
        default: true
    }
});

// Define the schema using mongoose driver
const AppointmentModel = mongoose.model('Appointment', AppointmentModelSchema);
module.exports = AppointmentModel;