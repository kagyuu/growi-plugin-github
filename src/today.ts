import { getPackedSettings } from 'http2';

import type { Plugin } from 'unified';
import { visit } from 'unist-util-visit';

interface GrowiNode extends Node {
  name: string;
  type: string;
  attributes: {[key: string]: string}
  children: GrowiNode[];
  value: string;
}

export const plugin: Plugin = function() {

  return (tree) => {
    visit(tree, (node) => {
      const n = node as unknown as GrowiNode;
      try {
        if (n.type === 'leafGrowiPluginDirective' && n.name === 'calendar') {
          n.type = 'html';
          n.value = `<div style="color: red;">TODAY IS TODAY</div>`;
          console.log(n);
        }
      }catch (e) {
        n.type = 'html';
        n.value = `<div style="color: red;">Error: ${(e as Error).message}</div>`;
      }
    });
  };
};
