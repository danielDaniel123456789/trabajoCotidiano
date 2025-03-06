function trabajoCotidiano(index) {
    const students = JSON.parse(localStorage.getItem('students')) || [];
    const student = students[index];

    // Obtener las materias almacenadas en localStorage
    const materias = JSON.parse(localStorage.getItem('materias')) || [];

    // Verificar si hay materias disponibles
    if (materias.length === 0) {
        Swal.fire('Sin Materias', 'No se han registrado materias. Por favor, agregue materias primero.', 'warning');
        return;
    }

    // Recuperar la última materia seleccionada si existe
    const lastSelectedMateria = student.lastSelectedMateria || '';

    // Crear opciones del select con la última materia seleccionada por defecto
    let materiasOptions = materias.map(materia => 
        `<option value="${materia}" ${materia === lastSelectedMateria ? 'selected' : ''}>${materia}</option>`
    ).join('');

    Swal.fire({
        title: `Trabajo cotidiano ${student.name} ${student.surname}`,
        html: `
        <div class="p-2">
            <div id="closeButton" class="swal-close-btn">&times;</div>
            <input id="absenceDate" class="swal-input" type="date" value="${getCurrentDate()}">
            <select id="absenceType" class="swal-input">
                <option value="No participó">No participó</option>
                <option value="Baja participación">Baja participación</option>
                <option value="Participación parcial">Participación parcial</option>
                <option value="Participación activa">Participación activa</option>
            </select>
            <textarea id="absenceDetail" class="swal-input" placeholder="Ingrese un detalle (opcional)"></textarea>
            <select id="absenceMateria" class="swal-input">
                ${materiasOptions}
            </select>
        </div>
        `,
        focusConfirm: false,
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
        preConfirm: () => {
            const date = document.getElementById('absenceDate').value;
            const type = document.getElementById('absenceType').value;
            const detail = document.getElementById('absenceDetail').value.trim(); // Ahora es opcional
            const materia = document.getElementById('absenceMateria').value;

            if (!date || !type || !materia) {
                Swal.showValidationMessage('Por favor complete los campos obligatorios.');
                return false;
            }

            // Guardar la materia seleccionada en el estudiante
            student.lastSelectedMateria = materia;

            // Crear el objeto del trabajo cotidiano, incluyendo el detalle opcional
            const trabajo = { date, type, materia };
            if (detail) {
                trabajo.detail = detail; // Solo se guarda si hay un detalle
            }

            // Si el campo trabajoCotidiano no existe en el estudiante, lo inicializamos como un array vacío
            if (!student.trabajoCotidiano) {
                student.trabajoCotidiano = [];
            }

            // Agregar el trabajo cotidiano al subarray del estudiante
            student.trabajoCotidiano.push(trabajo);

            // Actualizar el array de estudiantes
            students[index] = student;

            // Guardar los estudiantes con el trabajo cotidiano registrado
            localStorage.setItem('students', JSON.stringify(students));

            Swal.fire('Trabajo Cotidiano Registrado', 'El trabajo cotidiano ha sido registrado correctamente.', 'success')
                .then(() => {
                    // Llamar al informe de trabajo cotidiano con la materia seleccionada
                    abrirInformeCotidiano(index, materia); 
                });
        },
        willOpen: () => {
            document.getElementById('closeButton').addEventListener('click', () => {
                Swal.close();
            });
        }
    });
}
