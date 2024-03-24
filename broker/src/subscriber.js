import { connect } from 'amqplib/callback_api.js';

/**
 * Subscribes to a message queue.
 * 
 * @param {string} working_queue - The working queue.
 * @param {string} routingGroup - The routing group.
 * @param {string} service - The service name.
 * @param {string} type - The type of event.
 * @param {Function} handler - The handler function.
 */
const subscribe = async (working_queue, routingGroup, type, handler) => {
    connect('amqp://localhost', function(error0, connection) {
        if (error0) {
            throw error0;
        }
        connection.createChannel(async function(error1, channel) {
            if (error1) {
                throw error1;
            }
            const exchange = working_queue;
            const queue = routingGroup;
            const routingKey = `${working_queue}.${type}`;

            await channel.assertExchange(exchange, 'direct', { durable: false });

            await channel.assertQueue(queue, { exclusive: false }, async function(error2, q) {
                if (error2) {
                    throw error2;
                }
                console.log(" [*] Waiting for messages in %s.", q.queue);

                await channel.bindQueue(q.queue, exchange, routingKey);

                channel.consume(q.queue, function(msg) {
                    if (msg.content) {
                        handler(msg);
                        console.log(" [x] %s: '%s'", msg.fields.routingKey, msg.content.toString());
                    }
                }, { noAck: true });
            });
        });
    });
}

export default subscribe;