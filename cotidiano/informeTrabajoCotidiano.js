function informeTrabajoCotidiano(index) {
    const students = JSON.parse(localStorage.getItem('students')) || [];
    const student = students[index];

    // Obtener las materias del localStorage
    const materias = JSON.parse(localStorage.getItem('materias')) || [];

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

            // Filtrar los trabajos cotidianos por la materia seleccionada
            const trabajosCotidianos = student.trabajoCotidiano || [];
            const filteredTrabajoCotidiano = trabajosCotidianos.filter(work => work.materia === selectedMateria);

            if (filteredTrabajoCotidiano.length === 0) {
                Swal.fire('No hay registros', 'Este estudiante no tiene trabajos cotidianos registrados para esta materia.', 'info');
            } else {
                let trabajoCotidianoDetails = `
                    <button class="btn btn-info mb-3" onclick="copyStudentData(${index})">Pasar a Excel</button>
                    <button class="btn btn-info mb-3" onclick="copyStudentPadre(${index})">Informe al padre</button>
                    <table class="table table-bordered">
                        <thead>
                            <tr>
                                <th>Fecha</th>
                                <th>Tipo</th>
                                <th>Acción</th>
                            </tr>
                        </thead>
                        <tbody>
                `;

                filteredTrabajoCotidiano.forEach((work, workIndex) => {
                    trabajoCotidianoDetails += `
                        <tr>
                            <td>${work.date}</td>
                            <td>${work.type}</td>
                            <td>
                                <button class="btn btn-success btn-sm" onclick="editTrabajoCotidiano(${index}, ${workIndex})">
                                ✏️ </button>
                                <button class="btn btn-danger btn-sm" onclick="deleteTrabajoCotidiano(${index}, ${workIndex})">X</button>
                            </td>
                        </tr>
                    `;
                });

                trabajoCotidianoDetails += `</tbody></table>`;

                Swal.fire({
                    title: `Informe de Trabajo Cotidiano de ${student.name} ${student.surname} - ${selectedMateria}`,
                    html: trabajoCotidianoDetails,
                    showCancelButton: true,
                    cancelButtonText: 'Cancelar',
                    focusConfirm: false
                });
            }
        }
    });
}
