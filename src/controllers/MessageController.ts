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
  
  async function createMessage(
    request: FastifyRequest<{ Body: { content: string } }>,
    reply: FastifyReply
  ) {
    const { content } = request.body;
  
    if (!content) {
      return reply.status(400).send({ message: 'Content is required' });
    }
  
    const messageRepository = AppDataSource.getRepository(Message);
  
    const newMessage = new Message();
    newMessage.content = content;
    newMessage.type = 'text'; 
    await messageRepository.save(newMessage);
  
    reply.status(201).send({ message: 'Message created successfully', data: newMessage });
  }
  
  // Реєстрація маршрутів
  export default async function messageController(server: FastifyInstance) {
    server.get('/messages', getMessages); 
    server.get('/message/:id', getMessageById); 
    server.post('/message/text', createMessage); 
  }
