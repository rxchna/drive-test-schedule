const UserModel = require('../models/User');
const AppointmentModel = require('../models/Appointment');

module.exports = async (req, res, next) => {
    const { user_appointment_date, time_slot } = req.body;

    try {
        // Check if user has selected a time slot

        // Render back G with error message if no time slot is chosen
        if (!time_slot) {

            // Get current user details
            const user = await UserModel.findById(req.session.userId);

            // Get current date
            const now = new Date().toISOString().split('T')[0];
        
            // Get availble appointments for current date
            const available_app_slots = await AppointmentModel.find({ 
                date: user_appointment_date,
                isTimeSlotAvailable: true
            });
    
            let available_time_slots = '';
            if (available_app_slots.length > 0) {
                // Create array with only time slots of selected date
                available_time_slots = available_app_slots.map(available_app_slots => available_app_slots.time);
            }

            // Render G page
            res.render('g_test', {
                user,
                errorMessage: '',
                isG2Passed: true,
                appointmentTimeBooked: false,
                appointment_date: now,
                appointment_booking_error: 'Please select a time slot to proceed with booking.',
                current_date: now,
                available_time_slots,
            });
        }
        next();
    } catch (error) {
        console.log(error);
    }

};