# nicolebusquant.fr

Site of Nicole Busquant, psychotherapist and psychoanalyst in Redon and Vannes.
Static HTML, CSS and JS: no build step and no dependencies.

## Structure

```
index.html                 Home: hero and divan, the two practices, Redon quay photo, FAQ, appointment
pages/qui-suis-je.html     Same URLs as the old site (/pages/qui-suis-je)
pages/consultations.html
legal.html                 /legal
404.html                   Served by GitHub Pages for any missing URL (absolute paths)
assets/css/style.css       Design tokens at the top (colours, fonts), 12-column grid
assets/js/main.js          Header, mobile menu, one-time line drawing, photo lightbox
assets/img/                Vector logo (logo-nb.svg), favicons, photos (.webp), og-image
assets/fonts/              Cormorant Garamond (roman, italic) and EB Garamond, self-hosted (OFL)
medias/                    Original photos and files (not used by the site)
```

## Design rules

- One 12-column grid, two axes only: the container edge (titles, addresses,
  questions, running text of the inner pages) and column 5 (photos and answers).
- One italic per page: the closing call "rendez-vous", or the title word on pages without a closing.
- The home page has one drawing, the divan, standing on a full-width floor line; its stroke is drawn once on load. The 404 page keeps its own line drawing.
- Photos share one grade: slightly less saturation, a neutral white balance, and
  blacks and whites brought to the site's night and paper colours.

## Deploy on GitHub Pages

1. Push to GitHub, then *Settings → Pages → Deploy from a branch → `main` / root*.
2. Custom domain: enter `nicolebusquant.fr` in *Settings → Pages → Custom domain*
   (GitHub creates the `CNAME` file), then at the registrar:
   - `A` records for `@` → `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - `CNAME` for `www` → `<user>.github.io`
   - Enable *Enforce HTTPS* once the certificate is issued.

Local preview: `python3 -m http.server` then http://localhost:8000.
