const User = require('../models/user');

const { response } = require ('express');
const { signToken } = require('../helpers/jwt');

const bcrypt = require('bcryptjs');
const { googleVerify } = require('../helpers/google-verify');



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
            return res.status(404).json({ 
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

const loginGoogle = async(req, res = response) =>{

    const googleToken = req.body.token

    try {
        if(!googleToken){
            return res.status(400).json({
                ok:false,
                msg: 'Missing token'
            });
        }

        const {name, email, picture} = await googleVerify(googleToken);

        const userDB = await User.findOne({email});

        let newUser;
        
        if (!userDB) {
            newUser = new User({
                name,
                email,
                password: '@@@',
                google: true,
                role: 'user',
                img: picture
            })
        } else {
            newUser = userDB
            newUser.google = true;
        }

        await newUser.save();

        const token = await signToken(newUser);
        
        res.json({
            ok:true,
            msg: 'login with google succesfull',
            newUser, 
            token
        });
        
        
        
    } catch (err) {
        console.log(err);
        res.status(500).json({
            ok: false,
            error: err,
            msg: 'Error logging in with google',
        });
    };
    
    
}

const refreshToken = async(req,res = response) => {

    const email = req.email;

    let user = await User.findOne({email});

    const token = await signToken(user); 

    res.json({
        ok : true ,
        token, 
        user
    })
}



module.exports = {
    login,
    logout,
    loginGoogle,
    refreshToken
};
