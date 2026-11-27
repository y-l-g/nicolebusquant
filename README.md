# nicolebusquant.fr

Site of Nicole Busquant, psychotherapist and psychoanalyst in Redon and Vannes.
Static HTML, CSS and JS: no build step and no dependencies.

## Structure

```
index.html                 Home: the room (lamp and divan), the two practices, Redon quay, questions, appointment
pages/qui-suis-je.html     Same URLs as the old site (/pages/qui-suis-je)
pages/consultations.html
legal.html                 /legal
404.html                   Served by GitHub Pages for any missing URL (absolute paths)
assets/css/style.css       Design tokens at the top (light and dark colours, fonts), 12-column grid
assets/js/main.js          Mobile menu, the one-time line drawing, photo lightbox
assets/img/                Vector logo (logo-nb.svg), favicons, photos (.webp), og-image
assets/fonts/              Cormorant Garamond (roman, italic) and EB Garamond, self-hosted (OFL),
                           subset to Latin with small caps and old-style figures kept
medias/                    Original photos and files (not used by the site)
```

## Design rules

- **One line.** Every page has a single continuous stroke running along the floor,
  edge to edge. It draws the lamp on every page and, on the home page, the divan.
  On the home page it is traced once on load, from the left edge of the screen to
  the right one; on the other pages it is simply there.
- **One light.** The lamp's glow is the only warm colour. It is dimmed on the
  404 page and comes back on when the visitor hovers the way home. In dark mode
  the page becomes the room at night and the lamp carries it.
  The site follows the device setting; a small lamp switch in the footer
  ("Mode nuit") overrides it, and the choice is kept in the browser's local
  storage only when it differs from the device (no cookie).
- **A book page.** Two axes only: the margin (columns 1 to 4: section names,
  notes, captions, the ADELI number) and the text column (columns 5 to 11).
  Page titles and the home title start at the container edge.
- **Book typography.** True small caps for labels, old-style figures in running
  text, narrow no-break spaces before `?` `!` `;` `:` and inside « », and French
  dialogue dashes for the questions on the home page.
- Photos share one grade: slightly less saturation, a neutral white balance, and
  blacks and whites brought to the site's ink and paper colours.

## Deploy on GitHub Pages

1. Push to GitHub, then *Settings → Pages → Deploy from a branch → `main` / root*.
2. Custom domain: enter `nicolebusquant.fr` in *Settings → Pages → Custom domain*
   (GitHub creates the `CNAME` file), then at the registrar:
   - `A` records for `@` → `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - `CNAME` for `www` → `<user>.github.io`
   - Enable *Enforce HTTPS* once the certificate is issued.

Local preview: `python3 -m http.server` then http://localhost:8000.
