// Función para agregar una materia
function addMateria() {
    Swal.fire({
        title: 'Agregar Materia',
        html: `
            <input id="materiaName" class="swal2-input" placeholder="Nombre de la materia">
        `,
        focusConfirm: false,
        showCancelButton: true, // Mostrar el botón de cancelar
        cancelButtonText: 'Cancelar', // Texto del botón de cancelar
        confirmButtonText: 'Agregar', // Texto del botón de confirmar
        preConfirm: () => {
            const materiaName = document.getElementById('materiaName').value;

            // Verificar que el campo no esté vacío
            if (materiaName) {
                // Obtener la lista de materias del localStorage
                const materias = JSON.parse(localStorage.getItem('materias')) || [];

                // Agregar la nueva materia a la lista
                materias.push(materiaName);

                // Guardar la lista de materias actualizada en localStorage
                localStorage.setItem('materias', JSON.stringify(materias));

                // Verificar si es la primera materia que se agrega
                if (materias.length === 1) {
                    // Crear el registro de asistencia con la fecha de registro
                    const registro = {
                        fechaRegistro: new Date().toISOString() // Guardar la fecha en formato ISO
                    };
                    localStorage.setItem('registroAsistencia', JSON.stringify(registro));
                    localStorage.setItem('estadoUsuarioRegistrado', JSON.stringify('0'));
                    console.log("Registro de asistencia creado:", registro); // Solo para depuración
                }

                Swal.fire('Agregada', 'La materia ha sido agregada correctamente.', 'success');
                misMaterias(); // Recargar la lista de materias
            } else {
                Swal.showValidationMessage('Por favor ingrese el nombre de la materia');
            }
        }
    });
}




