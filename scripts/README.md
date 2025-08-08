# 🧪 Admin Test Data Scripts

Este directorio contiene scripts para automatizar la creación y gestión de datos de prueba para el panel de administración de INFINITO.

## 📋 Scripts Disponibles

### 1. `seed-admin-test-data.ts` - Datos principales de prueba
**Descripción**: Crea contribuciones y productos de prueba con diferentes estados y características.

**Características**:
- ✅ 8 contribuciones con diferentes estados (pendiente, entregado, verificado, certificado)
- ✅ 3 productos asociados (publicados y vendidos)
- ✅ Diferentes tipos de contribuciones (clothing, art, recycle, receive)
- ✅ Diferentes clasificaciones (reutilizable, reparable, reciclable)
- ✅ Diferentes decisiones (donar, vender)

**Uso**:
```bash
npx tsx scripts/seed-admin-test-data.ts
```

### 2. `seed-specific-scenarios.ts` - Escenarios específicos
**Descripción**: Crea escenarios de prueba específicos para diferentes workflows del admin.

**Escenarios incluidos**:
- 🎯 **Bulk Operations**: 3 contribuciones pendientes para testing de operaciones masivas
- 🏷️ **Classifications**: 3 contribuciones con diferentes clasificaciones
- 🎨 **Types**: 3 contribuciones de diferentes tipos (art, recycle, receive)
- 💭 **Decisions**: 2 contribuciones con diferentes decisiones (donar, vender)
- ⚠️ **Edge Cases**: 3 contribuciones con casos edge (0 items, muchos items, datos incompletos)

**Uso**:
```bash
# Crear escenarios específicos
npx tsx scripts/seed-specific-scenarios.ts

# Limpiar solo escenarios específicos
npx tsx scripts/seed-specific-scenarios.ts --clean
```

### 3. `verify-admin-data.ts` - Verificación de datos
**Descripción**: Verifica que todos los datos de prueba se han creado correctamente.

**Funcionalidades**:
- 📊 Estadísticas por estado, tipo, clasificación y decisión
- ✅ Verificación de contribuciones certificadas
- ⏳ Listado de contribuciones pendientes
- 🔗 Productos asociados
- 🎯 Escenarios específicos
- 🔍 Verificación de integridad de datos

**Uso**:
```bash
# Verificación básica
npx tsx scripts/verify-admin-data.ts

# Verificación con detalles específicos
npx tsx scripts/verify-admin-data.ts --details
```

### 4. `cleanup-test-data.ts` - Limpieza de datos
**Descripción**: Elimina datos de prueba de forma segura.

**Opciones**:
- `--show`: Mostrar datos existentes sin eliminar
- `--scenarios`: Eliminar solo datos de escenarios específicos
- `--main`: Eliminar solo datos principales
- `--all`: Eliminar todos los datos de prueba
- `--dry-run`: Mostrar qué se eliminaría sin hacerlo

**Uso**:
```bash
# Mostrar datos existentes
npx tsx scripts/cleanup-test-data.ts --show

# Dry run - ver qué se eliminaría
npx tsx scripts/cleanup-test-data.ts --all --dry-run

# Eliminar todos los datos de prueba
npx tsx scripts/cleanup-test-data.ts --all

# Eliminar solo escenarios específicos
npx tsx scripts/cleanup-test-data.ts --scenarios
```

## 🎯 Escenarios de Testing Disponibles

### Contribuciones por Estado
- **Pendiente**: 13 contribuciones para testing de procesamiento inicial
- **Entregado**: 5 contribuciones para testing de verificación
- **Verificado**: 8 contribuciones para testing de clasificación
- **Certificado**: 7 contribuciones para testing de certificación

### Contribuciones por Tipo
- **Clothing**: 29 contribuciones (tipo principal)
- **Art**: 3 contribuciones para proyectos artísticos
- **Recycle**: 3 contribuciones para reciclaje
- **Receive**: 2 contribuciones para recepción

### Contribuciones por Clasificación
- **Reutilizable**: 13 contribuciones para marketplace
- **Reparable**: 4 contribuciones para artistas
- **Reciclable**: 5 contribuciones para reciclaje

### Contribuciones por Decisión
- **Donar**: 11 contribuciones para donación
- **Vender**: 5 contribuciones para marketplace

### Productos por Estado
- **Published**: 9 productos disponibles para venta
- **Sold**: 1 producto vendido

## 🔧 Workflows de Testing del Admin

### 1. Bulk Operations Testing
```bash
# Usar contribuciones BULK-001, BULK-002, BULK-003
# - Seleccionar múltiples contribuciones
# - Aplicar operaciones masivas
# - Verificar cambios en lote
```

### 2. Classification Workflow
```bash
# Usar contribuciones CLASS-001, CLASS-002, CLASS-003
# - Procesar contribuciones entregadas
# - Aplicar diferentes clasificaciones
# - Verificar destinos correctos
```

### 3. Type Filtering
```bash
# Usar contribuciones TYPE-ART-001, TYPE-RECYCLE-001, TYPE-RECEIVE-001
# - Filtrar por diferentes tipos
# - Verificar procesamiento específico por tipo
# - Testear workflows especializados
```

### 4. Decision Testing
```bash
# Usar contribuciones DECISION-SELL-001, DECISION-DONATE-001
# - Testear flujo de venta vs donación
# - Verificar certificación apropiada
# - Crear productos para contribuciones de venta
```

### 5. Edge Cases
```bash
# Usar contribuciones EDGE-001, EDGE-002, EDGE-003
# - Manejar contribuciones con 0 items
# - Procesar contribuciones con muchos items
# - Gestionar datos incompletos
```

## 📊 Estadísticas Finales

Después de ejecutar todos los scripts:

- **Total de Contribuciones**: 37
- **Total de Productos**: 10
- **Contribuciones Verificadas**: 15
- **Contribuciones Certificadas**: 7
- **Productos Publicados**: 9
- **Productos Vendidos**: 1

## 🚀 Comandos Rápidos

### Setup completo
```bash
# 1. Crear datos principales
npx tsx scripts/seed-admin-test-data.ts

# 2. Crear escenarios específicos
npx tsx scripts/seed-specific-scenarios.ts

# 3. Verificar todo
npx tsx scripts/verify-admin-data.ts --details
```

### Limpieza completa
```bash
# Ver qué se eliminaría
npx tsx scripts/cleanup-test-data.ts --all --dry-run

# Eliminar todo
npx tsx scripts/cleanup-test-data.ts --all
```

### Reset rápido
```bash
# Limpiar y recrear
npx tsx scripts/cleanup-test-data.ts --all
npx tsx scripts/seed-admin-test-data.ts
npx tsx scripts/seed-specific-scenarios.ts
```

## 🎯 Próximos Pasos

1. **Visitar el panel admin**: `/admin/contributions`
2. **Probar filtros**: Por estado, tipo, clasificación, decisión
3. **Testear operaciones masivas**: Seleccionar múltiples contribuciones
4. **Verificar workflows**: Desde pendiente hasta certificado
5. **Crear productos**: Desde contribuciones certificadas
6. **Testear edge cases**: Manejar casos especiales

## ⚠️ Notas Importantes

- Los scripts preservan los datos originales (INF_1001, INF_1002, etc.)
- Los datos de prueba tienen tracking codes específicos para fácil identificación
- El script de limpieza incluye confirmación y dry-run para seguridad
- Todos los scripts son idempotentes (se pueden ejecutar múltiples veces)

## 🔍 Troubleshooting

### Error de base de datos
```bash
# Verificar conexión
npx prisma db push

# Resetear base de datos
npx prisma migrate reset
```

### Error de permisos
```bash
# Verificar que el servidor no esté corriendo
pkill -f "next"
```

### Datos inconsistentes
```bash
# Limpiar y recrear
npx tsx scripts/cleanup-test-data.ts --all
npx tsx scripts/seed-admin-test-data.ts
npx tsx scripts/seed-specific-scenarios.ts
``` 