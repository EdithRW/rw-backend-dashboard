const User = require ('../models/user');
const fs = require('fs');


const updateImg = async (type, id, path, fileName) => {
    
    switch(type){
        case 'users':


        
            const user = await User.findById(id);
 
            if(!user){
                
                console.log('user not found');
                return false; 
                
            }
            
            const oldPath = `./uploads/users/${user.img}`;
            //delete the image from the server
            if(user.img && fs.existsSync(oldPath)){

                fs.unlinkSync(oldPath);
            }
           
            user.img = fileName;
            
            //user.img = `${path}/${fileName}`.replace(/ /g,'') ;
            
            await user.save(); 
            return true
        
        break;
        
    }
    
    
    
    
    
    
    
}

module.exports = {
    updateImg,
}