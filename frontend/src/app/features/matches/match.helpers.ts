import { MatchCard } from '../../core/data/match.service';

export function formatMatchTime(iso: string): string {
  return new Intl.DateTimeFormat('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(iso));
}

export function matchStateLabel(card: MatchCard, userId: string | null): string {
  if (card.match.status === 'cancelled') {
    return 'Cancelado';
  }
  if (userId && card.match.created_by === userId) {
    return 'Tu partido';
  }
  if (card.playerCount >= card.match.capacity) {
    return 'Completo';
  }
  if (card.match.capacity - card.playerCount <= 2) {
    return 'Pocas plazas';
  }
  return 'Disponible';
}

export function levelRange(card: MatchCard): string {
  const min = card.match.min_level;
  const max = card.match.max_level;
  if (min !== null && max !== null) {
    return `Nivel ${min}-${max}`;
  }
  if (min !== null) {
    return `Nivel ${min}+`;
  }
  return 'Nivel abierto';
}
