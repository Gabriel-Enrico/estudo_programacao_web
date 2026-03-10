const tabs = document.querySelectorAll(".op-tab"); // todas as abas (quadrado e cubo)
const numInput = document.getElementById("numero"); // campo de input do número
const calcBtn = document.getElementById("calcBtn"); // botão de calcular
const btnLabel = document.getElementById("btnLabel"); // texto dentro do botão
const resultPanel = document.getElementById("resultPanel"); // painel que exibe o resultado
const resultExpression = document.getElementById("resultExpression"); // ex: "4² ="
const resultValue = document.getElementById("resultValue"); // ex: "16"
const errorMsg = document.getElementById("errorMsg"); // mensagem de erro
const historyList = document.getElementById("historyList"); // lista do histórico
const historyDivider = document.getElementById("historyDivider"); // linha divisória do histórico
const historyLabel = document.getElementById("historyLabel"); // título "Histórico"

let currentOp = "quadrado"; // operação ativa no momento (começa como quadrado)
const history = []; // array que guarda os cálculos anteriores

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {

    // Remove o estado ativo de TODAS as abas
    tabs.forEach((t) => {
      t.classList.remove("active");
      t.setAttribute("aria-selected", "false");
    });

    // Ativa apenas a aba que foi clicada
    tab.classList.add("active");
    tab.setAttribute("aria-selected", "true");

    // Atualiza a operação atual lendo o atributo data-op do HTML
    currentOp = tab.dataset.op;

    // Atualiza o texto do botão conforme a aba selecionada
    // Operador ternário: se for quadrado escreve um texto, senão escreve outro
    btnLabel.textContent =
      currentOp === "quadrado" ? "Calcular Quadrado" : "Calcular Cubo";

    // Esconde o erro ao trocar de aba
    errorMsg.classList.remove("show");
  });
});

function calculate() {
  const raw = numInput.value.trim(); // pega o valor digitado e remove espaços nas pontas

  // Validação: para a função se o campo estiver vazio ou não for um número
  if (raw === "" || isNaN(parseFloat(raw))) {
    errorMsg.classList.add("show"); // exibe a mensagem de erro
    numInput.focus(); // coloca o cursor de volta no input
    return; // interrompe a função aqui
  }

  errorMsg.classList.remove("show"); // esconde o erro se o valor for válido

  const n = parseFloat(raw); // converte o texto para número decimal
  let result, expression; // serão preenchidas no if abaixo

  // Calcula conforme a operação ativa e monta o texto da expressão
  if (currentOp === "quadrado") {
    result = n ** 2;
    expression = `${n}² =`; // template string: injeta o valor de n no texto
  } else {
    result = n ** 3;
    expression = `${n}³ =`;
  }

  // Formata o número no padrão brasileiro (ex: 1.000.000)
  // Se for inteiro formata normalmente, se tiver decimais limita a 6 casas
  const formatted = Number.isInteger(result)
    ? result.toLocaleString("pt-BR")
    : result.toLocaleString("pt-BR", { maximumFractionDigits: 6 });

  // Feedback visual: desabilita o botão e muda o texto enquanto "processa"
  calcBtn.classList.add("loading");
  btnLabel.textContent = "Calculando…";

  // Aguarda 300ms antes de exibir o resultado (efeito de processamento)
  setTimeout(() => {

    // Escreve a expressão e o resultado no HTML
    resultExpression.textContent = expression;
    resultValue.textContent = formatted;

    // Reinicia a animação de entrada do painel:
    // remove a classe, força o navegador a recalcular o layout, depois adiciona de volta
    resultPanel.classList.remove("show");
    void resultPanel.offsetWidth; // força reflow para a animação CSS reiniciar
    resultPanel.classList.add("show");

    // Atualiza o histórico:
    // se já tiver 4 itens, remove o mais antigo antes de adicionar o novo
    if (history.length >= 4) history.shift();
    history.push({ expr: expression, val: formatted }); // adiciona o cálculo atual
    renderHistory();

    // Restaura o botão ao estado normal
    calcBtn.classList.remove("loading");
    btnLabel.textContent =
      currentOp === "quadrado" ? "Calcular Quadrado" : "Calcular Cubo";

  }, 300);
}

function renderHistory() {
  // Só exibe o histórico a partir do 2º cálculo
  if (history.length <= 1) return;

  historyDivider.style.display = ""; // exibe a linha divisória
  historyLabel.style.display = ""; // exibe o título "Histórico"
  historyList.innerHTML = ""; // limpa a lista antes de reescrever (evita duplicatas)

  // Pega todos os itens exceto o último (já exibido como resultado atual)
  // e inverte a ordem para o mais recente aparecer primeiro
  const prev = history.slice(0, -1).reverse();

  prev.forEach((item) => {
    const li = document.createElement("li"); // cria um elemento <li>
    li.className = "history-item"; // aplica a classe de estilo
    li.innerHTML = `<span>${item.expr}</span><span>${item.val}</span>`; // injeta expressão e valor
    historyList.appendChild(li); // adiciona o <li> na lista do DOM
  });
}

// ─── Eventos ──────────────────────────────────────────────────────────────────

calcBtn.addEventListener("click", calculate); // clique no botão chama calculate()

// Pressionar Enter no input também chama calculate()
numInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") calculate();
});