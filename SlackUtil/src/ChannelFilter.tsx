/// <reference types="chrome" />

import React from 'react';
import { ExpandButton } from './ExpandButton';

export const ChannelFilter = (props: {
  filter: string,
  onFilterTextChanged: (value: string) => void,
  onExpanded: () => void,
  onCollapsed: () => void
}) => {
  return (
    <div>
      <input
        onChange={e => props.onFilterTextChanged(e.target.value)}
        placeholder={chrome.i18n.getMessage('app_filter_placeholder')}
        value={props.filter}
      />
      <ExpandButton onCollapsed={props.onCollapsed} onExpanded={props.onExpanded} />
    </div>
  );
};
