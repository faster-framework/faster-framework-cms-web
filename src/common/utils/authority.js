import { getStore } from './store';

export function getAuthority(str) {
  const store = getStore();
  if (!store) {
    return null;
  }
  const authorityString =
    typeof str === 'undefined'
      ? (store.getState().user.currentUser || {}).permissions
      : str;

  let authority;

  try {
    if (authorityString) {
      authority = JSON.parse(authorityString);
    }
  } catch (e) {
    authority = authorityString;
  }

  if (typeof authority === 'string') {
    return [authority];
  }

  return authority;
}
