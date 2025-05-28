async function informeTrabajoCotidianoYEnviarCorreo() {
    const grupos = JSON.parse(localStorage.getItem('grupos')) || [];
    const materias = JSON.parse(localStorage.getItem('materias')) || [];
    const estudiantes = JSON.parse(localStorage.getItem('students')) || [];
    const meses = [
        { id: 1, nombre: 'Enero' }, { id: 2, nombre: 'Febrero' }, { id: 3, nombre: 'Marzo' },
        { id: 4, nombre: 'Abril' }, { id: 5, nombre: 'Mayo' }, { id: 6, nombre: 'Junio' },
        { id: 7, nombre: 'Julio' }, { id: 8, nombre: 'Agosto' }, { id: 9, nombre: 'Septiembre' },
        { id: 10, nombre: 'Octubre' }, { id: 11, nombre: 'Noviembre' }, { id: 12, nombre: 'Diciembre' }
    ];

    if (grupos.length === 0) {
        Swal.fire('Error', 'No se encontraron grupos.', 'error');
        return;
    }

    let selectGruposHTML = '<select id="grupoSelect" class="swal2-select">';
    grupos.forEach(g => selectGruposHTML += `<option value="${g.id}">${g.nombre}</option>`);
    selectGruposHTML += '</select>';

    let selectMesHTML = '<select id="mesSelect" class="swal2-select">';
    meses.forEach(m => selectMesHTML += `<option value="${m.id}">${m.nombre}</option>`);
    selectMesHTML += '</select>';

    const { value: datosSeleccion } = await Swal.fire({
        title: 'Selecciona grupo y mes',
        html: `Grupo: ${selectGruposHTML}<br><br>Mes: ${selectMesHTML}`,
        confirmButtonText: 'Siguiente',
        showCancelButton: true,
        preConfirm: () => {
            const grupo = document.getElementById('grupoSelect').value;
            const mes = document.getElementById('mesSelect').value;
            if (!grupo || !mes) {
                Swal.showValidationMessage('Seleccioná grupo y mes');
                return false;
            }
            return { grupo, mes };
        }
    });

    if (!datosSeleccion) return;

    const grupoSeleccionado = grupos.find(g => g.id.toString() === datosSeleccion.grupo);
    const mesSeleccionado = parseInt(datosSeleccion.mes);

    if (materias.length === 0) {
        Swal.fire('Error', 'No se encontraron materias.', 'error');
        return;
    }

    let selectMateriasHTML = '<select id="materiaSelect" class="swal2-select">';
    materias.forEach(m => selectMateriasHTML += `<option value="${m.id}">${m.nombre}</option>`);
    selectMateriasHTML += '</select>';

    const { value: materiaSeleccionadaId } = await Swal.fire({
        title: 'Selecciona una materia',
        html: selectMateriasHTML,
        confirmButtonText: 'Generar informe',
        showCancelButton: true,
        preConfirm: () => {
            const materia = document.getElementById('materiaSelect').value;
            if (!materia) {
                Swal.showValidationMessage('Seleccioná una materia');
                return false;
            }
            return materia;
        }
    });

    if (!materiaSeleccionadaId) return;

    const materiaSeleccionada = materias.find(m => m.id.toString() === materiaSeleccionadaId);
    const estudiantesDelGrupo = estudiantes.filter(e => e.groupId.toString() === grupoSeleccionado.id.toString());

    let maxTrabajos = 0;
    let trabajosPorEstudiante = {};

    estudiantesDelGrupo.forEach(est => {
        let trabajos = est.trabajoCotidiano
            ? est.trabajoCotidiano.filter(t => parseInt(t.date.split('-')[1]) === mesSeleccionado).map(t => t.type)
            : [];
        trabajosPorEstudiante[est.name] = trabajos;
        maxTrabajos = Math.max(maxTrabajos, trabajos.length);
    });

    const mesesAbrev = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'];
    let tableHTML = `
        <h3>Grupo: ${grupoSeleccionado.nombre}</h3>
        <h3>Materia: ${materiaSeleccionada.nombre}</h3>
        <table border="1" cellpadding="5" cellspacing="0" style="border-collapse: collapse; width: 100%;">
            <thead>
                <tr>
                    <th>👤 Estudiante</th>`;

    for (let i = 0; i < maxTrabajos; i++) {
        let fecha = '';
        for (const est of estudiantesDelGrupo) {
            const trabajos = est.trabajoCotidiano?.filter(t => parseInt(t.date.split('-')[1]) === mesSeleccionado);
            if (trabajos?.[i]) {
                fecha = trabajos[i].date;
                break;
            }
        }
        const [año, mes, dia] = fecha ? fecha.split('-') : ['---', '--', '--'];
        const mesAbrev = mesesAbrev[parseInt(mes || '1', 10) - 1];
        tableHTML += `<th>${fecha ? `${mesAbrev} ${dia}` : '#'}</th>`;
    }

    tableHTML += `</tr></thead><tbody>`;

    estudiantesDelGrupo.forEach(est => {
        tableHTML += `<tr><td>${est.name}</td>`;
        const trabajos = trabajosPorEstudiante[est.name] || [];
        for (let i = 0; i < maxTrabajos; i++) {
            tableHTML += `<td>${trabajos[i] || ''}</td>`;
        }
        tableHTML += `</tr>`;
    });

    tableHTML += `</tbody></table>`;

    const { value: emailDestino } = await Swal.fire({
        title: 'Enviar informe por correo',
        html: `<input type="email" id="email" class="swal2-input" placeholder="Correo electrónico">`,
        confirmButtonText: 'Enviar correo',
        showCancelButton: true,
        preConfirm: () => {
            const email = document.getElementById('email').value.trim();
            if (!email) {
                Swal.showValidationMessage('Ingresá un correo electrónico');
                return false;
            }
            return email;
        }
    });

    if (!emailDestino) return;

    // Cargar EmailJS si no está ya cargado
    if (typeof emailjs === 'undefined') {
        await new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = "https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js";
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
        emailjs.init('Ht5K1L8MrR31t2m-T'); // Tu User ID de EmailJS
    }

    // Enviar correo con el HTML generado
    try {
        await emailjs.send('default_service', 'template_6hfqphs', {
            to_email: emailDestino,
            subject: `Informe de Trabajo Cotidiano - ${grupoSeleccionado.nombre}`,
            message_html: tableHTML
        });
        Swal.fire('Éxito', 'El informe fue enviado correctamente.', 'success');
    } catch (error) {
        console.error(error);
        Swal.fire('Error', 'No se pudo enviar el informe.', 'error');
    }
}
