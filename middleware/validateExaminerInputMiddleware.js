const UserModel = require('../models/User');
const AppointmentModel = require('../models/Appointment');

module.exports = async (req, res, next) => {
    const { outcome, comments, selectedDriverID, filterTestType } = req.body;

    try {
        // Check if examiner has input an outcome + a comment
        let saveErrorMessage = '';
        console.log("#rp out")

        // Render back G2 with error message if no time slot is chosen
        if (!outcome || !comments) {
            console.log("#rp in")
            saveErrorMessage = "Please input performance outcome and a valid comment."

            // Render examiner page
            const fOutcome = outcome === 'pass';
    
            // Get driver
            const driver = await UserModel.findById(selectedDriverID);
    
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
                if (driver != null && !driver.appointment.isPass) {
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
    
            return res.render('examiner', { 
                driverAppointmentDetails,
                filterTestType,
                selectedDriverID,
                driver,
                isDriverUpdated: false,
                saveErrorMessage
            });
        }

        next();
    } catch (error) {
        console.log(error);
    }

};