import { Machine, assign } from 'xstate';

export interface  <%= classify(name) %>Context {
   
}
export const <%= camelize(name) %>InitialContext:  <%= classify(name) %>Context = {
   
};

export interface <%= classify(name) %>Shema {
  states: {
    boot: {};
    init: {};
    active: {};
    finish: {};
  };
}

// prettier-ignore
export type <%= classify(name) %>Event =
  | { type: 'INIT' }
  | { type: 'ACTIVATE' }
  | { type: 'FINISH' }

export const <%= camelize(name) %>GameMachine = Machine< <%= classify(name) %>Context,  <%= classify(name) %>Shema,  <%= classify(name) %>Event>(
  {
    id: '<%= dasherize(name) %>',
    initial: 'boot',
    context: { ...<%= camelize(name) %>InitialContext },
    states: {
      boot: {
        on: {
          INIT: 'init',
        },
      },
      init: {
        on: {
          ACTIVATE: 'active',
        },
      },
      active: {
        on: {
          FINISH: 'finish',
        },
      },
      finish: { type: 'final' },
    },
  },
  {
    actions: {},
    guards: {},
  },
);
