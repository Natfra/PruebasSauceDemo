const { Given, When, Then, Before, After, setDefaultTimeout } = require('@cucumber/cucumber');
const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const assert = require('assert');
const fs = require('fs');

setDefaultTimeout(60 * 1000);

// Espera a que el elemento exista en la página y lo devuelve
async function esperar(driver, localizador) {
  return driver.wait(until.elementLocated(localizador), 15000);
}

Before(async function () {
  const opciones = new chrome.Options();
  // Evita las ventanas de Chrome sobre contraseñas y el autocompletar
  opciones.addArguments('--disable-notifications', '--disable-save-password-bubble');
  opciones.setUserPreferences({
    credentials_enable_service: false,
    'profile.password_manager_enabled': false,
    'autofill.profile_enabled': false,
  });
  this.driver = await new Builder().forBrowser('chrome').setChromeOptions(opciones).build();
});

After(async function (scenario) {
  // Guarda un pantallazo de cada escenario como evidencia
  try {
    fs.mkdirSync('evidencia', { recursive: true });
    const imagen = await this.driver.takeScreenshot();
    const nombre = scenario.pickle.name.replace(/[^a-zA-Z0-9]+/g, '_');
    fs.writeFileSync(`evidencia/${nombre}.png`, imagen, 'base64');
  } catch (e) {
    console.log('No se pudo tomar el pantallazo:', e.message);
  }
  try {
    await this.driver.quit();
  } catch (e) {}
});

Given('que estoy en la página de inicio de sesión de SauceDemo', async function () {
  await this.driver.get('https://www.saucedemo.com');
});

When('inicio sesión con el usuario {string} y la contraseña {string}', async function (usuario, clave) {
  await (await esperar(this.driver, By.id('user-name'))).sendKeys(usuario);
  await this.driver.findElement(By.id('password')).sendKeys(clave);
  await this.driver.findElement(By.id('login-button')).click();
});

When('agrego el producto {string} al carrito', async function (producto) {
  const id = 'add-to-cart-' + producto.toLowerCase().replace(/ /g, '-');
  await (await esperar(this.driver, By.id(id))).click();
  await this.driver.findElement(By.className('shopping_cart_link')).click();
});

When('finalizo la compra con nombre {string}, apellido {string} y código postal {string}', async function (nombre, apellido, postal) {
  await (await esperar(this.driver, By.id('checkout'))).click();
  const campoNombre = await esperar(this.driver, By.id('first-name'));
  if (nombre) await campoNombre.sendKeys(nombre);
  if (apellido) await this.driver.findElement(By.id('last-name')).sendKeys(apellido);
  if (postal) await this.driver.findElement(By.id('postal-code')).sendKeys(postal);
    const continuar = await this.driver.findElement(By.id('continue'));
  await this.driver.executeScript('arguments[0].click();', continuar);

  try {
    // Espera a que aparezca el botón Finish o el mensaje de error
    await this.driver.wait(async () => {
      const hayError = (await this.driver.findElements(By.css('[data-test="error"]'))).length > 0;
      const hayFinish = (await this.driver.findElements(By.id('finish'))).length > 0;
      return hayError || hayFinish;
    }, 15000);
  } catch (e) {
    console.log('URL actual:', await this.driver.getCurrentUrl());
    const texto = await this.driver.findElement(By.css('body')).getText();
    console.log('Texto en pantalla:', texto.slice(0, 300));
    throw e;
  }

  const finalizar = await this.driver.findElements(By.id('finish'));
  if (finalizar.length > 0) await finalizar[0].click();
});

Then('veo el mensaje de confirmación {string}', async function (mensaje) {
  const el = await esperar(this.driver, By.className('complete-header'));
  assert.strictEqual(await el.getText(), mensaje);
});

Then('veo el mensaje de error {string}', async function (mensaje) {
  const el = await esperar(this.driver, By.css('[data-test="error"]'));
  assert.strictEqual(await el.getText(), mensaje);
});