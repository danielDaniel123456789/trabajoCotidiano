function addStudent() {
    Swal.fire({
        title: 'Agregar Estudiante',
        html: `
            <input id="studentName" class="swal2-input" placeholder="Nombre">
            <input id="studentSurname" class="swal2-input" placeholder="Primer Apellido (opcional)">
            <input id="studentSecondSurname" class="swal2-input" placeholder="Segundo Apellido (opcional)">
            <input id="studentCedula" class="swal2-input" placeholder="Cédula (opcional)" type="text">
        `,
        focusConfirm: false,
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Agregar',
        preConfirm: () => {
            const name = document.getElementById('studentName').value.trim();
            const surname = document.getElementById('studentSurname').value.trim();
            const secondSurname = document.getElementById('studentSecondSurname').value.trim();
            const cedula = document.getElementById('studentCedula').value.trim();

            // Verificar que al menos el nombre esté ingresado
            if (!name) {
                Swal.showValidationMessage('El nombre es obligatorio');
                return false;
            }

            // Crear objeto del estudiante
            const student = {
                name: name,
                surname: surname || '', // Si no se ingresa, se guarda como cadena vacía
                secondSurname: secondSurname || '',
                cedula: cedula || '',
                absences: []
            };

            saveStudent(student);
        }
    });
}
