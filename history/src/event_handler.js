import { channels, subscribe } from "@kcaltracker/broker";
import { getHistory } from "./manager.js";

const BROKERGROUP_ACCESS = 'history-access';

////////////////////////////////////////
/// Private functions
////////////////////////////////////////

/**
 * Process the access events.
 * @param {Object} message - The message from access service.
 */
const processAccessEvents = async (message) => {
    // Process the message
    if (message.service === 'access' && message.event.type === 'login') {
        console.log('Received login event:', message);
        getHistory(message.event.data.accessToken, new Date().toISOString().split('T')[0]);
    }
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
