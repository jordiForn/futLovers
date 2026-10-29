import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { MatchDetail, MatchService } from '../../core/data/match.service';
import { formatMatchTime, levelRange, matchStateLabel } from './match.helpers';

@Component({
  selector: 'app-match-detail-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  templateUrl: './match-detail.page.html',
})
export class MatchDetailPage {
  private readonly matches = inject(MatchService);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  readonly id = input.required<string>();

  protected readonly loading = signal(true);
  protected readonly error = signal<string | null>(null);
  protected readonly actionError = signal<string | null>(null);
  protected readonly detail = signal<MatchDetail | null>(null);
  protected readonly busy = signal(false);

  protected readonly userId = computed(() => this.auth.user()?.id ?? null);
  protected readonly isJoined = computed(() => {
    const userId = this.userId();
    const detail = this.detail();
    if (!userId || !detail) {
      return false;
    }
    return detail.players.some((player) => player.playerId === userId);
  });
  protected readonly isCreator = computed(() => this.detail()?.match.created_by === this.userId());
  protected readonly isLoggedIn = computed(() => this.auth.isAuthenticated());
  protected readonly canJoin = computed(() => {
    const detail = this.detail();
    return (
      this.isLoggedIn() &&
      detail !== null &&
      detail.match.status === 'open' &&
      !this.isJoined() &&
      detail.playerCount < detail.match.capacity
    );
  });

  constructor() {
    effect(() => {
      this.id();
      void this.reload();
    });
  }

  protected timeLabel(): string {
    const startsAt = this.detail()?.match.starts_at;
    return startsAt ? formatMatchTime(startsAt) : '';
  }

  protected stateLabel(): string {
    const detail = this.detail();
    return detail ? matchStateLabel(detail, this.userId()) : '';
  }

  protected levelLabel(): string {
    const detail = this.detail();
    return detail ? levelRange(detail) : '';
  }

  protected async join(): Promise<void> {
    const userId = this.userId();
    if (!userId) {
      await this.router.navigateByUrl('/login');
      return;
    }
    this.busy.set(true);
    this.actionError.set(null);
    const message = await this.matches.join(this.id(), userId);
    this.busy.set(false);
    if (message) {
      this.actionError.set(message);
      return;
    }
    await this.reload();
  }

  protected async leave(): Promise<void> {
    const userId = this.userId();
    if (!userId) {
      return;
    }
    this.busy.set(true);
    this.actionError.set(null);
    const message = await this.matches.leave(this.id(), userId);
    this.busy.set(false);
    if (message) {
      this.actionError.set(message);
      return;
    }
    await this.reload();
  }

  protected async cancel(): Promise<void> {
    this.busy.set(true);
    this.actionError.set(null);
    const message = await this.matches.cancel(this.id());
    this.busy.set(false);
    if (message) {
      this.actionError.set(message);
      return;
    }
    await this.reload();
  }

  private async reload(): Promise<void> {
    this.loading.set(true);
    this.error.set(null);
    try {
      const data = await this.matches.getById(this.id());
      this.detail.set(data);
      if (data === null) {
        this.error.set('No se ha encontrado este partido.');
      }
    } catch (err) {
      this.error.set(err instanceof Error ? err.message : 'No se ha podido cargar el partido.');
    } finally {
      this.loading.set(false);
    }
  }
}
