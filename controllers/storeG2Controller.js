const UserModel = require("../models/User");
const bcrypt = require("bcrypt");

module.exports = async (req, res) => {
    try {
        const updatedUser = await UserModel.findByIdAndUpdate(req.session.userId,
            { ...req.body },
            { new: true } /* By default Mongoose returns the original document before the update. { new: true }, Mongoose returns document after the update. */
        );

        // Redirect to Dashboard
        res.redirect('/');
        
    } catch (error) {
        console.log(error);
    }
};