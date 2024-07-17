module.exports = (req, res) => {
    res.render('register', {
        errorMessage: '',
        userRegisteredSuccess: false
    });
}