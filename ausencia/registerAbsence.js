// Función para registrar una ausencia con materia
function registerAbsence(index) {
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
        title: `Registrar Ausencia para ${student.name} ${student.surname}`,
        html: `
        <div class="p-2">
            <div id="closeButton" class="swal-close-btn">&times;</div>
            <input id="absenceDate" class="swal-input" type="date" value="${getCurrentDate()}">
            <select id="absenceType" class="swal-input">
                <option value="justificada">Ausencia Justificada</option>
                <option value="injustificada">Ausencia Injustificada</option>
                 <option value="tardía">Llego tarde a clases</option>
            </select>
            <select id="absenceMateria" class="swal-input">
                ${materiasOptions}
            </select>
            <div>
        `,
        focusConfirm: false,
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
        preConfirm: () => {
            const date = document.getElementById('absenceDate').value;
            const type = document.getElementById('absenceType').value;
            const materia = document.getElementById('absenceMateria').value;

            if (date && type && materia) {
                // Guardar la materia seleccionada en el estudiante
                student.lastSelectedMateria = materia;

                // Guardar la ausencia
                const absence = { date, type, materia };
                student.absences.push(absence);
                students[index] = student;
                localStorage.setItem('students', JSON.stringify(students));

                Swal.fire('Ausencia Registrada', 'La ausencia ha sido registrada correctamente.', 'success');

                loadStudents();

                setTimeout(() => {
                    viewAbsencesRecargar(index, materia); // Cargar el informe de ausencias con la última materia seleccionada
                }, 500);
            } else {
                Swal.showValidationMessage('Por favor complete todos los campos');
            }
        },
        willOpen: () => {
            document.getElementById('closeButton').addEventListener('click', () => {
                Swal.close();
            });
        }
    });
}
