const User = require('../models/user');

const { response } = require ('express');
const { signToken } = require('../helpers/jwt');

const bcrypt = require('bcryptjs');



const login = async(req, res = response) =>{

    // 1) Get the user's input from the request body
    const email = req.body.email;
    const password = req.body.password;

    try {
        
        if(!email || !password){
            return res.status(400).json({
                msg: 'Missing credentials'
            });
        }
        
        // 2) Check if the email exists in the database
        let user = await User.findOne({email})
        if (!user) {
            return res.status(400).json({ 
                ok: false,
                msg: "No user with that email found." 
            });
        }
        
        // 3) Compare the provided password to the hashed password stored in the database. If they match, create a JSON web token and send it back to the client
        // Note we are using bcrypt to compare passwords, since the password field is encrypted in the database
        const validPassword = await bcrypt.compareSync(password, user.password);

        if (!validPassword) {
            return res.status(400).json({ 
                ok: false,
                msg: "Wrong password"
            })
        }
        
        // Create token
        const token = await signToken(user);
        
        // Send back the token
        //res.cookie("token", token);
        
        // Sending back a response with the token will set the cookie in the browser (if the browser supports cookies)
        //res.sendFile(path.join(__dirname, "../client/build/index.html"));
        
        res.json({
            ok:true,
            msg: 'login succesfully',
            token
        });
        
    } catch (err) {
        console.log(err);
        res.status(500).json({
            ok: false,
            error: err,
            msg: 'Error logging in.',
        });
    };
};

const logout = (req,res)=>{
    res.clearCookie("token");
    // After logging out, redirect the user to the homepage
    res.redirect("/");
};



module.exports = {
    login,
    logout
};