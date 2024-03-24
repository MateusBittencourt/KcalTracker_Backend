import { connect } from 'amqplib/callback_api.js';

/**
 * Publishes a message to a message queue.
 * 
 * @param {string} raw_message - The message to publish.
 * @param {string} working_queue - The working queue.
 * @param {string} service - The service name.
 * @param {string} type - The type of event.
 */
const publish = (raw_message, working_queue, type = 'event') => {
    connect('amqp://localhost', function(error0, connection) {
        if (error0) {
            throw error0;
        }
        connection.createChannel(async function(error1, channel) {
            if (error1) {
                throw error1;
            }

            const msg = JSON.stringify(raw_message);
            const exchange = working_queue;
            const routingKey = `${working_queue}.${type}`;

            await channel.assertExchange(exchange, 'direct', { durable: false });
            channel.publish(exchange, routingKey, Buffer.from(msg));
            console.log(" [x] Sent %s in %s, queue %s", msg, routingKey, exchange);
        });

        setTimeout(function() {
            connection.close();
        }, 500);
    });
}

export default publish;