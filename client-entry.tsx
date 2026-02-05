import config from './package.json';
import { plugin } from './src/today';
import { Options, Func, ViewOptions } from './types/utils';

declare const growiFacade : {
  markdownRenderer?: {
    optionsGenerators: {
      customGenerateViewOptions: (path: string, options: Options, toc: Func) => ViewOptions,
      generateViewOptions: (path: string, options: Options, toc: Func) => ViewOptions,
      generatePreviewOptions: (path: string, options: Options, toc: Func) => ViewOptions,
      customGeneratePreviewOptions: (path: string, options: Options, toc: Func) => ViewOptions,
    },
  },
};

const activate = (): void => {
  console.log(`Activating ${config.name} v${config.version}...`);

  if (growiFacade == null || growiFacade.markdownRenderer == null) {
    return;
  }

  const { optionsGenerators } = growiFacade.markdownRenderer;

  // For page view
  optionsGenerators.customGenerateViewOptions = (...args) => {
    const options = optionsGenerators.generateViewOptions(...args);
    options.remarkPlugins.push(plugin as any);  // プラグイン追加（表示用）
    return options;
  };

  // For preview
  optionsGenerators.customGeneratePreviewOptions = (...args) => {
    const options = optionsGenerators.generatePreviewOptions(...args);
    options.remarkPlugins.push(plugin as any);  // プラグイン追加（プレビュー用）
    return options;
  };

  console.log(`${config.name} activated.`);
};

const deactivate = (): void => {
};

// register activate
if ((window as any).pluginActivators == null) {
  (window as any).pluginActivators = {};
}
(window as any).pluginActivators[config.name] = {
  activate,
  deactivate,
};

console.log(`${config.name} v${config.version} is loaded.`);