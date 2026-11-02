const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const assert = require('assert');
const fs = require('fs');

describe('SauceDemo - pruebas E2E', function () {
  this.timeout(40000);
  let driver;

  beforeEach(async () => {
    const options = new chrome.Options();
    options.addArguments('--incognito');
    options.setUserPreferences({
      credentials_enable_service: false,
      'profile.password_manager_enabled': false,
      'profile.password_manager_leak_detection': false,
    });
    driver = await new Builder().forBrowser('chrome').setChromeOptions(options).build();
  });

  afterEach(async function () {
    if (this.currentTest.state === 'failed') {
      console.log('URL al fallar:', await driver.getCurrentUrl());
      const foto = await driver.takeScreenshot();
      fs.writeFileSync('error-captura.png', foto, 'base64');
    }
    await driver.quit();
  });

  async function iniciarSesion(usuario, clave) {
    await driver.get('https://www.saucedemo.com');
    await driver.findElement(By.id('user-name')).sendKeys(usuario);
    await driver.findElement(By.id('password')).sendKeys(clave);
    await driver.findElement(By.id('login-button')).click();
  }

  it('compra exitosa: inicia sesión, agrega un producto y finaliza', async () => {
    await iniciarSesion('standard_user', 'secret_sauce');
    await driver.wait(until.urlContains('/inventory.html'), 10000);

    await driver.findElement(By.id('add-to-cart-sauce-labs-backpack')).click();
    await driver.findElement(By.css('.shopping_cart_link')).click();
    await driver.findElement(By.id('checkout')).click();

    await driver.findElement(By.id('first-name')).sendKeys('Laura');
    await driver.findElement(By.id('last-name')).sendKeys('Garcia');
    await driver.findElement(By.id('postal-code')).sendKeys('050001');
    await driver.findElement(By.id('continue')).click();
    await driver.findElement(By.id('finish')).click();

    const mensaje = await driver.wait(
      until.elementLocated(By.css('.complete-header')), 10000
    );
    assert.ok((await mensaje.getText()).includes('Thank you for your order'));
  });

  it('usuario bloqueado no puede ingresar', async () => {
    await iniciarSesion('locked_out_user', 'secret_sauce');
    const error = await driver.wait(
      until.elementLocated(By.css('.error-message-container')), 10000
    );
    assert.ok((await error.getText()).includes('locked out'));
  });
});