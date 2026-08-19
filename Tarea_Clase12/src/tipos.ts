export interface Producto {
  id: number;
  nombre: string;
  precio: number;
  categoria: string;
  stock: number;
  imagen: string;
  marca: string;
  valoracion: number;
  descripcion: string;
}

export interface ItemCarrito extends Producto {
  cantidad: number;
}

export interface ResumenMontos {
  unidadesTotales: number;
  subtotal: number;
  totalFinal: number;
  esEnvioGratis: boolean;
}

export interface Pedido {
  fecha: string;
  cliente: string;
  direccion: string;
  items: ItemCarrito[];
  unidades: number;
  montoTotal: number;
}