const category = require('./category');
const customer = require('./customer');
const employee = require('./employee');
const order = require('./order');
const product = require('./product');
const role = require('./role');

const allPermissions = [
  ...employee.permissions,
  ...role.permissions,
];

const permissionGroups = [
  category,
  customer,
  employee,
  order,
  product,
  role,
];

module.exports = {
  checkPermission: (paramPath, paramMethod, paramPermissions) => {
    let permission = null;
    let isAllow = true;
    const denyRoutes = [];
    const allowRoutes = [];

    allPermissions.forEach((p) => {
      const method = typeof p.method === 'string' ? [p.method] : p.method;
      let isCorrectPath = false;

      if (p.path.slice(-1) === '*') {
        isCorrectPath = paramPath.match(`^${p.path.slice(0, -1)}`);
      } else {
        isCorrectPath = paramPath.match(`^${p.path}/?$`);
      }

      if (!permission && isCorrectPath && method.includes(paramMethod)) {
        permission = p;
      }

      if (method.includes('get')) {
        if (paramPermissions.includes(p.name)) {
          const index = denyRoutes.indexOf(p.path);
          if (index !== -1) {
            denyRoutes.splice(index, 1);
          }
          allowRoutes.push(p.path);
        } else if (!allowRoutes.includes(p.path)) {
          denyRoutes.push(p.path);
        }
      }
    });

    isAllow = !permission || paramPermissions.includes(permission.name);

    return { isAllow, denyRoutes };
  },

  permissionGroups,
};
