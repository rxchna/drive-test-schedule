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
            { g2_appointment_id: updatedAppointment._id },
            { new: true }
        );

        // Render G2 page
        res.render('g2_test', {
            user: updatedUser,
            errorMessage: '',
            firstUserInput: false,
            appointment_date: req.body.user_appointment_date,
            current_date: '',
            available_time_slots: '',
            appointment_booking_error: '',
            appointmentTimeBooked: updatedAppointment.time
        });
        
    } catch (error) {
        console.log(error);
    }
};