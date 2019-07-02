const { registerBlockType, unregisterBlockType } = wp.blocks;
const { select, dispatch } = wp.data;
// Use a simple object as our module cache.
const cache = {};

// Define the logic for loading and swapping modules.
const loadModules = () => {
  // Create a new require.context on each HMR update; they cannot be re-used.
  // Save the currently selected block's clientId.
  const selectedBlockId = select('core/editor').getSelectedBlockClientId();
  // Clear selection before swapping out upated modules.
  dispatch('core/editor').clearSelectedBlock();
  const context = require.context('./blocks', true, /index\.js$/);

  // Contextually load, reload or skip each block.
  context.keys().forEach(key => {
    const moduler = context(key);

    if (moduler === cache[key]) {
      // require.context helpfully returns the same object reference for
      // unchanged modulers. Comparing modulers with strict equality lets us
      // pick out only the edited blocks which require re-registration.
      return;
    }

    if (cache[key]) {
      // Moduler changed, and prior copy detected: unregister old moduler.
      const oldModuler = cache[key];
      unregisterBlockType(oldModuler.name);
    }

    // Register new moduler and update cache.
    registerBlockType(moduler.name, moduler.settings);
    cache[key] = moduler;
  });

  select('core/editor')
    .getBlocks()
    .forEach(({ clientId }) => {
      dispatch('core/editor').selectBlock(clientId);
    });

  // Restore the initial block selection.
  if (selectedBlockId) {
    dispatch('core/editor').selectBlock(selectedBlockId);
  }

  // Return the context so we can access its ID later.
  return context;
};

// Trigger the initial module load and store a reference to the context
// so we can access the context's ID property.
const moduleContext = loadModules();

if (module.hot) {
  // In a hot-reloading environment, accept hot updates for that context ID.
  // Reload and compare the full tree on any child module change, but only
  // swap out changed modules (using the logic above).

  module.hot.accept(moduleContext.id, loadModules);
}
