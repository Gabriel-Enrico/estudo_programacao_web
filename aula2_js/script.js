document.getElementById('numeroForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const operacao = document.getElementById('operacao').value;
    const numero = parseFloat(document.getElementById('numero').value);

    let resultado;

    if (operacao === "quadrado") {
        resultado = calcularQuadrado(numero);
    } else if (operacao === "cubo") {
        resultado = calcularCubo(numero);
    }

    document.getElementById('resultado').textContent = resultado;
});

function calcularQuadrado(numero) {
    return numero * numero;
}

function calcularCubo(numero) {
    return numero ** 3;
}