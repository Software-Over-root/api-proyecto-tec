const express = require('express');
const router = express.Router();
const conexion = require('../controllers/conexion');

module.exports  = function(){
    router.post('/', conexion.inicio);
    router.post('/registro-codigo', conexion.confirmacion);
    router.post('/subir-imagen', conexion.subirImagen, conexion.enviarAlerta);

    return router;
}