const jwt = require('jsonwebtoken');
const User = require('../models/user');

// Helper function to generate a JSON Web Token for a user
const signToken = user => {
    
    return new Promise( (resolve, reject) => {

        const payload = {
            uid: user.id,
            email: user.email
        };
        
        const options = {
            expiresIn: '10hr'
        };
        
        jwt.sign(payload, process.env.JWT_SECRET, options, function(err, token) {
            
            if(err){
                console.log(err);
                reject({msg: "Could not create token."});

            } else {
                resolve(token);
            }
            
        });
        
        
    });
    
    
};

module.exports = {
    signToken
}