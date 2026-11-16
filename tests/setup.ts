import { beforeEach, afterEach, vi } from 'vitest';

// ---------------------------------------------------------------------------
// 1. Web Audio API Deterministic Polyfills & Spies
// ---------------------------------------------------------------------------

export class MockAudioNode {
  destination: any = null;
  connect(target: any) {
    this.destination = target;
    return target;
  }
  disconnect() {
    this.destination = null;
  }
}

export class MockGainNode extends MockAudioNode {
  gain = {
    value: 1,
    setValueAtTime: vi.fn((val: number) => {
      this.gain.value = val;
    }),
    linearRampToValueAtTime: vi.fn((val: number) => {
      this.gain.value = val;
    }),
    exponentialRampToValueAtTime: vi.fn((val: number) => {
      this.gain.value = val;
    }),
  };
}

export class MockOscillatorNode extends MockAudioNode {
  type: OscillatorType = 'sine';
  frequency = {
    value: 440,
    setValueAtTime: vi.fn((val: number) => {
      this.frequency.value = val;
    }),
    exponentialRampToValueAtTime: vi.fn((val: number) => {
      this.frequency.value = val;
    }),
  };
  start = vi.fn();
  stop = vi.fn();
}

export const activeAudioContexts: MockAudioContext[] = [];
export const activeOscillators: MockOscillatorNode[] = [];
export const activeGains: MockGainNode[] = [];

export class MockAudioContext {
  destination = new MockAudioNode();
  currentTime = 0;
  state: 'suspended' | 'running' | 'closed' = 'running';

  constructor() {
    activeAudioContexts.push(this);
  }

  createOscillator = vi.fn(() => {
    const osc = new MockOscillatorNode();
    activeOscillators.push(osc);
    return osc;
  });

  createGain = vi.fn(() => {
    const gain = new MockGainNode();
    activeGains.push(gain);
    return gain;
  });

  resume = vi.fn(async () => {
    this.state = 'running';
  });

  close = vi.fn(async () => {
    this.state = 'closed';
  });
}

(globalThis as any).AudioContext = MockAudioContext;
(globalThis as any).webkitAudioContext = MockAudioContext;
if (typeof window !== 'undefined') {
  (window as any).AudioContext = MockAudioContext;
  (window as any).webkitAudioContext = MockAudioContext;
}

// ---------------------------------------------------------------------------
// 2. Web Speech API Deterministic Polyfills & Spies
// ---------------------------------------------------------------------------

export const spokenUtterances: MockSpeechSynthesisUtterance[] = [];

export class MockSpeechSynthesisUtterance {
  text = '';
  lang = 'ja-JP';
  rate = 1;
  pitch = 1;
  volume = 1;
  onend: (() => void) | null = null;
  onerror: ((err: any) => void) | null = null;

  constructor(text?: string) {
    if (text !== undefined) this.text = text;
  }
}

export const mockSpeechSynthesis = {
  speaking: false,
  paused: false,
  pending: false,
  speak: vi.fn((utterance: MockSpeechSynthesisUtterance) => {
    spokenUtterances.push(utterance);
    mockSpeechSynthesis.speaking = true;
    if (utterance.onend) {
      setTimeout(() => {
        mockSpeechSynthesis.speaking = false;
        utterance.onend?.();
      }, 0);
    }
  }),
  cancel: vi.fn(() => {
    mockSpeechSynthesis.speaking = false;
  }),
  pause: vi.fn(() => {
    mockSpeechSynthesis.paused = true;
  }),
  resume: vi.fn(() => {
    mockSpeechSynthesis.paused = false;
  }),
  getVoices: vi.fn(() => [
    { lang: 'ja-JP', name: 'Kyoko', default: true },
    { lang: 'ja-JP', name: 'Otoya', default: false },
    { lang: 'en-US', name: 'Samantha', default: false },
  ]),
};

(globalThis as any).SpeechSynthesisUtterance = MockSpeechSynthesisUtterance;
(globalThis as any).speechSynthesis = mockSpeechSynthesis;
if (typeof window !== 'undefined') {
  (window as any).SpeechSynthesisUtterance = MockSpeechSynthesisUtterance;
  (window as any).speechSynthesis = mockSpeechSynthesis;
}

// ---------------------------------------------------------------------------
// 3. LocalStorage Deterministic Polyfill & Storage Quota Support
// ---------------------------------------------------------------------------

let shouldThrowQuotaError = false;
export function setSimulateQuotaError(throwError: boolean) {
  shouldThrowQuotaError = throwError;
}

class LocalStorageMock implements Storage {
  private store: Record<string, string> = {};

  get length(): number {
    return Object.keys(this.store).length;
  }

  getItem(key: string): string | null {
    return this.store[key] ?? null;
  }

  setItem(key: string, value: string): void {
    if (shouldThrowQuotaError) {
      const err = new Error('QuotaExceededError: DomException: quota exceeded');
      err.name = 'QuotaExceededError';
      throw err;
    }
    this.store[key] = String(value);
  }

  removeItem(key: string): void {
    delete this.store[key];
  }

  clear(): void {
    this.store = {};
  }

  key(index: number): string | null {
    const keys = Object.keys(this.store);
    return keys[index] ?? null;
  }

  _getStore(): Record<string, string> {
    return this.store;
  }
}

export const mockStorage = new LocalStorageMock();

Object.defineProperty(globalThis, 'localStorage', {
  value: mockStorage,
  writable: true,
  configurable: true,
});

if (typeof window !== 'undefined') {
  Object.defineProperty(window, 'localStorage', {
    value: mockStorage,
    writable: true,
    configurable: true,
  });
}

// ---------------------------------------------------------------------------
// 4. MatchMedia & Window Event Polyfills
// ---------------------------------------------------------------------------

if (typeof window !== 'undefined') {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    configurable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
}

// ---------------------------------------------------------------------------
// 5. Global Lifecycle Reset Hooks
// ---------------------------------------------------------------------------

beforeEach(() => {
  mockStorage.clear();
  setSimulateQuotaError(false);
  activeAudioContexts.length = 0;
  activeOscillators.length = 0;
  activeGains.length = 0;
  spokenUtterances.length = 0;
  mockSpeechSynthesis.cancel();
  vi.clearAllMocks();
});

afterEach(() => {
  vi.useRealTimers();
});
