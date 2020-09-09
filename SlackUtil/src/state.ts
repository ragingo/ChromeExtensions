export let state = {
  normal: { filter: '' }
};

export const loadState = () => {
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
 *     normal
 *       filter: string
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
