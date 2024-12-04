// utils/promptUtils.ts
export const constructProofreadPrompt = (inputText: string): string => {
  return `
Please proofread the following text for grammar, spelling, and punctuation errors:

"${inputText}"

Provide the corrected text only.
`;
};

export const constructStyleTransformationPrompt = (proofreadText: string | null, profile: any): string => {
  const keyAttributes = Object.entries(profile.key_attributes || {})
    .map(([key, value]) => `- ${key}: ${value}`)
    .join('\n');

  // Pair examples with transformations
  const examplesWithTransformations = (profile.examples || []).map((example: string, index: number) => {
    const transformationKey = `example_${index + 1}`;
    const transformation = profile.transformations?.[transformationKey] || '';
    return `Example ${index + 1}:
Original: ${example}
Transformed: ${transformation}`;
  }).join('\n\n');

  return `
You are a writing assistant with the following style guidelines:

Description: ${profile.description}

Key Attributes:
${keyAttributes}

Examples with Transformations:
${examplesWithTransformations}

Please rewrite the following text to match the above style guidelines:

"${proofreadText}"

Provide the rewritten text only.
`;
};

export const constructFeedbackPrompt = (originalText: string, transformedText: string): string => {
  return `
Please analyze the following original text and its transformed version. Provide a score out of 10 for how well the transformed text adheres to the desired style, and explain any improvements made or areas for further enhancement.

Original Text:
"${originalText}"

Transformed Text:
"${transformedText}"

Provide your feedback in a clear and concise manner.
`;
};
