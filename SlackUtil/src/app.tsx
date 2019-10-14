import React from 'react';
import ReactDOM from 'react-dom';
import { ChannelFilter } from './ChannelFilter';

const prepare = (onCompleted) => {

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

const showChannel = elem => {
  elem.style.visibility = 'visible';
  elem.style.height = '26px';
};

const hideChannel = elem => {
  elem.style.visibility = 'hidden';
  elem.style.height = 0;
};

const showUnreadsChannel = id => {
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
    while (sibling != null) {
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

const hideUnreadsChannel = id => {
  const header = document.getElementById(`header-${id}`);
  if (!header) {
    return;
  }
  header.style.height = 0;
  header.style.visibility = 'hidden';

  const spacerTop = document.getElementById(`spacer-top-${id}`);
  if (spacerTop) {
    spacerTop.style.height = 0;
    spacerTop.style.visibility = 'hidden';

    let sibling = spacerTop.nextSibling;
    while (sibling != null) {
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
    spacerBottom.style.height = 0;
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

const getChannelName = elem => {
  return elem.firstChild.textContent;
}

const getChannelInfo = elem => {
  const info = {};
  info.id = elem.getAttribute('data-qa-channel-sidebar-channel-id') || '';
  info.name = getChannelName(elem);
  return info;
}

const updateChannelList = (type, channels) => {
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

const updateAllUnreadsList = (type, channels) => {
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


let sectionInfos = new Map();

const main = () => {
  loadState();

  const onTextChange = (props: {
    type: string,
    channels: Element[],
    e: React.ChangeEvent<HTMLInputElement>
  }) => {
    state[props.type].filter = props.e.target.value;
    saveState();
    updateChannelList(props.type, props.channels);
    updateAllUnreadsList(props.type, props.channels);
  };
  const onExpanded = (props: {
    type: string,
    channels: Element[]
  }) => {
    state[props.type].expanded = true;
    saveState();
    updateChannelList(props.type, props.channels);
    updateAllUnreadsList(props.type, props.channels);
  };
  const onCollapsed = (props: {
    type: string,
    channels: Element[]
  }) => {
    state[props.type].expanded = false;
    saveState();
    updateChannelList(props.type, props.channels);
    updateAllUnreadsList(props.type, props.channels);
  };

  const normalChannelSec = document.querySelector('[role="listitem"] > .p-channel_sidebar__section_heading[data-qa="channels"]');
  if (normalChannelSec) {
    const normalChannels = Array.from(document.querySelectorAll('[role="listitem"] > a[data-drag-type="channel"][data-qa-channel-sidebar-is-starred="false"]'));
    const wrapper = document.createElement('div');
    wrapper.style.marginLeft = '15px';
    normalChannelSec.parentElement.parentElement.insertBefore(wrapper, normalChannelSec.parentElement.nextSibling);

    const type = 'normal';
    ReactDOM.render(
      <ChannelFilter
        filter={state[type].filter}
        onFilterTextChanged={(e: any) => onTextChange({ type: type, channels: normalChannels, e })}
        onCollapsed={() => onCollapsed({ type: type, channels: normalChannels })}
        onExpanded={() => onExpanded({ type: type, channels: normalChannels })}
      />,
      wrapper
    );
    sectionInfos.set(type, normalChannels);
  }

  const starredChannelSec = document.querySelector('[role="listitem"] > .p-channel_sidebar__section_heading[data-qa="starred"]');
  if (starredChannelSec) {
    const starredChannels = Array.from(document.querySelectorAll('[role="listitem"] > a[data-drag-type="channel"][data-qa-channel-sidebar-is-starred="true"]'));
    const wrapper = document.createElement('div');
    wrapper.style.marginLeft = '15px';
    starredChannelSec.parentElement.parentElement.insertBefore(wrapper, starredChannelSec.parentElement.nextSibling);
    const type = 'starred';
    ReactDOM.render(
      <ChannelFilter
        filter={state[type].filter}
        onFilterTextChanged={(e: any) => onTextChange({ type: type, channels: starredChannels, e })}
        onCollapsed={() => onCollapsed({ type: type, channels: starredChannels })}
        onExpanded={() => onExpanded({ type: type, channels: starredChannels })}
      />,
      wrapper
    );

    sectionInfos.set(type, starredChannels);
  }

  const unreadsButton = document.querySelector('[role="listitem"] > button[data-sidebar-link-id="Punreads"] > span[data-qa="channel_sidebar_name_page_punreads"]');
  if (unreadsButton) {
    unreadsButton.addEventListener('click', () => {
      for (let [k, v] of sectionInfos) {
        updateAllUnreadsList(k, v);
      }
    });
  }
};

const App = () => {
  return (
    <div></div>
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

  main();
});
