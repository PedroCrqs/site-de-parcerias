const API_URL = "https://pennant-effort-diligent.ngrok-free.dev";

document.addEventListener("DOMContentLoaded", async () => {
  alert(
    "Olá corretor parceiro! Você está acessando minha planilha de opções diretas atualizada. Ao clicar no nome de cada opção, você será redirecionado para uma pasta no drive contendo as fotos e a descrição de cada opção.",
  );

  await renderizeImoveis();

  const inputs = document.querySelectorAll("input[data-column]");

  function filterTable() {
    const lines = document.querySelectorAll("#table tbody tr");
    lines.forEach((line) => {
      let show = true;
      inputs.forEach((input) => {
        const colIdx = parseInt(input.getAttribute("data-column"));
        const search = input.value.trim().toLowerCase().replace(/[.,]/g, "");
        const cell = line.children[colIdx];
        if (search && cell) {
          const cellText = cell.textContent
            .trim()
            .toLowerCase()
            .replace(/[.,]/g, "");
          if (!cellText.includes(search)) show = false;
        }
      });
      line.classList.toggle("hide", !show);
    });
  }

  inputs.forEach((input) => {
    input.addEventListener("input", filterTable);
  });
});

async function fetchImoveis() {
  const response = await fetch(`${API_URL}/api/imoveis`, {
    headers: { "ngrok-skip-browser-warning": "true" },
  });
  if (!response.ok) throw new Error(`Erro ${response.status}`);
  return response.json();
}

async function renderizeImoveis() {
  const tableBody = document.getElementById("tableBody");
  tableBody.innerHTML = "";

  let imoveis;
  try {
    imoveis = await fetchImoveis();
  } catch (error) {
    console.error("Falha ao carregar imóveis:", error);
    const cell = tableBody.insertRow().insertCell();
    cell.colSpan = 4;
    cell.textContent = "Lista indisponível no momento. Tente novamente em instantes.";
    return;
  }

  imoveis.forEach(({ NomeImovel, Bairro, Valor, Quartos, LinkPublico }) => {
    const row = tableBody.insertRow();

    const link = document.createElement("a");
    link.className = "bName";
    link.href = LinkPublico;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = NomeImovel ?? "Sem nome";
    row.insertCell().appendChild(link);

    row.insertCell().textContent = Bairro;
    row.insertCell().textContent = Number(Valor).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
    row.insertCell().textContent = Quartos;
  });
}
