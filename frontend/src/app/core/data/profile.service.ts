import { Injectable } from '@angular/core';
import { Profile } from '../supabase/database.types';
import { supabase } from '../supabase/supabase.client';

@Injectable({ providedIn: 'root' })
export class ProfileService {
  async getById(id: string): Promise<Profile | null> {
    const { data, error } = await supabase.from('profiles').select('*').eq('id', id).maybeSingle();
    if (error) {
      throw error;
    }
    return data;
  }

  async updateUsername(id: string, username: string): Promise<string | null> {
    const { error } = await supabase.from('profiles').update({ username }).eq('id', id);
    return error?.message ?? null;
  }
}
