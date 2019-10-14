/// <reference types="chrome" />

import React from 'react';
import { ExpandButton } from './ExpandButton';

export const ChannelFilter = (props: {
  filter: string,
  onFilterTextChanged: (e: React.ChangeEvent<HTMLInputElement>) => void,
  onExpanded: () => void,
  onCollapsed: () => void
}) => {
  return (
    <div>
      <input
        onChange={props.onFilterTextChanged}
        placeholder={chrome.i18n.getMessage('app_filter_placeholder')}
        value={props.filter}
      />
      <ExpandButton onCollapsed={props.onCollapsed} onExpanded={props.onExpanded} />
    </div>
  );
};
