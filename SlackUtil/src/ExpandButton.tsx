import React, { useState, useCallback, useEffect } from 'react';
import classNames from 'classnames';

export const ExpandButton = (props: {
  onExpanded: () => void,
  onCollapsed: () => void
}) => {

  const [className, setClassName] = useState('is-collapsed');
  const [isCollapsed, setCollapsed] = useState(true);

  const onClick = useCallback(() => {
    setCollapsed(!isCollapsed);
    if (isCollapsed) {
      props.onCollapsed();
    } else {
      props.onExpanded();
    }
  }, [isCollapsed]);

  useEffect(() => {
    const names = classNames('ExpandButton', {
      'is-collapsed': isCollapsed
    });
    setClassName(names);
  }, [isCollapsed]);

  return (
    <button className={className} onClick={onClick}>
      {isCollapsed ? '🔼' : '🔽'}
    </button>
  );

};
