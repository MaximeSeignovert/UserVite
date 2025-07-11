/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as IndexImport } from './routes/index'
import { Route as CheckoutIndexImport } from './routes/checkout/index'
import { Route as RestaurantDashboardImport } from './routes/restaurant/dashboard'
import { Route as RestaurantRestaurantIdImport } from './routes/restaurant.$restaurantId'
import { Route as OrderTrackingOrderIdImport } from './routes/order-tracking.$orderId'
import { Route as DeliveryDashboardImport } from './routes/delivery/dashboard'
import { Route as AuthRegisterImport } from './routes/auth/register'
import { Route as AuthLoginImport } from './routes/auth/login'
import { Route as RestaurantOrderTrackingOrderIdImport } from './routes/restaurant/order-tracking.$orderId'

// Create/Update Routes

const IndexRoute = IndexImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => rootRoute,
} as any)

const CheckoutIndexRoute = CheckoutIndexImport.update({
  id: '/checkout/',
  path: '/checkout/',
  getParentRoute: () => rootRoute,
} as any)

const RestaurantDashboardRoute = RestaurantDashboardImport.update({
  id: '/restaurant/dashboard',
  path: '/restaurant/dashboard',
  getParentRoute: () => rootRoute,
} as any)

const RestaurantRestaurantIdRoute = RestaurantRestaurantIdImport.update({
  id: '/restaurant/$restaurantId',
  path: '/restaurant/$restaurantId',
  getParentRoute: () => rootRoute,
} as any)

const OrderTrackingOrderIdRoute = OrderTrackingOrderIdImport.update({
  id: '/order-tracking/$orderId',
  path: '/order-tracking/$orderId',
  getParentRoute: () => rootRoute,
} as any)

const DeliveryDashboardRoute = DeliveryDashboardImport.update({
  id: '/delivery/dashboard',
  path: '/delivery/dashboard',
  getParentRoute: () => rootRoute,
} as any)

const AuthRegisterRoute = AuthRegisterImport.update({
  id: '/auth/register',
  path: '/auth/register',
  getParentRoute: () => rootRoute,
} as any)

const AuthLoginRoute = AuthLoginImport.update({
  id: '/auth/login',
  path: '/auth/login',
  getParentRoute: () => rootRoute,
} as any)

const RestaurantOrderTrackingOrderIdRoute =
  RestaurantOrderTrackingOrderIdImport.update({
    id: '/restaurant/order-tracking/$orderId',
    path: '/restaurant/order-tracking/$orderId',
    getParentRoute: () => rootRoute,
  } as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      id: '/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof IndexImport
      parentRoute: typeof rootRoute
    }
    '/auth/login': {
      id: '/auth/login'
      path: '/auth/login'
      fullPath: '/auth/login'
      preLoaderRoute: typeof AuthLoginImport
      parentRoute: typeof rootRoute
    }
    '/auth/register': {
      id: '/auth/register'
      path: '/auth/register'
      fullPath: '/auth/register'
      preLoaderRoute: typeof AuthRegisterImport
      parentRoute: typeof rootRoute
    }
    '/delivery/dashboard': {
      id: '/delivery/dashboard'
      path: '/delivery/dashboard'
      fullPath: '/delivery/dashboard'
      preLoaderRoute: typeof DeliveryDashboardImport
      parentRoute: typeof rootRoute
    }
    '/order-tracking/$orderId': {
      id: '/order-tracking/$orderId'
      path: '/order-tracking/$orderId'
      fullPath: '/order-tracking/$orderId'
      preLoaderRoute: typeof OrderTrackingOrderIdImport
      parentRoute: typeof rootRoute
    }
    '/restaurant/$restaurantId': {
      id: '/restaurant/$restaurantId'
      path: '/restaurant/$restaurantId'
      fullPath: '/restaurant/$restaurantId'
      preLoaderRoute: typeof RestaurantRestaurantIdImport
      parentRoute: typeof rootRoute
    }
    '/restaurant/dashboard': {
      id: '/restaurant/dashboard'
      path: '/restaurant/dashboard'
      fullPath: '/restaurant/dashboard'
      preLoaderRoute: typeof RestaurantDashboardImport
      parentRoute: typeof rootRoute
    }
    '/checkout/': {
      id: '/checkout/'
      path: '/checkout'
      fullPath: '/checkout'
      preLoaderRoute: typeof CheckoutIndexImport
      parentRoute: typeof rootRoute
    }
    '/restaurant/order-tracking/$orderId': {
      id: '/restaurant/order-tracking/$orderId'
      path: '/restaurant/order-tracking/$orderId'
      fullPath: '/restaurant/order-tracking/$orderId'
      preLoaderRoute: typeof RestaurantOrderTrackingOrderIdImport
      parentRoute: typeof rootRoute
    }
  }
}

// Create and export the route tree

export interface FileRoutesByFullPath {
  '/': typeof IndexRoute
  '/auth/login': typeof AuthLoginRoute
  '/auth/register': typeof AuthRegisterRoute
  '/delivery/dashboard': typeof DeliveryDashboardRoute
  '/order-tracking/$orderId': typeof OrderTrackingOrderIdRoute
  '/restaurant/$restaurantId': typeof RestaurantRestaurantIdRoute
  '/restaurant/dashboard': typeof RestaurantDashboardRoute
  '/checkout': typeof CheckoutIndexRoute
  '/restaurant/order-tracking/$orderId': typeof RestaurantOrderTrackingOrderIdRoute
}

export interface FileRoutesByTo {
  '/': typeof IndexRoute
  '/auth/login': typeof AuthLoginRoute
  '/auth/register': typeof AuthRegisterRoute
  '/delivery/dashboard': typeof DeliveryDashboardRoute
  '/order-tracking/$orderId': typeof OrderTrackingOrderIdRoute
  '/restaurant/$restaurantId': typeof RestaurantRestaurantIdRoute
  '/restaurant/dashboard': typeof RestaurantDashboardRoute
  '/checkout': typeof CheckoutIndexRoute
  '/restaurant/order-tracking/$orderId': typeof RestaurantOrderTrackingOrderIdRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/': typeof IndexRoute
  '/auth/login': typeof AuthLoginRoute
  '/auth/register': typeof AuthRegisterRoute
  '/delivery/dashboard': typeof DeliveryDashboardRoute
  '/order-tracking/$orderId': typeof OrderTrackingOrderIdRoute
  '/restaurant/$restaurantId': typeof RestaurantRestaurantIdRoute
  '/restaurant/dashboard': typeof RestaurantDashboardRoute
  '/checkout/': typeof CheckoutIndexRoute
  '/restaurant/order-tracking/$orderId': typeof RestaurantOrderTrackingOrderIdRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths:
    | '/'
    | '/auth/login'
    | '/auth/register'
    | '/delivery/dashboard'
    | '/order-tracking/$orderId'
    | '/restaurant/$restaurantId'
    | '/restaurant/dashboard'
    | '/checkout'
    | '/restaurant/order-tracking/$orderId'
  fileRoutesByTo: FileRoutesByTo
  to:
    | '/'
    | '/auth/login'
    | '/auth/register'
    | '/delivery/dashboard'
    | '/order-tracking/$orderId'
    | '/restaurant/$restaurantId'
    | '/restaurant/dashboard'
    | '/checkout'
    | '/restaurant/order-tracking/$orderId'
  id:
    | '__root__'
    | '/'
    | '/auth/login'
    | '/auth/register'
    | '/delivery/dashboard'
    | '/order-tracking/$orderId'
    | '/restaurant/$restaurantId'
    | '/restaurant/dashboard'
    | '/checkout/'
    | '/restaurant/order-tracking/$orderId'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  IndexRoute: typeof IndexRoute
  AuthLoginRoute: typeof AuthLoginRoute
  AuthRegisterRoute: typeof AuthRegisterRoute
  DeliveryDashboardRoute: typeof DeliveryDashboardRoute
  OrderTrackingOrderIdRoute: typeof OrderTrackingOrderIdRoute
  RestaurantRestaurantIdRoute: typeof RestaurantRestaurantIdRoute
  RestaurantDashboardRoute: typeof RestaurantDashboardRoute
  CheckoutIndexRoute: typeof CheckoutIndexRoute
  RestaurantOrderTrackingOrderIdRoute: typeof RestaurantOrderTrackingOrderIdRoute
}

const rootRouteChildren: RootRouteChildren = {
  IndexRoute: IndexRoute,
  AuthLoginRoute: AuthLoginRoute,
  AuthRegisterRoute: AuthRegisterRoute,
  DeliveryDashboardRoute: DeliveryDashboardRoute,
  OrderTrackingOrderIdRoute: OrderTrackingOrderIdRoute,
  RestaurantRestaurantIdRoute: RestaurantRestaurantIdRoute,
  RestaurantDashboardRoute: RestaurantDashboardRoute,
  CheckoutIndexRoute: CheckoutIndexRoute,
  RestaurantOrderTrackingOrderIdRoute: RestaurantOrderTrackingOrderIdRoute,
}

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/",
        "/auth/login",
        "/auth/register",
        "/delivery/dashboard",
        "/order-tracking/$orderId",
        "/restaurant/$restaurantId",
        "/restaurant/dashboard",
        "/checkout/",
        "/restaurant/order-tracking/$orderId"
      ]
    },
    "/": {
      "filePath": "index.tsx"
    },
    "/auth/login": {
      "filePath": "auth/login.tsx"
    },
    "/auth/register": {
      "filePath": "auth/register.tsx"
    },
    "/delivery/dashboard": {
      "filePath": "delivery/dashboard.tsx"
    },
    "/order-tracking/$orderId": {
      "filePath": "order-tracking.$orderId.tsx"
    },
    "/restaurant/$restaurantId": {
      "filePath": "restaurant.$restaurantId.tsx"
    },
    "/restaurant/dashboard": {
      "filePath": "restaurant/dashboard.tsx"
    },
    "/checkout/": {
      "filePath": "checkout/index.tsx"
    },
    "/restaurant/order-tracking/$orderId": {
      "filePath": "restaurant/order-tracking.$orderId.tsx"
    }
  }
}
ROUTE_MANIFEST_END */
