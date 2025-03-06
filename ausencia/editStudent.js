function editStudent(index) {
    const students = JSON.parse(localStorage.getItem('students')) || [];
    const student = students[index];

    // Mostrar formulario de edición utilizando Swal
    Swal.fire({
        title: 'Editar Estudiante',
        html: `
        <div style="display: flex; flex-direction: column; gap: 10px; text-align: left;">
            <label for="studentName"><b>Nombre *</b></label>
            <input id="studentName" class="swal2-input" value="${student.name}" placeholder="Nombre" style="width: 100%;">

            <label for="studentSurname"><b>Primer Apellido (opcional)</b></label>
            <input id="studentSurname" class="swal2-input" value="${student.surname || ''}" placeholder="Primer Apellido" style="width: 100%;">

            <label for="studentSecondSurname"><b>Segundo Apellido (opcional)</b></label>
            <input id="studentSecondSurname" class="swal2-input" value="${student.secondSurname || ''}" placeholder="Segundo Apellido" style="width: 100%;">

            <label for="studentCedula"><b>Cédula (opcional)</b></label>
            <input id="studentCedula" class="swal2-input" value="${student.cedula || ''}" placeholder="Cédula" type="text" style="width: 100%;">
        </div>
        `,
        focusConfirm: false,
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
        preConfirm: () => {
            const name = document.getElementById('studentName').value.trim();
            const surname = document.getElementById('studentSurname').value.trim();
            const secondSurname = document.getElementById('studentSecondSurname').value.trim();
            const cedula = document.getElementById('studentCedula').value.trim();

            if (!name) {
                Swal.showValidationMessage('El nombre es obligatorio');
                return false;
            }

            // Actualizar los datos del estudiante
            student.name = name;
            student.surname = surname || ''; // Si no se ingresa, se guarda como cadena vacía
            student.secondSurname = secondSurname || '';
            student.cedula = cedula || '';

            // Guardar los estudiantes actualizados en localStorage
            students[index] = student;
            localStorage.setItem('students', JSON.stringify(students));

            Swal.fire('Actualizado', 'Los datos del estudiante se han actualizado correctamente.', 'success');
            loadStudents(); // Recargar la lista de estudiantes
        }
    });
}
