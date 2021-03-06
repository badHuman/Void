const os = require("os");
const moment = require("moment");
const util = require("util");
const exec = util.promisify(require("child_process").exec);
require("moment-duration-format")(moment);

module.exports.run = async (client, msg) => {
  const uptime = await exec("net statistics workstation").then(output => { // net statistics is wayyy faster than systeminfo
    let index = output.stdout.search("Statistics since ");
    const finalArray = [];
    for (; index < output.stdout.length; index++) {
      if (output.stdout[index] === "\r") break;
      else finalArray.push(output.stdout[index]);
    }

    return finalArray.join("");
  }).catch(() => "Failed to retrieve system uptime");

  msg.channel.send({
    embed: {
      fields: [
        {
          "name": `📈${msg.emojis.bar}Statistics`,
          "value": `
**Username**: ${client.user.tag} (\`${client.user.id}\`)\n
**Owner**: ${client.users.get("318932745223143425").tag} (\`318932745223143425\`)\n
**Created On**: ${moment(client.user.createdAt).format("dddd, MMMM Do YYYY, hh:mm:ss A")}\n
**Uptime**: ${moment.duration(client.uptime).format(" D [days], H [hours], m [minutes], s [seconds]")}\n
**Users**: \`${client.users.size.toLocaleString()}\`\n
**Servers**: \`${client.guilds.size.toLocaleString()}\`\n
**Channels**: \`${client.channels.size.toLocaleString()}\`\n
**Emojis**: \`${client.emojis.size.toLocaleString()}\`\n
**Commands**: \`${client.commands.size.toLocaleString()}\`\n\u200B`
        },
        {
          "name": `🖥${msg.emojis.bar}System Information`,
          "value": `
**CPU Model**: ${os.cpus()[0].model} ${os.cpus().length} Cores ${os.cpus().length} Threads\n
**Architecture**: ${os.arch()}\n
**Memory Usage**: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} / ${(os.totalmem() / 1024 / 1024).toFixed(2)} MB\n
**Free Memory**: ${(os.freemem() / 1024 / 1024).toFixed(2)} MB\n
**Booted Since**: ${uptime.slice(17)}\n
**Platform**: ${os.platform()}\n\u200B`
        },
        {
          "name": `🔗${msg.emojis.bar}Links`,
          "value": `
**Invite URL**: ${await client.generateInvite().then(link => link.replace("permissions=0", "permissions=8")).catch(() => "Failed to generate an invite link")}\n
**Github Repository**:`
        }
      ],
      thumbnail: {
        "url": client.user.displayAvatarURL({ size: 1024 })
      },
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
  description: "View the current statistics of the bot.",
  aliases: ["botinfo", "botstats"],
  userPermissions: [],
  botPermissions: [],
  runIn: []
};