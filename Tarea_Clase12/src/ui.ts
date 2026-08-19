import formatearMoneda from "./formato.js";
import { ItemCarrito, Pedido, Producto } from "./tipos.js";

export const sanearHTML = (texto: string | undefined): string => {
  const aux = document.createElement("div");
  aux.textContent = texto ?? "";
  return aux.innerHTML;
};

export const crearTarjetaHtml = ({ id, nombre, precio, stock, imagen, marca, valoracion }: Producto): string => `
  <article class="card group cursor-pointer" data-id="${id}" data-accion="ver-detalle">
    <figure class="w-full overflow-hidden rounded-lg m-0">
      ${imagen
        ? `<img src="${imagen}" alt="${sanearHTML(nombre)}" class="w-full aspect-square object-contain transition group-hover:scale-105" />`
        : `<div class="w-full aspect-square grid place-items-center text-4xl bg-gray-100">📦</div>`}
      <figcaption class="text-texto-suave text-xs uppercase tracking-wide mt-2">${sanearHTML(marca)}</figcaption>
    </figure>
    <h3 class="text-base font-semibold mt-2 mb-1">${sanearHTML(nombre)}</h3>
    <p class="m-0"><strong class="text-precio text-lg font-bold">${formatearMoneda(precio)}</strong></p>
    <p class="m-0 text-sm text-texto-suave">⭐ ${valoracion}</p>
    <button type="button" class="btn mt-3 w-full" data-accion="agregar-carrito" data-id="${id}" ${stock === 0 ? "disabled" : ""}>
      ${stock > 0 ? "Añadir al Carrito" : "Agotado"}
    </button>
  </article>
`;

export const crearFilaCarritoHtml = ({ id, nombre, precio, cantidad }: ItemCarrito): string => `
  <li class="flex justify-between items-center border-b border-borde py-3 gap-3">
    <div>
      <span class="font-medium text-texto">${sanearHTML(nombre)}</span>
      <span class="text-xs text-texto-suave block">Cantidad: ${cantidad}</span>
    </div>
    <div class="flex gap-2 items-center">
      <strong class="text-precio font-semibold mr-2">${formatearMoneda(precio * cantidad)}</strong>
      <button type="button" class="btn px-2 py-1 text-xs" data-accion="restar" data-id="${id}">-</button>
      <button type="button" class="btn px-2 py-1 text-xs" data-accion="sumar" data-id="${id}">+</button>
      <button type="button" class="btn px-2 py-1 text-xs bg-red-600 hover:bg-red-700" data-accion="eliminar" data-id="${id}">✕</button>
    </div>
  </li>
`;

export const crearDetalleHtml = (prod: Producto): string => `
  <div class="relative">
    <button id="tc-cerrar-modal" class="absolute top-0 right-0 btn px-3 py-1 bg-gray-500">✕ Cerrar</button>
    <h2 class="text-2xl font-bold mb-2">${sanearHTML(prod.nombre)}</h2>
    <p class="text-texto-suave mb-4">${sanearHTML(prod.descripcion)}</p>
    <div class="grid grid-cols-2 gap-2 text-sm bg-fondo p-3 rounded-lg mb-4">
      <p><strong>Marca:</strong> ${sanearHTML(prod.marca)}</p>
      <p><strong>Puntuación:</strong> ⭐ ${prod.valoracion}</p>
      <p><strong>Stock disponible:</strong> ${prod.stock} unidades</p>
      <p><strong>Categoría:</strong> ${sanearHTML(prod.categoria)}</p>
    </div>
  </div>
`;

export const crearAvisoHtml = (mensaje: string): string => `
  <p class="col-span-full text-center text-texto-suave py-8">${sanearHTML(mensaje)}</p>
`;

export const crearAcordeonPedidoHtml = (p: Pedido, index: number): string => `
  <details class="border border-borde rounded-lg p-3 mb-3 bg-tarjeta">
    <summary class="cursor-pointer font-semibold text-marca">
      Pedido #${index + 1} — ${p.fecha} — (${p.unidades} productos) Total: ${formatearMoneda(p.montoTotal)}
    </summary>
    <div class="mt-3 text-sm border-t border-borde pt-2">
      <p class="mb-1"><strong>Comprador:</strong> ${sanearHTML(p.cliente)}</p>
      <p class="mb-2"><strong>Dirección:</strong> ${sanearHTML(p.direccion)}</p>
      <ul class="list-disc pl-5">
        ${p.items.map(i => `<li>${sanearHTML(i.nombre)} × ${i.cantidad}</li>`).join("")}
      </ul>
    </div>
  </details>
`;