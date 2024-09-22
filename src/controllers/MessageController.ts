import { FastifyPluginAsync } from 'fastify';
import { AppDataSource } from '../ormconfig';
import { Message } from '../entity/Message';

interface CreateTextMessageRequest {
    content: string;
}

const messageController: FastifyPluginAsync = async (fastify) => {
    fastify.post<{ Body: CreateTextMessageRequest }>('/message/text', async (request, reply) => {
        const { content } = request.body;

        if (!content) {
            return reply.status(400).send({ message: 'Content is required.' });
        }

        const message = new Message();
        message.type = 'text';
        message.content = content;

        await AppDataSource.manager.save(message);

        return { message: 'Message created successfully.' };
    });
};

export default messageController;
