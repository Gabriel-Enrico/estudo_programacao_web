let area = document.getElementById('area');
let nomeInput = document.getElementById("nome");

document.getElementById("contaForm").addEventListener("submit", function(event) {
    event.preventDefault();

    let nome = nomeInput.value.trim();

    if (nome === '') {
        mostrarAlert("Por favor, digite seu nome!");
        area.innerHTML = "Clique no botão para acessar...";
        return;
    }

    if (/\d/.test(nome)) {
        mostrarAlert("O nome não pode conter números!");
        area.innerHTML = "Clique no botão para acessar...";
        return;
    }

    area.innerHTML = "Bem-vindo, " + nome + "! ";

    // desabilita o input e adiciona a classe de estilo
    nomeInput.disabled = true;
    nomeInput.classList.add("input-disabled");

    let botaoSair = document.createElement("button");
    botaoSair.innerText = "Sair da conta";
    botaoSair.type = "button";
    botaoSair.className = "enter-btn";
    botaoSair.id = "botaoSair"; // id para encontrar e remover depois
    botaoSair.onclick = sair;
    document.getElementById("contaForm").appendChild(botaoSair);
});

function sair() {
    mostrarAlert("Até mais!");
    area.innerHTML = "Clique no botão para acessar...";

    // reabilita o input e remove a classe de estilo
    nomeInput.disabled = false;
    nomeInput.classList.remove("input-disabled");
    nomeInput.value = ""; // limpa o input

    // remove o botão sair do DOM
    let botaoSair = document.getElementById("botaoSair");
    if (botaoSair) botaoSair.remove();
}

function mostrarAlert(mensagem) {
    // cria o fundo escuro
    let overlay = document.createElement("div");
    overlay.className = "alert-overlay";

    // cria a caixa do alert
    let box = document.createElement("div");
    box.className = "alert-box";

    // cria o texto
    let texto = document.createElement("p");
    texto.innerText = mensagem;

    // cria o botão de fechar
    let btn = document.createElement("button");
    btn.innerText = "OK";
    btn.className = "alert-btn";
    btn.onclick = function() {
        overlay.remove(); // remove o alert ao clicar em OK
    };

    // monta tudo
    box.appendChild(texto);
    box.appendChild(btn);
    overlay.appendChild(box);
    document.body.appendChild(overlay);
}