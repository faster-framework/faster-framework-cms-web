import { getDvaApp } from '@umijs/max';

/**
 * umi 4 不再向 window 注入 g_app，这里统一做一层兼容：
 * 优先使用 dva 插件的 getDvaApp()，同时兼容可能存在的 window.g_app。
 */
export function getApp() {
  if (typeof window !== 'undefined' && window.g_app) {
    return window.g_app;
  }
  try {
    return getDvaApp() || null;
  } catch (e) {
    return null;
  }
}

export function getStore() {
  const app = getApp();
  if (!app) {
    return null;
  }
  return app._store || (typeof app.getStore === 'function' ? app.getStore() : null);
}

export function dispatch(action) {
  const store = getStore();
  if (store && typeof store.dispatch === 'function') {
    store.dispatch(action);
  }
}
