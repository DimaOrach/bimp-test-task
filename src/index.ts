import 'reflect-metadata'; // Цей рядок має бути першим
import Fastify from 'fastify';
import dotenv from 'dotenv';
import { AppDataSource } from './ormconfig';


dotenv.config();

const server = Fastify();

AppDataSource.initialize()
  .then(() => {
    console.log('Data Source has been initialized!');
  })
  .catch((err) => {
    console.error('Error during Data Source initialization', err);
  });

const port = Number(process.env.PORT) || 3000;

server.listen({ port }, (err, address) => {
  if (err) {
    server.log.error(err);
    process.exit(1);
  }
  console.log(`Server running at ${address}`);
});
