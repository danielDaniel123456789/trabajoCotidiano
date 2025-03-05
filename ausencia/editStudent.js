function editStudent(index) {
    const students = JSON.parse(localStorage.getItem('students')) || [];
    const student = students[index];

    // Mostrar formulario de edición utilizando Swal
    Swal.fire({
        title: 'Editar Estudiante',
        html: `
        <div class="p-2">
            <label for="studentName" class="swal2-label">Nombre</label>
            <input id="studentName" class="swal2-input" value="${student.name}" placeholder="Nombre">
            <label for="studentSurname" class="swal2-label">Primer Apellido</label>
            <input id="studentSurname" class="swal2-input" value="${student.surname}" placeholder="Primer Apellido">
            <label for="studentSecondSurname" class="swal2-label">Segundo Apellido</label>
            <input id="studentSecondSurname" class="swal2-input" value="${student.secondSurname || ''}" placeholder="Segundo Apellido">
            <label for="studentCedula" class="swal2-label">Cédula</label>
            <input id="studentCedula" class="swal2-input" value="${student.cedula || ''}" placeholder="Cédula" type="text"> <!-- Usar cedula aquí -->
             <div>
            `,
        focusConfirm: false,
        showCancelButton: true, // Mostrar el botón de cancelar
        cancelButtonText: 'Cancelar', // Texto para el botón de cancelar
        preConfirm: () => {
            const name = document.getElementById('studentName').value;
            const surname = document.getElementById('studentSurname').value;
            const secondSurname = document.getElementById('studentSecondSurname').value;
            const cedula = document.getElementById('studentCedula').value;

            if (name && surname && secondSurname && cedula) {
                // Actualizar los datos del estudiante
                student.name = name;
                student.surname = surname;
                student.secondSurname = secondSurname;
                student.cedula = cedula; // Usar cedula aquí también

                // Guardar los estudiantes actualizados en localStorage
                students[index] = student;
                localStorage.setItem('students', JSON.stringify(students));

                Swal.fire('Actualizado', 'Los datos del estudiante se han actualizado correctamente.', 'success');
                loadStudents(); // Recargar la lista de estudiantes
            } else {
                Swal.showValidationMessage('Por favor ingrese todos los campos');
            }
        }
    });
}
