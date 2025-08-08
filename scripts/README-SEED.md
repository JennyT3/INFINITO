# 🌱 INFINITO Admin Seed Scripts

Este documento describe todos los scripts de seed disponibles para automatizar la creación de datos de prueba para el flujo admin de INFINITO.

## 📋 Scripts Disponibles

### 1. **Script Principal de Admin** (`seed-admin-complete.ts`)
Script completo para crear contribuciones y productos con datos realistas.

### 2. **Script Rápido** (`quick-seed.ts`)
Script simplificado con presets predefinidos para diferentes necesidades de testing.

### 3. **Script de Escenarios** (`seed-scenarios.ts`)
Script para crear escenarios específicos de testing con diferentes combinaciones de estados y tipos.

## 🚀 Comandos Rápidos

### Scripts de Admin General
```bash
# Script principal con ayuda
npm run seed:admin

# Presets predefinidos
npm run seed:admin:minimal      # 10 contribuciones, 5 productos
npm run seed:admin:standard     # 25 contribuciones, 15 productos
npm run seed:admin:full         # 50 contribuciones, 30 productos
npm run seed:admin:stress       # 100 contribuciones, 60 productos

# Utilidades
npm run seed:admin:clean        # Limpiar todos los datos de prueba
npm run seed:admin:stats        # Mostrar estadísticas de la base de datos
npm run seed:admin:verify       # Seed estándar con verificación de integridad
```

### Scripts de Escenarios Específicos
```bash
# Escenarios individuales
npm run seed:scenario:pending      # Contribuciones pendientes (15 items)
npm run seed:scenario:verified     # Contribuciones verificadas (20 items)
npm run seed:scenario:certified    # Contribuciones certificadas (10 items)
npm run seed:scenario:marketplace  # Contribuciones para marketplace (12 items)
npm run seed:scenario:donation     # Contribuciones para donación (8 items)
npm run seed:scenario:artists      # Contribuciones para artistas (6 items)
npm run seed:scenario:recycling    # Contribuciones para reciclaje (8 items)
npm run seed:scenario:mixed        # Mix de estados y tipos (25 items)

# Script de escenarios con ayuda
npm run seed:scenario
```

## 📊 Presets Disponibles

### Minimal (10 contribuciones, 5 productos)
- **Uso**: Testing básico, desarrollo rápido
- **Tiempo**: ~5 segundos
- **Casos de uso**: Verificar funcionalidad básica

### Standard (25 contribuciones, 15 productos)
- **Uso**: Testing regular, demostraciones
- **Tiempo**: ~10 segundos
- **Casos de uso**: Testing completo de funcionalidades

### Comprehensive (50 contribuciones, 30 productos)
- **Uso**: Testing completo, QA
- **Tiempo**: ~20 segundos
- **Casos de uso**: Testing exhaustivo de todas las funcionalidades

### Stress (100 contribuciones, 60 productos)
- **Uso**: Testing de rendimiento
- **Tiempo**: ~40 segundos
- **Casos de uso**: Verificar rendimiento con grandes volúmenes

## 🎯 Escenarios Específicos

### 1. **Pending Contributions**
- **Estado**: `pendiente`
- **Clasificación**: Sin clasificar
- **Uso**: Testing del flujo de procesamiento inicial

### 2. **Verified Contributions**
- **Estado**: `verificado`
- **Clasificación**: Variada
- **Uso**: Testing de clasificación y asignación de destino

### 3. **Certified Contributions**
- **Estado**: `certificado_disponible`
- **Certificados**: Con hash blockchain
- **Uso**: Testing de certificación y blockchain

### 4. **Marketplace Contributions**
- **Destino**: `marketplace`
- **Decisión**: `vender`
- **Productos**: Automáticamente creados
- **Uso**: Testing del flujo de marketplace

### 5. **Donation Contributions**
- **Destino**: `donacion`
- **Decisión**: `donar`
- **Uso**: Testing del flujo de donaciones

### 6. **Artist Contributions**
- **Destino**: `artistas`
- **Decisión**: `donar`
- **Uso**: Testing del flujo para artistas

### 7. **Recycling Contributions**
- **Destino**: `reciclaje`
- **Decisión**: `donar`
- **Uso**: Testing del flujo de reciclaje

### 8. **Mixed States and Types**
- **Estados**: Variados (pendiente, entregado, verificado, certificado)
- **Tipos**: Variados (clothing, art, recycle, receive)
- **Uso**: Testing de filtros y búsquedas complejas

## 🔧 Opciones Avanzadas

### Limpiar Datos Existentes
```bash
# Limpiar antes de crear nuevos datos
npm run seed:admin:standard --clean
npm run seed:scenario:marketplace --clean
```

### Verificar Integridad de Datos
```bash
# Crear datos y verificar integridad
npm run seed:admin:verify
```

### Solo Mostrar Estadísticas
```bash
# Ver estadísticas sin crear datos
npm run seed:admin:stats
```

## 📈 Datos Generados

### Contribuciones
- **Tracking codes**: Únicos y secuenciales
- **Tipos**: clothing, art, recycle, receive
- **Estados**: pendiente, entregado, verificado, certificado_disponible
- **Clasificaciones**: reutilizable, reparable, reciclable
- **Destinos**: marketplace, donacion, artistas, reciclaje
- **Decisiones**: donar, vender
- **Impacto ambiental**: Calculado automáticamente
- **Certificados**: Hash blockchain para contribuciones certificadas

### Productos
- **Nombres**: Generados automáticamente
- **Tipos**: shirt, pants, dress, jacket, shoes, accessories
- **Materiales**: cotton, polyester, denim, silk, wool, linen
- **Colores**: blue, red, green, black, white, yellow, purple, orange
- **Tamaños**: XS, S, M, L, XL, XXL
- **Estados**: published, sold, draft, inactive
- **Precios**: 10-60 euros
- **Fotos**: URLs de ejemplo
- **Impacto ambiental**: Calculado automáticamente

## 🎨 Características de los Datos

### Realismo
- **Emails**: Dominios realistas (gmail.com, hotmail.com, etc.)
- **Detalles**: Descripciones contextuales según tipo y clasificación
- **Fechas**: Distribuidas en los últimos 30 días
- **Precios**: Rango realista para ropa de segunda mano

### Variedad
- **Estados**: Distribución equilibrada
- **Tipos**: Rotación automática
- **Clasificaciones**: Según el estado de la contribución
- **Destinos**: Según la clasificación

### Integridad
- **Relaciones**: Productos solo para contribuciones del marketplace
- **Consistencia**: Estados coherentes con clasificaciones
- **Validación**: Verificación automática de integridad

## 🚀 Flujo de Trabajo Recomendado

### 1. **Desarrollo Inicial**
```bash
npm run seed:admin:minimal
```

### 2. **Testing de Funcionalidades**
```bash
npm run seed:admin:standard
```

### 3. **Testing de Escenarios Específicos**
```bash
npm run seed:scenario:pending
npm run seed:scenario:marketplace
npm run seed:scenario:certified
```

### 4. **Testing Completo**
```bash
npm run seed:admin:full --clean --verify
```

### 5. **Testing de Rendimiento**
```bash
npm run seed:admin:stress
```

## 🔍 Verificación de Datos

### Estadísticas Automáticas
Cada script muestra automáticamente:
- Total de contribuciones creadas
- Total de productos creados
- Distribución por estado
- Distribución por tipo
- Distribución por clasificación
- Distribución por estado de productos

### Verificación de Integridad
```bash
npm run seed:admin:verify
```
Verifica:
- Tracking codes únicos
- Certificados para contribuciones certificadas
- Clasificaciones para contribuciones procesadas
- Fotos requeridas para productos

## 🛠️ Personalización

### Modificar Configuración
Edita `scripts/seed-admin-complete.ts`:
```typescript
const CONFIG = {
  contributions: {
    total: 50, // Cambiar número de contribuciones
    // ... otras configuraciones
  },
  products: {
    total: 30, // Cambiar número de productos
    // ... otras configuraciones
  }
};
```

### Agregar Nuevos Escenarios
Edita `scripts/seed-scenarios.ts`:
```typescript
const SCENARIOS = {
  // ... escenarios existentes
  nuevoEscenario: {
    name: 'Nuevo Escenario',
    description: 'Descripción del escenario',
    count: 10,
    config: {
      // configuración específica
    }
  }
};
```

## 📝 Notas Importantes

### Base de Datos
- Los scripts requieren una base de datos configurada
- Ejecuta `npm run db:push` antes de usar los scripts
- Los scripts usan Prisma Client para las operaciones

### Dependencias
- `@prisma/client`: Para operaciones de base de datos
- `tsx`: Para ejecutar TypeScript directamente
- `calculateEnvironmentalImpact`: Función de utils para cálculos

### Seguridad
- Los scripts solo crean datos de prueba
- No afectan datos de producción
- Usa `--clean` con precaución

## 🎉 Próximos Pasos

Después de ejecutar cualquier script:

1. **Visitar paneles admin**:
   - `/admin/contributions` - Panel de contribuciones
   - `/admin/products` - Panel de productos

2. **Probar funcionalidades**:
   - Filtros y búsquedas
   - Acciones masivas
   - Operaciones individuales
   - Exportación de datos

3. **Verificar UX**:
   - Estados de carga
   - Mensajes de error/éxito
   - Accesibilidad
   - Responsividad

---

*Estos scripts están diseñados para facilitar el testing y desarrollo del flujo admin de INFINITO, proporcionando datos realistas y variados para todas las funcionalidades.* 