const tabs = document.querySelectorAll(".op-tab");
const numInput = document.getElementById("numero");
const calcBtn = document.getElementById("calcBtn");
const btnLabel = document.getElementById("btnLabel");
const resultPanel = document.getElementById("resultPanel");
const resultExpression = document.getElementById("resultExpression");
const resultValue = document.getElementById("resultValue");
const errorMsg = document.getElementById("errorMsg");
const historyList = document.getElementById("historyList");
const historyDivider = document.getElementById("historyDivider");
const historyLabel = document.getElementById("historyLabel");

let currentOp = "quadrado";
const history = [];

// Tab switching
tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    tabs.forEach((t) => {
      t.classList.remove("active");
      t.setAttribute("aria-selected", "false");
    });
    tab.classList.add("active");
    tab.setAttribute("aria-selected", "true");
    currentOp = tab.dataset.op;
    btnLabel.textContent =
      currentOp === "quadrado" ? "Calcular Quadrado" : "Calcular Cubo";
    errorMsg.classList.remove("show");
  });
});

// Calculate
function calculate() {
  const raw = numInput.value.trim();

  if (raw === "" || isNaN(parseFloat(raw))) {
    errorMsg.classList.add("show");
    numInput.focus();
    return;
  }

  errorMsg.classList.remove("show");

  const n = parseFloat(raw);
  let result, expression;

  if (currentOp === "quadrado") {
    result = n ** 2;
    expression = `${n}² =`;
  } else {
    result = n ** 3;
    expression = `${n}³ =`;
  }

  const formatted = Number.isInteger(result)
    ? result.toLocaleString("pt-BR")
    : result.toLocaleString("pt-BR", { maximumFractionDigits: 6 });

  calcBtn.classList.add("loading");
  btnLabel.textContent = "Calculando…";

  setTimeout(() => {
    resultExpression.textContent = expression;
    resultValue.textContent = formatted;

    resultPanel.classList.remove("show");
    void resultPanel.offsetWidth; // force reflow for animation
    resultPanel.classList.add("show");

    // Update history
    if (history.length >= 4) history.shift();
    history.push({ expr: expression, val: formatted });
    renderHistory();

    calcBtn.classList.remove("loading");
    btnLabel.textContent =
      currentOp === "quadrado" ? "Calcular Quadrado" : "Calcular Cubo";
  }, 300);
}

function renderHistory() {
  if (history.length <= 1) return;

  historyDivider.style.display = "";
  historyLabel.style.display = "";
  historyList.innerHTML = "";

  const prev = history.slice(0, -1).reverse();
  prev.forEach((item) => {
    const li = document.createElement("li");
    li.className = "history-item";
    li.innerHTML = `<span>${item.expr}</span><span>${item.val}</span>`;
    historyList.appendChild(li);
  });
}

// Events
calcBtn.addEventListener("click", calculate);
numInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") calculate();
});
