function addGrupo() {
  Swal.fire({
    title: 'Crear nuevo grupo',
    text: 'Ingrese el nombre del grupo o sección para identificarlo en el sistema.',
    input: 'text',
    inputPlaceholder: 'Ejemplo: Seccion 7-1',
    showCancelButton: true,
    confirmButtonText: 'Agregar',
    cancelButtonText: 'Cancelar',
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    inputValidator: (value) => {
      if (!value.trim()) {
        return 'Debe ingresar un nombre válido';
      }
      return null;
    },
    preConfirm: (value) => {
      if (!value || !value.trim()) {
        Swal.showValidationMessage('Debe ingresar un nombre válido');
        return false;
      }
      return value.trim();
    },
    allowOutsideClick: () => !Swal.isLoading()
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.showLoading();

      setTimeout(() => {
        let grupos = JSON.parse(localStorage.getItem('grupos')) || [];

        let nuevoId = grupos.length > 0 ? grupos[grupos.length - 1].id + 1 : 1;

        let nuevoGrupo = {
          id: nuevoId,
          nombre: result.value
        };

        grupos.push(nuevoGrupo);
        localStorage.setItem('grupos', JSON.stringify(grupos));

        Swal.fire({
          icon: 'success',
          title: 'Agregado',
          html: `
            El grupo ha sido guardado correctamente.<br><br>
            Falta el siguiente paso:<br>
            <button class="btn fondoBody mb-2 w-100" onclick="importarEstudiantes()">3- Importar Estudiantes</button>
          `,
          confirmButtonText: 'Cerrar',
          confirmButtonColor: '#3085d6',
          showCloseButton: true,
          didOpen: () => {
            // Opcional: prevenir que SweetAlert cierre cuando se hace clic dentro del botón
            const btn = Swal.getHtmlContainer().querySelector('button');
            btn.addEventListener('click', (e) => {
              e.stopPropagation();
            });
          }
        });
      }, 700);
    }
  });
}
