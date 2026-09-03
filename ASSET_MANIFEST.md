# Asset manifest

Hero and one supporting image per page are now real, licensed photography (see "Sourced
photography" below). Everything else (the 8/5/7 per-page story-sequence moment tiles) still
renders as a labeled placeholder (`PlaceholderMedia`, see
`src/components/industry/PlaceholderMedia.tsx`) so layout, crop, and motion can be reviewed
before licensed or client-supplied photography and film exist for each individual moment. The
structured data below is also defined per industry in code at
`src/content/{automotive,healthcare,real-estate}.ts` (`assetManifest` field) so it stays next
to the copy it belongs with.

Replace a placeholder by dropping the real file at the given path and swapping the
`PlaceholderMedia` call for a real `<Image>` / `<video>` element with the same `alt` text and
aspect ratio reserved (to avoid layout shift).

## Sourced photography (live today)

All eight files below are CC0 (public domain dedication), sourced from Wikimedia Commons,
downloaded, and re-encoded locally (stripped of embedded EXIF, capped at 2400px on the long
edge). No attribution is legally required under CC0; each page credits the photographer in a
plain caption line under the image anyway.

| File | Page | Section | Photographer | Source |
|---|---|---|---|---|
| `public/images/automotive/hero.jpg` | Automotive | Hero | Pietro De Grandi | [Commons](https://commons.wikimedia.org/wiki/File:Leather_car_interior_(Unsplash).jpg) |
| `public/images/automotive/detail.jpg` | Automotive | Modern marketing layer break | Vlad Grebenyev | [Commons](https://commons.wikimedia.org/wiki/File:Rohana_RFX5_(Unsplash).jpg) |
| `public/images/healthcare/hero.jpg` | Healthcare | Hero | W.carter | [Commons](https://commons.wikimedia.org/wiki/File:Reception_desk_for_Clinical_Physiology_-_N%C3%84L_hospital_1.jpg) |
| `public/images/healthcare/detail.jpg` | Healthcare | Modern marketing layer break | Beendy234 | [Commons](https://commons.wikimedia.org/wiki/File:Hospital_hallway_in_Lagos.jpg) |
| `public/images/real-estate/hero.jpg` | Real Estate | Hero | Jarosław Ceborski | [Commons](https://commons.wikimedia.org/wiki/File:Living_room_(Unsplash).jpg) |
| `public/images/real-estate/detail.jpg` | Real Estate | Modern marketing layer break | Jonathan Simcoe | [Commons](https://commons.wikimedia.org/wiki/File:Glass_building_corner_(Unsplash).jpg) |
| `public/images/education/campus-break.jpg` | Education | Break after capability journey | Dayne Topkin | [Commons](https://commons.wikimedia.org/wiki/File:University_of_Illinois_at_Urbana-Champaign,_Champaign,_United_States_(Unsplash_lguU6sOKwZA).jpg) |
| `public/images/education/library-break.jpg` | Education | Break after case studies | Aleksi Tappura | [Commons](https://commons.wikimedia.org/wiki/File:Uppsala_Library_(Unsplash).jpg) |

These are real, generic, safe-to-verify subject matter (a car interior, an alloy wheel, a
clinical reception desk, a hospital hallway, a living room, a glass facade, a campus street, a
library bookshelf) chosen deliberately over literal narrative reenactments: Commons' full-text
search matches filenames and upload descriptions, not what's actually depicted, so searching for
staged scenarios ("salesman shaking hands with customer," "nurse comforting patient") returned
irrelevant or, in a few cases, jarring mismatches (historic military and archival photos). Swap
any of these for client-supplied or licensed photography whenever it exists; nothing here is a
stand-in for brand-specific art direction.

## Still placeholders (story-sequence moments)

## Automotive

| File | Section | Purpose | Desktop | Mobile | Min size |
|---|---|---|---|---|---|
| `automotive-hero-loop.mp4` | Hero | Optional film upgrade over the current still | 16:9 (21:9 crop on ultra-wide) | 4:5 | 2400x1350 |
| `automotive-journey-{01-08}.jpg` | Scroll-pinned journey | One image per buyer-journey moment | 4:3 | 1:1 | 1600x1200 |
| `automotive-case-study-hero.jpg` | Case studies | Feature image once a case study is approved | 3:2 | 4:5 | 1800x1200 |

Art direction: graphite, chrome, glass, asphalt, reflected light within the shared MSM palette.
No neon, no cyberpunk gradients, no speedometer UI.

## Healthcare

| File | Section | Purpose | Desktop | Mobile | Min size |
|---|---|---|---|---|---|
| `healthcare-journey-{01-05}.jpg` | Story sequence | One image per composite journey moment | 4:3 | 1:1 | 1600x1200 |

Art direction: documentary style, natural light, warm neutral tones. No blue-glow medical
cliches, no distress-as-spectacle, no identifiable health information in any shot.

## Real Estate

| File | Section | Purpose | Desktop | Mobile | Min size |
|---|---|---|---|---|---|
| `real-estate-journey-{01-07}.jpg` | Spatial story | One image per stage, first impression to place reputation | 4:3 | 1:1 | 1600x1200 |

Art direction: charcoal and off-white with the shared MSM red accent, measured typography-led
crop. No gold-on-black luxury cliches, no drone skyline montages. Conceptual renders must be
labeled as such wherever the client or local rules require it.

## Shared rules

- Licensing/approval status is tracked per asset in the code (`licensingStatus` field);
  everything still on the placeholder list reads "production placeholder" or "not yet
  available."
- Alt text is already written per asset and ships with the placeholder today, so swapping in
  the real file requires no further accessibility work beyond confirming it still matches.
- No asset is hotlinked from a third party; production assets are self-hosted from `/public`
  and referenced via `next/image` for automatic optimization, including the sourced
  photography above.
