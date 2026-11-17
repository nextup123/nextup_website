# Media

Already included:
  brand/logo.avif                       site logo (nav and footer)
  images/products/cobot.avif, robot.avif, robot1.avif
  videos/glass-automation.mp4 (+ .jpg poster)
  videos/cnc-cap-handling.mp4 (+ .jpg)
  videos/cobot-dual-spm-integration.mp4 (+ .jpg)
  logos/*.avif                          recognition logos

Still wanted (the site shows a labelled placeholder or reuses a product photo until added):
  images/about-team.jpg                 team or factory photo, 4:3
  application photos                    one per application; set the `image` path in src/data/content.js
  a Robot1 video                        set media.video in src/data/products.js
  more product photos                   add to each product's media.gallery

Tips: product photos on a dark background (or transparent cut-outs) look best.
Keep images under ~300 KB and videos as muted H.264 MP4 under ~5 MB.
