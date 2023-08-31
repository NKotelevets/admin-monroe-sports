export type RoutesT =
  | "/"
  | "/teams"
  | "/games"
  | "/availability"
  | "/role"
  | "/sign-in"
  | "/sign-up"
  | "/welcome"
  | "/join-team"
  | "/success"
  | "/get-started";

interface RoutesConstantI<T extends string> {
  rootPage: T;
  team: T;
  game: T;
  availability: T;
  role: T;
  signIn: T;
  signUp: T;
  welcome: T;
  started: T;
  joinTeam: T;
  success: T;
}

export const routesConstant: RoutesConstantI<RoutesT> = {
  rootPage: "/",
  team: "/teams",
  game: "/games",
  availability: "/availability",
  role: "/role",
  signIn: "/sign-in",
  signUp: "/sign-up",
  welcome: "/welcome",
  started: "/get-started",
  joinTeam: "/join-team",
  success: "/success",
};
