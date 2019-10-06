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

const isShown = elem => {
  return elem.style.height === '26px' && elem.style.visibility === 'visible';
};

const createExpandButton = (onExpanded, onCollapsed) => {
  const button = document.createElement('button');
  button.textContent = '🔼';
  button.setAttribute('is-collapsed', 'true');
  button.addEventListener('click', () => {
    if (button.getAttribute('is-collapsed') === 'true') {
      button.textContent = '🔽';
      button.setAttribute('is-collapsed', 'false');
      if (onExpanded) {
        onExpanded();
      }
    }
    else {
      button.textContent = '🔼';
      button.setAttribute('is-collapsed', 'true');
      if (onCollapsed) {
        onCollapsed();
      }
    }
  });
  return button;
};

const createFilterInputText = (name, onTextChanged) => {
  const text = document.createElement('input');
  text.id = `channel-filter-text-${name}`;
  text.placeholder = '正規表現でフィルタ';
  text.addEventListener('input', onTextChanged);
  return text;
};

let state = {
  starred: { filter: '', expanded: false },
  normal: { filter: '', expanded: false }
};

const loadState = () => {
  try {
    Object.assign(state, JSON.parse(localStorage.getItem('slackutil-state')));
  } catch {}
};

const saveState = () => {
  try {
    localStorage.setItem('slackutil-state', JSON.stringify(state));
  } catch {}
};

const updateChannelList = (type, channels) => {
  channels.forEach(x => {
    hideChannel(x.parentElement);
  });

  if (!state[type].expanded) {
    return;
  }

  channels.forEach(x => {
    const name = x.firstChild.textContent;
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

const applyExpandButton = (type, section, channels) => {
  const button =
    createExpandButton(
      () => {
        state[type].expanded = true;
        saveState();
        updateChannelList(type, channels);
      },
      () => {
        state[type].expanded = false;
        saveState();
        updateChannelList(type, channels);
      }
    );
  // TODO: load state[type].expanded
  section.appendChild(button);
};

const applyFilterInputText = (type, section, channels) => {
  const input =
    createFilterInputText(
      name,
      e => {
        state[type].filter = e.target.value;
        saveState();
        updateChannelList(type, channels);
      }
    );
  input.value = state[type].filter;
  section.appendChild(input);
};

const main = () => {
  loadState();

  const normalChannelSec = document.querySelector('[role="listitem"] > .p-channel_sidebar__section_heading[data-qa="channels"]');
  if (normalChannelSec) {
    const normalChannels = Array.from(document.querySelectorAll('[role="listitem"] > a[data-drag-type="channel"][data-qa-channel-sidebar-is-starred="false"]'));
    normalChannels
      .forEach(x => {
        hideChannel(x.parentElement);
      });

    const wrapper = document.createElement('div');
    wrapper.style.marginLeft = '15px';
    normalChannelSec.parentElement.parentElement.insertBefore(wrapper, normalChannelSec.parentElement.nextSibling);
    applyFilterInputText('normal', wrapper, normalChannels);
    applyExpandButton('normal', wrapper, normalChannels);
  }

  const starredChannelSec = document.querySelector('[role="listitem"] > .p-channel_sidebar__section_heading[data-qa="starred"]');
  if (starredChannelSec) {
    const starredChannels = Array.from(document.querySelectorAll('[role="listitem"] > a[data-drag-type="channel"][data-qa-channel-sidebar-is-starred="true"]'));
    starredChannels
      .forEach(x => {
        hideChannel(x.parentElement);
      });

    const wrapper = document.createElement('div');
    wrapper.style.marginLeft = '15px';
    starredChannelSec.parentElement.parentElement.insertBefore(wrapper, starredChannelSec.parentElement.nextSibling);
    applyFilterInputText('starred', wrapper, starredChannels);
    applyExpandButton('starred', wrapper, starredChannels);
  }
};

prepare(() => {
  main();
});
