"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bootstrap = bootstrap;
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
async function bootstrap(port) {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, {
        logger: process.env.NODE_ENV === 'development'
            ? ['log', 'error', 'warn', 'debug']
            : ['error', 'warn'],
    });
    app.enableCors({
        origin: ['http://localhost:5173', 'http://localhost:3000', 'app://'],
        credentials: true,
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    const listenPort = port || parseInt(process.env.PORT || '3000', 10);
    await app.listen(listenPort);
    console.log(`NestJS server running on http://localhost:${listenPort}`);
    return app;
}
if (require.main === module) {
    bootstrap();
}
//# sourceMappingURL=main.js.map