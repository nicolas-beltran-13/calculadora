const IVA = 0.19;
const TARIFAFIJA = 50;
const TRM = 3830.2;
const PORCENTAJEDESCUENTO = 0.1;
const PORCENTAJERECARGO = 0.1;

function convertirCop(valor) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
  }).format(valor);
}

function convertirUsd(valor) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(valor);
}

function calcularInscripcion(TipoAfiliado, tarifaBase) {
  const valorBase = parseFloat(tarifaBase);
  const valorIva = valorBase * IVA;
  const subtotal = valorBase + valorIva + TARIFAFIJA;

  let ajuste = 0;
  let porcentajeAjuste = 0;
  let tipoAjuste = "";
  let totalApagar = 0;

  switch (TipoAfiliado) {
    case "Asociado":
      ajuste = subtotal * PORCENTAJEDESCUENTO;
      totalApagar = subtotal - ajuste;
      porcentajeAjuste = -10;
      tipoAjuste = "Descuento";
      break;

    case "Noasociado":
      ajuste = subtotal * PORCENTAJERECARGO;
      totalApagar = subtotal + ajuste;
      porcentajeAjuste = 10;
      tipoAjuste = "Recargo";
      break;

    case "Extranjero":
      totalApagar = subtotal;
      porcentajeAjuste = 0;
      tipoAjuste = "conversion";
      break;
  }

  return {
    valorBase,
    valorIva,
    subtotal,
    ajuste,
    totalApagar,
    porcentajeAjuste,
    tipoAjuste,
    esExtranjero: TipoAfiliado === "Extranjero",
  };
}

document.getElementById("calculadora").addEventListener("submit", function (e) {
  e.preventDefault();

  const tipoAfiliado = document.getElementById("Tipodeafiliado").value;
  const tarifaInscripcion = document.getElementById("TarifaInscripcion").value;

  if (!tipoAfiliado || !tarifaInscripcion) {
    alert("Por favor complete todos los campos.");
    return;
  }

  const resultado = calcularInscripcion(tipoAfiliado, tarifaInscripcion);

  document.getElementById("valorBase").textContent = convertirCop(resultado.valorBase);
  document.getElementById("valorIva").textContent = convertirCop(resultado.valorIva);
  document.getElementById("subtotal").textContent = convertirCop(resultado.subtotal);

  let textoAjuste = "";
  if (resultado.tipoAjuste === "Descuento") {
    textoAjuste = `${convertirCop(resultado.ajuste)} (10% descuento)`;
  } else if (resultado.tipoAjuste === "Recargo") {
    textoAjuste = `${convertirCop(resultado.ajuste)} (10% recargo)`;
  } else {
    textoAjuste = "Sin ajuste aplicado";
  }
  document.getElementById("ajuste").textContent = textoAjuste;

  if (resultado.esExtranjero) {
    const totalUsd = resultado.totalApagar / TRM;
    document.getElementById("total").textContent = `${convertirUsd(totalUsd)} USD`;
  } else {
    document.getElementById("total").textContent = `${convertirCop(resultado.totalApagar)} COP`;
  }

  const resultadosDiv = document.getElementById("resultados");
  resultadosDiv.classList.add("show");
  resultadosDiv.scrollIntoView({ behavior: "smooth", block: "nearest" });
});
