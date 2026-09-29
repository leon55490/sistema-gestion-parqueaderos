// src/routes/auth.routes.js
// Rutas de autenticación pública y gestión de sesión

import { Router } from 'express';
import { body } from 'express-validator';
import * as authController from '../controllers/auth.controller.js';
import { autenticarUsuario } from '../middlewares/auth.js';
import { validar } from '../middlewares/validar.js';

const router = Router();

const reglasRegistro = [
  body('nombre').trim().notEmpty().withMessage('El nombre es obligatorio'),
  body('correo').trim().notEmpty().isEmail().withMessage('El formato del correo electrónico no es válido'),
  body('password').trim().isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
  body('rol').optional().trim().isIn(['cliente', 'administrador']).withMessage('El rol debe ser cliente o administrador')
];

const reglasLogin = [
  body('correo').trim().notEmpty().withMessage('Debe ingresar correo'),
  body('password').trim().notEmpty().withMessage('Debe ingresar contraseña')
];

router.post('/registro', reglasRegistro, validar, authController.registro);
router.post('/login', reglasLogin, validar, authController.login);
router.get('/perfil', autenticarUsuario, authController.perfil);
router.post('/logout', autenticarUsuario, authController.logout);

export default router;
