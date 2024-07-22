import { i18n } from 'next-i18next';
import getConfig from 'next/config';

const { publicRuntimeConfig = {} } = getConfig() || {};

const worldCountries = [
  {
    name: 'Afghanistan',
    id: 'AFGHANISTAN'
  },
  {
    name: 'Îles Åland',
    id: 'ALAND ISLANDS'
  },
  {
    name: 'Albanie',
    id: 'ALBANIA'
  },
  {
    name: 'Algérie',
    id: 'ALGERIA'
  },
  {
    name: 'Samoa américaines',
    id: 'AMERICAN SAMOA'
  },
  {
    name: 'Andorre',
    id: 'ANDORRA'
  },
  {
    name: 'Angola',
    id: 'ANGOLA'
  },
  {
    name: 'Anguilla',
    id: 'ANGUILLA'
  },
  {
    name: 'Antarctique',
    id: 'ANTARCTICA'
  },
  {
    name: 'Antigua-et-Barbuda',
    id: 'ANTIGUA AND BARBUDA'
  },
  {
    name: 'Argentine',
    id: 'ARGENTINA'
  },
  {
    name: 'Arménie',
    id: 'ARMENIA'
  },
  {
    name: 'Aruba',
    id: 'ARUBA'
  },
  {
    name: 'Australie',
    id: 'AUSTRALIA'
  },
  {
    name: 'Autriche',
    id: 'AUSTRIA'
  },
  {
    name: 'Azerbaïdjan',
    id: 'AZERBAIJAN'
  },
  {
    name: 'Bahamas',
    id: 'BAHAMAS'
  },
  {
    name: 'Bahreïn',
    id: 'BAHRAIN'
  },
  {
    name: 'Bangladesh',
    id: 'BANGLADESH'
  },
  {
    name: 'Barbade',
    id: 'BARBADOS'
  },
  {
    name: 'Biélorussie',
    id: 'BELARUS'
  },
  {
    name: 'Belgique',
    id: 'BELGIUM'
  },
  {
    name: 'Belize',
    id: 'BELIZE'
  },
  {
    name: 'Bénin',
    id: 'BENIN'
  },
  {
    name: 'Bermudes',
    id: 'BERMUDA'
  },
  {
    name: 'Bhoutan',
    id: 'BHUTAN'
  },
  {
    name: 'Bolivie',
    id: 'BOLIVIA'
  },
  {
    name: 'Bonaire, Saint-Eustache et Saba',
    id: 'BONAIRE, SINT EUSTATIUS AND SABA'
  },
  {
    name: 'Bosnie-Herzégovine',
    id: 'BOSNIA AND HERZEGOVINA'
  },
  {
    name: 'Botswana',
    id: 'BOTSWANA'
  },
  {
    name: 'Île Bouvet',
    id: 'BOUVET ISLAND'
  },
  {
    name: 'Brésil',
    id: 'BRAZIL'
  },
  {
    name: "Territoire britannique de l'océan Indien",
    id: 'BRITISH INDIAN OCEAN TERRITORY'
  },
  {
    name: 'Brunéi Darussalam',
    id: 'BRUNEI DARUSSALAM'
  },
  {
    name: 'Bulgarie',
    id: 'BULGARIA'
  },
  {
    name: 'Burkina Faso',
    id: 'BURKINA FASO'
  },
  {
    name: 'Burundi',
    id: 'BURUNDI'
  },
  {
    name: 'Cambodge',
    id: 'CAMBODIA'
  },
  {
    name: 'Cameroun',
    id: 'CAMEROON'
  },
  {
    name: 'Canada',
    id: 'CANADA'
  },
  {
    name: 'Cap-Vert',
    id: 'CAPE VERDE'
  },
  {
    name: 'Îles Caïmans',
    id: 'CAYMAN ISLANDS'
  },
  {
    name: 'République centrafricaine',
    id: 'CENTRAL AFRICAN REPUBLIC'
  },
  {
    name: 'Tchad',
    id: 'CHAD'
  },
  {
    name: 'Chili',
    id: 'CHILE'
  },
  {
    name: 'Chine',
    id: 'CHINA'
  },
  {
    name: 'Île Christmas',
    id: 'CHRISTMAS ISLAND'
  },
  {
    name: 'Îles Cocos (Keeling)',
    id: 'COCOS (KEELING) ISLANDS'
  },
  {
    name: 'Colombie',
    id: 'COLOMBIA'
  },
  {
    name: 'Comores',
    id: 'COMOROS'
  },
  {
    name: 'Congo',
    id: 'CONGO'
  },
  {
    name: 'Congo, République démocratique du Congo',
    id: 'CONGO, DEMOCRATIC REPUBLIC OF THE CONGO'
  },
  {
    name: 'Îles Cook',
    id: 'COOK ISLANDS'
  },
  {
    name: 'Costa Rica',
    id: 'COSTA RICA'
  },
  {
    name: "Côte d'Ivoire",
    id: "COTE D'IVOIRE"
  },
  {
    name: 'Croatie',
    id: 'CROATIA'
  },
  {
    name: 'Cuba',
    id: 'CUBA'
  },
  {
    name: 'Curaçao',
    id: 'CURACAO'
  },
  {
    name: 'Chypre',
    id: 'CYPRUS'
  },
  {
    name: 'République tchèque',
    id: 'CZECH REPUBLIC'
  },
  {
    name: 'Danemark',
    id: 'DENMARK'
  },
  {
    name: 'Djibouti',
    id: 'DJIBOUTI'
  },
  {
    name: 'Dominique',
    id: 'DOMINICA'
  },
  {
    name: 'République dominicaine',
    id: 'DOMINICAN REPUBLIC'
  },
  {
    name: 'Équateur',
    id: 'ECUADOR'
  },
  {
    name: 'Égypte',
    id: 'EGYPT'
  },
  {
    name: 'Salvador',
    id: 'EL SALVADOR'
  },
  {
    name: 'Guinée équatoriale',
    id: 'EQUATORIAL GUINEA'
  },
  {
    name: 'Érythrée',
    id: 'ERITREA'
  },
  {
    name: 'Estonie',
    id: 'ESTONIA'
  },
  {
    name: 'Éthiopie',
    id: 'ETHIOPIA'
  },
  {
    name: 'Îles Malouines (Falkland)',
    id: 'FALKLAND ISLANDS (MALVINAS)'
  },
  {
    name: 'Îles Féroé',
    id: 'FAROE ISLANDS'
  },
  {
    name: 'Fidji',
    id: 'FIJI'
  },
  {
    name: 'Finlande',
    id: 'FINLAND'
  },
  {
    name: 'France',
    id: 'FRANCE'
  },
  {
    name: 'Guyane française',
    id: 'FRENCH GUIANA'
  },
  {
    name: 'Polynésie française',
    id: 'FRENCH POLYNESIA'
  },
  {
    name: 'Terres australes françaises',
    id: 'FRENCH SOUTHERN TERRITORIES'
  },
  {
    name: 'Gabon',
    id: 'GABON'
  },
  {
    name: 'Gambie',
    id: 'GAMBIA'
  },
  {
    name: 'Géorgie',
    id: 'GEORGIA'
  },
  {
    name: 'Allemagne',
    id: 'GERMANY'
  },
  {
    name: 'Ghana',
    id: 'GHANA'
  },
  {
    name: 'Gibraltar',
    id: 'GIBRALTAR'
  },
  {
    name: 'Grèce',
    id: 'GREECE'
  },
  {
    name: 'Groenland',
    id: 'GREENLAND'
  },
  {
    name: 'Grenade',
    id: 'GRENADA'
  },
  {
    name: 'Guadeloupe',
    id: 'GUADELOUPE'
  },
  {
    name: 'Guam',
    id: 'GUAM'
  },
  {
    name: 'Guatemala',
    id: 'GUATEMALA'
  },
  {
    name: 'Guernesey',
    id: 'GUERNSEY'
  },
  {
    name: 'Guinée',
    id: 'GUINEA'
  },
  {
    name: 'Guinée-Bissau',
    id: 'GUINEA-BISSAU'
  },
  {
    name: 'Guyana',
    id: 'GUYANA'
  },
  {
    name: 'Haïti',
    id: 'HAITI'
  },
  {
    name: 'Îles Heard et McDonald',
    id: 'HEARD ISLAND AND MCDONALD ISLANDS'
  },
  {
    name: 'Saint-Siège (État de la Cité du Vatican)',
    id: 'HOLY SEE (VATICAN CITY STATE)'
  },
  {
    name: 'Honduras',
    id: 'HONDURAS'
  },
  {
    name: 'Hong Kong',
    id: 'HONG KONG'
  },
  {
    name: 'Hongrie',
    id: 'HUNGARY'
  },
  {
    name: 'Islande',
    id: 'ICELAND'
  },
  {
    name: 'Inde',
    id: 'INDIA'
  },
  {
    name: 'Indonésie',
    id: 'INDONESIA'
  },
  {
    name: 'Iran, République islamique d’',
    id: 'IRAN, ISLAMIC REPUBLIC OF'
  },
  {
    name: 'Iraq',
    id: 'IRAQ'
  },
  {
    name: 'Irlande',
    id: 'IRELAND'
  },
  {
    name: 'Île de Man',
    id: 'ISLE OF MAN'
  },
  {
    name: 'Israël',
    id: 'ISRAEL'
  },
  {
    name: 'Italie',
    id: 'ITALY'
  },
  {
    name: 'Jamaïque',
    id: 'JAMAICA'
  },
  {
    name: 'Japon',
    id: 'JAPAN'
  },
  {
    name: 'Jersey',
    id: 'JERSEY'
  },
  {
    name: 'Jordanie',
    id: 'JORDAN'
  },
  {
    name: 'Kazakhstan',
    id: 'KAZAKHSTAN'
  },
  {
    name: 'Kenya',
    id: 'KENYA'
  },
  {
    name: 'Kiribati',
    id: 'KIRIBATI'
  },
  {
    name: 'Corée, République populaire démocratique de',
    id: "KOREA, DEMOCRATIC PEOPLE'S REPUBLIC OF"
  },
  {
    name: 'Corée, République de',
    id: 'KOREA, REPUBLIC OF'
  },
  {
    name: 'Kosovo',
    id: 'KOSOVO'
  },
  {
    name: 'Koweït',
    id: 'KUWAIT'
  },
  {
    name: 'Kirghizistan',
    id: 'KYRGYZSTAN'
  },
  {
    name: 'République démocratique populaire lao',
    id: "LAO PEOPLE'S DEMOCRATIC REPUBLIC"
  },
  {
    name: 'Lettonie',
    id: 'LATVIA'
  },
  {
    name: 'Liban',
    id: 'LEBANON'
  },
  {
    name: 'Lesotho',
    id: 'LESOTHO'
  },
  {
    name: 'Libéria',
    id: 'LIBERIA'
  },
  {
    name: 'Jamahiriya arabe libyenne',
    id: 'LIBYAN ARAB JAMAHIRIYA'
  },
  {
    name: 'Liechtenstein',
    id: 'LIECHTENSTEIN'
  },
  {
    name: 'Lituanie',
    id: 'LITHUANIA'
  },
  {
    name: 'Luxembourg',
    id: 'LUXEMBOURG'
  },
  {
    name: 'Macao',
    id: 'MACAO'
  },
  {
    name: 'Macédoine, ex-République yougoslave de',
    id: 'MACEDONIA, THE FORMER YUGOSLAV REPUBLIC OF'
  },
  {
    name: 'Madagascar',
    id: 'MADAGASCAR'
  },
  {
    name: 'Malawi',
    id: 'MALAWI'
  },
  {
    name: 'Malaisie',
    id: 'MALAYSIA'
  },
  {
    name: 'Maldives',
    id: 'MALDIVES'
  },
  {
    name: 'Mali',
    id: 'MALI'
  },
  {
    name: 'Malte',
    id: 'MALTA'
  },
  {
    name: 'Îles Marshall',
    id: 'MARSHALL ISLANDS'
  },
  {
    name: 'Martinique',
    id: 'MARTINIQUE'
  },
  {
    name: 'Mauritanie',
    id: 'MAURITANIA'
  },
  {
    name: 'Maurice',
    id: 'MAURITIUS'
  },
  {
    name: 'Mayotte',
    id: 'MAYOTTE'
  },
  {
    name: 'Mexique',
    id: 'MEXICO'
  },
  {
    name: 'Micronésie, États fédérés de',
    id: 'MICRONESIA, FEDERATED STATES OF'
  },
  {
    name: 'Moldova, République de',
    id: 'MOLDOVA, REPUBLIC OF'
  },
  {
    name: 'Monaco',
    id: 'MONACO'
  },
  {
    name: 'Mongolie',
    id: 'MONGOLIA'
  },
  {
    name: 'Monténégro',
    id: 'MONTENEGRO'
  },
  {
    name: 'Montserrat',
    id: 'MONTSERRAT'
  },
  {
    name: 'Maroc',
    id: 'MOROCCO'
  },
  {
    name: 'Mozambique',
    id: 'MOZAMBIQUE'
  },
  {
    name: 'Myanmar',
    id: 'MYANMAR'
  },
  {
    name: 'Namibie',
    id: 'NAMIBIA'
  },
  {
    name: 'Nauru',
    id: 'NAURU'
  },
  {
    name: 'Népal',
    id: 'NEPAL'
  },
  {
    name: 'Pays-Bas',
    id: 'NETHERLANDS'
  },
  {
    name: 'Antilles néerlandaises',
    id: 'NETHERLANDS ANTILLES'
  },
  {
    name: 'Nouvelle-Calédonie',
    id: 'NEW CALEDONIA'
  },
  {
    name: 'Nouvelle-Zélande',
    id: 'NEW ZEALAND'
  },
  {
    name: 'Nicaragua',
    id: 'NICARAGUA'
  },
  {
    name: 'Niger',
    id: 'NIGER'
  },
  {
    name: 'Nigéria',
    id: 'NIGERIA'
  },
  {
    name: 'Niue',
    id: 'NIUE'
  },
  {
    name: 'Île Norfolk',
    id: 'NORFOLK ISLAND'
  },
  {
    name: 'Îles Mariannes du Nord',
    id: 'NORTHERN MARIANA ISLANDS'
  },
  {
    name: 'Norvège',
    id: 'NORWAY'
  },
  {
    name: 'Oman',
    id: 'OMAN'
  },
  {
    name: 'Pakistan',
    id: 'PAKISTAN'
  },
  {
    name: 'Palaos',
    id: 'PALAU'
  },
  {
    name: 'Territoire palestinien occupé',
    id: 'PALESTINIAN TERRITORY, OCCUPIED'
  },
  {
    name: 'Panama',
    id: 'PANAMA'
  },
  {
    name: 'Papouasie-Nouvelle-Guinée',
    id: 'PAPUA NEW GUINEA'
  },
  {
    name: 'Paraguay',
    id: 'PARAGUAY'
  },
  {
    name: 'Pérou',
    id: 'PERU'
  },
  {
    name: 'Philippines',
    id: 'PHILIPPINES'
  },
  {
    name: 'Pitcairn',
    id: 'PITCAIRN'
  },
  {
    name: 'Pologne',
    id: 'POLAND'
  },
  {
    name: 'Portugal',
    id: 'PORTUGAL'
  },
  {
    name: 'Porto Rico',
    id: 'PUERTO RICO'
  },
  {
    name: 'Qatar',
    id: 'QATAR'
  },
  {
    name: 'Réunion',
    id: 'REUNION'
  },
  {
    name: 'Roumanie',
    id: 'ROMANIA'
  },
  {
    name: 'Fédération de Russie',
    id: 'RUSSIAN FEDERATION'
  },
  {
    name: 'Rwanda',
    id: 'RWANDA'
  },
  {
    name: 'Saint-Barthélemy',
    id: 'SAINT BARTHELEMY'
  },
  {
    name: 'Sainte-Hélène',
    id: 'SAINT HELENA'
  },
  {
    name: 'Saint-Kitts-et-Nevis',
    id: 'SAINT KITTS AND NEVIS'
  },
  {
    name: 'Sainte-Lucie',
    id: 'SAINT LUCIA'
  },
  {
    name: 'Saint-Martin',
    id: 'SAINT MARTIN'
  },
  {
    name: 'Saint-Pierre-et-Miquelon',
    id: 'SAINT PIERRE AND MIQUELON'
  },
  {
    name: 'Saint-Vincent-et-les Grenadines',
    id: 'SAINT VINCENT AND THE GRENADINES'
  },
  {
    name: 'Samoa',
    id: 'SAMOA'
  },
  {
    name: 'Saint-Marin',
    id: 'SAN MARINO'
  },
  {
    name: 'Sao Tomé-et-Principe',
    id: 'SAO TOME AND PRINCIPE'
  },
  {
    name: 'Arabie saoudite',
    id: 'SAUDI ARABIA'
  },
  {
    name: 'Sénégal',
    id: 'SENEGAL'
  },
  {
    name: 'Serbie',
    id: 'SERBIA'
  },
  {
    name: 'Serbie-et-Monténégro',
    id: 'SERBIA AND MONTENEGRO'
  },
  {
    name: 'Seychelles',
    id: 'SEYCHELLES'
  },
  {
    name: 'Sierra Leone',
    id: 'SIERRA LEONE'
  },
  {
    name: 'Singapour',
    id: 'SINGAPORE'
  },
  {
    name: 'St Martin',
    id: 'ST MARTIN'
  },
  {
    name: 'Slovaquie',
    id: 'SLOVAKIA'
  },
  {
    name: 'Slovénie',
    id: 'SLOVENIA'
  },
  {
    name: 'Îles Salomon',
    id: 'SOLOMON ISLANDS'
  },
  {
    name: 'Somalie',
    id: 'SOMALIA'
  },
  {
    name: 'Afrique du Sud',
    id: 'SOUTH AFRICA'
  },
  {
    name: 'Géorgie du Sud-et-les Îles Sandwich du Sud',
    id: 'SOUTH GEORGIA AND THE SOUTH SANDWICH ISLANDS'
  },
  {
    name: 'Soudan du Sud',
    id: 'SOUTH SUDAN'
  },
  {
    name: 'Espagne',
    id: 'SPAIN'
  },
  {
    name: 'Sri Lanka',
    id: 'SRI LANKA'
  },
  {
    name: 'Soudan',
    id: 'SUDAN'
  },
  {
    name: 'Suriname',
    id: 'SURINAME'
  },
  {
    name: 'Svalbard et Jan Mayen',
    id: 'SVALBARD AND JAN MAYEN'
  },
  {
    name: 'Eswatini',
    id: 'SWAZILAND'
  },
  {
    name: 'Suède',
    id: 'SWEDEN'
  },
  {
    name: 'Suisse',
    id: 'SWITZERLAND'
  },
  {
    name: 'République arabe syrienne',
    id: 'SYRIAN ARAB REPUBLIC'
  },
  {
    name: 'Taïwan, Province de Chine',
    id: 'TAIWAN, PROVINCE OF CHINA'
  },
  {
    name: 'Tadjikistan',
    id: 'TAJIKISTAN'
  },
  {
    name: 'Tanzanie, République-Unie de',
    id: 'TANZANIA, UNITED REPUBLIC OF'
  },
  {
    name: 'Thaïlande',
    id: 'THAILAND'
  },
  {
    name: 'Timor oriental',
    id: 'TIMOR-LESTE'
  },
  {
    name: 'Togo',
    id: 'TOGO'
  },
  {
    name: 'Tokelau',
    id: 'TOKELAU'
  },
  {
    name: 'Tonga',
    id: 'TONGA'
  },
  {
    name: 'Trinité-et-Tobago',
    id: 'TRINIDAD AND TOBAGO'
  },
  {
    name: 'Tunisie',
    id: 'TUNISIA'
  },
  {
    name: 'Turquie',
    id: 'TURKEY'
  },
  {
    name: 'Turkménistan',
    id: 'TURKMENISTAN'
  },
  {
    name: 'Îles Turques-et-Caïques',
    id: 'TURKS AND CAICOS ISLANDS'
  },
  {
    name: 'Tuvalu',
    id: 'TUVALU'
  },
  {
    name: 'Ouganda',
    id: 'UGANDA'
  },
  {
    name: 'Ukraine',
    id: 'UKRAINE'
  },
  {
    name: 'Émirats arabes unis',
    id: 'UNITED ARAB EMIRATES'
  },
  {
    name: 'Royaume-Uni',
    id: 'UNITED KINGDOM'
  },
  {
    name: 'États-Unis',
    id: 'UNITED STATES'
  },
  {
    name: 'Îles mineures éloignées des États-Unis',
    id: 'UNITED STATES MINOR OUTLYING ISLANDS'
  },
  {
    name: 'Uruguay',
    id: 'URUGUAY'
  },
  {
    name: 'Ouzbékistan',
    id: 'UZBEKISTAN'
  },
  {
    name: 'Vanuatu',
    id: 'VANUATU'
  },
  {
    name: 'Venezuela',
    id: 'VENEZUELA'
  },
  {
    name: 'Viet Nam',
    id: 'VIET NAM'
  },
  {
    name: 'Îles Vierges britanniques',
    id: 'VIRGIN ISLANDS, BRITISH'
  },
  {
    name: 'Îles Vierges des États-Unis',
    id: 'VIRGIN ISLANDS, U.S.'
  },
  {
    name: 'Wallis-et-Futuna',
    id: 'WALLIS AND FUTUNA'
  },
  {
    name: 'Sahara occidental',
    id: 'WESTERN SAHARA'
  },
  {
    name: 'Yémen',
    id: 'YEMEN'
  },
  {
    name: 'Zambie',
    id: 'ZAMBIA'
  },
  {
    name: 'Zimbabwe',
    id: 'ZIMBABWE'
  }
];

const status = [
  { name: 'ENDOMMAGÉ', id: 'DAMAGED' },
  { name: 'NEUF', id: 'NEW' },
  { name: 'RECONDITIONNÉ', id: 'RECOND' },
  { name: "D'OCCASION'", id: 'SECONDHAND' }
];

const fileInputsOne = [
  {
    type: 'INVOICE',
    name: 'Proforma',
    field: 'invoice',
    tooltip: `this_may_be_proforma`
  },
  {
    type: 'IMPORT_DECLARATION_FORM',
    field: 'import_declaration',
    name: 'Déclaration d’importation',
    tooltip: `this_may_be_provided`,
    countries: ['IVORY_COAST', 'CAMEROON', 'KENYA']
  },
  {
    type: 'QUALITY_CERTIFICATE',
    field: 'quality_certificade',
    name: 'Certificat qualité',
    tooltip: `this_may_be_certificate`
  },
  {
    type: 'LETTER_OF_CREDIT',
    name: 'Lettre de crédit',
    field: 'letter_of_credit',
    tooltip: `a_payment_commitment`,
    countries: ['ALGERIA', 'LIBYA']
  }
];

const fileInputsTwo = [
  {
    label: 'Fiche technique / Fiche produit',
    name: 'technicalSheet',
    tooltip:
      'Un document descriptif qui fournit des détails techniques et des spécifications sur le produit.'
  },
  {
    label: 'Rapport de test',
    name: 'testReport',
    tooltip: `Il peut s'agir de rapports de tests internes ou externes qui démontrent la conformité du produit aux normes ou aux spécifications requises.`
  }
];

const otherDestinations = [
  'SAUDI ARABIA',
  'UNITED ARAB EMIRATES',
  'IRAQ',
  'KOWEIT',
  'LEBANON',
  'MALI',
  'NIGERIA',
  'QATAR',
  'MOROCCO',
  'EGYPT'
];

const typeOfBussines = [
  { name: 'Fournisseur', id: 'PROVIDER' },
  { name: 'Autorité de certification', id: 'CERTIFICATION_AUTHORITY' },
  { name: 'Négociant', id: 'TRADER' },
  { name: 'Fabricant', id: 'MANUFACTURER' },
  { name: 'Transitaire', id: 'FORWARDER' }
];

const sellersDictionary = {
  id: 'sellerUuid',
  name: 'companyName',
  email: 'companyEmail',
  phone: 'companyPhone',
  address: 'companyCompleteAddress',
  postal_code: 'companyPostalCode',
  city: 'companyCity',
  country: 'companyCountry'
};

const buyersDictionary = {
  id: 'buyerUuid',
  name: 'buyerCompanyName',
  email: 'buyerEmail',
  phone: 'buyerPhone',
  address: 'buyerCompleteAddress',
  postal_code: 'buyerPostalCode',
  city: 'buyerCity',
  country: 'buyerCountry'
};

const inspectionDictionary = {
  id: 'inspectionUuid',
  name: 'inspectionName',
  email: 'inspectionEmail',
  phone: 'inspectionPhone',
  address: 'inspectionCompleteAddress',
  postal_code: 'inspectionPostalCode',
  city: 'inspectionCity',
  country: 'inspectionCountry',
  contact_name: 'inspectorFirstName',
  contact_lastname: 'inspectorLastName',
  inspection_date: 'inspectionDate'
};

const providerDictionary = {
  name: 'organizationName',
  contact: 'contactName',
  email: 'email',
  has_annual_reg_route_bc: 'benefitsCheck',
  reference: 'reference',
  expiration_date: 'expirationDate'
};

const documentsDictionary = {
  description: 'description',
  condition: 'condition',
  quantity: 'quantity',
  size_unit: 'size_unit',
  unit_price: 'unit_price',
  model: 'model',
  brand: 'brand',
  country_origin: 'country_origin',
  name: 'name'
};

const productsDictionary = {
  TECHNICAL_SHEET_OR_PRODUCT_DESCRIPTIVE: 'technicalSheet',
  TEST_REPORT_OR_ANALYSIS_CERTIFICATE: 'testReport',
  GOEIC_REGISTRATION: 'additionalDocument'
};

const documentsByCountryDictionary = {
  INVOICE: 'invoice',
  IMPORT_DECLARATION_FORM: 'import_declaration',
  QUALITY_CERTIFICATE: 'quality_certificade',
  LETTER_OF_CREDIT: 'letter_of_credit'
};

const certificateStatus = [
  { name: 'Brouillon', id: 'DRAFT' },
  { name: 'Complet', id: 'COMPLETE' },
  { name: 'Modifications Nécessaires', id: 'NEED_MODIFICATIONS' },
  { name: 'En Revue', id: 'IN_REVIEW' }
];

const fetchData = async (
  apiFunction,
  setDataFunction,
  name,
  fetchParam,
  additionalParam
) => {
  try {
    const response = await apiFunction(fetchParam ? fetchParam : null);
    return setDataFunction(
      response.data?.data || response.data,
      additionalParam ? additionalParam : null
    );
  } catch (error) {
    console.log(error.message, name);
  }
};

const fillData = (values, dictionary, setMethod) => {
  const mappedData = {};

  Object.keys(values).forEach((key) => {
    if (dictionary[key]) {
      setMethod(dictionary[key], values[key]);
    }
  });

  return mappedData;
};

function formatDate(dateString) {
  const date = new Date(dateString);

  const formattedDate = `${(date.getMonth() + 1)
    .toString()
    .padStart(2, '0')}/${date
    .getDate()
    .toString()
    .padStart(2, '0')}/${date.getFullYear()}`;

  return formattedDate;
}

const statusColors = {
  DRAFT: { backgroundColor: '#F0F9FF', color: '#026AA2' },
  COMPLETE: { backgroundColor: '#ECFDF3', color: '#027A48' },
  NEED_MODIFICATIONS: { backgroundColor: '#C01048', color: '#FFF1F3' },
  IN_REVIEW: { backgroundColor: '#F4F3FF', color: '#5925DC' }
};

const getLagunage = () => {
  return i18n.language;
};

function sortCountries(languageCode) {
  const sortedCountries = [...worldCountries];

  if (languageCode === 'fr') {
    sortedCountries.sort((a, b) => a.name.localeCompare(b.name));
  } else if (languageCode === 'en') {
    sortedCountries.sort((a, b) => a.id.localeCompare(b.id));
  } else {
    console.error('Invalid language code');
    return null;
  }

  return sortedCountries;
}

const imageCdn = (url: string) => {
  if (!url) return null;
  if (url.includes('https')) {
    return url;
  } else {
    return 'https://' + publicRuntimeConfig.CDN_URL + '/' + url;
  }
};

export {
  worldCountries,
  status,
  fileInputsOne,
  fileInputsTwo,
  otherDestinations,
  typeOfBussines,
  sellersDictionary,
  buyersDictionary,
  inspectionDictionary,
  fetchData,
  providerDictionary,
  fillData,
  documentsDictionary,
  productsDictionary,
  documentsByCountryDictionary,
  formatDate,
  statusColors,
  certificateStatus,
  getLagunage,
  sortCountries,
  imageCdn
};
