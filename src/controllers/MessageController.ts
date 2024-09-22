import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { AppDataSource } from '../ormconfig';
import { Message } from '../entity/Message';

async function getMessages(
    //параметри запиту. limit - скільки поверне повідомлень, offset - початок нумерації
  request: FastifyRequest<{ Querystring: { limit?: number; offset?: number } }>, 
  reply: FastifyReply
) {
  const { limit = 10, offset = 0 } = request.query;

  const messageRepository = AppDataSource.getRepository(Message);

  const [messages, total] = await messageRepository.findAndCount({
    take: limit,
    skip: offset,
  });

  reply.send({
    data: messages,
    total,
    limit,
    offset,
  });
}

async function getMessageById(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) {
  const { id } = request.params;

  const messageRepository = AppDataSource.getRepository(Message);
  const message = await messageRepository.findOneBy({ id: parseInt(id) });

  if (!message) {
    return reply.status(404).send({ message: 'Message not found' });
  }

  reply.send(message);
}

export default async function messageController(server: FastifyInstance) {
  server.get('/messages', getMessages); 
  server.get('/message/:id', getMessageById);
}
