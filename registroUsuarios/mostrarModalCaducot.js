function mostrarModalCaducot() {
    let intentosRestantes = localStorage.getItem('conteoCodigoActivacion');

    if (intentosRestantes === null) {
        intentosRestantes = 25;
    } else {
        intentosRestantes = parseInt(intentosRestantes, 25);
    }

    f = obtenerRegistroAsistencia();
    console.log(f);
    // Obtener el código de activación de la función obtenerFechaRegistro
    const claveAleatoria = obtenerRegistroAsistencia(); // Usamos el valor devuelto por obtenerFechaRegistro

    Swal.fire({
        html: `
        <div class="p-4">
            <h5>Código de Activación:</h5>
            <h3>${obtenerRegistroAsistencia().slice(0, 3)}</h3> <!-- Aquí mostramos los primeros 3 caracteres de la clave -->
            <input id="claveInput" class="swal2-input" placeholder="Escribe la clave completa">
            <p>Intentos restantes: <b>${intentosRestantes}</b></p>
        </div>
        `,
        focusConfirm: false,
        showCancelButton: intentosRestantes > 1,
        confirmButtonText: 'Verificar',
        allowOutsideClick: false, // Impide el cierre del modal si no se verifica la clave
        preConfirm: () => {
            const claveInput = document.getElementById('claveInput').value.trim();

            if (claveInput === claveAleatoria) {
                Swal.fire({
                    icon: 'success',
                    title: 'Clave correcta',
                    text: 'Has ingresado la clave correctamente.',
                });

                localStorage.setItem('estadoUsuarioRegistrado', JSON.stringify(1));
                return true;
            } else {
                intentosRestantes--;

                if (intentosRestantes <= 0) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Acceso bloqueado',
                        text: 'Has agotado todos tus intentos.',
                    });

                    localStorage.setItem('conteoCodigoActivacion', "0");
                    return false;
                } else {
                    localStorage.setItem('conteoCodigoActivacion', intentosRestantes.toString());
                    Swal.showValidationMessage(`Clave incorrecta. Intentos restantes: ${intentosRestantes}`);
                    return false;
                }
            }
        },
        footer: `<a href="https://wa.me/50685502748?text=Contacta%20a%20Daniel%20para%20que%20te%20pase%20la%20clave%20de%20acceso." target="_blank">¿No tienes la clave? Contacta a Daniel</a>`,
    }).then((result) => {
        // Si el usuario presiona "Cancelar", también se reduce un intento
        if (result.dismiss === Swal.DismissReason.cancel) {
            intentosRestantes--;
            localStorage.setItem('conteoCodigoActivacion', intentosRestantes.toString());

            if (intentosRestantes <= 0) {
                Swal.fire({
                    icon: 'error',
                    title: 'Acceso bloqueado',
                    text: 'Has agotado todos tus intentos.',
                });
            }
        }
    });
}
