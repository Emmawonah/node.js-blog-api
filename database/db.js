const mongoose = require("mongoose")
require("dotenv").config()

function connectToDatabse(){
    mongoose.connect(process.env.MONGODB_URI)

    mongoose.connection.on("connected",() => {
        console.log("connect to database succesfully")
    })

    mongoose.connection.on("error",() => {
        console.log("fail to connect to databse")
    })
}

module.exports = connectToDatabse