import { Producto } from "./tipos.js";

export const respaldoTechCart: Producto[] = [
  {
    id: 1, nombre: "MacBook Pro 14 M2", precio: 4999.99, categoria: "laptops", stock: 4,
    imagen: "https://cdn.dummyjson.com/product-images/laptops/apple-macbook-pro-14-inch-space-grey/thumbnail.webp",
    marca: "Apple", valoracion: 4.8, descripcion: "Potente laptop para desarrollo y diseño profesional."
  },
  {
    id: 2, nombre: "iPhone 13 Pro Max", precio: 1399.99, categoria: "smartphones", stock: 7,
    imagen: "https://cdn.dummyjson.com/product-images/smartphones/iphone-13-pro/thumbnail.webp",
    marca: "Apple", valoracion: 4.7, descripcion: "Pantalla OLED de alta frecuencia con cámara avanzada."
  },
  {
    id: 3, nombre: "iPad Mini 6", precio: 799.99, categoria: "tablets", stock: 0,
    imagen: "https://cdn.dummyjson.com/product-images/tablets/ipad-mini-2021-starlight/thumbnail.webp",
    marca: "Apple", valoracion: 4.5, descripcion: "Diseño compacto con chip de alto rendimiento."
  },
  {
    id: 4, nombre: "AirPods Max", precio: 549.99, categoria: "audio", stock: 3,
    imagen: "https://cdn.dummyjson.com/product-images/mobile-accessories/apple-airpods-max-silver/thumbnail.webp",
    marca: "Apple", valoracion: 4.3, descripcion: "Cancelación de ruido activa y audio de alta fidelidad."
  }
];