/* Menggunakan MODUl (NPM) */
const express = require("express")          // Import file express    
const bodyParser = require("body-parser")   // Import body-parser (mendapatkan form)
const cors = require("cors")                // Menghubungkan broweser ke web-service
const db = require("../config")             //import konfigurasi database
const md5 = require("md5")                  //mengubah password menjadi format md5

const app = express()                               // Membuat app (menjalankan express)
app.use(cors())                                     // Menggunkan express
app.use(bodyParser.json())                          // Menerima form (data) dalam bentuk JSON
app.use(bodyParser.urlencoded({extended: true}))    

// end-point menyimpan data user
app.post("/", (req,res) => {

    // prepare data
    let data = {
        nama_user: req.body.nama_user,
        username: req.body.username,
        password: md5(req.body.password),
        alamat_user: req.body.alamat_user
    }

    // create sql query insert
    let sql = "insert into user set ?"

    // run query
    db.query(sql, data, (error, result) => {
        let response = null
        if (error) {
            response = {
                message: error.message
            }
        } else {
            response = {
                message: result.affectedRows + " data inserted"
            }
        }
        res.json(response)
    })
})

/* Router READ */
app.get("/", (req, res) => {
    let sql = "select * from user" // Menampilkan semua isi data user dari sql

    /* Menjalankan query */
    db.query(sql, (error, result) => {  
        let response = null     // Mengirimkan response null
        if (error) {
            response = {
                message: error.message // pesan error
            }            
        } else {
            response = {
                count: result.length, // jumlah data
                user: result // isi data
            }            
        }
        res.json(response)
    })
})

/* Router READ By Id */
app.get("/:id", (req, res) => { 
    let data = {
        id_user: req.params.id // Menangkap req dari body yang dikirim
    }
    let sql = "select * from user where ?" // Menampilkan user siswa berdasarkan id

    /* Menjalankan query */
    db.query(sql, data, (error, result) => {
        let response = null     // Mengirimkan response null
        if (error) {                   // Jika error
            response = {    
                message: error.message // pesan error
            }            
        } else {                      // Jika tidak error tampilkan
            response = {
                count: result.length, // jumlah data
                user: result // isi data
            }            
        }
        res.json(response)
    })
})

/* Router UPDATE */
app.put("/:id", (req,res) => {

    /* Menangkap Data */
    let data = [
        /* Menangkap data yang dikirim oleh body (postman) */
        {
            nama_user: req.body.nama_user,
            username: req.body.username,
            password: md5(req.body.password),
            alamat_user: req.body.alamat_user
        },
        {
            id_user: req.params.id // Menangkap parameter dari primary key
        }
    ]
    let sql = "update user set ? where ?" // Melakukan update ke sql

    /* Menjalankan query */
    db.query(sql, data, (error, result) => {
        let response = null         // Menanpilkan response null (set null)
        if (error) {                // Jika error tampilkan pesan
            response = {
                message: error.message
            }
        } else {                    // Jika tidak error tampilkan data + "Data update"
            response = {
                message: result.affectedRows + "data updated"
            }
        }
        res.json(response)
    })
})

/* Router DELETE */
// end-point menghapus data siswa berdasarkan id_user
app.delete("/:id", (req,res) => {
    // prepare data
    let data = {
        id_user: req.params.id
    }

    // create query sql delete
    let sql = "delete from user where ?"

    // run query
    db.query(sql, data, (error, result) => {
        let response = null
        if (error) {
            response = {
                message: error.message
            }
        } else {
            response = {
                message: result.affectedRows + " data deleted"
            }
        }
        res.json(response)
    })
})

module.exports = app        
