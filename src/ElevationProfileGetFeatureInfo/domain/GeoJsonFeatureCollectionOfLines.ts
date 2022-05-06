export interface GeoJsonGeometry {
  type: string;
  coordinates: number[][][];
}

// export interface GeoJsonProperty {
//   feature_index: number;
//   alos_mosaico_value: number;
// }

export interface GeoJsonFeature {
  type: string;
  geometry: GeoJsonGeometry;
  bbox?: number[];
  // properties: GeoJsonProperty;
  properties: any;
}

export interface GeoJson {
  features: GeoJsonFeature[];
}
