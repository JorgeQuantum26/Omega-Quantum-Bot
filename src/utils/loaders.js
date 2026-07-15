const fs = require("fs");
const path = require("path");

/**
 * Carrega recursivamente todos os comandos das pastas
 * Estrutura esperada: /commands/Categoria/Subcategoria/comando.js
 * Ignora arquivos que não sejam .js ou que não tenham data e execute
 *
 * @param {Client} client - Cliente do Discord.js
 * @returns {Object} { total: number, loaded: number, failed: number, details: string[] }
 */
async function loadCommands(client) {
  const commandsPath = path.join(__dirname, "../../commands");
  const stats = { total: 0, loaded: 0, failed: 0, details: [] };

  if (!fs.existsSync(commandsPath)) {
    console.warn("⚠️  Pasta 'commands' não encontrada!");
    return stats;
  }

  async function readCommands(dir) {
    const files = fs.readdirSync(dir);

    for (const file of files) {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);

      // Se for diretório, busca recursivamente
      if (stat.isDirectory()) {
        await readCommands(fullPath);
        continue;
      }

      // Se não for arquivo .js, ignora
      if (!file.endsWith(".js")) {
        continue;
      }

      stats.total++;

      try {
        // Importa o comando dinamicamente
        const commandData = require(fullPath);

        // Valida se tem as propriedades obrigatórias
        if (!commandData || !commandData.data || !commandData.execute) {
          stats.failed++;
          stats.details.push(
            `❌ ${file} - Faltam propriedades obrigatórias (data, execute)`
          );
          continue;
        }

        // Registra o comando
        client.commands.set(commandData.data.name, commandData);
        stats.loaded++;
        stats.details.push(
          `✅ ${file.padEnd(30)} -> /${commandData.data.name}`
        );
      } catch (error) {
        stats.failed++;
        stats.details.push(
          `❌ ${file} - Erro ao carregar: ${error.message.split("\n")[0]}`
        );
      }
    }
  }

  await readCommands(commandsPath);

  return stats;
}

/**
 * Carrega todos os event listeners
 * Estrutura esperada: /src/events/nomeEvento.js
 *
 * @param {Client} client - Cliente do Discord.js
 * @returns {Object} { total: number, loaded: number, failed: number }
 */
async function loadEvents(client) {
  const eventsPath = path.join(__dirname, "../events");
  const stats = { total: 0, loaded: 0, failed: 0, details: [] };

  if (!fs.existsSync(eventsPath)) {
    console.warn("⚠️  Pasta 'events' não encontrada!");
    return stats;
  }

  const files = fs.readdirSync(eventsPath).filter((f) => f.endsWith(".js"));

  for (const file of files) {
    stats.total++;

    try {
      const eventData = require(path.join(eventsPath, file));

      if (!eventData || !eventData.name || !eventData.execute) {
        stats.failed++;
        stats.details.push(
          `❌ ${file} - Faltam propriedades obrigatórias (name, execute)`
        );
        continue;
      }

      if (eventData.once) {
        client.once(eventData.name, (...args) =>
          eventData.execute(...args)
        );
      } else {
        client.on(eventData.name, (...args) => eventData.execute(...args));
      }

      stats.loaded++;
      stats.details.push(`✅ ${file.padEnd(30)} -> ${eventData.name}`);
    } catch (error) {
      stats.failed++;
      stats.details.push(
        `❌ ${file} - Erro ao carregar: ${error.message.split("\n")[0]}`
      );
    }
  }

  return stats;
}

module.exports = { loadCommands, loadEvents };
