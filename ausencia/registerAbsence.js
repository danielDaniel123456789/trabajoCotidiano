function registerAbsence(studentId) {
console.log('studentId-----------:', studentId);
const students = JSON.parse(localStorage.getItem('students')) || [];
const materias = JSON.parse(localStorage.getItem('materias')) || [];
const grupos = JSON.parse(localStorage.getItem('grupos')) || [];

const student = students.find(s => s.id === studentId); // Buscar al estudiante por ID

if (!student) {
Swal.fire('Error', 'Estudiante no encontrado', 'error');
return;
}

console.log('student-----------:', student);

const idEstudiante = student.id;
const idMateria = Number(student.materiaId); // Convertir a número
const idGrupo = Number(student.groupId); // Convertir a número

console.log('idMateria:', idMateria);
console.log('idGrupo:', idGrupo);

const materia = materias.find(m => m.id === idMateria);
const grupo = grupos.find(g => g.id === idGrupo);

console.log('materias:', materias);
console.log('materia encontrada:', materia);
console.log('grupos:', grupos);
console.log('grupo encontrado:', grupo);

if (!materia) {
Swal.fire('Error', 'Materia no encontrada', 'error');
return;
}

if (!grupo) {
Swal.fire('Error', 'Grupo no encontrado', 'error');
return;
}

// Obtener la fecha actual
const currentDate = new Date();
const currentMonth = currentDate.getMonth(); // Mes actual
const currentYear = currentDate.getFullYear(); // Año actual
const currentDay = currentDate.getDate(); // Día actual

// Generar un array de fechas del mes
const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate(); // Número de días del mes
const dateOptions = [];

for (let day = 1; day <= daysInMonth; day++) { // Crear una opción para cada día del mes const
    date=`${currentYear}-${(currentMonth + 1).toString().padStart(2, '0' )}-${day.toString().padStart(2, '0' )}`;
    dateOptions.push(date); } // Establecer la fecha actual como valor por defecto const
    defaultDate=`${currentYear}-${(currentMonth + 1).toString().padStart(2, '0'
    )}-${currentDay.toString().padStart(2, '0' )}`; Swal.fire({ html: ` <h5>Registrar Ausencia:</h5>
    <strong> Estudiante: </strong><br>
    Nombre: ${student.name}<br>
    ID: ${student.id}<br>
    Grupo: ${grupo.nombre}<br>
    Materia: ${materia.nombre}<br><br>
    <label for="absenceDate">Seleccionar fecha:</label>
    <br>
    <select id="absenceDate" class="form-select">
        ${dateOptions.map(date =>
        `<option value="${date}" ${date===defaultDate ? 'selected' : '' }>${date}</option>`
        ).join('')}
    </select>
    <br><br>
    <label for="absenceType">Seleccionar tipo de ausencia:</label>
    <br>
    <select id="absenceType" class="form-select">
        <option value="4">Presente</option>
        <option value="3">Ausencia Justificada</option>
        <option value="2">Tardia justificada</option>
        <option value="1">Tardia no justificada 2=1 Ausencia </option>
  <option value="0">Ausencia no justificada</option>
    </select>
    `,
    showCancelButton: true,
    confirmButtonText: 'Guardar',
    preConfirm: () => {
    const absenceDate = document.getElementById('absenceDate').value;
    const absenceType = document.getElementById('absenceType').value;
    console.log('Fecha de ausencia:', absenceDate);
    console.log('Tipo de ausencia seleccionada:', absenceType);

    // Obtener el último ID de ausencia del estudiante y asignar el siguiente
    const lastAbsenceId = student.absences?.length ? Math.max(...student.absences.map(a => a.id)) : 0;
    const newAbsenceId = lastAbsenceId + 1;

    // Agregar la ausencia con un ID autoincrementado
    const updatedStudents = students.map(s => {
    if (s.id === studentId) {
    s.absences = s.absences || []; // Asegurar que la propiedad absences existe
    s.absences.push({
    id: newAbsenceId, // Nuevo ID autoincremental
    type: absenceType,
    materiaId: materia.id,
    grupoId: grupo.id,
    date: absenceDate
    });
    }
    return s;
    });

    // Actualizar el localStorage con los estudiantes modificados
    localStorage.setItem('students', JSON.stringify(updatedStudents));

    Swal.fire('Guardado', 'Ausencia registrada correctamente', 'success');
    }
    });
    }