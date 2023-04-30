const fs = require("fs");
module.exports = (message, client) => {
  if (message.content === "!setstatus") {
    console.log(message.channel.id);
    const channel = client.channels.cache.get(message.channel.id);
    if (!channel) return console.error("Invalid channel ID.");
    channel
      .send(`:gear:Checking the status...\nWaiting for bot to restart.`)
      .then((msg) => {
        const json = {
          messageId: null,
          channelId: null,
        };
        fs.writeFileSync("data.json", JSON.stringify(json));
        const data = JSON.parse(fs.readFileSync("data.json"));
        data.messageId = msg.id;
        data.channelId = message.channel.id;
        fs.writeFileSync("data.json", JSON.stringify(data));
        console.log(`The status channel has been set to #${channel.name}.`);
      })
      .catch(console.error);
  }
};
