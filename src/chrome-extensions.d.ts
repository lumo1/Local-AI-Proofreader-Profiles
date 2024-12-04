// chrome-extensions.d.ts
declare namespace chrome {
  var aiOriginTrial: {
    languageModel: {
      create: (params: { systemPrompt: string }) => Promise<any>;
    };
  };
}
