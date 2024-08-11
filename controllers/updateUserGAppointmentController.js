const UserModel = require("../models/User");
const AppointmentModel = require("../models/Appointment");

module.exports = async (req, res) => {
    try {

        // Update selected appointment and set availability flag to false
        const updatedAppointment = await AppointmentModel.findOneAndUpdate(
            { date: req.body.user_appointment_date, time: req.body.time_slot },
            { isTimeSlotAvailable: false },
            { new: true }
        );

        // Update appointment_id of user
        const updatedUser = await UserModel.findByIdAndUpdate(req.session.userId,
            { 
                $set: {  // $set? todo
                    'appointment.appointment_id': updatedAppointment._id,
                    'appointment.testType': 'G'
                }
            },
            { new: true }
        );

        // Render G page
        res.render('g_test', {
            user: updatedUser,
            errorMessage: '',
            isG2Passed: true,
            appointmentTimeBooked: updatedAppointment.time,
            appointment_date: req.body.user_appointment_date,
            appointment_booking_error: '',
            current_date: '',
            available_time_slots: ''
        });
        
    } catch (error) {
        console.log(error);
    }
};