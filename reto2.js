const nombres = [];
const notas = [];
const maxAlumnos = 10;

const formulario = document.getElementById("formulario");
const mensaje = document.getElementById("mensaje");
const resultados = document.getElementById("resultados");

const calcularPromedio = (arreglo) => arreglo.reduce((a, b) => a + b, 0) / arreglo.length;

const validarEntrada = (nombre, n1, n2, n3) => {
    if (typeof nombre !== "string" || nombre.trim() === "") return false;
    const notasArray = [n1, n2, n3];
    return notasArray.every(n => !isNaN(n) && n >= 0 && n <= 100);
};

const mostrarResultados = (promediosAlumnos, promediosCertamenes, promedioGeneral, aprobados, reprobados, ranking) => {
    const listaAlumnosHTML = nombres.map((nombre, i) => 
        `<p>${nombre} - Notas: ${notas[i].join(", ")} - Promedio: ${promediosAlumnos[i].toFixed(2)}</p>`
    ).join("");

    const rankingHTML = ranking.map(a => 
        `<li>${a.nombre}: ${a.promedio.toFixed(2)}</li>`
    ).join("");

    document.getElementById("lista-alumnos").innerHTML = `<h3>Alumnos</h3>${listaAlumnosHTML}`;
    
    document.getElementById("estadisticas").innerHTML = `
        <h3>Estadísticas</h3>
        <p>Promedio Certamen 1: ${promediosCertamenes[0].toFixed(2)}</p>
        <p>Promedio Certamen 2: ${promediosCertamenes[1].toFixed(2)}</p>
        <p>Promedio Certamen 3: ${promediosCertamenes[2].toFixed(2)}</p>
        <p>Promedio General del Curso: ${promedioGeneral.toFixed(2)}</p>
        <p>Aprobados: ${aprobados}</p>
        <p>Reprobados: ${reprobados}</p>
    `;

    document.getElementById("ranking").innerHTML = `<h3>Ranking</h3><ol>${rankingHTML}</ol>`;
    resultados.classList.remove("oculto");
};

const procesarResultados = () => {
    const promediosAlumnos = notas.map(calcularPromedio);
    
    const promediosCertamenes = [0, 1, 2].map(certamen => 
        calcularPromedio(notas.map(n => n[certamen]))
    );
    
    const promedioGeneral = calcularPromedio(promediosAlumnos);
    const aprobados = promediosAlumnos.filter(p => p >= 55).length;
    const reprobados = promediosAlumnos.filter(p => p < 55).length;
    
    const ranking = nombres
        .map((nombre, i) => ({ nombre, promedio: promediosAlumnos[i] }))
        .sort((a, b) => b.promedio - a.promedio);

    mostrarResultados(promediosAlumnos, promediosCertamenes, promedioGeneral, aprobados, reprobados, ranking);
};

formulario.addEventListener("submit", (e) => {
    e.preventDefault();
    
    if (nombres.length >= maxAlumnos) return;

    const nombre = document.getElementById("nombre").value.trim();
    const n1 = parseFloat(document.getElementById("nota1").value);
    const n2 = parseFloat(document.getElementById("nota2").value);
    const n3 = parseFloat(document.getElementById("nota3").value);

    if (!validarEntrada(nombre, n1, n2, n3)) {
        mensaje.textContent = "Datos inválidos. Verifique el nombre y que las notas estén entre 0 y 100.";
        mensaje.style.color = "red";
        return;
    }

    nombres.push(nombre);
    notas.push([n1, n2, n3]);
    
    formulario.reset();
    mensaje.style.color = "green";
    mensaje.textContent = `Alumno agregado. Faltan ${maxAlumnos - nombres.length}`;

    if (nombres.length === maxAlumnos) {
        document.querySelector('button[type="submit"]').disabled = true;
        mensaje.textContent = "Se han ingresado los 10 alumnos. Mostrando resultados...";
        procesarResultados();
    }
});
