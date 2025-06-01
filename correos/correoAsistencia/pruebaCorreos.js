  function mostrarPopup() {
    Swal.fire({
      title: 'Opciones',
      html: `
        <button id="btnCorreo" class="swal2-confirm swal2-styled" style="margin-right: 10px;">Correo</button>
        <button id="btnCotidiano" class="swal2-confirm swal2-styled">Cotidiano</button>
      `,
      showConfirmButton: false,
      didOpen: () => {
        document.getElementById('btnCorreo').addEventListener('click', () => {
          informeTrabajoCotidianoYEnviarCorreo();
       
        });
        document.getElementById('btnCotidiano').addEventListener('click', () => {
          informeCorreoTrabajoCotidiano();
        
        });
      }
    });
  }