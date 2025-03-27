function trabajoCotidiano(studentId) {
    const students = JSON.parse(localStorage.getItem('students')) || [];
    const materias = JSON.parse(localStorage.getItem('materias')) || [];
    const grupos = JSON.parse(localStorage.getItem('grupos')) || [];

    const student = students.find(s => s.id === studentId);
    if (!student) {
        Swal.fire('Error', 'Estudiante no encontrado', 'error');
        return;
    }

    // Obtener la materia y el grupo
    const idMateria = Number(student.materiaId);
    const idGrupo = Number(student.groupId);
    const materia = materias.find(m => m.id === idMateria);
    const grupo = grupos.find(g => g.id === idGrupo);

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
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate(); // Número de días en el mes

    // Crear las opciones del selector de fechas
    let dateOptions = '';
    for (let i = 1; i <= daysInMonth; i++) {
        const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
        const selected = currentDate.getDate() === i ? 'selected' : '';
        dateOptions += `<option value="${dateStr}" ${selected}>${dateStr}</option>`;
    }

    // Obtener el último ID registrado y aumentar en uno
    let lastId = Number(localStorage.getItem('lastTrabajoId')) || 0;
    const newId = lastId + 1;

    Swal.fire({
        title: `Registro de Trabajo Cotidiano`,
        html: `
        <h5>Estudiante: ${student.name} ${student.surname}</h5>
        <p><strong>Materia:</strong> ${materia.nombre}</p>
        <p><strong>Grupo:</strong> ${grupo.nombre}</p>
        <label for="trabajoDate">Seleccionar fecha:</label>
        <select id="trabajoDate" class="swal-input">
            ${dateOptions}
        </select>
        <br>
        <label for="trabajoType">Seleccionar desempeño:</label>
        <select id="trabajoType" class="swal-input">
            <option value="0">No participó</option>
            <option value="1">Baja participación</option>
            <option value="2">Participación parcial</option>
            <option value="3">Participación activa</option>
        </select>
        <br>
        <label for="trabajoDetail">Detalles (opcional):</label>
        <textarea id="trabajoDetail" class="swal-input" placeholder="Ingrese un detalle"></textarea>
        `,
        showCancelButton: true,
        confirmButtonText: 'Guardar',
        preConfirm: () => {
            const date = document.getElementById('trabajoDate').value;
            const type = document.getElementById('trabajoType').value;
            const detail = document.getElementById('trabajoDetail').value.trim();

            if (!type) {
                Swal.showValidationMessage('Debe seleccionar un tipo de participación.');
                return false;
            }

            // Crear el objeto del trabajo cotidiano
            const trabajo = { 
                id: newId, 
                date, // Usar la fecha seleccionada
                type, 
                materiaId: idMateria,
                grupoId: idGrupo,
                detail: detail || null
            };

            // Asegurar que el array trabajoCotidiano existe
            student.trabajoCotidiano = student.trabajoCotidiano || [];
            student.trabajoCotidiano.push(trabajo);

            // Guardar cambios en localStorage
            localStorage.setItem('students', JSON.stringify(students));
            localStorage.setItem('lastTrabajoId', newId); // Actualizar el último ID utilizado

            

            Swal.fire('Guardado', 'Trabajo cotidiano registrado correctamente.', 'success')
                .then(() => {
                    resumeCotidiano(studentId);
                });
        }
    });
}
