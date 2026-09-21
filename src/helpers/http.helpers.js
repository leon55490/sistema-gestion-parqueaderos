// helpers/http.helpers.js — Utilidades HTTP: lo que un framework haría por nosotros

/**
 * Responde con JSON y el código de estado indicado.
 * Equivale a res.status(codigo).json(datos) en Express.
 */
export function responderJson(res, codigo, datos) {
  res.writeHead(codigo, { 'Content-Type': 'application/json; charset=utf-8' });
  // 204 No Content no lleva body
  if (codigo === 204) return res.end();
  res.end(JSON.stringify(datos));
}

/**
 * Lee el body de la petición.
 * El body llega en pedazos (chunks) por un stream; hay que juntarlos
 * y parsear el JSON a mano. Express hace esto automáticamente.
 */
export function leerBody(req) {
  return new Promise((resolve, reject) => {
    let cuerpo = '';
    req.on('data', (pedazo) => { cuerpo += pedazo; });
    req.on('end', () => {
      if (cuerpo === '') return resolve(null);
      try {
        resolve(JSON.parse(cuerpo));
      } catch {
        reject(new Error('JSON inválido'));
      }
    });
    req.on('error', reject);
  });
}
