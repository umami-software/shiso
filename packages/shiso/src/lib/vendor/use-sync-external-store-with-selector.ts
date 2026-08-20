/**
 * React's MIT-licensed use-sync-external-store selector shim, adapted to use
 * the native React 19 hook that Shiso already requires as a peer dependency.
 */
import { useDebugValue, useEffect, useMemo, useRef, useSyncExternalStore } from 'react';

interface SelectionState<Selection> {
  hasValue: boolean;
  value: Selection | null;
}

export function useSyncExternalStoreWithSelector<Snapshot, Selection>(
  subscribe: (onStoreChange: () => void) => () => void,
  getSnapshot: () => Snapshot,
  getServerSnapshot: (() => Snapshot) | undefined,
  selector: (snapshot: Snapshot) => Selection,
  isEqual?: (left: Selection, right: Selection) => boolean,
): Selection {
  const stateRef = useRef<SelectionState<Selection> | null>(null);

  if (stateRef.current === null) {
    stateRef.current = { hasValue: false, value: null };
  }

  const state = stateRef.current;
  const [getSelection, getServerSelection] = useMemo(() => {
    let hasMemo = false;
    let memoizedSnapshot: Snapshot;
    let memoizedSelection: Selection;

    const memoizedSelector = (nextSnapshot: Snapshot) => {
      if (!hasMemo) {
        hasMemo = true;
        memoizedSnapshot = nextSnapshot;
        const nextSelection = selector(nextSnapshot);

        if (isEqual && state.hasValue && isEqual(state.value as Selection, nextSelection)) {
          memoizedSelection = state.value as Selection;
          return memoizedSelection;
        }

        memoizedSelection = nextSelection;
        return memoizedSelection;
      }

      if (Object.is(memoizedSnapshot, nextSnapshot)) {
        return memoizedSelection;
      }

      const nextSelection = selector(nextSnapshot);

      if (isEqual?.(memoizedSelection, nextSelection)) {
        memoizedSnapshot = nextSnapshot;
        return memoizedSelection;
      }

      memoizedSnapshot = nextSnapshot;
      memoizedSelection = nextSelection;
      return memoizedSelection;
    };

    return [
      () => memoizedSelector(getSnapshot()),
      getServerSnapshot ? () => memoizedSelector(getServerSnapshot()) : undefined,
    ] as const;
  }, [getSnapshot, getServerSnapshot, selector, isEqual, state]);

  const value = useSyncExternalStore(subscribe, getSelection, getServerSelection);

  useEffect(() => {
    state.hasValue = true;
    state.value = value;
  }, [state, value]);

  useDebugValue(value);
  return value;
}
