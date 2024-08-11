const UserModel = require("../models/User");
const AppointmentModel = require("../models/Appointment");

module.exports = async (req, res) => {
    try {

        // Get user details related with appointment id
        let user = await UserModel.find({
            'appointment.appointment_id': req.body.appointment
        });

        console.log("Driver details of appointment ", user);

    } catch (error) {
        console.log(error);
    }
}