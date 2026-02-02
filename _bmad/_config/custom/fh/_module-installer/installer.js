/**
 * File Harmonizer Module Installer
 *
 * Module: file-harmonizer (fh)
 * Version: 1.0.0
 * Status: Production Ready
 * Created: 2026-02-02
 */

const fs = require('fs');
const path = require('path');

let platformCodes = null;
try {
    platformCodes = require(path.join(__dirname, '../../../../tools/cli/lib/platform-codes'));
} catch (error) {
    platformCodes = null;
}

function resolveLogger(logger) {
    if (logger && typeof logger.log === 'function') {
        return logger;
    }

    return {
        log: console.log,
        warn: console.warn,
        error: console.error
    };
}

function normalizeProjectRoot(projectRoot) {
    return projectRoot || process.cwd();
}

function verifyModuleFiles(moduleRoot, logger) {
    const requiredDirs = ['agents', 'workflows', 'resources', 'docs', '_module-installer'];
    const requiredFiles = [
        'module.yaml',
        'README.md',
        'TODO.md',
        'INSTALLATION.md',
        'agents/scout.spec.md',
        'agents/harmonizer.spec.md',
        'agents/scribe.spec.md',
        'workflows/analyze-repository.spec.md',
        'workflows/gather-harmonization-rules.spec.md',
        'workflows/execute-harmonization.spec.md',
        'workflows/update-documentation.spec.md',
        'resources/file-type-standards.yaml',
        'resources/naming-conventions.yaml',
        'docs/architecture.md',
        'docs/user-guide.md',
        'docs/examples.md'
    ];

    for (const dir of requiredDirs) {
        const fullPath = path.join(moduleRoot, dir);
        if (!fs.existsSync(fullPath)) {
            throw new Error(`Required directory missing: ${dir}`);
        }
    }

    for (const file of requiredFiles) {
        const fullPath = path.join(moduleRoot, file);
        if (!fs.existsSync(fullPath)) {
            throw new Error(`Required file missing: ${file}`);
        }
        logger.log(`  ✓ Found: ${file}`);
    }
}

function validatePlatforms(installedIDEs, logger) {
    if (!Array.isArray(installedIDEs) || installedIDEs.length === 0) {
        return [];
    }

    if (!platformCodes) {
        logger.warn('  ⚠ Platform codes helper not available. Skipping IDE validation.');
        return installedIDEs;
    }

    const validPlatforms = [];
    for (const ide of installedIDEs) {
        if (platformCodes.isValidPlatform(ide)) {
            validPlatforms.push(ide);
        } else {
            logger.warn(`  ⚠ Unknown platform: '${ide}'. Skipping.`);
        }
    }

    return validPlatforms;
}

/**
 * Module Installer
 *
 * @param {Object} options - Installation options
 * @param {string} options.projectRoot - The root directory of the target project
 * @param {Object} options.config - Module configuration from module.yaml (resolved variables)
 * @param {Array<string>} options.installedIDEs - Array of IDE codes installed
 * @param {Object} options.logger - Logger instance for output
 * @returns {Promise<boolean>} - Success status (true = success, false = failure)
 */
async function install(options = {}) {
    const logger = resolveLogger(options.logger);
    const projectRoot = normalizeProjectRoot(options.projectRoot);
    const moduleRoot = path.join(projectRoot, 'src', 'modules', 'fh');
    const installedIDEs = validatePlatforms(options.installedIDEs, logger);

    try {
        logger.log('Installing File Harmonizer module...');

        if (!fs.existsSync(moduleRoot)) {
            throw new Error(`Module directory not found at ${moduleRoot}`);
        }

        verifyModuleFiles(moduleRoot, logger);

        if (installedIDEs.length > 0) {
            logger.log(`  ✓ IDEs detected: ${installedIDEs.join(', ')}`);
        }

        logger.log('✓ File Harmonizer installation complete');
        return true;
    } catch (error) {
        logger.error(`Error installing File Harmonizer: ${error.message}`);
        return false;
    }
}

/**
 * Simple status check
 */
async function status(options = {}) {
    const logger = resolveLogger(options.logger);
    const projectRoot = normalizeProjectRoot(options.projectRoot);
    const moduleRoot = path.join(projectRoot, 'src', 'modules', 'fh');

    try {
        if (!fs.existsSync(moduleRoot)) {
            throw new Error('Module directory not found');
        }

        logger.log('File Harmonizer Module Status');
        logger.log('  Module: file-harmonizer');
        logger.log('  Code: fh');
        logger.log('  Version: 1.0.0');
        logger.log(`  Root: ${moduleRoot}`);
        logger.log('  Status: ✓ Installed');
        return true;
    } catch (error) {
        logger.error(`Status check failed: ${error.message}`);
        return false;
    }
}

module.exports = { install, status };

if (require.main === module) {
    const args = process.argv.slice(2);
    const command = args[0] || 'install';

    if (command === 'install') {
        install({ projectRoot: process.cwd() }).then(success => {
            process.exit(success ? 0 : 1);
        });
    } else if (command === 'status') {
        status({ projectRoot: process.cwd() }).then(success => {
            process.exit(success ? 0 : 1);
        });
    } else {
        console.log('Usage: node installer.js [install|status]');
        process.exit(1);
    }
}
