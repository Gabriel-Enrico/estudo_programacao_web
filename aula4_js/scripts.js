// Array que armazena todas as vendas cadastradas
const vendas = [];

// Referência ao elemento <tbody> da tabela no HTML
const tbody = document.getElementById("tbody");

// Contador para gerar IDs sequenciais
let proximoId = 1;

// Exibe uma notificação flutuante na base da tela
function showToast(msg) {
  const t = document.getElementById("toast");
  t.innerHTML = msg;
  t.classList.add("show");
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.remove("show"), 2600);
}

// Formata um número para o padrão monetário brasileiro (ex: 1234.5 → "1.234,50")
function formatBRL(value) {
  return new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

// Formata a data e hora atual no padrão brasileiro (DD/MM/AAAA HH:MM:SS)
function formatDataHora(data) {
  return data.toLocaleDateString("pt-BR") +
    " " +
    data.toLocaleTimeString("pt-BR");
}

// Atualiza a barra de resumo acima da tabela com os totais calculados
function atualizarSummary() {
  if (vendas.length === 0) {
    document.getElementById("summaryBar").classList.remove("visible");
    return;
  }

  // Soma total dos valores originais
  const totalBruto = vendas.reduce((acc, v) => acc + v.valorOriginal, 0);

  // Soma total dos valores com desconto aplicado
  const totalLiquido = vendas.reduce((acc, v) => acc + v.valorDesconto, 0);

  // Total de descontos concedidos
  const totalDesconto = totalBruto - totalLiquido;

  document.getElementById("summaryTotal").textContent = "R$ " + formatBRL(totalLiquido);
  document.getElementById("summaryParcela").textContent = "R$ " + formatBRL(totalBruto);
  document.getElementById("summaryJuros").textContent = "- R$ " + formatBRL(totalDesconto);
  document.getElementById("summaryQtd").textContent = vendas.length + "x";

  document.getElementById("summaryBar").classList.add("visible");
}

// Atualiza o contador de vendas exibido no rodapé do card
function atualizarFooter() {
  document.getElementById("footerCount").textContent = vendas.length;
}

// Mostra ou esconde a mensagem de "nenhuma venda" dependendo se o array está vazio
function toggleEmpty() {
  const el = document.getElementById("emptyState");
  if (vendas.length === 0) el.classList.add("visible");
  else el.classList.remove("visible");
}

// Cria e retorna um elemento <tr> completo para uma venda
function criarLinha(venda) {
  const tr = document.createElement("tr");

  // Célula do ID
  const tdId = document.createElement("td");
  const badge = document.createElement("span");
  badge.className = "badge-parcela";
  badge.textContent = "#" + venda.id;
  tdId.appendChild(badge);

  // Célula do nome do vendedor
  const tdNome = document.createElement("td");
  tdNome.className = "td-venc";
  tdNome.textContent = venda.vendedor;

  // Célula do valor original
  const tdValor = document.createElement("td");
  tdValor.className = "td-valor";
  tdValor.innerHTML = `<span class="currency">R$</span>${formatBRL(venda.valorOriginal)}`;

  // Célula do desconto
  const tdDesconto = document.createElement("td");
  tdDesconto.className = "td-venc";
  tdDesconto.innerHTML = `<span class="currency">- R$</span>${formatBRL(venda.desconto)}`;

  // Célula do valor com desconto
  const tdLiquido = document.createElement("td");
  tdLiquido.className = "td-valor";
  tdLiquido.innerHTML = `<span class="currency">R$</span>${formatBRL(venda.valorDesconto)}`;

  // Célula da data de cadastro
  const tdData = document.createElement("td");
  tdData.className = "td-venc";
  tdData.textContent = venda.dataCadastro;

  // Célula do botão de remover
  const tdAcao = document.createElement("td");
  tdAcao.className = "td-action";

  const btn = document.createElement("button");
  btn.className = "btn-remover";
  btn.setAttribute("aria-label", "Remover venda #" + venda.id);
  btn.innerHTML = `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round">
    <line x1="3" y1="3" x2="13" y2="13"/>
    <line x1="13" y1="3" x2="3" y2="13"/>
  </svg>`;

  // Ao clicar, remove a venda pelo ID e re-renderiza
  btn.addEventListener("click", () => {
    const idx = vendas.findIndex((v) => v.id === venda.id);
    if (idx !== -1) {
      const nome = vendas[idx].vendedor;
      vendas.splice(idx, 1);
      exibirTabela();
      showToast(`Venda de <span class="toast-accent">${nome}</span> removida`);
    }
  });

  tdAcao.appendChild(btn);

  tr.appendChild(tdId);
  tr.appendChild(tdNome);
  tr.appendChild(tdValor);
  tr.appendChild(tdDesconto);
  tr.appendChild(tdLiquido);
  tr.appendChild(tdData);
  tr.appendChild(tdAcao);

  return tr;
}

// Limpa e reconstrói a tabela inteira a partir do array de vendas
function exibirTabela() {
  tbody.innerHTML = "";

  vendas.forEach((venda, i) => {
    const linha = criarLinha(venda);
    linha.style.animationDelay = i * 35 + "ms";
    tbody.appendChild(linha);
  });

  toggleEmpty();
  atualizarFooter();
  atualizarSummary();
}

// Lê os campos, valida, preenche o array e renderiza a tabela
function preencherVetor() {
  const vendedor = document.getElementById("valorVenda").value.trim();
  const valorStr = document.getElementById("parcelas").value;
  const valor = parseFloat(valorStr);

  if (!vendedor) {
    showToast("⚠ Preencha o nome do vendedor");
    return;
  }

  if (isNaN(valor) || valor <= 0) {
    showToast("⚠ Informe um valor de venda válido");
    return;
  }

  // Calcula o desconto de 10%
  const desconto = valor * 0.10;
  const valorComDesconto = valor - desconto;

  // Cria o objeto da venda e adiciona ao array
  vendas.push({
    id: proximoId++,
    vendedor: vendedor,
    valorOriginal: valor,
    desconto: desconto,
    valorDesconto: valorComDesconto,
    dataCadastro: formatDataHora(new Date()),
  });

  // Limpa os campos do formulário
  document.getElementById("valorVenda").value = "";
  document.getElementById("parcelas").value = "";
  document.getElementById("juros").value = "";

  exibirTabela();
  showToast(
    `Venda de <span class="toast-accent">${vendedor}</span> cadastrada com sucesso`
  );
}

// Remove apenas o último item cadastrado
function removerUltimo() {
  if (vendas.length === 0) {
    showToast("⚠ Nenhuma venda para remover");
    return;
  }

  const ultima = vendas.pop();
  exibirTabela();
  showToast(
    `Última venda (<span class="toast-accent">${ultima.vendedor}</span>) removida`
  );
}

// Zera tudo: array, campos do formulário, tabela e resumo
function limpar() {
  if (vendas.length === 0) {
    showToast("⚠ Nenhuma venda cadastrada");
    return;
  }

  vendas.length = 0;

  document.getElementById("valorVenda").value = "";
  document.getElementById("parcelas").value = "";
  document.getElementById("juros").value = "";

  tbody.innerHTML = "";

  document.getElementById("summaryBar").classList.remove("visible");

  toggleEmpty();
  atualizarFooter();
  showToast("Todas as vendas foram removidas");
}