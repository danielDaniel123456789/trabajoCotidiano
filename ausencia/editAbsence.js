function editAbsence(studentIndex, absenceIndex) {
    const students = JSON.parse(localStorage.getItem('students')) || [];
    const student = students[studentIndex];
    const absence = student.absences[absenceIndex];
    const materias = JSON.parse(localStorage.getItem('materias')) || [];

    // Mostrar un formulario de edición utilizando Swal
    Swal.fire({
        title: 'Editar Ausencia',
        html: `
        <div class="p-2">
            <div style="display: flex; flex-direction: column; gap: 10px;">
                <input id="absenceDate" class="swal2-input" type="date" value="${absence.date}" placeholder="Fecha (dd/mm/yyyy)">
                
                <select id="absenceType" class="swal2-input">
                    <option value="justificada" ${absence.type === 'justificada' ? 'selected' : ''}>Ausencia Justificada</option>
                    <option value="injustificada" ${absence.type === 'injustificada' ? 'selected' : ''}>Ausencia Injustificada</option>
                    <option value="tardía" ${absence.type === 'tardía' ? 'selected' : ''}>Llego tarde a clases</option>
                </select>

                <select id="absenceMateria" class="swal2-input">
                    <option value="" ${absence.materia === '' ? 'selected' : ''}>Seleccionar Materia</option>
                    ${materias.map(materia => `<option value="${materia}" ${absence.materia === materia ? 'selected' : ''}>${materia}</option>`).join('')}
                </select>
            </div>
        `,
        focusConfirm: false,
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
        confirmButtonText: 'Guardar',
        preConfirm: () => {
            const date = document.getElementById('absenceDate').value;
            const type = document.getElementById('absenceType').value;
            const materia = document.getElementById('absenceMateria').value;

            if (date && type && materia) {
                student.absences[absenceIndex] = { date, type, materia };
                localStorage.setItem('students', JSON.stringify(students));
                Swal.fire('Actualizado', 'La ausencia ha sido modificada correctamente.', 'success');
                loadStudents();
            } else {
                Swal.showValidationMessage('Por favor ingresa todos los campos');
            }
        }
    });
}
