import { Injectable, signal } from '@angular/core';

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export const DEFAULT_CITY = 'Dénia';

@Injectable({ providedIn: 'root' })
export class LocationService {
  readonly city = signal(DEFAULT_CITY);
  readonly coordinates = signal<Coordinates | null>(null);
  readonly permissionDenied = signal(false);

  constructor() {
    this.requestBrowserLocation();
  }

  setCity(city: string): void {
    const next = city.trim() || DEFAULT_CITY;
    this.city.set(next);
  }

  distanceKm(latitude: number | null, longitude: number | null): number | null {
    const origin = this.coordinates();
    if (origin === null || latitude === null || longitude === null) {
      return null;
    }

    return haversineKm(origin.latitude, origin.longitude, latitude, longitude);
  }

  private requestBrowserLocation(): void {
    if (!navigator.geolocation) {
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.coordinates.set({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        this.permissionDenied.set(false);
      },
      () => {
        this.permissionDenied.set(true);
        this.city.set(DEFAULT_CITY);
      },
    );
  }
}

export function haversineKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const toRad = (value: number) => (value * Math.PI) / 180;
  const earthRadiusKm = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  return earthRadiusKm * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
