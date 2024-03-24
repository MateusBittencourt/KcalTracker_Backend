import { channels, subscribe } from "@kcaltracker/broker";

const BROKERGROUP_ACCESS = 'history-access';

////////////////////////////////////////
/// Private functions
////////////////////////////////////////
/**
 * Process the access events.
 * @param {Object} msg - The message from access service.
 */
const processAccessEvents = async (msg) => {
    // Process the message
    console.log("historyService: %s: '%s'", msg.fields.routingKey, msg.content.toString());
}


////////////////////////////////////////
/// Public functions
////////////////////////////////////////

/**
 * Subscribe to listen fromn message broker.
 */
export const listenToEvent = async () => {

    // Subscribe to the access events
    await subscribe(channels.accessService, BROKERGROUP_ACCESS, 'event', processAccessEvents);
};