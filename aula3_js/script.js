document.getElementById('vendaForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Impede o envio do formulário

    // Obtém os valores do formulário
    const valorTotal = parseFloat(document.getElementById('valorTotal').value);
    const parcelas = parseInt(document.getElementById('parcelas').value);
    const juros = parseFloat(document.getElementById('juros').value);

    // Calcula o valor da parcela e o valor total com juros
    const valorParcela = calcularParcela(valorTotal, parcelas, juros);
    const valorTotalPago = valorParcela * parcelas;

    // Exibe os resultados na página
    document.getElementById('valorParcela').textContent = `R$ ${valorParcela.toFixed(2)}`;
    document.getElementById('valorTotalPago').textContent = `R$ ${valorTotalPago.toFixed(2)}`;
});

function calcularParcela(valorTotal, parcelas, juros) {
    // Converte a taxa de juros para decimal
    const taxaJuros = juros / 100;

    // Fórmula de cálculo de parcelas com juros compostos
    const valorParcela = valorTotal * (taxaJuros / (1 - Math.pow(1 + taxaJuros, -parcelas)));
    return valorParcela;
}