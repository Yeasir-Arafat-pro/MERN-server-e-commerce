const mongoose = require('mongoose');
const { mongodbURL } = require('../secret');
//const logger = require('../controllers/loggerController');


const connectDB = async ()=>{
    try {
      await  mongoose.connect(mongodbURL)
      console.log('DB is connected');
      mongoose.connection.on('error', (error)=>{
        console.log('DB connetion error:  ', error)
      })
    } catch (error) {
        console.log('DB is not connect:  ', error.toString());
        
    }
}

module.exports = connectDB