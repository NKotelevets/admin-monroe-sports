import { RootState } from ".";

export type CallBackT<T> = (state: RootState) => T;

export const createTypedSelector = <T>(
  callback: CallBackT<T>
): CallBackT<T> => {
  return callback;
};
