/* eslint no-eval: 0 */

const snekfetch = require("snekfetch");
const util = require("util");

module.exports.run = async (client, msg, args) => {
  // https://github.com/dirigeants/klasa/blob/master/src/lib/util/util.js
  const isFunction = input => typeof input === "function";
  const isThenable = input => (input instanceof Promise) || (Boolean(input) && isFunction(input.then) && isFunction(input.catch));

  try {
    let code = args.join(" ");

    if (args[0] === "async") code = `(async () => {\n${code.slice(6)}\n})();`;

    let evaled = eval(code);
    const type = evaled;

    if (isThenable(evaled)) evaled = await evaled;

    if (typeof evaled !== "string") {
      evaled = util.inspect(evaled, {
        depth: 0,
        showHidden: true
      });
    }

    if (evaled.length < 2000) {
      msg.channel.send(`**Input**\n\`\`\`js\n${code}\n\`\`\`\n**Output**\n\`\`\`js\n${evaled.replace(client.token, "SIKE")}\n\`\`\`\n**Type**\n\`\`\`js\n${typeof type}\`\`\``);
    } else {
      snekfetch.post(`https://hastebin.com/documents`).send(evaled.replace(client.token, "SIKE")).then(url => { // eslint-disable-line
        return msg.channel.send(`Results have been uploaded onto Hastebin as it exceeded 2000 characters!\n**https://hastebin.com/${url.body.key}**`, {
          files: [
            {
              name: "output.txt",
              attachment: Buffer.from(evaled.replace(client.token, "SIKE"))
            }
          ]
        });
      }).catch(e => msg.error(e, "evaluate this snippet!")); // eslint-disable-line
    }
  } catch (error) {
    return msg.error(error, "evaluate this snippet!");
  }
};

module.exports.options = {
  enabled: true,
  guarded: true,
  botOwnerOnly: true,
  nsfw: false,
  checkVC: false,
  cooldown: 5,
  description: "Evaluate JavaScript code.",
  aliases: ["ev"],
  userPermissions: [],
  botPermissions: [],
  runIn: []
};
