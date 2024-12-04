export const matchDomain = (domain: string, pattern: string): boolean => {
  if (pattern.startsWith("*.")) {
    const baseDomain = pattern.slice(2); // Remove "*."
    return domain.endsWith(baseDomain); // Match subdomains
  }
  return domain === pattern; // Exact match
};

export const findMatchingProfile = (
  currentDomain: string | null,
  profiles: any[],
  defaultProfileId: string | null
) => {
  if (!currentDomain) return null; // Return null if no current domain

  const matchedProfile = profiles.find((profile) =>
    profile.domains?.some((pattern: string) => matchDomain(currentDomain, pattern))
  );

  const defaultProfile = profiles.find((profile) => profile.id === defaultProfileId);

  return matchedProfile || defaultProfile || null; // Return null if nothing matches
};

