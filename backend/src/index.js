require('module-alias/register');
require('colors');

const config = require('@config');
const path = require('path');
const fastifyStatic = require('@fastify/static');
const cors = require('@fastify/cors');
const cookie = require('@fastify/cookie');
const autoload = require('@fastify/autoload');
const formbody = require('@fastify/formbody');
const app = require('fastify')({ logger: true });

app.register(fastifyStatic, {
	root: path.join(__dirname, '../../frontend/dist'),
	prefix: '/'
});

app.register(cors, {
	origin: true,
	credentials: true
});

app.register(formbody);

app.register(cookie, {
	secret: config.secret_key,
	hook: 'onRequest',
	parseOptions: {}
})

app.register(autoload, {
	dir: path.join(__dirname, 'routes'),
	routeParams: true,
	maxDepth: 20
});

app.setNotFoundHandler((_, reply) => reply.status(404).send());

app.ready(err => {
	if (err) throw err;

	console.log('Сервер запущен на порте: ', 8080);
});

async function bootstrap() {
	try {
		await app.listen({ port: 8080 });
	} catch (e) {
		app.log.error(e);
	}
}

bootstrap();