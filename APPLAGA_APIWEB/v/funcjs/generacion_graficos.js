
const colores = {
    verdeControl1: getComputedStyle(document.documentElement).getPropertyValue('--verde-control1'),
    verdeControl2: getComputedStyle(document.documentElement).getPropertyValue('--verde-control2'),
    verdeControl3: getComputedStyle(document.documentElement).getPropertyValue('--verde-control3'),
    verdeApplaga1: getComputedStyle(document.documentElement).getPropertyValue('--verde-applaga'),
    verdeApplaga2: getComputedStyle(document.documentElement).getPropertyValue('--verde-applaga2'),
    acero1: getComputedStyle(document.documentElement).getPropertyValue('--acero1'),
    acero2: getComputedStyle(document.documentElement).getPropertyValue('--acero2'),
    blanco2: getComputedStyle(document.documentElement).getPropertyValue('--blanco2'),
    gris10: getComputedStyle(document.documentElement).getPropertyValue('--gris10'),
    negro: getComputedStyle(document.documentElement).getPropertyValue('--negro'),
    negro1: getComputedStyle(document.documentElement).getPropertyValue('--negro1'),
    blanco: getComputedStyle(document.documentElement).getPropertyValue('--blanco'),
    grisClaro1: getComputedStyle(document.documentElement).getPropertyValue('--gris-claro1'),
    grisClaro2: getComputedStyle(document.documentElement).getPropertyValue('--gris-claro2'),
    azulOscuro1: getComputedStyle(document.documentElement).getPropertyValue('--azul-oscuro1'),
    azulClaro1: getComputedStyle(document.documentElement).getPropertyValue('--azul-claro1'),
    alertaleve: getComputedStyle(document.documentElement).getPropertyValue('--alerta-leve'),
    alertafuerte: getComputedStyle(document.documentElement).getPropertyValue('--alerta-fuerte'),
    advertencialeve: getComputedStyle(document.documentElement).getPropertyValue('--advertencialeve'),
    advertenciafuerte: getComputedStyle(document.documentElement).getPropertyValue('--advertenciafuerte'),
    infolevel: getComputedStyle(document.documentElement).getPropertyValue('--info-leve'),
    infofuerte: getComputedStyle(document.documentElement).getPropertyValue('--info-fuerte'),
    exitoleve: getComputedStyle(document.documentElement).getPropertyValue('--exito-leve'),
    exitofuerte: getComputedStyle(document.documentElement).getPropertyValue('--exito-fuerte'),
};
async function insectos_data(year, localid) {
    try {
        let entrada = {'local_id': localid, 'year': year};
        let datos = await fetch(http + '/qr/api_statsDataInsectos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(entrada)
        });
        let resultado = await datos.json();
        return resultado;
    } catch (e) {
        console.log('generacion_graficos', e);
        return null;
    }

}

function acentos(texto) {
    try {
        const textarea = document.createElement('textarea');
        textarea.innerHTML = texto;
        return textarea.value;
    } catch (e) {
        console.log('generacion_graficos', e);
        return texto;
    }
}

function generar_grafico_multiples_lineas(titulo, labels, datos) {
    try {
        let div_resultados = document.getElementById('div_resultados');
        let contenido = '<div class="clearfix">&nbsp;</div><canvas id="grafico" style="width: 100%; max-height: 450px !important;"></canvas>';
        contenido += '<div class="clearfix">&nbsp;</div>';
        div_resultados.innerHTML = contenido;
        // Obtener el elemento canvas
        let canvas = document.getElementById('grafico');
        let ctx = canvas.getContext('2d');
        let miGrafico = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: datos
            },
            options: {
                responsive: true,
                maintainAspectRatio: true
            }
        });
    } catch (e) {
        console.log("generacion_graficos", e);
        button.disabled = false;
    }
}

function generar_grafico_pie(titulo, labels, datos) {
    try {
        let div_resultados = document.getElementById('div_resultados');
        let contenido = '<div class="clearfix">&nbsp;</div><canvas id="grafico" style="width: 100%; max-height: 450px !important;"></canvas>';
        contenido += '<div class="clearfix">&nbsp;</div>';
        div_resultados.innerHTML = contenido;
        // Obtener el elemento canvas
        let canvas = document.getElementById('grafico');
        // Crear el gráfico
        let ctx = canvas.getContext('2d');
        let miGrafico = new Chart(ctx, {
            type: 'pie', // Tipo de gráfico de pastel
            data: {
                //labels: ['Manzanas', 'Plátanos', 'Naranjas', 'Uvas'],
                labels: labels,
                datasets: [{
                        //data: [10, 5, 7, 15],
                        data: datos
                                //backgroundColor: ['red', 'yellow', 'orange', 'purple'] // Colores de las secciones
                    }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: (titulo).toUpperCase() // Título del gráfico
                    },
                    tooltip: {
                        callbacks: {
                            label: (context) => {
                                const label = context.label || '';
                                const value = context.raw || 0;
                                const dataset = context.dataset || {};
                                const percent = parseFloat(value / dataset.data.reduce((a, b) => a + b) * 100).toFixed(2);
                                return `${label}: ${value} (${percent} %)`;
                            }
                        }
                    }
                }
            }
        });
    } catch (e) {
        console.log("generacion_graficos", e);
        button.disabled = false;
    }
}

function generar_grafico_linea(titulo, labels, datos) {
    try {
        let div_resultados = document.getElementById('div_resultados');
        let contenido = '<div class="clearfix">&nbsp;</div><canvas id="grafico" style="width: 100%; max-height: 450px !important;"></canvas>';
        contenido += '<div class="clearfix">&nbsp;</div>';
        div_resultados.innerHTML = contenido;
        // Obtener el elemento canvas
        let canvas = document.getElementById('grafico');
        // Crear el gráfico
        let ctx = canvas.getContext('2d');
        let miGrafico = new Chart(ctx, {
            //type: 'bar',
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                        label: acentos(titulo),
                        data: datos,
                        borderColor: colores.exitofuerte,
                        backgroundColor: colores.exitoleve,
                        borderWidth: 3,
                        fill: true // esto para llenar abajo
                    }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true
            }
        });
        //miGrafico.update();

    } catch (e) {
        console.log("generacion_graficos", e);
        button.disabled = false;
    }
}

async function insectos_total_mes(button) {
    try {
        button.disabled = true;
        let selectCliente = document.getElementById('cboClientes');
        let selectLocal = document.getElementById('cboLocal');
        let selectGrafico = document.getElementById('cboGraficos');
        let div_resultados = document.getElementById('div_resultados');
        let contenido = '';
        let month = document.getElementById('cboMonth').value;
        let year = document.getElementById('cboYear').value;
        selectCliente.classList.remove('input-alerta');
        selectLocal.classList.remove('input-alerta');
        selectGrafico.classList.remove('input-alerta');
        if (selectCliente.value == "0") {
            selectCliente.classList.add('input-alerta');
            button.disabled = false;
            return;
        }

        if (selectGrafico.value == "0") {
            selectGrafico.classList.add('input-alerta');
            button.disabled = false;
            return;
        }

        if (selectLocal.value == "0") {
            selectLocal.classList.add('input-alerta');
            button.disabled = false;
            return;
        }

        let tipo_grafico = selectGrafico.value;
        div_resultados.innerHTML = '<div style="text-align:center">Cargando gr&aacute;ficos...</div>';
        let resultado = await insectos_data(year, selectLocal.value);
        let labels = [];
        let datos = [];
        var titulos = {
            total_mes: 'Total de insectos por mes',
            total_lepidopteros: 'Total de lepid&oacute;pteros por mes',
            prj_lepidopteros: 'Porcentaje de lepid&oacute;pteros por mes',
            total_microlepidopteros: 'Total de microlepid&oacute;pteros por mes',
            prj_microlepidopteros: 'Porcentaje de microlepid&oacute;pteros por mes',
            total_hemipteros: 'Total de hem&iacute;pteros por mes',
            prj_hemipteros: 'Porcentaje de hem&iacute;pteros por mes',
            total_coleopteros: 'Total de cole&oacute;pteros por mes',
            prj_coleopteros: 'Porcentaje de cole&oacute;pteros por mes',
            total_moscas: 'Total de moscas por mes',
            prj_moscas: 'Porcentaje de moscas por mes',
            total_mosquitos: 'Total de mosquitos por mes',
            prj_mosquitos: 'Porcentaje de mosquitos por mes',
            total_otros: 'Total de otros por mes',
            prj_otros: 'Porcentaje de otros por mes'
        }


        if (resultado.datos.length === 0 || resultado.resultado == "0") {
        } else if (resultado.datos[0].resultado == "0") {
        } else if (selectGrafico.value === 'total_especies') {

            let le = [];
            let mle = [];
            let he = [];
            let co = [];
            let m = [];
            let mo = [];
            let o = [];
            for (var i = 0; i < resultado.datos.length; i++) {
                var fecha = mes(parseInt(resultado.datos[i].MES));
                labels.push((fecha).toUpperCase());
                le.push(parseInt(resultado.datos[i].PUNTOHISTORIAL_LEPIDOPTEROS));
                mle.push(parseInt(resultado.datos[i].PUNTOHISTORIAL_MICROLEPIDOPTEROS));
                he.push(parseInt(resultado.datos[i].PUNTOHISTORIAL_HEMIPTEROS));
                co.push(parseInt(resultado.datos[i].PUNTOHISTORIAL_COLEOPTEROS));
                m.push(parseInt(resultado.datos[i].PUNTOHISTORIAL_MOSCAS));
                mo.push(parseInt(resultado.datos[i].PUNTOHISTORIAL_MOSQUITOS));
                o.push(parseInt(resultado.datos[i].PUNTOHISTORIAL_OTROS));
            }

            let datos = [{
                    label: acentos('Lepid&oacute;pteros'),
                    data: le,
                    borderWidth: 3,
                    fill: true
                }, {
                    label: acentos('Microlepid&oacute;pteros'),
                    data: mle,
                    borderWidth: 3,
                    fill: true
                }, {
                    label: acentos('Hem&iacute;pteros'),
                    data: he,
                    borderWidth: 3,
                    fill: true
                }, {
                    label: acentos('Cole&oacute;pteros'),
                    data: co,
                    borderWidth: 3,
                    fill: true
                }, {
                    label: acentos('Moscas'),
                    data: m,
                    borderWidth: 3,
                    fill: true
                }, {
                    label: acentos('Mosquitos'),
                    data: mo,
                    borderWidth: 3,
                    fill: true
                }, {
                    label: acentos('Otros insectos'),
                    data: o,
                    borderWidth: 3,
                    fill: true
                }];
            generar_grafico_multiples_lineas("Total mensual de especies", labels, datos);
        } else if (selectGrafico.value === 'prj_especies') {
            let datos = [];
            let labels = [];
            let titulo = '';
            for (var i = 0; i < resultado.datos.length; i++) {
                if (resultado.datos[i].MES === month && resultado.datos[i].YEAR == year) {
                    //titulo = 'Porcentajes de insectos en el mes de ' + mes(parseInt(resultado.datos[i].MES) + ' (TOTAL: ' + resultado.datos[i].TOTAL_INSECTOS + ')');
                    titulo = 'Porcentajes de insectos en el mes de ' + mes(parseInt(resultado.datos[i].MES));
                    labels.push(acentos('Lepid&oacute;pteros'));
                    labels.push(acentos('Microlepid&oacute;pteros'));
                    labels.push(acentos('Hem&iacute;pteros'));
                    labels.push(acentos('Cole&oacute;pteros'));
                    labels.push(acentos('Moscas'));
                    labels.push(acentos('Mosquitos'));
                    labels.push(acentos('Otros'));
                    ;
                    /*
                     datos.push(resultado.datos[i].PUNTOHISTORIAL_PRJ_LE);
                     datos.push(resultado.datos[i].PUNTOHISTORIAL_PRJ_MLE);
                     datos.push(resultado.datos[i].PUNTOHISTORIAL_PRJ_HE);
                     datos.push(resultado.datos[i].PUNTOHISTORIAL_PRJ_CO);
                     datos.push(resultado.datos[i].PUNTOHISTORIAL_PRJ_M);
                     datos.push(resultado.datos[i].PUNTOHISTORIAL_PRJ_MO);
                     datos.push(resultado.datos[i].PUNTOHISTORIAL_PRJ_O); */

                    datos.push(parseInt(resultado.datos[i].PUNTOHISTORIAL_LEPIDOPTEROS));
                    datos.push(parseInt(resultado.datos[i].PUNTOHISTORIAL_MICROLEPIDOPTEROS));
                    datos.push(parseInt(resultado.datos[i].PUNTOHISTORIAL_HEMIPTEROS));
                    datos.push(parseInt(resultado.datos[i].PUNTOHISTORIAL_COLEOPTEROS));
                    datos.push(parseInt(resultado.datos[i].PUNTOHISTORIAL_MOSCAS));
                    datos.push(parseInt(resultado.datos[i].PUNTOHISTORIAL_MOSQUITOS));
                    datos.push(parseInt(resultado.datos[i].PUNTOHISTORIAL_OTROS));
                }
            }

            generar_grafico_pie(titulo, labels, datos);
        } else {
            for (var i = 0; i < resultado.datos.length; i++) {

                var fecha = mes(parseInt(resultado.datos[i].MES));
                let datoIndex = {
                    total_mes: parseInt(resultado.datos[i].TOTAL_INSECTOS),
                    total_lepidopteros: parseInt(resultado.datos[i].PUNTOHISTORIAL_LEPIDOPTEROS),
                    prj_lepidopteros: parseInt(resultado.datos[i].PUNTOHISTORIAL_PRJ_LE),
                    total_microlepidopteros: parseInt(resultado.datos[i].PUNTOHISTORIAL_MICROLEPIDOPTEROS),
                    prj_microlepidopteros: parseInt(resultado.datos[i].PUNTOHISTORIAL_PRJ_MLE),
                    total_hemipteros: parseInt(resultado.datos[i].PUNTOHISTORIAL_HEMIPTEROS),
                    prj_hemipteros: parseInt(resultado.datos[i].PUNTOHISTORIAL_PRJ_HE),
                    total_coleopteros: parseInt(resultado.datos[i].PUNTOHISTORIAL_COLEOPTEROS),
                    prj_coleopteros: parseInt(resultado.datos[i].PUNTOHISTORIAL_PRJ_CO),
                    total_moscas: parseInt(resultado.datos[i].PUNTOHISTORIAL_MOSCAS),
                    prj_moscas: parseInt(resultado.datos[i].PUNTOHISTORIAL_PRJ_M),
                    total_mosquitos: parseInt(resultado.datos[i].PUNTOHISTORIAL_MOSQUITOS),
                    prj_mosquitos: parseInt(resultado.datos[i].PUNTOHISTORIAL_PRJ_MO),
                    total_otros: parseInt(resultado.datos[i].PUNTOHISTORIAL_OTROS),
                    prj_otros: parseInt(resultado.datos[i].PUNTOHISTORIAL_PRJ_O)
                };
                labels.push((fecha).toUpperCase());
                datos.push(datoIndex[tipo_grafico]);
            }

            generar_grafico_linea(titulos[tipo_grafico], labels, datos);
        }


        button.disabled = false;
    } catch (e) {
        console.log("generacion_graficos", e);
        button.disabled = false;
    }

}