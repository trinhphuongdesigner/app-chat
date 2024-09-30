import React from 'react';

const navList = [
  {
    iconName: 'fa-regular fa-comment-dots',
    isActive: true,
  },
  {
    iconName: 'fa-solid fa-phone',
    isActive: false,
  },
  {
    iconName: 'fa-solid fa-gear',
    isActive: false,
  },
  {
    iconName: 'fa-solid fa-trash-can',
    isActive: false,
  },
  {
    iconName: 'fa-regular fa-star',
    isActive: false,
  },
  {
    iconName: 'fa-solid fa-address-book',
    isActive: false,
  },
];

function Navbar() {
  return (
    <nav className="sideNav1">
      {navList.map((nav) => (
        <li className={nav.isActive ? 'active' : ''}>
          <i className={nav.iconName} />
        </li>
      ))}
    </nav>
  );
}

export default Navbar;
