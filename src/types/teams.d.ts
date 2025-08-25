declare global {
  interface Window {
    microsoftTeams?: {
      app: {
        initialize: () => Promise<void>;
        getContext: () => Promise<{
          app: {
            theme?: string;
          };
        }>;
      };
    };
  }
}

export {};