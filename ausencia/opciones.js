function opciones() {
    // Usar SweetAlert2 para mostrar los botones
    Swal.fire({
        title: 'Insertar',
        html: `
        <div class="p-2">
            <button class="btn btn-primary mb-2 w-100" onclick="addStudent()"> Estudiante</button>
            <br>
            <button class="btn btn-primary mb-2 w-100" onclick="addMateria()"> Materia</button>
            <br>
            <button class="btn btn-primary mb-2 w-100" onclick="misMaterias()">Mis Materias</button>
            <div>
        `,
        showConfirmButton: false, // Desactiva el botón de confirmación
        showCancelButton: true, // Habilitar el botón de cancelar
        cancelButtonText: 'Cancelar', // Texto del botón de cancelar
        focusConfirm: false, // No enfocar el botón de confirmación
        padding: '1em',
        showCloseButton: true, // Habilitar el botón de cerrar
    });
}
