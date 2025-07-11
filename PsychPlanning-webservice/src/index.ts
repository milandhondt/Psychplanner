import createServer from './createServer';

async function main() {
  try {
    const server = await createServer();
    await server.start();

    async function onClose() {
      await server.stop();
      process.exit(0);
    }

    process.on('SIGTERM', onClose);
    process.on('SIGQUIT', onClose);
  } catch (e) {
    console.log(e);
    process.exit(-1);
  }
}

main();
