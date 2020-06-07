// prettier-ignore
import { Rule, SchematicContext, Tree, url, apply, template, mergeWith, SchematicsException, move,
} from "@angular-devkit/schematics";
import { strings } from "@angular-devkit/core";
import { parseName } from "@schematics/angular/utility/parse-name";
import { buildDefaultPath } from "@schematics/angular/utility/project";

import { Schema } from "./schema";

// You don't have to export the function as default. You can also have more than one rule factory
// per file.
export function machine(_options: Schema): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    const workspaceConfigBuffer = tree.read("angular.json");
    if (!workspaceConfigBuffer) {
      throw new SchematicsException("Not an Amgular CLI workspace");
    }

    const workspaceConfig = JSON.parse(workspaceConfigBuffer.toString());
    const projectName = _options.project || workspaceConfig.defaultProject;
    // console.log('aaaaa', workspaceConfig);
    
    const project = workspaceConfig.projects[projectName];

    const defaultProjectPath = buildDefaultPath(project);

    const { name, path } = parseName(defaultProjectPath, _options.name);

    const sourceTemplates = url("./files");

    const sourceParametrizedTemplates = apply(sourceTemplates, [
      template({
        ..._options,
        ...strings,
        name,
      }),
      move(path),
    ]);
    return mergeWith(sourceParametrizedTemplates)(tree, _context);
  };
}
