import { computed, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../supabase/supabase.client';

export function getSupabaseAuthRedirectUrl(): string | undefined {
  if (typeof window === 'undefined') {
    return undefined;
  }

  return `${window.location.origin}/login`;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly router = inject(Router);

  private readonly sessionState = signal<Session | null>(null);
  readonly ready = signal(false);
  readonly user = computed<User | null>(() => this.sessionState()?.user ?? null);
  readonly isAuthenticated = computed(() => this.user() !== null);

  private resolveReady: () => void = () => undefined;
  readonly initialized = new Promise<void>((resolve) => {
    this.resolveReady = resolve;
  });

  constructor() {
    void this.restoreSession();
  }

  private async restoreSession(): Promise<void> {
    const { data } = await supabase.auth.getSession();
    this.sessionState.set(data.session ?? null);
    this.ready.set(true);
    this.resolveReady();

    supabase.auth.onAuthStateChange((_event, session) => {
      this.sessionState.set(session);
    });
  }

  async signUp(email: string, password: string, username: string): Promise<string | null> {
    const redirectTo = getSupabaseAuthRedirectUrl();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username },
        emailRedirectTo: redirectTo,
      },
    });

    if (data.session) {
      this.sessionState.set(data.session);
    }

    return error?.message ?? null;
  }

  async signIn(email: string, password: string): Promise<string | null> {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return error?.message ?? null;
  }

  async signOut(): Promise<void> {
    await supabase.auth.signOut();
    await this.router.navigateByUrl('/');
  }
}
