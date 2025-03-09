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
            <select class="form-select mb-2 w-100" id="masOpciones" onchange="ejecutarOpcion()">
                <option selected disabled>Más Opciones</option>
                <option value="misMaterias">Mis Materias</option>
                <option value="importarEstudiantes">Importar Estudiantes</option>
                <option value="eliminarEstudiantes">Eliminar Todos los Estudiantes</option>
            </select>
        </div>
        `,
        showConfirmButton: false, // Desactiva el botón de confirmación
        showCancelButton: true, // Habilitar el botón de cancelar
        cancelButtonText: 'Cancelar', // Texto del botón de cancelar
        focusConfirm: false, // No enfocar el botón de confirmación
        padding: '1em',
        showCloseButton: true, // Habilitar el botón de cerrar
    });
}

// Función para ejecutar la opción seleccionada
function ejecutarOpcion() {
    const seleccion = document.getElementById('masOpciones').value;

    if (seleccion === 'misMaterias') {
        misMaterias();
    } else if (seleccion === 'importarEstudiantes') {
        importarEstudiantes();
    } else if (seleccion === 'eliminarEstudiantes') {
        eliminarTodoslosEstudiantes();
    }
}
