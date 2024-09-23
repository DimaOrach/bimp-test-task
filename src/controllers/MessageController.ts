import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { AppDataSource } from '../ormconfig';
import { Message } from '../entity/Message';
import { promises as fsPromises } from 'fs';
import { join } from 'path';
import { MultipartFields, MultipartFile } from '@fastify/multipart';
import { DeepPartial } from 'typeorm';

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

async function createTextMessage(
  request: FastifyRequest<{ Body: { content: string } }>,
  reply: FastifyReply
) {
  const { content } = request.body;

  if (!content) {
    return reply.status(400).send({ message: 'Content is required' });
  }

  const messageRepository = AppDataSource.getRepository(Message);
  const message = messageRepository.create({
    type: 'text',
    content,
  });

  await messageRepository.save(message);

  reply.send({ message: 'Message created successfully', data: message });
}

async function createMessageWithFile(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const data = await request.file();

  if (!data) {
    return reply.status(400).send({ message: 'File is required' });
  }

  const fields: MultipartFields = data.fields;

  const contentField = fields.content;
  let contentValue = '';

  if (contentField && 'value' in contentField) {
    contentValue = String(contentField.value);
  }

  console.log('Content value:', contentValue);

  const uploadsDir = join(__dirname, '../../uploads');
  const filePath = join(uploadsDir, data.filename);

  try {
    await fsPromises.access(uploadsDir);
  } catch (error) {
    await fsPromises.mkdir(uploadsDir, { recursive: true });
  }

  await fsPromises.writeFile(filePath, await data.toBuffer());

  const messageRepository = AppDataSource.getRepository(Message);

  const messageData: DeepPartial<Message> = {
    type: 'file',
    content: contentValue || '', 
    filePath: filePath,
  };

  const message = messageRepository.create(messageData);
  await messageRepository.save(message);

  reply.send({ message: 'Message with file created successfully', data: message });
}


export default async function messageController(server: FastifyInstance) {
  server.get('/messages', getMessages); 
  server.get('/message/:id', getMessageById); 
  server.post('/message/text', createTextMessage);
  server.post('/message/file', createMessageWithFile); 
}
