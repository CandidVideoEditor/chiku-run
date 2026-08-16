/**
 * Chiku's animations ship as videos filmed on a black backdrop.
 * This helper keys out the black each frame so she can be drawn onto the
 * canvas as a transparent sprite.
 */
export class VideoSprite {
  readonly video: HTMLVideoElement;
  private readonly buffer: HTMLCanvasElement;
  private readonly bctx: CanvasRenderingContext2D;
  private lastTime = -1;
  ready = false;

  constructor(src: string, size = 256) {
    this.video = document.createElement("video");
    this.video.src = src;
    this.video.muted = true;
    this.video.loop = true;
    this.video.playsInline = true;
    this.video.preload = "auto";
    this.video.crossOrigin = "anonymous";
    this.video.addEventListener("loadeddata", () => {
      this.ready = true;
    });

    this.buffer = document.createElement("canvas");
    this.buffer.width = size;
    this.buffer.height = size;
    this.bctx = this.buffer.getContext("2d", { willReadFrequently: true })!;
  }

  play() {
    void this.video.play().catch(() => undefined);
  }

  pause() {
    this.video.pause();
  }

  reset() {
    try {
      this.video.currentTime = 0;
    } catch {
      /* metadata not ready yet */
    }
  }

  setRate(rate: number) {
    this.video.playbackRate = rate;
  }

  /** Returns a canvas holding the current frame with the black keyed out. */
  frame(): HTMLCanvasElement | null {
    if (!this.ready || this.video.readyState < 2) return null;
    if (this.video.currentTime !== this.lastTime) {
      this.lastTime = this.video.currentTime;
      const { width: w, height: h } = this.buffer;
      const vw = this.video.videoWidth || 1;
      const vh = this.video.videoHeight || 1;
      // Fit the video frame inside the square buffer (letterboxed).
      const scale = Math.min(w / vw, h / vh);
      const dw = vw * scale;
      const dh = vh * scale;
      this.bctx.clearRect(0, 0, w, h);
      this.bctx.drawImage(this.video, (w - dw) / 2, (h - dh) / 2, dw, dh);

      const data = this.bctx.getImageData(0, 0, w, h);
      const px = data.data;
      for (let i = 0; i < px.length; i += 4) {
        const lum = Math.max(px[i] ?? 0, px[i + 1] ?? 0, px[i + 2] ?? 0);
        if (lum <= 26) {
          px[i + 3] = 0;
        } else if (lum < 74) {
          px[i + 3] = Math.round(((lum - 26) / 48) * 255);
        }
      }
      this.bctx.putImageData(data, 0, 0);
    }
    return this.buffer;
  }
}
