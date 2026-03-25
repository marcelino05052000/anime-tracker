import type { Language } from './translations';

const PT_BR_STATUS: Record<string, string> = {
  'Finished Airing': 'Concluído',
  'Currently Airing': 'Em exibição',
  'Not yet aired': 'Ainda não exibido',
};

const PT_BR_SEASON: Record<string, string> = {
  spring: 'Primavera',
  summer: 'Verão',
  fall: 'Outono',
  winter: 'Inverno',
};

const PT_BR_RATING: Record<string, string> = {
  'G - All Ages': 'G - Todas as idades',
  'PG - Children': 'PG - Crianças',
  'PG-13 - Teens 13 or older': 'PG-13 - Maiores de 13 anos',
  'R - 17+ (violence & profanity)': 'R - 17+ (violência e linguagem)',
  'R+ - Mild Nudity': 'R+ - Nudez leve',
  'Rx - Hentai': 'Rx - Hentai',
};

const PT_BR_GENRES: Record<string, string> = {
  // Genres
  Action: 'Ação',
  Adventure: 'Aventura',
  'Award Winning': 'Premiado',
  'Boys Love': 'Boys Love',
  Comedy: 'Comédia',
  Drama: 'Drama',
  Fantasy: 'Fantasia',
  'Girls Love': 'Girls Love',
  Gourmet: 'Culinária',
  Horror: 'Terror',
  Mystery: 'Mistério',
  Romance: 'Romance',
  'Sci-Fi': 'Ficção Científica',
  'Slice of Life': 'Cotidiano',
  Sports: 'Esportes',
  Supernatural: 'Sobrenatural',
  Suspense: 'Suspense',
  Ecchi: 'Ecchi',
  Erotica: 'Erótico',
  Hentai: 'Hentai',
  // Themes
  'Adult Cast': 'Elenco Adulto',
  Anthropomorphic: 'Antropomórfico',
  CGDCT: 'CGDCT',
  Childcare: 'Cuidado Infantil',
  'Combat Sports': 'Esportes de Combate',
  Crossdressing: 'Crossdressing',
  Delinquents: 'Delinquentes',
  Detective: 'Detetive',
  Educational: 'Educacional',
  'Gag Humor': 'Humor Pastelão',
  Gore: 'Gore',
  Harem: 'Harém',
  'High Stakes Game': 'Jogo de Alto Risco',
  Historical: 'Histórico',
  'Idols (Female)': 'Ídolos (Feminino)',
  'Idols (Male)': 'Ídolos (Masculino)',
  Isekai: 'Isekai',
  Iyashikei: 'Iyashikei',
  'Love Polygon': 'Triângulo Amoroso',
  'Magical Sex Shift': 'Troca de Gênero Mágica',
  'Mahou Shoujo': 'Mahou Shoujo',
  'Martial Arts': 'Artes Marciais',
  Mecha: 'Mecha',
  Medical: 'Médico',
  Military: 'Militar',
  Music: 'Música',
  Mythology: 'Mitologia',
  'Organized Crime': 'Crime Organizado',
  'Otaku Culture': 'Cultura Otaku',
  Parody: 'Paródia',
  'Performing Arts': 'Artes Cênicas',
  Pets: 'Animais de Estimação',
  Psychological: 'Psicológico',
  Racing: 'Corrida',
  Reincarnation: 'Reencarnação',
  'Reverse Harem': 'Harém Reverso',
  'Romantic Subtext': 'Subtexto Romântico',
  Samurai: 'Samurai',
  School: 'Escola',
  Showbiz: 'Showbiz',
  Space: 'Espaço',
  'Strategy Game': 'Jogo de Estratégia',
  'Super Power': 'Superpoderes',
  Survival: 'Sobrevivência',
  'Team Sports': 'Esportes em Equipe',
  'Time Travel': 'Viagem no Tempo',
  Vampire: 'Vampiro',
  'Video Game': 'Videogame',
  'Visual Arts': 'Artes Visuais',
  Workplace: 'Ambiente de Trabalho',
  // Demographics
  Josei: 'Josei',
  Kids: 'Infantil',
  Seinen: 'Seinen',
  Shoujo: 'Shoujo',
  Shounen: 'Shounen',
};

export function translateAnimeStatus(value: string | null | undefined, lang: Language): string | null | undefined {
  if (lang !== 'pt-BR' || !value) return value;
  return PT_BR_STATUS[value] ?? value;
}

export function translateAnimeSeason(season: string | null | undefined, lang: Language): string | null | undefined {
  if (lang !== 'pt-BR' || !season) return season;
  return PT_BR_SEASON[season] ?? season;
}

export function translateAnimeRating(value: string | null | undefined, lang: Language): string | null | undefined {
  if (lang !== 'pt-BR' || !value) return value;
  return PT_BR_RATING[value] ?? value;
}

export function translateDuration(value: string | null | undefined, lang: Language): string | null | undefined {
  if (lang !== 'pt-BR' || !value) return value;
  return value
    .replace('per ep', 'por ep')
    .replace('hr.', 'h')
    .replace('Unknown', 'Desconhecido');
}

export function translateGenreName(name: string, lang: Language): string {
  if (lang !== 'pt-BR') return name;
  return PT_BR_GENRES[name] ?? name;
}
