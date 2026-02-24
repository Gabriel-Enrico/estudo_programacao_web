document.getElementById('numeroForm').addEventListener('submit', function(event){
    event.preventDefault(); // Impede o envio do form
    // Obtém o valor do número digitado
    const numero = parseFloat(document.getElementById('numero').value);
    const operation = document.getElementById('operation').value;

    if (operation == 'quadrado') {
        resultado = calcularQuadrado(numero);
    } else if (operation == 'cubo') {
        resultado = calcularCubo(numero);
    }

    // Exibe o resultado na página
    document.getElementById('resultado').textContent = resultado;
})

function calcularQuadrado(numero) {
    return numero * numero;
}

function calcularCubo(numero) {
    return numero * numero * numero;
}