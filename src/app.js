// src/app.js
// Configura Express y los middlewares (sin arrancar el servidor)

import express from 'express';
import morgan from 'morgan';
import espaciosRouter from './routes/espacio.routes.js';
import { middlewareMantenimiento } from './middlewares/mantenimiento.js';

const app = express();

// Middlewares globales
app.use(morgan('dev')); // Logger
app.use(express.json()); // Parseo automático del body a JSON

// Reto 1: Middleware de mantenimiento (va antes de las rutas para bloquearlas si aplica)
app.use(middlewareMantenimiento);

// Rutas
app.get('/', (req, res) => res.json({ nombre: 'Sistema de Gestión de Parqueaderos API', version: '2.0 (Express)' }));
app.use('/api/espacios', espaciosRouter);

// 404 por defecto
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

export default app;
