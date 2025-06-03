function informeCorreoMesAsistencia() {
    const students = JSON.parse(localStorage.getItem('students')) || [];
    const grupos = JSON.parse(localStorage.getItem('grupos')) || [];

    const meses = [
        { id: 1, nombre: 'Enero', dias: 31 }, { id: 2, nombre: 'Febrero', dias: 28 },
        { id: 3, nombre: 'Marzo', dias: 31 }, { id: 4, nombre: 'Abril', dias: 30 },
        { id: 5, nombre: 'Mayo', dias: 31 }, { id: 6, nombre: 'Junio', dias: 30 },
        { id: 7, nombre: 'Julio', dias: 31 }, { id: 8, nombre: 'Agosto', dias: 31 },
        { id: 9, nombre: 'Septiembre', dias: 30 }, { id: 10, nombre: 'Octubre', dias: 31 },
        { id: 11, nombre: 'Noviembre', dias: 30 }, { id: 12, nombre: 'Diciembre', dias: 31 }
    ];

    if (grupos.length === 0) {
        Swal.fire('Error', 'No se encontraron grupos en el almacenamiento local.', 'error');
        return;
    }

    let selectMesHTML = '<select id="mesSelect" class="swal2-select">';
    meses.forEach(mes => selectMesHTML += `<option value="${mes.id}">${mes.nombre}</option>`);
    selectMesHTML += '</select>';

    let selectGrupoHTML = '<select id="grupoSelect" class="swal2-select">';
    grupos.forEach(grupo => selectGrupoHTML += `<option value="${grupo.id}">${grupo.nombre}</option>`);
    selectGrupoHTML += '</select>';

    Swal.fire({
        title: 'Selecciona un mes y un grupo',
        html: `
            <label>Mes:</label> ${selectMesHTML} <br><br>
            <label>Grupo:</label> ${selectGrupoHTML}
        `,
        showCancelButton: true,
        confirmButtonText: 'Siguiente',
        cancelButtonText: 'Cancelar',
        preConfirm: () => {
            const mesSeleccionado = parseInt(document.getElementById('mesSelect').value);
            const grupoSeleccionado = document.getElementById('grupoSelect').value;
            if (!mesSeleccionado || !grupoSeleccionado) {
                Swal.showValidationMessage('Por favor selecciona un mes y un grupo');
                return false;
            }
            return { mes: mesSeleccionado, grupo: grupoSeleccionado };
        }
    }).then((result) => {
        if (!result.isConfirmed) return;
        const { mes, grupo } = result.value;

        const grupoSeleccionado = grupos.find(g => g.id.toString() === grupo.toString());
        const mesSeleccionadoObj = meses.find(m => m.id === mes);
        let diasMes = mesSeleccionadoObj.dias;
        if (mes === 2) { // Ajuste de año bisiesto
            const añoActual = new Date().getFullYear();
            if ((añoActual % 4 === 0 && añoActual % 100 !== 0) || (añoActual % 400 === 0)) {
                diasMes = 29;
            }
        }

        // Filtrar estudiantes que pertenecen al grupo
        const estudiantesDelGrupo = students.filter(student => 
            student.groupId && student.groupId.toString() === grupoSeleccionado.id.toString()
        );

        if (estudiantesDelGrupo.length === 0) {
            Swal.fire('No hay estudiantes', 'No se encontraron estudiantes en este grupo.', 'info');
            return;
        }

        // Crear encabezados de días
        let diasHeader = '';
        for (let i = 1; i <= diasMes; i++) {
            diasHeader += `<th>${i}</th>`;
        }

        // Crear título de la tabla
        const tituloTabla = `
            <h2 style="text-align: center; color: #2c3e50; margin-bottom: 20px;">
                Informe de Asistencia - ${grupoSeleccionado.nombre}
            </h2>
            <h3 style="text-align: center; color: #34495e; margin-bottom: 15px;">
                Mes: ${mesSeleccionadoObj.nombre}
            </h3>
            <p style="text-align: center; margin-bottom: 20px; color: #7f8c8d;">
                Fecha de generación: ${new Date().toLocaleDateString()}
            </p>
        `;

        let tableHTML = `
            <div style="font-family: Arial, sans-serif; max-width: 100%;">
                ${tituloTabla}
                <div style="overflow-x: auto;">
                    <table border="1" style="border-collapse: collapse; width: 100%;" id="asistenciaTable">
                        <thead>
                            <tr>
                                <th style="background-color: #3498db; color: white;">👤 Estudiante</th>
                                ${diasHeader}
                                <th style="background-color: #3498db; color: white;">Total</th>
                            </tr>
                        </thead>
                        <tbody>`;

        estudiantesDelGrupo.forEach(estudiante => {
            const ausenciasMes = (estudiante.absences || [])
                .filter(absence => {
                    const [año, mesAusencia] = absence.date.split('-').map(Number);
                    return mesAusencia === mes;
                });

            let ausenciasPorDia = Array(diasMes).fill('');
            let totalAusencias = 0;

            ausenciasMes.forEach(absence => {
                const dia = parseInt(absence.date.split('-')[2]);
                ausenciasPorDia[dia - 1] = absence.type;
                if (absence.type === 'A' || absence.type === 'J') {
                    totalAusencias++;
                }
            });

            tableHTML += `<tr><td style="font-weight: bold;">${estudiante.name}</td>`;
            
            ausenciasPorDia.forEach(ausencia => {
                let cellClass = '';
                if (ausencia === 'A') cellClass = 'style="background-color: #ffcccc;"';
                else if (ausencia === 'J') cellClass = 'style="background-color: #ffffcc;"';
                tableHTML += `<td ${cellClass}>${ausencia || ''}</td>`;
            });

            tableHTML += `<td style="font-weight: bold;">${totalAusencias}</td></tr>`;
        });

        tableHTML += `
                        </tbody>
                    </table>
                </div>
                <p style="text-align: center; margin-top: 20px; color: #7f8c8d; font-size: 12px;">
                    Leyenda: A = Ausente, J = Justificado
                </p>
            </div>`;

        // Recuperar correo guardado para precargar
        const correoGuardado = localStorage.getItem('correoUsuario') || '';

        // Mostrar diálogo para ingresar correo con valor precargado
        Swal.fire({
            title: 'Ingrese el correo destino para enviar el informe',
            input: 'email',
            inputLabel: 'Correo electrónico',
            inputPlaceholder: 'correo@ejemplo.com',
            inputValue: correoGuardado,
            inputValidator: (value) => {
                if (!value) {
                    return 'Necesitas ingresar un correo';
                }
                const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!re.test(value)) {
                    return 'Correo inválido';
                }
            },
            showCancelButton: true,
            confirmButtonText: 'Enviar correo'
        }).then((emailResult) => {
            if (!emailResult.isConfirmed) return;

            const correoDestino = emailResult.value;

            // Guardar correo para la próxima vez
            localStorage.setItem('correoUsuario', correoDestino);

            // Mostrar mensaje de "Enviando..."
            Swal.fire({
                title: 'Enviando informe',
                html: 'Por favor espere mientras se envía el correo...',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });

            fetch('https://facturahacienda.com/correosPHP/opcion4.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    correo: correoDestino,
                    tabla_html: tableHTML,
                    asunto: `Informe de Asistencia - ${grupoSeleccionado.nombre} - ${mesSeleccionadoObj.nombre}`
                })
            })
            .then(res => res.text())
            .then(data => {
                Swal.fire('Éxito', 'El informe de asistencia ha sido enviado por correo.', 'success');
            })
            .catch(err => {
                Swal.fire('Error', 'No se pudo enviar el correo. ' + err.message, 'error');
            });
        });
    });
}