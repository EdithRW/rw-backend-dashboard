const User = require('../models/user');
const { response } = require ('express');

const bcrypt = require('bcryptjs');
const { signToken } = require('../helpers/jwt');




const getUsers = async(req, res)=>{
    
    const users = await User.find({}, 'name email role google');
    
    res.json({
        ok:true,
        users,
        uid: req.uid
    });
    
} 

const createUser = async(req, res = response)=>{
    
    const{email,password} = req.body;
    
    try{
        
        const existEmail = await User.findOne({email});
        
        if(existEmail){
            return res.status(400).json({
                ok: false,
                msg:'El correo electronico ya existe'
            })
        };
        
        const user = new User(req.body);

        //Encriptar contraseña
        const salt = bcrypt.genSaltSync();
        user.password= bcrypt.hashSync(password,salt);
        
        //Guardar Usuario
        await user.save();

        const token = await signToken(user);
        
        res.json({
            ok:true,
            user,
            token
        });
        
    } catch {
        return res.status(500).json({
            ok: false,
            msg: 'Error en creacion',
            err
        })
    };
    
} 

const updateUser = async (req, res = response) => {
    
    const userId = req.params.id;

    try {

        const userDB = await User.findById(userId);

        if(!userDB){
            return res.status(404).json({
                ok:false,
                msg:"Usuario no encontrado",
                });
        }

        //Actualizacion de db
        const userUpdate = await User.updateOne({_id : userId}, req.body );
        const userNew = await User.findById(userId);


        res.json({
            ok: true,
            msg:"Usuario actualizado",
            id: userId,
            userNew
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok:false,
            msg:"Error al actualizar el usuario",
            error
        });
        
    }


}

const deleteUser = async (req, res = response) => {
    
    const userId = req.params.id;

    try {

        const userDB = await User.findById(userId);

        if(!userDB){
            return res.status(404).json({
                ok:false,
                msg:"Usuario no encontrado",
                });
        }

        //Actualizacion de db
        const userDelete = await User.findByIdAndDelete(userId);

        res.json({
            ok: true,
            msg:"Usuario borrado",
            id: userId,
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok:false,
            msg:"Error al borrar el usuario",
            error
        });
        
    }


}

module.exports = {
    getUsers,
    createUser,
    updateUser, 
    deleteUser
}