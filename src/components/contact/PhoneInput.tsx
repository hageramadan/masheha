"use client";

import { useState, useEffect, useRef } from "react";
import ReactCountryFlag from "react-country-flag";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/src/ui/select";

interface PhoneInputProps {
  value: string;
  onChange: (phone: string, countryCode: string) => void;
  required?: boolean;
}

interface CountryCode {
  code: string;
  countryKey: string;
  countryCode: string;
  placeholder: string;
  example: string;
  pattern: RegExp;
  minLength: number;
  maxLength: number;
  startsWith: string[];
  startsWithoutZero?: string[];
  allowLeadingZero?: boolean;
  skipValidation?: boolean;
}

// ✅ بيانات الدول كاملة
const countryCodes: CountryCode[] = [
  // الدول العربية
  { 
    code: "+966", 
    countryKey: "السعودية",
    countryCode: "SA",
    placeholder: "0512345678",
    example: "0512345678",
    pattern: /^(05[0-9]{8})|(5[0-9]{8})$/,
    minLength: 9,
    maxLength: 10,
    startsWith: ["05"],
    startsWithoutZero: ["5"],
    allowLeadingZero: true,
    skipValidation: true
  },
  { 
    code: "+20", 
    countryKey: "مصر",
    countryCode: "EG",
    placeholder: "01234567890",
    example: "01234567890",
    pattern: /^(01[0125][0-9]{8})|(1[0125][0-9]{8})$/,
    minLength: 11,
    maxLength: 11,
    startsWith: ["010", "011", "012", "015"],
    startsWithoutZero: ["10", "11", "12", "15"],
    allowLeadingZero: true
  },
  { 
    code: "+971", 
    countryKey: "الإمارات",
    countryCode: "AE",
    placeholder: "0501234567",
    example: "0501234567",
    pattern: /^(05[0-9]{8})|(5[0-9]{8})$/,
    minLength: 9,
    maxLength: 9,
    startsWith: ["05"],
    startsWithoutZero: ["5"],
    allowLeadingZero: true
  },
  { 
    code: "+965", 
    countryKey: "الكويت",
    countryCode: "KW",
    placeholder: "51234567",
    example: "51234567",
    pattern: /^(5[0-9]{7})|(5[0-9]{7})$/,
    minLength: 8,
    maxLength: 8,
    startsWith: ["5"],
    startsWithoutZero: ["5"],
    allowLeadingZero: false
  },
  { 
    code: "+974", 
    countryKey: "قطر",
    countryCode: "QA",
    placeholder: "51234567",
    example: "51234567",
    pattern: /^(3[0-9]{7})|(5[0-9]{7})|(6[0-9]{7})|(7[0-9]{7})$/,
    minLength: 8,
    maxLength: 8,
    startsWith: ["3", "5", "6", "7"],
    startsWithoutZero: ["3", "5", "6", "7"],
    allowLeadingZero: false
  },
  { 
    code: "+973", 
    countryKey: "البحرين",
    countryCode: "BH",
    placeholder: "51234567",
    example: "51234567",
    pattern: /^(3[0-9]{7})|(6[0-9]{7})$/,
    minLength: 8,
    maxLength: 8,
    startsWith: ["3", "6"],
    startsWithoutZero: ["3", "6"],
    allowLeadingZero: false
  },
  { 
    code: "+968", 
    countryKey: "عمان",
    countryCode: "OM",
    placeholder: "91234567",
    example: "91234567",
    pattern: /^(9[0-9]{7})|(7[0-9]{7})$/,
    minLength: 8,
    maxLength: 8,
    startsWith: ["9", "7"],
    startsWithoutZero: ["9", "7"],
    allowLeadingZero: false
  },
  { 
    code: "+962", 
    countryKey: "الأردن",
    countryCode: "JO",
    placeholder: "791234567",
    example: "791234567",
    pattern: /^(7[0-9]{8})$/,
    minLength: 9,
    maxLength: 9,
    startsWith: ["7"],
    startsWithoutZero: ["7"],
    allowLeadingZero: false
  },
  { 
    code: "+961", 
    countryKey: "لبنان",
    countryCode: "LB",
    placeholder: "71234567",
    example: "71234567",
    pattern: /^(3[0-9]{7})|(7[0-9]{7})$/,
    minLength: 8,
    maxLength: 8,
    startsWith: ["3", "7"],
    startsWithoutZero: ["3", "7"],
    allowLeadingZero: false
  },
  { 
    code: "+964", 
    countryKey: "العراق",
    countryCode: "IQ",
    placeholder: "07701234567",
    example: "07701234567",
    pattern: /^(07[0-9]{9})|(7[0-9]{9})$/,
    minLength: 11,
    maxLength: 11,
    startsWith: ["07"],
    startsWithoutZero: ["7"],
    allowLeadingZero: true
  },
  { 
    code: "+963", 
    countryKey: "سوريا",
    countryCode: "SY",
    placeholder: "912345678",
    example: "912345678",
    pattern: /^(9[0-9]{8})|(9[0-9]{8})$/,
    minLength: 9,
    maxLength: 9,
    startsWith: ["9"],
    startsWithoutZero: ["9"],
    allowLeadingZero: false
  },
  { 
    code: "+967", 
    countryKey: "اليمن",
    countryCode: "YE",
    placeholder: "712345678",
    example: "712345678",
    pattern: /^(7[0-9]{8})|(7[0-9]{8})$/,
    minLength: 9,
    maxLength: 9,
    startsWith: ["7"],
    startsWithoutZero: ["7"],
    allowLeadingZero: false
  },
  { 
    code: "+970", 
    countryKey: "فلسطين",
    countryCode: "PS",
    placeholder: "591234567",
    example: "591234567",
    pattern: /^(5[0-9]{8})$/,
    minLength: 9,
    maxLength: 9,
    startsWith: ["5"],
    startsWithoutZero: ["5"],
    allowLeadingZero: false
  },
  { 
    code: "+212", 
    countryKey: "المغرب",
    countryCode: "MA",
    placeholder: "612345678",
    example: "612345678",
    pattern: /^(6[0-9]{8})|(7[0-9]{8})$/,
    minLength: 9,
    maxLength: 9,
    startsWith: ["6", "7"],
    startsWithoutZero: ["6", "7"],
    allowLeadingZero: false
  },
  { 
    code: "+213", 
    countryKey: "الجزائر",
    countryCode: "DZ",
    placeholder: "551234567",
    example: "551234567",
    pattern: /^(5[0-9]{8})|(6[0-9]{8})|(7[0-9]{8})$/,
    minLength: 9,
    maxLength: 9,
    startsWith: ["5", "6", "7"],
    startsWithoutZero: ["5", "6", "7"],
    allowLeadingZero: false
  },
  { 
    code: "+216", 
    countryKey: "تونس",
    countryCode: "TN",
    placeholder: "91234567",
    example: "91234567",
    pattern: /^(9[0-9]{7})|(2[0-9]{7})$/,
    minLength: 8,
    maxLength: 8,
    startsWith: ["9", "2"],
    startsWithoutZero: ["9", "2"],
    allowLeadingZero: false
  },
  { 
    code: "+218", 
    countryKey: "ليبيا",
    countryCode: "LY",
    placeholder: "912345678",
    example: "912345678",
    pattern: /^(9[0-9]{8})$/,
    minLength: 9,
    maxLength: 9,
    startsWith: ["9"],
    startsWithoutZero: ["9"],
    allowLeadingZero: false
  },
  { 
    code: "+249", 
    countryKey: "السودان",
    countryCode: "SD",
    placeholder: "912345678",
    example: "912345678",
    pattern: /^(9[0-9]{8})|(1[0-9]{8})$/,
    minLength: 9,
    maxLength: 9,
    startsWith: ["9", "1"],
    startsWithoutZero: ["9", "1"],
    allowLeadingZero: false
  },

  // الدول الأجنبية
  { 
    code: "+1", 
    countryKey: "الولايات المتحدة",
    countryCode: "US",
    placeholder: "5551234567",
    example: "5551234567",
    pattern: /^[0-9]{10}$/,
    minLength: 10,
    maxLength: 10,
    startsWith: ["2", "3", "4", "5", "6", "7", "8", "9"],
    startsWithoutZero: ["2", "3", "4", "5", "6", "7", "8", "9"],
    allowLeadingZero: false
  },
  { 
    code: "+44", 
    countryKey: "المملكة المتحدة",
    countryCode: "GB",
    placeholder: "7123456789",
    example: "7123456789",
    pattern: /^[0-9]{10}$/,
    minLength: 10,
    maxLength: 10,
    startsWith: ["7"],
    startsWithoutZero: ["7"],
    allowLeadingZero: false
  },
  { 
    code: "+33", 
    countryKey: "فرنسا",
    countryCode: "FR",
    placeholder: "612345678",
    example: "612345678",
    pattern: /^[0-9]{9}$/,
    minLength: 9,
    maxLength: 9,
    startsWith: ["6", "7"],
    startsWithoutZero: ["6", "7"],
    allowLeadingZero: false
  },
  { 
    code: "+49", 
    countryKey: "ألمانيا",
    countryCode: "DE",
    placeholder: "15123456789",
    example: "15123456789",
    pattern: /^[0-9]{10,11}$/,
    minLength: 10,
    maxLength: 11,
    startsWith: ["15", "16", "17"],
    startsWithoutZero: ["15", "16", "17"],
    allowLeadingZero: false
  },
  { 
    code: "+39", 
    countryKey: "إيطاليا",
    countryCode: "IT",
    placeholder: "3123456789",
    example: "3123456789",
    pattern: /^[0-9]{10}$/,
    minLength: 10,
    maxLength: 10,
    startsWith: ["3"],
    startsWithoutZero: ["3"],
    allowLeadingZero: false
  },
  { 
    code: "+34", 
    countryKey: "إسبانيا",
    countryCode: "ES",
    placeholder: "612345678",
    example: "612345678",
    pattern: /^[0-9]{9}$/,
    minLength: 9,
    maxLength: 9,
    startsWith: ["6", "7"],
    startsWithoutZero: ["6", "7"],
    allowLeadingZero: false
  },
  { 
    code: "+90", 
    countryKey: "تركيا",
    countryCode: "TR",
    placeholder: "5123456789",
    example: "5123456789",
    pattern: /^[0-9]{10}$/,
    minLength: 10,
    maxLength: 10,
    startsWith: ["5"],
    startsWithoutZero: ["5"],
    allowLeadingZero: false
  },
  { 
    code: "+91", 
    countryKey: "الهند",
    countryCode: "IN",
    placeholder: "9876543210",
    example: "9876543210",
    pattern: /^[6-9][0-9]{9}$/,
    minLength: 10,
    maxLength: 10,
    startsWith: ["6", "7", "8", "9"],
    startsWithoutZero: ["6", "7", "8", "9"],
    allowLeadingZero: false
  },
  { 
    code: "+86", 
    countryKey: "الصين",
    countryCode: "CN",
    placeholder: "13812345678",
    example: "13812345678",
    pattern: /^1[0-9]{10}$/,
    minLength: 11,
    maxLength: 11,
    startsWith: ["1"],
    startsWithoutZero: ["1"],
    allowLeadingZero: false
  },
  { 
    code: "+81", 
    countryKey: "اليابان",
    countryCode: "JP",
    placeholder: "9012345678",
    example: "9012345678",
    pattern: /^[0-9]{10}$/,
    minLength: 10,
    maxLength: 10,
    startsWith: ["70", "80", "90"],
    startsWithoutZero: ["70", "80", "90"],
    allowLeadingZero: false
  },
  { 
    code: "+82", 
    countryKey: "كوريا الجنوبية",
    countryCode: "KR",
    placeholder: "1012345678",
    example: "1012345678",
    pattern: /^[0-9]{10}$/,
    minLength: 10,
    maxLength: 10,
    startsWith: ["10"],
    startsWithoutZero: ["10"],
    allowLeadingZero: false
  },
  { 
    code: "+7", 
    countryKey: "روسيا",
    countryCode: "RU",
    placeholder: "9123456789",
    example: "9123456789",
    pattern: /^[0-9]{10}$/,
    minLength: 10,
    maxLength: 10,
    startsWith: ["9"],
    startsWithoutZero: ["9"],
    allowLeadingZero: false
  },
  { 
    code: "+55", 
    countryKey: "البرازيل",
    countryCode: "BR",
    placeholder: "11912345678",
    example: "11912345678",
    pattern: /^[0-9]{10,11}$/,
    minLength: 10,
    maxLength: 11,
    startsWith: ["11", "12", "13", "14", "15", "16", "17", "18", "19"],
    startsWithoutZero: ["11", "12", "13", "14", "15", "16", "17", "18", "19"],
    allowLeadingZero: false
  },
  { 
    code: "+52", 
    countryKey: "المكسيك",
    countryCode: "MX",
    placeholder: "5512345678",
    example: "5512345678",
    pattern: /^[0-9]{10}$/,
    minLength: 10,
    maxLength: 10,
    startsWith: ["55"],
    startsWithoutZero: ["55"],
    allowLeadingZero: false
  },
  { 
    code: "+61", 
    countryKey: "أستراليا",
    countryCode: "AU",
    placeholder: "412345678",
    example: "412345678",
    pattern: /^[0-9]{9}$/,
    minLength: 9,
    maxLength: 9,
    startsWith: ["4"],
    startsWithoutZero: ["4"],
    allowLeadingZero: false
  },
  { 
    code: "+64", 
    countryKey: "نيوزيلندا",
    countryCode: "NZ",
    placeholder: "212345678",
    example: "212345678",
    pattern: /^[0-9]{9}$/,
    minLength: 9,
    maxLength: 9,
    startsWith: ["2"],
    startsWithoutZero: ["2"],
    allowLeadingZero: false
  },
  { 
    code: "+27", 
    countryKey: "جنوب أفريقيا",
    countryCode: "ZA",
    placeholder: "812345678",
    example: "812345678",
    pattern: /^[0-9]{9}$/,
    minLength: 9,
    maxLength: 9,
    startsWith: ["6", "7", "8"],
    startsWithoutZero: ["6", "7", "8"],
    allowLeadingZero: false
  },
  { 
    code: "+234", 
    countryKey: "نيجيريا",
    countryCode: "NG",
    placeholder: "8012345678",
    example: "8012345678",
    pattern: /^[0-9]{10}$/,
    minLength: 10,
    maxLength: 10,
    startsWith: ["70", "80", "81", "90"],
    startsWithoutZero: ["70", "80", "81", "90"],
    allowLeadingZero: false
  },
  { 
    code: "+254", 
    countryKey: "كينيا",
    countryCode: "KE",
    placeholder: "712345678",
    example: "712345678",
    pattern: /^[0-9]{9}$/,
    minLength: 9,
    maxLength: 9,
    startsWith: ["7"],
    startsWithoutZero: ["7"],
    allowLeadingZero: false
  },
  { 
    code: "+92", 
    countryKey: "باكستان",
    countryCode: "PK",
    placeholder: "3123456789",
    example: "3123456789",
    pattern: /^[0-9]{10}$/,
    minLength: 10,
    maxLength: 10,
    startsWith: ["3"],
    startsWithoutZero: ["3"],
    allowLeadingZero: false
  },
  { 
    code: "+880", 
    countryKey: "بنغلاديش",
    countryCode: "BD",
    placeholder: "1712345678",
    example: "1712345678",
    pattern: /^[0-9]{10}$/,
    minLength: 10,
    maxLength: 10,
    startsWith: ["17"],
    startsWithoutZero: ["17"],
    allowLeadingZero: false
  },
  { 
    code: "+62", 
    countryKey: "إندونيسيا",
    countryCode: "ID",
    placeholder: "8123456789",
    example: "8123456789",
    pattern: /^[0-9]{10,11}$/,
    minLength: 10,
    maxLength: 11,
    startsWith: ["8"],
    startsWithoutZero: ["8"],
    allowLeadingZero: false
  },
  { 
    code: "+63", 
    countryKey: "الفلبين",
    countryCode: "PH",
    placeholder: "9123456789",
    example: "9123456789",
    pattern: /^[0-9]{10}$/,
    minLength: 10,
    maxLength: 10,
    startsWith: ["9"],
    startsWithoutZero: ["9"],
    allowLeadingZero: false
  },
  { 
    code: "+84", 
    countryKey: "فيتنام",
    countryCode: "VN",
    placeholder: "912345678",
    example: "912345678",
    pattern: /^[0-9]{9}$/,
    minLength: 9,
    maxLength: 9,
    startsWith: ["9"],
    startsWithoutZero: ["9"],
    allowLeadingZero: false
  },
  { 
    code: "+66", 
    countryKey: "تايلاند",
    countryCode: "TH",
    placeholder: "812345678",
    example: "812345678",
    pattern: /^[0-9]{9}$/,
    minLength: 9,
    maxLength: 9,
    startsWith: ["8"],
    startsWithoutZero: ["8"],
    allowLeadingZero: false
  },
  { 
    code: "+60", 
    countryKey: "ماليزيا",
    countryCode: "MY",
    placeholder: "123456789",
    example: "123456789",
    pattern: /^[0-9]{9}$/,
    minLength: 9,
    maxLength: 9,
    startsWith: ["1"],
    startsWithoutZero: ["1"],
    allowLeadingZero: false
  },
  { 
    code: "+65", 
    countryKey: "سنغافورة",
    countryCode: "SG",
    placeholder: "81234567",
    example: "81234567",
    pattern: /^[0-9]{8}$/,
    minLength: 8,
    maxLength: 8,
    startsWith: ["8", "9"],
    startsWithoutZero: ["8", "9"],
    allowLeadingZero: false
  },
  { 
    code: "+852", 
    countryKey: "هونغ كونغ",
    countryCode: "HK",
    placeholder: "51234567",
    example: "51234567",
    pattern: /^[0-9]{8}$/,
    minLength: 8,
    maxLength: 8,
    startsWith: ["5", "6", "9"],
    startsWithoutZero: ["5", "6", "9"],
    allowLeadingZero: false
  },
  { 
    code: "+886", 
    countryKey: "تايوان",
    countryCode: "TW",
    placeholder: "912345678",
    example: "912345678",
    pattern: /^[0-9]{9}$/,
    minLength: 9,
    maxLength: 9,
    startsWith: ["9"],
    startsWithoutZero: ["9"],
    allowLeadingZero: false
  },
];

// دالة للحصول على اسم الدولة
const getCountryName = (country: CountryCode): string => {
  return country.countryKey;
};

// دالة مساعدة لتنسيق رسالة الخطأ
const getErrorMessage = (
  country: CountryCode, 
  type: 'prefix' | 'pattern' | 'length'
): string => {
  const countryName = getCountryName(country);
  const prefixList = country.startsWith.join(" أو ");
  
  switch (type) {
    case 'prefix':
      return `رقم الهاتف يجب أن يبدأ بـ ${prefixList} في ${countryName}`;
    case 'pattern':
      return `رقم الهاتف غير صحيح، مثال: ${country.example}`;
    case 'length':
      return `رقم الهاتف يجب أن يتكون من ${country.minLength} أرقام، مثال: ${country.example}`;
    default:
      return 'رقم الهاتف غير صحيح';
  }
};

export default function PhoneInput({ value, onChange, required = false }: PhoneInputProps) {
  const [selectedCountry, setSelectedCountry] = useState<CountryCode>(countryCodes[0]);
  const [error, setError] = useState("");
  const [localPhoneNumber, setLocalPhoneNumber] = useState("");
  const [isTouched, setIsTouched] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // استخراج كود الدولة والرقم من القيمة الأولية
  useEffect(() => {
    if (value) {
      let matchedCountry: CountryCode | undefined;
      let phoneNumber = value;
      
      for (const country of countryCodes) {
        if (value.startsWith(country.code)) {
          matchedCountry = country;
          phoneNumber = value.replace(country.code, "");
          break;
        }
      }
      
      if (matchedCountry) {
        setSelectedCountry(matchedCountry);
        const cleanNumber = phoneNumber.replace(/[\s\-]/g, "");
        setLocalPhoneNumber(cleanNumber);
      } else if (value) {
        const cleanNumber = value.replace(/[\s\-]/g, "");
        setLocalPhoneNumber(cleanNumber);
      }
    }
  }, [value]);

  // التحقق من الرقم حسب الدولة
  const validatePhoneNumber = (phoneNumber: string, country: CountryCode): boolean => {
    if (country.skipValidation) {
      setError("");
      return true;
    }

    if (!phoneNumber && required) {
      setError('رقم الهاتف مطلوب');
      return false;
    }
    
    if (!phoneNumber) {
      setError("");
      return false;
    }
    
    const cleanNumber = phoneNumber.replace(/[\s\-]/g, "");
    
    if (!/^\d+$/.test(cleanNumber)) {
      setError('يجب أن يحتوي على أرقام فقط');
      return false;
    }

    let isValidPrefix = false;
    const allPrefixes = [...(country.startsWith || []), ...(country.startsWithoutZero || [])];
    isValidPrefix = allPrefixes.some(prefix => cleanNumber.startsWith(prefix));
    
    if (!isValidPrefix) {
      setError(getErrorMessage(country, 'prefix'));
      return false;
    }

    const isValidLength = cleanNumber.length === country.minLength || 
                         cleanNumber.length === country.minLength - 1;
    
    if (!isValidLength) {
      setError(getErrorMessage(country, 'length'));
      return false;
    }

    const patternValid = country.pattern.test(cleanNumber);
    
    if (!patternValid) {
      setError(getErrorMessage(country, 'pattern'));
      return false;
    }
    
    setError("");
    return true;
  };

  const handleCountrySelect = (countryCode: string | null) => {
    if (!countryCode) return;
    const country = countryCodes.find(c => c.code === countryCode);
    if (country) {
      setSelectedCountry(country);
      setError("");
      setIsTouched(true);
      
      if (localPhoneNumber) {
        const isValid = validatePhoneNumber(localPhoneNumber, country);
        onChange(localPhoneNumber, country.code);
      } else {
        onChange("", country.code);
      }
    }
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const numbersOnly = rawValue.replace(/[^\d]/g, "");
    
    if (rawValue !== numbersOnly) {
      if (inputRef.current) {
        inputRef.current.value = numbersOnly;
      }
    }
    
    setLocalPhoneNumber(numbersOnly);
    setIsTouched(true);
    validatePhoneNumber(numbersOnly, selectedCountry);
    onChange(numbersOnly, selectedCountry.code);
  };

  const handleBlur = () => {
    setIsTouched(true);
    if (localPhoneNumber) {
      validatePhoneNumber(localPhoneNumber, selectedCountry);
    } else if (required) {
      setError('رقم الهاتف مطلوب');
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData('text');
    const numbersOnly = pastedText.replace(/[^\d]/g, '');
    
    if (numbersOnly) {
      setLocalPhoneNumber(numbersOnly);
      setIsTouched(true);
      validatePhoneNumber(numbersOnly, selectedCountry);
      onChange(numbersOnly, selectedCountry.code);
      
      if (inputRef.current) {
        inputRef.current.value = numbersOnly;
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const controlKeys = [
      'Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight', 
      'ArrowUp', 'ArrowDown', 'Home', 'End', 'Enter'
    ];
    
    if (controlKeys.includes(e.key)) {
      return;
    }
    
    if (!/^[0-9]$/.test(e.key)) {
      e.preventDefault();
    }
  };

  const shouldShowSuccess = () => {
    if (selectedCountry.skipValidation) return false;
    return !error && localPhoneNumber && 
           (localPhoneNumber.length === selectedCountry.minLength || 
            localPhoneNumber.length === selectedCountry.minLength - 1);
  };

  const shouldShowHelper = () => {
    if (selectedCountry.skipValidation) return false;
    return !error && localPhoneNumber && 
           localPhoneNumber.length < selectedCountry.minLength - 1 && 
           localPhoneNumber.length > 0;
  };

  return (
    <div className="w-full">
      <div>
        <div className="relative flex flex-row-reverse items-stretch" dir="ltr">
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="tel"
              value={localPhoneNumber}
              onChange={handleNumberChange}
              onBlur={handleBlur}
              onPaste={handlePaste}
              onKeyDown={handleKeyDown}
              required={required}
              placeholder={selectedCountry.placeholder}
              inputMode="numeric"
              pattern="[0-9]*"
              autoComplete="tel"
              className={`w-full px-4 h-12 border rounded-r-xl rounded-l-none focus:outline-none  transition bg-white text-left font-mono text-base
                ${error && isTouched && localPhoneNumber && !selectedCountry.skipValidation
                  ? "border-red-500 focus:border-red-500 focus:ring-red-500" 
                  : !error && localPhoneNumber && !selectedCountry.skipValidation && 
                    (localPhoneNumber.length === selectedCountry.minLength || 
                     localPhoneNumber.length === selectedCountry.minLength - 1)
                  ? "border-green-500 focus:border-green-500 focus:ring-green-500"
                  : "border-gray-200 focus:border-[#1A834B] focus:ring-[#1A834B]"
                }`}
              style={{
                borderTopLeftRadius: 0,
                borderBottomLeftRadius: 0,
              }}
              dir="ltr"
            />
          </div>
          
          <div className="relative">
            <Select value={selectedCountry.code} onValueChange={handleCountrySelect}>
              <SelectTrigger 
                className="!h-12 bg-white border-gray-200 rounded-l-xl rounded-r-none border-r-0 focus:ring-0 focus:border-gray-200 min-w-[110px]"
                style={{ 
                  borderTopRightRadius: 0, 
                  borderBottomRightRadius: 0,
                  boxShadow: 'none'
                }}
              >
                <div className="flex items-center gap-2">
                  <ReactCountryFlag
                    countryCode={selectedCountry.countryCode}
                    svg
                    style={{
                      width: '24px',
                      height: '16px',
                      objectFit: 'cover'
                    }}
                    title={getCountryName(selectedCountry)}
                  />
                  <span className="text-sm font-medium text-gray-700">{selectedCountry.code}</span>
                </div>
              </SelectTrigger>
              <SelectContent 
                align="center" 
                side="bottom" 
                sideOffset={4}
                className="min-w-48 max-h-96"
              >
                {countryCodes.map((country) => (
                  <SelectItem key={country.code} value={country.code}>
                    <div className="flex items-center gap-3 py-1">
                      <ReactCountryFlag
                        countryCode={country.countryCode}
                        svg
                        style={{
                          width: '28px',
                          height: '20px',
                          objectFit: 'cover'
                        }}
                        title={getCountryName(country)}
                      />
                      <div className="flex flex-col items-start">
                        <span className="text-sm font-semibold text-gray-800">
                          {getCountryName(country)}
                        </span>
                        <div className="flex gap-2 text-xs text-gray-500">
                          <span>{country.code}</span>
                          <span>•</span>
                          <span>{country.minLength} أرقام</span>
                        </div>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {error && isTouched && !selectedCountry.skipValidation && (
          <p className="text-red-500 text-sm mt-1">
            ⚠ {error}
          </p>
        )}
        
        {shouldShowSuccess() && (
          <p className="text-green-600 text-sm mt-1">
            ✓ رقم هاتف صحيح
          </p>
        )}
        
        {shouldShowHelper() && (
          <p className="text-blue-500 text-xs mt-1">
            📝 تم إدخال {localPhoneNumber.length} من {selectedCountry.minLength} أرقام
          </p>
        )}
      </div>
    </div>
  );
}