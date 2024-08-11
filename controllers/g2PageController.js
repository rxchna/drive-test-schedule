const UserModel = require("../models/User");
const AppointmentModel = require("../models/Appointment");
const bcrypt = require("bcrypt");

module.exports = async (req, res) => {
    try {
        // Get current user
        let user = await UserModel.findById(req.session.userId);
        let showLicenseNoField = false;

        // Verify if user has license number set to default value
        if(user.license_no == "default") {
            user = clearUser(user);
            showLicenseNoField = true; // Show license_no input field
        }

        // Check if user has already booked an appointment
        if(user.appointment?.appointment_id) {
            // Get appointment details
            const appointment = await AppointmentModel.findById(user.appointment.appointment_id);

            // Render G2 page
            res.render('g2_test', {
                user,
                errorMessage: '',
                firstUserInput: showLicenseNoField,
                appointment_date: appointment.date.toISOString().split('T')[0],
                current_date: '',
                available_time_slots: '',
                appointment_booking_error: '',
                appointmentTimeBooked: appointment.time
            });
        }
        else {
            // Get current date
            const now = new Date().toISOString().split('T')[0];
    
            // Get availble appointments for current date
            const available_app_slots = await AppointmentModel.find({ 
                date: now,
                isTimeSlotAvailable: true
            });
    
            let available_time_slots = '';
            if (available_app_slots.length > 0) {
                // Create array with only time slots of selected date
                available_time_slots = available_app_slots.map(available_app_slots => available_app_slots.time);
            }

            // Render G2 page
            res.render('g2_test', {
                user,
                errorMessage: '',
                firstUserInput: showLicenseNoField,
                appointment_date: now,
                current_date: now,
                available_time_slots,
                appointment_booking_error: '',
                appointmentTimeBooked: false
            });
        }
    } catch (error) {
        console.log(error);
    }
}

// Function to set field values to empty
const clearUser = (user) => {
    const fieldsToExclude = ['username', 'user_password', 'user_type'];

    // Get all keys in User Model document
    const userSchemaPaths = UserModel.schema.paths;

    for (const path in userSchemaPaths) {
        // Skip the _id, __v fields, and fields to exclude
        if (path !== '_id' && path !== '__v' && !fieldsToExclude.includes(path)) {
            user[path] = '';
        }
    }
    // Clear nested fields - car_details
    if (user.car_details) {
        user.car_details = {};
    }

    return user;
}