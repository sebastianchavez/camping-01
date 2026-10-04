# 🏕️ Camping Pinar — Sistema de Reservas

Template frontend completo para un sistema de reservas de camping. Construido con HTML, CSS, JavaScript nativo y Tailwind CSS (vía CDN).

## 🚀 Cómo abrirlo

1. Descarga o clona el repositorio.
2. Abre `index.html` directamente en cualquier navegador moderno (Chrome, Firefox, Edge, Safari).
3. No requiere servidor, build step ni dependencias de Node.

> 💡 Si quieres servirlo localmente con un servidor estático (recomendado para evitar restricciones de algunos navegadores):
> ```bash
> # Python 3
> python -m http.server 5500
> # Node.js
> npx serve .
> ```
> Luego abre `http://localhost:5500`.

## 🔑 Usuario demo

| Campo | Valor |
|-------|-------|
| Email | `demo@camping.com` |
| Contraseña | `123456` |

El usuario demo ya tiene 3 reservas precargadas en distintos estados (pagada, completada, pendiente).

## 📁 Estructura del proyecto

```
camping-01/
├── index.html                          # Pantalla de inicio
├── pages/
│   ├── reserva.html                    # Wizard de reserva (4 pasos)
│   ├── confirmacion-reserva.html       # Confirmación al crear reserva
│   ├── servicios.html                  # Catálogo de servicios
│   ├── contacto.html                   # Formulario + mapa + horarios
│   ├── login.html                      # Iniciar sesión
│   ├── registro.html                   # Crear cuenta
│   ├── recuperar-password.html         # Recuperar contraseña
│   ├── terminos.html                   # Términos y condiciones
│   ├── privacidad.html                 # Políticas de privacidad
│   ├── perfil.html                     # Mi perfil + historial de reservas
│   ├── detalle-reserva.html            # Detalle + anular
│   ├── pago.html                       # Procesar pago
│   └── confirmacion-pago.html          # Comprobante de pago
├── assets/
│   ├── css/styles.css                  # Animaciones y utilidades
│   ├── js/
│   │   ├── data.js                     # Servicios, seed, helpers de localStorage
│   │   ├── main.js                     # Layout, navbar, footer, toasts, modales
│   │   ├── auth.js                     # Login, registro, logout, recuperación
│   │   ├── reservations.js             # CRUD de reservas
│   │   └── payment.js                  # Procesar pagos simulados
│   └── img/
└── README.md
```

## ✨ Pantallas incluidas

- ✅ Inicio (landing con hero, servicios, testimonios y CTA)
- ✅ Wizard de reserva en 4 pasos (fechas → servicios → resumen → confirmar)
- ✅ Confirmación de reserva
- ✅ Catálogo de servicios
- ✅ Contacto (formulario + mapa + horarios)
- ✅ Login
- ✅ Registro
- ✅ Recuperar contraseña
- ✅ Términos y condiciones
- ✅ Políticas de privacidad
- ✅ Mi perfil (datos editables + historial con filtros)
- ✅ Detalle de reserva (con anular y desglose de precios)
- ✅ Pago (tarjeta, Yape, Plin, transferencia)
- ✅ Confirmación de pago (con comprobante imprimible)

## 🎨 Paleta de colores

- **Verde bosque** `#2d5016` — primario
- **Naranja fogata** `#ea580c` — acento / CTAs
- **Crema** `#fef3e2` — fondo suave
- **Tierra** `#78350f` — texto secundario

Tipografías: **Inter** (texto) + **Poppins** (títulos), desde Google Fonts.

## 🧪 Flujo de prueba recomendado

1. Abre `index.html` y revisa la landing.
2. Click en **Reservar** → completa los 4 pasos del wizard.
3. Regístrate o inicia sesión con `demo@camping.com / 123456`.
4. Confirma la reserva recién creada → verás tu código.
5. Ve a **Mi perfil** → verás el historial (reservas demo + la recién creada).
6. Entra al detalle de una reserva pendiente → presiona **Pagar**.
7. Elige método, completa datos y paga → recibirás comprobante.
8. Vuelve al perfil → el estado de la reserva cambió a **Pagada**.
9. Prueba también el botón **Anular reserva** en otra reserva.

## 🛠️ Detalles técnicos

- **Persistencia:** `localStorage` con claves `camping_*` (usuarios, reservas, sesión).
- **Seed inicial:** se ejecuta solo la primera vez.
- **Protección de rutas:** `requireAuth()` en páginas privadas (perfil, detalle, pago).
- **Modales y toasts:** nativos, sin librerías.
- **Responsive:** mobile-first, con menú hamburguesa.
- **Sin frameworks JS:** todo es vanilla.

## 🔄 Reset de datos

Si quieres volver al estado inicial, abre la consola del navegador y ejecuta:

```js
localStorage.clear(); location.reload();
```

Esto borrará usuarios, reservas y sesión.

## 📝 Licencia

Template de ejemplo. Úsalo libremente en tus proyectos personales o comerciales.