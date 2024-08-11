const AppointmentModel = require("../models/Appointment");
const UserModel = require('../models/User');

module.exports = async (req, res) => {
    const { appointment_date_chosen, time_slots } = req.body;

    try {
        let confirmationMsg = '';

        if(time_slots) {
            // Create appointment for every timeslot chosen
            for(let time_slot of time_slots) {
                const appointment = await AppointmentModel.create({
                    date: appointment_date_chosen,
                    time: time_slot
                });
            }
            confirmationMsg = 'Appointments created successfully!';
        }

        // Time slots to display
        const timeSlots = [
            '09:00', '09:30', '10:00', '10:30',
            '11:00', '11:30', '12:00', '12:30',
            '13:00', '13:30', '14:00'
        ];
        // Get current date for rendering appointment page
        const now = new Date().toISOString().split('T')[0];
        // Get created appointments for selected date
        const created_appointment_time_slots = await AppointmentModel.find({ date: appointment_date_chosen });
        // Create array with only time slots of selected date
        let created_time_slots = '';
        if (created_appointment_time_slots.length > 0) {
            // Create array with only time slots of selected date
            created_time_slots = created_appointment_time_slots.map(created_appointment_time_slots => created_appointment_time_slots.time);
        }

        // Get list of candidates who passed or failed their tests
        const candidates = await UserModel.find({
            'appointment.isPass' : { $ne: null }
        });

        // Get appointment date of each candidate
        const candidateResults = [];
        for(let candidate of candidates) {
            // Find appointment
            const appointment = await AppointmentModel.findById(candidate.appointment.appointment_id);

            if(appointment) {
                // Add candidate details + appointment date
                candidateResults.push({
                    candidateID: candidate._id,
                    candidateName: `${candidate.firstname} ${candidate.lastname}`,
                    appointmentDate: appointment.date,
                    isPass: candidate.appointment.isPass,
                    comments: candidate.appointment.comment
                })
            }
        }
        
        // Render Appointment view
        return res.render('appointment', {
            appointment_date: appointment_date_chosen,
            current_date: now,
            timeSlots,
            created_time_slots,
            appointment_creation_message: confirmationMsg,
            appointment_error_message: '',
            candidateResults
        });

    } catch (error) {
        console.log(error);
    }
}