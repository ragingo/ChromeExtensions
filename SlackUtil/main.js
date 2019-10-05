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
        updateChannelList(type, channels);
      },
      () => {
        state[type].expanded = false;
        updateChannelList(type, channels);
      }
    );
  section.insertBefore(button, section.firstChild);
};

const applyFilterInputText = (type, section, channels) => {
  const input =
    createFilterInputText(
      name,
      e => {
        state[type].filter = e.target.value;
        updateChannelList(type, channels);
      }
    );
  section.insertBefore(input, section.firstChild);
};

const main = () => {
  const normalChannelSec = document.querySelector('[role="listitem"] > .p-channel_sidebar__section_heading[data-qa="channels"]');
  if (normalChannelSec) {
    const normalChannels = Array.from(document.querySelectorAll('[role="listitem"] > a[data-drag-type="channel"][data-qa-channel-sidebar-is-starred="false"]'));
    normalChannelSec.style.flexFlow = 'wrap-reverse';
    normalChannels
      .forEach(x => {
        hideChannel(x.parentElement);
      });
    applyExpandButton('normal', normalChannelSec, normalChannels);
    applyFilterInputText('normal', normalChannelSec, normalChannels);
  }

  const starredChannelSec = document.querySelector('[role="listitem"] > .p-channel_sidebar__section_heading[data-qa="starred"]');
  if (starredChannelSec) {
    const starredChannels = Array.from(document.querySelectorAll('[role="listitem"] > a[data-drag-type="channel"][data-qa-channel-sidebar-is-starred="true"]'));
    starredChannelSec.style.flexFlow = 'wrap-reverse';
    starredChannels
      .forEach(x => {
        hideChannel(x.parentElement);
      });
    applyExpandButton('starred', starredChannelSec, starredChannels);
    applyFilterInputText('starred', starredChannelSec, starredChannels);
  }
};

prepare(() => {
  main();
});
