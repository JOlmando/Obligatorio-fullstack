# Aplicación de Gimnasio

Aplicación backend para la gestión de usuarios, accesos y reservas de un gimnasio, desarrollada como parte del Obligatorio 1 de la materia **Desarrollo Full Stack integrado con IA**.

El proyecto se plantea sobre una aplicación de gimnasio de alcance reducido, tomando como referencia algunas funcionalidades habituales de este tipo de aplicaciones y adaptándolas a los requerimientos establecidos en la consigna.

## Objetivo

La aplicación permitirá a los usuarios:

* Registrarse e iniciar sesión.
* Utilizar un plan **Plus** o **Premium**.
* Registrar visitas al gimnasio.
* Reservar actividades.
* Consultar sus visitas con filtros y paginación.
* Cancelar o modificar reservas cuando corresponda.
* Generar rutinas mediante una integración con inteligencia artificial.

Además, existirá un usuario administrador encargado de la gestión de categorías.

## La API deberá cumplir con los requerimientos de backend indicados en la letra del obligatorio, incluyendo autenticación, rutas protegidas, validaciones, paginación, integración con IA y un endpoint que utilice un recurso externo.

## Dominio

El modelo inicial estará compuesto por tres entidades principales:

```text
Usuario
Categoría
Visita
```

### Usuario

Representa a la persona que utiliza la aplicación.

```text
Usuario
├── _id
├── username
├── password
├── tipoUsuario
└── plan
```

Tipos de usuario:

```text
USUARIO
ADMIN
```

Planes:

```text
PLUS
PREMIUM
```

Los usuarios registrados comienzan en el plan Plus y pueden pasar al plan Premium. La aplicación también contará con usuarios administradores precargados en la base de datos.

---

### Categoría

Representa el tipo de actividad del gimnasio.

Categorías iniciales:

```text
Sala de musculación
Funcional
Calistenia
Crossfit
```

La entidad tendrá:

```text
Categoría
├── _id
├── nombre
└── horarios
```

Los horarios estarán definidos dentro de la propia categoría.

Ejemplos:

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
horarios: "09:00-10:00;19:00-20:00"
```

```text
Crossfit
horarios: "10:00-11:00;20:00-21:00"
```

Las actividades se desarrollan todos los días.

La categoría servirá para clasificar las visitas, cumpliendo con el requisito de la consigna de contar con una entidad de categorías asociada a la colección principal. También deberá contemplarse la restricción de no eliminar una categoría que tenga documentos asociados.

---

### Visita

Representa tanto un acceso a la sala de musculación como una reserva para una actividad.

```text
Visita
├── _id
├── usuarioId
├── categoriaId
├── fecha
└── hora
```

#### Sala de musculación

La sala no requiere una reserva previa.

El usuario realiza un check-in en el momento de ingresar y se registra la fecha y hora actual.

Ejemplo:

```text
Categoría: Sala de musculación
Fecha: 23/09/2026
Hora: 18:43
```

#### Funcional, Calistenia y Crossfit

Estas actividades se reservan seleccionando una fecha y uno de los horarios definidos para la categoría.

La reserva deberá realizarse con al menos **12 horas de anticipación** respecto al inicio de la actividad.

Ejemplo:

```text
Categoría: Funcional
Fecha: 25/09/2026
Hora: 18:00
```

No se manejarán cupos máximos para las actividades.

---

## Reglas de negocio

### Plan Plus

Los usuarios Plus podrán realizar un máximo de **4 visitas por semana**.

Todas las visitas cuentan para el límite:

```text
Sala de musculación
Funcional
Calistenia
Crossfit
```

Ejemplo:

```text
1 → Sala de musculación
2 → Funcional
3 → Crossfit
4 → Sala de musculación
```

Una quinta visita durante la misma semana será rechazada.

### Plan Premium

Los usuarios Premium podrán realizar una cantidad ilimitada de visitas, de acuerdo con el requerimiento de la consigna.

---

## Reservas y cancelaciones

Las actividades con horario funcionan mediante reservas.

Una reserva deberá:

1. Corresponder a una categoría existente.
2. Utilizar uno de los horarios definidos para dicha categoría.
3. Tener una fecha válida.
4. Realizarse con una anticipación mínima de 12 horas.
5. Respetar el límite semanal del usuario cuando corresponda.

Las reservas podrán darse de baja mientras falten más de 12 horas para el inicio de la actividad.

La sala de musculación no necesita una reserva previa, ya que el registro se realiza mediante check-in en el momento.

No existe una restricción de cantidad de reservas simultáneas para un usuario. Los horarios de las distintas actividades estarán definidos de forma que no se solapen.

---

## API

La API será versionada utilizando `/api/v1`.

La colección principal será `Visita`, y deberá contar con:

```text
POST    /api/v1/visitas
GET     /api/v1/visitas
GET     /api/v1/visitas/:id
PUT     /api/v1/visitas/:id
DELETE  /api/v1/visitas/:id
```

La consulta de visitas deberá soportar filtros y paginación, según los requisitos del obligatorio.

También se contemplarán endpoints para usuarios, autenticación y categorías.

---

## Inteligencia Artificial

La aplicación contará con una integración de IA generativa orientada a la **generación de rutinas de entrenamiento**.

La idea es que el usuario indique los músculos o grupos musculares que desea trabajar y el backend utilice un servicio de IA para generar una rutina relacionada.

Ejemplo conceptual:

```text
Usuario
   ↓
Selecciona músculos
   ↓
Endpoint de nuestra API
   ↓
Servicio de IA
   ↓
Rutina generada
```

La integración será realizada desde un endpoint del backend y no como un chat independiente, siguiendo el requerimiento de la consigna. Además, la indisponibilidad del servicio de IA no deberá impedir el funcionamiento general de la aplicación.
