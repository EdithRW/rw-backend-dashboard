

const { Router } = require('express');
const expressFileUpload = require('express-fileupload');


const { validateJWT } = require('../middlewares/token-validation');
const { fileUpload, returnImg } = require('../controllers/uploads');

const router = Router();

router.use(expressFileUpload());

router.put('/:type/:id', validateJWT, fileUpload);

router.get('/:type/:imgFile', returnImg);

module.exports = router;