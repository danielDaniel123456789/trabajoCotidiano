  function mostrarPopup() {
    Swal.fire({
      title: 'Opciones',
      html: `
        <button id="btnCotidiano" class="swal2-confirm swal2-styled" style="margin-right: 10px;">Cotidiano</button>
 <button id="btnAsistencia_id" class="swal2-confirm swal2-styled">Asistencia</button>
        <button id="btnTarea" class="swal2-confirm swal2-styled">Tarea</button>
        <button id="btnPruebas_id" class="swal2-confirm swal2-styled">Pruebas</button>
        
      `,
      showConfirmButton: false,
      didOpen: () => {
     

      document.getElementById('btnPruebas_id').addEventListener('click', () => {
          informeGeneralPruebas();
        
        });

        document.getElementById('btnCotidiano').addEventListener('click', () => {
          informeTrabajoCotidianoYEnviarCorreo();
        
        });

         document.getElementById('btnTarea').addEventListener('click', () => {
          informeCorreoGeneralTareas();
        
        });
   document.getElementById('btnAsistencia_id').addEventListener('click', () => {
          informeCorreoMesAsistencia();
        
        });
        
      }
    });
  }