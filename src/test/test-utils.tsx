import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Add any global providers that are needed for tests
export function renderWithProviders(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) {
  return {
    user: userEvent.setup(),
    ...render(ui, {
      // Wrap with providers if needed
      // wrapper: ({ children }) => (
      //   <SomeProvider>{children}</SomeProvider>
      // ),
      ...options,
    }),
  };
}
