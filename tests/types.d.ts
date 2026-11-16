/**
 * Ambient Type Declarations for Optional Testing Libraries & Node
 * File: tests/types.d.ts
 */

declare const __dirname: string;

declare module 'node:fs' {
  export function existsSync(path: string): boolean;
  export function readFileSync(path: string, encoding: string): string;
}

declare module 'node:path' {
  export function resolve(...paths: string[]): string;
  export function join(...paths: string[]): string;
}

declare module 'node:child_process' {
  export function execSync(command: string, options?: any): Buffer | string;
}

declare module '@testing-library/react' {
  export function render(ui: any, options?: any): any;
  export const screen: {
    getByTestId: (id: string) => HTMLElement;
    queryByTestId: (id: string) => HTMLElement | null;
    findByTestId: (id: string) => Promise<HTMLElement>;
    getByText: (text: string | RegExp) => HTMLElement;
    queryByText: (text: string | RegExp) => HTMLElement | null;
    findByText: (text: string | RegExp) => Promise<HTMLElement>;
    getByRole: (role: string, options?: any) => HTMLElement;
    queryByRole: (role: string, options?: any) => HTMLElement | null;
  };
  export const fireEvent: {
    click: (element: any) => boolean;
    change: (element: any, options?: any) => boolean;
    keyDown: (element: any, options?: any) => boolean;
  };
  export function waitFor(callback: () => any, options?: any): Promise<any>;
}
