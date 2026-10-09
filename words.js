/* Vocabulary. One word per line: French (with its article) | English | picture.
   A picture is an emoji, c:#hex for a color swatch, or s:name for a drawn shape.
   Words are taught in sets of 6, in the order written here, so put the easiest first.
   Action words have a fourth part: the "il/elle" form used in "Qui nage ?" */

// How each topic asks for a word: 'ou' → "Où est le chat ?", 'qui' → "Qui dit « merci » ?", 'fait' → "Qui nage ?"
const TOPICS = [
  { id: 'bonjour', fr: 'Bonjour !', en: 'Hello and manners', ask: 'qui', sayAsk: "Qu'est-ce qu'on dit ?", words: `
bonjour|hello|👋😀
au revoir|goodbye|👋🚪
merci|thank you|🎁😊
s'il te plaît|please|🥺🍪
oui|yes|👍
non|no|👎
bonne nuit|good night|🌙😴
pardon|sorry|💥😬
salut|hi|🙋
bon appétit|enjoy your meal|🍽️😋
joyeux anniversaire|happy birthday|🎂🎉
à demain|see you tomorrow|👋🌅` },

  { id: 'couleurs', fr: 'Les couleurs', en: 'Colors', ask: 'ou', words: `
le rouge|red|c:#e0473e
le bleu|blue|c:#3f7fd9
le jaune|yellow|c:#f2d23c
le vert|green|c:#4caf50
l'orange|orange|c:#f08a24
le noir|black|c:#111111
le blanc|white|c:#fafafa
le rose|pink|c:#f28cb4
le violet|purple|c:#8e5ccf
le marron|brown|c:#8b5a2b
le gris|gray|c:#9a9a9a` },

  { id: 'nombres', fr: 'Les nombres', en: 'Numbers', ask: 'ou', numbers: true },

  { id: 'formes', fr: 'Les formes', en: 'Shapes', ask: 'ou', words: `
le rond|circle|s:rond
le carré|square|s:carre
le triangle|triangle|s:triangle
l'étoile|star|s:etoile
le cœur|heart|s:coeur
le rectangle|rectangle|s:rectangle
le losange|diamond|s:losange` },

  { id: 'animaux', fr: 'Les animaux', en: 'Animals', ask: 'ou', words: `
le chat|cat|🐱
le chien|dog|🐶
le poisson|fish|🐟
l'oiseau|bird|🐦
le lapin|rabbit|🐰
la souris|mouse|🐭
le cheval|horse|🐴
la vache|cow|🐮
le cochon|pig|🐷
le mouton|sheep|🐑
le canard|duck|🦆
la poule|hen|🐔
l'ours|bear|🐻
le lion|lion|🦁
le singe|monkey|🐵
l'éléphant|elephant|🐘
le tigre|tiger|🐯
la girafe|giraffe|🦒
la grenouille|frog|🐸
le serpent|snake|🐍
la tortue|tortoise|🐢
le renard|fox|🦊
le loup|wolf|🐺
le hibou|owl|🦉
le papillon|butterfly|🦋
l'abeille|bee|🐝
l'escargot|snail|🐌
le crocodile|crocodile|🐊
la baleine|whale|🐳
le zèbre|zebra|🦓` },

  { id: 'nourriture', fr: 'La nourriture', en: 'Food', ask: 'ou', words: `
la pomme|apple|🍎
la banane|banana|🍌
le pain|bread|🍞
le lait|milk|🥛
le fromage|cheese|🧀
l'œuf|egg|🥚
la fraise|strawberry|🍓
l'orange|orange|🍊
le raisin|grapes|🍇
la carotte|carrot|🥕
le gâteau|cake|🎂
la glace|ice cream|🍦
l'eau|water|💧
le jus|juice|🧃
la soupe|soup|🍲
les pâtes|pasta|🍝
le croissant|croissant|🥐
la tomate|tomato|🍅
le chocolat|chocolate|🍫
le miel|honey|🍯
la poire|pear|🍐
le citron|lemon|🍋
les cerises|cherries|🍒
la pastèque|watermelon|🍉
le poulet|chicken|🍗
le riz|rice|🍚
la crêpe|pancake|🥞
le biscuit|biscuit|🍪
les frites|chips|🍟
le maïs|corn|🌽` },

  { id: 'corps', fr: 'Le corps', en: 'The body', ask: 'ou', words: `
le nez|nose|👃
la bouche|mouth|👄
l'œil|eye|👁️
l'oreille|ear|👂
la main|hand|✋
le pied|foot|🦶
la jambe|leg|🦵
le bras|arm|💪
la dent|tooth|🦷
la langue|tongue|👅
le doigt|finger|☝️
les cheveux|hair|💇
le cerveau|brain|🧠` },

  { id: 'famille', fr: 'La famille', en: 'Family', ask: 'ou', words: `
la maman|mum|👩
le papa|dad|👨
le bébé|baby|👶
le garçon|boy|👦
la fille|girl|👧
la famille|family|👨‍👩‍👦
la mamie|grandma|👵
le papi|grandpa|👴
les amis|friends|🧑‍🤝‍🧑` },

  { id: 'vetements', fr: 'Les vêtements', en: 'Clothes', ask: 'ou', words: `
le chapeau|hat|🎩
le t-shirt|T-shirt|👕
le pantalon|trousers|👖
la robe|dress|👗
les chaussures|shoes|👟
les chaussettes|socks|🧦
le manteau|coat|🧥
l'écharpe|scarf|🧣
les gants|gloves|🧤
la casquette|cap|🧢
les lunettes|glasses|👓
les bottes|boots|🥾
la chemise|shirt|👔
le short|shorts|🩳
le maillot de bain|swimsuit|🩱
le sac à dos|backpack|🎒
le parapluie|umbrella|☂️` },

  { id: 'maison', fr: 'La maison', en: 'At home', ask: 'ou', words: `
la maison|house|🏠
la porte|door|🚪
la fenêtre|window|🪟
le lit|bed|🛏️
la chaise|chair|🪑
le livre|book|📖
la lampe|lamp|💡
la clé|key|🔑
la baignoire|bathtub|🛁
les toilettes|toilet|🚽
la télé|TV|📺
la tasse|cup|☕
la cuillère|spoon|🥄
la fourchette|fork|🍴
le miroir|mirror|🪞
la bougie|candle|🕯️
le balai|broom|🧹
le canapé|sofa|🛋️` },

  { id: 'jouets', fr: "Les jouets et l'école", en: 'Toys and school', ask: 'ou', words: `
le ballon|ball|⚽
l'ours en peluche|teddy bear|🧸
la poupée|doll|🪆
le cerf-volant|kite|🪁
les cubes|blocks|🧱
le crayon|pencil|✏️
le tambour|drum|🥁
le dé|dice|🎲
le puzzle|puzzle|🧩
le robot|robot|🤖
le yo-yo|yo-yo|🪀
les ciseaux|scissors|✂️
le pinceau|paintbrush|🖌️
le cahier|notebook|📓
la trompette|trumpet|🎺
la guitare|guitar|🎸
les crayons de couleur|crayons|🖍️` },

  { id: 'transports', fr: 'Les transports', en: 'Getting around', ask: 'ou', words: `
la voiture|car|🚗
le bus|bus|🚌
le train|train|🚂
l'avion|plane|✈️
le bateau|boat|⛵
le vélo|bike|🚲
le camion|lorry|🚚
la fusée|rocket|🚀
la moto|motorbike|🏍️
l'hélicoptère|helicopter|🚁
le tracteur|tractor|🚜
l'ambulance|ambulance|🚑
le camion de pompiers|fire engine|🚒
la trottinette|scooter|🛴
le taxi|taxi|🚕
la montgolfière|hot-air balloon|🎈` },

  { id: 'nature', fr: 'La nature et le temps', en: 'Nature and weather', ask: 'ou', words: `
le soleil|sun|☀️
la lune|moon|🌙
l'étoile|star|⭐
la pluie|rain|🌧️
la neige|snow|❄️
l'arbre|tree|🌳
la fleur|flower|🌸
le nuage|cloud|☁️
le vent|wind|🌬️
l'arc-en-ciel|rainbow|🌈
la mer|sea|🌊
la montagne|mountain|⛰️
la feuille|leaf|🍁
le champignon|mushroom|🍄
la pierre|stone|🪨
le feu|fire|🔥
l'éclair|lightning|⚡
la forêt|forest|🌲` },

  { id: 'contes', fr: 'Contes et chevaliers', en: 'Knights and tales', ask: 'ou', words: `
le château|castle|🏰
le dragon|dragon|🐉
le chevalier|knight|🤺
la princesse|princess|👸
le prince|prince|🤴
l'épée|sword|🗡️
le bouclier|shield|🛡️
la couronne|crown|👑
la fée|fairy|🧚
la sorcière|witch|🧙‍♀️
la licorne|unicorn|🦄
le trésor|treasure|💎
le fantôme|ghost|👻
le vampire|vampire|🧛
la sirène|mermaid|🧜‍♀️
le troll|troll|🧌
l'arc|bow|🏹
la baguette magique|magic wand|🪄
le génie|genie|🧞` },

  { id: 'emotions', fr: 'Comment ça va ?', en: 'Feelings', ask: 'qui', sayAsk: 'Comment ça va ?', words: `
je suis content|I'm happy|😊
je suis triste|I'm sad|😢
je suis fâché|I'm cross|😠
je suis fatigué|I'm tired|🥱
j'ai peur|I'm scared|😱
j'ai froid|I'm cold|🥶
j'ai chaud|I'm hot|🥵
j'ai faim|I'm hungry|🤤
j'ai soif|I'm thirsty|🥤
je suis malade|I'm ill|🤒
je suis surpris|I'm surprised|😮
je rigole|I'm laughing|😂` },

  { id: 'actions', fr: 'Les actions', en: 'Action words', ask: 'fait', sayAsk: "Qu'est-ce qu'il fait ?", words: `
courir|run|🏃|court
nager|swim|🏊|nage
danser|dance|💃|danse
chanter|sing|🎤|chante
dormir|sleep|😴|dort
manger|eat|😋🍴|mange
boire|drink|🥤|boit
lire|read|📖|lit
dessiner|draw|🎨|dessine
sauter|jump|🤸|saute
marcher|walk|🚶|marche
pleurer|cry|😭|pleure
rire|laugh|😂|rit
grimper|climb|🧗|grimpe
cuisiner|cook|🧑‍🍳|cuisine
écrire|write|✍️|écrit
faire du vélo|ride a bike|🚴|fait du vélo
jouer|play|🤹|joue` },

  { id: 'phrases', fr: 'Petites phrases', en: 'Little sentences', phrases: true,
    levels: ['Couleur + forme (une étoile verte)', 'Combien ? (trois chats)', 'Qui mange quoi ?', 'Dans, sur, sous, à côté'] },

  { id: 'saison', fr: 'Ce mois-ci', en: 'This month', ask: 'ou', seasonal: true },

  { id: 'mesmots', fr: 'Mes mots', en: 'My words', ask: 'ou', custom: true },
];

// A few words for each month, following the Waldorf festival year and French traditions.
const SEASONS = [
  { name: "Janvier : l'Épiphanie et la neige", hands: 'Bake or buy a galette des rois and hide a bean (la fève). Whoever finds it wears the crown: "Vive le roi !"', words: `
la couronne|crown|👑
la galette des rois|king cake|🥧
le bonhomme de neige|snowman|⛄
la neige|snow|❄️
la luge|sledge|🛷
les gants|gloves|🧤
l'étoile|star|⭐
les patins|ice skates|⛸️` },
  { name: 'Février : la Chandeleur et Carnaval', hands: 'Make crêpes together for la Chandeleur. Flip one holding a coin in the other hand, for luck!', words: `
la crêpe|pancake|🥞
la bougie|candle|🕯️
le masque|mask|🎭
le clown|clown|🤡
les confettis|confetti|🎊
le cœur|heart|❤️
la poêle|frying pan|🍳` },
  { name: 'Mars : le printemps', hands: 'Plant a seed in a pot and greet it each morning: "Bonjour, petite graine !"', words: `
la fleur|flower|🌷
la graine|seed|🌱
le nid|nest|🪺
l'oiseau|bird|🐦
le ver de terre|worm|🪱
le parapluie|umbrella|☔
le papillon|butterfly|🦋` },
  { name: 'Avril : Pâques', hands: 'In France the Easter bells (les cloches) fly to Rome and bring back chocolate. Hide eggs and give clues in French.', words: `
l'œuf|egg|🥚
le lapin|rabbit|🐰
la cloche|bell|🔔
le poussin|chick|🐣
le panier|basket|🧺
le poisson d'avril|April fish|🐟
le chocolat|chocolate|🍫` },
  { name: 'Mai : les fleurs', hands: 'Pick a bouquet for the nature table and name each color in French.', words: `
l'abeille|bee|🐝
la fraise|strawberry|🍓
le ruban|ribbon|🎀
le bouquet|bouquet|💐
la coccinelle|ladybird|🐞
la fleur|flower|🌸
le papillon|butterfly|🦋` },
  { name: 'Juin : la Saint-Jean', hands: 'For la Saint-Jean, light a candle or a small fire at dusk and name what you see: le feu, la lune, les étoiles.', words: `
le feu|fire|🔥
le soleil|sun|☀️
la cerise|cherry|🍒
la plage|beach|🏖️
le grillon|cricket|🦗
le lac|lake|🏞️` },
  { name: 'Juillet : le 14 juillet et la mer', hands: 'Draw the French flag together: bleu, blanc, rouge. Watch for fireworks: "Oh, le feu d\'artifice !"', words: `
le feu d'artifice|fireworks|🎆
le drapeau|flag|🇫🇷
la mer|sea|🌊
le coquillage|shell|🐚
le crabe|crab|🦀
la glace|ice cream|🍦
le seau|bucket|🪣` },
  { name: "Août : l'été", hands: 'Lie outside at night and count the stars in French. Make a wish on une étoile filante!', words: `
la tente|tent|⛺
l'étoile filante|shooting star|🌠
le tournesol|sunflower|🌻
la pastèque|watermelon|🍉
le maïs|corn|🌽
la montagne|mountain|⛰️` },
  { name: 'Septembre : la Saint-Michel', hands: 'Act out Saint Michel and the dragon. Who is brave? "Je n\'ai pas peur !"', words: `
le dragon|dragon|🐉
l'épée|sword|🗡️
le cartable|school bag|🎒
l'école|school|🏫
la pomme|apple|🍎
le blé|wheat|🌾` },
  { name: "Octobre : l'automne et Halloween", hands: 'Carve or draw une citrouille together and give it a face: content, triste or fâché?', words: `
la citrouille|pumpkin|🎃
le fantôme|ghost|👻
la chauve-souris|bat|🦇
l'araignée|spider|🕷️
la toile d'araignée|spider web|🕸️
le squelette|skeleton|💀
la sorcière|witch|🧙‍♀️
les bonbons|sweets|🍬
le chat noir|black cat|🐈‍⬛
la feuille morte|fallen leaf|🍂
le hibou|owl|🦉
le balai|broom|🧹` },
  { name: 'Novembre : la Saint-Martin', hands: 'Make a lantern for the Saint-Martin walk. Sing as you go, and say "Bonne nuit, la lune !" at the end.', words: `
la lanterne|lantern|🏮
le manteau|coat|🧥
le cheval|horse|🐴
la bougie|candle|🕯️
la nuit|night|🌃
l'écureuil|squirrel|🐿️
la châtaigne|chestnut|🌰
le brouillard|fog|🌫️` },
  { name: 'Décembre : Noël', hands: 'Name the ornaments as you decorate: une étoile, une cloche, un ange.', words: `
le sapin|fir tree|🎄
le cadeau|present|🎁
le Père Noël|Father Christmas|🎅
l'ange|angel|👼
la cloche|bell|🔔
l'étoile|star|⭐
la chaussette|stocking|🧦
le renne|reindeer|🦌` },
];

// Something to do away from the screen, matched to what was practiced. {name} is the child's name.
const HANDS = {
  bonjour: 'Make French the family greeting today: "Bonjour !" at breakfast, "Merci !" at the table and "Bonne nuit !" at bedtime.',
  couleurs: 'Color hunt: call "Trouve quelque chose de rouge !" and race to touch something red. Then swap who calls.',
  nombres: 'Count the stairs in French on the way up, and back down. Play "Un, deux, trois, soleil !" (French Red Light, Green Light).',
  formes: 'Draw shapes in the sand or with a stick and name them: un rond, un carré, une étoile.',
  animaux: 'Animal charades: act one out and ask "Qui suis-je ?" Then swap.',
  nourriture: 'At the next meal, ask for everything in French: "Du pain, s\'il te plaît !" "Merci !"',
  corps: 'Play "Jacques a dit" (Simon Says): "Jacques a dit : touche ton nez !" Sing "Alouette" and point to each part of the bird.',
  famille: 'Look at family photos and name everyone: maman, papa, mamie, papi, le bébé.',
  vetements: 'Sing "Promenons-nous dans les bois." The wolf names each thing he puts on: "Je mets mon chapeau !"',
  maison: 'Hide a toy and give clues in French: "Près de la porte… sous la chaise…"',
  jouets: 'Play shop with toys: "Je voudrais le dé, s\'il vous plaît." "Voilà !"',
  transports: 'Sit by a window and call out what goes by: une voiture, un bus, un vélo!',
  nature: 'Nature walk: bring back treasures for the nature table and name them: une feuille, une pierre, une fleur.',
  contes: 'Act out a knight and a dragon in French: "Le chevalier a une épée ! Le dragon a peur !"',
  emotions: 'Make faces in a mirror and name them: "Je suis content ! Je suis fâché !"',
  actions: '"Jacques a dit" with actions: "Jacques a dit : danse ! Saute ! Cours !"',
  phrases: 'Hide a toy dans, sur or sous something and let {name} tell you where it is in French.',
  mesmots: 'Pick one of your own words and use it in French all day.',
};

// End-of-round cheers by how the round went (90% / 70% / 40% / under). French heading, English line.
const CHEERS = [
  [['Magnifique', 'Renart the fox tips his hat to you!'],
   ['Formidable', 'Roland would blow his great horn for a round like that!'],
   ['Bravo', 'Even the Tarasque stopped stomping to listen!'],
   ['Chapeau', 'Fit for the court of Charlemagne!'],
   ['Parfait', 'Puss in Boots bows low with his feathered hat!']],
  [['Très bien', 'Saint Michel would lend you his golden sword!'],
   ['Super', 'Mélusine flicks her dragon tail with delight!'],
   ['Bien joué', 'A fine round for a young chevalier.']],
  [['Pas mal', 'Petit à petit, l\'oiseau fait son nid: little by little, the bird builds its nest.'],
   ['Bon travail', 'Every word you hear today will feel easier tomorrow.']],
  [['Courage', 'Even knights practice with their swords every day.'],
   ['On continue', 'New words are tricky at first. You heard lots of them today!']],
];
