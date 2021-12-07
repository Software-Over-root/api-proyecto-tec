const nodemailer = require("nodemailer");
const admin = require('firebase-admin');
var fs = require('fs');
const UUID = require("uuidv4");

//      conexion base de datos
var serviceAccount = require("../../tecnologias-emergentes-13454-firebase-adminsdk-kqh6g-efaaaf58cd.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://tecnologias-emergentes-13454-default-rtdb.firebaseio.com/',
    storageBucket: "tecnologias-emergentes-13454.appspot.com"
});
const db = admin.firestore();


exports.inicio = (req, res, next) => {
    res.send({"success": true, "type": "Hola mundo desde la API de seguridad de intrucion 3"});
}

exports.confirmacion = async (req, res, next) => {
    
    async function main() {

        let transporter = nodemailer.createTransport({
            host: "mail.softwareover.com.mx",
            port: 587,
            secure: false,
            auth: {
                user: 'web@softwareover.com.mx',
                pass: 'ezag~MaB6f*1',
            },
            tls: {
                rejectUnauthorized: false
            }
        });

        let info = await transporter.sendMail({
            from: '"Correo de confirmacion" <web@softwareover.com.mx>',
            to: req.body.correo,
            subject: "Hola usario",
            text: "Tu codigo de confirmacion es: " + req.body.codigo,
            html: "<b>Tu codigo de confirmacion es: " + req.body.codigo + "</b>",
        });
    }

    var respuesta = await main();
    if (respuesta === undefined) {
        res.send({"success": true, "type": "Mensaje enviado"});
    } else {
        res.send({"success": false, "type": "Error en autentificacion", "error": error});
    }
}

exports.subirImagen = async (req, res, next) => {
    console.log("Empezo la subida");
    var fecha = new Date();
    var string_fecha = "";
    //se harcorea el 0 del dia esto solo si es de los primeros 9 dias del mes
    string_fecha = fecha.getFullYear() + "-" + (fecha.getMonth() + 1) + "-0" + fecha.getDate() + "_" + fecha.getHours() + "." + fecha.getMinutes() + 
        "." + fecha.getSeconds() + "." + fecha.getMilliseconds();
    var files = fs.readdirSync('C:/Users/Oscar Lopez/Desktop/Escuela/octavo/tecnologias emergentes/api_alarma_local/src/images');
    files = files;
    var bucket;
    let uuid = UUID();
    if (bucket == undefined) {
        bucket = admin.storage().bucket();
    }
    bucket.upload(`./src/images/${files[files.length - 1]}`, {
        destination: `${string_fecha}.png`,
        
        gzip: true,
        metadata: {
            cacheControl: 'public, max-age=31536000',
            firebaseStorageDownloadTokens: uuid
        }
    }).then( async (data) => {

        let file = data[0];
        var arrayURL = "https://firebasestorage.googleapis.com/v0/b/" + bucket.name + "/o/" + encodeURIComponent(file.name) + "?alt=media&token=" + uuid;
        req.body.urlImagen = arrayURL
        console.log(req.body.urlImagen);

        db.collection("intruciones").doc().set({
            fecha: new Date(),
            url: arrayURL
        }).then(() => {
            console.log("se creo la intrucion");
            const userRef = db.collection('usuario').doc(req.body.id);
            // Set the 'capital' field of the city
            userRef.update({
                estadoCasa: true
            }).then( () => {
                console.log("cambio el estado de la casa");
                next();
            }).catch( error => {
                console.log({"error": error});
                res.send({"success": false, "type": "Error en la alarma"});
            })
        });
        
    }).catch(err => {
        console.log(err);
        return res.send({"success": false, "type": "Error al subir imagen"});
    });
}

exports.enviarAlerta = async (req, res, next) => {
    console.log(req.body);
    async function main() {

        let transporter = nodemailer.createTransport({
            host: "mail.softwareover.com.mx",
            port: 587,
            secure: false,
            auth: {
                user: 'web@softwareover.com.mx',
                pass: 'ezag~MaB6f*1',
            },
            tls: {
                rejectUnauthorized: false
            }
        });

        let info = await transporter.sendMail({
            from: '"Tu casa esta en peligro!!!" <web@softwareover.com.mx>',
            to: req.body.correo,
            subject: "Hola usario",
            text: "hay un problema en tu casa!!!",
            html: "<b>Hemos  detectado una intrusion en tu casa!!!!</b><br /><img src='" + req.body.urlImagen + "'/>",
        });
    }

    var respuesta = await main();
    if (respuesta === undefined) {
        res.send({"success": true, "type": "Se a detectado una intrusion"});
    } else {
        res.send({"success": true, "type": "Se a detectado una intrusion, no se logro notificar"});
    }
}