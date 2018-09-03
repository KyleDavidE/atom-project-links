'use babel';

import { File } from 'atom';
import { join } from 'path';

export function getLinkProvider() { // registered in project://package.json#18,19
  return {
    priority: 1,
    wordRegExp: /project:\/\/([^\s]+)/,
    async getSuggestionForWord(
      textEditor,
      text,
      range
    ){
      const url = new URL(text);

      const projectPath = url.pathname.replace(/^\/*/,"");

      const hash = (url.hash||"#").substr(1);

      const optsFromHash = hashToOptions(hash);

      const [contextPath, __] = atom.project.relativizePath(textEditor.getPath());
      const file = new File(join(contextPath,projectPath), false);
      if(await file.exists()){
        return {
          range,
          async callback() {
            atom.workspace.open(
              await file.getRealPath(),
              {
                pending: true,
                ...optsFromConfig(),
                ...optsFromHash
              }
            );
          },
        };
      }

    },
  };
}

function hashToOptions(hash){
  const match = hash.match(/^(\d+)(?:,(\d+))/);
  if(match){
    const initialLine = parseInt(match[1],10) - 1;
    const initialColumn = parseInt(match[2],10) - 1;
    return Number.isNaN(initialLine)
      ? {}
      : Number.isNaN(initialColumn)
        ? {initialLine}
        : {initialLine, initialColumn};
  }

  return {};
}


function optsFromConfig(){
  return {searchAllPanes:!!atom.config.get("atom-project-links.alwaysOpenExisting")}
}
