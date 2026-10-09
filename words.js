/* Vocabulary. One word per line: French (with its article) | English | picture.
   A picture is an emoji, c:#hex for a color swatch, or s:name for a drawn shape.
   Words are taught in sets of 6, in the order written here, so put the easiest first.
   Action words have a fourth part: the "il/elle" form used in "Qui nage ?" */

// How each topic asks for a word: 'ou' → "Où est le chat ?", 'qui' → "Qui dit « merci » ?", 'fait' → "Qui nage ?"
const TOPICS = [
  { id: 'conversations', fr: 'On discute !', en: 'Conversations', convo: true },

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

  // Colors are taught bare ("rouge"), the way children answer "C'est quelle couleur ?". The question adds the article: "Où est le rouge ?"
  { id: 'couleurs', fr: 'Les couleurs', en: 'Colors', ask: 'ou', article: true, words: `
rouge|red|c:#e0473e
bleu|blue|c:#3f7fd9
jaune|yellow|c:#f2d23c
vert|green|c:#4caf50
orange|orange|c:#f08a24
noir|black|c:#111111
blanc|white|c:#fafafa
rose|pink|c:#f28cb4
violet|purple|c:#8e5ccf
marron|brown|c:#8b5a2b
gris|gray|c:#9a9a9a` },

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
la grand-mère|grandmother|👵
le grand-père|grandfather|👴
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
  conversations: 'Play a scene for real with toys or puppets: you are the boulangère, Papa on the phone or the dragon. Then swap, so {name} asks the questions.',
  bonjour: 'Make French the family greeting today: "Bonjour !" at breakfast, "Merci !" at the table and "Bonne nuit !" at bedtime.',
  couleurs: 'Color hunt: call "Trouve quelque chose de rouge !" and race to touch something red. Then swap who calls.',
  nombres: 'Count the stairs in French on the way up, and back down. Play "Un, deux, trois, soleil !" (French Red Light, Green Light).',
  formes: 'Draw shapes in the sand or with a stick and name them: un rond, un carré, une étoile.',
  animaux: 'Animal charades: act one out and ask "Qui suis-je ?" Then swap.',
  nourriture: 'At the next meal, ask for everything in French: "Du pain, s\'il te plaît !" "Merci !"',
  corps: 'Play "Jacques a dit" (Simon Says): "Jacques a dit : touche ton nez !" Sing "Alouette" and point to each part of the bird.',
  famille: 'Look at family photos and name everyone: maman, papa, la grand-mère, le grand-père, le bébé.',
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
   ['Chapeau', 'Fit for the court of Charlemagne!']],
  [['Très bien', 'Saint Michel would lend you his golden sword!'],
   ['Super', 'Mélusine flicks her dragon tail with delight!'],
   ['Bien joué', 'A fine round for a young chevalier.']],
  [['Pas mal', 'Petit à petit, l\'oiseau fait son nid: little by little, the bird builds its nest.'],
   ['Bon travail', 'Every word you hear today will feel easier tomorrow.']],
  [['Courage', 'Even knights practice with their swords every day.'],
   ['On continue', 'New words are tricky at first. You heard lots of them today!']],
];

/* Conversations: short scenes from everyday life. The character speaks; the child answers.
   them: what the character says. you: the child's reply. pic: a picture of the reply's meaning.
   type: what kind of reply it is. Wrong choices are always replies of another type, so only one picture answers the question.
   ask: a turn where the child asks the question (hint is for the grown-up); answer: what the character says back.
   {name} and {age} become the child's name and age. pitch: how high the character's voice is. */
const SCENES = [
  { title: 'Bonjour, Renart !', who: '🦊', pitch: 1.3, steps: [
    { them: 'Bonjour !', you: 'Bonjour, Renart !', pic: '👋😀', en: 'Hello, Renart!', type: 'greet' },
    { them: "Comment tu t'appelles ?", you: "Je m'appelle {name}.", pic: '🙋📛', en: 'My name is {name}.', type: 'name' },
    { ask: "Et toi, comment tu t'appelles ?", hint: 'Ask the fox his name.', pic: '❓📛', en: "And you, what's your name?", answer: "Moi, je m'appelle Renart !", type: 'askname' },
    { them: 'Au revoir, {name} !', you: 'Au revoir, Renart !', pic: '👋🚪', en: 'Goodbye, Renart!', type: 'bye' },
  ] },
  { title: 'Ça va, Maman ?', who: '👩', pitch: 1.1, steps: [
    { them: 'Bonjour ! Ça va ?', you: 'Ça va bien, merci !', pic: '😊👍', en: "I'm fine, thank you!", type: 'fine' },
    { ask: 'Et toi, ça va ?', hint: 'Ask Maman how she is.', pic: '❓😊', en: 'And you, how are you?', answer: 'Très bien, merci !', type: 'askhow' },
    { them: 'Tu as faim ?', you: "Oui, j'ai faim !", pic: '🤤🍽️', en: "Yes, I'm hungry!", type: 'hungry' },
    { them: 'Tu veux une crêpe ?', you: "Oui, s'il te plaît !", pic: '👍🙏', en: 'Yes, please!', type: 'yesplease' },
    { them: 'Voilà !', you: 'Merci, Maman !', pic: '🎁😊', en: 'Thank you, Maman!', type: 'thanks' },
  ] },
  { title: 'Le chevalier', who: '🤺', pitch: 0.8, steps: [
    { them: 'Bonjour ! Quel âge as-tu ?', you: "J'ai {age} ans.", pic: '🎂{age}', en: "I'm {age}.", type: 'age' },
    { them: 'Tu aimes les dragons ?', you: "Oui, j'adore les dragons !", pic: '😍🐉', en: 'Yes, I love dragons!', type: 'like' },
    { ask: 'Et toi, quel âge as-tu ?', hint: 'Ask the knight how old he is.', pic: '❓🎂', en: 'And you, how old are you?', answer: "Moi ? J'ai cent ans !", type: 'askage' },
    { them: 'Tu veux une épée ?', you: 'Oh oui ! Merci beaucoup !', pic: '🗡️😃', en: 'Oh yes! Thank you very much!', type: 'gift' },
  ] },
  { title: 'À table !', who: '👨', pitch: 0.8, steps: [
    { them: 'À table !', you: "J'arrive !", pic: '🏃🍽️', en: "I'm coming!", type: 'coming' },
    { them: 'Bon appétit !', you: 'Merci ! Bon appétit, Papa !', pic: '🍽️😋', en: 'Thanks! Enjoy your meal, Papa!', type: 'bonap' },
    { them: "Tu veux de l'eau ?", you: "Oui, s'il te plaît. J'ai soif.", pic: '🥤🙏', en: "Yes, please. I'm thirsty.", type: 'thirsty' },
    { them: 'Encore des pâtes ?', you: "Non merci, j'ai fini !", pic: '🙅✅', en: "No thanks, I've finished!", type: 'nothanks' },
  ] },
  { title: 'À la boulangerie', who: '👩‍🍳', pitch: 1.1, steps: [
    { them: "Bonjour ! Qu'est-ce que tu veux ?", you: "Un croissant, s'il vous plaît.", pic: '🥐🙏', en: 'A croissant, please.', type: 'order' },
    { them: 'Et avec ça ?', you: "C'est tout, merci.", pic: '✋✅', en: "That's all, thank you.", type: 'enough' },
    { them: 'Ça fait un euro.', you: 'Voilà, madame.', pic: '🪙👉', en: 'Here you are, madam.', type: 'pay' },
    { them: 'Merci ! Au revoir !', you: 'Au revoir, madame !', pic: '👋🏪', en: 'Goodbye, madam!', type: 'bye' },
  ] },
  { title: 'Au parc', who: '👧', pitch: 1.45, steps: [
    { them: 'Salut ! Tu veux jouer ?', you: 'Oui ! On joue au ballon ?', pic: '⚽😀', en: 'Yes! Shall we play ball?', type: 'play' },
    { ask: "Comment tu t'appelles ?", hint: 'Ask her name.', pic: '❓📛', en: "What's your name?", answer: "Je m'appelle Léa !", type: 'askname' },
    { them: 'On fait la course ?', you: "D'accord ! Un, deux, trois, partez !", pic: '🏁🏃', en: 'OK! One, two, three, go!', type: 'race' },
    { them: 'Je dois partir. Salut !', you: 'Salut ! À demain !', pic: '👋🌅', en: 'Bye! See you tomorrow!', type: 'bye' },
  ] },
  { title: "À l'école", who: '👩‍🏫', pitch: 1.05, steps: [
    { them: "Bonjour ! Tu as besoin d'aide ?", you: "Oui, s'il vous plaît. Je ne comprends pas.", pic: '🤔❓', en: "Yes, please. I don't understand.", type: 'help' },
    { them: 'Tu as un crayon ?', you: "Non, je n'ai pas de crayon.", pic: '✏️🚫', en: "No, I don't have a pencil.", type: 'havenot' },
    { ask: 'Où sont les toilettes ?', hint: 'Ask where the toilet is.', pic: '❓🚽', en: 'Where is the toilet?', answer: "C'est par là !", type: 'askwhere' },
    { them: 'Ça va mieux ?', you: 'Oui, merci !', pic: '😊👍', en: 'Yes, thank you!', type: 'fine' },
  ] },
  { title: 'Au téléphone', who: '👨', pitch: 0.8, steps: [
    { them: "Allô ? C'est qui ?", you: "C'est {name} ! Bonjour, Papa !", pic: '📞🙋', en: "It's {name}! Hello, Papa!", type: 'phone' },
    { them: "Qu'est-ce que tu fais ?", you: 'Je dessine un dragon !', pic: '🎨🐉', en: "I'm drawing a dragon!", type: 'doing' },
    { them: "Je t'aime ! Gros bisous !", you: 'Moi aussi ! Bisous, Papa !', pic: '❤️😘', en: 'Me too! Kisses, Papa!', type: 'love' },
    { them: 'Au revoir !', you: 'Au revoir, Papa ! À bientôt !', pic: '👋📞', en: 'Goodbye, Papa! See you soon!', type: 'bye' },
  ] },
  { title: 'Le dragon', who: '🐉', pitch: 0.5, steps: [
    { them: 'Grrr ! Qui es-tu ?', you: 'Je suis {name}, le chevalier !', pic: '🤺📛', en: "I'm {name} the knight!", type: 'name' },
    { them: 'Tu as peur ?', you: "Non, je n'ai pas peur !", pic: '💪😤', en: "No, I'm not scared!", type: 'brave' },
    { them: 'Tu veux un gâteau ?', you: 'Oui, merci, dragon !', pic: '🎂🙏', en: 'Yes, thank you, dragon!', type: 'yesplease' },
    { ask: 'Tu veux être mon ami ?', hint: 'Ask the dragon to be your friend.', pic: '❓🤝', en: 'Do you want to be my friend?', answer: 'Oui ! Je suis ton ami !', type: 'askfriend' },
  ] },
  { title: 'Bonne nuit', who: '👩', pitch: 1.1, steps: [
    { them: "C'est l'heure de dormir !", you: "Encore une histoire, s'il te plaît !", pic: '📖🙏', en: 'One more story, please!', type: 'story' },
    { them: 'Tu as sommeil ?', you: 'Oui, un peu.', pic: '🥱🤏', en: 'Yes, a little.', type: 'sleepy' },
    { them: 'Bonne nuit ! Fais de beaux rêves !', you: "Bonne nuit, Maman ! Je t'aime !", pic: '🌙❤️', en: 'Good night, Maman! I love you!', type: 'goodnight' },
  ] },
];
