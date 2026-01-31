# 🛠️ Guía de Reparación: SEO Dashboard Frontend

Este documento sirve de contexto para que un Modelo de Lenguaje (LLM) o Desarrollador pueda arreglar la interfaz web del Dashboard SEO (`seo-dashboard`).

## 📂 Estructura del Proyecto (`c:\n8nspaghetti\seo-dashboard`)

*   **`index.html`**: Estructura del DOM. Contiene los contenedores para las métricas (`#total-articles`, `#avg-quality`) y la tabla de historial (`#history-table-body`).
*   **`app.js`**: Lógica principal. Se encarga de hacer `fetch` a los webhooks de n8n y renderizar los datos.
*   **`styles.css`**: Estilos visuales.

## 🔗 Backend: Webhooks de n8n (Verificados)

El backend consta de 3 flujos de n8n que leen de Google Sheets y devuelven JSON.
**IMPORTANTE**: Todos los Webhooks han sido configurados con `Access-Control-Allow-Origin: *` (CORS permitido) y devuelven JSON.

### 1. API Métricas (`/seo-metrics`)
*   **Método**: GET
*   **Función**: Devuelve KPIs globales.
*   **Schema JSON Esperado**:
    ```json
    {
      "totalArticles": 12,
      "avgQuality": 95,
      "avgDensity": 1.2,
      "topKeyword": "camperizacion"
    }
    ```
*   **Problema Potencial**: Revisar si `app.js` mapea correctamente estos nombres de propiedades (case-sensitive) a los IDs del HTML.

### 2. API Historial (`/seo-history`)
*   **Método**: GET
*   **Función**: Devuelve array con los últimos 20 artículos.
*   **Schema JSON Esperado**:
    ```json
    [
      {
        "keyword": "taller camper bizkaia",
        "quality": 98,
        "date": "2026-01-30T20:45:00.000Z",
        "status": "published",
        "slug": "/taller-camper-bizkaia"
      },
      ...
    ]
    ```
*   **Problema Potencial**:
    *   Formato de fecha incompatible con la función de formateo en JS.
    *   `app.js` podría estar esperando una propiedad envolvente (e.g., `{ "data": [...] }`) pero el webhook devuelve el array directo `[...]` (o viceversa).

### 3. API Programación (`/seo-schedule`) (Recién Arreglada)
*   **Método**: POST
*   **Payload Envío**:
    ```json
    {
      "keyword": "...",
      "scheduled_at": "ISO-STRING",
      "email": true
    }
    ```
*   **Estado**: Funciona. Responde "OK" inmediatemente.

## 🕵️‍♂️ Puntos Clave para Debugging en `app.js`

El modelo debe inspeccionar `app.js` buscando específicamente:

1.  **Manejo de Respuestas Fetch**:
    *   ¿Hace `.json()` correctamente?
    *   ¿Maneja errores si el JSON está mal formado?
2.  **Mapeo de Datos**:
    *   Buscar funciones como `updateDashboard()` o `renderHistory()`.
    *   Comparar `data.propiedad` con el schema documentado arriba.
    *   **Pista**: A veces n8n devuelve `[{ json: { ... } }]` si no se usa el nodo "Respond to Webhook" correctamente formateado, o devuelve el objeto limpio si se usa `RespondWith: JSON`. Verificar qué espera el JS.
3.  **Authentication/CORS**:
    *   Asegurarse de que no se estén enviando cabeceras extrañas que provoquen un Preflight fallido (aunque el servidor ya acepta OPTIONS).

## 🧪 Instrucción para el LLM Reparador

> "Analiza `app.js` y `index.html`. El usuario reporta que el Dashboard no muestra datos. Los endpoints de n8n funcionan y devuelven JSON. Tu tarea es verificar cómo `app.js` consume esas respuestas y corregir cualquier discrepancia en nombres de variables, estructura de objetos (arrays vs objetos) o renderizado del DOM."
