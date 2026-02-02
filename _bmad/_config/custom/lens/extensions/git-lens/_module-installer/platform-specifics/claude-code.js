async function install(options) {
    const { logger } = options;
    logger.log('  Git-Lens: no Claude Code specific setup required.');
    return true;
}

module.exports = { install };
