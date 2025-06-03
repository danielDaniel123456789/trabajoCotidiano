function mostrarPopup() {
  Swal.fire({
    title: 'Informe - Envío por correo electrónico',
    html: `
      <p style="font-size: 14px; color: #555; margin-bottom: 15px;">
        Seleccione el tipo de informe que desea enviar por correo.
      </p>
      <button id="btnCotidiano" class="swal2-confirm swal2-styled" style="margin-right: 10px;">Cotidiano</button>
      <button id="btnAsistencia_id" class="swal2-confirm swal2-styled">Asistencia</button>
      <button id="btnTarea" class="swal2-confirm swal2-styled">Tarea</button>
      <button id="btnPruebas_id" class="swal2-confirm swal2-styled">Pruebas</button>
    `,
    showConfirmButton: false,
    showCancelButton: true,
    cancelButtonText: 'Cancelar',
    showCloseButton: true,
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
