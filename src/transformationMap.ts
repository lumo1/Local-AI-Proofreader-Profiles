//transformationMap.tss
export const transformationMap: { [key: string]: (text: string) => string } = {
  motivator_001: (text: string) => `Motivator Transformation: Keep pushing forward! ${text}`,
  techguru_001: (text: string) => `Tech Guru Transformation: Let's optimize this: ${text}`,
  academic_001: (text: string) => `Academic Transformation: According to recent studies, ${text}`,
  storyteller_001: (text: string) => `Storyteller Transformation: Once upon a time, ${text}`,
  journalist_001: (text: string) => `Journalist Transformation: Breaking news: ${text}`,
  poet_001: (text: string) => `Poet Transformation: In the realm of thoughts, ${text}`,
  formalist_001: (text: string) => `Formalist Transformation: It is imperative to note that ${text}`,
  critic_001: (text: string) => `Critic Transformation: Upon reflection, ${text}`,
  // Add other profiles as needed
};
