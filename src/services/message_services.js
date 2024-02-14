const messages = require("../data/messages");

const MessageService = {
  getMessages() {
    const senderNames = [
      "John",
      "Alice",
      "Bob",
      "Charlie",
      "David",
      "Eva",
      "Frank",
    ];

    const randomMessages = [];
    for (let i = 0; i < messages.length; i++) {
      const sender =
        senderNames[Math.floor(Math.random() * senderNames.length)];
      const message = { ...messages[i], sender };
      randomMessages.push(message);
    }

    return randomMessages;
  },
};

module.exports = MessageService;
