export type RoutesT = "/" | "/teams" | "/games" | "/availability";

interface RoutesConstantI<T extends string> {
  rootPage: T;
  team: T;
  game: T;
  availability: T;
}

export const routesConstant: RoutesConstantI<RoutesT> = {
  rootPage: "/",
  team: "/teams",
  game: "/games",
  availability: "/availability",
};
