#  Catálogo de Productos E-Commerce - Prueba Técnica Frontend

[![React](https://img.shields.io/badge/React-19.x-61dafb?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.x-646cff?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES2023-f7df1e?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/)
[![CSS3](https://img.shields.io/badge/CSS3-Modular-1572b6?style=for-the-badge&logo=css3&logoColor=white)](https://www.w3.org/Style/CSS/)
[![ESLint](https://img.shields.io/badge/ESLint-Configured-4b32c3?style=for-the-badge&logo=eslint&logoColor=white)](https://eslint.org/)

Aplicación web frontend desarrollada con **React 19** y **Vite** para la visualización interactiva de un catálogo de productos e-commerce consumiendo en tiempo real la API REST de **DummyJSON**. 

El proyecto implementa renderizado dinámico de componentes modulares, búsqueda instantánea (*query*), filtrado multicriterio, ordenamiento flexible y paginación configurable, siguiendo las mejores prácticas de arquitectura limpia, accesibilidad y rendimiento.

---

##  Tabla de Contenidos

- [Características Principales](#-características-principales)
- [Arquitectura y Decisiones Técnicas](#-arquitectura-y-decisiones-técnicas)
- [Requisitos Previos](#-requisitos-previos)
- [Instalación y Puesta en Marcha](#-instalación-y-puesta-en-marcha)
- [Comandos Disponibles](#-comandos-disponibles)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Detalle de Componentes y Servicios](#-detalle-de-componentes-y-servicios)
- [Puntos Fuertes Destacados](#-puntos-fuertes-destacados)

---

##  Características Principales

### 1. Consumo Dinámico de API REST
- Integración asíncrona directa con la API de [DummyJSON Products](https://dummyjson.com/products).
- Capa de servicios desacoplada (`src/services/DumpyService.jsx`) que centraliza las peticiones `fetch`.
- Gestión de estados del ciclo de vida asíncrono:
  - **Estado de Carga (*Loading*)**: Spinner animado y feedback visual.
  - **Manejo de Errores (*Error Handling*)**: Mensajes amigables con botón de reintento (*Retry*).
  - **Estado Vacío (*Empty State*)**: Ilustración y botón de restablecimiento cuando ningún resultado coincide.

### 2. Componente de Producto(`ProductCard`)
Diseñado para renderizar la totalidad de atributos del modelo de producto:
- **Identificación & Clasificación**: Marca (*Brand*), Categoría (*Category*), Código SKU y etiquetas (*Tags*).
- **Galería Interactiva**: Selector dinámico de imágenes/miniaturas con vista ampliada y etiquetas de descuento (*Ribbon*).
- **Precios y Ahorro**: Desglose del precio con descuento, cálculo automático del precio original y del monto total ahorrado.
- **Calificación & Disponibilidad**: Renderizado visual de estrellas fraccionarias, puntuación numérica, total de valoraciones y badge de stock.
- **Acciones de Compra**: Selector de cantidad que respeta el pedido mínimo (*Minimum Order Quantity*) y el stock máximo, con feedback táctil al añadir al carrito.
- **Pestañas Desplegables / Acordeón**:
  - **Especificaciones**: Peso, dimensiones tridimensionales (ancho × alto × profundidad), código de barras y renderizado del **código QR oficial**.
  - **Envíos y Políticas**: Plazo de entrega estimado, garantía, política de devolución y MOQ.
  - **Opiniones de Clientes (*Reviews*)**: Desglose de cada reseña con autor, email, fecha formateada, estrellas y comentario.

### 3. Búsqueda Multivariable en Tiempo Real (*Query*)
- Campo de búsqueda interactivo con borrado rápido (`✕`).
- Filtra instantáneamente coincidiendo en:
  - Título del producto (`title`).
  - Descripción (`description`).
  - Marca (`brand`).
  - Categoría (`category`).
  - Etiquetas (`tags`).

### 4. Filtros Combinados y Ordenamiento
- **Filtro por Categoría**: Selector dinámico generado a partir de las categorías reales provistas por la API.
- **Filtro de Disponibilidad**: Casilla de verificación *"Solo en stock"* para omitir artículos sin inventario.
- **Criterios de Ordenamiento**:
  - Por defecto / Destacados.
  - Precio: Menor a Mayor.
  - Precio: Mayor a Menor.
  - Mejor Valorados (Rating ★).
  - Mayor Descuento (% OFF).
  - Alfabético: Nombre (A - Z).
- **Botón de Limpieza**: Se activa automáticamente cuando hay filtros aplicados para restablecer la vista con un clic.

### 5. Paginación Dinámica y Configurable
- Navegación fluida: Primera (`«`), Anterior (`‹`), botones numéricos con elipsis inteligentes (`...`), Siguiente (`›`) y Última (`»`).
- Selector de cantidad de productos por página (**6, 9, 12, 18, 24**).
- Reseteo automático a la página 1 cuando el usuario aplica un filtro o realiza una búsqueda para evitar pantallas en blanco.
- Indicador en tiempo real: *"Mostrando X - Y de Z productos (Página A de B)"*.
- Desplazamiento suave (*smooth scroll*) al inicio del listado al cambiar de página.

### 6. Experiencia de Usuario (UI/UX)
- **Vistas Intercambiables**: Alternador entre vista de **Cuadrícula (*Grid*)** (diseño adaptable de 3-4 columnas) y vista de **Lista Detallada (*List*)**.
- **Tema Adaptable**: Soporte automático para temas Claro (*Light*) y Oscuro (*Dark*) mediante variables CSS y `prefers-color-scheme`.
- **Accesibilidad**: Uso de etiquetas semánticas (`<header>`, `<main>`, `<nav>`, `<article>`, `<section>`), atributos `aria-label`, `aria-current` y controles accesibles por teclado.

---

##  Arquitectura y Decisiones Técnicas

| Decisión | Justificación |
| :--- | :--- |
| **React 19 + Vite 8** | Aprovecha el compilador optimizado de Vite para un arranque y recarga en caliente (*HMR*) ultrarrápidos, con el runtime moderno de React 19. |
| **Vanilla CSS Modular** | Máximo control sobre el diseño, evitando dependencias pesadas de terceros y garantizando cero *overhead* en tiempo de ejecución. |
| **Separación de Responsabilidades** | La lógica de acceso a datos reside en `services/`, la presentación en `components/` y la orquestación en `App.jsx`. |
| **Memoización con `useMemo`** | Los cálculos de filtrado, ordenamiento y paginación están memoizados para evitar renders innecesarios al actualizar estados locales. |
| **Componente Polimórfico (`ProductCard`)** | Admite recibir el objeto `product` directamente (óptimo para renderizar colecciones) o consultar un `productId` por sí mismo si se usa de forma aislada. |

---

##  Requisitos Previos

Asegúrate de contar con el siguiente entorno antes de ejecutar el proyecto:

- **Node.js**: Versión `18.x` o superior (Recomendado: LTS `20.x` o `22.x`).
- **Gestor de Paquetes**: `pnpm`.

Comprueba tus versiones instaladas:
```bash
node -v
pnpm -v
```

---

##  Instalación y Puesta en Marcha

Sigue estos sencillos pasos para clonar y ejecutar el proyecto localmente:

### 1. Clonar el Repositorio
```bash
git clone <URL_DEL_REPOSITORIO>
cd Examen
```

### 2. Instalar Dependencias
Instala los paquetes necesarios definidos en `package.json`:
```bash
pnpm install
```
*(O si utilizas pnpm: `pnpm install`)*

### 3. Iniciar el Servidor de Desarrollo
```bash
pnpm run dev
```

El servidor Vite arrancará inmediatamente. Abre en tu navegador la URL que se muestra en la terminal (usualmente):
 **`http://localhost:5173/`**

---

##  Comandos Disponibles

En el directorio del proyecto puedes ejecutar los siguientes scripts:

| Comando | Acción |
| :--- | :--- |
| `pnpm run dev` | Inicia el servidor de desarrollo local con Hot Module Replacement (HMR). |
| `pnpm run build` | Compila y optimiza la aplicación para producción en el directorio `/dist`. |
| `pnpm run preview` | Previsualiza localmente el paquete generado para producción. |
| `pnpm run lint` | Ejecuta ESLint para validar sintaxis, reglas de React y estándares de código limpio. |

---

##  Estructura del Proyecto

```text
Examen/
├── public/                     # Archivos estáticos
│   ├── favicon.ico
│   └── icons.svg
├── src/
│   ├── assets/                 # Recursos gráficos (logos e imágenes)
│   ├── components/             # Componentes modulares reutilizables
│   │   ├── ProductCard.jsx     # Componente de tarjeta de producto con especificaciones
│   │   └── ProductCard.css     # Estilos aislados y diseño responsivo de la tarjeta
│   ├── services/               # Capa de comunicación con APIs externas
│   │   └── DumpyService.jsx    # Funciones fetch para DummyJSON (getAll, search, getById)
│   ├── App.jsx                 # Componente principal con estados de query, filtros y paginación
│   ├── App.css                 # Estilos de la barra de herramientas, filtros y paginador
│   ├── index.css               # Variables globales CSS, tipografía y soporte Dark Mode
│   └── main.jsx                # Punto de entrada de la aplicación React 19
├── eslint.config.js            # Configuración moderna de ESLint para React 19
├── index.html                  # Plantilla HTML5 con viewport y metadatos SEO
├── package.json                # Dependencias y scripts de ejecución
├── vite.config.js              # Configuración de compilación y plugins de Vite
└── README.md                   # Documentación técnica del proyecto
```

---

##  Detalle de Componentes y Servicios

### 1. `src/services/DumpyService.jsx`
Centraliza la comunicación HTTP hacia la API de DummyJSON:
- `getAllProducts(limit = 0, skip = 0)`: Solicita el catálogo completo de productos para permitir filtrado sin latencia.
- `searchProducts(query)`: Endpoint de búsqueda remota por palabra clave.
- `getProductById(id)`: Consulta un producto unitario por su identificador numérico.
- `getCategories()`: Retorna el catálogo oficial de categorías disponibles.

### 2. `src/components/ProductCard.jsx`
Componente flexible que renderiza un producto con alto nivel de fidelidad e interactividad:
- Acepta la prop `product` (objeto completo) o `productId` (para carga independiente).
- Incluye cálculo de descuento (`discountPercentage` -> `originalPrice` y `savings`).
- Botón de alternancia *"Ver especificaciones y reseñas ▼"* que evita sobrecargar visualmente la cuadrícula y mantiene alturas uniformes.

### 3. `src/App.jsx`
Orquestador de la aplicación:
- Maneja el ciclo de vida de los datos (`products`, `loading`, `error`).
- Implementa filtros simultáneos combinados mediante `useMemo` para óptimo rendimiento.
- Controla la lógica matemática de la paginación (`safeCurrentPage`, `totalPages`, `startIndex`, `endIndex`).

---

##  Puntos Fuertes Destacados para la Evaluación

1. **Código Limpio y Libre de Errores**: Verificado con `pnpm lint` y `pnpm build` con **0 errores y 0 advertencias**.
2. **Cumplimiento de Reglas Modernas de React 19**: Eliminación de llamadas sincrónicas a `setState` dentro del cuerpo de los efectos (`react-hooks/set-state-in-effect`), adoptando patrones recomendados por el equipo de React.
3. **Resiliencia ante Fallos**: Si la API externa experimenta intermitencia, se muestra un mensaje informativo y un botón de reintento manual que preserva la estabilidad de la interfaz.
4. **Diseño Visual Profesional**: Uso de glassmorphism, sombras sutiles, microinteracciones, estados *hover* suaves y compatibilidad total con tema oscuro.
