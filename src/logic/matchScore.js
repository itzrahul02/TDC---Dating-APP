/**
 * Matching algorithm for TDC Matchmaker
 * Scores pool profiles against a client profile out of 100
 */

function getEducationTier(education) {
  const upper = (education || '').toUpperCase();
  if (upper.includes('IIT') || upper.includes('IIM') || upper.includes('AIIMS') || upper.includes('M.TECH') || upper.includes('MBA')) return 3;
  if (upper.includes('B.TECH') || upper.includes('B.E.') || upper.includes('CA') || upper.includes('M.SC')) return 2;
  return 1;
}

function scoreMaleClient(client, match) {
  let score = 0;
  const reasons = [];

  // Religion match (15)
  if (client.religion === match.religion) { score += 15; reasons.push("Same religion"); }

  // Caste match (10)
  if (client.caste === match.caste) { score += 10; reasons.push("Same caste"); }
  else if (client.religion === match.religion) { score += 5; }

  // Age gap — woman 1-5 yrs younger = 15 (15)
  const ageDiff = client.age - match.age;
  if (ageDiff >= 1 && ageDiff <= 5) { score += 15; reasons.push("Ideal age gap"); }
  else if (ageDiff >= 6 && ageDiff <= 10) { score += 8; }
  else if (ageDiff === 0) { score += 5; }

  // Income — woman earns less (15)
  if (match.income < client.income) { score += 15; }
  else if (match.income === client.income) { score += 10; }
  else { score += 5; }

  // Kids preference (15)
  if (client.wantKids === match.wantKids) { score += 15; reasons.push("Compatible on kids"); }
  else if (client.wantKids === "Maybe" || match.wantKids === "Maybe") { score += 8; }

  // City / relocation (10)
  if (client.city === match.city) { score += 10; reasons.push("Same city"); }
  else if (match.openToRelocate === "Yes") { score += 7; reasons.push("Open to relocate"); }
  else if (client.openToRelocate === "Yes") { score += 5; }

  // Education tier (10)
  const clientTier = getEducationTier(client.education);
  const matchTier = getEducationTier(match.education);
  if (matchTier >= clientTier) { score += 10; }
  else if (matchTier === clientTier - 1) { score += 5; }

  // Family type (10)
  if (client.familyType === match.familyType) { score += 10; reasons.push("Same family type"); }
  else if (client.familyType === "Open" || match.familyType === "Open") { score += 7; }

  return { score, reasons: reasons.slice(0, 3) };
}

function scoreFemaleClient(client, match) {
  let score = 0;
  const reasons = [];

  // Income — man earns same or more (25)
  if (match.income >= client.income) { score += 25; reasons.push("Strong financial stability"); }
  else { score += 10; }

  // Religion match (15)
  if (client.religion === match.religion) { score += 15; reasons.push("Same religion"); }

  // Caste match (10)
  if (client.caste === match.caste) { score += 10; reasons.push("Same caste"); }
  else if (client.religion === match.religion) { score += 5; }

  // Relocation / career support (15)
  if (match.openToRelocate === "Yes") { score += 15; reasons.push("Open to relocate"); }
  else if (match.openToRelocate === "Maybe") { score += 8; }

  // Family type (15)
  if (client.familyType === "Nuclear" && (match.familyType === "Nuclear" || match.familyType === "Open")) {
    score += 15; reasons.push("Compatible family type");
  } else if (client.familyType === match.familyType) { score += 15; reasons.push("Same family type"); }
  else if (match.familyType === "Open") { score += 7; }

  // Kids preference (10)
  if (client.wantKids === match.wantKids) { score += 10; reasons.push("Compatible on kids"); }
  else if (client.wantKids === "Maybe" || match.wantKids === "Maybe") { score += 5; }

  // Education tier (10)
  const clientTier = getEducationTier(client.education);
  const matchTier = getEducationTier(match.education);
  if (matchTier >= clientTier) { score += 10; }
  else if (matchTier === clientTier - 1) { score += 5; }

  return { score, reasons: reasons.slice(0, 3) };
}

export function getTopMatches(client, pool, limit = 5) {
  // Filter opposite gender
  const candidates = pool.filter(p => p.gender !== client.gender);

  const scored = candidates.map(match => {
    const { score, reasons } = client.gender === 'male'
      ? scoreMaleClient(client, match)
      : scoreFemaleClient(client, match);

    let label = '';
    let badge = '';
    if (score >= 85) { label = 'High Potential Match'; badge = '🔥'; }
    else if (score >= 65) { label = 'Good Match'; badge = '✅'; }
    else if (score >= 45) { label = 'Possible Match'; badge = '🤝'; }

    return { ...match, score, reasons, label, badge };
  });

  // Only return matches scoring 45+
  return scored
    .filter(m => m.score >= 45)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}
