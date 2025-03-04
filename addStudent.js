function addStudent() {
    Swal.fire({
        title: 'Agregar Estudiante',
        html: `
            <input id="studentName" class="swal2-input" placeholder="Nombre">
            <input id="studentSurname" class="swal2-input" placeholder="Primer Apellido">
            <input id="studentSecondSurname" class="swal2-input" placeholder="Segundo Apellido">
            <input id="studentCedula" class="swal2-input" placeholder="Cédula" type="text"> <!-- No es requerido -->
        `,
        focusConfirm: false,
        showCancelButton: true, // Mostrar el botón de cancelar
        cancelButtonText: 'Cancelar', // Texto del botón de cancelar
        cancelButtonColor: '#d33', // Color del botón de cancelar
        confirmButtonText: 'Agregar', // Texto del botón de confirmar
        preConfirm: () => {
            const name = document.getElementById('studentName').value;
            const surname = document.getElementById('studentSurname').value;
            const secondSurname = document.getElementById('studentSecondSurname').value;
            const cedula = document.getElementById('studentCedula').value;

            // Verificar que los campos obligatorios (nombre, apellidos) sean completados
            if (name && surname && secondSurname) {
                const student = {
                    name: name,
                    surname: surname,
                    secondSurname: secondSurname,
                    cedula: cedula, // Guardar la cédula, aunque no es obligatorio
                    absences: [] // Lista de ausencias vacía inicialmente
                };
                saveStudent(student);
            } else {
                Swal.showValidationMessage('Por favor ingrese todos los campos obligatorios');
            }
        }
    });
}
