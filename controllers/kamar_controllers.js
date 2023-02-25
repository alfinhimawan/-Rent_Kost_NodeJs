const express = require("express")
const bodyParser = require("body-parser")
const cors = require("cors")
const db = require("../config") 
const multer = require("multer") 
const path = require("path")
const fs = require("fs") 
const { error } = require("console") // mboten ngertos

const app = express()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static(__dirname));


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // set file storage
        cb(null, './image');
    },
    filename: (req, file, cb) => {
        // generate file name 
        cb(null, "image-"+ Date.now() + path.extname(file.originalname))
    }
})

let upload = multer({storage : storage})

// end-point untuk menambahkan data kamar
app.post("/", upload.single('image'), (req,res) => {
    let data = {
        nomor_kamar : req.body.nomor_kamar,
        status_kamar : req.body.status_kamar,
        image : req.file.filename
    }
    if(!req.file) {
        res.json({
            message : "Tidak ada file yang dikirim"
        })
    } else {

        let sql = "insert into kamar set ?"

        db.query(sql, data, (error, result) => {
            if(error) throw error
            res.json({
                message : result.affectedRows + " data inserted"
            })
        })

    }
})

// end-point akses data kamar
app.get("/", (req, res) => {
    // create sql query
    let sql = "select * from kamar"

    // run query
    db.query(sql, (error, result) => {
        let response = null
        if (error) {
            response = {
                message: error.message 
            }            
        } else {
            response = {
                count: result.length, 
                kamar: result 
            }            
        }
        res.json(response) 
    })
})

// end-point akses data kamar berdasarkan id_kamar tertentu
app.get("/:id", (req,res) => {
    let data = {
        id_kamar: req.params.id
    }

    let sql = "select * from kamar where ?"

    db.query(sql, data, (error, result) => {
        let response = null
        if (error) {
            response = {
                message : error.message
            }
        } else {
            response = {
                count : result.length,
                kamar : result
            }
        }
        res.json(response)
    })
})

// end-point mengubah data kamar
app.put("/:id", upload.single("image"), (req,res) => {
    let data = null, sql =  null
    // parameter perubahan data
    let param = {
        id_kamar : req.params.id
    }

    if (!req.file) {
        // jika tidak ada file yang dikirim = update data saja
        data = {
            nomor_kamar : req.body.nomor_kamar,
            status_kamar : req.body.status_kamar
        }
    } else {
        // jika mengirim file = update data + reupload
        data = {
            nomor_kamar : req.body.nomor_kamar,
            status_kamar : req.body.status_kamar,
            image : req.file.filename
        }

        // get data yang akan diupadte untuk mendapatkan nama file yang lama

        sql = "select * from kamar where ?"
        // run query
        db.query(sql, param, (error, result) => {
            if (error) throw error
            // tampung nama file yang lama
            let filename = result[0].image

            // hapus file yang lama
            let dir = path.join(__dirname,"image",filename)
            fs.unlink(dir, (error) => {})
        })
    }
    
    // create sql update
    sql = "update kamar set ? where ?"

    // jalankan sql update
    db.query(sql, [data,param], (error, result) => {
        if (error) {
            res.json({
                message: error.message
            })
        } else {
            res.json({
                message: result.affectedRows + " data berhasil diubah"
            })
        }
    })

})

// endpoint untuk menghapus data kamar
app.delete("/:id", (req,res) => {
    let param = {id_kamar: req.params.id}

    // ambil data yang akan dihapus
    let sql = "select * from kamar where ?"
    // jalankan query
    db.query(sql, param, (error, result) => {
        if (error) throw error
        
        // tampung nama file yang lama
        let fileName = result[0].image

        // hapus file yg lama
        let dir = path.join(__dirname,"image",fileName)
        fs.unlink(dir, (error) => {})
    })

    // create sql delete
    sql = "delete from kamar where ?"

    // jalankan query
    db.query(sql, param, (error, result) => {
        if (error) {
            res.json({
                message: error.message
            })
        } else {
            res.json({
                message: result.affectedRows + " data berhasil dihapus"
            })
        }      
    })
})

module.exports = app