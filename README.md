# Aplicación de Gimnasio

Backend de una aplicación para la gestión de usuarios, accesos, reservas de actividades y funcionalidades de entrenamiento y nutrición.

Proyecto desarrollado como parte del **Obligatorio 1 de la materia Desarrollo Full Stack integrado con IA**.

## Objetivo

La aplicación busca centralizar algunas funcionalidades básicas de un gimnasio, permitiendo a los usuarios gestionar sus visitas y reservas, acceder a rutinas generadas mediante inteligencia artificial y consultar información nutricional.

El proyecto se mantiene con un alcance reducido, priorizando la implementación de los requerimientos del obligatorio y evitando funcionalidades adicionales que no sean necesarias.

## Funcionalidades principales

### Usuarios

* Registro de usuarios.
* Login.
* Autenticación mediante JWT.
* Dos tipos de usuario: `CLIENTE` y `ADMIN`.
* Dos planes: `PLUS` y `PREMIUM`.
* Los usuarios registrados comienzan en el plan `PLUS`.
* Cambio de `PLUS` a `PREMIUM`.
* Los administradores pueden gestionar las categorías.

### Visitas y reservas

La entidad principal de la aplicación es `Visita`.

Las visitas pueden representar dos situaciones diferentes:

#### Sala de musculación

No requiere reserva previa.

El usuario realiza un check-in en el momento de ingresar y el sistema registra automáticamente la fecha y hora actuales.

#### Funcional, Calistenia y Crossfit

Funcionan mediante reserva previa.

El usuario selecciona una fecha y uno de los horarios disponibles definidos para la categoría.

Las reservas deben realizarse con al menos **12 horas de anticipación**.

Las actividades no poseen límite de cupos y sus horarios están definidos para evitar solapamientos.

## Reglas de negocio

### Plan Plus

Los usuarios con plan `PLUS` pueden realizar un máximo de **4 visitas por semana**, considerando la semana de lunes a domingo.

Todas las visitas cuentan para el límite:

* Sala de musculación
* Funcional
* Calistenia
* Crossfit

Una quinta visita dentro de la misma semana será rechazada.

### Plan Premium

Los usuarios con plan `PREMIUM` pueden realizar una cantidad ilimitada de visitas.

### Modificación de reservas

Las reservas de actividades pueden modificarse siempre que se cumplan las reglas correspondientes y haya al menos 12 horas de anticipación.

No se permite cambiar una visita de `Sala de musculación` a una actividad ni de una actividad a `Sala de musculación`.

Las visitas de sala de musculación corresponden a un check-in realizado en el momento y no funcionan como reservas futuras.

### Baja de reservas

Una reserva de una actividad puede cancelarse mientras falten más de 12 horas para el inicio de la actividad.

---

## Categorías

Las categorías representan los tipos de actividades disponibles en el gimnasio.

Categorías iniciales:

```text
Sala de musculación
Funcional
Calistenia
Crossfit
```

La entidad `Categoria` contiene:

```text
Categoria
├── nombre
├── horarios
└── enUso
```

Los horarios se almacenan dentro de la categoría.

Ejemplo:

```text
Sala de musculación
horarios: "07:00-23:00"
```

```text
Funcional
horarios: "08:00-09:00;18:00-19:00"
```

```text
Calistenia
horarios: "10:00-11:15;21:45-23:00"
```

```text
Crossfit
horarios: "10:00-11:00;20:00-21:00"
```

Las actividades se encuentran disponibles todos los días.

El campo `enUso` indica si existen visitas asociadas a la categoría.

Una categoría que tenga visitas asociadas no podrá eliminarse.

La gestión de categorías está destinada a los usuarios administradores.

---

## Modelos

El modelo de dominio está compuesto por:

```text
Usuario
Categoria
Visita
Rutina
```

### Usuario

```text
Usuario
├── username
├── password
├── tipoUsuario
└── plan
```

### Categoria

```text
Categoria
├── nombre
├── horarios
└── enUso
```

### Visita

```text
Visita
├── usuarioId
├── categoriaId
├── fecha
└── hora
```

Las referencias `usuarioId` y `categoriaId` corresponden a documentos de `Usuario` y `Categoria`.

### Rutina

Las rutinas generadas mediante IA quedan asociadas al usuario que las solicita.

```text
Rutina
├── usuarioId
├── musculos
└── ejercicios
```

---

# Inteligencia Artificial

La aplicación integra inteligencia artificial generativa para la creación de rutinas de entrenamiento.

El usuario indica los músculos o grupos musculares que desea trabajar y el backend realiza la consulta al servicio de IA.

Flujo:

```text
Usuario
   ↓
Selecciona músculos
   ↓
POST /api/v1/rutinas
   ↓
Backend
   ↓
Servicio de IA
   ↓
Rutina generada
   ↓
Se guarda asociada al usuario
```

La integración se realiza desde un endpoint específico de la aplicación y no mediante un chat genérico.

Además, la indisponibilidad del servicio de IA se maneja mediante errores controlados para que no afecte al funcionamiento del resto de la aplicación.

---

# Funcionalidades nutricionales

La aplicación incorpora dos funcionalidades relacionadas con nutrición mediante servicios externos.

## Consulta de alimentos

Se utiliza una API externa de información nutricional para consultar productos alimenticios.

El endpoint propio recibe el momento del día:

```text
desayuno
almuerzo
merienda
cena
```

Ejemplo:

```text
GET /api/v1/nutricion?comida=desayuno
```

El backend consulta el servicio externo y devuelve información de los productos encontrados, incluyendo:

* Nombre.
* Ingredientes.
* Valores nutricionales.
* Nutri-Score.

La respuesta se filtra para trabajar con productos que tengan clasificación nutricional `A` o `B`.

Flujo:

```text
Usuario
   ↓
Selecciona comida
   ↓
Endpoint de nuestra API
   ↓
Servicio de nutrición externo
   ↓
Productos
   ↓
Información nutricional
```

## Calculadora nutricional

También se integra un servicio externo para calcular información relacionada con el gasto energético diario.

El backend recibe datos como:

```text
sexo
edad
peso
altura
actividad
objetivo
```

y obtiene información como:

```text
metabolismo basal
gasto diario
nivel de actividad
calorías objetivo
macronutrientes
```

Esta funcionalidad utiliza un servicio externo de cálculo de TDEE.

---

# API REST

La API utiliza versionado:

```text
/api/v1
```

## Visitas

```text
POST   /api/v1/visitas
GET    /api/v1/visitas
GET    /api/v1/visitas/fechas
PUT    /api/v1/visitas/:id
DELETE /api/v1/visitas/:id
```

Las consultas de visitas soportan filtros y paginación.

## Categorías

```text
GET    /api/v1/categorias
POST   /api/v1/categorias
PATCH  /api/v1/categorias/:id
DELETE /api/v1/categorias/:id
```

Las operaciones de creación, modificación y eliminación están restringidas a administradores.

## Rutinas

```text
POST   /api/v1/rutinas/crear
```

Genera una rutina utilizando inteligencia artificial y la asocia al usuario autenticado.

## Nutrición

```text
GET    /api/v1/nutricion?comida=desayuno
GET    /api/v1/nutricion?comida=almuerzo
GET    /api/v1/nutricion?comida=merienda
GET    /api/v1/nutricion?comida=cena
```

## Cálculo calorico

Endpoint destinado al cálculo del gasto energético y calorías objetivo mediante un servicio externo.

```text
POST    /api/v1/calorias
```

# Autenticación y autorización

Las rutas protegidas utilizan autenticación mediante JWT.

El usuario autenticado se identifica mediante el token y el backend utiliza esa identidad para asociar las visitas y rutinas correspondientes.

Las operaciones administrativas cuentan además con un middleware de autorización que verifica que el usuario tenga tipo:

```text
ADMIN
```

---

# Validaciones

Se utiliza **Joi** para validar los datos recibidos por la API.

Se validan:

* Body.
* Query parameters.
* Route parameters.

Las validaciones controlan formatos, campos obligatorios y valores permitidos antes de ejecutar la lógica de negocio.

Las reglas de negocio, como el límite semanal de visitas y la anticipación mínima de 12 horas, son manejadas dentro de los servicios correspondientes.

---

# Tecnologías

El backend utiliza:

* Node.js
* Express
* MongoDB
* Mongoose
* JWT
* Joi
* Bcrypt JS
* Axios
* Groq SDK
* Cloudinary
* Multer
* Dotenv
* CORS

También se utiliza Nodemon durante el desarrollo.

---

# Variables de entorno

Las credenciales y configuraciones sensibles se manejan mediante variables de entorno.

Ejemplo de `.env.example`:

```env
MONGO_URI=
JWT_SECRET=
GROQ_API_KEY=
```

El archivo `.env` no debe subirse al repositorio.

---

# Instalación

Clonar el repositorio y ubicarse en la carpeta del proyecto.

Instalar las dependencias:

```bash
npm install
```

Crear el archivo `.env` a partir de `.env.example` y completar las variables necesarias.

Para ejecutar el proyecto en desarrollo:

```bash
npm run dev
```

Para ejecutar el proyecto normalmente:

```bash
npm start
```

---

# Estructura general

La aplicación sigue una separación por responsabilidades:

```text
v1/
├── controllers/
├── config/
├── utils/
├── services/
├── models/
├── routes/
├── validators/
└── middlewares/
```

Los `controllers` reciben las solicitudes HTTP y delegan la lógica a los `services`.

Los `services` contienen la lógica de negocio y la comunicación con MongoDB y servicios externos.

Los `models` definen los esquemas de MongoDB mediante Mongoose.

Los `validators` contienen las validaciones realizadas con Joi.

Los `middlewares` manejan autenticación, autorización y validaciones.

---

# Requisitos del obligatorio

La aplicación contempla los requerimientos principales del Obligatorio 1:

* Registro de usuarios.
* Login.
* Rutas protegidas.
* Cambio de plan Plus a Premium.
* CRUD de la colección principal `Visita`.
* Filtros y paginación.
* CRUD de categorías.
* Restricción de eliminación de categorías en uso.
* Integración con inteligencia artificial generativa.
* Integración con un recurso externo pertinente al dominio.
* Validaciones.
* Autenticación y autorización.
* Uso de las tecnologías indicadas en la consigna.
