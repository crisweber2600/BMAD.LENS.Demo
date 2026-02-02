async function install(options) {
    const { logger } = options;
    logger.log('  Git-Lens: no Windsurf specific setup required.');
    return true;
}

module.exports = { install };
