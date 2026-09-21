// services/espacio.service.js — Lógica de negocio y "base de datos" en memoria
// Se pierde al reiniciar el proceso: eso es "en memoria"

// --- Datos iniciales (simulan lo que vendría de PostgreSQL) ---
let espacios = [
  { id: 1, numero: 'A-01', tipo: 'carro',     estado: 'libre',    ubicacion: 'Piso 1 - Norte' },
  { id: 2, numero: 'A-02', tipo: 'carro',     estado: 'ocupado',  ubicacion: 'Piso 1 - Norte' },
  { id: 3, numero: 'A-03', tipo: 'carro',     estado: 'reservado', ubicacion: 'Piso 1 - Sur' },
  { id: 4, numero: 'M-01', tipo: 'moto',      estado: 'libre',    ubicacion: 'Piso 1 - Este' },
  { id: 5, numero: 'M-02', tipo: 'moto',      estado: 'libre',    ubicacion: 'Piso 1 - Este' },
  { id: 6, numero: 'B-01', tipo: 'bicicleta', estado: 'libre',    ubicacion: 'Entrada Principal' },
];
let siguienteId = 7;

// --- Constantes de validación ---
const TIPOS_VALIDOS   = ['carro', 'moto', 'bicicleta'];
const ESTADOS_VALIDOS = ['libre', 'ocupado', 'reservado', 'mantenimiento'];

// --- Operaciones CRUD + validaciones de negocio ---

/**
 * Obtener todos los espacios, con filtro opcional por estado y/o tipo.
 * Ejemplo: obtenerTodos({ estado: 'libre', tipo: 'moto' })
 */
export function obtenerTodos(filtros = {}) {
  let resultado = [...espacios];

  if (filtros.estado) {
    resultado = resultado.filter((e) => e.estado === filtros.estado);
  }
  if (filtros.tipo) {
    resultado = resultado.filter((e) => e.tipo === filtros.tipo);
  }

  return resultado;
}

/** Obtener un espacio por su id. Retorna null si no existe. */
export function obtenerPorId(id) {
  return espacios.find((e) => e.id === id) || null;
}

/**
 * Crear un nuevo espacio.
 * Validaciones de negocio:
 *  - numero, tipo y ubicacion son obligatorios
 *  - tipo debe ser uno de los válidos (carro, moto, bicicleta)
 *  - numero no se puede repetir (cada espacio es único en el parqueadero)
 *  - estado, si se envía, debe ser válido
 */
export function crear(datos) {
  const errores = [];

  if (!datos.numero || datos.numero.trim() === '') {
    errores.push('El campo "numero" es obligatorio');
  }
  if (!datos.tipo) {
    errores.push('El campo "tipo" es obligatorio');
  } else if (!TIPOS_VALIDOS.includes(datos.tipo)) {
    errores.push(`"tipo" debe ser uno de: ${TIPOS_VALIDOS.join(', ')}`);
  }
  if (!datos.ubicacion || datos.ubicacion.trim() === '') {
    errores.push('El campo "ubicacion" es obligatorio');
  }
  if (datos.estado && !ESTADOS_VALIDOS.includes(datos.estado)) {
    errores.push(`"estado" debe ser uno de: ${ESTADOS_VALIDOS.join(', ')}`);
  }

  // Validación de negocio: no se puede repetir el número de espacio
  if (datos.numero && espacios.some((e) => e.numero === datos.numero.trim())) {
    return { error: `Ya existe un espacio con el número "${datos.numero}"`, codigo: 409 };
  }

  if (errores.length > 0) {
    return { error: errores.join('; '), codigo: 400 };
  }

  const nuevo = {
    id: siguienteId++,
    numero: datos.numero.trim(),
    tipo: datos.tipo,
    estado: datos.estado || 'libre', // por defecto un espacio nuevo está libre
    ubicacion: datos.ubicacion.trim(),
  };

  espacios.push(nuevo);
  return { datos: nuevo, codigo: 201 };
}

/**
 * Actualizar un espacio existente.
 * Validaciones de negocio:
 *  - Si se cambia el tipo, debe ser válido
 *  - Si se cambia el estado, debe ser válido
 *  - Si se cambia el número, no puede ser uno que ya exista en otro espacio
 *  - No se puede cambiar el tipo de un espacio que está ocupado
 */
export function actualizar(id, datos) {
  const espacio = espacios.find((e) => e.id === id);
  if (!espacio) return { error: 'Espacio no encontrado', codigo: 404 };

  const errores = [];

  if (datos.tipo !== undefined) {
    if (!TIPOS_VALIDOS.includes(datos.tipo)) {
      errores.push(`"tipo" debe ser uno de: ${TIPOS_VALIDOS.join(', ')}`);
    } else if (espacio.estado === 'ocupado') {
      errores.push('No se puede cambiar el tipo de un espacio que está ocupado');
    }
  }

  if (datos.estado !== undefined && !ESTADOS_VALIDOS.includes(datos.estado)) {
    errores.push(`"estado" debe ser uno de: ${ESTADOS_VALIDOS.join(', ')}`);
  }

  if (datos.numero !== undefined) {
    if (datos.numero.trim() === '') {
      errores.push('El campo "numero" no puede estar vacío');
    } else if (espacios.some((e) => e.numero === datos.numero.trim() && e.id !== id)) {
      return { error: `Ya existe un espacio con el número "${datos.numero}"`, codigo: 409 };
    }
  }

  if (errores.length > 0) {
    return { error: errores.join('; '), codigo: 400 };
  }

  // Actualizamos solo los campos enviados
  if (datos.numero !== undefined)   espacio.numero   = datos.numero.trim();
  if (datos.tipo !== undefined)     espacio.tipo     = datos.tipo;
  if (datos.estado !== undefined)   espacio.estado   = datos.estado;
  if (datos.ubicacion !== undefined) espacio.ubicacion = datos.ubicacion.trim();

  return { datos: espacio, codigo: 200 };
}

/**
 * Eliminar un espacio.
 * Validación de negocio: no se puede eliminar un espacio que está ocupado
 * (hay un vehículo adentro) ni uno que está reservado (alguien lo espera).
 */
export function eliminar(id) {
  const espacio = espacios.find((e) => e.id === id);
  if (!espacio) return { error: 'Espacio no encontrado', codigo: 404 };

  if (espacio.estado === 'ocupado') {
    return { error: 'No se puede eliminar un espacio que está ocupado', codigo: 409 };
  }
  if (espacio.estado === 'reservado') {
    return { error: 'No se puede eliminar un espacio que tiene una reserva activa', codigo: 409 };
  }

  espacios = espacios.filter((e) => e.id !== id);
  return { codigo: 204 };
}
