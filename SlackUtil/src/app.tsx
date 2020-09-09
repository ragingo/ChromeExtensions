import React, { useCallback, useEffect, useMemo, useState } from 'react';
import ReactDOM from 'react-dom';
import { ChannelFilter } from './ChannelFilter';

const prepare = (onCompleted: () => void) => {
  const handle = setInterval(() => {
    const sidebarHeader = document.querySelector('.p-top_nav__sidebar');
    if (sidebarHeader) {
      clearInterval(handle);
      if (onCompleted) {
        onCompleted();
      }
    }
  }, 100);
};

const CHANNEL_ITEM_SELECTOR = '.p-channel_sidebar__static_list__item.c-virtual_list__item[data-qa="virtual-list-item"]';
const CHANNEL_ITEM_NAME_SELECTOR = `${CHANNEL_ITEM_SELECTOR} > a[data-qa-channel-sidebar-channel-type="channel"] > .p-channel_sidebar__name`;

const App = () => {
  const [filter, setFilter] = useState<string>('');
  const [observer, setObserver] = useState<MutationObserver | null>(null);

  const channelItems = useMemo(() => document.querySelectorAll<HTMLElement>(CHANNEL_ITEM_NAME_SELECTOR), []);

  useEffect(() => {
    if (observer) {
      observer.disconnect();
    }

    const newObserver = new MutationObserver((x) => {
      x.forEach((y) => {
        if (y.type != 'childList') {
          return;
        }
        if (!y.addedNodes) {
          return;
        }
        y.addedNodes.forEach((z) => {
          const elem = z as HTMLElement;
          const targets = elem.querySelectorAll('a[data-qa-channel-sidebar-channel="true"] > .p-channel_sidebar__name');
          targets.forEach((t) => {
            let r = null;
            try {
              r = new RegExp(filter, 'i');
            } catch {
            }
            if (r && r.test(t.textContent)) {
              console.log('slackutil', t.textContent, r);
              t.parentElement.parentElement.style.display = 'block';
            } else {
              t.parentElement.parentElement.style.display = 'none';
            }
          });
        });
      });
    });

    const options = { attributes: false, characterData: false, childList: true, subtree: true } as MutationObserverInit;
    newObserver.observe(document.querySelector(CHANNEL_ITEM_SELECTOR)!.parentElement, options);
    setObserver(newObserver);
  }, [filter]);

  const onFilterChange = useCallback((s) => {
    setFilter(s);
  }, []);

  const style = {
    margin: "auto 16px"
  };

  return (
    <div className="App">
      <label style={ style }>Channel Filter</label>
      <ChannelFilter filter={filter} onFilterTextChanged={onFilterChange} />
    </div>
  );
};

prepare(() => {
  const root = document.createElement('div');
  root.id = 'slack-util-root';
  root.style.display = 'block';

  const target = document.querySelector('.p-top_nav[data-qa="top-nav"]');
  target.insertBefore(root, target.firstChild);

  ReactDOM.render(<App />, root);
});
