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
export type <%= classify(name) %>Event = <% for (let event of stateEvents) { %>
    | { type: '<%= event %>' }<% } %>

export const <%= camelize(name) %>GameMachine = Machine< <%= classify(name) %>Context,  <%= classify(name) %>Shema,  <%= classify(name) %>Event>(
  {
    id: '<%= dasherize(name) %>',
    initial: '<%= initialState %>',
    context: { ...<%= camelize(name) %>InitialContext },
    states: {<% for ( let state of stateTransitions ) { %><% if ( !isLast( state, stateTransitions ) ) { %>
      <%= state.state %>: {
        on: {
          <%= state.event %>: '<%= state.target %>',
        },
      },<% } else { %>
      <%= state.state %>: { type: 'final' },
    <% } %><% } %>},
  },
  {
    actions: {},
    guards: {},
  },
);
