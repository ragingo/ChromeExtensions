import React, { useMemo, useState } from 'react';
import ReactDOM from 'react-dom';
import { ChannelFilter } from './ChannelFilter';

type Props = {
  type: string,
  sectionSelector: string,
  // channelsSelector: string,
  filter: string,
  onFilterTextChanged: (e: React.ChangeEvent<HTMLInputElement>) => void,
  onExpanded: () => void,
  onCollapsed: () => void
};

export const ChannelSection = (props: Props) => {
  const section = useMemo(() => {
    return document.querySelector(props.sectionSelector);
  }, [props.sectionSelector]);

  // const channels = useMemo(() => {
  //   return Array.from<HTMLElement>(document.querySelectorAll(props.channelsSelector));
  // }, [props.channelsSelector]);

  const customMenuWrapper = useMemo(() => {
    if (section === null) {
      return null;
    }
    const wrapper = document.createElement('div');
    wrapper.style.marginLeft = '15px';
    section.parentElement.parentElement.insertBefore(wrapper, section.parentElement.nextSibling);
    return wrapper;
  }, [section]);

  // const [filter, setFilter] = useState(props.filter);

  const channelFilter = useMemo(() => {
    if (customMenuWrapper === null) {
      return <></>;
    }
    return (
      <ChannelFilter
        filter={props.filter}
        onFilterTextChanged={props.onFilterTextChanged}
        onCollapsed={props.onCollapsed}
        onExpanded={props.onExpanded}
      />);
  }, [customMenuWrapper, props.filter])


  return (
    <>
      {ReactDOM.createPortal(
        channelFilter,
        customMenuWrapper)
      }
    </>
  );

};
