function addStudent() {
    let grupos = obtenerGrupos();
    let materias = obtenerMaterias();

    if (grupos.length === 0) {
        Swal.fire('Información', 'No hay grupos disponibles. Por favor, agregue un grupo primero.', 'info');
        return;
    }

    if (materias.length === 0) {
        Swal.fire('Información', 'No hay materias disponibles. Por favor, agregue una materia primero.', 'info');
        return;
    }

    Swal.fire({
        title: 'Agregar Estudiante',
        html: `
            <input id="studentName" class="swal2-input" placeholder="Nombre completo">
            <input id="studentCedula" class="swal2-input" placeholder="Cédula (opcional)">
            ${studentGroup()}<br>
            ${studentMateria()}
        `,
        focusConfirm: false,
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
        confirmButtonText: 'Agregar',
        preConfirm: () => {
            const nameInput = document.getElementById('studentName').value.trim();
            const cedula = document.getElementById('studentCedula').value.trim();
            const groupId = document.getElementById('studentGroup').value;
            const materiaId = document.getElementById('studentMateria').value;

            if (!nameInput) {
                Swal.showValidationMessage('El nombre es obligatorio.');
                return false;
            }
            if (!groupId) {
                Swal.showValidationMessage('Debe seleccionar un grupo.');
                return false;
            }
            if (!materiaId) {
                Swal.showValidationMessage('Debe seleccionar una materia.');
                return false;
            }

            return {
                name: capitalizeWords(nameInput),
                cedula,
                groupId,
                materiaId
            };
        }
    }).then(result => {
        if (!result.isConfirmed) return;

        const { name, cedula, groupId, materiaId } = result.value;

        const students = JSON.parse(localStorage.getItem('students')) || [];

        // Obtener el siguiente ID disponible
        const nextId = students.reduce((max, s) => Math.max(max, s.id), 0) + 1;

        const newStudent = {
            id: nextId,
            name,
            cedula: cedula || '',
            groupId,
            materiaId,
            absences: [],
            trabajoCotidiano: []
        };

        // Guardar en localStorage
        const updatedStudents = [...students, newStudent];
        localStorage.setItem('students', JSON.stringify(updatedStudents));

        Swal.fire("Éxito", "Estudiante agregado correctamente.", "success");

        // Refrescar la tabla u otros datos
        loadStudents?.();
        datosGeneralesEspecificos?.(groupId, materiaId);
    });
}

// Capitalizar palabras como en importarEstudiantes()
function capitalizeWords(str) {
    return str.replace(/\b\w/g, char => char.toUpperCase());
}
