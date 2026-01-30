# SEO Content Dashboard

🚀 Interfaz web para el sistema de generación de contenido SEO automatizado.

## Demo

Visita: `https://TU-USUARIO.github.io/seo-dashboard/`

## Credenciales

- **Usuario**: `admin`
- **Contraseña**: `seodashboard2026`

## Funcionalidades

- ✨ **Generación de contenido** - Ingresa una keyword y genera artículos SEO
- 🌍 **Multilenguaje** - Español (ES, MX, AR, CO) e Inglés (US, UK, CA, AU)
- ⏰ **Programación** - Ejecutar ahora o programar para después
- 📊 **Métricas** - Dashboard con estadísticas
- 📜 **Historial** - Últimas generaciones

## Stack

- HTML5 / CSS3 / Vanilla JavaScript
- Dark theme con glassmorphism
- Responsive design
- n8n webhooks para backend

## Despliegue en GitHub Pages

1. Crea un repositorio en GitHub (ej: `seo-dashboard`)
2. Sube estos archivos
3. Ve a Settings > Pages
4. Selecciona "Deploy from a branch" > `main` > `/ (root)`
5. ¡Listo! Tu dashboard estará en `https://tu-usuario.github.io/seo-dashboard/`

## Configuración

Edita `app.js` para cambiar:

```javascript
const CONFIG = {
    API_BASE: 'https://tu-n8n.com/webhook',
    AUTH: {
        username: 'admin',
        passwordHash: '...'
    }
};
```

## Licencia

MIT
