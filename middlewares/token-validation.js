const jwt = require('jsonwebtoken');

const validateJWT = (req, res, next) => {
    
    const token = req.header('x-token');
    
    if (!token) {
        
        return res.status(401).json({ 
            ok: false,
            msg: 'No token provided.' 
        });
    }
    try {
        const {uid, email} = jwt.verify(token, process.env.JWT_SECRET);
        req.uid = uid;
        req.email = email;

        next();

    } catch (err) {
        return res.status(401).json({
            ok: false,
            msg: 'Invalid token.'
        })
    };
     
}

module.exports = {
    validateJWT
}

