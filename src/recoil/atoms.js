import { atom } from 'recoil';

export const userState = atom({
    key: 'howmuchUserState',
    default: null,
});

export const isLoggedInState = atom({
    key: 'howmuchIsLoggedInState',
    default: false,
});

export const bookmarksState = atom({
    key: 'howmuchBookmarksState',
    default: [],
});
