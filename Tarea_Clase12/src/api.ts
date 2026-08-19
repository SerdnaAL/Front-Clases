import { respaldoTechCart } from "./datos.js";
import { Producto } from "./tipos.js";

const API_BASE = "https://dummyjson.com";
const CATEGORIAS_API = ["laptops", "smartphones", "tablets", "mobile-accessories"];

const mapearCategoria = (cat: string): string => cat === "mobile-accessories" ? "audio" : cat;

const estructurarProducto = (item: any, catOriginal = item.category): Producto => ({
  id: item.id,
  nombre: item.title,
  precio: item.price,
  categoria: mapearCategoria(catOriginal),
  stock: item.stock ?? 0,
  imagen: item.thumbnail,
  marca: item.brand ?? "Genérico",
  valoracion: item.rating ?? 0,
  descripcion: item.description ?? "Sin descripción detallada."
});

async function pedirPorCategoria(cat: string): Promise<Producto[]> {
  const res = await fetch(`${API_BASE}/products/category/${cat}`);
  if (!res.ok) throw new Error(`Status Code: ${res.status}`);
  const data = await res.json();
  return data.products.map((p: any) => estructurarProducto(p, cat));
}

export async function obtenerProductosTechCart(): Promise<{ productos: Producto[]; esFallback: boolean }> {
  try {
    const respuestas = await Promise.all(CATEGORIAS_API.map(pedirPorCategoria));
    return { productos: respuestas.flat(), esFallback: false };
  } catch (error) {
    console.warn("Fallo en API, usando catálogo local de respaldo:", error);
    return { productos: respaldoTechCart, esFallback: true };
  }
}

export async function obtenerDetalleProducto(id: number): Promise<Producto> {
  const res = await fetch(`${API_BASE}/products/${id}`);
  if (!res.ok) throw new Error("Error consultando el producto.");
  const p = await res.json();
  return estructurarProducto(p);
}