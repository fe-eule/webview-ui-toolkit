import { render } from '@testing-library/react';

import React from './React';

describe('React', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<React />);
    expect(baseElement).toBeTruthy();
  });
});
