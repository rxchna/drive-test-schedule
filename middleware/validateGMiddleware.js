const UserModel = require('../models/User');
const AppointmentModel = require("../models/Appointment");

module.exports = async (req, res, next) => {
    try {
        // Check if input fields of car information are null
        let errorMessage = validateCarInformationData(req.body);

        if(errorMessage) {
            // Display back original user details
            const user = await UserModel.findById(req.session.userId);

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

            // Check if user has already booked an appointment
            if(user.appointment?.appointment_id && user.appointment?.testType == 'G') {
                // Get appointment details
                const appointment = await AppointmentModel.findById(user.appointment.appointment_id);

                // Render g page with booked appointment time
                return res.render('g_test', {
                    user,
                    errorMessage,
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
                if(user.appointment?.appointment_id && 
                    user.appointment?.testType == 'G2' &&
                    user.appointment?.isPass == true) {
                        // Render g test with appointment slots
                        return res.render('g_test', {
                            user,
                            errorMessage,
                            isG2Passed: true,
                            appointmentTimeBooked: false,
                            appointment_date: now,
                            appointment_booking_error: '',
                            current_date: now,
                            available_time_slots,
                        });
                }
                else {
                    return res.render('g_test', {
                        user,
                        errorMessage,
                        isG2Passed: false,
                        appointmentTimeBooked: false,
                        appointment_date: now,
                        appointment_booking_error: 'You are not elligible to book your G test until G2 is completed successfully.',
                        current_date: now,
                        available_time_slots,
                    });
                }
            }
        }
        next();
    } catch (error) {
        console.error(error);
    }
};

/* Function to validate Car Information input data */
const validateCarInformationData = (userData) => {
    if(!userData.car_details.car_make ||
        !userData.car_details.car_model || 
        !userData.car_details.car_year ||
        !userData.car_details.car_plate_no
    ) {
        return "Please ensure all Car Information fields are filled out before submitting the form.";
    }

    // Car year should be 4-digit number
    if(userData.car_details.car_year && (
        userData.car_details.car_year.length !== 4 || 
        isNaN(userData.car_details.car_year))) {
        return "Car year must be a valid four-digit number.";
    }

    // Car year cannot be in the future
    const currentYear = new Date().getFullYear();
    if(parseInt(userData.car_details.car_year) > currentYear) {
        return "Car year cannot be in the future.";
    }

    // Validation success
    return "";
}