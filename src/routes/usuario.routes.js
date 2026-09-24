// src/routes/usuario.routes.js
// Rutas de administración y consulta de usuarios

import { Router } from 'express';
import * as usuarioController from '../controllers/usuario.controller.js';
import { autenticarUsuario, requiereRol } from '../middlewares/auth.js';

const router = Router();

// Todas las rutas de usuarios requieren estar autenticado
router.use(autenticarUsuario);

// Solo administradores pueden listar todos los usuarios
router.get('/', requiereRol('administrador'), usuarioController.listar);

// Ver usuario por ID (cliente solo puede verse a sí mismo, admin a cualquiera)
router.get('/:id', usuarioController.obtener);

export default router;
