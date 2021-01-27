const express=require("express")
const app=express()
const rtMain=require("./routes/rtMain")

//motor de plantillas handlebars
var exphbs  = require('express-handlebars');

app.engine('.hbs', exphbs({
    extname: ".hbs"
}));
app.set('view engine', '.hbs');

//middleware
app.use(express.static(__dirname +"/public")) //para mandarle a la carpeta public
app.use(express.urlencoded({extended:true})) //para que reciba la informacion de los formularios
app.use("/",rtMain) //Para todas las rutas principales, con el enroutador rtMain

//Puerto
app.listen(8000,(err)=>{console.log("Server run on port 8000")})

