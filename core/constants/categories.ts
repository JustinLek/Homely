/**
 * Category definition
 */
export interface Category {
  key: string;
  name: string;
  subcategories: string[];
}

/**
 * All available categories with their subcategories
 */
export const CATEGORIES: Record<string, Category> = {
  woning: {
    key: 'woning',
    name: 'Woning',
    subcategories: [
      'Huur / Hypotheeklasten',
      'Servicekosten',
      'Erfpachtcanon',
      'Inleg KEW/SEW/BEW',
    ],
  },
  energie_lokale_lasten: {
    key: 'energie_lokale_lasten',
    name: 'Energie & lokale lasten',
    subcategories: [
      'Gas / Elektriciteit',
      'Water',
      'Onroerende zaakbelasting',
      'Reinigingsheffing',
      'Rioolheffing',
      'Waterschapslasten',
      'Overige lokale lasten',
    ],
  },
  verzekeringen: {
    key: 'verzekeringen',
    name: 'Verzekeringen',
    subcategories: [
      'Zorgverzekering',
      'Aansprakelijkheid',
      'Inboedel- en opstalverzekering',
      'Uitvaartverzekering',
      'Overlijdensrisicoverzekering',
      'Woonlastenverzekering',
      'Overige verzekeringen',
    ],
  },
  abonnementen_telecom: {
    key: 'abonnementen_telecom',
    name: 'Abonnementen & telecom',
    subcategories: [
      'TV Internet',
      'Mobiele telefoon',
      'Streamingsdiensten',
      'Contributies & Abonnementen',
      'Overige (loterijen en goede doelen)',
    ],
  },
  onderwijs: {
    key: 'onderwijs',
    name: 'Onderwijs',
    subcategories: [
      'School- en studiekosten kinderen',
      'Studiekosten volwassenen',
      'DUO studieschuld',
    ],
  },
  vervoer: {
    key: 'vervoer',
    name: 'Vervoer',
    subcategories: [
      'Afbetaling / afschrijving',
      'Motorrijtuigenbelasting',
      'Onderhoud',
      'Verzekering',
      'Brandstof',
      'Fiets, openbaar vervoer, overig',
    ],
  },
  overige_vaste_lasten: {
    key: 'overige_vaste_lasten',
    name: 'Overige vaste lasten',
    subcategories: [
      'Kinderopvang',
      'Alimentatie',
      'Bijdrage studerende kinderen',
      'Afbetaling',
      'Private lease',
      'Overig',
    ],
  },
  kleding_schoenen: {
    key: 'kleding_schoenen',
    name: 'Kleding & schoenen',
    subcategories: ['Kleding & schoenen', 'Overig (kleedgeld kinderen, reparaties, accessoires)'],
  },
  inboedel_huis_tuin: {
    key: 'inboedel_huis_tuin',
    name: 'Inboedel, huis & tuin',
    subcategories: [
      'Inboedel (meubels, apparatuur, stoffering)',
      'Onderhoud huis en tuin',
      'Bijdrage VVE',
    ],
  },
  niet_vergoede_ziektekosten: {
    key: 'niet_vergoede_ziektekosten',
    name: 'Niet-vergoede ziektekosten',
    subcategories: ['Eigen risico', 'Zelfzorgmedicijnen', 'Eigen bijdragen'],
  },
  vrijetijdsuitgaven: {
    key: 'vrijetijdsuitgaven',
    name: 'Vrijetijdsuitgaven',
    subcategories: ['Vakantie, weekendjes weg', 'Hobbys', 'Uitgaan', 'Overige vrijetijdsuitgaven'],
  },
  huishoudelijke_uitgaven: {
    key: 'huishoudelijke_uitgaven',
    name: 'Huishoudelijke uitgaven',
    subcategories: [
      'Boodschappen',
      'Persoonlijke verzorging',
      'Huishoudelijke dienstverlening',
      'Huisdieren',
      'Diversen (zakgeld, cadeaus, bloemen etc)',
    ],
  },
  interne_transacties: {
    key: 'interne_transacties',
    name: 'Interne transacties',
    subcategories: ['Tussen rekeningen'],
  },
  inkomsten: {
    key: 'inkomsten',
    name: 'Inkomsten',
    subcategories: ['Salaris', 'Overige inkomsten'],
  },
  te_beoordelen: {
    key: 'te_beoordelen',
    name: 'Te beoordelen',
    subcategories: ['Onbekend'],
  },
};
