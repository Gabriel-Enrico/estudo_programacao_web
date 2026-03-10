// ─── Variáveis globais ────────────────────────────────────────────────────────

const vendas = []; // array que guarda todas as parcelas geradas
let tabela = document.getElementById("tabela"); // referência à tabela no HTML

// ─── Preenche o array e exibe a tabela ───────────────────────────────────────

function preencherVetor() {
    let valor = parseFloat(document.getElementById("valorVenda").value);
    let parcelas = parseInt(document.getElementById("parcelas").value);
    let juros = parseFloat(document.getElementById("juros").value);

    // Validação: verifica se os campos foram preenchidos corretamente
    if (isNaN(valor) || isNaN(parcelas) || isNaN(juros)) {
        alert("Por favor, preencha todos os campos corretamente!");
        return;
    }

    if (valor <= 0 || parcelas <= 0 || juros < 0) {
        alert("Os valores precisam ser maiores que zero!");
        return;
    }

    // Limpa o array antes de gerar novas parcelas
    vendas.length = 0;

    // Calcula o valor de cada parcela com juros compostos
    let valorParcela = calcularParcela(valor, parcelas, juros);

    // Gera uma entrada no array para cada parcela
    for (let i = 0; i < parcelas; i++) {
        let dataVencimento = new Date(); // data de hoje
        dataVencimento.setDate(dataVencimento.getDate() + (30 * (i + 1))); // soma 30 dias por parcela
        let dataFormatada = dataVencimento.toLocaleDateString("pt-BR"); // formata para DD/MM/AAAA

        vendas.push({
            parcela: i + 1,
            valor: valorParcela.toFixed(2),
            vencimento: dataFormatada
        });
    }

    exibirTabela();
}

// ─── Exibe as parcelas na tabela ─────────────────────────────────────────────

function exibirTabela() {
    // Reconstrói a tabela do zero a cada chamada
    let innerTabela = `
        <tr>
            <th>Parcela</th>
            <th>Valor</th>
            <th>Vencimento</th>
        </tr>
    `;

    for (let i = 0; i < vendas.length; i++) {
        innerTabela += `
            <tr>
                <td>${vendas[i].parcela}x</td>
                <td>R$ ${vendas[i].valor}</td>
                <td>${vendas[i].vencimento}</td>
            </tr>
        `;
    }

    tabela.innerHTML = innerTabela;
}

// ─── Limpa os campos e a tabela ──────────────────────────────────────────────

function limpar() {
    vendas.length = 0; // esvazia o array

    // Limpa os inputs
    document.getElementById("valorVenda").value = "";
    document.getElementById("parcelas").value = "";
    document.getElementById("juros").value = "";

    // Restaura a tabela ao estado inicial
    tabela.innerHTML = `
        <tr>
            <th>Parcela</th>
            <th>Valor</th>
            <th>Vencimento</th>
        </tr>
    `;
}

// ─── Calcula o valor da parcela com juros compostos ──────────────────────────

function calcularParcela(valorTotal, parcelas, juros) {
    const taxaJuros = juros / 100; // converte a porcentagem para decimal (ex: 2% → 0.02)

    // Fórmula de juros compostos: M = PV * (i / (1 - (1 + i)^-n))
    const valorParcela = valorTotal * (taxaJuros / (1 - Math.pow(1 + taxaJuros, -parcelas)));
    return valorParcela;
}