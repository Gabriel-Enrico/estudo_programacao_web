document.getElementById('vendaoForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const valorTotal = parseFloat(document.getElementById('valorTotal').value);
    const parcelas = parseInt(document.getElementById('parcelas').value);
    const juros = parseFloat(document.getElementById('juros').value);

    const valorParcela = calcularParcela(valorTotal, parcelas, juros);
    const valorTotalPago = valorParcela * parcelas;

    
})