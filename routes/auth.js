const { Router } = require('express');
const {login, loginGoogle, refreshToken} = require('../controllers/auth');
const { validateJWT } = require('../middlewares/token-validation');

const router = Router();

router.post('/', login);

router.post('/google', loginGoogle);

router.get('/refresh', validateJWT, refreshToken);

module.exports = router;