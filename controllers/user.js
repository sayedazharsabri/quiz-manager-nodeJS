const User = require('../models/user');

exports.isUserExistCheckByEmail = async (email) => {
    const user = await User.findOne({ email });
    if (user) {
        return true;
    }
    return false;
}