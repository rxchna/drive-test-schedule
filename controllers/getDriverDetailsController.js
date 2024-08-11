const UserModel = require("../models/User");

module.exports = async (req, res) => {
    const selectedDriverID = req.body.selectedDriverID;
    try {
        // Get driver
        const driver = await UserModel.findById(selectedDriverID);
        console.log("#rp driver details: ", driver);
    } catch (error) {
        console.log(error);
    }
}