function opciones() {
    // Usar SweetAlert2 para mostrar los botones
    Swal.fire({
      
        html: `
        <div class="p-2">
            <button class="btn btn-primary mb-2 w-100" onclick="addStudent()">Nuevo Estudiante</button>
            <br>
            <button class="btn btn-primary mb-2 w-100" onclick="addMateria()">Nuevo Materia</button>
            <br>
             <button class="btn btn-primary mb-2 w-100" onclick="addGrupo()">Nuevo Grupo</button>
            <br>
            <select class="form-select mb-2 w-100" id="masOpciones" onchange="ejecutarOpcion()">
                <option selected disabled>Más Opciones</option>
                <option value="misMaterias">Mis Materias</option>
                  <option value="misGrupos">Mis grupos Estudiantes</option>
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
    console.log("Opción seleccionada:", seleccion); // Verifica si se está ejecutando

    if (seleccion === 'misMaterias') {
        misMaterias();
    } else if (seleccion === 'misGrupos') {
        console.log("Ejecutando misGrupos()"); // Debug
        misGrupos();
    } else if (seleccion === 'importarEstudiantes') {
        importarEstudiantes();
    } else if (seleccion === 'eliminarEstudiantes') {
        eliminarTodoslosEstudiantes();
    }
}

