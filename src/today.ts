import type { Plugin } from 'unified';
import { visit } from 'unist-util-visit';

interface GrowiNode extends Node {
  name: string;
  type: string;
  attributes: {[key: string]: string}
  children: GrowiNode[];
  value: string;
  position: {
    start: { line: number; column: number; offset: number; };
    end: { line: number; column: number; offset: number; };
  }
}

export const plugin: Plugin = function() {
  return (tree) => {
    visit(tree, (node) => {
      const n = node as unknown as GrowiNode;

      if (n.name !== 'today') return;
      
      console.log(n);

      n.type = 'html';
      n.value = '<fieldset><legend>2026-02-03</legend><meter value="33.54775462963" min="0" max="365" title="9.1% (33.5/365)" style="width:75px">9.1% (33.5/365)</meter></fieldset>';      
    });
  };
};

