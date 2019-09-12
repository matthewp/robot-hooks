import { createMachine, state, transition } from 'robot3';
import { createUseMachine } from '../machine.js';
import { component, useMemo, useState, html } from 'https://unpkg.com/haunted/haunted.js';

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
});