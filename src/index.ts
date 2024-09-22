import 'reflect-metadata'; // Цей рядок має бути першим
import Fastify from 'fastify';
import dotenv from 'dotenv';
import { AppDataSource } from './ormconfig';
import { userController } from './controllers/UserController';
import messageController from './controllers/MessageController';

dotenv.config();

const server = Fastify();

AppDataSource.initialize()
  .then(() => {
    console.log('Data Source has been initialized!');

    userController(server);
    messageController(server);

    server.listen({ port: 3000 }, (err, address) => {
      if (err) {
        console.error(err);
        process.exit(1);
      }
      console.log(`Server running at ${address}`);
    });
  })
  .catch((error) => console.log(error));