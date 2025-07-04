const form = document.getElementById("formPedido");
const tabela = document.querySelector("#tabelaPedidos tbody");

let pedidos = JSON.parse(localStorage.getItem("pedidos")) || [];
let editIndex = null;

function calcularValorTotal(tipo, qtd, restricoes) {
  let precoBase = 25 * qtd;
  let desconto = tipo === "Vegetariana" ? precoBase * 0.10 : 0;
  let taxaRestricao = restricoes.length > 0 ? 5 * qtd : 0;

  return precoBase - desconto + taxaRestricao;
}

function renderPedidos() {
  tabela.innerHTML = "";
  pedidos.forEach((pedido, index) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${pedido.nome}</td>
      <td>${pedido.tipo}</td>
      <td>${pedido.quantidade}</td>
      <td>${pedido.restricoes.join(", ") || "-"}</td>
      <td>R$${pedido.valorTotal.toFixed(2).replace(".", ",")}</td>
      <td>
        <button onclick="editarPedido(${index})">Editar</button>
        <button onclick="excluirPedido(${index})">Excluir</button>
      </td>
    `;
    tabela.appendChild(row);
  });

  localStorage.setItem("pedidos", JSON.stringify(pedidos));
}

form.addEventListener("submit", function(e) {
  e.preventDefault();

  const nome = document.getElementById("nome").value;
  const tipo = document.getElementById("tipo").value;
  const quantidade = parseInt(document.getElementById("quantidade").value);
  const restricoes = Array.from(document.querySelectorAll(".restricao:checked")).map(cb => cb.value);
  const valorTotal = calcularValorTotal(tipo, quantidade, restricoes);

  const novoPedido = { nome, tipo, quantidade, restricoes, valorTotal };

  if (editIndex !== null) {
    pedidos[editIndex] = novoPedido;
    editIndex = null;
  } else {
    pedidos.push(novoPedido);
  }

  form.reset();
  renderPedidos();
});

window.editarPedido = function(index) {
  const pedido = pedidos[index];
  document.getElementById("nome").value = pedido.nome;
  document.getElementById("tipo").value = pedido.tipo;
  document.getElementById("quantidade").value = pedido.quantidade;
  document.querySelectorAll(".restricao").forEach(cb => {
    cb.checked = pedido.restricoes.includes(cb.value);
  });
  editIndex = index;
};

window.excluirPedido = function(index) {
  pedidos.splice(index, 1);
  renderPedidos();
};

renderPedidos();
