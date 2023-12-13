export const RoleTypes = {
  none: 0,
  user: 1,
  admin: 2,
  master: 3
}

export const checkPermissions = (permissions, UserRoleType) => {
  return permissions.includes(UserRoleType)
}

export const pages = [
  { route: '/workouts', title: 'Workouts' },
  { route: '/about', title: 'About'},
  { route: '/workouts/favorite', title: 'Favorite Workouts', permissions: [RoleTypes.user, RoleTypes.admin, RoleTypes.master] },
  { route: '/workouts/myworkouts', title: 'My Workouts', permissions: [RoleTypes.user, RoleTypes.admin, RoleTypes.master] },
  { route: '/login', title: 'Login', permissions: [RoleTypes.none] },
  { route: '/signup', title: 'Signup', permissions: [RoleTypes.none] }
];
export const settings = [
  { route: '/profile', title: 'Profile', permissions: [RoleTypes.user, RoleTypes.admin, RoleTypes.master] },
  { route: '/account', title: 'Account', permissions: [RoleTypes.user, RoleTypes.admin, RoleTypes.master] },
];