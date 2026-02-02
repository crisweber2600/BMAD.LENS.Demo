async function install(options) {
    const { logger } = options;
    logger.log('  Git-Lens: no Cursor specific setup required.');
    return true;
}

module.exports = { install };
