import { describe, it, expect } from 'vitest';
import { calculateCompatibility, getMatchLabel } from '../src/lib/matching.js';

describe('calculateCompatibility', () => {
  it('returns 0 when either user is missing', () => {
    expect(calculateCompatibility(null, {})).toBe(0);
    expect(calculateCompatibility({}, null)).toBe(0);
  });

  it('returns base score for users with no matching data', () => {
    const userA = {};
    const userB = {};

    expect(calculateCompatibility(userA, userB)).toBe(60);
  });

  it('rewards complementary preferred roles', () => {
    const userA = { preferredRole: 'Developer' };
    const userB = { preferredRole: 'Designer' };

    expect(calculateCompatibility(userA, userB)).toBe(80);
  });

  it('penalizes identical preferred roles', () => {
    const userA = { preferredRole: 'Developer' };
    const userB = { preferredRole: 'Developer' };

    expect(calculateCompatibility(userA, userB)).toBe(50);
  });

  it('rewards shared interests', () => {
    const userA = { interests: ['AI', 'Web'] };
    const userB = { interests: ['AI', 'Mobile'] };

    expect(calculateCompatibility(userA, userB)).toBe(70);
  });

  it('adds skill overlap bonus', () => {
    const userA = { skills: ['React'] };
    const userB = { skills: ['React'] };

    expect(calculateCompatibility(userA, userB)).toBe(70);
  });

  it('rewards matching availability', () => {
    const userA = { availability: 'Full-time' };
    const userB = { availability: 'Full-time' };

    expect(calculateCompatibility(userA, userB)).toBe(70);
  });

  it('combines multiple compatibility factors', () => {
    const userA = {
      preferredRole: 'Developer',
      interests: ['AI', 'Web'],
      skills: ['React'],
      availability: 'Full-time'
    };

    const userB = {
      preferredRole: 'Designer',
      interests: ['AI', 'Mobile'],
      skills: ['React'],
      availability: 'Full-time'
    };

    expect(calculateCompatibility(userA, userB)).toBe(100);
  });

  it('never exceeds 100', () => {
    const userA = {
      preferredRole: 'Developer',
      interests: ['AI', 'Web'],
      skills: ['React'],
      availability: 'Full-time'
    };

    const userB = {
      preferredRole: 'Designer',
      interests: ['AI', 'Web'],
      skills: ['React'],
      availability: 'Full-time'
    };

    expect(calculateCompatibility(userA, userB)).toBeLessThanOrEqual(100);
  });

  it('never goes below 0', () => {
    const userA = {
      preferredRole: 'Developer'
    };

    const userB = {
      preferredRole: 'Developer'
    };

    expect(calculateCompatibility(userA, userB)).toBeGreaterThanOrEqual(0);
  });
});

describe('getMatchLabel', () => {
  it('returns Excellent Match for scores >= 80', () => {
    expect(getMatchLabel(80).label).toBe('Excellent Match');
    expect(getMatchLabel(95).label).toBe('Excellent Match');
  });

  it('returns Good Match for scores between 60 and 79', () => {
    expect(getMatchLabel(60).label).toBe('Good Match');
    expect(getMatchLabel(79).label).toBe('Good Match');
  });

  it('returns Potential Match for scores below 60', () => {
    expect(getMatchLabel(59).label).toBe('Potential Match');
    expect(getMatchLabel(0).label).toBe('Potential Match');
  });
});