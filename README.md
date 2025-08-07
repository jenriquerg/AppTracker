# GhAdvanced

Este proyecto fue generado utilizando Angular CLI versión 19.2.15.

## Clonar e Instalar

git clone https://github.com/jenriquerg/gh-advanced.git
cd gh-advanced

## Instalamos las dependencias con:

npm install

## Servidor de desarrollo

Para iniciar un servidor de desarrollo local, ejecuta:

ng serve

Una vez que el servidor esté corriendo, abre tu navegador y navega a http://localhost:4200/. La aplicación se recargará automáticamente cada vez que modifiques cualquiera de los archivos fuente.

## Generación de código (Scaffolding)

Angular CLI incluye potentes herramientas de scaffolding. Para generar un nuevo componente, ejecuta:

ng generate component nombre-del-componente

Para ver una lista completa de los esquemas disponibles (como components, directives o pipes), ejecuta:

ng generate --help

## Compilación

Para compilar el proyecto, ejecuta:

ng build

Esto compilará tu proyecto y almacenará los artefactos de compilación en el directorio dist/. Por defecto, la compilación para producción optimiza tu aplicación para rendimiento y velocidad.

## Recursos adicionales

Para más información sobre el uso de Angular CLI, incluyendo referencias detalladas de comandos, visita la página Angular CLI Overview and Command Reference.

## Estructura

src/
 └── app/
      ├── pages/
      │    └── auth/
      │         ├── login/
      │         │    ├── login.component.ts
      │         │    ├── login.component.html
      │         │    └── login.component.scss
      │         └── register/
      │         │    ├── register.component.ts
      │         │    ├── register.component.html
      │         │    └── register.component.scss
      │         └──control/
      │            └── llenar-control/
      │         │        ├── llenar-control.component.ts
      │         │        ├── llenar-control.component.html
      │         │        ├── llenar-control.component.scss
      │         └──enfermero/
      │            └── citas-enfermero/
      │         │        ├── citas-enfermero.component.ts
      │         │        ├── citas-enfermero.component.html
      │         │        └── citas-enfermero.component.scss
      │         └──expediente/
      │            └── expediente/
      │         │        ├── expediente.component.ts
      │         │        ├── expediente.component.html
      │         │        └── expediente.component.scss
      │         └──paciente/
      │            └── citas-paciente/
      │         │        ├── citas-paciente.component.ts
      │         │        ├── citas-paciente.component.html
      │         │        └── citas-paciente.component.scss
      ├── app.module.ts
      └── app.component.ts


