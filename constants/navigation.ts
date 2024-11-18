export const ROUTES = {
  HOME: {
    path: "/",
    tab: "Home",
    header: "Home",
  },
  TABLE: {
    path: "/table",
    tab: "Table",
    header: "Table",
  },
  LOGIN: {
    path: "/login",
    tab: "Login",
    header: "Login",
  },
  REGISTER: {
    path: "/register",
    tab: "Register",
    header: "Register",
  },
  LEAGUES: {
    path: "/leagues",
    tab: "Leagues",
    header: "Your Leagues",
  },
  PREDICTIONS: {
    path: "/predictions",
    tab: "Predictions",
    header: "Your Predictions",
  },
};

export const NAVIGATION_ROUTES = [
  ROUTES.HOME,
  ROUTES.TABLE,
  ROUTES.LEAGUES,
  ROUTES.PREDICTIONS,
  ROUTES.LOGIN,
];
