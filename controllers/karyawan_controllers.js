const express = require("express")           
const bodyParser = require("body-parser")  
const cors = require("cors")                
const db = require("../config")             
const md5 = require("md5")                  

const app = express()                               
app.use(cors())                                     
app.use(bodyParser.json())                  
app.use(bodyParser.urlencoded({extended: true}))    

// end-point menyimpan data karyawan
app.post("/", (req,res) => {

    // prepare data
    let data = {
        username: req.body.username,
        password: md5(req.body.password),
        nama_karyawan: req.body.nama_karyawan,
        alamat_karyawan: req.body.alamat_karyawan,
        status: req.body.status
    }

    // create sql query insert
    let sql = "insert into karyawan set ?"

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
    let sql = "select * from karyawan" 

    /* Menjalankan query */
    db.query(sql, (error, result) => {  
        let response = null
        if (error) {
            response = {
                message: error.message 
            }            
        } else {
            response = {
                count: result.length,
                karyawan: result 
            }            
        }
        res.json(response) 
    })
})

/* Router READ By Id */
app.get("/:id", (req, res) => { 
    let data = {
        id_karyawan: req.params.id 
    }
    let sql = "select * from karyawan where ?" 

    /* Menjalankan query */
    db.query(sql, data, (error, result) => {
        let response = null    
        if (error) {                   
            response = {    
                message: error.message 
            }            
        } else {                      
            response = {
                count: result.length, 
                user: result 
            }            
        }
        res.json(response)
    })
})

/* Router UPDATE */
app.put("/:id", (req,res) => {

    /* Menangkap Data */
    let data = [
        {
            username: req.body.username,
            password: md5(req.body.password),
            nama_karyawan: req.body.nama_karyawan,
            alamat_karyawan: req.body.alamat_karyawan,
            status: req.body.status
        },
        {
            id_karyawan: req.params.id // Menangkap parameter dari primary key
        }
    ]
    let sql = "update karyawan set ? where ?" // Melakukan update ke sql

    /* Menjalankan query */
    db.query(sql, data, (error, result) => {
        let response = null         
        if (error) {              
            response = {
                message: error.message
            }
        } else {                  
            response = {
                message: result.affectedRows + " data updated"
            }
        }
        res.json(response) 
    })
})

/* Router DELETE */
// end-point menghapus data siswa berdasarkan id_karyawan
app.delete("/:id", (req,res) => {
    // prepare data
    let data = {
        id_karyawan: req.params.id
    }

    // create query sql delete
    let sql = "delete from karyawan where ?"

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