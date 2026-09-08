export interface PhoneCountry {
  code: string;
  name: string;
  nameEn: string;
  nameAr: string;
  nameTr: string;
  emoji: string;
  phone_code: string;
}

export const DEFAULT_PHONE_COUNTRY: PhoneCountry = {
  code: "TR",
  name: "Turkey",
  nameEn: "Turkey",
  nameAr: "تركيا",
  nameTr: "Türkiye",
  emoji: "🇹🇷",
  phone_code: "90",
};

export const PHONE_COUNTRIES: PhoneCountry[] = [
  // GCC & Middle East
  { code: "SA", name: "Saudi Arabia", nameEn: "Saudi Arabia", nameAr: "المملكة العربية السعودية", nameTr: "Suudi Arabistan", emoji: "🇸🇦", phone_code: "966" },
  { code: "AE", name: "United Arab Emirates", nameEn: "United Arab Emirates", nameAr: "الإمارات العربية المتحدة", nameTr: "Birleşik Arap Emirlikleri", emoji: "🇦🇪", phone_code: "971" },
  { code: "KW", name: "Kuwait", nameEn: "Kuwait", nameAr: "الكويت", nameTr: "Kuveyt", emoji: "🇰🇼", phone_code: "965" },
  { code: "QA", name: "Qatar", nameEn: "Qatar", nameAr: "قطر", nameTr: "Katar", emoji: "🇶🇦", phone_code: "974" },
  { code: "BH", name: "Bahrain", nameEn: "Bahrain", nameAr: "البحرين", nameTr: "Bahreyn", emoji: "🇧🇭", phone_code: "973" },
  { code: "OM", name: "Oman", nameEn: "Oman", nameAr: "عُمان", nameTr: "Umman", emoji: "🇴🇲", phone_code: "968" },
  { code: "TR", name: "Turkey", nameEn: "Turkey", nameAr: "تركيا", nameTr: "Türkiye", emoji: "🇹🇷", phone_code: "90" },
  { code: "EG", name: "Egypt", nameEn: "Egypt", nameAr: "مصر", nameTr: "Mısır", emoji: "🇪🇬", phone_code: "20" },
  { code: "JO", name: "Jordan", nameEn: "Jordan", nameAr: "الأردن", nameTr: "Ürdün", emoji: "🇯🇴", phone_code: "962" },
  { code: "LB", name: "Lebanon", nameEn: "Lebanon", nameAr: "لبنان", nameTr: "Lübnan", emoji: "🇱🇧", phone_code: "961" },
  { code: "IQ", name: "Iraq", nameEn: "Iraq", nameAr: "العراق", nameTr: "Irak", emoji: "🇮🇶", phone_code: "964" },
  { code: "SY", name: "Syria", nameEn: "Syria", nameAr: "سوريا", nameTr: "Suriye", emoji: "🇸🇾", phone_code: "963" },
  { code: "PS", name: "Palestine", nameEn: "Palestine", nameAr: "فلسطين", nameTr: "Filistin", emoji: "🇵🇸", phone_code: "970" },
  { code: "YE", name: "Yemen", nameEn: "Yemen", nameAr: "اليمن", nameTr: "Yemen", emoji: "🇾🇪", phone_code: "967" },
  { code: "MA", name: "Morocco", nameEn: "Morocco", nameAr: "المغرب", nameTr: "Fas", emoji: "🇲🇦", phone_code: "212" },
  { code: "DZ", name: "Algeria", nameEn: "Algeria", nameAr: "الجزائر", nameTr: "Cezayir", emoji: "🇩🇿", phone_code: "213" },
  { code: "TN", name: "Tunisia", nameEn: "Tunisia", nameAr: "تونس", nameTr: "Tunus", emoji: "🇹🇳", phone_code: "216" },
  { code: "LY", name: "Libya", nameEn: "Libya", nameAr: "ليبيا", nameTr: "Libya", emoji: "🇱🇾", phone_code: "218" },
  { code: "SD", name: "Sudan", nameEn: "Sudan", nameAr: "السودان", nameTr: "Sudan", emoji: "🇸🇩", phone_code: "249" },
  // International Major
  { code: "GB", name: "United Kingdom", nameEn: "United Kingdom", nameAr: "المملكة المتحدة", nameTr: "Birleşik Krallık", emoji: "🇬🇧", phone_code: "44" },
  { code: "US", name: "United States", nameEn: "United States", nameAr: "الولايات المتحدة الأمريكية", nameTr: "Amerika Birleşik Devletleri", emoji: "🇺🇸", phone_code: "1" },
  { code: "CA", name: "Canada", nameEn: "Canada", nameAr: "كندا", nameTr: "Kanada", emoji: "🇨🇦", phone_code: "1" },
  { code: "DE", name: "Germany", nameEn: "Germany", nameAr: "ألمانيا", nameTr: "Almanya", emoji: "🇩🇪", phone_code: "49" },
  { code: "FR", name: "France", nameEn: "France", nameAr: "فرنسا", nameTr: "Fransa", emoji: "🇫🇷", phone_code: "33" },
  { code: "IT", name: "Italy", nameEn: "Italy", nameAr: "إيطاليا", nameTr: "İtalya", emoji: "🇮🇹", phone_code: "39" },
  { code: "ES", name: "Spain", nameEn: "Spain", nameAr: "إسبانيا", nameTr: "İspanya", emoji: "🇪🇸", phone_code: "34" },
  { code: "NL", name: "Netherlands", nameEn: "Netherlands", nameAr: "هولندا", nameTr: "Hollanda", emoji: "🇳🇱", phone_code: "31" },
  { code: "BE", name: "Belgium", nameEn: "Belgium", nameAr: "بلجيكا", nameTr: "Belçika", emoji: "🇧🇪", phone_code: "32" },
  { code: "CH", name: "Switzerland", nameEn: "Switzerland", nameAr: "سويسرا", nameTr: "İsviçre", emoji: "🇨🇭", phone_code: "41" },
  { code: "AT", name: "Austria", nameEn: "Austria", nameAr: "النمسا", nameTr: "Avusturya", emoji: "🇦🇹", phone_code: "43" },
  { code: "SE", name: "Sweden", nameEn: "Sweden", nameAr: "السويد", nameTr: "İsveç", emoji: "🇸🇪", phone_code: "46" },
  { code: "NO", name: "Norway", nameEn: "Norway", nameAr: "النرويج", nameTr: "Norveç", emoji: "🇳🇴", phone_code: "47" },
  { code: "DK", name: "Denmark", nameEn: "Denmark", nameAr: "الدنمارك", nameTr: "Danimarka", emoji: "🇩🇰", phone_code: "45" },
  { code: "AU", name: "Australia", nameEn: "Australia", nameAr: "أستراليا", nameTr: "Avustralya", emoji: "🇦🇺", phone_code: "61" },
  { code: "MY", name: "Malaysia", nameEn: "Malaysia", nameAr: "ماليزيا", nameTr: "Malezya", emoji: "🇲🇾", phone_code: "60" },
  { code: "ID", name: "Indonesia", nameEn: "Indonesia", nameAr: "إندونيسيا", nameTr: "Endonezya", emoji: "🇮🇩", phone_code: "62" },
  { code: "SG", name: "Singapore", nameEn: "Singapore", nameAr: "سنغافورة", nameTr: "Singapur", emoji: "🇸🇬", phone_code: "65" },
  { code: "PK", name: "Pakistan", nameEn: "Pakistan", nameAr: "باكستان", nameTr: "Pakistan", emoji: "🇵🇰", phone_code: "92" },
  { code: "IN", name: "India", nameEn: "India", nameAr: "الهند", nameTr: "Hindistan", emoji: "🇮🇳", phone_code: "91" },
  { code: "AZ", name: "Azerbaijan", nameEn: "Azerbaijan", nameAr: "أذربيجان", nameTr: "Azerbaycan", emoji: "🇦🇿", phone_code: "994" },
  { code: "UZ", name: "Uzbekistan", nameEn: "Uzbekistan", nameAr: "أوزبكستان", nameTr: "Özbekistan", emoji: "🇺🇿", phone_code: "998" },
  { code: "KZ", name: "Kazakhstan", nameEn: "Kazakhstan", nameAr: "كازاخستان", nameTr: "Kazakistan", emoji: "🇰🇿", phone_code: "7" },
  { code: "AF", name: "Afghanistan", nameEn: "Afghanistan", nameAr: "أفغانستان", nameTr: "Afganistan", emoji: "🇦🇫", phone_code: "93" },
  { code: "AL", name: "Albania", nameEn: "Albania", nameAr: "ألبانيا", nameTr: "Arnavutluk", emoji: "🇦🇱", phone_code: "355" },
  { code: "AD", name: "Andorra", nameEn: "Andorra", nameAr: "أندورا", nameTr: "Andorra", emoji: "🇦🇩", phone_code: "376" },
  { code: "BA", name: "Bosnia and Herzegovina", nameEn: "Bosnia and Herzegovina", nameAr: "البوسنة والهرسك", nameTr: "Bosna-Hersek", emoji: "🇧🇦", phone_code: "387" },
  { code: "CY", name: "Cyprus", nameEn: "Cyprus", nameAr: "قبرص", nameTr: "Kıbrıs", emoji: "🇨🇾", phone_code: "357" },
  { code: "GR", name: "Greece", nameEn: "Greece", nameAr: "اليونان", nameTr: "Yunanistan", emoji: "🇬🇷", phone_code: "30" },
  { code: "JP", name: "Japan", nameEn: "Japan", nameAr: "اليابان", nameTr: "Japonya", emoji: "🇯🇵", phone_code: "81" },
  { code: "KR", name: "South Korea", nameEn: "South Korea", nameAr: "كوريا الجنوبية", nameTr: "Güney Kore", emoji: "🇰🇷", phone_code: "82" },
  { code: "CN", name: "China", nameEn: "China", nameAr: "الصين", nameTr: "Çin", emoji: "🇨🇳", phone_code: "86" },
  { code: "AX", name: "Aland Islands", nameEn: "Aland Islands", nameAr: "جزر آلاند", nameTr: "Åland Adaları", emoji: "🇦🇽", phone_code: "358" },
  { code: "AS", name: "American Samoa", nameEn: "American Samoa", nameAr: "ساموا الأمريكية", nameTr: "Amerikan Samoası", emoji: "🇦🇸", phone_code: "1" },
  { code: "AO", name: "Angola", nameEn: "Angola", nameAr: "أنغولا", nameTr: "Angola", emoji: "🇦🇴", phone_code: "244" },
  { code: "AI", name: "Anguilla", nameEn: "Anguilla", nameAr: "أنغويلا", nameTr: "Anguilla", emoji: "🇦🇮", phone_code: "1" },
  { code: "AQ", name: "Antarctica", nameEn: "Antarctica", nameAr: "القارة القطبية الجنوبية", nameTr: "Antarktika", emoji: "🇦🇶", phone_code: "672" },
  { code: "BR", name: "Brazil", nameEn: "Brazil", nameAr: "البرازيل", nameTr: "Brezilya", emoji: "🇧🇷", phone_code: "55" },
];

export const PRIORITY_COUNTRY_CODES = [
  "SA",
  "AE",
  "KW",
  "QA",
  "BH",
  "OM",
  "TR",
  "EG",
  "JO",
  "LB",
];

export function getLocalizedCountryName(country: PhoneCountry, locale: string): string {
  if (locale === "ar") return country.nameAr || country.name;
  if (locale === "tr") return country.nameTr || country.name;
  return country.nameEn || country.name;
}

export function getOrderedCountriesForSelect(locale: string): PhoneCountry[] {
  const prioritySet = new Set(PRIORITY_COUNTRY_CODES);
  const priorityList: PhoneCountry[] = [];
  for (const code of PRIORITY_COUNTRY_CODES) {
    const found = PHONE_COUNTRIES.find((c) => c.code === code);
    if (found) priorityList.push(found);
  }
  const rest = PHONE_COUNTRIES.filter((c) => !prioritySet.has(c.code));
  rest.sort((a, b) => {
    const nameA = getLocalizedCountryName(a, locale);
    const nameB = getLocalizedCountryName(b, locale);
    return nameA.localeCompare(nameB, locale);
  });
  return [...priorityList, ...rest];
}

export function getOrderedCountriesForPhone(): PhoneCountry[] {
  return [...PHONE_COUNTRIES].sort((a, b) => a.nameEn.localeCompare(b.nameEn));
}

export function findCountryByPhoneCode(code?: string): PhoneCountry {
  if (!code) return DEFAULT_PHONE_COUNTRY;
  const clean = code.replace("+", "").trim();
  return (
    PHONE_COUNTRIES.find((c) => c.phone_code === clean) ||
    PHONE_COUNTRIES.find((c) => c.code.toLowerCase() === clean.toLowerCase()) ||
    DEFAULT_PHONE_COUNTRY
  );
}

export function findCountryByCodeOrName(identifier?: string): PhoneCountry | undefined {
  if (!identifier) return undefined;
  const clean = identifier.toLowerCase().trim();
  return (
    PHONE_COUNTRIES.find((c) => c.code.toLowerCase() === clean) ||
    PHONE_COUNTRIES.find((c) => c.nameEn.toLowerCase() === clean) ||
    PHONE_COUNTRIES.find((c) => c.nameAr.toLowerCase() === clean) ||
    PHONE_COUNTRIES.find((c) => c.nameTr.toLowerCase() === clean) ||
    PHONE_COUNTRIES.find((c) => c.name.toLowerCase() === clean)
  );
}
