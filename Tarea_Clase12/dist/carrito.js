export const IGV = 0.18;
export const calcularMontos = (items) => {
    const unidadesTotales = items.reduce((acc, i) => acc + i.cantidad, 0);
    const subtotal = items.reduce((acc, i) => acc + (i.precio * i.cantidad), 0);
    const totalFinal = subtotal * (1 + IGV);
    const esEnvioGratis = subtotal >= 50;
    return { unidadesTotales, subtotal, totalFinal, esEnvioGratis };
};
export const agregarItem = (items, producto) => {
    const encontrado = items.find(i => i.id === producto.id);
    if (!encontrado)
        return [...items, { ...producto, cantidad: 1 }];
    return items.map(i => i.id === producto.id
        ? { ...i, cantidad: Math.min(i.cantidad + 1, i.stock) }
        : i);
};
export const cambiarCantidad = (items, id, paso) => items
    .map(i => i.id === id ? { ...i, cantidad: i.cantidad + paso } : i)
    .filter(i => i.cantidad > 0);
export const eliminarItem = (items, id) => items.filter(i => i.id !== id);
export const contarPorCategorias = (items) => items.reduce((acc, p) => ({
    ...acc,
    [p.categoria]: (acc[p.categoria] ?? 0) + 1
}), {});
//# sourceMappingURL=carrito.js.map