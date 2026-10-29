import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { MatchService } from '../../core/data/match.service';
import { FieldOption, VenueService } from '../../core/data/venue.service';

@Component({
  selector: 'app-match-create-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule],
  templateUrl: './match-create.page.html',
})
export class MatchCreatePage {
  private readonly fb = inject(FormBuilder);
  private readonly venues = inject(VenueService);
  private readonly matches = inject(MatchService);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly fields = signal<FieldOption[]>([]);
  protected readonly loading = signal(true);
  protected readonly error = signal<string | null>(null);
  protected readonly submitting = signal(false);

  protected readonly form = this.fb.nonNullable.group({
    startsAt: ['', Validators.required],
    fieldId: ['', Validators.required],
    minLevel: [''],
    maxLevel: [''],
    notes: [''],
  });

  constructor() {
    void this.loadFields();
  }

  protected async submit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const userId = this.auth.user()?.id;
    if (!userId) {
      await this.router.navigateByUrl('/login');
      return;
    }

    const value = this.form.getRawValue();
    this.submitting.set(true);
    this.error.set(null);
    const { id, error } = await this.matches.create({
      createdBy: userId,
      fieldId: value.fieldId,
      startsAt: new Date(value.startsAt).toISOString(),
      minLevel: value.minLevel === '' ? null : Number(value.minLevel),
      maxLevel: value.maxLevel === '' ? null : Number(value.maxLevel),
      notes: value.notes.trim() === '' ? null : value.notes.trim(),
    });
    this.submitting.set(false);

    if (error || !id) {
      this.error.set(error ?? 'No se ha podido crear el partido.');
      return;
    }

    await this.router.navigate(['/matches', id]);
  }

  private async loadFields(): Promise<void> {
    try {
      this.fields.set(await this.venues.listFields());
    } catch (err) {
      this.error.set(err instanceof Error ? err.message : 'No se han podido cargar los campos.');
    } finally {
      this.loading.set(false);
    }
  }
}
