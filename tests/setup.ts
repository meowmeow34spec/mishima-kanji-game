import { beforeEach, afterEach, vi } from 'vitest';

// ---------------------------------------------------------------------------
// 1. Web Audio API Deterministic Polyfills & Spies
// ---------------------------------------------------------------------------

export interface AudioTimelineEvent {
  type: 'setValue' | 'linearRamp' | 'exponentialRamp';
  value: number;
  time: number;
}

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

export class MockAudioParam {
  private _defaultValue: number;
  private _value: number;
  private _context?: MockAudioContext;
  private _timeline: AudioTimelineEvent[] = [];
  private _activeTimers: any[] = [];

  constructor(defaultValue: number = 0, context?: MockAudioContext) {
    this._defaultValue = defaultValue;
    this._value = defaultValue;
    this._context = context;
  }

  get defaultValue(): number {
    return this._defaultValue;
  }

  get value(): number {
    const currentTime = this._context ? this._context.currentTime : 0;
    return this.getValueAtTime(currentTime);
  }

  set value(newVal: number) {
    this._value = newVal;
    this._clearTimers();
    this._timeline = [
      {
        type: 'setValue',
        value: newVal,
        time: this._context ? this._context.currentTime : 0,
      },
    ];
  }

  getValueAtTime(time: number): number {
    if (this._timeline.length === 0) {
      return this._value;
    }

    const events = [...this._timeline].sort((a, b) => a.time - b.time);

    if (time <= events[0].time) {
      return events[0].type === 'setValue' ? events[0].value : this._value;
    }

    const lastEvent = events[events.length - 1];
    if (time >= lastEvent.time) {
      return lastEvent.value;
    }

    let prev = events[0];
    for (let i = 1; i < events.length; i++) {
      if (events[i].time > time) break;
      prev = events[i];
    }

    const nextIndex = events.findIndex((e) => e.time > time);
    if (nextIndex === -1) return prev.value;
    const next = events[nextIndex];

    const duration = next.time - prev.time;
    if (duration <= 0) return next.value;
    const progress = (time - prev.time) / duration;

    if (next.type === 'linearRamp') {
      return prev.value + (next.value - prev.value) * progress;
    } else if (next.type === 'exponentialRamp') {
      if (prev.value <= 0 || next.value <= 0) {
        return next.value;
      }
      return prev.value * Math.pow(next.value / prev.value, progress);
    }

    return prev.value;
  }

  private _clearTimers() {
    for (const t of this._activeTimers) {
      clearTimeout(t);
    }
    this._activeTimers = [];
  }

  setValueAtTime = vi.fn((val: number, startTime: number) => {
    const curTime = this._context ? this._context.currentTime : 0;
    this._timeline.push({ type: 'setValue', value: val, time: startTime });
    if (startTime <= curTime) {
      this._value = val;
    } else {
      const delay = Math.max(0, (startTime - curTime) * 1000);
      const timer = setTimeout(() => {
        this._value = val;
      }, delay);
      this._activeTimers.push(timer);
    }
    return this;
  });

  linearRampToValueAtTime = vi.fn((val: number, endTime: number) => {
    const curTime = this._context ? this._context.currentTime : 0;
    const currentValue = this.getValueAtTime(curTime);
    if (
      this._timeline.length === 0 ||
      this._timeline[this._timeline.length - 1].time < curTime
    ) {
      this._timeline.push({ type: 'setValue', value: currentValue, time: curTime });
    }
    this._timeline.push({ type: 'linearRamp', value: val, time: endTime });

    if (endTime <= curTime) {
      this._value = val;
    } else {
      const delay = Math.max(0, (endTime - curTime) * 1000);
      const timer = setTimeout(() => {
        this._value = val;
      }, delay);
      this._activeTimers.push(timer);
    }
    return this;
  });

  exponentialRampToValueAtTime = vi.fn((val: number, endTime: number) => {
    if (val <= 0) {
      throw new RangeError(
        "Failed to execute 'exponentialRampToValueAtTime' on 'AudioParam': The float value provided is less than or equal to 0."
      );
    }
    const curTime = this._context ? this._context.currentTime : 0;
    const currentValue = this.getValueAtTime(curTime);
    if (currentValue <= 0) {
      throw new RangeError(
        "Failed to execute 'exponentialRampToValueAtTime' on 'AudioParam': The previous float value is less than or equal to 0."
      );
    }

    if (
      this._timeline.length === 0 ||
      this._timeline[this._timeline.length - 1].time < curTime
    ) {
      this._timeline.push({ type: 'setValue', value: currentValue, time: curTime });
    }
    this._timeline.push({ type: 'exponentialRamp', value: val, time: endTime });

    if (endTime <= curTime) {
      this._value = val;
    } else {
      const delay = Math.max(0, (endTime - curTime) * 1000);
      const timer = setTimeout(() => {
        this._value = val;
      }, delay);
      this._activeTimers.push(timer);
    }
    return this;
  });

  cancelScheduledValues = vi.fn((startTime: number) => {
    this._timeline = this._timeline.filter((e) => e.time < startTime);
    this._clearTimers();
    return this;
  });
}

export class MockGainNode extends MockAudioNode {
  gain: MockAudioParam;

  constructor(context?: MockAudioContext) {
    super();
    this.gain = new MockAudioParam(1, context);
  }
}

export class MockOscillatorNode extends MockAudioNode {
  type: OscillatorType = 'sine';
  frequency: MockAudioParam;
  detune: MockAudioParam;
  start = vi.fn();
  stop = vi.fn();

  constructor(context?: MockAudioContext) {
    super();
    this.frequency = new MockAudioParam(440, context);
    this.detune = new MockAudioParam(0, context);
  }
}

export const activeAudioContexts: MockAudioContext[] = [];
export const activeOscillators: MockOscillatorNode[] = [];
export const activeGains: MockGainNode[] = [];

export class MockAudioContext {
  destination = new MockAudioNode();
  private _currentTime: number = 0;
  state: 'suspended' | 'running' | 'closed' = 'running';

  get currentTime(): number {
    return this._currentTime;
  }

  set currentTime(val: number) {
    this._currentTime = val;
  }

  constructor() {
    activeAudioContexts.push(this);
  }

  createOscillator = vi.fn(() => {
    const osc = new MockOscillatorNode(this);
    activeOscillators.push(osc);
    return osc;
  });

  createGain = vi.fn(() => {
    const gain = new MockGainNode(this);
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
let activeSpeechTimeout: any = null;
let activeUtterance: MockSpeechSynthesisUtterance | null = null;

export function getActiveUtterance(): MockSpeechSynthesisUtterance | null {
  return activeUtterance;
}

export class MockSpeechSynthesisUtterance {
  text = '';
  lang = 'ja-JP';
  rate = 1;
  pitch = 1;
  volume = 1;
  onstart: ((event?: any) => void) | null = null;
  onend: ((event?: any) => void) | null = null;
  onerror: ((err: any) => void) | null = null;
  onpause: ((event?: any) => void) | null = null;
  onresume: ((event?: any) => void) | null = null;
  onboundary: ((event: { name: string; charIndex: number; elapsedTime: number }) => void) | null = null;

  private listeners: Record<string, Function[]> = {};

  constructor(text?: string) {
    if (text !== undefined) this.text = text;
  }

  addEventListener(type: string, listener: Function) {
    if (!this.listeners[type]) this.listeners[type] = [];
    this.listeners[type].push(listener);
  }

  removeEventListener(type: string, listener: Function) {
    if (this.listeners[type]) {
      this.listeners[type] = this.listeners[type].filter((l) => l !== listener);
    }
  }

  dispatchEvent(event: { type?: string; [key: string]: any }): boolean {
    const eventType = event.type;
    if (eventType) {
      const handler = (this as any)[`on${eventType}`];
      if (typeof handler === 'function') {
        handler(event);
      }
      if (this.listeners[eventType]) {
        for (const listener of this.listeners[eventType]) {
          listener(event);
        }
      }
    }
    return true;
  }
}

export const mockSpeechSynthesis = {
  speaking: false,
  paused: false,
  pending: false,
  speak: vi.fn((utterance: MockSpeechSynthesisUtterance) => {
    spokenUtterances.push(utterance);
    mockSpeechSynthesis.speaking = true;
    mockSpeechSynthesis.paused = false;
    activeUtterance = utterance;

    if (activeSpeechTimeout) {
      clearTimeout(activeSpeechTimeout);
      activeSpeechTimeout = null;
    }

    if (utterance.onstart) {
      utterance.onstart();
    }
    (utterance as any).listeners?.['start']?.forEach((fn: Function) => fn({ type: 'start' }));

    if (utterance.text && (utterance.onboundary || (utterance as any).listeners?.['boundary'])) {
      for (let i = 0; i < utterance.text.length; i++) {
        const boundaryEvt = { name: 'word', charIndex: i, elapsedTime: i * 50 };
        utterance.onboundary?.(boundaryEvt);
        (utterance as any).listeners?.['boundary']?.forEach((fn: Function) =>
          fn({ type: 'boundary', ...boundaryEvt })
        );
      }
    }

    activeSpeechTimeout = setTimeout(() => {
      mockSpeechSynthesis.speaking = false;
      const utt = activeUtterance;
      activeUtterance = null;
      activeSpeechTimeout = null;
      if (utt) {
        utt.onend?.();
        (utt as any).listeners?.['end']?.forEach((fn: Function) => fn({ type: 'end' }));
      }
    }, 0);
  }),
  cancel: vi.fn(() => {
    if (activeSpeechTimeout) {
      clearTimeout(activeSpeechTimeout);
      activeSpeechTimeout = null;
    }
    mockSpeechSynthesis.speaking = false;
    mockSpeechSynthesis.paused = false;
    mockSpeechSynthesis.pending = false;

    if (activeUtterance) {
      const utt = activeUtterance;
      activeUtterance = null;
      const errEvt = { error: 'canceled' };
      utt.onerror?.(errEvt);
      (utt as any).listeners?.['error']?.forEach((fn: Function) =>
        fn({ type: 'error', ...errEvt })
      );
    }
  }),
  pause: vi.fn(() => {
    if (mockSpeechSynthesis.speaking && !mockSpeechSynthesis.paused) {
      mockSpeechSynthesis.paused = true;
      activeUtterance?.onpause?.();
      (activeUtterance as any)?.listeners?.['pause']?.forEach((fn: Function) =>
        fn({ type: 'pause' })
      );
    }
  }),
  resume: vi.fn(() => {
    if (mockSpeechSynthesis.speaking && mockSpeechSynthesis.paused) {
      mockSpeechSynthesis.paused = false;
      activeUtterance?.onresume?.();
      (activeUtterance as any)?.listeners?.['resume']?.forEach((fn: Function) =>
        fn({ type: 'resume' })
      );
    }
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
