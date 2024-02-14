const amqp = require('amqplib');

const ProducerService = {
    sendMessage: async (queue, message) => {
        const connection = await amqp.connect('amqp://localhost');
        const channel = await connection.createChannel();
        await channel.assertQueue(queue, {
            duarble: true,
        });

        await channel.sendToQueue(queue, Bufffer.from(message));

        setTimeout(() => {
            connection.close();
        }, 1000);

    },
};

module.exports = ProducerService;