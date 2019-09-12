import { interpret } from 'robot3';
const { create, freeze } = Object;

function createCurrent(service) {
  return freeze(create(service.machine.state, {
    context: { enumerable: true, value: service.context || {} }
  }));
}

export function createUseMachine(useMemo, useState) {
  return function useMachine(machine) {
    let service = useMemo(() => {
      return interpret(machine, service => {
        setCurrent(createCurrent(service));
      });
    }, []);
  
    let [current, setCurrent] = useState(createCurrent(service));
  
    return [current, service.send, service];
  };
}

