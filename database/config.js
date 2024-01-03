const mongoose = require('mongoose');


const dbConnection = async() =>{
    try{
        mongoose.connect(process.env.DB_CNN);
        console.log('Database Online...');

    }catch(error){
        console.log(error);
        throw new Error('error al levantar la base de datos');

    }
    
}

module.exports = {
    dbConnection,
}


