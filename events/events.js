const initChatEvent = require('./chat');

module.exports = initEvents = (io) => {
  initChatEvent(io);
}