import { createMachine, state, transition } from 'robot3';
import { createUseMachine } from '../machine.js';
import { component, useEffect, useMemo, useState, html } from 'https://unpkg.com/haunted/haunted.js';

const useMachine = createUseMachine(useMemo, useState);

const later = () => new Promise(resolve => setTimeout(resolve, 50));

QUnit.module('useMachine', hooks => {
  QUnit.test('Basics', async assert => {
    const machine = createMachine({
      one: state(
        transition('next', 'two')
      ),
      two: state()
    });

    function App() {
      const [current, send] = useMachine(machine);
      
      return html`
        <button type="button" @click=${() => send('next')}>
          State: ${current.name}
        </button>
      `;
    }

    const Element = component(App);
    customElements.define('basics-app', Element);

    let app = new Element();
    document.body.append(app);
    let root = app.shadowRoot;

    await later();

    let btn = root.firstElementChild;
    let text = () => btn.textContent.trim();

    assert.equal(text(), 'State: one');

    btn.dispatchEvent(new MouseEvent('click'));
    await later();

    assert.equal(text(), 'State: two');
    app.remove();
  });

  QUnit.test('can change machines', async assert => {
    const basicMachine = (name) => createMachine({
      [name]: state()
    }, () => ({ name }));
    const one = basicMachine('one');
    const two = basicMachine('two');
    let setOne;

    function App() {
      const [isOne, setOne2] = useState(true);
      const [current] = useMachine(isOne ? one : two);
      const { name } = current.context;
      setOne = setOne2;

      return html`
        <div>Machine ${name}</div>
      `;
    }

    const Element = component(App);
    customElements.define('multi-machine', Element);
    let el = new Element();
    document.body.append(el);
    let text = () => el.shadowRoot.firstElementChild.textContent.trim();

    await later();

    assert.equal(text(), 'Machine one', 'the first machine');
    setOne(false);

    await later();
    assert.equal(text(), 'Machine two', 'the second machine');

    el.remove();

  });
});