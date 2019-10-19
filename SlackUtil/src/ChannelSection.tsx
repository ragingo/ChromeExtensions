import React, { useMemo, useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { ChannelFilter } from './ChannelFilter';

type Props = {
  type: string,
  sectionSelector: string,
  // channelsSelector: string,
  filter: string,
  onFilterTextChanged: (value: string) => void,
  onExpanded: () => void,
  onCollapsed: () => void
};

export const ChannelSection = (props: Props) => {
  const section = document.querySelector(props.sectionSelector);

  // const channels = useMemo(() => {
  //   return Array.from<HTMLElement>(document.querySelectorAll(props.channelsSelector));
  // }, [props.channelsSelector]);

  const customMenuWrapper = useMemo(() => {
    if (!section) {
      return null;
    }
    const wrapper = document.createElement('div');
    wrapper.className = 'ChannelSectionWrapper';
    wrapper.style.marginLeft = '15px';
    console.log(section);
    section.parentElement.parentElement.insertBefore(wrapper, section.parentElement.nextSibling);
    return wrapper;
  }, [section]);

  // const [filter, setFilter] = useState(props.filter);

  if (!section) {
    return null;
  }
  console.log('props.filter', props.filter);

  return (
    <>
      {ReactDOM.createPortal(
        <ChannelFilter
          filter={props.filter}
          onFilterTextChanged={props.onFilterTextChanged}
          onCollapsed={props.onCollapsed}
          onExpanded={props.onExpanded}
        />,
        customMenuWrapper)
      }
    </>
  );

};
