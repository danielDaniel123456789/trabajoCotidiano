// Función para registrar un trabajo cotidiano con materia
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
                <option value="0">No participó</option>
                <option value="1">Baja participación</option>
                <option value="2">Participación parcial durante la clase</option>
                <option value="3">Participación activa durante la clase</option>
            </select>
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
            const materia = document.getElementById('absenceMateria').value;

            if (date && type && materia) {
                // Guardar la materia seleccionada en el estudiante
                student.lastSelectedMateria = materia;

                // Crear el objeto del trabajo cotidiano
                const trabajo = { date, type, materia };

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

                Swal.fire('Trabajo Cotidiano Registrado', 'El trabajo cotidiano ha sido registrado correctamente.', 'success');
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
[{"name":"Da","surname":"asd","secondSurname":"asd","cedula":"123","absences"
    :[{"date":"2025-03-03","type":"justificada","materia":"Mate"},{"date":"2025-03-03",
        "type":"injustificada","materia":"Mate"},{"date":"2025-03-03","type":"1","materia":"werwer"},{"date":"2025-03-03","type":"1","materia":"asd"},{"date":"2025-03-03","puntuaje":"1","materia":"Mate"}],"lastSelectedMateria":"werwer",
        "trabajoCotidiano":[{"date":"2025-03-03","type":"1","materia":"werwer"}]},
        {"name":"asd","surname":"asd","secondSurname":"asd","cedula":"123","absences":[]},
        {"name":"ddd","surname":"ddd","secondSurname":"ddd","cedula":"",
            "absences":[{"date":"2025-03-03","type":"justificada","materia":"Mate"},
                {"date":"2025-03-03","type":"justificada","materia":"werwer"},
                {"date":"2025-03-03","type":"justificada","materia":"werwer"}],
                "lastSelectedMateria":"werwer"},{"name":"asdad","surname":"asddas","secondSurname":
                    "asdasd","cedula":"","absences":[{"date":"2025-03-03","type":"injustificada","materia":"werwer"}],
                    "lastSelectedMateria":"werwer"},{"name":"asdasd","surname":"asdasd","secondSurname":"asd","cedula"
                        :"","absences":[]},
{"name":"Daniel","surname":"sad","secondSurname":"asd","cedula":"12","absences":[]}]