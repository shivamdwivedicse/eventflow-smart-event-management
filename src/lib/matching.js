export function calculateCompatibility(userA, userB) {
  if (!userA || !userB) return 0;

  let score = 50; // Base score

  // 1. Complementary Roles
  if (userA.preferredRole && userB.preferredRole) {
    if (userA.preferredRole !== userB.preferredRole) {
      score += 20; // Diverse roles are good
    } else {
      score -= 10; // Overlapping core roles might cause conflicts
    }
  }

  // 2. Shared Interests (Max 20 points)
  if (userA.interests && userB.interests) {
    const sharedInterests = userA.interests.filter(i => userB.interests.includes(i));
    score += Math.min(20, sharedInterests.length * 10);
  }

  // 3. Skill overlap vs complementary (Max 10 points)
  if (userA.skills && userB.skills) {
    const sharedSkills = userA.skills.filter(s => userB.skills.includes(s));
    // Having some shared skills is good for communication, but too many means less diversity.
    if (sharedSkills.length > 0) {
      score += 10;
    }
  }

  // 4. Availability
  if (userA.availability === userB.availability) {
    score += 10;
  }

  return Math.min(100, Math.max(0, score));
}

export function getMatchLabel(score) {
  if (score >= 80) return { label: 'Excellent Match', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
  if (score >= 60) return { label: 'Good Match', color: 'text-indigo-700 bg-indigo-50 border-indigo-200' };
  return { label: 'Potential Match', color: 'text-amber-700 bg-amber-50 border-amber-200' };
}
