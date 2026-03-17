# Learning Pad — Soporte Técnico N1 · Odoo 18

Sitio estático interactivo para el programa de inducción de técnicos de soporte N1 en Odoo 18. Publicado en GitHub Pages.

## Descripción

Programa de 10 semanas que cubre los módulos funcionales de Odoo 18 más las localizaciones Prointec para Costa Rica (Facturación Electrónica y Nómina). Incluye teoría, prácticas guiadas, prácticas autónomas, quizzes interactivos y simulaciones de tickets reales.

## Stack

- HTML + CSS + JavaScript vanilla (sin frameworks, sin build)
- Responsive con sidebar colapsable en mobile
- Dark mode con toggle persistente (localStorage)
- GitHub Pages (despliegue estático directo desde rama `main`)

## Estructura del programa

| Semana | Módulo |
|--------|--------|
| 1 | Introducción y Configuración Global |
| 2 | CRM |
| 3 | Ventas |
| 4 | Compras |
| 5 | Inventarios |
| 6 | Facturación Electrónica CR (localización Prointec) |
| 7 | Nómina CR (localización Prointec) |
| 8 | Contabilidad Operativa |
| 9 | Contabilidad Analítica y Cierre |
| 10 | Metodología de Soporte N1 |

## Archivos

```
learning-pad/
├── index.html        # Sitio completo (Home + 10 semanas)
├── css/styles.css    # Estilos light/dark mode
├── js/app.js         # Navegación, quizzes, acordeones, tema, copy prompts
└── img/              # Logo e imágenes
```

## Despliegue local

```bash
python3 -m http.server 8080
```

Abrir en el navegador: `http://localhost:8080`

> No abrir `index.html` directamente con `file://` — algunas funciones del navegador (clipboard API) requieren HTTPS o localhost.

## Despliegue en GitHub Pages

1. Crear repositorio en GitHub
2. Subir el contenido de esta carpeta a la rama `main`
3. En Settings → Pages → Source: rama `main`, carpeta `/ (root)`
4. El sitio queda disponible en `https://<org>.github.io/<repo>`

## Audiencia

Técnicos de soporte N1 que se incorporan a Prointec. El programa asume conocimiento básico de informática pero ningún conocimiento previo de Odoo o ERP.

## Mantenimiento

El contenido de cada semana está íntegramente en `index.html`. Para modificar una semana, buscar la sección `id="weekN"` correspondiente.
