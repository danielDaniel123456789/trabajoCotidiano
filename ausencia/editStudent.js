function editStudent(index) {
    const students = JSON.parse(localStorage.getItem('students')) || [];
    const student = students[index];

    // Mostrar formulario de edición utilizando Swal
    Swal.fire({
        title: 'Editar Estudiante',
        html: `
        <br>   <br>   <br>
            <label for="studentName">Nombre *</label>
            <input id="studentName" class="swal2-input" value="${student.name}" placeholder="Nombre">
   <br>   <br>   <br>   
            <label for="studentCedula">Cédula (opcional)</label>
            <input id="studentCedula" class="swal2-input" value="${student.cedula || ''}" placeholder="Cédula" type="text">
        `,
        focusConfirm: false,
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
        preConfirm: () => {
            const name = document.getElementById('studentName').value.trim();
            const cedula = document.getElementById('studentCedula').value.trim();

            if (!name) {
                Swal.showValidationMessage('El nombre es obligatorio');
                return false;
            }

            // Actualizar los datos del estudiante
            student.name = name;
            student.cedula = cedula || '';

            // Guardar los estudiantes actualizados en localStorage
            students[index] = student;
            localStorage.setItem('students', JSON.stringify(students));

            Swal.fire('Actualizado', 'Los datos del estudiante se han actualizado correctamente.', 'success');
            loadStudents(); // Recargar la lista de estudiantes
        }
    });
}
