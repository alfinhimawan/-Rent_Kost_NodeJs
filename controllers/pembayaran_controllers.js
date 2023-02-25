const express = require("express")
const bodyParser = require("body-parser")
const cors = require("cors")
const db = require("../config")
const moment = require("moment")

const app = express()
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

// end-point menambahkan data pembayaran
app.post("/", (req,res) => {
    let data = {
        id_user : req.body.id_user,
        nomor_pembayaran : Number(req.body.nomor_pembayaran),
        nama_pembayar : req.body.nama_pembayar,
        nominal_pembayaran : Number(req.body.nominal_pembayaran),
        tgl_pembayaran : moment().format('YYYY-MM-DD HH:mm:ss')
    }

    // parse to JSON
    let kamar = JSON.parse(req.body.kamar)

    // create query insert to pelanggaran_siswa
    let sql = "insert into pembayaran set ?"

    // run query
    db.query(sql, data, (error, result) => {
        let response = null
        
        if (error) {
            res.json({message: error.message})
        } else {
            
            // get last inserted id_pembayaran
            let lastID = result.insertId

            let data = []
            for (let index = 0; index < kamar.length; index++) {
                data.push([
                    lastID, kamar[index].id_kamar
                ])                
            }

            // create query insert detail_pembayaran
            let sql = "insert into detail_pembayaran(id_pembayaran, id_kamar) values ?"

            db.query(sql, [data], (error, result) => {
                if (error) {
                    res.json({message: error.message})
                } else {
                    res.json({message: "Data has been inserted"})
                }
            })
        }
    })
})

// end-point menampilkan data pembayaran
app.get("/", (req,res) => {
    // create sql query
    let sql = "SELECT pembayaran.id_pembayaran, pembayaran.id_user, pembayaran.nomor_pembayaran, pembayaran.nama_pembayar, pembayaran.nominal_pembayaran, pembayaran.tgl_pembayaran, detail_pembayaran.id_pembayaran, detail_pembayaran.id_kamar from pembayaran JOIN detail_pembayaran ON detail_pembayaran.id_pembayaran=pembayaran.id_pembayaran"

    db.query(sql, (error, result) => {
        if (error) {
            res.json({ message: error.message})   
        }else{
            res.json({
                count: result.length,
                pelanggaran_siswa: result
            })
        }
    })
})

// end-point untuk menghapus data pelanggaran_siswa
app.delete("/:id_pembayaran", (req, res) => {
    let param = { id_pembayaran: req.params.id_pembayaran}

    // create sql query delete detail_pelanggaran
    let sql = "delete from detail_pembayaran where ?"

    db.query(sql, param, (error, result) => {
        if (error) {
            res.json({ message: error.message})
        } else {
            let param = { id_pembayaran: req.params.id_pembayaran}
            // create sql query delete pelanggaran_siswa
            let sql = "delete from pembayaran where ?"

            db.query(sql, param, (error, result) => {
                if (error) {
                    res.json({ message: error.message})
                } else {
                    res.json({message: "Data has been deleted"})
                }
            })
        }
    })

})

module.exports = app