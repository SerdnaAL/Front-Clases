# Clase 12 — copia de emergencia (ya instalada) 🆘

**Usá esta carpeta solo si la instalación del Bloque 3 se te trabó.** Si la tuya funciona, seguí con
`clase-12/` y no toques esto.

Viene con el `package.json`, el `tsconfig.json` y la carpeta `src/` con los seis archivos ya renombrados
a `.ts` — o sea, todo lo que se hace en el Bloque 3, hecho.

## Cómo arrancar

```bash
npm install     # baja TypeScript (esto sí hay que correrlo)
npm run dev     # compila y se queda mirando los cambios
```

Después abrí `index.html` con **Live Server**. Tenés que ver los 38 productos.

> El `<script>` de `index.html` ya apunta a `dist/main.js`, así que **hasta que no corras `npm run dev`
> la página va a estar en blanco** — `dist/` no existe todavía. Es normal.

## Lo que vas a ver al abrir el editor

**78 errores.** Están bien: son los mismos que ve todo el mundo y son el índice de la clase.
47 de "parámetro sin tipo" (Bloque 4), 20 de "puede ser null" y 6 de `dataset` (Bloque 6), y 5 del
`error` de los `catch` (Bloque 6). Los vamos bajando a cero durante la sesión.

Y fijate en algo: **con los 78 errores, la página funciona igual**. TypeScript avisa, no frena.

## Comandos que vas a usar todo el día

```bash
npm run dev      # tsc --watch: recompila al guardar. Dejalo abierto.
npm run check    # tsc --noEmit: revisa todo sin generar nada
```
