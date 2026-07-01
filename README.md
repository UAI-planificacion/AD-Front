# 📺 Plataforma de Gestión de Publicidades (UAI)

> Plataforma web moderna e interactiva para la programación, distribución y administración de contenidos publicitarios en pantallas verticales en los campus de la Universidad Adolfo Ibáñez.

---

## ✨ Características Principales

### 📊 Dashboard Operativo (KPIs Dinámicos)
* **Control en una sola fila**: 4 indicadores dinámicos clave:
  * **Total de Publicidades**: Métrica general con desglose de anuncios activos e inactivos.
  * **Publicidades Activas**: Porcentaje de cobertura y anuncios actualmente en circulación.
  * **Por Vencer**: Monitoreo de anuncios que expiran en las próximas 72 horas con mensajes personalizados ("Hoy caducan X publicidades").
  * **Programadas**: Conteo de anuncios listos para publicarse automáticamente en fechas futuras.

### 📅 Programación y Segmentación Avanzada
* **Rango de Fechas exacto**: Selección de vigencia de inicio y fin en el calendario.
* **Horarios diarios flexibles**: Horario de proyección diaria detallado por minutos (ej. `08:00` a `20:00`).
* **Asignación de Sedes y Edificios**: Segmentación y distribución modular por campus:
  * **Peñalolén** (Edificios 1 al 6)
  * **Errázuriz** (Edificio 7)
  * **Vitacura** (Edificio 8)
  * **Viña del Mar** (Edificios 9 al 14)

### ⚙️ Lógica Inteligente de Estado
* **Switch Reactivo**: Control manual del estado activo del anuncio con restricciones de tiempo.
* **Auto-Desactivación**: Los anuncios cuya fecha final expira se apagan e inhabilitan automáticamente.
* **Auto-Activación**: Si un anuncio expirado es reprogramado para el futuro, el Switch se activa automáticamente de forma inteligente.
* **Confirmación por Fechas**: Advertencia emergente mediante `ConfirmDialog` al intentar guardar anuncios inactivos cuyas fechas no han sido actualizadas.

### 🌐 Filtros Bidireccionales con Persistencia en URL
* Todos los filtros y parámetros del listado (`mode`, `q`, `status`, `tipo`, `edificios`, etc.) se sincronizan en tiempo real con la query de la URL para permitir una navegación fluida, guardando el estado al refrescar la página.

### 🔒 Acceso Seguro
* Integración nativa con cuentas institucionales a través de Microsoft Social Auth.

---

## 🛠️ Stack Tecnológico

* **Framework**: [Next.js 16](https://nextjs.org/) (App Router & React Server Components)
* **Estilos**: Tailwind CSS v4 & Lucide Icons
* **Estado y Consultas**: React Query (TanStack Query)
* **Formularios e Integraciones**: React Hook Form & Zod para validación de esquemas
* **Librerías de Fechas**: date-fns
* **Gestor de Paquetes**: `pnpm`

---

## 🚀 Inicio Rápido

### Requisitos Previos

Asegúrate de tener instalado [Node.js](https://nodejs.org/) y el gestor de paquetes `pnpm`.

### Instalación de Dependencias

```bash
pnpm install
```

### Ejecutar en Desarrollo

```bash
pnpm dev
```

El servidor estará disponible en [http://localhost:3000](http://localhost:3000).

### Compilar para Producción

```bash
pnpm build
pnpm start
```
