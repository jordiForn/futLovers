import { Injectable } from '@angular/core';
import { Field, Venue } from '../supabase/database.types';
import { supabase } from '../supabase/supabase.client';

export interface FieldOption {
  field: Field;
  venue: Venue;
}

@Injectable({ providedIn: 'root' })
export class VenueService {
  async listFields(): Promise<FieldOption[]> {
    const { data, error } = await supabase
      .from('fields')
      .select('*, venues(*)')
      .order('name');

    if (error) {
      throw error;
    }

    return (data ?? [])
      .map((row) => {
        const venue = unwrapVenue(row.venues);
        if (venue === null) {
          return null;
        }
        return {
          field: {
            id: row.id,
            venue_id: row.venue_id,
            name: row.name,
            modality: row.modality,
            capacity: row.capacity,
            created_at: row.created_at,
          },
          venue,
        };
      })
      .filter((item): item is FieldOption => item !== null);
  }
}

function unwrapVenue(value: Venue | Venue[] | null): Venue | null {
  if (Array.isArray(value)) {
    return value[0] ?? null;
  }
  return value;
}
