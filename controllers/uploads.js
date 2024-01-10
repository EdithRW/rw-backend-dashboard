const { response } = require("express");
const { v4: uuidv4 } = require('uuid');
const { updateImg } = require("../helpers/update-img");
const fs = require('fs');

const path = require('path');



const fileUpload = (req, res = response) => {
    
        
    const type = req.params.type;
    const id = req.params.id;
    
    const validTypes = ['users'];
    
    if(!validTypes.includes(type)){
        return res.status(400).json({ 
            ok: false,
            msg: 'Invalid Upload Type' 
        });
        
    }
    
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({ 
            ok: false,
            msg: 'No file recieved' 
        });
    }
    
    const file = req.files.image;
    
    const reducedName = file.name.split('.');
    let fileExt = reducedName[reducedName.length -1];
    
    const validExt = ['png', 'jpg', 'jpeg', 'gif'];
    
    if(!validExt.includes(fileExt)){
        return res.status(400).json({ 
            ok: false,
            msg: 'Invalid file extension' 
        });
        
    }
    
    const fileName = `${uuidv4()}.${fileExt}`;
    
    const path = `./uploads/${type}/${fileName}`;
    
    // Use the mv() method to place the file somewhere on your server
    file.mv(path, (err) => {
        if (err){
            return res.status(500).json({ 
                ok: false,
                msg: 'Error moving file to path' 
            });
        }

        updateImg(type, id, path, fileName);

        
        res.json({
            ok: true,
            msg: "File Uploaded",
            fileName,
            path
        });
    });
    
    
    
    
}

const returnImg = (req, res = response ) => {
    const type = req.params.type;
    const img = req.params.imgFile;

    const pathImg = path.join(__dirname, `../uploads/${type}/${img}`);

    if(fs.existsSync(pathImg)){
        res.sendFile(pathImg);

    } else {

        const pathImg = path.join(__dirname, `../uploads/no-image.png`);
        res.sendFile(pathImg);

    }

    
}

module.exports = {
    fileUpload,
    returnImg
};