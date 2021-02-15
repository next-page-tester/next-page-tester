const originalConsoleError = console.error;

export function silenceConsoleError(errorMessage: string) {
  jest.spyOn(console, 'error').mockImplementation((message, ...args) => {
    if (message.includes(errorMessage)) {
      return;
    }
    console.log(args);
    originalConsoleError(message);
  });

  afterAll(() => {
    jest.clearAllMocks();
  });
}
