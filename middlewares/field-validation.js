const { response } = require('express');
const { validationResult } = require('express-validator');

const validateFields = (req, res = response, next) => {

    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(400).json({
            ok: false,
            msg:'Error en la validacion de datos',
            errors: errors.mapped(),
        })
    }
    //Si no hay errores pasamos a la siguiente capa
    next();

}

module.exports = {
    validateFields
}