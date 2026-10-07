# Mervida Manufacturing Process Videos

Place your MP4 video files into this directory: `public/videos/`

### Recommended Video File Names:
1. `garri-manufacturing.mp4` – Video showing Ijebu Garri peeling, fermentation, and pan roasting.
2. `palm-oil-manufacturing.mp4` – Video showing Red Palm Oil fruit pressing and cold clarification.
3. `spices-manufacturing.mp4` – Video showing African herb dehydration, milling, and blend packaging.
4. `coconut-oil-manufacturing.mp4` – Video showing Virgin Coconut Oil cold-expeller pressing.
5. `carrot-oil-manufacturing.mp4` – Video showing Food-Grade Carrot Extract Oil maceration & bottling.

---

### Video Optimization & Compression Commands

For fast loading on web and mobile devices, we recommend compressing videos to H.264 MP4 format using Handbrake or the `ffmpeg` command below:

```bash
# General MP4 compression command for web (1080p/720p, fast loading)
ffmpeg -i input-video.mp4 -vcodec libx264 -crf 24 -preset fast -acodec aac -b:a 128k -movflags +faststart output-video.mp4
```

- `-crf 24`: Provides high visual quality while drastically reducing file size (usually < 10MB per video).
- `-movflags +faststart`: Enables instant web playback before the full video finishes downloading.
