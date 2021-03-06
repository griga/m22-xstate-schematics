import { Machine, assign } from 'xstate';

export interface  <%= classify(name) %>Context {<% for (let item of contextItems) { %>
  <%= item %>: any;<% } %>
}
export const <%= camelize(name) %>InitialContext:  <%= classify(name) %>Context = {<% for (let item of contextItems) { %>
  <%= item %>: null,<% } %>
};

export interface <%= classify(name) %>Shema {
  states: {<% for (let state of stateNodes) { %>
    <%= state %>: {};<% } %>
  };
}

// prettier-ignore
export type <%= classify(name) %>Event = <% for (let state of stateNodes) { %>
    | { type: '<%= toUpperCase(state) %>' }<% } %>

export const <%= camelize(name) %>MachineKey = `<%= dasherize(name) %>-machine`;

export const <%= camelize(name) %>Machine = Machine<<%= classify(name) %>Context, <%= classify(name) %>Shema, <%= classify(name) %>Event>(
  {
    id: <%= camelize(name) %>MachineKey,
    initial: '<%= initialState %>',
    context: { ...<%= camelize(name) %>InitialContext },
    states: {<% for ( let state of stateNodes ) { %> 
      <%= state %>: {},<% } %>
    },
    on: {<% for ( let state of stateNodes ) { %> 
      <%= toUpperCase(state) %>: '.<%= state %>',<% } %>
    },
  },
  {
    actions: {},
    guards: {},
    services: {},
  },
);

export const <%= camelize(name) %>MachineFactory = (ctx: Partial<<%= classify(name) %>Context>) =>  <%= camelize(name) %>Machine.withContext({ ...ctx } as <%= classify(name) %>Context);

