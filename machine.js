import { interpret } from 'robot3';
const { create, freeze } = Object;

function valueEnumerable(value) {
  return { enumerable: true, value };
}

function createCurrent(service) {
  return freeze(create(service.machine.state, {
    context: valueEnumerable(service.context || {}),
    service: valueEnumerable(service)
  }));
}

export function createUseMachine(useMemo, useState) {
  return function useMachine(machine) {
    let service = useMemo(() => {
      return interpret(machine, service => {
        setCurrent(createCurrent(service));
      });
    }, [machine]);
  
    let [currentState, setCurrent] = useState(createCurrent(service));
    let current = useMemo(() => (
      currentState.service === service ? currentState : createCurrent(service)
    ), [service, currentState]);
  
    return [current, service.send, service];
  };
}

