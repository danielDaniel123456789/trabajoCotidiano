function deleteAbsence(studentIndex, absenceIndex) {
    const students = JSON.parse(localStorage.getItem('students')) || [];
    const student = students[studentIndex];

    // Confirmación de eliminación
    Swal.fire({
        title: '¿Estás seguro?',
        text: 'Esta acción no se puede deshacer.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            // Eliminar la ausencia
            student.absences.splice(absenceIndex, 1);

            // Guardar los cambios en localStorage
            localStorage.setItem('students', JSON.stringify(students));

            Swal.fire('Eliminado', 'La ausencia ha sido eliminada correctamente.', 'success');
            loadStudents(); // Recargar la lista de estudiantes
        }
    });
}
