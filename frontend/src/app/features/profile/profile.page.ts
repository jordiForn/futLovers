import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/auth/auth.service';
import { ProfileService } from '../../core/data/profile.service';
import { Profile } from '../../core/supabase/database.types';

@Component({
  selector: 'app-profile-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule],
  templateUrl: './profile.page.html',
})
export class ProfilePage {
  private readonly auth = inject(AuthService);
  private readonly profiles = inject(ProfileService);
  private readonly fb = inject(FormBuilder);

  protected readonly loading = signal(true);
  protected readonly error = signal<string | null>(null);
  protected readonly saved = signal(false);
  protected readonly profile = signal<Profile | null>(null);
  protected readonly saving = signal(false);

  protected readonly form = this.fb.nonNullable.group({
    username: ['', [Validators.required, Validators.minLength(2)]],
  });

  constructor() {
    void this.load();
  }

  protected async save(): Promise<void> {
    const profile = this.profile();
    if (!profile || this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving.set(true);
    this.saved.set(false);
    this.error.set(null);
    const message = await this.profiles.updateUsername(profile.id, this.form.controls.username.value);
    this.saving.set(false);
    if (message) {
      this.error.set(message);
      return;
    }
    this.saved.set(true);
    await this.load();
  }

  protected async logout(): Promise<void> {
    await this.auth.signOut();
  }

  private async load(): Promise<void> {
    const userId = this.auth.user()?.id;
    if (!userId) {
      this.loading.set(false);
      this.error.set('No hay sesión activa.');
      return;
    }

    this.loading.set(true);
    try {
      const profile = await this.profiles.getById(userId);
      this.profile.set(profile);
      if (profile) {
        this.form.controls.username.setValue(profile.username);
      }
    } catch (err) {
      this.error.set(err instanceof Error ? err.message : 'No se ha podido cargar el perfil.');
    } finally {
      this.loading.set(false);
    }
  }
}
