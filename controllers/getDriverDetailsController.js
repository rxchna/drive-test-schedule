const UserModel = require("../models/User");
const AppointmentModel = require("../models/Appointment");

module.exports = async (req, res) => {
    const selectedDriverID = req.body.selectedDriverID || req.query.selectedDriverID || '';
    const filterTestType = req.query.testType || ''; 

    try {
        // Get driver if selectedDriverID exists
        const driver = selectedDriverID ? await UserModel.findById(selectedDriverID) : null;

        // Get present date
        const now = new Date().toISOString().split('T')[0];

        // Get list of available appointments
        const appointments = await AppointmentModel.find({ 
            isTimeSlotAvailable: false,
            date: { $gte: now } 
        });

        // Loop through each appointment ID
        const driverAppointmentDetails = [];
        for (let appointment of appointments) {
            // Find driver associated with the current appointment ID
            const driver = await UserModel.findOne({
                'appointment.appointment_id': appointment._id.toString(),
                'appointment.testType': filterTestType ? filterTestType : { $exists: true }  // Apply filter
            });

            // Show only candidates who have not conducted their tests
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

        res.render('examiner', { 
            driverAppointmentDetails,
            filterTestType,
            selectedDriverID,
            driver,
            isDriverUpdated: false,
            saveErrorMessage: ''
        });

    } catch (error) {
        console.log(error);
    }
}
