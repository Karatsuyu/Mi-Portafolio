# 🚀 Multi-Style Portfolio - Next.js 13+

Un portafolio profesional con **4 temas completamente diferentes** construido con Next.js 13+ App Router, TypeScript, Tailwind CSS, Framer Motion, Three.js y Supabase.

## 🎨 Temas Disponibles

### 🌌 Space Theme (`/space`)
- Estética futurista espacial con efectos 3D
- Fondo de estrellas animado con Three.js
- Colores púrpura/azul con efectos de partículas
- Animaciones cósmicas y elementos flotantes

### 📊 Classic Theme (`/classic`) 
- Diseño minimalista y profesional
- Colores neutros con acentos azules
- Enfoque en legibilidad y profesionalismo
- Animaciones sutiles y elegantes

### 🏰 Runic Theme (`/runic`)
- Estética medieval/místico con runas doradas
- Paleta de colores ámbar/dorado/marrón
- Tipografías estilo pergamino antiguo
- Efectos de resplandor y sombras místicas

### 🎮 Gamer Theme (`/gamer`)
- Diseño cyberpunk con RGB y neón
- Colores cyan/rosa/púrpura vibrantes
- Tipografías monoespaciadas futuristas
- Animaciones RGB y efectos glitch

## 🛠️ Tecnologías Utilizadas

### Frontend Core
- **Next.js 13.5.6** - Framework con App Router
- **React 18** - Biblioteca de UI
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Framework de estilos

### Animaciones & 3D
- **Framer Motion** - Animaciones fluidas
- **Three.js** - Gráficos 3D
- **React Three Fiber** - Three.js para React
- **React Three Drei** - Utilidades 3D adicionales

### Backend & Database
- **Supabase** - Base de datos PostgreSQL
- **API Routes** - Endpoints de Next.js
- **TypeScript Types** - Tipado completo

### Utilidades
- **React Icons** - Biblioteca de iconos
- **Google Fonts** - Tipografías personalizadas
- **PostCSS** - Procesamiento de CSS

## 📁 Estructura del Proyecto

```
├── app/
│   ├── layout.tsx              # Layout global minimalista
│   ├── page.tsx                # Selector de temas
│   ├── space/                  # Tema espacial
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── styles/globals.css
│   ├── classic/                # Tema clásico
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── styles/globals.css
│   ├── runic/                  # Tema rúnico
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── styles/globals.css
│   ├── gamer/                  # Tema gamer
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── styles/globals.css
│   └── api/                    # API Routes
│       ├── contact/route.ts
│       └── projects/route.ts
├── components/
│   ├── global/                 # Componentes reutilizables
│   │   ├── ContactForm.tsx
│   │   ├── ProjectCard.tsx
│   │   └── SkillCard.tsx
│   ├── main/                   # Componentes del tema Space
│   └── sub/                    # Subcomponentes específicos
├── utils/
│   ├── supabase.ts            # Cliente de Supabase
│   └── motion.ts              # Utilidades de animación
├── constants/
│   └── index.ts               # Constantes del proyecto
└── public/                    # Assets estáticos
```

## 🚀 Configuración e Instalación

### 1. Clonar e Instalar
```bash
git clone <your-repo>
cd space-portfolio-main
npm install
```

### 2. Configurar Supabase

1. Crea un proyecto en [Supabase](https://supabase.com)
2. Copia `.env.example` a `.env.local`
3. Añade tus credenciales de Supabase:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Crear Tablas en Supabase

Ejecuta estas consultas SQL en tu dashboard de Supabase:

```sql
-- Tabla de mensajes de contacto
CREATE TABLE messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de proyectos
CREATE TABLE projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT,
  github_url TEXT,
  live_url TEXT,
  technologies TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de habilidades
CREATE TABLE skills (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  level INTEGER NOT NULL CHECK (level >= 0 AND level <= 100),
  icon_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 4. Ejecutar el Proyecto

```bash
# Desarrollo
npm run dev

# Producción
npm run build
npm start
```

## 🎯 Características Principales

### ✅ Multi-Tema
- 4 diseños completamente únicos
- Navegación fluida entre temas
- Componentes reutilizables adaptables

### ✅ Backend Integrado
- API Routes de Next.js 13+
- Base de datos Supabase PostgreSQL
- Formulario de contacto funcional
- CRUD completo para proyectos

### ✅ Responsive Design
- Diseño adaptativo para todos los dispositivos
- Optimizado para móviles y desktop
- Animaciones responsivas

### ✅ Performance Optimizado
- Next.js 13+ App Router
- Lazy loading automático
- Imágenes optimizadas
- SEO friendly

### ✅ Animaciones Avanzadas
- Framer Motion para transiciones
- Three.js para efectos 3D
- Animaciones específicas por tema
- Efectos de scroll interactivos

## 🔧 API Endpoints

### Contacto
- `POST /api/contact` - Enviar mensaje
- `GET /api/contact` - Obtener mensajes

### Proyectos
- `GET /api/projects` - Listar proyectos
- `POST /api/projects` - Crear proyecto

## 🎨 Personalización

### Añadir Nuevo Tema
1. Crear carpeta `app/nuevo-tema/`
2. Crear `layout.tsx` y `page.tsx`
3. Crear `styles/globals.css` específico
4. Actualizar selector de temas en `app/page.tsx`

### Modificar Estilos
- Cada tema tiene su archivo CSS independiente
- Usar variables CSS para colores principales
- Componentes globales se adaptan automáticamente

## 📱 Rutas Disponibles

- `/` - Selector de temas
- `/space` - Tema espacial (original)
- `/classic` - Tema clásico profesional  
- `/runic` - Tema medieval místico
- `/gamer` - Tema cyberpunk gamer

## 🤝 Contribuir

1. Fork del proyecto
2. Crear rama feature (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

## 📧 Contacto

- **GitHub**: [Tu GitHub]
- **LinkedIn**: [Tu LinkedIn]
- **Email**: [Tu Email]

---

**¡Hecho con ❤️ usando Next.js, TypeScript, Tailwind CSS, y mucha creatividad!**