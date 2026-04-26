/**
 * Spanish Name Encoding Fix Dictionary
 * =====================================
 * Fixes names where special characters (ñ, á, é, í, ó, ú, ü, etc.)
 * were replaced with '?' during data export/encoding conversion.
 *
 * Usage:
 *   const { fixName, WORD_DICTIONARY } = require('./spanishNameFixer');
 *   
 *   fixName("GARC?A HERN?NDEZ")  // => "GARCÍA HERNÁNDEZ"
 *   fixName("MU?OZ PE?A")         // => "MUÑOZ PEÑA"
 *   fixName("Mar?a Sof?a L?pez")  // => "María Sofía López"
 *
 * The dictionary maps broken words (UPPERCASE) to their correct form.
 * The fixName() function handles case preservation automatically.
 */

const WORD_DICTIONARY = {
  "?DE?LA?": "DE LA",
  "?DIANA": "DIANA",
  "?H?CTOR": "HÉCTOR",
  "?LVAREZ": "ÁLVAREZ",
  "?LVARO": "ÁLVARO",
  "?NGEL": "ÁNGEL",
  "?NGELES": "ÁNGELES",
  "?SCAR": "ÓSCAR",
  "?SCHIIMMELSENNYG": "ÖSCHIIMMELSENNYG",
  "?VILA": "ÁVILA",
  "?VILA?SADA": "ÁVILA-SADA",
  "A?ORVE": "AÑORVE",
  "AAR?N": "AARÓN",
  "ACU?A": "ACUÑA",
  "AD?N": "ADÁN",
  "ADRI?N": "ADRIÁN",
  "AGUI?ACA": "AGUIÑACA",
  "AGUI?AGA": "AGUIÑAGA",
  "AGUST?N": "AGUSTÍN",
  "AJU?A": "AJUÑA",
  "ALARC?N": "ALARCÓN",
  "ALBARR?N": "ALBARRÁN",
  "ALBARRAN?BLAS": "ALBARRAN-BLAS",
  "ALC?NTARA": "ALCÁNTARA",
  "ALCAL?": "ALCALÁ",
  "ALEGR?A": "ALEGRÍA",
  "ALEJANDR?A": "ALEJANDRÍA",
  "ALEM?N": "ALEMÁN",
  "ALME?O": "ALMEÑO",
  "AM?RICA": "AMÉRICA",
  "ANAH?": "ANAHÍ",
  "ANDR?": "ANDRÉ",
  "ANDR?S": "ANDRÉS",
  "ANG?LICA": "ANGÉLICA",
  "ANTA?O": "ANTAÑO",
  "ANTU?A": "ANTUÑA",
  "ARAG?N": "ARAGÓN",
  "ARG?ELLES": "ARGÜELLES",
  "ASUNCI?N": "ASUNCIÓN",
  "ATLIXQUE?O": "ATLIXQUEÑO",
  "AVEDA?O": "AVEDAÑO",
  "AVENDA?O": "AVENDAÑO",
  "AVI?A": "AVIÑA",
  "AYALA?FIESCO": "AYALA-FIESCO",
  "B?CKER": "BÖCKER",
  "B?EZ": "BÁEZ",
  "B?RCENAS": "BÁRCENAS",
  "BA?OS": "BAÑOS",
  "BA?UELOS": "BAÑUELOS",
  "BALC?ZAR": "BALCÁZAR",
  "BAR?N": "BARÓN",
  "BARCEL?": "BARCELÓ",
  "BASA?EZ": "BASAÑEZ",
  "BEATR?Z": "BEATRÍZ",
  "BEGO?A": "BEGOÑA",
  "BEL?N": "BELÉN",
  "BELTR?N": "BELTRÁN",
  "BEN?TEZ": "BENÍTEZ",
  "BERM?DEZ": "BERMÚDEZ",
  "BERN?LDEZ": "BERNÁLDEZ",
  "BETZAB?": "BETZABÉ",
  "BIBI?E": "BIBIÑE",
  "BOJ?RQUEZ": "BOJÓRQUEZ",
  "BOLA?O": "BOLAÑO",
  "BOLA?OS": "BOLAÑOS",
  "BRE?A": "BREÑA",
  "BRI?EZ": "BRIÑEZ",
  "BRICE?O": "BRICEÑO",
  "BRISE?A": "BRISEÑA",
  "BRISE?O": "BRISEÑO",
  "BU?UELOS": "BUÑUELOS",
  "BUE?A": "BUEÑA",
  "BUEND?A": "BUENDÍA",
  "BURGUE?O": "BURGUEÑO",
  "C?CERES": "CÁCERES",
  "C?RDENAS": "CÁRDENAS",
  "C?RDOBA": "CÓRDOBA",
  "C?RMEN": "CÁRMEN",
  "C?RNEIRO": "CARNEIRO",
  "C?SAR": "CÉSAR",
  "CA?A": "CAÑA",
  "CA?ARTE": "CAÑARTE",
  "CA?AS": "CAÑAS",
  "CA?EDO": "CAÑEDO",
  "CABA?A": "CABAÑA",
  "CABA?AS": "CABAÑAS",
  "CABA?ERO": "CABAÑERO",
  "CABA?EZ": "CABAÑEZ",
  "CAI?SALES": "CAIÑSALES",
  "CAL?": "CALÉ",
  "CALDER?N": "CALDERÓN",
  "CANEL?N": "CANELÓN",
  "CANT?": "CANTÚ",
  "CAPACITACI?N": "CAPACITACIÓN",
  "CARCA?O": "CARCAÑO",
  "CARDE?A": "CARDEÑA",
  "CARDE?O": "CARDEÑO",
  "CARE?O": "CAREÑO",
  "CARI?O": "CARIÑO",
  "CARRE?O": "CARREÑO",
  "CASA?AS": "CASAÑAS",
  "CASTA?EDA": "CASTAÑEDA",
  "CASTA?O": "CASTAÑO",
  "CASTA?ON": "CASTAÑÓN",
  "CASTE?EDA": "CASTEÑEDA",
  "CASTEL?N": "CASTELÁN",
  "CASTREJ?N": "CASTREJÓN",
  "CASTRESA?A": "CASTRESAÑA",
  "CATA?EDA": "CATAÑEDA",
  "CATA?O": "CATAÑO",
  "CATAL?N": "CATALÁN",
  "CEDE?O": "CEDEÑO",
  "CER?N": "CERÓN",
  "CESE?A": "CESEÑA",
  "CH?VEZ": "CHÁVEZ",
  "CHABL?": "CHABLÉ",
  "CHAC?N": "CHACÓN",
  "CHAVARR?A": "CHAVARRÍA",
  "CHI?AS": "CHIÑAS",
  "CIRUG?A": "CIRUGÍA",
  "COBI?N": "COBIÁN",
  "COL?N": "COLÓN",
  "CONCEPCI?N": "CONCEPCIÓN",
  "CORT?S": "CORTÉS",
  "COSI?": "COSÍO",
  "COUTI?O": "COUTIÑO",
  "CRIST?BAL": "CRISTÓBAL",
  "CUAUHT?MOC": "CUAUHTÉMOC",
  "CURE?O": "CUREÑO",
  "D?AZ": "DÍAZ",
  "D?BBADIE": "DÁBBADIE",
  "D?NOVAN": "DÓNOVAN",
  "D?VALOO": "DÁVALOS",
  "D?VALOS": "DÁVALOS",
  "D?VILA": "DÁVILA",
  "DAIR?N": "DAIRÓN",
  "DAR?O": "DARÍO",
  "DE?JES?S": "DE JESÚS",
  "DISE?O": "DISEÑO",
  "DO?ATE": "DOÑATE",
  "DOM?NGUEZ": "DOMÍNGUEZ",
  "DOMINIQUE?PICAZO": "DOMINIQUE-PICAZO",
  "DUE?A": "DUEÑA",
  "DUE?AS": "DUEÑAS",
  "DUE?ES": "DUEÑES",
  "DUE?EZ": "DUEÑEZ",
  "DUR?N": "DURÁN",
  "EFR?N": "EFRÉN",
  "EFRA?N": "EFRAÍN",
  "EL?AS": "ELÍAS",
  "ELI?": "ELIÉ",
  "ENDA??": "ENDAÑÉ",
  "ENERG?A": "ENERGÍA",
  "ENR?QUEZ": "ENRÍQUEZ",
  "ER?NDIRA": "ERÉNDIRA",
  "ESPA?A": "ESPAÑA",
  "ESPI?EIRA": "ESPIÑEIRA",
  "ESTA?OL": "ESTAÑOL",
  "ESTEFAN?A": "ESTEFANÍA",
  "EUM?A": "EUMÑA",
  "F?ITSTENBERGER": "FÜITSTENBERGER",
  "F?LIX": "FÉLIX",
  "F?TIMA": "FÁTIMA",
  "FABI?N": "FABIÁN",
  "FANDI?O": "FANDIÑO",
  "FAR?AS": "FARÍAS",
  "FELIP?": "FELIPÉ",
  "FERN?NDEZ": "FERNÁNDEZ",
  "FILEM?N": "FILEMÓN",
  "FINAL?": "FINALÉ",
  "G?MEZ": "GÓMEZ",
  "G?NICO": "GÉNICO",
  "GA?N": "GAÑN",
  "GABI?A": "GABIÑA",
  "GALV?N": "GALVÁN",
  "GAMI?O": "GAMIÑO",
  "GARC?A": "GARCÍA",
  "GARC?A?CRUZ": "GARCÍA-CRUZ",
  "GARCIA?SOUZA": "GARCÍA-SOUZA",
  "GARCIDUE?AS": "GARCIDUEÑAS",
  "GARDU?O": "GARDUÑO",
  "GASTA?ADUY": "GASTAÑADUY",
  "GAYT?N": "GAYTÁN",
  "GEN?": "GENÉ",
  "GERM?N": "GERMÁN",
  "GIR?N": "GIRÓN",
  "GO?I": "GOÑI",
  "GOD?NEZ": "GODÍNEZ",
  "GON?ALO": "GONÇALO",
  "GONZ?LES": "GONZÁLES",
  "GONZ?LEZ": "GONZÁLEZ",
  "GONZA?VES": "GONZÁLVES",
  "GRAC?A": "GRACÍA",
  "GRAD?N": "GRADÍN",
  "GRANADE?O": "GRANADEÑO",
  "GUDI?O": "GUDIÑO",
  "GUERE?A": "GUEREÑA",
  "GUILL?N": "GUILLÉN",
  "GUTI?RREZ": "GUTIÉRREZ",
  "GUTIERREZ?YA?EZ": "GUTIÉRREZ-YAÑEZ",
  "GUZM?N": "GUZMÁN",
  "H?CTOR": "HÉCTOR",
  "HERIR?": "HERIRÁ",
  "HERN?NDEZ": "HERNÁNDEZ",
  "HERN?NDEZ?SANQUILLI": "HERNÁNDEZ-SANQUILLI",
  "HUITR?N": "HUITRÓN",
  "I?AKI": "IÑAKI",
  "I?AKY": "IÑAKY",
  "I?IGO": "IÑIGO",
  "I?IGUEZ": "IÑIGUEZ",
  "IB??EZ": "IBÁÑEZ",
  "IBA?ES": "IBAÑES",
  "IBA?EZ": "IBAÑEZ",
  "INCL?N": "INCLÁN",
  "INSCPECCI?N": "INSPECCIÓN",
  "IRA?S": "IRAÍS",
  "ISA?AS": "ISAÍAS",
  "ISLAS?REYES": "ISLAS-REYES",
  "IV?N": "IVÁN",
  "J?NIOR": "JÚNIOR",
  "JAQUEL?N": "JAQUELÍN",
  "JAZM?N": "JAZMÍN",
  "JES?S": "JESÚS",
  "JIM?NEZ": "JIMÉNEZ",
  "JIM?NEZ?VALD?S": "JIMÉNEZ-VALDÉS",
  "JOAQU?N": "JOAQUÍN",
  "JORD?N": "JORDÁN",
  "JOS?": "JOSÉ",
  "JOSEMAR?A": "JOSEMARÍA",
  "JOSU?": "JOSUÉ",
  "JU?A": "JUÑA",
  "JU?REZ": "JUÁREZ",
  "JUD?": "JUDÍ",
  "JULI?N": "JULIÁN",
  "L?HRS": "LÖHRS",
  "L?PEZ": "LÓPEZ",
  "LARRA?AGA": "LARRAÑAGA",
  "LE?ERO": "LEÑERO",
  "LE?N": "LEÓN",
  "LI?ERO": "LIÑERO",
  "LIM?N": "LIMÓN",
  "LOMEL?": "LOMELÍ",
  "LOPEZ?MARTINEZ": "LOPEZ-MARTINEZ",
  "LU?S": "LUÍS",
  "LUC?A": "LUCÍA",
  "M?NDEZ": "MÉNDEZ",
  "M?NERA": "MÚNERA",
  "M?NICA": "MÓNICA",
  "M?RQUEZ": "MÁRQUEZ",
  "M?XICO": "MÉXICO",
  "MA?OLI": "MAÑOLI",
  "MA?ON": "MAÑÓN",
  "MAC?AS": "MACÍAS",
  "MADUE?O": "MADUEÑO",
  "MAE?A": "MAEÑA",
  "MAGA?A": "MAGAÑA",
  "MALAG?N": "MALAGÓN",
  "MALAQU?AS": "MALAQUÍAS",
  "MAR?A": "MARÍA",
  "MAR?N": "MARÍN",
  "MARA?A": "MARAÑA",
  "MARGA?A": "MARGAÑA",
  "MARL?N": "MARLÉN",
  "MART?N": "MARTÍN",
  "MART?NEZ": "MARTÍNEZ",
  "MARTI?ON": "MARTIÑÓN",
  "MAT?AS": "MATÍAS",
  "MEJ?A": "MEJÍA",
  "MEN?NDEZ": "MENÉNDEZ",
  "MI?AUR": "MIÑAUR",
  "MILL?N": "MILLÁN",
  "MMU?OZ": "MMUÑOZ",
  "MOCI?O": "MOCIÑO",
  "MOIS?S": "MOISÉS",
  "MONDRAG?N": "MONDRAGÓN",
  "MONTA?ES": "MONTAÑES",
  "MONTA?EZ": "MONTAÑEZ",
  "MONTA?O": "MONTAÑO",
  "MOR?N": "MORÁN",
  "MU??Z": "MUÑÍZ",
  "MU?IZ": "MUÑIZ",
  "MU?OS": "MUÑOS",
  "MU?OZ": "MUÑOZ",
  "MU?OZCANO": "MUÑOZCANO",
  "MUCI?O": "MUCIÑO",
  "MUNGU?A": "MUNGUÍA",
  "N??EZ": "NÚÑEZ",
  "N?JERA": "NÁJERA",
  "NA?EZ": "NAÑEZ",
  "NAPOLE?N": "NAPOLEÓN",
  "NAVIDE?A": "NAVIDEÑA",
  "NEFTAL?": "NEFTALÍ",
  "NEV?REZ": "NEVÁREZ",
  "NI?O": "NIÑO",
  "NICOL?S": "NICOLÁS",
  "NICOLAS?ESCALON": "NICOLAS-ESCALON",
  "NO?": "NOÉ",
  "NOEM?": "NOEMÍ",
  "NORE?A": "NOREÑA",
  "NORO?A": "NOROÑA",
  "NOVER?N": "NOVERÓN",
  "NU?EZ": "NUÑEZ",
  "NU?O": "NUÑO",
  "NU?OZ": "NUÑOZ",
  "O?ANEDEL": "OÑANEDEL",
  "O?ATE": "OÑATE",
  "O?HEA": "O'HEA",
  "OBREG?N": "OBREGÓN",
  "OCA?A": "OCAÑA",
  "OCA?AS": "OCAÑAS",
  "ODONTOPEDIATR?A": "ODONTOPEDIATRÍA",
  "OLGU?N": "OLGUÍN",
  "OMA?A": "OMAÑA",
  "ORD??EZ": "ORDÓÑEZ",
  "ORDO?ES": "ORDOÑES",
  "ORDO?EZ": "ORDOÑEZ",
  "ORDU?A": "ORDUÑA",
  "ORDU?O": "ORDUÑO",
  "ORE?O": "OREÑO",
  "ORO?O": "OROÑO",
  "ORT?Z": "ORTÍZ",
  "ORTOD?EZ": "ORTODÍEZ",
  "ORTODÍ?EZ": "ORTODÍEZ",
  "ORTU?O": "ORTUÑO",
  "P?NEDA": "PÍNEDA",
  "P?RAMO": "PÁRAMO",
  "P?REZ": "PÉREZ",
  "P?REZ-BARN?S": "PÉREZ-BARNÉS",
  "P?Z": "PAZ",
  "PA?Z": "PAÉZ",
  "PACHECO?": "PACHECO",
  "PATI?O": "PATIÑO",
  "PE?A": "PEÑA",
  "PE?AALBA": "PEÑAALBA",
  "PE?AFIEL": "PEÑAFIEL",
  "PE?AFLOR": "PEÑAFLOR",
  "PE?AFLORES": "PEÑAFLORES",
  "PE?ALOZA": "PEÑALOZA",
  "PE?ALVA": "PEÑALVA",
  "PE?ARRIETA": "PEÑARRIETA",
  "PE?U?URI": "PEÑUÑURI",
  "PE?UELA": "PEÑUELA",
  "PE?UELAS": "PEÑUELAS",
  "PEL?EZ": "PELÁEZ",
  "PENU?URI": "PENUÑURI",
  "PEZA?A": "PEZAÑA",
  "PI?A": "PIÑA",
  "PI?ALVA": "PIÑALVA",
  "PI?EIRIO": "PIÑEIRIO",
  "PI?EIRO": "PIÑEIRO",
  "PI?EIROS": "PIÑEIROS",
  "PI?ERO": "PIÑERO",
  "PI?ON": "PIÑÓN",
  "PI?ONES": "PIÑONES",
  "PIZA?A": "PIZAÑA",
  "PO?O": "POÑO",
  "QUI?ONES": "QUIÑONES",
  "QUI?ONEZ": "QUIÑONEZ",
  "R?OS": "RÍOS",
  "RA?A": "RAÑA",
  "RA?L": "RAÚL",
  "RAM?N": "RAMÓN",
  "RAM?REZ": "RAMÍREZ",
  "RENTER?A": "RENTERÍA",
  "RES?NDIZ": "RESÉNDIZ",
  "REUNI?N": "REUNIÓN",
  "REVIS?N": "REVISIÓN",
  "REVISI?N": "REVISIÓN",
  "RIA?O": "RIAÑO",
  "RICA?O": "RICAÑO",
  "ROCI?": "ROCÍO",
  "RODR?GUEZ": "RODRÍGUEZ",
  "RODR?GUEZ?RAM?REZ": "RODRÍGUEZ-RAMÍREZ",
  "ROLD?N": "ROLDÁN",
  "ROM?N": "ROMÁN",
  "ROSAL?A": "ROSALÍA",
  "RU?Z": "RUÍZ",
  "RUB?": "RUBÍ",
  "RUB?N": "RUBÉN",
  "S?NCHEZ": "SÁNCHEZ",
  "SA?L": "SAÚL",
  "SALD?VAR": "SALDÍVAR",
  "SALDA?A": "SALDAÑA",
  "SALMA?O": "SALMAÑO",
  "SALMER?N": "SALMERÓN",
  "SANTIB??EZ": "SANTIBÁÑEZ",
  "SANTIBA?ES": "SANTIBAÑES",
  "SANTIBA?EZ": "SANTIBAÑEZ",
  "SANTOS?ROJAS": "SANTOS-ROJAS",
  "SE?OR": "SEÑOR",
  "SE?ORA": "SEÑORA",
  "SEBASTI?N": "SEBASTIÁN",
  "SEDE?O": "SEDEÑO",
  "SEGURA?URBINA": "SEGURA-URBINA",
  "SOF?A": "SOFÍA",
  "SOL?S": "SOLÍS",
  "STEFAN?A": "STEFANÍA",
  "SU?REZ": "SUÁREZ",
  "T?LLEZ": "TÉLLEZ",
  "TE?FILO": "TEÓFILO",
  "TER?N": "TERÁN",
  "TERR?N": "TERRÓN",
  "TIZCARE?O": "TIZCAREÑO",
  "TOM?S": "TOMÁS",
  "TRANQUILIZ?": "TRANQUILIZÓ",
  "TREVI?O": "TREVIÑO",
  "TRIVI?O": "TRIVIÑO",
  "TUA?AS": "TUAÑAS",
  "URE?A": "UREÑA",
  "V?CTOR": "VÍCTOR",
  "V?SQUEZ": "VÁSQUEZ",
  "V?ZQUEZ": "VÁZQUEZ",
  "VALD?S": "VALDÉS",
  "VALDEPE?A": "VALDEPEÑA",
  "VALENT?N": "VALENTÍN",
  "VEL?SQUEZ": "VELÁSQUEZ",
  "VEL?ZQUEZ": "VELÁZQUEZ",
  "VER?ETT": "VERÉTT",
  "VER?NICA": "VERÓNICA",
  "VI?AS": "VIÑAS",
  "VICENTE?O": "VICENTEÑO",
  "VILLACA?A": "VILLACAÑA",
  "VILLAFA?A": "VILLAFAÑA",
  "VILLAFA?ET": "VILLAFAÑET",
  "VILLAFA?EZ": "VILLAFAÑEZ",
  "VILLAG?MEZ": "VILLAGÓMEZ",
  "VILLASE?OR": "VILLASEÑOR",
  "VILLICA?A": "VILLICAÑA",
  "VIRUEGA?TAPIA": "VIRUEGA-TAPIA",
  "VIV?AN": "VIVÍAN",
  "XICOHT?NCATL": "XICOHTÉNCATL",
  "YA?ES": "YAÑES",
  "YA?EZ": "YAÑEZ",
  "YAZM?N": "YAZMÍN",
  "Z??IGA": "ZÚÑIGA",
  "Z?RATE": "ZÁRATE",
  "ZALD?VAR": "ZALDÍVAR",
  "ZAYAS?PERALES": "ZAYAS-PERALES",
  "ZER?N": "ZERÓN",
  "ZERME?O": "ZERMEÑO",
  "ZU?IGA": "ZUÑIGA",
  "ZUGI?A": "ZUGIÑA"
};

/**
 * Fix a full name by replacing each broken word with its correct form.
 * Preserves original casing pattern (UPPERCASE, lowercase, Title Case).
 *
 * @param {string} name - The name containing '?' characters
 * @returns {string} - The corrected name
 */
function fixName(name) {
  if (!name || !name.includes('?')) return name;

  // First, try to match the entire trimmed name as a compound key
  const trimmed = name.trim();
  const upperTrimmed = trimmed.toUpperCase();
  if (WORD_DICTIONARY[upperTrimmed]) {
    return applyCasing(WORD_DICTIONARY[upperTrimmed], trimmed);
  }

  // Split into tokens (words + whitespace)
  const tokens = name.split(/(\s+)/);

  return tokens.map(token => {
    if (!token.includes('?')) return token;

    const upperToken = token.toUpperCase();
    // Remove trailing period for lookup
    const cleanToken = upperToken.replace(/\.$/, '');

    if (WORD_DICTIONARY[upperToken]) {
      return applyCasing(WORD_DICTIONARY[upperToken], token);
    }
    if (WORD_DICTIONARY[cleanToken]) {
      const hadPeriod = upperToken !== cleanToken;
      const fixed = applyCasing(WORD_DICTIONARY[cleanToken], token.replace(/\.$/, ''));
      return hadPeriod ? fixed + '.' : fixed;
    }

    return token;
  }).join('');
}

/**
 * Apply the casing pattern from the original word to the replacement.
 *
 * @param {string} replacement - The correct word (from dictionary)
 * @param {string} original - The original broken word (with casing)
 * @returns {string} - The replacement with matched casing
 */
function applyCasing(replacement, original) {
  if (!original || !replacement) return replacement;

  // All uppercase
  if (original === original.toUpperCase()) {
    return replacement.toUpperCase();
  }
  // All lowercase
  if (original === original.toLowerCase()) {
    return replacement.toLowerCase();
  }
  // Title Case (first letter upper, rest lower)
  if (
    original[0] === original[0].toUpperCase() &&
    original.slice(1) === original.slice(1).toLowerCase()
  ) {
    return replacement.replace(/[^\s-]+/g, w => w[0].toUpperCase() + w.slice(1).toLowerCase());
  }

  // Default: return replacement as-is
  return replacement;
}

/**
 * Process an array of names, fixing all '?' encoding issues.
 *
 * @param {string[]} names - Array of names to fix
 * @returns {string[]} - Array of corrected names
 */
function fixNames(names) {
  return names.map(fixName);
}

/**
 * Get statistics about how many names in an array have encoding issues.
 *
 * @param {string[]} names - Array of names to analyze
 * @returns {object} - Stats: total, broken, fixed, unfixable
 */
function getStats(names) {
  let broken = 0;
  let fixed = 0;
  let unfixable = 0;

  for (const name of names) {
    if (name && name.includes('?')) {
      broken++;
      const result = fixName(name);
      if (result.includes('?')) {
        unfixable++;
      } else {
        fixed++;
      }
    }
  }

  return {
    total: names.length,
    broken,
    fixed,
    unfixable,
    clean: names.length - broken
  };
}

module.exports = { WORD_DICTIONARY, fixName, fixNames, applyCasing, getStats };
