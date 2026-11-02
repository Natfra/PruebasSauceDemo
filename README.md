# Pruebas Automatizadas SauceDemo

Pruebas de aceptación automatizadas para [SauceDemo](https://www.saucedemo.com), escritas en Gherkin (Cucumber) y ejecutadas con Jest.

## Escenarios cubiertos

- Compra completa con un usuario válido
- Usuario bloqueado no puede ingresar
- Contraseña incorrecta
- No se puede finalizar la compra sin el nombre

## Estructura del proyecto

- `aceptacion.feature`: escenarios escritos en Gherkin
- `pasos.js`: definición de los pasos
- `saucedemo.test.js`: ejecución de las pruebas
- `evidencia/`: capturas de pantalla de los resultados

## Requisitos

- [Node.js](https://nodejs.org) instalado

## Cómo ejecutar las pruebas

```bash
npm install
npm test
```

## Autora

Natfra
