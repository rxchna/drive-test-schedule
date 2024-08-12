const AppointmentModel = require('../models/Appointment');
const UserModel = require('../models/User');

module.exports = async (req, res) => {

    // Array of predefined time slots
    const timeSlots = [
        '09:00', '09:30', '10:00', '10:30',
        '11:00', '11:30', '12:00', '12:30',
        '13:00', '13:30', '14:00'
    ];

    // Get current date
    const now = new Date().toISOString().split('T')[0];

    // Get created appointments for current date
    const created_appointment_time_slots = await AppointmentModel.find({ date: now });

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
                appointmentType: candidate.appointment.testType,
                isPass: candidate.appointment.isPass,
                comments: candidate.appointment.comment
            })
        }
    }

    console.log("#rp: ", candidateResults);

    // Pass time slots on rendering
    res.render('appointment', {
        appointment_date: now,
        current_date: now,
        timeSlots,
        created_time_slots,
        appointment_creation_message: '',
        appointment_error_message: '',
        candidateResults
    });
}