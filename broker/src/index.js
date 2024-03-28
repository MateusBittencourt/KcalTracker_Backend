import subscribe from "./subscriber.js";
import publish from "./publisher.js";

const channels = Object.freeze({
    accessService: 'accessService',
    historyService: 'historyService',
    storageService: 'storageService',
    trackerService: 'trackerService',
    userService: 'userService'
});

export { subscribe, publish, channels };