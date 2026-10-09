# Tom's Ardoise

French words for young kids who aren't reading yet, drawn on the same Waldorf-style chalkboard as [Tom's Chalkboard](https://github.com/kateannewallace-bit/toms-chalkboard). Built for Tom; the child's name is set on the grown-ups page.

- **Listen and tap:** every question is spoken in French ("Où est le chat ?") and answered by tapping one of four pictures. A wrong tap names that picture ("Ça, c'est le chien"), so every tap teaches a word.
- **Dis-le !** Words already known come back as speaking practice: see the picture, say it out loud, tap to hear it, then mark whether it matched.
- **Topics:** greetings, colors, numbers to 100, shapes, animals, family, the body, food, clothes, home, toys and school, getting around, nature and weather, knights and tales, feelings, action words, little sentences ("une étoile verte", "trois chats", "le lapin est dans le chapeau"), a word set for each month's festival, and your own words.
- **Levels:** each level adds a set of about 6 words. Missed words come back after 1, 3, 7, 14 and 30 days.
- **Find out what's known:** a quick check asks 20 words across the main topics, one try each, and marks every right answer as known. Each check asks new words. You can also paste a word list or tap known words on the grown-ups page.
- Ends each round with a French cheer and an off-screen idea (songs, Jacques a dit, seasonal festivals). The grown-ups page has levels, known words, your own words, tricky words, a printable word sheet and sync.

## Run it

It's a static site with no build step. Run it locally:

```bash
python3 -m http.server 8778
```

On an iPad or iPhone, open the site in Safari and tap **Share → Add to Home Screen**. For a better French voice, download one under Settings → Accessibility → Spoken Content → Voices → French (Thomas, Audrey or Aurélie for French from France).

## Sync between devices (optional)

Uses the same Supabase project and `supabase/schema.sql` as Tom's Chalkboard. Sync codes are hashed with a different prefix, so the two apps never share a row. Put the project URL and publishable key in `config.js`.

## Updating

After changing files, bump `VERSION` in `sw.js` so installed copies pick up the change. Words live in `words.js`: one line per word, `French | English | picture`.
