# 🎵 Audio Downloader - Multi-Platform Support

Una aplicación web para extraer audio de videos de múltiples plataformas sociales y sitios de streaming.

## 🚀 Plataformas Soportadas

Esta aplicación utiliza **yt-dlp**, lo que le permite descargar audio de más de 1000 plataformas, incluyendo:

### 🎬 Principales Plataformas
- **YouTube** - Videos, Shorts, Music
- **Instagram** - Posts, Reels
- **TikTok** - Videos públicos
- **Facebook** - Videos públicos, Reels
- **Twitter/X** - Videos en tweets
- **Reddit** - Videos en posts
- **Vimeo** - Videos públicos
- **Twitch** - Clips y VODs
- **SoundCloud** - Tracks y sets

### 🌐 Y muchas más...
yt-dlp soporta cientos de extractores adicionales. Si una plataforma tiene video público, probablemente funcione.

## 🛠️ Características

- ✅ **Detección automática de plataforma** - Identifica automáticamente la fuente del video
- ✅ **Mensajes de error específicos** - Ayuda a resolver problemas por plataforma
- ✅ **Metadata personalizable** - Agrega título y artista a los archivos
- ✅ **Historial de descargas** - Registro de las últimas 10 descargas
- ✅ **Información de archivo** - Muestra duración y bitrate
- ✅ **Interfaz responsive** - Funciona en móviles y escritorio
- ✅ **Formato M4A** - Alta calidad de audio

## 📦 Instalación con Docker

1. Construir la imagen:
```bash
docker build -t audio-downloader .
```

2. Ejecutar el contenedor:
```bash
docker run -p 3000:3000 audio-downloader
```

3. Abrir en el navegador:
```
http://localhost:3000
```

## 🖥️ Instalación Local

1. Instalar dependencias:
```bash
npm install
```

2. Instalar yt-dlp y ffmpeg:
```bash
# En macOS con Homebrew
brew install yt-dlp ffmpeg

# En Ubuntu/Debian
sudo apt update
sudo apt install yt-dlp ffmpeg
```

3. Iniciar el servidor:
```bash
npm start
```

4. Abrir en el navegador:
```
http://localhost:3000
```

## 🎯 Cómo Usar

1. Pega la URL del video en el campo correspondiente
2. La aplicación detectará automáticamente la plataforma
3. Opcional: Agrega título y artista para el metadata
4. Haz clic en "Descargar Audio"
5. El archivo M4A se descargará automáticamente

## 🔧 Configuración

### Variables de Entorno
- `PORT` - Puerto del servidor (default: 3000)

### Formatos Soportados
- **Audio**: M4A (AAC)
- **Calidad**: Mejor audio disponible
- **Metadata**: Título, artista

## 🐛 Solución de Problemas

### Errores Comunes por Plataforma

**Instagram:**
- Asegúrate que el post sea público
- Las historias privadas no funcionan
- Usa la URL directa del post

**TikTok:**
- Solo videos públicos funcionan
- Verifica que la URL sea correcta
- Algunos videos pueden tener restricciones geográficas

**YouTube:**
- Videos privados no funcionan
- Videos con restricción de edad pueden fallar
- Videos eliminados no están disponibles

**Facebook:**
- Solo videos públicos
- Algunos videos requieren login
- Verifica que la URL sea correcta

### Problemas Técnicos

**"Error descargando"**
- Verifica tu conexión a internet
- Confirma que la URL sea correcta
- El video debe ser público

**"Error al procesar el archivo"**
- Espacio insuficiente en disco
- Problemas con ffmpeg
- Reinicia la aplicación

## 📝 Logs

La aplicación muestra logs en la consola con:
- Detección de plataforma
- Estado de descarga
- Errores específicos
- Éxito de las operaciones

## 🔒 Privacidad

- No se almacenan URLs
- No se guardan archivos
- Las descargas son temporales
- No se recopilan datos personales

## 📄 Licencia

Este proyecto es para uso educacional y personal. Respeta los términos de servicio de cada plataforma.

## 🤝 Contribuir

Las mejoras son bienvenidas:
- Reportar bugs
- Sugerir nuevas plataformas
- Mejorar la documentación

---

**Nota:** Esta herramienta debe usarse respetando los derechos de autor y los términos de servicio de cada plataforma.
