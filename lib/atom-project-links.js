'use babel';

import { File } from 'atom';
import { join } from 'path';

export function getLinkProvider() { // registered in project://package.json
  return {
    priority: 1,
    wordRegExp: /project:\/\/([^\s]+)/,
    async getSuggestionForWord(
      textEditor,
      text,
      range
    ){
      const match = text.match(/^project:\/\/([^\s]+)$/);
      if(!match) return; //should never happen by why not check

      const projectPath = match[1];

      const te = textEditor;
      const [contextPath, __] = atom.project.relativizePath(textEditor.getPath());
      const file = new File(join(contextPath,projectPath), false);
      if(await file.exists()){
        return {
          range,
          async callback() {
            atom.workspace.open(
              await file.getRealPath()
            );
          },
        };
      }
    },
  };
}
