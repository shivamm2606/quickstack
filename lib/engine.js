import fs   from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);
const PARTIALS_DIR = path.join(__dirname, '..', 'templates', 'partials');

// Sets React, Router, and Build tool versions for each project.
export async function updatePackages(target, preset, config, features) {
  const rootPkgPath   = path.join(target, 'package.json');
  const clientPkgPath = path.join(target, 'client', 'package.json');
  const serverPkgPath = path.join(target, 'server', 'package.json');
  
  const rootPkg   = await fs.readJson(rootPkgPath);
  const clientPkg = await fs.readJson(clientPkgPath);
  const serverPkg = await fs.readJson(serverPkgPath);

  // Set the correct React/Vite versions in client
  clientPkg.dependencies['react']            = preset.react;
  clientPkg.dependencies['react-dom']        = preset.react;
  clientPkg.dependencies['react-router-dom'] = preset.router;

  if (preset.tailwind === 'v3') {
    clientPkg.devDependencies['tailwindcss']     = preset.tailwindVer;
    clientPkg.devDependencies['autoprefixer']    = '^10.4.17';
    clientPkg.devDependencies['postcss']         = '^8.4.35';
    delete clientPkg.devDependencies['@tailwindcss/vite'];
  } else {
    clientPkg.devDependencies['tailwindcss']     = preset.tailwindVer;
    clientPkg.devDependencies['@tailwindcss/vite'] = preset.tailwindVite;
    delete clientPkg.devDependencies['autoprefixer'];
    delete clientPkg.devDependencies['postcss'];
  }

  clientPkg.devDependencies['vite']                  = preset.vite;
  clientPkg.devDependencies['@vitejs/plugin-react']  = preset.viteReact;

  // Add feature dependencies if any
  for (const featureKey of config.chosenFeatures) {
    const feature = features[featureKey];
    if (feature && feature.dependencies) {
      // Direct Dependencies
      if (feature.dependencies.client) {
        clientPkg.dependencies = { ...(clientPkg.dependencies || {}), ...feature.dependencies.client };
      }
      if (feature.dependencies.server) {
        serverPkg.dependencies = { ...(serverPkg.dependencies || {}), ...feature.dependencies.server };
      }
      if (feature.dependencies.root) {
        rootPkg.dependencies = { ...(rootPkg.dependencies || {}), ...feature.dependencies.root };
      }
      
      // Dev Dependencies
      if (feature.dependencies.devDependencies) {
        const { client, server, root } = feature.dependencies.devDependencies;
        if (client) clientPkg.devDependencies = { ...(clientPkg.devDependencies || {}), ...client };
        if (server) serverPkg.devDependencies = { ...(serverPkg.devDependencies || {}), ...server };
        if (root)   rootPkg.devDependencies   = { ...(rootPkg.devDependencies || {}),   ...root   };
      }
    }
  }

  await fs.writeJson(rootPkgPath,   rootPkg,   { spaces: 2 });
  await fs.writeJson(clientPkgPath, clientPkg, { spaces: 2 });
  await fs.writeJson(serverPkgPath, serverPkg, { spaces: 2 });
}

// Sets the CSS directives in index.css for v3 (@tailwind) or v4 (@import).
export async function setupTailwind(target, preset) {
  const cssPath = path.join(target, 'client', 'src', 'index.css');
  
  let content = await fs.readFile(cssPath, 'utf8');
  const versionSnippet = await fs.readFile(path.join(PARTIALS_DIR, `tailwind-${preset.tailwind}.css`), 'utf8');

  // Replace the anchor comment with the actual Tailwind directives
  content = content.replace('/* QUICKSTACK_TAILWIND_DIRECTIVES */', versionSnippet);
  await fs.writeFile(cssPath, content, 'utf8');

  // If it's v3, we need to create the two config files required
  if (preset.tailwind === 'v3') {
    const v3Config = await fs.readFile(path.join(PARTIALS_DIR, 'tailwind-v3.config.js'), 'utf8');
    await fs.writeFile(path.join(target, 'client', 'tailwind.config.js'), v3Config, 'utf8');

    const v3Postcss = await fs.readFile(path.join(PARTIALS_DIR, 'postcss-v3.config.js'), 'utf8');
    await fs.writeFile(path.join(target, 'client', 'postcss.config.js'), v3Postcss, 'utf8');
  }
}

// Adds the Tailwind plugin in vite.config.js
export async function setupVite(target, preset) {
  const configPath = path.join(target, 'client', 'vite.config.js');
  let content = await fs.readFile(configPath, 'utf8');

  if (preset.tailwind === 'v4') {
    // For v4, we insert the import and the plugin call
    content = content.replace('/* QUICKSTACK_VITE_IMPORT */', "import tailwind from '@tailwindcss/vite'");
    content = content.replace('/* QUICKSTACK_VITE_PLUGIN */', 'tailwind()');
  } else {
    // For v3, clean up the comments
    content = content.replace('/* QUICKSTACK_VITE_IMPORT */', '');
    content = content.replace('/* QUICKSTACK_VITE_PLUGIN */', '');
  }

  await fs.writeFile(configPath, content, 'utf8');
}

