import type { MediaSource } from "./types";

/** Serves media straight from /public. Swapped for BackblazeMediaSource later. */
export class LocalMediaSource implements MediaSource {
  urlFor(key: string): string {
    return key.startsWith("/") ? key : `/${key}`;
  }
}
