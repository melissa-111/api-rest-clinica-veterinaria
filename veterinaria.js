//API REST - Clínica Veterinaria
//Hecha con Node.js + Express
//Autor: Aberastegui Melissa
//Materia: EDI (TECDA)

// Importamos Express
const express = require('express');  //Traigo la herramienta Express
const app = express();               //Creo mi servidor web

// Middleware para que el servidor entienda JSON
app.use(express.json());


// Datos simulados (como si fuera una base de datos)

let duenos = [
  { id: 1, nombre: "Laura García", telefono: "123456" },
  { id: 2, nombre: "Carlos López", telefono: "654321" }
];

let mascotas = [
  { id: 1, nombre: "Fido", especie: "Perro", edad: 4, dueno_id: 1 },
  { id: 2, nombre: "Michi", especie: "Gato", edad: 2, dueno_id: 2 }
];

let turnos = [];
let tratamientos = [];


// Endpoint de prueba
app.get('/', (req, res) => {
  res.json({ mensaje: " API de Clínica Veterinaria funcionando correctamente" });
});


//MASCOTAS

// Actualizar una mascota por ID (PUT)
app.put('/mascotas/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { nombre, especie, edad, dueno_id } = req.body;
  const index = mascotas.findIndex(m => m.id === id);

  // Verificar si la mascota existe
  if (index === -1) {
      return res.status(404).json({ error: "Mascota no encontrada para actualizar" });
  }

  //  Verificar si el nuevo dueño_id existe (si se proporciona)
  if (dueno_id !== undefined) {
      const duenoExiste = duenos.some(d => d.id === dueno_id);
      if (!duenoExiste) {
          return res.status(400).json({ error: "El dueño indicado para la actualización no existe" });
      }
  }

  //  Actualizar la mascota con los datos proporcionados
  mascotas[index] = {
      ...mascotas[index], // Mantiene los datos antiguos
      nombre: nombre || mascotas[index].nombre,
      especie: especie || mascotas[index].especie,
      edad: edad || mascotas[index].edad,
      dueno_id: dueno_id || mascotas[index].dueno_id
  };

  res.json(mascotas[index]);
});


// Obtener todas las mascotas
app.get('/mascotas', (req, res) => {
  res.json(mascotas);
});

// Obtener una mascota por ID
app.get('/mascotas/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const mascota = mascotas.find(m => m.id === id);

  if (!mascota) return res.status(404).json({ error: "Mascota no encontrada" });
  res.json(mascota);
});

// Crear una nueva mascota
app.post('/mascotas', (req, res) => {
  const { nombre, especie, edad, dueno_id } = req.body;

  // Validaciones básicas
  if (!nombre || !especie || !dueno_id) {
    return res.status(400).json({ error: "Faltan datos obligatorios" });
  }

  // Verificamos si el dueño existe
  const duenoExiste = duenos.some(d => d.id === dueno_id);
  if (!duenoExiste) {
    return res.status(400).json({ error: "El dueño indicado no existe" });
  }

  const nuevaMascota = {
    id: mascotas.length + 1,
    nombre,
    especie,
    edad,
    dueno_id
  };

  mascotas.push(nuevaMascota);
  res.status(201).json(nuevaMascota);
});


// Eliminar una mascota por ID (DELETE)
app.delete('/mascotas/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = mascotas.findIndex(m => m.id === id);

  // 1. Verificar si la mascota existe
  if (index === -1) {
      return res.status(404).json({ 
          status: "error", 
          message: "Mascota no encontrada para eliminar" 
      });
  }

  //  ELIMINACIÓN EN CASCADA
  
  // a) Eliminar todos los turnos asociados a esta mascota
  // Filtramos la lista 'turnos' para quedarnos solo con los que NO tengan el ID de la mascota a borrar.
  const turnosAntes = turnos.length;
  turnos = turnos.filter(t => t.mascota_id !== id);
  const turnosEliminados = turnosAntes - turnos.length;
  
  // b) Eliminar todos los tratamientos/historial asociados a esta mascota
  // Hacemos lo mismo con la lista 'tratamientos'
  const tratamientosAntes = tratamientos.length;
  tratamientos = tratamientos.filter(t => t.mascota_id !== id);
  const tratamientosEliminados = tratamientosAntes - tratamientos.length;

  //  Eliminar la mascota de la lista
  mascotas.splice(index, 1);

  //  Respuesta de éxito (204 No Content), indicando lo que se eliminó
  res.status(200).json({
      status: "success",
      message: "Mascota eliminada correctamente.",
      detalle: {
          mascota_id_eliminada: id,
          turnos_eliminados: turnosEliminados,
          tratamientos_eliminados: tratamientosEliminados
      }
  });
});

//  DUEÑOS


// Listar todos los dueños
app.get('/duenos', (req, res) => {
  res.json(duenos);
});

// Crear un nuevo dueño
app.post('/duenos', (req, res) => {
  const { nombre, telefono } = req.body;
  if (!nombre || !telefono) {
    return res.status(400).json({ error: "Faltan datos del dueño" });
  }

  const nuevoDueno = {
    id: duenos.length + 1,
    nombre,
    telefono
  };

  duenos.push(nuevoDueno);
  res.status(201).json(nuevoDueno);
});
// Actualizar un dueño por ID (PUT)
app.put('/duenos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { nombre, telefono } = req.body;
  const index = duenos.findIndex(d => d.id === id);

  // Verificar si el dueño existe
  if (index === -1) {
      return res.status(404).json({ 
          status: "error", 
          message: "Dueño no encontrado para actualizar" 
      });
  }

  // Actualizar los datos del dueño
  // Usamos el operador lógico OR (||) para mantener el valor anterior si no se proporciona uno nuevo.
  duenos[index].nombre = nombre || duenos[index].nombre;
  duenos[index].telefono = telefono || duenos[index].telefono;

  // Respuesta de éxito
  res.json({
      status: "success",
      data: duenos[index]
  });
});


// Eliminar un dueño por ID con validación (DELETE)
app.delete('/duenos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = duenos.findIndex(d => d.id === id);

  // Verificar si el dueño existe
  if (index === -1) {
      return res.status(404).json({ error: "Dueño no encontrado para eliminar" });
  }

  // Validación: Verificar si el dueño tiene mascotas asociadas
  const tieneMascotas = mascotas.some(m => m.dueno_id === id);

  if (tieneMascotas) {
      // Validación básica: no permitir dueño sin mascota
      return res.status(400).json({ 
          error: "No se puede eliminar el dueño",
          detalle: "El dueño aún tiene mascotas registradas en la clínica. Debe reasignarlas o eliminarlas primero."
      });
  }

  // Eliminar el dueño
  duenos.splice(index, 1);

  // Respuesta de éxito (204 No Content es común para DELETE sin cuerpo)
  res.status(204).send(); 
});

//TURNOS


// Crear turno (no se puede en fechas pasadas)
app.post('/turnos', (req, res) => {
  const { mascota_id, fecha, motivo } = req.body;

  // Validamos mascota
  const mascota = mascotas.find(m => m.id === mascota_id);
  if (!mascota) return res.status(404).json({ error: "Mascota no encontrada" });

  // Validamos fecha
  const fechaTurno = new Date(fecha);
  const hoy = new Date();
  if (fechaTurno < hoy) return res.status(400).json({ error: "No se pueden crear turnos en fechas pasadas" });

  const nuevoTurno = {
    id: turnos.length + 1,
    mascota_id,
    fecha,
    motivo
  };

  turnos.push(nuevoTurno);
  res.status(201).json(nuevoTurno);
});
// Actualizar un turno por ID (PUT)
app.put('/turnos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { fecha, motivo, estado } = req.body; // Puedes añadir 'estado' (e.g., Agendado, Cancelado, Atendido)
  const index = turnos.findIndex(t => t.id === id);

  //  Verificar si el turno existe
  if (index === -1) {
      return res.status(404).json({ 
          status: "error", 
          message: "Turno no encontrado para actualizar" 
      });
  }

  //  Validación de Fecha (si se está actualizando la fecha)
  if (fecha) {
      const fechaTurno = new Date(fecha);
      const hoy = new Date();
      // Solo verificamos si la fecha proporcionada es anterior a la fecha actual
      if (fechaTurno < hoy) { 
           return res.status(400).json({ 
               status: "error", 
               message: "No se puede reprogramar un turno a una fecha pasada" 
           });
      }
  }
  
  //  Actualizar los datos del turno
  turnos[index].fecha = fecha || turnos[index].fecha;
  turnos[index].motivo = motivo || turnos[index].motivo;
  // Si manejas estados:
  turnos[index].estado = estado || turnos[index].estado;

  //  Respuesta de éxito
  res.json({
      status: "success",
      data: turnos[index]
  });
});
// Eliminar/Cancelar un turno por ID (DELETE)
app.delete('/turnos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = turnos.findIndex(t => t.id === id);

  //  Verificar si el turno existe
  if (index === -1) {
      return res.status(404).json({ 
          status: "error", 
          message: "Turno no encontrado para eliminar/cancelar" 
      });
  }

  //  Eliminar el turno
  turnos.splice(index, 1);

  //  Respuesta de éxito (204 No Content)
  res.status(204).send(); 
});


// Listar todos los turnos
app.get('/turnos', (req, res) => {
  res.json(turnos);
});


//TRATAMIENTOS
// Clientes con vacuna próxima a agendar (Informe Avanzado)
app.get('/informes/vacunas-proximas', (req, res) => {
  const hoy = new Date();
  const treintaDiasEnElFuturo = new Date();
  treintaDiasEnElFuturo.setDate(hoy.getDate() + 30);

  //  Encontrar todos los tratamientos que son vacunas y tienen una dosis próxima definida
  const vacunasConProximaDosis = tratamientos.filter(t => 
      t.es_vacuna && t.proxima_dosis
  );

  //  Filtrar aquellas cuya fecha de próxima dosis está entre hoy y los próximos 30 días
  const vacunasProximas = vacunasConProximaDosis.filter(t => {
      const fechaProxima = new Date(t.proxima_dosis);
      return fechaProxima >= hoy && fechaProxima <= treintaDiasEnElFuturo;
  });

  //  Mapear los resultados para incluir el nombre de la mascota y el dueño (para el reporte)
  const informe = vacunasProximas.map(t => {
      const mascota = mascotas.find(m => m.id === t.mascota_id);
      const dueno = duenos.find(d => d.id === (mascota ? mascota.dueno_id : null));

      return {
          mascota_nombre: mascota ? mascota.nombre : 'Mascota Desconocida',
          dueno_nombre: dueno ? dueno.nombre : 'Dueño Desconocido',
          vacuna: t.descripcion,
          fecha_proxima_dosis: t.proxima_dosis
      };
  });

  if (informe.length === 0) {
      return res.json({ 
          status: "success", 
          message: "No hay vacunas próximas a vencer o agendar en los próximos 30 días.",
          data: []
      });
  }

  res.json({
      status: "success",
      data: informe
  });
});

// Registrar tratamiento o diagnóstico
app.post('/tratamientos', (req, res) => {
  const { mascota_id, descripcion, fecha } = req.body;

  const mascota = mascotas.find(m => m.id === mascota_id);
  if (!mascota) return res.status(404).json({ error: "Mascota no encontrada" });

  const nuevoTratamiento = {
    id: tratamientos.length + 1,
    mascota_id,
    descripcion,
    fecha
  };

  tratamientos.push(nuevoTratamiento);
  res.status(201).json(nuevoTratamiento);
});

// Ver historial médico de una mascota
app.get('/mascotas/:id/historial', (req, res) => {
  const id = parseInt(req.params.id);
  const historial = tratamientos.filter(t => t.mascota_id === id);

  if (historial.length === 0)
    return res.status(404).json({ error: "No hay tratamientos registrados para esta mascota" });

  res.json(historial);
});
// Clientes con chequeo anual pendiente


// (Simulado: mascotas sin turno en el último año)
app.get('/chequeo-anual', (req, res) => {
  const hoy = new Date();
  const unAnioAtras = new Date();
  unAnioAtras.setFullYear(hoy.getFullYear() - 1);

  const pendientes = mascotas.filter(m => {
    const ultimoTurno = turnos
      .filter(t => t.mascota_id === m.id)
      .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))[0];
    return !ultimoTurno || new Date(ultimoTurno.fecha) < unAnioAtras;
  });

  res.json(pendientes);
});


//  Iniciar servidor

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor funcionando en http://localhost:${PORT}`);
});
