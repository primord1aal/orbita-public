'use strict';

(() => {
  const views = Object.freeze({
    passenger: {
      title: 'Куда едем?',
      subtitle: 'Посмотрите пример выбора начальной и конечной точки.',
      action: 'Показать маршрут',
      result: 'Показан условный маршрут от точки А до точки Б. Поездка не создана.',
    },
    driver: {
      title: 'На линии',
      subtitle: 'Посмотрите, как выглядит карточка предложения.',
      action: 'Посмотреть следующий экран',
      result: 'Пример поездки открыт. Реальное предложение не принималось.',
    },
    dispatcher: {
      title: 'Обзор поездок',
      subtitle: 'Пример общего вида диспетчерского интерфейса.',
      action: 'Показать поездку на схеме',
      result: 'Показана условная поездка. Никакие серверные действия не выполнялись.',
    },
  });
  const tabs = Array.from(document.querySelectorAll('[data-view]'));
  const panel = document.getElementById('demo-panel');
  const route = document.getElementById('demo-route');
  const status = document.getElementById('demo-status');
  const action = document.getElementById('demo-action');
  let current = 'passenger';

  function reset() {
    route.hidden = true;
    route.setAttribute('hidden', '');
    status.textContent = 'Выберите пример или посмотрите маршрут.';
    action.disabled = false;
  }

  function show(name) {
    if (!Object.hasOwn(views, name)) return;
    current = name;
    const view = views[name];
    for (const tab of tabs) {
      const selected = tab.dataset.view === name;
      tab.classList.toggle('active', selected);
      tab.setAttribute('aria-selected', String(selected));
      tab.tabIndex = selected ? 0 : -1;
    }
    panel.setAttribute('aria-labelledby', `tab-${name}`);
    document.getElementById('view-title').textContent = view.title;
    document.getElementById('view-subtitle').textContent = view.subtitle;
    document.getElementById('view-content').replaceChildren(
      document.getElementById(`${name}-content`).content.cloneNode(true),
    );
    action.textContent = view.action;
    reset();
  }

  for (const [index, tab] of tabs.entries()) {
    tab.addEventListener('click', () => show(tab.dataset.view));
    tab.addEventListener('keydown', (event) => {
      let next;
      if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
      if (event.key === 'ArrowLeft') next = (index + tabs.length - 1) % tabs.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = tabs.length - 1;
      if (next === undefined) return;
      event.preventDefault();
      show(tabs[next].dataset.view);
      tabs[next].focus();
    });
  }
  action.addEventListener('click', () => {
    route.hidden = false;
    route.removeAttribute('hidden');
    status.textContent = views[current].result;
    action.disabled = true;
  });
  document.getElementById('demo-reset').addEventListener('click', reset);
  show(current);
})();
