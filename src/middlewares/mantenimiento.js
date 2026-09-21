// src/middlewares/mantenimiento.js
export function middlewareMantenimiento(req, res, next) {
  if (process.env.MANTENIMIENTO === 'true') {
    return res.status(503).json({ error: 'En mantenimiento' });
  }
  next();
}
