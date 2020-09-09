/// <reference types="chrome" />

import React from 'react';

export const ChannelFilter = (props: {
  filter: string,
  onFilterTextChanged: (value: string) => void,
}) => {
  return (
    <input
      onChange={e => props.onFilterTextChanged(e.target.value)}
      placeholder={chrome.i18n.getMessage('app_filter_placeholder')}
      value={props.filter}
    />
  );
};
