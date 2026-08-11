declare module '*.css';
declare module 'next' { export type Metadata = { title?: string; description?: string } }
declare module 'react' {
  export type ReactNode = unknown;
  export function useEffect(effect: () => void | (() => void), deps?: unknown[]): void;
  export function useMemo<T>(factory: () => T, deps?: unknown[]): T;
  export function useState<T>(initial: T): [T, (value: T | ((previous: T) => T)) => void];
}
declare namespace React { type ReactNode = unknown; }
declare namespace JSX { interface IntrinsicElements { [elementName: string]: any } }
declare module 'vitest' { export const describe: (name: string, fn: () => void) => void; export const it: (name: string, fn: () => void) => void; export const expect: (value: any) => { toBeLessThan: (expected: number) => void; toContain: (expected: unknown) => void; toBe: (expected: unknown) => void; toHaveLength: (expected: number) => void; }; }
declare module 'vitest/config' { export const defineConfig: (config: unknown) => unknown; }
