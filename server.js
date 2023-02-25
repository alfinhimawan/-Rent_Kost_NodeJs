const express = require("express")
const bodyParser = require("body-parser")
const cors = require("cors")                   
const db = require("./config") 

const app = express()  
app.use(cors())                                    
app.use(bodyParser.json())                          
app.use(bodyParser.urlencoded({extended: true}))

const user = require("./controllers/user_controllers")
app.use("/user", user)

const karyawan = require("./controllers/karyawan_controllers")
app.use("/karyawan", karyawan)

const kamar = require("./controllers/kamar_controllers")
app.use("/kamar", kamar)

const pembayaran = require("./controllers/pembayaran_controllers")
app.use("/pembayaran", pembayaran)


/* membuat web server dengan port 8000 */
app.listen(8000, () => {
    console.log("server run on port 8000")
})
