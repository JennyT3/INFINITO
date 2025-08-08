# 🌱 Scripts de Seed y Gestión de Datos - INFINITO

Este documento describe todos los scripts disponibles para crear datos de prueba y gestionar la base de datos del panel de administración de INFINITO.

## 📋 Scripts Disponibles

### 🚀 **Scripts de Seed Principales**

#### 1. **Seed Completo de Admin**
```bash
npm run seed:admin:scenarios
```
**Descripción**: Crea un conjunto completo de datos de prueba para el flujo admin.

**Escenarios Creados**:
- **Contribuciones Pendientes** (20) - Sin procesar
- **Contribuciones Entregadas** (15) - Listas para verificación
- **Contribuciones Verificadas** (25) - Listas para clasificación
- **Contribuciones Certificadas** (10) - Con certificados blockchain
- **Contribuciones Marketplace** (18) - Con productos asociados
- **Contribuciones Donación** (12) - Para donación
- **Contribuciones Artistas** (8) - Para proyectos artísticos
- **Contribuciones Reciclaje** (10) - Para reciclaje
- **Mix de Estados** (30) - Diferentes combinaciones
- **Variaciones de Método** (15) - Diferentes métodos de entrega

**Productos Creados**:
- **Productos Publicados** (25) - En marketplace
- **Productos Vendidos** (12) - Vendidos
- **Productos Borrador** (8) - En borrador
- **Productos Inactivos** (5) - Inactivos
- **Productos Independientes** (10) - Sin contribución asociada

#### 2. **Seed de Escenarios de Testing**
```bash
npm run seed:testing:scenarios
```
**Descripción**: Crea datos específicos para testing de edge cases y funcionalidades.

**Escenarios de Testing**:
- **Todos los Estados** (12) - Cada estado posible
- **Todas las Clasificaciones** (9) - Cada clasificación
- **Todos los Destinos** (8) - Cada destino
- **Todos los Métodos** (6) - Cada método
- **Todos los Tipos** (8) - Cada tipo
- **Todas las Decisiones** (4) - Cada decisión
- **Certificados Blockchain** (5) - Con certificados
- **Alto Impacto Ambiental** (3) - Impacto alto
- **Muchos Items** (2) - Para testing de performance
- **Datos Especiales** (4) - Con caracteres especiales

**Productos de Testing**:
- **Todos los Estados** (8) - Cada estado de producto
- **Todos los Tipos** (12) - Cada tipo de prenda
- **Todos los Materiales** (12) - Cada material
- **Todos los Colores** (16) - Cada color
- **Todos los Tamaños** (12) - Cada tamaño
- **Todas las Condiciones** (8) - Cada condición
- **Todos los Países** (12) - Cada país
- **Precios Extremos** (4) - Precios muy bajos/altos
- **Fotos Múltiples** (3) - Con 3 fotos
- **Datos de IA** (5) - Con datos de detección IA

### 🔧 **Scripts de Gestión de Datos**

#### 3. **Gestor de Datos Admin**
```bash
npm run admin:data [comando]
```

**Comandos Disponibles**:

**Limpiar Datos**:
```bash
npm run admin:data clean:all      # Limpiar todos los datos de prueba
npm run admin:data clean:test     # Limpiar solo datos de testing
```

**Verificar Integridad**:
```bash
npm run admin:data verify         # Verificar integridad de datos
```

**Estadísticas**:
```bash
npm run admin:data stats          # Mostrar estadísticas detalladas
```

**Ayuda**:
```bash
npm run admin:data help           # Mostrar ayuda
```

### 🧪 **Scripts de Testing**

#### 4. **Test de Notificaciones**
```bash
npm run test:notifications
```
**Descripción**: Demuestra todas las notificaciones del sistema.

**Notificaciones Testeadas**:
- Producto publicado
- Producto vendido
- Contribución procesada
- Contribución verificada
- Certificado generado
- Acción masiva completada
- Exportación completada
- Error ocurrido

## 📊 **Características de los Datos Generados**

### **Contribuciones**
- **Tracking Único**: Prefijos específicos por escenario
- **Estados Reales**: pendiente, entregado, verificado, certificado_disponible
- **Clasificaciones**: reutilizable, reparable, reciclable
- **Destinos**: marketplace, donacion, artistas, reciclaje
- **Decisiones**: donar, vender
- **Métodos**: pickup, home
- **Impacto Ambiental**: Cálculo real basado en peso
- **Certificados Blockchain**: Hashes únicos
- **Datos Realistas**: Emails, nombres, detalles

### **Productos**
- **Estados**: published, sold, draft, inactive
- **Tipos de Prenda**: shirt, pants, dress, jacket, shoes, accessories
- **Materiales**: cotton, polyester, denim, silk, wool, linen
- **Colores**: blue, red, green, black, white, yellow, purple, orange
- **Tamaños**: XS, S, M, L, XL, XXL
- **Condiciones**: excellent, good, fair, poor
- **Países**: Portugal, Spain, Italy, France, Germany, UK
- **Precios**: Rango realista con comisiones
- **Fotos**: URLs de Picsum para imágenes realistas
- **Datos de IA**: Detección de material y condición

## 🎯 **Casos de Uso**

### **Testing del Flujo Admin**
1. **Procesamiento de Contribuciones**:
   ```bash
   npm run seed:admin:scenarios
   # Luego visitar /admin/contributions
   # Probar procesamiento de contribuciones pendientes
   ```

2. **Clasificación y Destino**:
   ```bash
   npm run seed:admin:scenarios
   # Probar clasificación de contribuciones verificadas
   # Asignar diferentes destinos
   ```

3. **Generación de Certificados**:
   ```bash
   npm run seed:admin:scenarios
   # Probar generación de certificados blockchain
   ```

4. **Gestión de Productos**:
   ```bash
   npm run seed:admin:scenarios
   # Visitar /admin/products
   # Probar diferentes estados de productos
   ```

### **Testing de Filtros y Búsqueda**
1. **Filtros Avanzados**:
   ```bash
   npm run seed:testing:scenarios
   # Probar todos los filtros con datos específicos
   ```

2. **Búsqueda con Caracteres Especiales**:
   ```bash
   npm run seed:testing:scenarios
   # Buscar contribuciones con caracteres especiales
   ```

3. **Acciones Masivas**:
   ```bash
   npm run seed:admin:scenarios
   # Probar acciones masivas con diferentes tipos de datos
   ```

### **Testing de Performance**
1. **Muchos Items**:
   ```bash
   npm run seed:testing:scenarios
   # Probar con contribuciones de muchos items
   ```

2. **Datos Extremos**:
   ```bash
   npm run seed:testing:scenarios
   # Probar con precios extremos y datos especiales
   ```

## 🔍 **Verificación y Limpieza**

### **Verificar Integridad**
```bash
npm run admin:data verify
```
**Verifica**:
- Contribuciones sin productos asociados
- Productos sin contribuciones asociadas
- Certificados con estado incorrecto
- Relaciones entre tablas

### **Limpiar Datos**
```bash
# Limpiar solo datos de testing
npm run admin:data clean:test

# Limpiar todos los datos de prueba
npm run admin:data clean:all
```

### **Ver Estadísticas**
```bash
npm run admin:data stats
```
**Muestra**:
- Estadísticas generales
- Distribución por estado
- Distribución por tipo
- Distribución por clasificación
- Estadísticas de precios
- Estadísticas de certificados

## 📝 **Workflow Recomendado**

### **Para Desarrollo**
1. **Crear datos básicos**:
   ```bash
   npm run seed:admin:scenarios
   ```

2. **Probar funcionalidades**:
   - Visitar paneles admin
   - Probar filtros y búsqueda
   - Probar acciones masivas

3. **Limpiar cuando sea necesario**:
   ```bash
   npm run admin:data clean:all
   ```

### **Para Testing**
1. **Crear datos específicos**:
   ```bash
   npm run seed:testing:scenarios
   ```

2. **Probar edge cases**:
   - Caracteres especiales
   - Precios extremos
   - Estados específicos

3. **Verificar integridad**:
   ```bash
   npm run admin:data verify
   ```

### **Para Demostración**
1. **Crear datos completos**:
   ```bash
   npm run seed:admin:scenarios
   npm run seed:testing:scenarios
   ```

2. **Mostrar estadísticas**:
   ```bash
   npm run admin:data stats
   ```

3. **Demostrar funcionalidades**:
   - Filtros avanzados
   - Acciones masivas
   - Sistema de notificaciones

## 🚨 **Consideraciones Importantes**

### **Antes de Usar**
- ✅ Asegurar que la base de datos esté configurada
- ✅ Ejecutar `npm run db:push` si es necesario
- ✅ Verificar que Prisma esté actualizado

### **Durante el Uso**
- ⚠️ Los scripts pueden tomar tiempo con muchos datos
- ⚠️ Algunos datos pueden ser grandes (fotos, etc.)
- ⚠️ Verificar espacio en disco disponible

### **Después del Uso**
- 🧹 Limpiar datos cuando no se necesiten
- 📊 Verificar integridad después de operaciones
- 💾 Hacer backup si es necesario

## 🔧 **Personalización**

### **Modificar Configuración**
Los scripts están diseñados para ser fácilmente personalizables:

1. **Cambiar Cantidades**: Modificar `count` en los escenarios
2. **Agregar Tipos**: Extender arrays de tipos, materiales, etc.
3. **Modificar Datos**: Cambiar generadores de datos
4. **Agregar Escenarios**: Crear nuevos escenarios específicos

### **Ejemplo de Personalización**
```typescript
// En scripts/seed-admin-scenarios.ts
const ADMIN_SCENARIOS = {
  mi_escenario: {
    name: 'Mi Escenario',
    description: 'Descripción de mi escenario',
    count: 10,
    config: {
      // Configuración específica
    }
  }
};
```

## 📞 **Soporte**

### **Problemas Comunes**
1. **Error de conexión a BD**: Verificar configuración de Prisma
2. **Datos no creados**: Verificar permisos de BD
3. **Scripts lentos**: Reducir cantidad de datos

### **Logs y Debugging**
- Los scripts muestran progreso detallado
- Usar `console.log` para debugging
- Verificar logs de Prisma para errores

---

**Nota**: Estos scripts están diseñados para desarrollo y testing. No usar en producción sin revisión cuidadosa. 