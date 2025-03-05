function viewAbsences(index) {
    const students = JSON.parse(localStorage.getItem('students')) || [];
    const student = students[index];

    // Obtener todas las materias del estudiante
    const materias = [...new Set(student.absences.map(absence => absence.materia))];

    // Mostrar Swal para seleccionar la materia con el nombre del estudiante en el título
    Swal.fire({
        title: `Seleccione la Materia de ${student.name} ${student.surname}`,
        html: `
            <select id="materiaSelect" class="swal2-input">
                <option value="">Seleccione una materia</option>
                ${materias.map(materia => `<option value="${materia}">${materia}</option>`).join('')}
            </select>
        `,
        focusConfirm: false,
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
        preConfirm: () => {
            const selectedMateria = document.getElementById('materiaSelect').value;
            if (!selectedMateria) {
                Swal.showValidationMessage('Por favor seleccione una materia.');
                return false;
            }
            return selectedMateria;
        }
    }).then(result => {
        if (result.isConfirmed) {
            const selectedMateria = result.value;

            // Filtrar las ausencias por la materia seleccionada
            const filteredAbsences = student.absences.filter(absence => absence.materia === selectedMateria);

            if (filteredAbsences.length === 0) {
                Swal.fire('No hay ausencias registradas', 'Este estudiante no tiene ausencias registradas para esta materia.', 'info');
            } else {
                let absenceDetails = `
                    <button class="btn btn-info mb-3" onclick="copyStudentData(${index})">Pasar a Excel</button>
                    <button class="btn btn-info mb-3" onclick="copyStudentPadre(${index})">Informe al padre</button>
                    <table class="table table-bordered">
                        <thead>
                            <tr>
                                <th>Fecha</th>
                                <th>Tipo</th>
                                <th>Acción</th> <!-- Eliminar columna de Materia -->
                            </tr>
                        </thead>
                        <tbody>
                `;

                filteredAbsences.forEach((absence, absenceIndex) => {
                    absenceDetails += `
                        <tr>
                            <td>${absence.date}</td>
                            <td>${absence.type}</td>
                            <td>
                                <button class="btn btn-success btn-sm" onclick="editAbsence(${index}, ${absenceIndex})">
                                ✏️ </button>
                                <button class="btn btn-danger btn-sm" onclick="deleteAbsence(${index}, ${absenceIndex})">X</button>
                            </td>
                        </tr>
                    `;
                });

                absenceDetails += `</tbody></table>`;

                Swal.fire({
                    title: `Informe de Ausencias de ${student.name} ${student.surname} - ${selectedMateria}`,
                    html: absenceDetails,
                    showCancelButton: true,  // Habilitar el botón de cancelar
                    cancelButtonText: 'Cancelar',  // Texto del botón de cancelar
                    focusConfirm: false  // Prevenir que el botón de confirmación se enfoque
                });
            }
        }
    });
}
