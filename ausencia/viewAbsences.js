function viewAbsences(studentId) {
    console.log("ID recibido:", studentId);
    const students = JSON.parse(localStorage.getItem('students')) || [];
    const grupos = JSON.parse(localStorage.getItem('grupos')) || [];
    let nombreGrupo = "";

    console.log("Grupos:", grupos);

    for (let i = 0; i < grupos.length; i++) {
        if (grupos[i].id === studentId) {
            nombreGrupo = grupos[i].nombre;
            console.log(`Grupo encontrado: ID = ${grupos[i].id}, Nombre = ${grupos[i].nombre}`);
            break;
        }
    }

    // Buscar al estudiante por ID correctamente
    const student = students.find(s => s.id === studentId);

    if (!student) {
        console.log("Estudiante no encontrado.");
        Swal.fire('Error', 'Estudiante no encontrado', 'error');
        return;
    }

    console.log("Estudiante encontrado:", student);

    // Obtener todas las materias desde localStorage
    const materiasList = JSON.parse(localStorage.getItem('materias')) || [];
    console.log("Materias desde localStorage:", materiasList);

    // Mapeamos los materiaId de las ausencias a sus nombres correspondientes
    const materiaNames = student.absences.map(absence => {
        const materia = materiasList.find(m => m.id === parseInt(absence.materiaId));
        return materia ? materia.nombre : `Materia desconocida ${absence.materiaId}`;
    });

    console.log("Materias mapeadas para las ausencias del estudiante:");
    console.table(materiaNames);

    // Obtener la primera materia del estudiante
    const selectedMateria = materiaNames[0] || 'Materia no disponible';

    // Función para asignar el emoji según el tipo de ausencia
    function getAbsenceEmoji(type) {
        switch (type) {
            case '4': return '✅'; // Presente
            case '3': return '✔️'; // Ausencia Justificada
            case '2': return '✔️'; // Tardía Justificada
            case '1': return '⏰'; // Tardía no justificada
            case '0': return '❌'; // Ausencia no justificada
            default: return ''; // No definido
        }
    }

    // Crear el contenido HTML para la tabla de ausencias
    let absenceDetails = `
        <table class="table table-bordered">
            <thead>
                <tr>
                    <th>Fecha</th>
                    <th>Tipo</th>
                    <th>⚖️</th> <!-- Nueva columna para el emoji -->
                    <th>Acción</th>
                </tr>
            </thead>
            <tbody>
    `;

    student.absences.forEach((absence, absenceIndex) => {
        absenceDetails += `
            <tr>
                <td>${absence.date}</td>
                <td>${absence.type}</td>
                <td>${getAbsenceEmoji(absence.type)}</td> <!-- Mostrar el emoji -->
                <td>
                    <button class="btn btn-success btn-sm" onclick="editAbsence(${studentId}, ${absenceIndex}, ${absence.id})">✏️</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteAbsence(${studentId}, ${absence.id})">X</button>
                </td>
            </tr>
        `;
    });

    absenceDetails += `</tbody></table>`;

    // Mostrar SweetAlert2 con los datos del estudiante, grupo, materia y ausencias
    Swal.fire({
        html: `
        <br>
        <h6> 
            4: Presente ✅
            3: Ausencia Justificada ✔️
            2: Tardía justificada ✔️
            1: Tardía no justificada 2=1 Ausencia ⏰
            0: Ausencia no justificada ❌
        </h6>
        <h5>Informe de Ausencias de ${student.name} - Materia: ${selectedMateria} - Grupo ${nombreGrupo}:</h5>
        ${absenceDetails}
        `,
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
        focusConfirm: false
    }).then(result => {
        if (result.isConfirmed) {
            Swal.fire('Acción confirmada', 'Has revisado las ausencias del estudiante.', 'success');
        }
    });
}
