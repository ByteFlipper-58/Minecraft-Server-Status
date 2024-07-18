const mc = require('minecraft-protocol');
const { Client } = require('bedrock-protocol');

/**
 * Получить информацию о сервере Java Edition Minecraft.
 * @param {string} host - Хост (IP-адрес или доменное имя).
 * @param {number} [port=25565] - Порт сервера (по умолчанию 25565).
 * @returns {Promise<object>} Информация о сервере.
 */
function getJavaServerInfo(host, port = 25565) {
    return new Promise((resolve, reject) => {
        const client = mc.createClient({
            host: host,
            port: port,
            version: false // Default to the latest version
        });

        client.on('error', (err) => {
            reject(err);
        });

        client.once('login', () => {
            client.write('ping', {});
        });

        client.once('pong', (data) => {
            const serverInfo = {
                description: data.description.text,
                players: data.players,
                version: data.version.name,
                protocol: data.version.protocol,
            };
            client.end();
            resolve(serverInfo);
        });
    });
}

/**
 * Получить информацию о сервере Bedrock Edition Minecraft.
 * @param {string} host - Хост (IP-адрес или доменное имя).
 * @param {number} [port=19132] - Порт сервера (по умолчанию 19132).
 * @returns {Promise<object>} Информация о сервере.
 */
function getBedrockServerInfo(host, port = 19132) {
    return new Promise((resolve, reject) => {
        const client = new Client({
            host: host,
            port: port,
        });

        client.once('status', (data) => {
            const serverInfo = {
                description: data.description,
                players: data.players,
                version: data.version,
                protocol: data.protocol,
                world: data.world,
            };
            client.end();
            resolve(serverInfo);
        });

        client.once('error', (err) => {
            reject(err);
        });
    });
}

/**
 * Получить информацию о сервере Minecraft (Java или Bedrock Edition).
 * @param {string} host - Хост (IP-адрес или доменное имя).
 * @param {number} [port] - Порт сервера (по умолчанию для Java 25565, для Bedrock 19132).
 * @returns {Promise<object>} Информация о сервере.
 */
async function getServerInfo(host, port) {
    // Определите, является ли сервер Java или Bedrock (это может быть сделано на основе конкретных критериев)
    // Здесь предполагаем, что проверка на Java Edition производится по умолчанию (простой пример):
    const isJava = true; // Модифицируйте логику в зависимости от ваших требований

    try {
        if (isJava) {
            return await getJavaServerInfo(host, port);
        } else {
            return await getBedrockServerInfo(host, port);
        }
    } catch (error) {
        console.error('Error getting server info:', error);
    }
}

// Пример использования
getServerInfo('mc.intkgc.xyz')
    .then(console.log)
    .catch(console.error);
