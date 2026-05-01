const fs = require('fs');
const path = require('path');
const settingsPath = path.join(process.env.HOME, 'Library', 'Application Support', 'Code', 'User', 'settings.json');
const settings = JSON.parse(fs.readFileSync(settingsPath, 'utf8'));

// Global suggest disabled
settings['editor.wordBasedSuggestions'] = 'off';
settings['editor.acceptSuggestionOnEnter'] = 'off';
settings['editor.acceptSuggestionOnCommitCharacter'] = false;
settings['editor.snippetSuggestions'] = 'none';
settings['editor.suggest.showWords'] = false;
settings['editor.suggest.showSnippets'] = false;
settings['editor.suggest.showClasses'] = false;
settings['editor.suggest.showFunctions'] = false;
settings['editor.suggest.showVariables'] = false;
settings['editor.hover.enabled'] = false;
settings['editor.parameterHints.enabled'] = false;
settings['editor.quickSuggestionsDelay'] = 999999;
settings['editor.inlayHints.enabled'] = 'off';

// Also turn off quick suggestions completely just in case
settings['editor.quickSuggestions'] = {
  "other": "off",
  "comments": "off",
  "strings": "off"
};

// In Markdown disabled
if (!settings['[markdown]']) settings['[markdown]'] = {};
settings['[markdown]']['editor.wordBasedSuggestions'] = 'off';
settings['[markdown]']['editor.acceptSuggestionOnEnter'] = 'off';
settings['[markdown]']['editor.quickSuggestions'] = {
  "other": "off",
  "comments": "off",
  "strings": "off"
};

fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2));
console.log('Settings updated successfully!');
