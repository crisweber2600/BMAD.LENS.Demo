const fs = require('node:fs/promises');
const path = require('node:path');

const supportedIDEs = new Set(['claude-code', 'windsurf', 'cursor', 'github-copilot']);

async function pathExists(filePath) {
    try {
        await fs.access(filePath);
        return true;
    } catch {
        return false;
    }
}

async function ensureDir(dirPath) {
    await fs.mkdir(dirPath, { recursive: true });
}

function resolvePath(projectRoot, configuredPath) {
    if (!configuredPath) {
        return null;
    }

    const expanded = configuredPath.replace('{project-root}/', '').replace('{project-root}', '');
    return path.isAbsolute(configuredPath) ? configuredPath : path.join(projectRoot, expanded);
}

async function writeFileIfMissing(filePath, content) {
    if (await pathExists(filePath)) {
        return false;
    }

    await ensureDir(path.dirname(filePath));
    await fs.writeFile(filePath, content, 'utf8');
    return true;
}

/**
 * Lens Compass Extension Installer
 */
async function install(options) {
    const { projectRoot, config, installedIDEs, logger } = options;

    try {
        logger.log('Installing Lens Compass extension assets...');

        const profilesFolder = resolvePath(projectRoot, config.personal_profiles_folder);
        if (profilesFolder) {
            if (!(await pathExists(profilesFolder))) {
                await ensureDir(profilesFolder);
                logger.log(`✓ Created personal profiles folder: ${profilesFolder}`);
            }
        }

        const rosterFile = resolvePath(projectRoot, config.roster_file);
        if (rosterFile) {
            const rosterCreated = await writeFileIfMissing(
                rosterFile,
                `version: 1\nupdated: ${new Date().toISOString()}\ndomains: {}\n`
            );
            if (rosterCreated) {
                logger.log(`✓ Created project roster: ${rosterFile}`);
            }
        }

        if (installedIDEs && installedIDEs.length > 0) {
            for (const ide of installedIDEs) {
                await configureForIDE(ide, projectRoot, config, logger);
            }
        }

        logger.log('✓ Lens Compass extension installation complete');
        return true;
    } catch (error) {
        logger.error(`Error installing Lens Compass extension: ${error.message}`);
        return false;
    }
}

async function configureForIDE(ide, projectRoot, config, logger) {
    if (!ide || typeof ide !== 'string') {
        logger.warn('Warning: Invalid IDE identifier. Skipping.');
        return;
    }

    if (!supportedIDEs.has(ide)) {
        logger.warn(`Warning: Unknown IDE '${ide}'. Skipping.`);
        return;
    }

    const platformSpecificPath = path.join(__dirname, 'platform-specifics', `${ide}.js`);

    try {
        if (await pathExists(platformSpecificPath)) {
            const platformHandler = require(platformSpecificPath);
            if (typeof platformHandler.install === 'function') {
                await platformHandler.install({ projectRoot, config, logger });
            }
        }
    } catch (error) {
        logger.warn(`Warning: Could not configure ${ide}: ${error.message}`);
    }
}

module.exports = { install };
