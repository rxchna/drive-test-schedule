const AppointmentModel = require('../models/Appointment');
const UserModel = require('../models/User');

module.exports = async (req, res) => {
    try {
        // Get present date
        const now = new Date().toISOString().split('T')[0];

        // Get testType from query parameters
        const filterTestType = req.query.testType || '';

        // Get list of available appointments
        const appointments = await AppointmentModel.find({ 
            isTimeSlotAvailable: false,
            date: { $gte: now } 
        });

        // Loop through each appointment ID
        const driverAppointmentDetails = [];
        for (let appointment of appointments) {
            // Find driver associated with the current appointment ID and filter by testType
            const driver = await UserModel.findOne({
                'appointment.appointment_id': appointment._id.toString(),
                'appointment.testType': filterTestType ? filterTestType : { $exists: true }  // Apply filter
            });

            if (driver != null && driver.appointment.isPass == null) {
                // Add driver's details with their appointment details to the array
                driverAppointmentDetails.push({
                    driverID: driver._id,
                    name: `${driver.firstname} ${driver.lastname}`,
                    testType: driver.appointment?.testType,
                    appointmentID: appointment._id,
                    appointmentDate: appointment.date,
                    appointmentTime: appointment.time
                });
            }
        }

        console.log("###rp driver appointment details: ", driverAppointmentDetails);

        // Pass time slots and drivers on rendering
        res.render('examiner', { 
            driverAppointmentDetails,
            filterTestType,
            selectedDriverID: false,
            driver: '',
            isDriverUpdated: false,
            saveErrorMessage: ''
        });

    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).send('Internal Server Error');
    }
};