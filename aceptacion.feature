# language: es
Característica: Compra en SauceDemo
  Como cliente de la tienda
  Quiero iniciar sesión y comprar un producto
  Para completar mi pedido

  Escenario: Compra completa con un usuario válido
    Dado que estoy en la página de inicio de sesión de SauceDemo
    Cuando inicio sesión con el usuario "standard_user" y la contraseña "secret_sauce"
    Y agrego el producto "Sauce Labs Backpack" al carrito
    Y finalizo la compra con nombre "Nataly", apellido "Garcia" y código postal "050001"
    Entonces veo el mensaje de confirmación "Thank you for your order!"

  Escenario: Un usuario bloqueado no puede ingresar
    Dado que estoy en la página de inicio de sesión de SauceDemo
    Cuando inicio sesión con el usuario "locked_out_user" y la contraseña "secret_sauce"
    Entonces veo el mensaje de error "Epic sadface: Sorry, this user has been locked out."
    
  Escenario: Contraseña incorrecta
    Dado que estoy en la página de inicio de sesión de SauceDemo
    Cuando inicio sesión con el usuario "standard_user" y la contraseña "clave_mala"
    Entonces veo el mensaje de error "Epic sadface: Username and password do not match any user in this service"

  Escenario: No se puede finalizar la compra sin el nombre
    Dado que estoy en la página de inicio de sesión de SauceDemo
    Cuando inicio sesión con el usuario "standard_user" y la contraseña "secret_sauce"
    Y agrego el producto "Sauce Labs Backpack" al carrito
    Y finalizo la compra con nombre "", apellido "Garcia" y código postal "050001"
    Entonces veo el mensaje de error "Error: First Name is required"