// Array que armazena todas as parcelas geradas
const vendas = [];

// Referência ao elemento <tbody> da tabela no HTML
const tbody = document.getElementById("tbody");

// Exibe uma notificação flutuante na base da tela
function showToast(msg) {
  // Pega o elemento da notificação no HTML
  const t = document.getElementById("toast");

  // Injeta a mensagem — usamos innerHTML porque a mensagem pode ter tags <span> com cor
  t.innerHTML = msg;

  // Adiciona a classe "show" que o CSS usa para fazer o toast aparecer com animação
  t.classList.add("show");

  // Cancela o timer anterior caso o usuário dispare um novo toast antes do primeiro sumir
  clearTimeout(t._timer);

  // Agenda a remoção da classe "show" após 2,6 segundos, fazendo o toast desaparecer
  t._timer = setTimeout(() => t.classList.remove("show"), 2600);
}

// Formata um número para o padrão monetário brasileiro (ex: 1234.5 → "1.234,50")
function formatBRL(value) {
  // Intl.NumberFormat é uma API nativa do JS para formatação internacional
  // "pt-BR" define o locale brasileiro: vírgula decimal e ponto de milhar
  return new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: 2, // sempre exibe pelo menos 2 casas decimais
    maximumFractionDigits: 2, // e no máximo 2 também
  }).format(value);
}

// Calcula o valor de cada parcela usando a fórmula de juros compostos
function calcularParcela(valorTotal, parcelas, juros) {
  const taxa = juros / 100; // converte porcentagem para decimal (ex: 2% → 0.02)

  // Se a taxa for zero, divide o valor igualmente entre as parcelas sem juros
  if (taxa === 0) return valorTotal / parcelas;

  // Fórmula de juros compostos: PV * (i / (1 - (1 + i)^-n))
  return valorTotal * (taxa / (1 - Math.pow(1 + taxa, -parcelas)));
}

// Atualiza a barra de resumo acima da tabela com os totais calculados
function atualizarSummary(valorOriginal) {
  // Se não há parcelas, esconde a barra de resumo e encerra a função
  if (vendas.length === 0) {
    document.getElementById("summaryBar").classList.remove("visible");
    return;
  }

  // Pega o valor de uma parcela (todas têm o mesmo valor, então usamos a primeira)
  const porParcela = parseFloat(vendas[0].valor);

  // Total que o cliente vai pagar (parcela × quantidade)
  const total = porParcela * vendas.length;

  // Juros totais cobrados = diferença entre o total parcelado e o valor original
  const jurosTotal = total - valorOriginal;

  // Atualiza cada elemento da barra de resumo com os valores formatados
  document.getElementById("summaryTotal").textContent =
    "R$ " + formatBRL(total);
  document.getElementById("summaryParcela").textContent =
    "R$ " + formatBRL(porParcela);
  document.getElementById("summaryJuros").textContent =
    "+ R$ " + formatBRL(jurosTotal);
  document.getElementById("summaryQtd").textContent = vendas.length + "x";

  // Torna a barra de resumo visível adicionando a classe que o CSS usa para exibi-la
  document.getElementById("summaryBar").classList.add("visible");
}

// Atualiza o contador de parcelas exibido no rodapé do card
function atualizarFooter() {
  document.getElementById("footerCount").textContent = vendas.length;
}

// Mostra ou esconde a mensagem de "nenhuma parcela" dependendo se o array está vazio
function toggleEmpty() {
  const el = document.getElementById("emptyState");

  // Se o array está vazio, adiciona "visible" para mostrar a mensagem
  // Caso contrário, remove "visible" para escondê-la
  if (vendas.length === 0) el.classList.add("visible");
  else el.classList.remove("visible");
}

// Cria e retorna um elemento <tr> completo para uma parcela
function criarLinha(venda) {
  const tr = document.createElement("tr");

  // Célula do número da parcela — exibida como um badge estilizado
  const tdP = document.createElement("td");
  const badge = document.createElement("span");
  badge.className = "badge-parcela";
  badge.textContent = venda.parcela + "x";
  tdP.appendChild(badge); // encaixa o badge dentro da célula

  // Célula do valor — o "R$" fica numa <span> separada para poder ter cor diferente no CSS
  const tdV = document.createElement("td");
  tdV.className = "td-valor";
  tdV.innerHTML = `<span class="currency">R$</span>${formatBRL(parseFloat(venda.valor))}`;

  // Célula da data de vencimento
  const tdD = document.createElement("td");
  tdD.className = "td-venc";
  tdD.textContent = venda.vencimento;

  // Célula do botão de remover
  const tdA = document.createElement("td");
  tdA.className = "td-action";

  const btn = document.createElement("button");
  btn.className = "btn-remover";

  // aria-label é um atributo de acessibilidade — descreve o botão para leitores de tela
  btn.setAttribute("aria-label", "Remover parcela " + venda.parcela);

  // Ícone de × em SVG desenhado diretamente no botão
  btn.innerHTML = `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round">
    <line x1="3" y1="3" x2="13" y2="13"/>
    <line x1="13" y1="3" x2="3" y2="13"/>
  </svg>`;

  // Quando o botão for clicado, remove esta parcela do array e re-renderiza a tabela
  btn.addEventListener("click", () => {
    // Procura a posição desta parcela no array pelo número dela
    const idx = vendas.findIndex((v) => v.parcela === venda.parcela);

    if (idx !== -1) {
      vendas.splice(idx, 1); // remove 1 elemento na posição encontrada
      exibirTabela(null); // null indica que não deve recalcular o resumo
      showToast(
        `Parcela <span class="toast-accent">${venda.parcela}x</span> removida`,
      );
    }
  });

  tdA.appendChild(btn); // encaixa o botão dentro da célula

  // Encaixa todas as células na linha na ordem correta
  tr.appendChild(tdP);
  tr.appendChild(tdV);
  tr.appendChild(tdD);
  tr.appendChild(tdA);

  return tr; // devolve o <tr> completo para ser inserido na tabela
}

// Limpa e reconstrói a tabela inteira a partir do array de vendas
function exibirTabela(valorOriginal) {
  // Apaga todas as linhas atuais da tabela
  tbody.innerHTML = "";

  // Para cada venda no array, cria uma linha e insere no tbody
  vendas.forEach((venda, i) => {
    const linha = criarLinha(venda);

    // Aplica um atraso crescente na animação de entrada de cada linha
    // Linha 1: 0ms, Linha 2: 35ms, Linha 3: 70ms... — cria o efeito cascata
    linha.style.animationDelay = i * 35 + "ms";

    tbody.appendChild(linha);
  });

  toggleEmpty(); // verifica se deve mostrar a mensagem de lista vazia
  atualizarFooter(); // atualiza o contador do rodapé

  // Só recalcula o resumo se um valor original foi passado
  // Quando valorOriginal é null (ex: ao remover uma parcela), pula essa etapa
  if (valorOriginal !== null) atualizarSummary(valorOriginal);
}

// Lê os campos, valida, preenche o array e renderiza a tabela
function preencherVetor() {
  const valor = parseFloat(document.getElementById("valorVenda").value);
  const parcelas = parseInt(document.getElementById("parcelas").value);
  const juros = parseFloat(document.getElementById("juros").value);

  // isNaN retorna true se o valor não for um número válido (campo vazio, por exemplo)
  if (isNaN(valor) || isNaN(parcelas) || isNaN(juros)) {
    showToast("⚠ Preencha todos os campos");
    return; // interrompe a função aqui se houver campo inválido
  }

  if (valor <= 0 || parcelas <= 0 || juros < 0) {
    showToast("⚠ Valores precisam ser maiores que zero");
    return;
  }

  // Esvazia o array antes de gerar novas parcelas
  vendas.length = 0;

  const valorParcela = calcularParcela(valor, parcelas, juros);

  for (let i = 0; i < parcelas; i++) {
    const d = new Date(); // data de hoje
    d.setDate(d.getDate() + 30 * (i + 1)); // soma 30 dias por parcela

    vendas.push({
      parcela: i + 1,
      valor: valorParcela.toFixed(2), // arredonda para 2 casas decimais
      vencimento: d.toLocaleDateString("pt-BR"), // formata como DD/MM/AAAA
    });
  }

  exibirTabela(valor); // passa o valor original para calcular os juros no resumo
  showToast(
    `<span class="toast-accent">${parcelas}</span> parcelas geradas com sucesso`,
  );
}

// Zera tudo: array, campos do formulário, tabela e resumo
function limpar() {
  vendas.length = 0;

  document.getElementById("valorVenda").value = "";
  document.getElementById("parcelas").value = "";
  document.getElementById("juros").value = "";

  tbody.innerHTML = ""; // limpa as linhas da tabela

  // Esconde a barra de resumo
  document.getElementById("summaryBar").classList.remove("visible");

  toggleEmpty(); // vai mostrar a mensagem "nenhuma parcela"
  atualizarFooter(); // zera o contador do rodapé
  showToast("Campos limpos");
}
