const formatearMoneda = (valor: number): string => `S/ ${Number(valor).toFixed(2)}`;
export default formatearMoneda;