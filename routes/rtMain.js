const express= require("express")
const app=express()
const rtMain=express.Router()
const fs =require("fs")
const QRCode = require('qrcode')
const {v4: uuidv4} = require('uuid')

let citas=JSON.parse(fs.readFileSync("miscitas.json",  "utf-8"))

//Rutas de las plantillas hbs

rtMain.get("/", function (req, res){
    res.render("home", {citas})
})

rtMain.get("/modificarcita", function (req, res){
    res.render("modificarcita", {citas})
})

rtMain.get("/vercita", function (req, res){
    res.render("vercita", {citas})
})

//Aquí las validaciones de id

rtMain.post("/modificar", function (req, res){
    
    let miId=req.body.id
    let citaIdentificada=[]
    
    for (let i = 0; i < citas.length; i++) {
        if (citas[i].id==miId){   
            console.log("el id es correcto")
            citaIdentificada.push=citas[i]
            
            let fecha=citas[i].fecha
            let hora=citas[i].hora
            let nombre=citas[i].nombre
            let apellidos=citas[i].apellidos
            res.render("eliminar", {fecha , hora, nombre, apellidos})
            
            //Elimino la cita
            rtMain.get("/citaeliminada", function (req, res){
                citas.splice(i)
                console.log(citas)
                res.render("citaeliminada")
            })
        }
        else console.log("el id no es correcto")
    }            
})

//Aquí las validaciones del formulario
rtMain.post("/procesar", function (req, res){

    let datosCita={
    nombre: req.body.nombre,
    apellidos: req.body.apellidos,
    email: req.body.email,
    telefono: req.body.telefono,
    fecha: req.body.fecha,
    hora: req.body.hora,
    }
    let id= uuidv4()
    datosCita.id = id.substr(-12)
    console.log(datosCita)
   
    let errores=[]

//Validar Nombre
    let nombre = req.body.nombre
    if (nombre=="") errores.push({ mensaje1: "El campo nombre no puede estar vacío."})

//Validar Apellido
    let apellidos = req.body.apellidos
    if (apellidos=="") errores.push({ mensaje2: "El campo apellido no puede estar vacío."})

//Validar email 
    let email=req.body.email
    emailRegex = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i
    if(emailRegex.test(email)){console.log("El email es correcto.")}
    
    else{errores.push({ mensaje3: "El campo email es incorrecto, introduzca un formato válido. P.e.: nombre1@gmail.com"})}

//Validar Teléfono
    let telefono=req.body.telefono
    if (telefono=="") errores.push({ mensaje4: "El campo teléfono no puede estar vacío."})

//Validar fecha 
    let fecha = req.body.fecha
    let f= new Date()
    
    let fechaactual=f.getFullYear() + "-0" + (f.getMonth() +1) + "-" + f.getDate()
    console.log(fechaactual)
    
    if(fecha < fechaactual){errores.push({ mensaje5: "Introduzca una fecha válida: debe ser superior a la fecha actual."})}
    let hora = req.body.hora

//Enviar errores

if (errores.length!==0) res.render("errores", {errores})

//Comprobar que fecha y hora no se repite

   let repeticion=[] 
    for (let i = 0; i < citas.length; i++) {
        if (citas[i].fecha==datosCita.fecha && citas[i].hora===datosCita.hora){   
            console.log("La fecha ya está reservada")
            res.render("citarepetida", {nombre, apellidos, fecha, hora})
            repeticion.push( citas[i])
            console.log(repeticion)
        }
    }            

//Validar y crear la cita

validaciones()
function validaciones(){
    if (errores.length==0 && repeticion.length==0){
        citas.push(datosCita)
        const json_citas= JSON.stringify(citas)
        fs.writeFileSync("miscitas.json", json_citas, "utf-8")
        //Enviar datos
        res.render("confirmacion", {datosCita})
    }
    }
})

rtMain.get('/modificarcita/:id', (req,res)=>{
    let id=req.params.id
    res.render("modificarcita")
})

module.exports=rtMain