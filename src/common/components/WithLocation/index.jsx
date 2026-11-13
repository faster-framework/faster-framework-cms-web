import React from 'react';
import { useLocation } from '@umijs/max';

/**
 * umi 4 的类组件不会再自动注入路由 props，
 * 这里用一个小 HOC 把 location 传进去，保持原有类组件写法。
 */
export default function withLocation(WrappedComponent) {
  const Wrapper = props => {
    const location = useLocation();
    return <WrappedComponent {...props} location={location} />;
  };
  Wrapper.displayName = `withLocation(${WrappedComponent.displayName ||
    WrappedComponent.name ||
    'Component'})`;
  return Wrapper;
}
