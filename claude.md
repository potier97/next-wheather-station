# IoT Dashboard - Documentación del Proyecto

## 📋 Descripción General
Dashboard de monitoreo IoT para sensores ambientales en tiempo real. Permite visualizar datos de temperatura, humedad, iluminación y ubicación GPS de múltiples estaciones de sensores conectadas a Firebase.

## 🛠 Stack Tecnológico
- **Framework**: Next.js 14.0.4
- **Lenguaje**: TypeScript
- **Estilos**: Tailwind CSS 3.3.0
- **Base de Datos**: Firebase Realtime Database
- **Iconos**: FontAwesome
- **Analytics**: Vercel Analytics

## 📁 Estructura del Proyecto
```
wheather-station/
├── src/
│   └── app/
│       ├── components/
│       │   ├── Card.tsx          # Componente de tarjetas de sensores
│       │   └── Sidebar.tsx       # Navegación lateral responsive
│       ├── utils/
│       │   └── config.ts         # Configuración de Firebase
│       ├── globals.css           # Estilos globales y animaciones
│       ├── layout.tsx            # Layout principal con metadatos
│       └── page.tsx              # Página principal del dashboard
├── public/                       # Archivos estáticos
├── tailwind.config.ts           # Configuración de Tailwind
├── next.config.js               # Configuración de Next.js
└── package.json                 # Dependencias del proyecto
```

## 🎨 Características de Diseño

### Tema Visual
- **Paleta**: Modo oscuro con gradientes azul/púrpura/verde
- **Estilo**: Futurista con efectos glassmorphism
- **Animaciones**: Suaves y optimizadas para performance
- **Responsive**: Mobile-first design

### Componentes Principales

#### 1. Sidebar (Navegación Lateral)
- **Desktop**: Sidebar fijo de 320px de ancho
- **Mobile**: Menú hamburguesa con overlay
- **Características**:
  - Lista de nodos IoT con estados visuales
  - Selección activa con indicador lateral
  - Contador de nodos totales
  - Efectos hover sin scroll horizontal

#### 2. Cards (Tarjetas de Sensores)
- **Altura fija**: 192px (móvil) / 208px (desktop)
- **Grid responsive**: 1→2→4 columnas según pantalla
- **Características**:
  - Indicadores de estado (verde/rojo) según disponibilidad de datos
  - Formateo especial para coordenadas GPS
  - Efectos hover con escalado y brillos
  - Manejo de valores N/A

## 📊 Estructura de Datos

### Interfaz de Nodo
```typescript
interface NodeSelectedInterface {
  dateTime: string;      // Timestamp de última actualización
  hum: number;          // Humedad relativa (%)
  light: number;        // Nivel de iluminación (lux)
  temp: number;         // Temperatura (°C)
  location: {
    lat: number;        // Latitud GPS
    lng: number;        // Longitud GPS
  };
}
```

### Variables Monitoreadas
1. **Temperatura**: °C con indicador azul
2. **Humedad**: % con indicador verde
3. **Iluminación**: lux con indicador amarillo
4. **Ubicación**: Coordenadas GPS con indicador rojo

## 🔧 Configuraciones Importantes

### Firebase Realtime Database
```typescript
// Estructura esperada en Firebase:
{
  "nodes": {
    "node1": {
      "dateTime": "2024-01-01 12:00:00",
      "temp": 18.7,
      "hum": 76.9,
      "light": 2.5,
      "location": {
        "lat": 4.594699,
        "lng": -74.123279
      }
    }
  }
}
```

### Variables de Entorno Requeridas
```env
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=
NEXT_PUBLIC_FIREBASE_DATABASE_URL=
```

### Tailwind Personalizado
- **Animaciones custom**: spin-slow, float, glow, slide-in-left
- **Breakpoint adicional**: xs (475px)
- **Utilidades personalizadas**: line-clamp, touch-manipulation

## 📱 Responsive Design

### Breakpoints
- **Mobile**: < 640px (1 columna)
- **Tablet**: 640px - 1024px (2 columnas)
- **Desktop**: 1024px - 1280px (2 columnas)
- **Large**: > 1280px (4 columnas)

### Optimizaciones Móviles
- Sidebar collapsible con hamburger menu
- Touch-friendly button sizes (44px mínimo)
- Viewport optimizado con `100svh`
- Animaciones reducidas para mejor performance
- Scrollbars customizados

## 🎯 Funcionalidades Implementadas

### Manejo de Datos
- **Suscripción en tiempo real** a Firebase
- **Manejo de datos faltantes**: Muestra "N/A" y indicador rojo
- **Formateo inteligente**: Coordenadas en dos líneas, valores normales en una
- **Validación de datos**: Verificación de null/undefined

### Interacciones
- **Selección de nodos**: Click para cambiar entre sensores
- **Feedback visual**: Estados hover y active
- **Navegación móvil**: Auto-cierre del menú al seleccionar
- **Animaciones suaves**: Transiciones de 300ms

### Estados Visuales
- **Indicadores de datos**: Verde (válido) / Rojo (N/A)
- **Selección activa**: Highlight azul con barra lateral
- **Última actualización**: Timestamp en header
- **Loading states**: Spinner animado cuando no hay selección

## 🔄 Flujo de la Aplicación

1. **Inicialización**: Conexión a Firebase y suscripción a cambios
2. **Carga de nodos**: Lista de sensores disponibles en sidebar
3. **Selección**: Usuario elige un nodo específico
4. **Visualización**: Datos del nodo en tarjetas organizadas
5. **Actualización**: Datos se actualizan automáticamente en tiempo real

## ⚡ Optimizaciones de Performance

### CSS y Animaciones
- **Hardware acceleration**: `transform3d` para animaciones suaves
- **Reduced motion**: Animaciones más lentas en móvil
- **Efficient selectors**: Uso de Tailwind para CSS optimizado

### JavaScript
- **Memoización**: useEffect con dependencias específicas
- **Event handling**: Debounce en interacciones móviles
- **Bundle optimization**: Next.js con tree shaking automático

## 🐛 Problemas Solucionados

### 1. Scroll Horizontal en Sidebar
- **Problema**: `hover:scale-105` causaba expansión y scroll
- **Solución**: Reemplazado por efectos de sombra y gradientes

### 2. Cards de Tamaños Inconsistentes
- **Problema**: Coordenadas largas expandían las cards
- **Solución**: Altura fija y formateo especial para GPS

### 3. Valores y Unidades Separados
- **Problema**: Unidades aparecían en línea separada
- **Solución**: Layout condicional para mantener valor+unidad juntos

### 4. Responsive Issues
- **Problema**: Experiencia pobre en móviles
- **Solución**: Sidebar collapsible y grid responsive

## 🚀 Mejores Prácticas Implementadas

### Código
- **TypeScript**: Tipado fuerte para interfaces y props
- **Component isolation**: Componentes reutilizables y mantenibles
- **Consistent naming**: Convenciones claras para variables y funciones

### Diseño
- **Mobile-first**: Diseño pensado primero para móviles
- **Accessibility**: Touch targets de 44px mínimo
- **Performance**: Animaciones optimizadas para 60fps

### Arquitectura
- **Separation of concerns**: Lógica separada por responsabilidades
- **Configuration management**: Centralizada en archivos de config
- **Error handling**: Manejo gracioso de datos faltantes

## 📈 Métricas de Calidad

### Performance
- **Core Web Vitals**: Optimizado para LCP, FID, CLS
- **Bundle size**: Minimizado con tree shaking
- **Loading speed**: Lazy loading y code splitting

### UX
- **Responsive**: Funciona perfectamente en todos los dispositivos
- **Intuitive**: Navegación clara y feedback visual
- **Reliable**: Manejo robusto de errores y estados de carga

## 🔮 Posibles Mejoras Futuras

### Funcionalidades
- [ ] Gráficos históricos de datos
- [ ] Alertas y notificaciones
- [ ] Exportación de datos
- [ ] Configuración de umbrales
- [ ] Múltiple selección de nodos

### Técnicas
- [ ] PWA capabilities
- [ ] Offline mode con Service Workers
- [ ] Real-time charts con Chart.js
- [ ] Dark/Light theme toggle
- [ ] Internationalization (i18n)

## 📝 Notas para Desarrollo

### Comandos Útiles
```bash
npm run dev          # Desarrollo local
npm run build        # Build de producción
npm run start        # Servidor de producción
npm run lint         # Linting del código
```

### Debugging
- Firebase Console para verificar estructura de datos
- Browser DevTools para responsive testing
- React DevTools para component debugging

### Deployment
- Vercel deployment automático desde Git
- Variables de entorno configuradas en Vercel Dashboard
- Analytics habilitado para métricas de uso

---

**Última actualización**: Enero 2024
**Versión**: 1.0.0
**Mantenido por**: IoT Dashboard Team 