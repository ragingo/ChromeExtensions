(function () {

  const normalChannelSec = document.querySelector('[role="listitem"] > .p-channel_sidebar__section_heading[data-qa="channels"]');
  const starredSec = document.querySelector('[role="listitem"] > .p-channel_sidebar__section_heading[data-qa="starred"]');
  const normalChannels = Array.from(document.querySelectorAll('[role="listitem"] > a[data-drag-type="channel"][data-qa-channel-sidebar-is-starred="false"]'));
  const starredChannels = Array.from(document.querySelectorAll('[role="listitem"] > a[data-drag-type="channel"][data-qa-channel-sidebar-is-starred="true"]'));

  normalChannelSec.style.flexFlow = 'wrap-reverse';
  starredSec.style.flexFlow = 'wrap-reverse';

  const showChannel = elem => {
    elem.style.visibility = 'visible';
    elem.style.height = '26px';
  };
  const hideChannel = elem => {
    elem.style.visibility = 'collapse';
    elem.style.height = 0;
  };
  const isShown = elem => {
    return elem.style.height === '26px' && elem.style.visibility === 'visible';
  };

  normalChannels.forEach(x => {
    hideChannel(x.parentElement);
  });
  starredChannels.forEach(x => {
    hideChannel(x.parentElement);
  });

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

  const createFilterInputText = (onTextChanged) => {
    const text = document.createElement('input');
    text.placeholder = '正規表現でフィルタ';
    text.addEventListener('input', onTextChanged);
    return text;
  };

  const applyExpandButton = (section, channels) => {
    const button =
      createExpandButton(
        () => {
          channels.forEach(x => {
            showChannel(x.parentElement);
          });
        },
        () => {
          channels.forEach(x => {
            hideChannel(x.parentElement);
          });
        }
      );
    section.insertBefore(button, section.firstChild);
  };

  applyExpandButton(starredSec, starredChannels);
  applyExpandButton(normalChannelSec, normalChannels);

  const applyFilterInputText = (section, channels) => {
    const input =
      createFilterInputText(
        e => {
          const filter = e.target.value;
          channels.forEach(x => {
            const name = x.firstChild.textContent;
            if (new RegExp(filter, 'i').test(name)) {
              showChannel(x.parentElement);
            }
            else {
              hideChannel(x.parentElement);
            }
          });
        }
      );
    section.insertBefore(input, section.firstChild);
  };

  applyFilterInputText(starredSec, starredChannels);
  applyFilterInputText(normalChannelSec, normalChannels);
})();
