import { describe, expect, it } from 'vitest';
import { MatchCard } from '../../core/data/match.service';
import { levelRange, matchStateLabel } from './match.helpers';

const baseCard: MatchCard = {
  match: {
    id: '1',
    created_by: 'owner',
    field_id: null,
    starts_at: '2026-01-01T20:00:00.000Z',
    modality: 'F5',
    capacity: 10,
    min_level: 4,
    max_level: 6,
    status: 'open',
    notes: null,
    created_at: '2026-01-01T10:00:00.000Z',
  },
  field: null,
  venue: null,
  playerCount: 3,
};

describe('matchStateLabel', () => {
  it('marks the creator match', () => {
    expect(matchStateLabel(baseCard, 'owner')).toBe('Tu partido');
  });

  it('marks a full match', () => {
    expect(matchStateLabel({ ...baseCard, playerCount: 10 }, 'other')).toBe('Completo');
  });
});

describe('levelRange', () => {
  it('formats min and max', () => {
    expect(levelRange(baseCard)).toBe('Nivel 4-6');
  });
});
