const AppointmentModel = require("../models/Appointment");
const UserModel = require("../models/User");

module.exports = async (req, res) => {
    try {
        // Get current user
        let user = await UserModel.findById(req.session.userId);

        // Selected appointment date
        const appointment_date = req.body.user_appointment_date;
        console.log("in loadG2timeslots ", appointment_date);

        // Get current date
        const now = new Date().toISOString().split('T')[0];

        // Get availble appointments for current date
        const available_app_slots = await AppointmentModel.find({ 
            date: appointment_date,
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
            firstUserInput: false,
            appointment_date: appointment_date,
            current_date: now,
            available_time_slots,
            appointment_booking_error: '',
            appointmentTimeBooked: false
        });

    } catch (error) {
        console.log(error);
    }
}