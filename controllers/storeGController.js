const UserModel = require("../models/User");

module.exports = async (req, res) => {
    try {
        // Update user details
        const updatedUser = await UserModel.findByIdAndUpdate(req.session.userId,
            {
                car_details: req.body.car_details
            }, { new: true } /* By default Mongoose returns the original document before the update. { new: true }, Mongoose returns document after the update. */
        );

        // Display g_test form with updated values
        res.render('g_test', {
            user: updatedUser,
            errorMessage: ''
        });
        
    } catch (error) {
        console.log(error);
    }
};