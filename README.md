# SEO Content Dashboard

🚀 **Interfaz web moderna** para el sistema de generación de contenido SEO automatizado.

**🌐 URL en vivo**: https://jgmvalian.github.io/seo-dashboard/

**📅 Última actualización**: 31/01/2026  
**✅ Estado**: Desplegado y operativo en GitHub Pages

---

## 🎨 Características Principales

### ✅ Integración Completa de 4 Capas

1. **🔐 Sistema de Autenticación** (secure_login_access_1)
   - Login moderno con glassmorphism
   - Iconos Material Symbols
   - Toggle de visibilidad de contraseña
   - Checkbox "Recordarme" estilizado
   - Efectos visuales con gradientes

2. **📊 Dashboard Principal** (seo_performance_dashboard)
   - Sidebar minimalista con tooltips
   - 4 KPIs con gráficos sparkline animados:
     - Artículos Generados
     - Keywords Target
     - Quality Score Promedio
     - Total Palabras
   - Barra de progreso para Quality Score
   - Generador de contenido con formulario mejorado
   - Panel de estado del sistema
   - Tabla de historial con badges de estado
   - Navegación móvil responsive

3. **📅 Modal de Programación** (content_scheduling_form)
   - Modal glassmorphism con backdrop blur
   - Muestra keyword objetivo con métricas
   - Selector de fecha/hora integrado
   - Botones de acción con gradientes

4. **🔔 Sistema de Notificaciones** (system_status_notifications)
   - Toast notifications en esquina superior derecha
   - 4 tipos: success, error, warning, info
   - Auto-cierre después de 5 segundos
   - Animación de entrada/salida
   - Botón de cierre manual

---

## 🔑 Credenciales de Acceso

- **Usuario**: `admin`
- **Contraseña**: `seodashboard2026`

---

## 🛠️ Stack Tecnológico

- **HTML5** - Estructura semántica
- **CSS3** - Estilos con glassmorphism
- **Vanilla JavaScript** - Lógica de la aplicación
- **Tailwind CSS** (vía CDN) - Framework de utilidades
- **Material Symbols** - Iconografía consistente
- **n8n Webhooks** - Backend y automatización
- **GitHub Pages** - Hosting gratuito

---

## 🎯 Funcionalidades

- ✨ **Generación de contenido** - Ingresa una keyword y genera artículos SEO
- 🌍 **Multilenguaje** - Español (ES, MX, AR, CO) e Inglés (US, UK, CA, AU)
- ⏰ **Programación** - Ejecutar ahora o programar para después
- 📊 **Métricas en tiempo real** - Dashboard con estadísticas actualizadas
- 📜 **Historial completo** - Últimas generaciones con quality scores
- 🎨 **Diseño moderno** - Glassmorphism, animaciones, responsive
- 📱 **Mobile-first** - Navegación optimizada para móviles

---

## 📁 Estructura del Proyecto

```
seo-dashboard/
├── index.html          # Estructura principal con 4 capas integradas
├── app.js             # Lógica de la aplicación
├── styles.css         # Estilos glassmorphism y Tailwind
└── README.md          # Esta documentación
```

---

## 🚀 Despliegue en GitHub Pages

El proyecto ya está desplegado automáticamente en:
**https://jgmvalian.github.io/seo-dashboard/**

### Para actualizar el despliegue:

1. Realiza cambios en los archivos
2. Commitea los cambios:
   ```bash
   git add .
   git commit -m "Descripción de los cambios"
   git push origin master
   ```
3. GitHub Pages actualizará automáticamente en 1-2 minutos

---

## ⚙️ Configuración

Edita `app.js` para personalizar:

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

## 📊 APIs del Backend (n8n)

### 1. Keyword Research
**Endpoint**: `POST /webhook/testkw`
```json
{
  "seed_keywords": ["marketing digital"],
  "language": "es",
  "location": "ES"
}
```

### 2. SEO Content Generator
**Endpoint**: `POST /webhook/db0931a7-fb62-4a3a-a79f-915cd918edaf`
```json
{
  "keyword": "marketing digital",
  "language": "es",
  "send_email": true
}
```

### 3. Schedule
**Endpoint**: `POST /webhook/seo-schedule`
```json
{
  "keyword": "marketing digital",
  "language": "es",
  "location": "ES",
  "scheduled_at": "2026-01-31T10:00:00.000Z"
}
```

### 4. History
**Endpoint**: `GET /webhook/seo-history`

### 5. Metrics
**Endpoint**: `GET /webhook/seo-metrics`

---

## 🧪 Comando de Prueba

```powershell
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

---

## 📸 Screenshots

*(Próximamente: Capturas de pantalla de cada capa)*

---

## 📝 Changelog

### v2.0 (31/01/2026)
- ✅ Integración completa de 4 capas de diseño
- ✅ Implementación de glassmorphism en toda la interfaz
- ✅ Sistema de notificaciones toast
- ✅ Modal de programación mejorado
- ✅ Dashboard con KPIs y gráficos animados
- ✅ Login moderno con efectos visuales
- ✅ Responsive design completo
- ✅ Tailwind CSS integrado

### v1.0 (30/01/2026)
- 🎉 Versión inicial del dashboard
- ✅ Funcionalidades básicas de generación
- ✅ Integración con n8n

---

## 🤝 Contribución

Para contribuir al proyecto:
1. Fork del repositorio
2. Crea una rama (`git checkout -b feature/nueva-funcionalidad`)
3. Commitea tus cambios (`git commit -am 'Añade nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

---

## 📄 Licencia

MIT License - Ver archivo [LICENSE](LICENSE) para más detalles.

---

## 👨‍💻 Autor

**JGMVALIAN** - Sistema SEO Automatizado

---

## 🔗 Links Relacionados

- 🌐 **Dashboard en vivo**: https://jgmvalian.github.io/seo-dashboard/
- 📊 **Google Sheets**: [Ver documento](https://docs.google.com/spreadsheets/d/1cCu5_BB-xMCzXfzXpZeoEvW6zYgbQjaHFEWvQM4poPQ)
- ⚙️ **n8n Workflows**: Configurados en n8n.larryvanscamper.com

---

<p align="center">
  <strong>✨ Dashboard SEO - Generación de contenido automatizado con IA ✨</strong>
</p>
