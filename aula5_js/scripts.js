const calcularQuadrado = (numero) => numero * numero;
document.getElementById("numeroForm").addEventListener("submit", (event) => {
  event.preventDefault(); // Impede o envio do formulário
  // Obtém o valor do número digitado
  const numero = parseFloat(document.getElementById("numero").value);
  // Chama a função arrow para calcular o quadrado
  const resultado = calcularQuadrado(numero);
  // Exibe o resultado na página
  document.getElementById(
    "resultado"
  ).textContent = `O quadrado é: ${resultado}`;
});
