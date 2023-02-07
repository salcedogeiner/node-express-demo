var express = require("express")
var app = express()
var db = require("./database.js")
var md5 = require("md5")

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var HTTP_PORT = 8000

// Start server
app.listen(HTTP_PORT, () => {
    console.log("Server running on port %PORT%".replace("%PORT%",HTTP_PORT))
});

app.get("/api/validarQR", (req, res, next) => {
    var sql = "select * from states"
    var params = []
    db.get(sql, params, (err, row) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }
        res.json({
            "status": "ok",
            "amount":row.amount,
            "state":row.state
        })
      });
});

app.post("/api/generarQR/", (req, res, next) => {    
    var sql ='UPDATE states set state = ?, amount = ?'
    var params =["pendiente", "0"]
    db.run(sql, params, function (err, result) {
        if (err){
            res.status(400).json({"error": err.message})
            return;
        }
        res.json({
            "status": "ok",
        })
    });
})


app.post("/api/leerQR/", (req, res, next) => {
    var data = {
        amount: req.body.amount
    }
    var sql ='UPDATE states set state = ?, amount = ?'
    var params =["porConfirmar", data.amount]
    db.run(sql, params, function (err, result) {
        if (err){
            res.status(400).json({"error": err.message})
            return;
        }
        res.json({
            "status": "ok",
        })
    });
})

app.post("/api/ConfirmarQR/", (req, res, next) => {    
    var data = {
        action: req.body.action
    }
    var sql ='UPDATE states set state = ?'
    var params =[data.action ? "exitoso" : "cancelado" ]
    db.run(sql, params, function (err, result) {
        if (err){
            res.status(400).json({"error": err.message})
            return;
        }
        res.json({
            "status": "ok",
        })
    });
})

// Root path
app.get("/", (req, res, next) => {
    res.json({"message":"Ok"})
});

