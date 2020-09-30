import Router from 'next/router';

export const protectedRoutes = ['/tickets/new', '/orders'];

export const forbiddenRoutesWithAuth = ['/auth/signin', '/auth/signup'];

export function redirectUser(ctx, location) {
  if (ctx.req) {
    ctx.res.writeHead(302, { Location: location });
    ctx.res.end();
  } else {
    Router.push(location);
  }
}

export const checkProtectedRoutes = (currentUser, ctx) => {
  if (protectedRoutes.includes(ctx.pathname) && !currentUser) {
    redirectUser(ctx, '/auth/signin');
  }
};

export const checkForbiddenRoutesWithAuth = (currentUser, ctx) => {
  if (forbiddenRoutesWithAuth.includes(ctx.pathname) && currentUser) {
    redirectUser(ctx, '/');
  }
};
