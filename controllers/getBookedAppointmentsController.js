const UserModel = require("../models/User");
const AppointmentModel = require("../models/Appointment");

module.exports = async (req, res) => {
    try {
        // Get present date
        const now = new Date().toISOString().split('T')[0];

        // Get list of appointments booked by drivers + where date is >= present date
        let appointments = await AppointmentModel.find({
                isTimeSlotAvailable: false,
                date: { $gte: now }
            }
        );
        console.log("list of appointments ", appointments);

    } catch (error) {
        console.log(error);
    }
}