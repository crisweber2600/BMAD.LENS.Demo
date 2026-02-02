/**
 * File Harmonizer Module Installer
 *
 * Module: file-harmonizer (fh)
 * Version: 1.0.0
 * Status: Production Ready
 * Created: 2026-02-02
 */

const fs = require('node:fs');
const fsp = require('node:fs/promises');
const path = require('node:path');

let platformCodes = null;
try {
    platformCodes = require(path.join(__dirname, '../../../../tools/cli/lib/platform-codes'));
} catch (error) {
    platformCodes = null;
}

async function pathExists(filePath) {
    try {
        await fsp.access(filePath);
        return true;
    } catch {
        return false;
    }
}

async function ensureDir(dirPath) {
    await fsp.mkdir(dirPath, { recursive: true });
}

async function copyFile(src, dest) {
    await ensureDir(path.dirname(dest));
    await fsp.copyFile(src, dest);
}

async function copyDirRecursive(src, dest, { overwrite = false, logger, projectRoot, label }) {
    await ensureDir(dest);
    const entries = await fsp.readdir(src, { withFileTypes: true });

    for (const entry of entries) {
        const sourcePath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);

        if (entry.isDirectory()) {
            await copyDirRecursive(sourcePath, destPath, { overwrite, logger, projectRoot, label });
            continue;
        }

        const fileExists = await pathExists(destPath);
        if (fileExists && !overwrite) {
            logger.warn(`${label} already exists, skipping: ${path.relative(projectRoot, destPath)}`);
            continue;
        }

        await copyFile(sourcePath, destPath);
        if (fileExists) {
            logger.log(`✓ Updated ${label}: ${path.relative(projectRoot, destPath)}`);
        } else {
            logger.log(`✓ Installed ${label}: ${path.relative(projectRoot, destPath)}`);
        }
    }
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
    const start = projectRoot || process.cwd();
    const candidates = [
        start,
        path.resolve(start, '..'),
        path.resolve(start, '..', '..'),
        path.resolve(start, '..', '..', '..'),
        path.resolve(start, '..', '..', '..', '..')
    ];

    for (const candidate of candidates) {
        const modulePath = path.join(candidate, 'src', 'modules', 'fh');
        if (fs.existsSync(modulePath)) {
            return candidate;
        }
    }

    return start;
}

async function findModuleConfig(moduleRoot) {
    const candidates = ['module.json', 'module.yaml'];
    for (const candidate of candidates) {
        const candidatePath = path.join(moduleRoot, candidate);
        if (await pathExists(candidatePath)) {
            return { name: candidate, path: candidatePath };
        }
    }
    return null;
}

async function verifyModuleFiles(moduleRoot, logger) {
    const requiredDirs = ['agents', 'workflows', 'resources', 'docs', '_module-installer'];
    const requiredFiles = [
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
        'resources/file-type-standards.md',
        'resources/naming-conventions.md',
        'docs/architecture.md',
        'docs/user-guide.md',
        'docs/examples.md'
    ];

    for (const dir of requiredDirs) {
        const fullPath = path.join(moduleRoot, dir);
        if (!(await pathExists(fullPath))) {
            throw new Error(`Required directory missing: ${dir}`);
        }
    }

    const moduleConfig = await findModuleConfig(moduleRoot);
    if (!moduleConfig) {
        throw new Error('Required file missing: module.json');
    }
    logger.log(`  ✓ Found: ${moduleConfig.name}`);

    for (const file of requiredFiles) {
        const fullPath = path.join(moduleRoot, file);
        if (!(await pathExists(fullPath))) {
            throw new Error(`Required file missing: ${file}`);
        }
        logger.log(`  ✓ Found: ${file}`);
    }
}

async function loadModuleMetadata(moduleRoot, logger) {
    const moduleConfig = await findModuleConfig(moduleRoot);
    if (!moduleConfig) {
        return { name: 'File Harmonizer', version: '1.0.0' };
    }

    try {
        const content = await fsp.readFile(moduleConfig.path, 'utf-8');
        const parsed = JSON.parse(content);
        return {
            name: parsed.name || 'File Harmonizer',
            version: parsed.version || '1.0.0'
        };
    } catch (error) {
        logger.warn(`  ⚠ Could not parse ${moduleConfig.name}: ${error.message}`);
        return { name: 'File Harmonizer', version: '1.0.0' };
    }
}

async function updateManifest(bmadRoot, moduleName, moduleType, version, logger) {
    const configDir = path.join(bmadRoot, '_config');
    const manifestPath = path.join(configDir, 'manifest.yaml');
    const timestamp = new Date().toISOString();

    await ensureDir(configDir);

    if (!(await pathExists(manifestPath))) {
        const manifestContent = `# BMAD Module Manifest\n# Auto-generated by FH installer\n# Last updated: ${timestamp}\n\ninstalled_modules:\n  - ${moduleName}\n\nmodule_info:\n  ${moduleName}:\n    type: ${moduleType}\n    version: ${version}\n    installed_at: ${timestamp}\n`;
        await fsp.writeFile(manifestPath, manifestContent, 'utf-8');
        logger.log(`✓ Registered ${moduleName} in manifest`);
        return;
    }

    let manifestContent = await fsp.readFile(manifestPath, 'utf-8');

    if (manifestContent.includes('installed_modules:')) {
        const modulesMatch = manifestContent.match(/installed_modules:\s*\n((?:\s+-\s+.+\n)*)/);
        const existingModules = modulesMatch
            ? modulesMatch[1]
                .split('\n')
                .filter(line => line.trim().startsWith('-'))
                .map(line => line.trim().replace(/^[-\s]+/, ''))
            : [];

        if (!existingModules.includes(moduleName)) {
            existingModules.push(moduleName);
            const updatedBlock = `installed_modules:\n${existingModules.map(m => `  - ${m}`).join('\n')}\n`;
            if (modulesMatch) {
                manifestContent = manifestContent.replace(modulesMatch[0], updatedBlock);
            } else {
                manifestContent = `${updatedBlock}\n${manifestContent}`;
            }
            await fsp.writeFile(manifestPath, manifestContent, 'utf-8');
            logger.log(`✓ Registered ${moduleName} in manifest`);
        }
        return;
    }

    if (manifestContent.includes('modules:')) {
        const moduleEntry = `  - name: ${moduleName}\n    version: ${version}\n    installDate: ${timestamp}\n    lastUpdated: ${timestamp}\n    source: local\n    npmPackage: null\n    repoUrl: null\n`;
        const hasModule = new RegExp(`-\\s+name:\\s+${moduleName}\\b`).test(manifestContent);
        if (!hasModule) {
            if (manifestContent.includes('\nides:')) {
                manifestContent = manifestContent.replace(/\nides:\s*\n/, `\n${moduleEntry}\nides:\n`);
            } else {
                manifestContent = `${manifestContent.trim()}\n${moduleEntry}`;
            }
            await fsp.writeFile(manifestPath, manifestContent, 'utf-8');
            logger.log(`✓ Registered ${moduleName} in manifest`);
        }
        return;
    }

    const fallbackBlock = `\ninstalled_modules:\n  - ${moduleName}\n`;
    await fsp.writeFile(manifestPath, `${manifestContent.trim()}${fallbackBlock}\n`, 'utf-8');
    logger.log(`✓ Registered ${moduleName} in manifest`);
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
 * @param {Object} options.config - Module configuration from module.json (resolved variables)
 * @param {Array<string>} options.installedIDEs - Array of IDE codes installed
 * @param {Object} options.logger - Logger instance for output
 * @returns {Promise<boolean>} - Success status (true = success, false = failure)
 */
async function install(options = {}) {
    const logger = resolveLogger(options.logger);
    const projectRoot = normalizeProjectRoot(options.projectRoot);
    const moduleRoot = path.join(projectRoot, 'src', 'modules', 'fh');
    const bmadRoot = path.join(projectRoot, '_bmad');
    const fhRoot = path.join(bmadRoot, 'fh');
    const installedIDEs = validatePlatforms(options.installedIDEs, logger);

    try {
        logger.log('Installing File Harmonizer module...');

        if (!(await pathExists(moduleRoot))) {
            throw new Error(`Module directory not found at ${moduleRoot}`);
        }

        await verifyModuleFiles(moduleRoot, logger);

        const moduleMetadata = await loadModuleMetadata(moduleRoot, logger);

        await ensureDir(fhRoot);

        // Check if LENS is installed; if not, install it
        const lensRoot = path.join(bmadRoot, 'lens');
        if (!(await pathExists(lensRoot))) {
            logger.log('  → LENS not found, installing LENS module first...');
            const lensInstaller = path.join(projectRoot, 'src', 'modules', 'lens', '_module-installer', 'installer.js');
            if (await pathExists(lensInstaller)) {
                const lensModule = require(lensInstaller);
                if (typeof lensModule.install === 'function') {
                    await lensModule.install({ projectRoot, logger, installedIDEs });
                    logger.log('  ✓ LENS installation complete');
                } else {
                    logger.warn('  ⚠ LENS installer found but install function not available');
                }
            } else {
                logger.warn('  ⚠ LENS module not found at expected location');
            }
        } else {
            logger.log('  ✓ LENS already installed');
        }

        const agentsSource = path.join(moduleRoot, 'agents');
        const agentsDest = path.join(fhRoot, 'agents');
        if (await pathExists(agentsSource)) {
            await copyDirRecursive(agentsSource, agentsDest, {
                overwrite: false,
                logger,
                projectRoot,
                label: 'agent'
            });
        }

        const workflowsSource = path.join(moduleRoot, 'workflows');
        const workflowsDest = path.join(fhRoot, 'workflows');
        if (await pathExists(workflowsSource)) {
            await copyDirRecursive(workflowsSource, workflowsDest, {
                overwrite: false,
                logger,
                projectRoot,
                label: 'workflow'
            });
        }

        const resourcesSource = path.join(moduleRoot, 'resources');
        const resourcesDest = path.join(fhRoot, 'resources');
        if (await pathExists(resourcesSource)) {
            await copyDirRecursive(resourcesSource, resourcesDest, {
                overwrite: false,
                logger,
                projectRoot,
                label: 'resource'
            });
        }

        const docsSource = path.join(moduleRoot, 'docs');
        const docsDest = path.join(fhRoot, 'docs');
        if (await pathExists(docsSource)) {
            await copyDirRecursive(docsSource, docsDest, {
                overwrite: false,
                logger,
                projectRoot,
                label: 'doc'
            });
        }

        const promptsSource = path.join(moduleRoot, 'prompts');
        const promptsDest = path.join(projectRoot, '.github', 'prompts');
        if (await pathExists(promptsSource)) {
            await copyDirRecursive(promptsSource, promptsDest, {
                overwrite: false,
                logger,
                projectRoot,
                label: 'prompt'
            });
        }

        const configFiles = ['module.yaml', 'module.json', 'README.md', 'TODO.md', 'INSTALLATION.md', 'package.json'];
        for (const configFile of configFiles) {
            const configSource = path.join(moduleRoot, configFile);
            if (await pathExists(configSource)) {
                const configDest = path.join(fhRoot, configFile);
                await copyFile(configSource, configDest);
                logger.log(`✓ Installed config: ${path.relative(projectRoot, configDest)}`);
            }
        }

        await updateManifest(bmadRoot, 'fh', 'standalone', moduleMetadata.version, logger);

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
    const installedRoot = path.join(projectRoot, '_bmad', 'fh');

    try {
        if (!(await pathExists(moduleRoot))) {
            throw new Error('Source module directory not found');
        }

        if (!(await pathExists(installedRoot))) {
            throw new Error('Installed module directory not found');
        }

        const moduleMetadata = await loadModuleMetadata(moduleRoot, logger);

        logger.log('File Harmonizer Module Status');
        logger.log('  Module: file-harmonizer');
        logger.log('  Code: fh');
        logger.log(`  Version: ${moduleMetadata.version}`);
        logger.log(`  Source: ${moduleRoot}`);
        logger.log(`  Installed: ${installedRoot}`);
        logger.log('  Status: ✓ Installed');
        return true;
    } catch (error) {
        logger.error(`Status check failed: ${error.message}`);
        return false;
    }
}

module.exports = { install, status };

// CLI entry point
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
