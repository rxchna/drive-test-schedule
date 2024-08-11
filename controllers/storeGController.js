const UserModel = require("../models/User");
const AppointmentModel = require("../models/Appointment");

module.exports = async (req, res) => {
    try {
        // Update user details
        const updatedUser = await UserModel.findByIdAndUpdate(req.session.userId,
            {
                car_details: req.body.car_details
            }, { new: true } /* By default Mongoose returns the original document before the update. { new: true }, Mongoose returns document after the update. */
        );

        // Display g_test form with updated values
        // Get current date for appointment details
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

        // Check if user has already booked an appointment
        if(updatedUser.appointment?.appointment_id && updatedUser.appointment?.testType == 'G') {
            // Get appointment details
            const appointment = await AppointmentModel.findById(user.appointment.appointment_id);

            // Render g page with booked appointment time
            res.render('g_test', {
                user: updatedUser,
                errorMessage: '',
                isG2Passed: true,
                appointmentTimeBooked: appointment.time,
                appointment_date: appointment.date.toISOString().split('T')[0],
                appointment_booking_error: '',
                current_date: '',
                available_time_slots: ''
            });
        }
        else {
            // Render G page
            // Check if user has already booked and passed their G2 test before booking G test
            if(updatedUser.appointment?.appointment_id && 
                updatedUser.appointment?.testType == 'G2' &&
                updatedUser.appointment?.isPass == true) {
                    // Render g test with appointment slots
                    res.render('g_test', {
                        user: updatedUser,
                        errorMessage: '',
                        isG2Passed: true,
                        appointmentTimeBooked: false,
                        appointment_date: now,
                        appointment_booking_error: '',
                        current_date: now,
                        available_time_slots,
                    });
            }
            else {
                res.render('g_test', {
                    user: updatedUser,
                    errorMessage: '',
                    isG2Passed: false,
                    appointmentTimeBooked: false,
                    appointment_date: now,
                    appointment_booking_error: 'You are not elligible to book your G test until G2 is completed successfully.',
                    current_date: now,
                    available_time_slots,
                });
            }
        }
    } catch (error) {
        console.log(error);
    }
};