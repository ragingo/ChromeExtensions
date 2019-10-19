import React, { useMemo, useCallback, ChangeEvent, useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { ChannelSection } from './ChannelSection';

const prepare = (onCompleted: () => void) => {

  const handle = setInterval(() => {
    const normalChannelSec = document.querySelector('[role="listitem"] > .p-channel_sidebar__section_heading[data-qa="channels"]');
    if (normalChannelSec) {
      clearInterval(handle);
      if (onCompleted) {
        onCompleted();
      }
    }
  }, 100);

};

class Channel {
  constructor(private elem: HTMLElement) {
  }
  public show() {
    this.elem.style.visibility = 'visible';
    this.elem.style.height = '26px';
  }
  public hide() {
    this.elem.style.visibility = 'hidden';
    this.elem.style.height = '0';
  }
}

const showChannel = (elem: HTMLElement) => {
  elem.style.visibility = 'visible';
  elem.style.height = '26px';
};

const hideChannel = (elem: HTMLElement) => {
  elem.style.visibility = 'hidden';
  elem.style.height = '0';
};

const showUnreadsChannel = (id: string) => {
  const header = document.getElementById(`header-${id}`);
  if (!header) {
    return;
  }
  header.style.height = '60px';
  header.style.visibility = 'visible';

  const spacerTop = document.getElementById(`spacer-top-${id}`);
  if (spacerTop) {
    spacerTop.style.height = '12px';
    spacerTop.style.visibility = 'visible';

    let sibling = spacerTop.nextSibling;
    while (sibling !== null) {
      if (!(sibling instanceof HTMLElement)) {
        continue;
      }
      if (sibling.id.startsWith(`message-${id}`)) {
        sibling.style.display = 'block';
        sibling = sibling.nextSibling;
      } else {
        sibling = null;
      }
    }
  }

  const spacerBottom = document.getElementById(`spacer-bottom-${id}`);
  if (spacerBottom) {
    spacerBottom.style.height = '13px';
    spacerBottom.style.visibility = 'visible';
  }
};

const hideUnreadsChannel = (id: string) => {
  const header = document.getElementById(`header-${id}`);
  if (!header) {
    return;
  }
  header.style.height = '0';
  header.style.visibility = 'hidden';

  const spacerTop = document.getElementById(`spacer-top-${id}`);
  if (spacerTop) {
    spacerTop.style.height = '0';
    spacerTop.style.visibility = 'hidden';

    let sibling = spacerTop.nextSibling;
    while (sibling !== null) {
      if (!(sibling instanceof HTMLElement)) {
        continue;
      }
      if (sibling.id.startsWith(`message-${id}`)) {
        sibling.style.display = 'none';
        sibling = sibling.nextSibling;
      } else {
        sibling = null;
      }
    }
  }

  const spacerBottom = document.getElementById(`spacer-bottom-${id}`);
  if (spacerBottom) {
    spacerBottom.style.height = '0';
    spacerBottom.style.visibility = 'hidden';
  }
};

let state = {
  starred: { filter: '', expanded: false },
  normal: { filter: '', expanded: false }
};

const loadState = () => {
  try {
    let root = {};
    Object.assign(root, JSON.parse(localStorage.getItem('slackutil-state')));
    Object.assign(state, root[currentTeamId()]);
  } catch { }
};

/**
 * local storage 上の State オブジェクトの構造
 *
 * root
 *   TeamID
 *     starred
 *       filter: string
 *       expanded: bool
 *     normal
 *       filter: string
 *       expanded: bool
 */
const saveState = () => {
  try {
    let root = {};
    Object.assign(root, JSON.parse(localStorage.getItem('slackutil-state')));

    root[currentTeamId()] = state;
    localStorage.setItem('slackutil-state', JSON.stringify(root));
  } catch { }
};

const currentTeamId = () => {
  try {
    const config = JSON.parse(localStorage.getItem('localConfig_v2'));
    return config.lastActiveTeamId;
  } catch {
    return '';
  }
};

const getChannelName = (elem: HTMLElement) => {
  return elem.firstChild.textContent;
}

const getChannelInfo = (elem: HTMLElement) => {
  return {
    id: elem.getAttribute('data-qa-channel-sidebar-channel-id') || '',
    name: getChannelName(elem)
  };
}

const updateChannelList = (type: string, channels: HTMLElement[]) => {
  channels.forEach(x => {
    hideChannel(x.parentElement);
  });

  if (!state[type].expanded) {
    return;
  }

  channels.forEach(x => {
    const name = getChannelName(x);
    let r = null;
    try {
      r = new RegExp(state[type].filter, 'i');
    } catch {
    }
    if (r && r.test(name)) {
      showChannel(x.parentElement);
    }
  });
};

const updateAllUnreadsList = (type: string, channels: HTMLElement[]) => {
  const infos = channels.map(x => {
    return getChannelInfo(x)
  });

  infos.forEach(x => {
    hideUnreadsChannel(x.id);
  });

  if (!state[type].expanded) {
    return;
  }

  infos.forEach(x => {
    let r = null;
    try {
      r = new RegExp(state[type].filter, 'i');
    } catch {
    }
    if (r && r.test(x.name)) {
      showUnreadsChannel(x.id);
    }
  });
};

const update = (
  type: string,
  filter: string,
  expanded: boolean,
  channels: HTMLElement[]
) => {
  state[type].filter = filter;
  state[type].expanded = expanded;
  console.log(state);
  saveState();
  updateChannelList(type, channels);
  updateAllUnreadsList(type, channels);
};

const App = () => {
  loadState();

  // TODO: あとで直す
  const [localState, setLocalState] = useState<Map<string, { filter: string, expanded: boolean }>>(
    new Map([
      [ 'normal', { filter: '', expanded: true } ],
      [ 'starred', { filter: '', expanded: true } ],
    ])
  );

  const sectionInfos = useMemo(() => [
    {
      type: 'normal',
      channels: Array.from<HTMLElement>(document.querySelectorAll('[role="listitem"] > a[data-drag-type="channel"][data-qa-channel-sidebar-is-starred="false"]')),
      sectionSelector: '[role="listitem"] > .p-channel_sidebar__section_heading[data-qa="channels"]'
    },
    {
      type: 'starred',
      channels: Array.from<HTMLElement>(document.querySelectorAll('[role="listitem"] > a[data-drag-type="channel"][data-qa-channel-sidebar-is-starred="true"]')),
      sectionSelector: '[role="listitem"] > .p-channel_sidebar__section_heading[data-qa="starred"]'
    }
  ], []);

  // const unreadsButton = document.querySelector('[role="listitem"] > button[data-sidebar-link-id="Punreads"] > span[data-qa="channel_sidebar_name_page_punreads"]');
  // if (unreadsButton) {
  //   unreadsButton.addEventListener('click', () => {
  //     for (let [k, v] of sectionInfos) {
  //       updateAllUnreadsList(k, v);
  //     }
  //   });
  // }

  return (
    <div className="App">
      {sectionInfos.map(info => {
        return (
          <ChannelSection
            key={info.type}
            type={info.type}
            sectionSelector={info.sectionSelector}
            filter={localState.get(info.type).filter}
            onFilterTextChanged={v => {
              console.log(v);
              const s = localState;
              s.set(info.type, { filter: v, expanded: s.get(info.type).expanded });
              setLocalState(s);
              update(info.type, v, state[info.type].expanded, info.channels);
            }}
            onCollapsed={() => {
              const s = localState;
              s.set(info.type, { filter: s.get(info.type).filter, expanded: false });
              setLocalState(s);
              update(info.type, state[info.type].filter, false, info.channels);
            }}
            onExpanded={() => {
              const s = localState;
              s.set(info.type, { filter: s.get(info.type).filter, expanded: true });
              setLocalState(s);
              update(info.type, state[info.type].filter, true, info.channels);
            }}
          />
        );
      })}
    </div>
  );
};

prepare(() => {
  const rootContainer = document.createElement('div');
  rootContainer.id = 'slack-util-container';
  rootContainer.style.display = 'none';
  document.body.appendChild(rootContainer);

  ReactDOM.render(
    <App />,
    rootContainer
  );
});
