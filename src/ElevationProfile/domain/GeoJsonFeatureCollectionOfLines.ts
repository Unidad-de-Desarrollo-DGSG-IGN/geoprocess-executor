export interface GeoJsonGeometry {
  type: string;
  coordinates: number[][][];
}

export interface GeoJsonProperty {
  alos_unificado_value: number;
}

export interface GeoJsonFeature {
  type: string;
  geometry: GeoJsonGeometry;
  bbox?: number[];
  properties: GeoJsonProperty;
}

export interface GeoJson {
  features: GeoJsonFeature[];
}
