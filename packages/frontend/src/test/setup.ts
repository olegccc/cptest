import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

Element.prototype.animate = function () {
  return {
    finished: Promise.resolve(),
    cancel: () => {},
    play: () => {},
    pause: () => {},
    reverse: () => {},
    finish: () => {},
    onfinish: null,
    oncancel: null,
  } as unknown as Animation;
};

afterEach(() => {
  cleanup();
});
