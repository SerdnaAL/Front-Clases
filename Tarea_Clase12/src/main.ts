import { obtenerDetalleProducto, obtenerProductosTechCart } from "./api.js";
import {
  agregarItem,
  cambiarCantidad,
  calcularMontos,
  contarPorCategorias,
  eliminarItem
} from "./carrito.js";
import formatearMoneda from "./formato.js";
import { ItemCarrito, Pedido, Producto } from "./tipos.js";
import {
  crearAcordeonPedidoHtml,
  crearAvisoHtml,
  crearDetalleHtml,
  crearFilaCarritoHtml,
  crearTarjetaHtml
} from "./ui.js";

const elGrid = document.querySelector<HTMLElement>("#tc-grid-productos");
const elResumenHeader = document.querySelector<HTMLElement>("#tc-resumen-header");
const elListaCarrito = document.querySelector<HTMLElement>("#tc-lista-carrito");
const elTotalCarrito = document.querySelector<HTMLElement>("#tc-total-carrito");
const elCategoriasUl = document.querySelector<HTMLElement>("#tc-categorias");
const elBuscador = document.querySelector<HTMLInputElement>("#tc-buscador");
const elOrden = document.querySelector<HTMLSelectElement>("#tc-orden");
const elModal = document.querySelector<HTMLElement>("#tc-detalle-modal");
const elFormCheckout = document.querySelector<HTMLFormElement>("#tc-form-checkout");
const elAvisoPedido = document.querySelector<HTMLElement>("#tc-aviso-pedido");
const elContenedorPedidos = document.querySelector<HTMLElement>("#tc-contenedor-pedidos");

const STORAGE_CARRITO = "techcart_items_v2";
const STORAGE_PEDIDOS = "techcart_pedidos_v2";

let listaProductos: Producto[] = [];
let carrito: ItemCarrito[] = leerStorage<ItemCarrito[]>(STORAGE_CARRITO, []);
let catSeleccionada = "todas";
let textoBusqueda = "";
let ordenActual = "relevancia";

function guardarStorage<T>(clave: string, datos: T): void {
  localStorage.setItem(clave, JSON.stringify(datos));
}

function leerStorage<T>(clave: string, porDefecto: T): T {
  try {
    const item = localStorage.getItem(clave);
    return item ? JSON.parse(item) : porDefecto;
  } catch {
    return porDefecto;
  }
}

const obtenerFiltrados = (): Producto[] => {
  let resultado = catSeleccionada === "todas"
    ? listaProductos
    : listaProductos.filter(p => p.categoria === catSeleccionada);

  if (textoBusqueda) {
    resultado = resultado.filter(p =>
      p.nombre.toLowerCase().includes(textoBusqueda) ||
      p.marca.toLowerCase().includes(textoBusqueda)
    );
  }

  if (ordenActual === "precio-asc") return [...resultado].sort((a, b) => a.precio - b.precio);
  if (ordenActual === "precio-desc") return [...resultado].sort((a, b) => b.precio - a.precio);
  if (ordenActual === "rating-desc") return [...resultado].sort((a, b) => b.valoracion - a.valoracion);

  return resultado;
};

const renderCatalogo = (): void => {
  if (!elGrid) return;
  const visibles = obtenerFiltrados();
  elGrid.innerHTML = visibles.length
    ? visibles.map(crearTarjetaHtml).join("")
    : crearAvisoHtml(`No hay resultados para "${textoBusqueda}".`);
};

const renderContadores = (): void => {
  const conteos = contarPorCategorias(listaProductos);
  document.querySelectorAll<HTMLElement>("[data-total]").forEach(span => {
    const c = span.dataset.total ?? "";
    span.textContent = `(${c === "todas" ? listaProductos.length : conteos[c] ?? 0})`;
  });
};

const renderCarrito = (): void => {
  if (!elListaCarrito || !elTotalCarrito || !elResumenHeader) return;
  const { unidadesTotales, subtotal, totalFinal, esEnvioGratis } = calcularMontos(carrito);
  
  document.title = `TechCart (${unidadesTotales})`;
  elResumenHeader.textContent = `🛒 ${unidadesTotales} ítems · ${formatearMoneda(totalFinal)}`;
  elListaCarrito.innerHTML = carrito.length 
    ? carrito.map(crearFilaCarritoHtml).join("") 
    : crearAvisoHtml("Tu carrito de TechCart está vacío.");
  
  elTotalCarrito.innerHTML = unidadesTotales === 0
    ? "Carrito vacío"
    : `Subtotal: ${formatearMoneda(subtotal)} | Total (+IGV): <span class="text-precio">${formatearMoneda(totalFinal)}</span> ${esEnvioGratis ? '<span class="text-xs bg-green-100 text-green-800 px-2 py-1 rounded ml-2">🚚 ¡Envío Gratis!</span>' : ''}`;
};

const renderHistorialPedidos = (): void => {
  if (!elContenedorPedidos) return;
  const historial = leerStorage<Pedido[]>(STORAGE_PEDIDOS, []);
  elContenedorPedidos.innerHTML = historial.length
    ? historial.map(crearAcordeonPedidoHtml).join("")
    : "<p class='text-texto-suave'>Aún no has registrado pedidos en TechCart.</p>";
};

elGrid?.addEventListener("click", async (e: Event) => {
  const target = e.target as HTMLElement;
  const btnAgregar = target.closest<HTMLButtonElement>("button[data-accion='agregar-carrito']");
  if (btnAgregar) {
    e.stopPropagation();
    const prod = listaProductos.find(p => p.id === Number(btnAgregar.dataset.id));
    if (!prod) return;
    carrito = agregarItem(carrito, prod);
    guardarStorage(STORAGE_CARRITO, carrito);
    renderCarrito();
    return;
  }

  const tarjeta = target.closest<HTMLElement>("article[data-accion='ver-detalle']");
  if (!tarjeta || !elModal) return;
  
  elModal.classList.remove("hidden");
  elModal.innerHTML = crearAvisoHtml("Cargando información...");
  try {
    const detalle = await obtenerDetalleProducto(Number(tarjeta.dataset.id));
    elModal.innerHTML = crearDetalleHtml(detalle);
    document.querySelector("#tc-cerrar-modal")?.addEventListener("click", () => elModal.classList.add("hidden"));
  } catch (err: unknown) {
    const mensaje = err instanceof Error ? err.message : "Error desconocido";
    elModal.innerHTML = crearAvisoHtml(mensaje);
  }
});

elListaCarrito?.addEventListener("click", (e: Event) => {
  const target = e.target as HTMLElement;
  const btn = target.closest<HTMLButtonElement>("[data-accion]");
  if (!btn) return;
  const id = Number(btn.dataset.id);
  const accion = btn.dataset.accion;

  if (accion === "sumar") carrito = cambiarCantidad(carrito, id, 1);
  if (accion === "restar") carrito = cambiarCantidad(carrito, id, -1);
  if (accion === "eliminar") carrito = eliminarItem(carrito, id);

  guardarStorage(STORAGE_CARRITO, carrito);
  renderCarrito();
});

elCategoriasUl?.addEventListener("click", (e: Event) => {
  const target = e.target as HTMLElement;
  const link = target.closest<HTMLAnchorElement>("[data-categoria]");
  if (!link) return;
  e.preventDefault();
  catSeleccionada = link.dataset.categoria ?? "todas";
  renderCatalogo();
});

elBuscador?.addEventListener("input", () => {
  textoBusqueda = elBuscador.value.trim().toLowerCase();
  renderCatalogo();
});

elOrden?.addEventListener("change", () => {
  ordenActual = elOrden.value;
  renderCatalogo();
});

elFormCheckout?.addEventListener("submit", (e: Event) => {
  e.preventDefault();
  if (carrito.length === 0) {
    if (elAvisoPedido) elAvisoPedido.textContent = "Añade productos antes de procesar la compra.";
    return;
  }

  const formData = new FormData(elFormCheckout);
  const totales = calcularMontos(carrito);
  const pedidosPrevios = leerStorage<Pedido[]>(STORAGE_PEDIDOS, []);

  const pedido: Pedido = {
    fecha: new Date().toLocaleString("es-PE"),
    cliente: (formData.get("nombre") as string) ?? "Cliente TechCart",
    direccion: (formData.get("direccion") as string) ?? "Sin dirección registrada",
    items: carrito,
    unidades: totales.unidadesTotales,
    montoTotal: totales.totalFinal
  };

  guardarStorage(STORAGE_PEDIDOS, [...pedidosPrevios, pedido]);
  carrito = [];
  guardarStorage(STORAGE_CARRITO, carrito);

  if (elAvisoPedido) elAvisoPedido.textContent = "¡Orden recibida con éxito en TechCart!";
  elFormCheckout.reset();
  renderCarrito();
  renderHistorialPedidos();
});

async function appInit(): Promise<void> {
  if (elGrid) elGrid.innerHTML = crearAvisoHtml("Cargando productos...");
  
  try {
    const datos = await obtenerProductosTechCart();
    listaProductos = datos.productos;
  } catch (err: unknown) {
    console.error("Error al cargar productos:", err);
  }

  renderContadores();
  renderCatalogo();
  renderCarrito();
  renderHistorialPedidos();
}

appInit();