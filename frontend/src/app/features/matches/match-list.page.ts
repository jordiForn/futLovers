import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { MatchCard, MatchService } from '../../core/data/match.service';
import { LocationService } from '../../core/location/location.service';
import { formatMatchTime, levelRange, matchStateLabel } from './match.helpers';

@Component({
  selector: 'app-match-list-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './match-list.page.html',
})
export class MatchListPage {
  private readonly matches = inject(MatchService);
  private readonly location = inject(LocationService);
  private readonly auth = inject(AuthService);
  private readonly fb = inject(FormBuilder);

  protected readonly loading = signal(true);
  protected readonly error = signal<string | null>(null);
  protected readonly items = signal<MatchCard[]>([]);
  protected readonly city = this.location.city;
  protected readonly userId = computed(() => this.auth.user()?.id ?? null);

  protected readonly cityForm = this.fb.nonNullable.group({
    city: [this.location.city()],
  });

  constructor() {
    void this.reload();
  }

  protected async changeCity(): Promise<void> {
    this.location.setCity(this.cityForm.controls.city.value);
    this.cityForm.controls.city.setValue(this.location.city());
    await this.reload();
  }

  protected distanceLabel(card: MatchCard): string | null {
    const km = this.location.distanceKm(card.venue?.latitude ?? null, card.venue?.longitude ?? null);
    if (km === null) {
      return null;
    }
    return `${km.toFixed(1)} km`;
  }

  protected timeLabel(card: MatchCard): string {
    return formatMatchTime(card.match.starts_at);
  }

  protected stateLabel(card: MatchCard): string {
    return matchStateLabel(card, this.userId());
  }

  protected levelLabel(card: MatchCard): string {
    return levelRange(card);
  }

  private async reload(): Promise<void> {
    this.loading.set(true);
    this.error.set(null);
    try {
      const data = await this.matches.listForDay(this.location.city(), new Date());
      this.items.set(data);
    } catch (err) {
      this.error.set(err instanceof Error ? err.message : 'No se han podido cargar los partidos.');
    } finally {
      this.loading.set(false);
    }
  }
}
