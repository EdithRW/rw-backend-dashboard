/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication managing API
 * /:
 *   post:
 *     summary: Log In
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Book'
 *     responses:
 *       200:
 *         description: The created book.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       500:
 *         description: Some server error
 *
 */

const { Router } = require('express');
const {login, loginGoogle, refreshToken} = require('../controllers/auth');
const { validateJWT } = require('../middlewares/token-validation');

const router = Router();

router.post('/', login);

router.post('/google', loginGoogle);

router.get('/refresh', validateJWT, refreshToken);

module.exports = router;