// src/routes/auth.routes.js
// Rutas de autenticación pública y gestión de sesión

import { Router } from 'express';
import * as authController from '../controllers/auth.controller.js';
import { autenticarUsuario } from '../middlewares/auth.js';

const router = Router();

router.post('/registro', authController.registro);
router.post('/login', authController.login);
router.get('/perfil', autenticarUsuario, authController.perfil);
router.post('/logout', autenticarUsuario, authController.logout);

export default router;
