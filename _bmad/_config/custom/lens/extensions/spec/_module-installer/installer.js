const fs = require('node:fs/promises');
const path = require('node:path');

/**
 * Helper: Check if path exists
 */
async function pathExists(filePath) {
    try {
        await fs.access(filePath);
        return true;
    } catch {
        return false;
    }
}

/**
 * Helper: Ensure directory exists (recursive mkdir)
 */
async function ensureDir(dirPath) {
    await fs.mkdir(dirPath, { recursive: true });
}

/**
 * Helper: Copy file
 */
async function copyFile(src, dest) {
    await fs.copyFile(src, dest);
}

/**
 * SPEC Extension Module Installer
 */
async function install(options) {
    const { projectRoot, config, installedIDEs, logger } = options;

    try {
        logger.log('Installing SPEC extension module assets...');

        // Create constitution root directory
        if (config.constitution_root) {
            const constitutionPath = path.isAbsolute(config.constitution_root)
                ? config.constitution_root
                : path.join(projectRoot, config.constitution_root);

            if (!(await pathExists(constitutionPath))) {
                logger.log(`Creating constitution root: ${constitutionPath}`);
                await ensureDir(constitutionPath);
            }
        }

        // Create scribe sidecar directory
        const sidecarPath = path.join(projectRoot, '_bmad', '_memory', 'scribe-sidecar');
        if (!(await pathExists(sidecarPath))) {
            logger.log('Creating Scribe sidecar directory...');
            await ensureDir(sidecarPath);

            // Copy sidecar template files
            const sidecarSource = path.join(__dirname, '..', 'agents', 'scribe', '_memory', 'scribe-sidecar');
            if (await pathExists(sidecarSource)) {
                const entries = await fs.readdir(sidecarSource);
                for (const entry of entries) {
                    const sourcePath = path.join(sidecarSource, entry);
                    const destPath = path.join(sidecarPath, entry);
                    const stat = await fs.stat(sourcePath);
                    if (stat.isFile()) {
                        await copyFile(sourcePath, destPath);
                        logger.log(`✓ Installed sidecar file: ${entry}`);
                    }
                }
            }
        }

        // Install prompts (if any)
        const promptsSource = path.join(__dirname, '..', 'prompts');
        const promptsDest = path.join(projectRoot, '.github', 'prompts');

        if (await pathExists(promptsSource)) {
            await ensureDir(promptsDest);
            const entries = await fs.readdir(promptsSource);

            for (const entry of entries) {
                const sourcePath = path.join(promptsSource, entry);
                const destPath = path.join(promptsDest, entry);
                const stat = await fs.stat(sourcePath);

                if (!stat.isFile()) {
                    continue;
                }

                if (await pathExists(destPath)) {
                    logger.warn(`Prompt already exists, skipping: .github/prompts/${entry}`);
                    continue;
                }

                await copyFile(sourcePath, destPath);
                logger.log(`✓ Installed prompt: .github/prompts/${entry}`);
            }
        }

        // Configure for specific IDEs if needed
        if (installedIDEs && installedIDEs.length > 0) {
            for (const ide of installedIDEs) {
                await configureForIDE(ide, projectRoot, config, logger);
            }
        }

        logger.log('✓ SPEC extension installation complete');
        return true;
    } catch (error) {
        logger.error(`Error installing SPEC extension: ${error.message}`);
        return false;
    }
}

async function configureForIDE(ide, projectRoot, config, logger) {
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
