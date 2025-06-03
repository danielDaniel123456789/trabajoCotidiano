function cargarCorreo() {
    const correoGuardado = localStorage.getItem("correoUsuario");

    Swal.fire({
        title: 'Ingrese su correo electrónico',
        input: 'email',
        inputLabel: 'Correo',
        inputValue: correoGuardado || '', // Si existe, lo carga; si no, lo deja vacío
        inputPlaceholder: 'ejemplo@correo.com',
        showCancelButton: true,
        confirmButtonText: 'Guardar',
        cancelButtonText: 'Cancelar',
        inputValidator: (value) => {
            if (!value) {
                return 'Por favor ingrese un correo';
            }
        }
    }).then((result) => {
        if (result.isConfirmed) {
            const correo = result.value;

            Swal.fire({
                title: 'Cargando correo...',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });

            setTimeout(() => {
                localStorage.setItem("correoUsuario", correo);
                Swal.fire({
                    icon: 'success',
                    title: 'Correo guardado',
                    text: `El correo ha sido guardado correctamente.`
                });
            }, 1000);
        }
    });
}
