module.exports.run = async (client, msg) => {
  console.timeEnd("run time");
  const init = Date.now(); // Get the ms before editing the message.
  let datebasePing = await client.db.ping().catch(() => datebasePing = "Failed");

  const message = await msg.channel.send({
    embed: {
      title: `⏱${msg.emojis.bar}Checking my latency!`,
      color: msg.colors.default
    }
  });

  return message.edit({
    embed: {
      title: `🏓${msg.emojis.bar}Pong!`,
      fields: [
        {
          "name": "Round Trip Latency \\⏱",
          "value": `${String(Math.round(Date.now() - init))} ms`, // Get the time it took to edit the message.
          "inline": true
        },
        {
          "name": "Heartbeat \\💙",
          "value": `${String(Math.round(client.ping))} ms`,
          "inline": true
        },
        {
          "name": "Database Latency",
          "value": `${String(datebasePing)} ms`,
          "inline": true
        }
      ],
      color: msg.colors.default
    }
  });
};

module.exports.options = {
  enabled: true,
  guarded: false,
  botOwnerOnly: false,
  nsfw: false,
  checkVC: false,
  cooldown: 5,
  description: "View the latency and heartbeat of the bot.",
  aliases: ["latency", "pong"],
  userPermissions: [],
  botPermissions: [],
  runIn: []
};