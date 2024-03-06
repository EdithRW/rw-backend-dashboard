const { Router } = require('express');
const { check } = require('express-validator');
const { validateFields } = require('../middlewares/field-validation');

const { getCases, getCompliance, createUser, updateUser, deleteUser, getAppDetails, getAppList, chatResponse } = require('../controllers/pega');
const { validateJWT } = require('../middlewares/token-validation');

const router = Router();

//Rutas

router.get( '/', getCases);

router.get( '/compliance', getCompliance);

router.get( '/BackstageAPI/v1/applications/:id', getAppDetails);

router.get( '/BackstageAPI/v1/applications', getAppList);

router.post( '/BackstageAPI/v1/chat', chatResponse);

router.post( '/', 
[
    check('name', 'name is mandatory').not().isEmpty(),
    check('password', 'password is mandatory').not().isEmpty(),
    check('email', 'email format incorrect').isEmail(),
    validateFields
], 
createUser
);

router.put( '/:id', 
[
    validateJWT,
    check('name', 'name is mandatory').not().isEmpty(),
    check('email', 'email format incorrect').isEmail(),
    check('role', 'role is mandatory').not().isEmpty(),
    validateFields
], 
updateUser
);

router.delete( '/:id', validateJWT, deleteUser);


module.exports = router;