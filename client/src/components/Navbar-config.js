export const RoleTypes = {
  none: 0,
  user: 1,
  admin: 2
}

export const checkPermissions = (permissions, UserRoleType) => {
  return permissions.includes(UserRoleType)
}

export const pages = [
  { route: '/workouts', title: 'Workouts' },
  { route: '/workouts/favorites', title: 'Favorite Workouts', permissions: [RoleTypes.user, RoleTypes.admin] },
  { route: '/workouts/myworkouts', title: 'My Workouts', permissions: [RoleTypes.user, RoleTypes.admin] },
  { route: '/login', title: 'Login', permissions: [RoleTypes.none] },
  { route: '/signup', title: 'Signup', permissions: [RoleTypes.none] },
];
export const settings = [
  // { route: '/profile', title: 'Profile', permissions: [RoleTypes.user, RoleTypes.admin] },
  { route: '/account', title: 'Account', permissions: [RoleTypes.user, RoleTypes.admin] },
  { route: '/about', title: 'About'},
  { route: '/admin-panel', title: 'Admin Panel', permissions: [RoleTypes.admin]}
];