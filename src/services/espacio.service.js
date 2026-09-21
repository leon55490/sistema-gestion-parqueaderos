// src/services/espacio.service.js
// Capa de negocio: reglas del dominio. NO conoce req, res ni códigos HTTP.

let espacios = [
  { id: 1, numero: 'A-01', tipo: 'carro',     estado: 'libre',    ubicacion: 'Piso 1 - Norte' },
  { id: 2, numero: 'A-02', tipo: 'carro',     estado: 'ocupado',  ubicacion: 'Piso 1 - Norte' },
  { id: 3, numero: 'A-03', tipo: 'carro',     estado: 'reservado', ubicacion: 'Piso 1 - Sur' },
  { id: 4, numero: 'M-01', tipo: 'moto',      estado: 'libre',    ubicacion: 'Piso 1 - Este' },
  { id: 5, numero: 'M-02', tipo: 'moto',      estado: 'libre',    ubicacion: 'Piso 1 - Este' },
  { id: 6, numero: 'B-01', tipo: 'bicicleta', estado: 'libre',    ubicacion: 'Entrada Principal' },
];
let siguienteId = 7;

const TIPOS_VALIDOS   = ['carro', 'moto', 'bicicleta'];
const ESTADOS_VALIDOS = ['libre', 'ocupado', 'reservado', 'mantenimiento'];

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

export function obtenerPorId(id) {
  return espacios.find((e) => e.id === id) ?? null;
}

export function crear(datos) {
  if (!datos.numero || datos.numero.trim() === '' || !datos.tipo || !datos.ubicacion || datos.ubicacion.trim() === '') {
    throw new Error('DATOS_INVALIDOS');
  }
  if (!TIPOS_VALIDOS.includes(datos.tipo)) {
    throw new Error('TIPO_INVALIDO');
  }
  if (datos.estado && !ESTADOS_VALIDOS.includes(datos.estado)) {
    throw new Error('ESTADO_INVALIDO');
  }
  if (espacios.some((e) => e.numero === datos.numero.trim())) {
    throw new Error('NUMERO_DUPLICADO');
  }

  const nuevo = {
    id: siguienteId++,
    numero: datos.numero.trim(),
    tipo: datos.tipo,
    estado: datos.estado || 'libre',
    ubicacion: datos.ubicacion.trim(),
  };

  espacios.push(nuevo);
  return nuevo;
}

export function actualizar(id, datos) {
  const espacio = obtenerPorId(id);
  if (!espacio) return null;

  if (datos.tipo !== undefined) {
    if (!TIPOS_VALIDOS.includes(datos.tipo)) throw new Error('TIPO_INVALIDO');
    if (espacio.estado === 'ocupado') throw new Error('TIPO_NO_MODIFICABLE_SI_OCUPADO');
  }

  if (datos.estado !== undefined && !ESTADOS_VALIDOS.includes(datos.estado)) {
    throw new Error('ESTADO_INVALIDO');
  }

  if (datos.numero !== undefined) {
    if (datos.numero.trim() === '') throw new Error('DATOS_INVALIDOS');
    if (espacios.some((e) => e.numero === datos.numero.trim() && e.id !== id)) {
      throw new Error('NUMERO_DUPLICADO');
    }
  }

  if (datos.numero !== undefined)   espacio.numero   = datos.numero.trim();
  if (datos.tipo !== undefined)     espacio.tipo     = datos.tipo;
  if (datos.estado !== undefined)   espacio.estado   = datos.estado;
  if (datos.ubicacion !== undefined) espacio.ubicacion = datos.ubicacion.trim();

  return espacio;
}

export function eliminar(id) {
  const espacio = obtenerPorId(id);
  if (!espacio) return false;

  if (espacio.estado === 'ocupado') {
    throw new Error('ELIMINAR_OCUPADO');
  }
  if (espacio.estado === 'reservado') {
    throw new Error('ELIMINAR_RESERVADO');
  }

  espacios = espacios.filter((e) => e.id !== id);
  return true;
}
