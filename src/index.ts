import Fastify from 'fastify';
import dotenv from 'dotenv';

dotenv.config();

const server = Fastify();

const port = Number(process.env.PORT) || 3000;

server.listen({ port }, (err, address) => {
  if (err) {
    server.log.error(err);
    process.exit(1);
  }
  console.log(`Server running at ${address}`);
});
