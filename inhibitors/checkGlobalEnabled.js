/* eslint curly: 0 */

module.exports = (client, msg, cmd) => {
  if (cmd.options.enabled) {
    if (client.cache.globallyDisabled === undefined) return 1; // eslint-disable-line
    else if (!client.cache.globallyDisabled.includes(cmd.options.name)) return 1; // eslint-disable-line
    else throw new Error(); // eslint-disable-line
  } else throw new Error();
};