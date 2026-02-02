async function install(options) {
    const { logger } = options;
    logger.log('  Git-Lens: no GitHub Copilot specific setup required.');
    return true;
}

module.exports = { install };
