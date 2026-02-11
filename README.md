# GROIW Github Plugin

This is a github plugin for GROWI. It shows source codes which is stored in the Github on a your growi wiki.

## Install

Install a plugin in admin panel.

## Usage

```
$github(language=javascript,url=https://github.com/kagyuu/growi-plugin-github/blob/main/src/github.tsx)
```

* language : This plugin use https://highlightjs.org/ . You can specify following languages:
https://github.com/highlightjs/highlight.js/blob/main/SUPPORTED_LANGUAGES.md .
  * You can use 'lang' instead of 'language' as the attribute name.
  * If you omitted the language attribute (and the lang attribute), this plugin use 'plaintext' implicity.

* url : The url that you want to embed on your wiki. The url would be recongnize as following:
  * You wrote:  https://github.com/kagyuu/growi-plugin-github/blob/main/src/github.tsx
  * Get the code from: https://raw.githubusercontent.com/kagyuu/growi-plugin-github/refs/heads/main/src/github.tsx

## Options

There is no options other than language and url.

## License

MIT

