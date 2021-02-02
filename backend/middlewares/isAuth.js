
const jwt = require('jsonwebtoken');

const { SECRET } = require('../config');

module.exports = async(req, res, next) => {
    const authorized = req.get('Authorization');
    if(authorized){  
        const token = authorized.split(' ')[1];
        let decodedToken;
        try{
            decodedToken = jwt.verify(token, SECRET);
        }catch(err){
            const error = new Error('Server Error.');
            error.statusCode = 401;
            return next(error);
        }
        if(!decodedToken){
            const error = new Error('User is not authenticated.');
            error.statusCode = 401;
            return next(error);
        }
        req.userId = decodedToken.userId;
        next();
    }
    else{
        const error = new Error('User is not authenticated.');
        error.statusCode = 401;
        next(error);
    }
}