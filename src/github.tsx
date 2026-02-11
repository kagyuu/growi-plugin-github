import type { Plugin } from 'unified';
import { visit } from 'unist-util-visit';
import hljs from 'highlight.js';
import 'highlight.js/styles/github-dark.css';

import './github.css'

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

      if (n.name !== 'github') return;

      const attributeLang = n.attributes['lang'] 
        ? n.attributes['lang'] 
        : (n.attributes['language'] ? n.attributes['language'] : 'plaintext');
      const attributeUrl = n.attributes['url'];

      // UUIDを計算する
      const uuid = "github-" + Math.random().toString(36).slice(2);

      // GrowiNode の value には、複雑な HTML を直接書けないため、id 属性を付与してから
      // DOM 上で書き換える方法を取る
      n.type = 'html';
      n.value = `<div class="growi-plugin-github-window-container" id="${uuid}"></div>`

      const id = setInterval(() => {
        if (document.querySelector('#' + uuid) != null) {
          createCode(attributeLang, attributeUrl).then(codeHtml => {
            document.querySelector('#' + uuid)!.innerHTML = codeHtml;
          });
          clearInterval(id);
        }
      }, 100);
    });
  };
};

const createCode = async function(attributeLang: string, attributeUrl: string): Promise<string> {
  try {
    const response = await fetch(attributeUrl);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const content = await response.text();

    const html = [];
    html.push('<div class="growi-plugin-github-window-title">');
    html.push(`<a href="${attributeUrl}" target="_blank" rel="noopener noreferrer">${attributeUrl}</a>`);
    html.push('</div>');
    html.push('<div class="growi-plugin-github-code"><pre><code>');
    html.push(hljs.highlight(content, { language: attributeLang, ignoreIllegals: true}).value);
    html.push('</code></pre></div>');
    return html.join('');

  } catch (error) {
    console.error('Failed to fetch content from URL:', attributeUrl, error);
    
    return `Error loading content from ${attributeUrl}: ${error instanceof Error ? error.message : 'Unknown error'}`;
  }
}
