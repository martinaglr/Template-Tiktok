export interface MediaSource {
  /** Resolves a media key to a servable URL. */
  urlFor(key: string): string;
}
