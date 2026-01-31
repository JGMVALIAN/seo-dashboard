# SEO Content Generator - Documentación del Sistema

**Versión**: 2.0  
**Fecha**: 31/01/2026  
**Estado**: ✅ **Desplegado y Operativo en GitHub Pages**

---

## 🎯 Descripción General

Sistema automatizado que combina **Keyword Research** con **Generación de Contenido SEO** usando IA, con una **interfaz web moderna** desplegada en GitHub Pages.

### Flujo Completo del Sistema

```
Usuario → Dashboard Web → n8n Webhooks → SerpAPI → DeepSeek AI → Artículo SEO → Sheets + Email
```

---

## 🌐 Dashboard Web (Nuevo)

**URL**: https://jgmvalian.github.io/seo-dashboard/

### Arquitectura de 4 Capas

El dashboard está construido con una arquitectura de **4 capas independientes** integradas:

#### 1. 🔐 Capa de Autenticación (`secure_login_access_1`)
- **Tecnología**: HTML5 + CSS3 + Glassmorphism
- **Características**:
  - Formulario de login moderno
  - Efectos visuales con gradientes
  - Iconos Material Symbols
  - Toggle de visibilidad de contraseña
  - Checkbox "Recordarme" estilizado
  - Botón con efecto de brillo al hover
- **Seguridad**: Validación local de credenciales

#### 2. 📊 Capa Principal del Dashboard (`seo_performance_dashboard`)
- **Tecnología**: Tailwind CSS + Vanilla JS
- **Componentes**:
  - **Sidebar minimalista**: Navegación con iconos y tooltips
  - **4 KPI Cards**:
    - Artículos Generados (con sparkline)
    - Keywords Target (con sparkline)
    - Quality Score Promedio (con barra de progreso)
    - Total Palabras (con gráfico de barras)
  - **Generador de Contenido**: Formulario con keyword, idioma, ubicación
  - **Panel de Estado del Sistema**: API Connection, Keyword Database
  - **Tabla de Historial**: Recent Generations con status, fechas, quality scores
  - **Navegación móvil**: Barra inferior optimizada

#### 3. 📅 Capa de Programación (`content_scheduling_form`)
- **Tecnología**: Modal glassmorphism
- **Características**:
  - Modal/Overlay para programar publicaciones
  - Calendario interactivo
  - Selector de hora (HH:MM)
  - Muestra keyword target con volumen y dificultad
  - Botones de acción con gradientes

#### 4. 🔔 Capa de Notificaciones (`system_status_notifications`)
- **Tecnología**: Toast notifications CSS
- **Características**:
  - Toast notifications: Success, Error, Warning, Info
  - Diseño glassmorphism con borde de color
  - Posición: Top-right fixed
  - Auto-cierre después de 5 segundos
  - Animación de entrada/salida

### Stack Tecnológico del Frontend

```
├── HTML5 (Estructura semántica)
├── CSS3 (Glassmorphism, animaciones)
├── Tailwind CSS (vía CDN)
├── Material Symbols (Iconografía)
├── Vanilla JavaScript (Lógica)
└── GitHub Pages (Hosting)
```

---

## ⚙️ Workflows de n8n (Backend)

### 1. Keyword Research
**ID**: `zzMMxvDR5RimTaMR`  
**Endpoint**: `POST https://n8n.larryvanscamper.com/webhook/testkw`

**Uso**:
```json
{
  "seed_keywords": ["tu keyword"],
  "language": "es",
  "location": "ES"
}
```

**Proceso**:
1. Recibe seed keywords desde el dashboard
2. Consulta SerpAPI (Google Autocomplete)
3. Agrupa por clusters semánticos
4. Guarda en Google Sheets
5. Dispara SEO Generator con Top Opportunity

**Tiempo de ejecución**: 5-10 segundos

---

### 2. SEO Content Generator
**ID**: `bptd1Vi63A08cdAj`  
**Endpoint**: `POST https://n8n.larryvanscamper.com/webhook/db0931a7-fb62-4a3a-a79f-915cd918edaf`

**Uso directo**:
```json
{
  "keyword": "tu keyword",
  "send_email": true,
  "language": "es"
}
```

**Proceso**:
1. Recibe keyword (responde inmediatamente, procesa async)
2. Construye prompt SEO optimizado
3. Genera artículo con DeepSeek v3 (~1500+ palabras)
4. Guarda en Google Sheets
5. Envía email a matallanos4@gmail.com

**Tiempo de ejecución**: 2-3 minutos

---

### 3. Schedule (Programación)
**Endpoint**: `POST https://n8n.larryvanscamper.com/webhook/seo-schedule`

**Uso**:
```json
{
  "keyword": "marketing digital",
  "language": "es",
  "location": "ES",
  "scheduled_at": "2026-01-31T10:00:00.000Z"
}
```

**Función**: Programa la generación de contenido para una fecha/hora específica

---

### 4. History (Historial)
**Endpoint**: `GET https://n8n.larryvanscamper.com/webhook/seo-history`

**Respuesta**:
```json
[
  {
    "keyword": "taller camper bizkaia",
    "quality": 98,
    "date": "2026-01-30T20:45:00.000Z",
    "status": "published",
    "slug": "/taller-camper-bizkaia"
  }
]
```

---

### 5. Metrics (Métricas)
**Endpoint**: `GET https://n8n.larryvanscamper.com/webhook/seo-metrics`

**Respuesta**:
```json
{
  "totalArticles": 12,
  "avgQuality": 95,
  "avgDensity": 1.2,
  "topKeyword": "camperizacion"
}
```

---

## 📊 Google Sheets

**Documento**: `1cCu5_BB-xMCzXfzXpZeoEvW6zYgbQjaHFEWvQM4poPQ`

| Pestaña | Contenido |
|---------|-----------|
| Keyword Research | Keywords, clusters, oportunidades |
| SEO Content | Artículos completos generados |

---

## 🎨 Resultado del Contenido Generado

Cada artículo incluye:
- ✅ Título H1 optimizado
- ✅ Meta description
- ✅ 6-8 secciones H2
- ✅ FAQ con 7-8 preguntas
- ✅ Conclusión
- ✅ Quality Score (objetivo: 100/100)

---

## ⏱️ Tiempos de Ejecución

| Componente | Tiempo |
|------------|--------|
| Keyword Research | 5-10 segundos |
| SEO Generator | 2-3 minutos |
| **Flujo Completo** | **3-4 minutos** |
| Actualización Dashboard | Cada 30 segundos |

---

## 🔧 Configuración del Dashboard

Archivo: `app.js`

```javascript
const CONFIG = {
    // API Endpoints (n8n webhooks)
    API_BASE: 'https://n8n.larryvanscamper.com/webhook',
    ENDPOINTS: {
        KEYWORD_RESEARCH: '/testkw',
        SEO_GENERATOR: '/db0931a7-fb62-4a3a-a79f-915cd918edaf',
        SCHEDULE: '/seo-schedule',
        HISTORY: '/seo-history',
        METRICS: '/seo-metrics'
    },

    // Auth credentials
    AUTH: {
        username: 'admin',
        password: 'seodashboard2026'
    },

    // Auto refresh interval (ms)
    REFRESH_INTERVAL: 30000
};
```

---

## 🧪 Comandos de Prueba

### PowerShell
```powershell
# Keyword Research
$body = @{
    seed_keywords = @("marketing digital")
    language = "es"
    location = "ES"
} | ConvertTo-Json

Invoke-RestMethod -Uri "https://n8n.larryvanscamper.com/webhook/testkw" `
    -Method POST `
    -ContentType "application/json" `
    -Body $body
```

### cURL
```bash
curl -X POST "https://n8n.larryvanscamper.com/webhook/testkw" \
  -H "Content-Type: application/json" \
  -d '{"seed_keywords":["marketing digital"],"language":"es","location":"ES"}'
```

---

## 📁 Estructura de Archivos

```
n8nspaghetti/
├── seo-dashboard/              # Frontend (GitHub Pages)
│   ├── index.html             # Estructura con 4 capas
│   ├── app.js                 # Lógica de la aplicación
│   ├── styles.css             # Estilos glassmorphism
│   └── README.md              # Documentación del dashboard
│
├── workflows/
│   └── seo-simple/
│       └── stitch/            # 4 capas de diseño originales
│           ├── content_scheduling_form/
│           ├── secure_login_access_1/
│           ├── seo_performance_dashboard/
│           └── system_status_notifications/
│
├── SISTEMA_SEO_DOCUMENTACION.md   # Esta documentación
├── NEXT_SESSION_STATUS.md         # Estado de la sesión
└── CREDENTIALS_SETUP_SEO_WORKFLOW.md  # Configuración (local only)
```

---

## 🚀 Despliegue

### GitHub Pages (Frontend)
- **URL**: https://jgmvalian.github.io/seo-dashboard/
- **Rama**: `master`
- **Path**: `/ (root)`
- **Estado**: ✅ Activo

### n8n (Backend)
- **URL**: https://n8n.larryvanscamper.com
- **Estado**: ✅ Operativo
- **Webhooks**: Todos configurados y funcionando

---

## ✅ Checklist de Funcionalidades

### Dashboard Web
- [x] Login con autenticación
- [x] Dashboard con métricas en tiempo real
- [x] Generador de contenido con formulario
- [x] Programación de publicaciones
- [x] Historial de generaciones
- [x] Sistema de notificaciones
- [x] Diseño responsive
- [x] Glassmorphism UI
- [x] Tailwind CSS integrado

### Backend (n8n)
- [x] Keyword Research workflow
- [x] SEO Content Generator workflow
- [x] Schedule workflow
- [x] History API
- [x] Metrics API
- [x] Integración con Google Sheets
- [x] Envío de emails

---

## 🐛 Solución de Problemas

### Problema: Dashboard no muestra datos
**Causa**: Posible error en la respuesta del webhook
**Solución**: Verificar en `app.js` que los nombres de propiedades coincidan con el schema JSON del webhook

### Problema: Error de CORS
**Causa**: Webhooks no configurados con CORS
**Solución**: Todos los webhooks deben tener `Access-Control-Allow-Origin: *`

### Problema: Formato de fecha incompatible
**Causa**: Función de formateo no reconoce el formato ISO
**Solución**: Usar `new Date(dateStr).toLocaleDateString()`

---

## 📈 Próximas Mejoras

- [ ] Implementar autenticación JWT
- [ ] Añadir gráficos de analytics
- [ ] Exportar reportes PDF
- [ ] Integración con más APIs de SEO
- [ ] Sistema de usuarios múltiples
- [ ] Dark/Light mode toggle
- [ ] PWA (Progressive Web App)

---

## 📞 Soporte

Para reportar issues o solicitar mejoras:
1. Crear un issue en el repositorio de GitHub
2. Contactar al administrador del sistema

---

## 📄 Licencia

MIT License

---

<p align="center">
  <strong>🚀 Sistema SEO Automatizado - Dashboard Web v2.0 🚀</strong><br>
  <em>Generación de contenido SEO con IA, ahora con interfaz web moderna</em>
</p>
