// Función para eliminar el estudiante con confirmación
function deleteStudent(index) {
    Swal.fire({
        title: '¿Estás seguro?',
        text: "¡No podrás revertir esta acción!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar',
        reverseButtons: true
    }).then((result) => {
        if (result.isConfirmed) {
            const students = JSON.parse(localStorage.getItem('students')) || [];
            students.splice(index, 1); // Eliminar el estudiante del array
            localStorage.setItem('students', JSON.stringify(students)); // Actualizar el localStorage
            Swal.fire('Eliminado', 'El estudiante ha sido eliminado correctamente.', 'success');
            loadStudents(); // Recargar la lista de estudiantes
        }
    });
}
