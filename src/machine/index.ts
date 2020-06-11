// prettier-ignore
import { Rule, SchematicContext, Tree, url, apply, template, 
  mergeWith, move} from "@angular-devkit/schematics";
import { strings } from "@angular-devkit/core";
import { parseName } from "@schematics/angular/utility/parse-name";
import { buildDefaultPath } from "@schematics/angular/utility/project";

import { Schema } from "./schema";
import { WorkspaceSchema } from "@schematics/angular/utility/workspace-models";

export function machine(_options: Schema): Rule {
  // console.log('ooo', _options);

  const states = _options.states ?? "boot,active,finish";
  const stateNodes = states.split(",");
  const initialState = stateNodes[0];
  const stateEvents = stateNodes.slice(1).map((_: string) => _.toUpperCase());
  const stateTransitions = stateNodes.map((node) => {
    if (isLast(node, stateNodes)) {
      return { state: node };
    } else {
      const nextState = stateNodes[stateNodes.indexOf(node) + 1];
      return {
        state: node,
        event: nextState.toUpperCase(),
        target: nextState.toLowerCase(),
      };
    }
  });

  const contextItems = _options.context.split(",").filter((_) => _.trim());

  return (tree: Tree, _context: SchematicContext) => {
    const workspaceConfigBuffer = tree.read("angular.json");
    let targetRootPath: string;
    if (workspaceConfigBuffer) {
      const workspaceConfig: WorkspaceSchema = JSON.parse(
        workspaceConfigBuffer.toString()
      );
      const projectName = _options.project || workspaceConfig.defaultProject;
      const project = workspaceConfig.projects[projectName as string];
      targetRootPath = buildDefaultPath(project);
    } else {
      targetRootPath = ".";
    }
    const { name, path } = parseName(targetRootPath, _options.name);

    const movePath = _options.flat
      ? path
      : `${path}/${strings.dasherize(name)}`;

    console.log("mo", movePath);

    const sourceTemplates = url("./files");

    const sourceParametrizedTemplates = apply(sourceTemplates, [
      template({
        ...strings,
        isLast,
        ..._options,
        name,
        contextItems,
        stateNodes,
        initialState,
        stateEvents,
        stateTransitions,
      }),
      move(movePath),
    ]);
    return mergeWith(sourceParametrizedTemplates)(tree, _context);
  };
}

// helpers

function isLast(item: any, items: any[]): boolean {
  return items.indexOf(item) === items.length - 1;
}
