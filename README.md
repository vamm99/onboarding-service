<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Paso a paso para correr el proyecto

### 1) Requisitos previos
- Node.js (versión LTS recomendada)
- pnpm
- MongoDB
- Redis

### 2) Variables de entorno
Crea un archivo `.env` en la raíz con estas variables requeridas:

```env
PORT=3001
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_jwt_refresh_secret
MONGO_URI=mongodb://localhost:27017/onboarding
REDIS_HOST=localhost
REDIS_PORT=6379
ENCRYPTION_KEY=your_encryption_key
THROTTLE_TTL=60
THROTTLE_LIMIT=10
```

#### Generación de claves seguras
Para generar valores seguros para `ENCRYPTION_KEY`, `JWT_SECRET` y `JWT_REFRESH_SECRET`, usa el siguiente comando:

```bash
openssl rand -base64 32
```

Ejecuta este comando 3 veces para obtener 3 valores diferentes y asígnalos a cada variable.

##### Instalación de OpenSSL
Si no tienes OpenSSL instalado en tu sistema:

**Windows:**
- Descarga e instala desde [https://slproweb.com/products/Win32OpenSSL.html](https://slproweb.com/products/Win32OpenSSL.html)
- O usa Chocolatey: `choco install openssl`
- O usa Scoop: `scoop install openssl`

**macOS:**
- Ya viene instalado por defecto
- O si quieres una versión actualizada: `brew install openssl`

**Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install openssl
```

**Linux (CentOS/RHEL):**
```bash
sudo yum install openssl
```

### 3) Instalar dependencias

```bash
pnpm install
```

### 4) Levantar servicios externos
- MongoDB debe estar corriendo y accesible por `MONGO_URI`.
- Redis debe estar corriendo y accesible por `REDIS_HOST` y `REDIS_PORT`.

Si quieres levantar MongoDB/Redis (y las UIs opcionales) con Docker:

```bash
docker compose up -d
```

Servicios disponibles:
- MongoDB: `localhost:27017` (user: `admin`, pass: `admin123`)
- Redis: `localhost:6379` (pass: `redis123`)
- Mongo Express (opcional): `http://localhost:8081`
- Redis Commander (opcional): `http://localhost:8082`

### 5) Ejecutar en desarrollo

```bash
pnpm run start:dev
```

El servidor quedará disponible en `http://localhost:${PORT}`.

## 📚 Documentación de la API (Swagger)

La API cuenta con documentación interactiva mediante Swagger UI, accesible en:

```
http://localhost:${PORT}/api
```

### 🔐 Seguridad y Encriptación

**Importante:** Esta API utiliza encriptación AES para datos sensibles. Los endpoints marcados con `@UseInterceptors(CryptoInterceptor)` requieren cuerpos de solicitud encriptados.

#### Proceso de Encriptación:

1. **Crear objeto DTO** con los campos requeridos
2. **Convertir a JSON string** el DTO
3. **Encriptar con AES** el JSON string
4. **Enviar datos encriptados** en el formato: `{ "encryptedData": "string_encriptado_aqui" }`

#### Ejemplo de Flujo:

```javascript
// 1. DTO original
const loginData = {
  username: "john_doe",
  password: "SecurePass123"
};

// 2. Convertir a JSON
const jsonString = JSON.stringify(loginData);
// Result: '{"username":"john_doe","password":"SecurePass123"}'

// 3. Encriptar con AES
const encrypted = aesEncrypt(jsonString, encryptionKey);
// Result: "U2FsdGVkX1/tI5pOUvLDpOul86G6RU3GqjxWA/Li4rqe..."

// 4. Enviar request
fetch('/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    encryptedData: encrypted
  })
});
```

### 📋 Schemas Disponibles

La documentación incluye los siguientes schemas para referencia:

#### Autenticación
- **LoginDto** - Credenciales de acceso
- **RegisterDto** - Registro de nuevos usuarios

#### Onboarding  
- **RegisterOnboardingDto** - Proceso de onboarding de clientes

#### Productos
- **RegisterProductDto** - Registro de nuevos productos
- **UpdateProductDto** - Actualización de productos existentes

#### Formatos de Encriptación
- **EncryptedRequestDto** - Formato para requests encriptados
- **EncryptedResponseDto** - Formato para respuestas encriptadas

### 🔍 Endpoints Documentados

Todos los endpoints cuentan con documentación detallada incluyendo:
- Parámetros requeridos y opcionales
- Ejemplos de requests y responses
- Códigos de estado HTTP esperados
- Requisitos de autenticación
- Formatos de datos encriptados cuando aplica

Visita la documentación interactiva para explorar todos los endpoints disponibles.

## Project setup

```bash
$ pnpm install
```

## Compile and run the project

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

## Run tests

```bash
# unit tests
$ pnpm run test
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ pnpm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
