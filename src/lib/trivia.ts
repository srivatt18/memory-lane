export type TriviaGenre = 'geography' | 'world history' | 'science';
export type TriviaDifficulty = 'easy' | 'medium' | 'hard';

export interface TriviaQuestion {
  genre: TriviaGenre;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export const GENRES: { id: TriviaGenre; title: string; subtitle: string }[] = [
  {
    id: 'geography',
    title: 'Geography',
    subtitle: 'Capitals, continents, landmarks & oceans',
  },
  {
    id: 'world history',
    title: 'World History',
    subtitle: 'Ancient civilizations, historic events & inventions',
  },
  {
    id: 'science',
    title: 'Science',
    subtitle: 'Simple biology, space, atoms & nature facts',
  },
];

export const DIFFICULTY_COUNTS: Record<TriviaDifficulty, number> = {
  easy: 5,
  medium: 10,
  hard: 15,
};

export const TRIVIA_QUESTIONS: TriviaQuestion[] = [
  // Geography (15 questions)
  {
    genre: 'geography',
    question: 'What is the largest ocean on Earth?',
    options: ['Pacific Ocean', 'Atlantic Ocean', 'Indian Ocean', 'Arctic Ocean'],
    correctIndex: 0,
    explanation: 'The Pacific Ocean is the largest and deepest ocean on Earth.',
  },
  {
    genre: 'geography',
    question: 'Which continent is Egypt located on?',
    options: ['Africa', 'Asia', 'Europe', 'South America'],
    correctIndex: 0,
    explanation: 'Egypt is located in the northeast corner of Africa.',
  },
  {
    genre: 'geography',
    question: 'What is the capital city of France?',
    options: ['Rome', 'Madrid', 'Paris', 'Berlin'],
    correctIndex: 2,
    explanation: 'Paris is the capital and largest city of France.',
  },
  {
    genre: 'geography',
    question: 'Which river is traditionally considered the longest in the world?',
    options: ['Amazon River', 'Nile River', 'Yangtze River', 'Mississippi River'],
    correctIndex: 1,
    explanation: 'The Nile River in Africa is traditionally recognized as the longest river in the world.',
  },
  {
    genre: 'geography',
    question: 'Mount Everest is located within which mountain range?',
    options: ['The Andes', 'The Alps', 'The Rockies', 'The Himalayas'],
    correctIndex: 3,
    explanation: 'Mount Everest is in the Himalayas on the border of Nepal and China.',
  },
  {
    genre: 'geography',
    question: 'Which country is historically known as the Land of the Rising Sun?',
    options: ['China', 'Japan', 'Thailand', 'South Korea'],
    correctIndex: 1,
    explanation: 'Japan is called Nihon or Nippon, meaning origin of the sun.',
  },
  {
    genre: 'geography',
    question: 'What is the capital city of Italy?',
    options: ['Venice', 'Milan', 'Rome', 'Florence'],
    correctIndex: 2,
    explanation: 'Rome is the capital of Italy and home to the ancient Colosseum.',
  },
  {
    genre: 'geography',
    question: 'Which desert is the largest hot desert in the world?',
    options: ['Gobi Desert', 'Sahara Desert', 'Kalahari Desert', 'Arabian Desert'],
    correctIndex: 1,
    explanation: 'The Sahara covers over 9 million square kilometers across North Africa.',
  },
  {
    genre: 'geography',
    question: 'Which is the smallest continent by land area?',
    options: ['Europe', 'Antarctica', 'Australia', 'South America'],
    correctIndex: 2,
    explanation: 'Australia is the smallest continent by total land area.',
  },
  {
    genre: 'geography',
    question: 'What is the capital city of Japan?',
    options: ['Tokyo', 'Kyoto', 'Osaka', 'Hiroshima'],
    correctIndex: 0,
    explanation: 'Tokyo is the bustling capital of Japan.',
  },
  {
    genre: 'geography',
    question: 'Which country has the largest total land area in the world?',
    options: ['Canada', 'China', 'United States', 'Russia'],
    correctIndex: 3,
    explanation: 'Russia spans Eastern Europe and Northern Asia and is the largest country by area.',
  },
  {
    genre: 'geography',
    question: 'The Amazon Rainforest is located primarily in which country?',
    options: ['Brazil', 'Argentina', 'Colombia', 'Peru'],
    correctIndex: 0,
    explanation: 'About 60 percent of the Amazon basin is within Brazil.',
  },
  {
    genre: 'geography',
    question: 'What is the capital city of the United Kingdom?',
    options: ['Dublin', 'Edinburgh', 'London', 'Manchester'],
    correctIndex: 2,
    explanation: 'London has been the capital of England and the United Kingdom for centuries.',
  },
  {
    genre: 'geography',
    question: 'Which body of water separates Europe from Africa?',
    options: ['Baltic Sea', 'Mediterranean Sea', 'Red Sea', 'Black Sea'],
    correctIndex: 1,
    explanation: 'The Mediterranean Sea connects to the Atlantic Ocean and lies between Europe and Africa.',
  },
  {
    genre: 'geography',
    question: 'What is the capital city of Canada?',
    options: ['Toronto', 'Vancouver', 'Montreal', 'Ottawa'],
    correctIndex: 3,
    explanation: 'Ottawa was selected as the capital of Canada in 1857.',
  },

  // World History (15 questions)
  {
    genre: 'world history',
    question: 'Which ancient civilization built the Great Pyramids of Giza?',
    options: ['The Romans', 'The Ancient Egyptians', 'The Greeks', 'The Persians'],
    correctIndex: 1,
    explanation: 'The pyramids were built as royal tombs during the Old Kingdom of Ancient Egypt.',
  },
  {
    genre: 'world history',
    question: 'In which modern-day country did the ancient Olympic Games begin?',
    options: ['Italy', 'Egypt', 'Greece', 'Turkey'],
    correctIndex: 2,
    explanation: 'The first recorded Olympic Games were held in Olympia, Greece in 776 BC.',
  },
  {
    genre: 'world history',
    question: 'Who painted the Mona Lisa during the Renaissance?',
    options: ['Michelangelo', 'Leonardo da Vinci', 'Raphael', 'Vincent van Gogh'],
    correctIndex: 1,
    explanation: 'Leonardo da Vinci painted the Mona Lisa in Florence in the early 1500s.',
  },
  {
    genre: 'world history',
    question: 'Julius Caesar was a prominent general and leader of which ancient state?',
    options: ['Roman Republic', 'Ottoman Empire', 'British Empire', 'Byzantine Empire'],
    correctIndex: 0,
    explanation: 'Julius Caesar expanded Roman territory before becoming dictator of Rome.',
  },
  {
    genre: 'world history',
    question: 'In what year did World War I begin?',
    options: ['1912', '1914', '1918', '1939'],
    correctIndex: 1,
    explanation: 'World War I began in July 1914 following the assassination of Archduke Franz Ferdinand.',
  },
  {
    genre: 'world history',
    question: 'The Lighthouse of Alexandria was an ancient wonder located in which modern country?',
    options: ['Greece', 'Egypt', 'Italy', 'Jordan'],
    correctIndex: 1,
    explanation: 'The famous lighthouse guided ships into the harbor of Alexandria, Egypt.',
  },
  {
    genre: 'world history',
    question: 'In which year did World War II come to an end?',
    options: ['1941', '1943', '1945', '1948'],
    correctIndex: 2,
    explanation: 'World War II concluded in 1945 with the formal surrender of Axis forces.',
  },
  {
    genre: 'world history',
    question: 'The Renaissance cultural movement began in which European country?',
    options: ['France', 'Italy', 'Germany', 'England'],
    correctIndex: 1,
    explanation: 'The Renaissance began in Italy during the 14th century, centered in cities like Florence.',
  },
  {
    genre: 'world history',
    question: 'Who was the first human to walk on the Moon in 1969?',
    options: ['Buzz Aldrin', 'Neil Armstrong', 'Yuri Gagarin', 'Michael Collins'],
    correctIndex: 1,
    explanation: 'Neil Armstrong stepped onto the lunar surface on July 20, 1969 during Apollo 11.',
  },
  {
    genre: 'world history',
    question: 'Which city was divided by a famous wall from 1961 until 1989?',
    options: ['Vienna', 'Prague', 'Berlin', 'Budapest'],
    correctIndex: 2,
    explanation: 'The Berlin Wall divided East and West Berlin during the Cold War.',
  },
  {
    genre: 'world history',
    question: 'Who was the first emperor of a unified China buried with the Terracotta Army?',
    options: ['Qin Shi Huang', 'Kublai Khan', 'Sun Yat-sen', 'Emperor Wu'],
    correctIndex: 0,
    explanation: 'Qin Shi Huang unified the warring states of China in 221 BC.',
  },
  {
    genre: 'world history',
    question: 'What was the historic trade route that linked China to the Mediterranean?',
    options: ['The Amber Road', 'The Silk Road', 'The Spice Route', 'The Royal Road'],
    correctIndex: 1,
    explanation: 'The Silk Road enabled centuries of commerce and cultural exchange across Eurasia.',
  },
  {
    genre: 'world history',
    question: 'Who received the first US patent for the telephone in 1876?',
    options: ['Thomas Edison', 'Alexander Graham Bell', 'Nikola Tesla', 'Guglielmo Marconi'],
    correctIndex: 1,
    explanation: 'Alexander Graham Bell was granted the patent for transmitting vocal sounds telegraphically.',
  },
  {
    genre: 'world history',
    question: 'The Magna Carta was signed in England in which year?',
    options: ['1066', '1215', '1492', '1776'],
    correctIndex: 1,
    explanation: 'King John of England signed the Magna Carta at Runnymede in June 1215.',
  },
  {
    genre: 'world history',
    question: 'Which civilization constructed the mountain citadel of Machu Picchu in Peru?',
    options: ['The Aztecs', 'The Maya', 'The Inca', 'The Olmec'],
    correctIndex: 2,
    explanation: 'Machu Picchu was built in the 15th century by the Inca Empire.',
  },

  // Science (15 questions)
  {
    genre: 'science',
    question: 'Which planet in our solar system is closest to the Sun?',
    options: ['Venus', 'Mercury', 'Mars', 'Earth'],
    correctIndex: 1,
    explanation: 'Mercury is the innermost and smallest planet in our solar system.',
  },
  {
    genre: 'science',
    question: 'What gas do green plants absorb from the air during photosynthesis?',
    options: ['Oxygen', 'Nitrogen', 'Carbon dioxide', 'Hydrogen'],
    correctIndex: 2,
    explanation: 'Plants absorb carbon dioxide and release oxygen during photosynthesis.',
  },
  {
    genre: 'science',
    question: 'Which organ in the human body pumps blood through the circulatory system?',
    options: ['Lungs', 'Liver', 'Brain', 'Heart'],
    correctIndex: 3,
    explanation: 'The heart pumps oxygenated blood throughout the body.',
  },
  {
    genre: 'science',
    question: 'What is the largest planet in our solar system?',
    options: ['Saturn', 'Jupiter', 'Neptune', 'Uranus'],
    correctIndex: 1,
    explanation: 'Jupiter is a gas giant and the largest planet in our solar system.',
  },
  {
    genre: 'science',
    question: 'What is the chemical formula for water?',
    options: ['CO2', 'NaCl', 'H2O', 'O2'],
    correctIndex: 2,
    explanation: 'Water consists of two hydrogen atoms bonded to one oxygen atom.',
  },
  {
    genre: 'science',
    question: 'Which planet is known as the Red Planet due to iron oxide on its surface?',
    options: ['Mars', 'Venus', 'Jupiter', 'Saturn'],
    correctIndex: 0,
    explanation: 'Mars appears reddish because of rust and iron-rich dust on its surface.',
  },
  {
    genre: 'science',
    question: 'What is the dense center of an atom called?',
    options: ['Electron', 'Nucleus', 'Proton', 'Molecule'],
    correctIndex: 1,
    explanation: 'The nucleus contains protons and neutrons, holding nearly all the atom\'s mass.',
  },
  {
    genre: 'science',
    question: 'What is the hardest naturally occurring mineral on Earth?',
    options: ['Quartz', 'Diamond', 'Topaz', 'Granite'],
    correctIndex: 1,
    explanation: 'Diamond is the hardest known natural mineral, rated 10 on the Mohs scale.',
  },
  {
    genre: 'science',
    question: 'How many bones are there in the average adult human skeleton?',
    options: ['156', '206', '256', '306'],
    correctIndex: 1,
    explanation: 'An adult human body normally has 206 bones.',
  },
  {
    genre: 'science',
    question: 'Which fundamental force pulls objects toward the center of the Earth?',
    options: ['Magnetism', 'Friction', 'Gravity', 'Inertia'],
    correctIndex: 2,
    explanation: 'Gravity is the attractive force that keeps our feet on the ground and planets in orbit.',
  },
  {
    genre: 'science',
    question: 'Which blood cells are responsible for defending the body against infections?',
    options: ['Red blood cells', 'White blood cells', 'Platelets', 'Plasma cells'],
    correctIndex: 1,
    explanation: 'White blood cells form an essential component of the body\'s immune system.',
  },
  {
    genre: 'science',
    question: 'What is the name of the star at the center of our solar system?',
    options: ['Sirius', 'North Star', 'Proxima Centauri', 'The Sun'],
    correctIndex: 3,
    explanation: 'The Sun is the yellow dwarf star around which Earth and other planets revolve.',
  },
  {
    genre: 'science',
    question: 'At what temperature in Celsius does pure water boil at sea level?',
    options: ['50 degrees', '90 degrees', '100 degrees', '120 degrees'],
    correctIndex: 2,
    explanation: 'Under standard atmospheric pressure, water boils at 100 degrees Celsius.',
  },
  {
    genre: 'science',
    question: 'Which human sense is detected by the cochlea located in the inner ear?',
    options: ['Sight', 'Hearing', 'Taste', 'Smell'],
    correctIndex: 1,
    explanation: 'The spiral-shaped cochlea converts sound vibrations into nerve signals for hearing.',
  },
  {
    genre: 'science',
    question: 'What is the biological process of a caterpillar transforming into a butterfly?',
    options: ['Metamorphosis', 'Photosynthesis', 'Respiration', 'Fermentation'],
    correctIndex: 0,
    explanation: 'Metamorphosis is the transformation from larval stage to adult insect.',
  },
];

export function getTriviaQuestions(
  genre: TriviaGenre,
  difficulty: TriviaDifficulty
): TriviaQuestion[] {
  const count = DIFFICULTY_COUNTS[difficulty] || 5;
  return TRIVIA_QUESTIONS.filter((q) => q.genre === genre).slice(0, count);
}

