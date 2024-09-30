export const LOCATION = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  BUTTON_ACCORDIONS: '/button-accordions',
  NOT_FOUND: '*',
};

export const API = {
  LOGIN: 'auth/login',
  REGISTER: 'auth/register',
  MY_PROFILE: 'auth/profile',
};

export const locations = [
  {
    path: LOCATION.TAB,
    name: 'Tabs',
  },
  {
    path: LOCATION.BUTTON_ACCORDIONS,
    name: 'Button',
  },
  {
    path: LOCATION.IMAGES,
    name: 'Image',
  },
  {
    path: LOCATION.FORM_BASIC,
    name: 'Form basic',
  },
  {
    path: LOCATION.FORM_LOGIN,
    name: 'Form Login',
  },
  {
    path: LOCATION.POSTS,
    name: 'Posts',
  },
  {
    path: LOCATION.USE_CALLBACK,
    name: 'Callback',
  },
  {
    path: LOCATION.USE_REF,
    name: 'Ref',
  },
  {
    path: LOCATION.MUSIC,
    name: 'Music',
  },
  {
    path: LOCATION.COUNTER,
    name: 'Counter',
  },
  {
    path: LOCATION.TODO,
    name: 'Todo',
  },
  {
    path: LOCATION.NOT_FOUND,
    name: 'Not found',
    isHidden: true,
  },
];

export const TOKEN = 'TOKEN';
export const REFRESH_TOKEN = 'REFRESH_TOKEN';

export const USD = 24500;
