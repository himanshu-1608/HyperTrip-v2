
const User = require('../models/user');

exports.createUser = async(userInfo) => {
    try{
        let createdUser = new User(userInfo);
        createdUser = await createdUser.save();
        return createdUser;
    }
    catch(error){
        throw new Error('DB error while creating a user!');
    }
}

exports.findUserWithEmail = async(email) => {
    try{
        const user = await User.findOne({email: email});
        return user;
    }
    catch(error){
        throw new Error('DB error while finding user by email!');
    }
}