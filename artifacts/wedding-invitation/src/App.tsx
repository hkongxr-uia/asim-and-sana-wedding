import { useEffect, useRef, useState, useCallback, Suspense, lazy } from 'react';
import { Route, Switch, useParams } from 'wouter';
import {
  ArrowDown,
  ArrowLeft,
  ArrowUpRight,
  CalendarDays,
  Clock3,
  MapPin,
  Phone,
  Play,
  Sparkles,
  Star,
  Volume2,
  VolumeX,
  RefreshCw,
} from 'lucide-react';
import bismillahAudio from '@assets/0_bismillah_1792636329790.mp3';
import introVideoWebm from '@assets/0_intro_1792477792582.webm';
import introVideoMp4 from '@assets/0_intro_1792477792582.mp4';
// Optimised WebP poster (540×960, ~57 KiB vs original 228 KiB JPEG).
// Original JPEG (0_intro_1792477792582-poster.jpg) is preserved in attached_assets for rollback.
import introPoster from '@assets/0_intro_1792477792582-poster-opt.webp';
import weddingMusic from '@assets/0_wedding-music_1792636335449.mp3';
import { supabase } from '@/lib/supabase';
import NotFound from '@/pages/not-found';

const AdminDashboard = lazy(() => import('@/pages/AdminDashboard'));

const baraatMap =
  'https://www.google.com/maps/place/Ahmad+Marriage+Hall/@31.6609563,74.2814482,17z/data=!3m1!4b1!4m6!3m5!1s0x39191f5123d53f13:0xfa85db4f4b865520!8m2!3d31.6609563!4d74.2814482!16s%2Fg%2F11pdrb8n42?entry=tts&g_ep=EgoyMDI2MDkxNi4wIPu8ASoASAFQAw%3D%3D&skid=99144b77-a619-4786-be4b-6d2ec67fc079';
const walimaMap =
  'https://google.com/maps/place/Bhatti+Marriage+Hall/@31.6518502,74.2809667,17z/data=!3m1!4b1!4m6!3m5!1s0x39191e99388f08cf:0x253df6cddb41eafd!8m2!3d31.6518502!4d74.2835416!16s%2Fg%2F11b7q8j71n?entry=tts&g_ep=EgoyMDI2MDkwMi4wIPu8ASoASAFQAw%3D%3D&skid=306e2a1e-078b-4f70-ac33-77cbcc48c012';
const rsvpUrl =
  'https://docs.google.com/forms/d/e/1FAIpQLSd-Grwo1IswhqHV7aUuLnQL2YEsvdHROZ14lOiK3tAh6MrhYw/viewform?usp=header';

const contacts = ['0310-4942561', '0306-4100759', '0313-4811013'];

type Language = 'en' | 'ur';

interface GuestEvent {
  guest_name: string;
  seats_reserved: number;
  event_id: string;
  event_name: string;
  event_date: string;
  event_time: string;
  venue_name: string;
  map_link: string;
  description: string;
  sort_order: number;
}

interface WeddingDetails {
  id?: string;
  groom_name?: string;
  bride_name?: string;
  invitation_text?: string;
  rsvp_deadline?: string;
  contact_phone?: string;
}

const copy = {
  en: {
    openingLabel: 'Opening film',
    introInstruction: 'A moment made for you',
    enjoyFilm: 'Enjoy the film',
    videoUnavailable: 'The film could not be played. You can still open the invitation.',
    tryFilmAgain: 'Try the film again',
    tapToBegin: 'Tap to begin',
    skipToInvitation: 'Skip to invitation',
    openInvitation: 'Open invitation',
    navigation: 'Invitation navigation',
    cover: 'Cover',
    events: 'Events',
    venues: 'Venues',
    rsvp: 'RSVP',
    switchToUrdu: 'Switch language to Urdu',
    switchToEnglish: 'Switch language to English',
    languageButtonUrdu: 'اردو',
    languageButtonEnglish: 'English',
    muteMusic: 'Mute background music',
    unmuteMusic: 'Unmute background music',
    enableAudio: 'Enable invitation audio',
    tapToPlayBismillah: 'Tap to play Bismillah',
    audioNeedsTap: 'Tap the sound button to start the invitation audio.',
    invitationCopy:
      'Together with their families, we warmly invite you to celebrate our Big moment. Your presence, love, and prayers mean the world to us as we begin this blessed new journey together.',
    quranQuote:
      '“And among His signs is that He created for you mates from among yourselves, that you may find tranquility in them; and He placed between you affection and mercy.”',
    quranReference: '— Surah Ar-Rum (30:21)',
    revealDates: 'Click to Reveal Wedding Dates',
    revealHint: 'Tap to unveil the celebrations.',
    saveDates: 'Save the auspicious dates',
    countdownDays: 'Days',
    countdownHours: 'Hours',
    countdownMinutes: 'Minutes',
    countdownSeconds: 'Seconds',
    eventSection: 'Wedding celebrations',
    eventSchedule: 'Event Schedule',
    onTime: 'Kindly make sure to be on time to share every moment with us.',
    functionTiming: 'Function Timing:',
    venueEyebrow: 'Venues & directions',
    eventLocations: 'Event Locations',
    mapDirections: 'Tap the map buttons below to easily open live GPS directions to the celebration venues:',
    addCalendar: 'Add to Calendar',
    dressCode: 'Dress code',
    attire: 'Formal Traditional or Evening Wear',
    dressCodeNote: 'We warmly look forward to celebrating together in festive formal attire.',
    presenceNote: 'Your presence would complete our happiness',
    confirmAttendance: 'Confirm Your Attendance (RSVP)',
    rsvpDeadline: 'Kindly respond before November 1, 2026',
    contactEyebrow: 'For queries & RSVP contact',
    contactTitle: 'Contact Information',
    contactsAria: 'Family contact numbers',
    footerGratitude: '#ASIMANDSANA2026 · WITH WARM GRATITUDE',
    skipLink: 'Invitation details',
    countdownScreenReader: 'Countdown calculated to event start time (PKT, UTC+05:00).',
    warmlyWelcoming: 'Warmly Welcoming',
    reservedSeats: 'Reserved Seats',
    invitationUnavailableTitle: 'Invitation Unavailable',
    invitationUnavailableMsg: 'This invitation is unavailable. Please contact the hosts.',
    connectionErrorTitle: 'Connection Error',
    connectionErrorMsg: 'Unable to connect to the invitation service. Please check your connection and try again.',
    tryAgain: 'Try Again',
    loadingInvitation: 'Preparing your invitation...',
    personalInviteNotice: 'Celebration dates, schedules, and venue directions are prepared individually on personal invitation links.',
    countdownToPrefix: 'Counting down to the',
    celebrations: 'Celebrations',
  },
  ur: {
    openingLabel: 'ابتدائی فلم',
    introInstruction: 'آپ کے لیے ایک خاص لمحہ',
    enjoyFilm: 'فلم دیکھیے',
    videoUnavailable: 'فلم نہیں چل سکی۔ آپ پھر بھی دعوت نامہ کھول سکتے ہیں۔',
    tryFilmAgain: 'فلم دوبارہ چلائیں',
    tapToBegin: 'شروع کرنے کے لیے ٹیپ کریں',
    skipToInvitation: 'دعوت نامے پر جائیں',
    openInvitation: 'دعوت نامہ کھولیں',
    navigation: 'دعوت نامے کی رہنمائی',
    cover: 'سرورق',
    events: 'تقریبات',
    venues: 'مقامات',
    rsvp: 'جواب دیں',
    switchToUrdu: 'زبان اردو میں تبدیل کریں',
    switchToEnglish: 'زبان انگریزی میں تبدیل کریں',
    languageButtonUrdu: 'اردو',
    languageButtonEnglish: 'English',
    muteMusic: 'موسیقی بند کریں',
    unmuteMusic: 'موسیقی چلائیں',
    enableAudio: 'دعوت کی آڈیو چلائیں',
    tapToPlayBismillah: 'بسم اللہ سننے کے لیے ٹیپ کریں',
    audioNeedsTap: 'دعوت کی آڈیو چلانے کے لیے آواز کے بٹن کو دبائیں۔',
    invitationCopy:
      'اپنے اہلِ خانہ کے ساتھ، ہم آپ کو اپنی خوشی کے اس خاص موقع پر شرکت کی دعوت دیتے ہیں۔ آپ کی موجودگی، محبت اور دعائیں ہمارے لیے بہت قیمتی ہیں، کیونکہ ہم اپنی اس بابرکت نئی زندگی کا آغاز کر رہے ہیں۔',
    quranQuote:
      'اور اُس کی نشانیوں میں سے یہ ہے کہ اُس نے تمہارے لیے تم ہی میں سے جوڑے بنائے تاکہ تم اُن سے سکون پاؤ، اور اُس نے تمہارے درمیان محبت اور رحمت رکھ دی۔',
    quranReference: '— سورۃ الروم (۳۰:۲۱)',
    revealDates: 'شادی کی تاریخیں دیکھیں',
    revealHint: 'تقریبات کی تاریخیں جاننے کے لیے ٹیپ کریں۔',
    saveDates: 'تقریبات کی مبارک تاریخیں',
    countdownDays: 'دن',
    countdownHours: 'گھنٹے',
    countdownMinutes: 'منٹ',
    countdownSeconds: 'سیکنڈ',
    eventSection: 'شادی کی تقریبات',
    eventSchedule: 'تقریبات کا شیڈول',
    onTime: 'ہر لمحہ ہمارے ساتھ گزارنے کے لیے بروقت تشریف لائیں۔',
    functionTiming: 'تقریب کا وقت:',
    venueEyebrow: 'مقامات اور رہنمائی',
    eventLocations: 'تقریبات کے مقامات',
    mapDirections: 'تقریبات کے مقامات تک راستہ دیکھنے کے لیے نیچے دیے گئے نقشے کے بٹن دبائیں:',
    addCalendar: 'کیلنڈر میں شامل کریں',
    dressCode: 'لباس کا انتخاب',
    attire: 'روایتی رسمی یا شام کا لباس',
    dressCodeNote: 'ہمیں خوشی ہوگی کہ آپ اس پُرمسرت موقع پر رسمی لباس میں ہمارے ساتھ شریک ہوں۔',
    presenceNote: 'آپ کی شرکت ہماری خوشیوں کو مکمل کرے گی',
    confirmAttendance: 'اپنی شرکت کی تصدیق کریں (RSVP)',
    rsvpDeadline: 'براہِ کرم یکم نومبر ۲۰۲۶ سے پہلے جواب دیں۔',
    contactEyebrow: 'سوالات اور RSVP کے لیے رابطہ',
    contactTitle: 'رابطے کی معلومات',
    contactsAria: 'اہلِ خانہ کے رابطہ نمبر',
    footerGratitude: '#عاصم_اور_ثناء_۲۰۲۶ · دلی شکریے کے ساتھ',
    skipLink: 'دعوت نامے کی تفصیلات',
    countdownScreenReader: 'بارات کی الٹی گنتی پاکستان کے معیاری وقت کے مطابق ہے۔',
    warmlyWelcoming: 'معزز مہمان',
    reservedSeats: 'مختص نشستیں',
    invitationUnavailableTitle: 'دعوت نامہ دستیاب نہیں ہے',
    invitationUnavailableMsg: 'یہ دعوت نامہ فی الوقت دستیاب نہیں ہے۔ برائے مہربانی میزبانوں سے رابطہ کریں۔',
    connectionErrorTitle: 'رابطے میں دشواری',
    connectionErrorMsg: 'دعوت نامہ لوڈ کرنے میں دشواری پیش آئی ہے۔ برائے مہربانی انٹرنیٹ چیک کر کے دوبارہ کوشش کریں۔',
    tryAgain: 'دوبارہ کوشش کریں',
    loadingInvitation: 'دعوت نامہ تیار کیا جا رہا ہے...',
    personalInviteNotice: 'تقریبات کے شیڈول، اوقات اور لوکیشن کے لیے برائے مہربانی اپنا مخصوص دعوتی لنک دیکھیں۔',
    countdownToPrefix: 'الٹی گنتی برائے',
    celebrations: 'شادی کی تقریبات',
  },
} satisfies Record<Language, Record<string, string>>;

function localizeDigits(value: string | number, language: Language) {
  if (language === 'en') return String(value);
  return String(value).replace(/\d/g, (digit) => '۰۱۲۳۴۵۶۷۸۹'[Number(digit)]);
}

export interface EventTimings {
  functionTime: string; // Function Timing: e.g. "7:00 PM" (Baraat), "7:30 PM" (Walima)
  subTime1: string;     // Ceremony Time (Nikkah), Baraat Arrival, Guest Welcome (Walima)
  subTime2: string;     // Dua & Refreshments (Nikkah), Dinner
  subTime3: string;     // Rukhsati (Baraat)
}

export function parseEventTimings(rawTime?: string, eventName: string = ''): EventTimings {
  const lower = eventName.toLowerCase();
  const isNikkah = lower.includes('nikkah');
  const isBaraat = lower.includes('barat') || lower.includes('baraat');
  const isWalima = lower.includes('walima');

  const defaults: EventTimings = {
    functionTime: isBaraat ? '07:00 PM' : isWalima ? '07:30 PM' : '05:00 PM',
    subTime1: isNikkah ? '05:00 PM' : '06:00 PM',
    subTime2: isNikkah ? '06:30 PM' : '08:30 PM',
    subTime3: isBaraat ? '09:30 PM' : '',
  };

  if (!rawTime || !rawTime.trim()) return defaults;

  // 1. JSON format
  if (rawTime.trim().startsWith('{')) {
    try {
      const p = JSON.parse(rawTime.trim());
      return {
        functionTime: p.functionTime || p.function || defaults.functionTime,
        subTime1: p.subTime1 || p.arrival || p.welcome || p.ceremony || defaults.subTime1,
        subTime2: p.subTime2 || p.dinner || p.dua || defaults.subTime2,
        subTime3: p.subTime3 || p.rukhsati || defaults.subTime3,
      };
    } catch {}
  }

  // 2. Multiple times in string
  const matches = rawTime.match(/\d{1,2}:\d{2}\s*(?:AM|PM|am|pm)?/g);
  if (matches && matches.length > 0) {
    if (isNikkah) {
      return {
        ...defaults,
        functionTime: matches[0] || defaults.functionTime,
        subTime1: matches[0] || defaults.subTime1,
        subTime2: matches[1] || defaults.subTime2,
      };
    }
    return {
      functionTime: matches[0] || defaults.functionTime,
      subTime1: matches[1] || defaults.subTime1,
      subTime2: matches[2] || defaults.subTime2,
      subTime3: matches[3] || defaults.subTime3,
    };
  }

  return {
    ...defaults,
    functionTime: rawTime.trim() || defaults.functionTime,
  };
}

function parseEventDateTime(dateStr?: string, timeStr?: string, eventName: string = ''): number | null {
  if (!dateStr) return null;
  const parts = dateStr.split('-');
  if (parts.length < 3) return null;
  const y = parseInt(parts[0], 10);
  const m = parseInt(parts[1], 10) - 1;
  const d = parseInt(parts[2], 10);

  const timings = parseEventTimings(timeStr, eventName);
  const effectiveTime = timings.functionTime || timeStr || '18:00';

  let hour = 18; // default 6 PM (13:00 UTC)
  let minute = 0;
  if (effectiveTime) {
    const isPM = /pm/i.test(effectiveTime);
    const isAM = /am/i.test(effectiveTime);
    const match = effectiveTime.match(/(\d+)(?::(\d+))?/);
    if (match) {
      hour = parseInt(match[1], 10);
      minute = match[2] ? parseInt(match[2], 10) : 0;
      if (isPM && hour < 12) hour += 12;
      if (isAM && hour === 12) hour = 0;
    }
  }

  // Pakistan Standard Time is UTC+5 -> UTC hour = hour - 5
  return Date.UTC(y, m, d, hour - 5, minute, 0);
}

function formatEventDate(dateStr?: string, language: Language = 'en') {
  if (!dateStr) return { day: '', month: '', year: '', dayOfWeek: '' };
  const parts = dateStr.split('-');
  if (parts.length < 3) return { day: '', month: '', year: '', dayOfWeek: '' };
  const y = parseInt(parts[0], 10);
  const m = parseInt(parts[1], 10) - 1;
  const d = parseInt(parts[2], 10);
  const dateObj = new Date(Date.UTC(y, m, d));
  const dayIndex = dateObj.getUTCDay();

  const daysEn = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const daysUr = ['اتوار', 'پیر', 'منگل', 'بدھ', 'جمعرات', 'جمعہ', 'ہفتہ'];

  const monthsEn = [
    'November',
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  const monthsUr = [
    'نومبر',
    'جنوری',
    'فروری',
    'مارچ',
    'اپریل',
    'مئی',
    'جون',
    'جولائی',
    'اگست',
    'ستمبر',
    'اکتوبر',
    'نومبر',
    'دسمبر',
  ];

  const dayOfWeek = language === 'ur' ? daysUr[dayIndex] : daysEn[dayIndex];
  const month = language === 'ur' ? monthsUr[m + 1] : monthsEn[m + 1];
  const day = language === 'ur' ? localizeDigits(d, 'ur') : String(d);
  const year = language === 'ur' ? localizeDigits(y, 'ur') : String(y);

  return { day, month, year, dayOfWeek };
}

function calculateCountdown(events: GuestEvent[]) {
  let targetTimestamp: number | null = null;
  let targetName = '';

  if (events && events.length > 0) {
    const now = Date.now();
    for (const evt of events) {
      const ts = parseEventDateTime(evt.event_date, evt.event_time);
      if (ts !== null && ts > now) {
        targetTimestamp = ts;
        targetName = evt.event_name;
        break;
      }
    }
    if (!targetTimestamp) {
      targetTimestamp = parseEventDateTime(events[0].event_date, events[0].event_time);
      targetName = events[0].event_name;
    }
  }

  // Fallback to default Baraat date if no events
  if (!targetTimestamp) {
    targetTimestamp = Date.UTC(2026, 10, 20, 13, 0, 0); // 20 Nov 2026 6 PM PKT
    targetName = '';
  }

  const remaining = Math.max(0, targetTimestamp - Date.now());
  return {
    targetName,
    remaining: {
      days: Math.floor(remaining / 86_400_000),
      hours: Math.floor((remaining % 86_400_000) / 3_600_000),
      minutes: Math.floor((remaining % 3_600_000) / 60_000),
      seconds: Math.floor((remaining % 60_000) / 1_000),
    },
  };
}

function StarPointer() {
  const enabled = useRef(false);
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const finePointer = window.matchMedia('(pointer: fine)').matches;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    enabled.current = finePointer && !reduceMotion;
    if (!enabled.current) return;
    let lastTrail = 0;
    const move = (event: globalThis.PointerEvent) => {
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${event.clientX - 9}px, ${event.clientY - 9}px)`;
      }
      const now = performance.now();
      if (now - lastTrail < 32) return;
      lastTrail = now;
      const dot = document.createElement('span');
      dot.className = 'star-trail';
      dot.style.left = `${event.clientX}px`;
      dot.style.top = `${event.clientY}px`;
      document.body.appendChild(dot);
      window.setTimeout(() => dot.remove(), 1_500);
    };
    window.addEventListener('pointermove', move);
    return () => window.removeEventListener('pointermove', move);
  }, []);

  if (typeof window !== 'undefined' && !window.matchMedia('(pointer: fine)').matches) return null;
  return (
    <div className="star-cursor" ref={cursorRef} aria-hidden="true">
      <Star size={17} fill="currentColor" strokeWidth={1.4} />
    </div>
  );
}

function FireworksOverlay() {
  const rays = Array.from({ length: 8 }, (_, index) => index + 1);
  return (
    <div className="fireworks-overlay" aria-hidden="true" data-testid="animation-date-fireworks">
      {[1, 2, 3, 4, 5].map((burst) => (
        <span className={`firework-burst firework-burst-${burst}`} key={burst}>
          {rays.map((ray) => (
            <i className={`firework-ray firework-ray-${ray}`} key={ray} />
          ))}
        </span>
      ))}
    </div>
  );
}

function getOrdinal(n: number): string {
  if (isNaN(n)) return '';
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

function makeCalendarFile(events: GuestEvent[], language: Language, details?: WeddingDetails) {
  if (!events || events.length === 0) return;

  const icsLines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Wedding Invitation//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
  ];

  const groomShort = details?.groom_name ? details.groom_name.trim().split(' ')[0] : 'Asim';
  const brideShort = details?.bride_name ? details.bride_name.trim().split(' ')[0] : 'Sana';

  events.forEach((evt) => {
    const startIso = parseEventDateTime(evt.event_date, evt.event_time);
    if (!startIso) return;
    const startDate = new Date(startIso);
    const endDate = new Date(startIso + 3.5 * 3600 * 1000); // 3.5 hours duration

    const fmtUtc = (d: Date) =>
      d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z?/, 'Z');

    icsLines.push(
      'BEGIN:VEVENT',
      `UID:${evt.event_id || Math.random()}@wedding.local`,
      `DTSTAMP:${fmtUtc(new Date())}`,
      `DTSTART:${fmtUtc(startDate)}`,
      `DTEND:${fmtUtc(endDate)}`,
      `SUMMARY:${evt.event_name} \u2014 ${groomShort} & ${brideShort}`,
      `LOCATION:${(evt.venue_name || '').replace(/,/g, '\\,')}`,
      `DESCRIPTION:${(evt.description || evt.event_name).replace(/,/g, '\\,')}`,
      'END:VEVENT',
    );
  });

  icsLines.push('END:VCALENDAR');
  const icsContent = icsLines.join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'wedding-invitation.ics';
  a.click();
  URL.revokeObjectURL(url);
}

/* ==========================================================================
   PAGE STATE SCREENS (Loading, Unavailable, Error)
   ========================================================================== */

function InviteLoadingScreen({ language }: { language: Language }) {
  const t = copy[language];
  return (
    <div className="invite-state-screen" data-testid="status-loading">
      <div className="invite-state-card">
        <div className="invite-spinner" />
        <p className="font-serif text-lg tracking-wide text-amber-100">
          {t.loadingInvitation}
        </p>
      </div>
    </div>
  );
}

function InviteUnavailableScreen({
  language,
  contactNumbers,
}: {
  language: Language;
  contactNumbers: string[];
}) {
  const t = copy[language];
  return (
    <div className="invite-state-screen" data-testid="status-unavailable">
      <div className="invite-state-card">
        <Sparkles className="w-10 h-10 text-amber-300 mx-auto mb-3 opacity-80" />
        <h2 className="text-2xl font-serif text-amber-100 mb-3 font-semibold">
          {t.invitationUnavailableTitle}
        </h2>
        <p className="text-amber-200/90 text-sm mb-6 leading-relaxed">
          {t.invitationUnavailableMsg}
        </p>
        <div className="border-t border-amber-400/20 pt-4">
          <p className="text-xs text-amber-300/70 mb-2 uppercase tracking-widest">
            {t.contactTitle}
          </p>
          <div className="flex flex-col gap-2">
            {contactNumbers.map((num) => (
              <a
                key={num}
                href={`tel:${num.replaceAll('-', '')}`}
                className="text-amber-200 hover:text-amber-100 text-sm font-mono underline decoration-amber-400/40"
              >
                {num}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function InviteErrorScreen({
  language,
  onRetry,
}: {
  language: Language;
  onRetry: () => void;
}) {
  const t = copy[language];
  return (
    <div className="invite-state-screen" data-testid="status-error">
      <div className="invite-state-card">
        <h2 className="text-xl font-serif text-amber-100 mb-2 font-semibold">
          {t.connectionErrorTitle}
        </h2>
        <p className="text-amber-200/80 text-sm mb-5 leading-relaxed">
          {t.connectionErrorMsg}
        </p>
        <button
          onClick={onRetry}
          className="gold-button px-6 py-2.5 text-sm inline-flex items-center gap-2 mx-auto cursor-pointer"
          data-testid="button-retry"
        >
          <RefreshCw size={14} />
          {t.tryAgain}
        </button>
      </div>
    </div>
  );
}

/* ==========================================================================
   MAIN INVITATION COMPONENT (Handles both personalized /invite/:token and /)
   ========================================================================== */

function WeddingInvitation({ token }: { token?: string }) {
  const [pageStatus, setPageStatus] = useState<'loading' | 'success' | 'unavailable' | 'error'>('loading');
  const [events, setEvents] = useState<GuestEvent[]>([]);
  const [guestName, setGuestName] = useState<string | null>(null);
  const [seatsReserved, setSeatsReserved] = useState<number | null>(null);
  const [weddingDetails, setWeddingDetails] = useState<WeddingDetails | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const bismillahAudioRef = useRef<HTMLAudioElement>(null);
  const musicAudioRef = useRef<HTMLAudioElement>(null);
  const fireworksTimerRef = useRef<number | null>(null);
  const musicFadeFrameRef = useRef<number | null>(null);
  const musicDelayTimerRef = useRef<number | null>(null);
  const audioGenerationRef = useRef(0);
  const audioSequenceStartedRef = useRef(false);
  const pendingAudioStageRef = useRef<'bismillah' | 'music'>('bismillah');
  const musicMutedRef = useRef(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const mediaElementSourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const videoPlaybackLoopRef = useRef<number | null>(null);
  const videoFadeStartedRef = useRef(false);
  const videoFadeCompletedRef = useRef(false);
  const bismillahStartedRef = useRef(false);

  const [bismillahNeedsTap, setBismillahNeedsTap] = useState(false);

  const [invitationOpen, setInvitationOpen] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [playbackFailed, setPlaybackFailed] = useState(false);
  const [datesRevealed, setDatesRevealed] = useState(false);
  const [fireworksActive, setFireworksActive] = useState(false);
  const [revealBtnReady, setRevealBtnReady] = useState(false);
  const [language, setLanguage] = useState<Language>('en');
  const [musicMuted, setMusicMuted] = useState(false);
  const [audioNeedsGesture, setAudioNeedsGesture] = useState(false);

  const t = copy[language];

  // Fetch wedding details and invitation data
  const fetchData = useCallback(async () => {
    setPageStatus('loading');
    try {
      if (token) {
        // Personalised invite route: fetch wedding_details and guest events in parallel.
        // The two requests are independent — wedding_details does not depend on the guest token.
        // Both run concurrently; we wait for both before updating any state so the invitation
        // never briefly shows unassigned events or stale couple names.
        const [detailsResult, guestResult] = await Promise.all([
          supabase.from('wedding_details').select('*').limit(1).maybeSingle(),
          supabase.rpc('get_guest_by_token', { lookup_token: token }),
        ]);

        if (detailsResult.data) {
          setWeddingDetails(detailsResult.data);
        }

        if (guestResult.error) {
          setPageStatus('error');
          return;
        }

        if (!guestResult.data || guestResult.data.length === 0) {
          setPageStatus('unavailable');
          return;
        }

        const sortedEvents = [...guestResult.data].sort(
          (a: GuestEvent, b: GuestEvent) => a.sort_order - b.sort_order,
        );

        setGuestName(guestResult.data[0].guest_name);
        setSeatsReserved(guestResult.data[0].seats_reserved);
        setEvents(sortedEvents);
        setPageStatus('success');
      } else {
        // Public homepage: only wedding_details needed (no guest token).
        const { data: detailsData } = await supabase
          .from('wedding_details')
          .select('*')
          .limit(1)
          .maybeSingle();

        if (detailsData) {
          setWeddingDetails(detailsData);
        }

        setGuestName(null);
        setSeatsReserved(null);
        setEvents([]);
        setPageStatus('success');
      }
    } catch {
      setPageStatus('error');
    }
  }, [token]);

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  // Countdown timer calculations
  const [countdownData, setCountdownData] = useState(() => calculateCountdown(events));

  useEffect(() => {
    setCountdownData(calculateCountdown(events));
    const timer = window.setInterval(() => {
      setCountdownData(calculateCountdown(events));
    }, 1000);

    return () => {
      window.clearInterval(timer);
      if (fireworksTimerRef.current !== null) window.clearTimeout(fireworksTimerRef.current);
      if (musicFadeFrameRef.current !== null) window.cancelAnimationFrame(musicFadeFrameRef.current);
      if (musicDelayTimerRef.current !== null) window.clearTimeout(musicDelayTimerRef.current);
      if (videoPlaybackLoopRef.current !== null) window.cancelAnimationFrame(videoPlaybackLoopRef.current);
      audioGenerationRef.current += 1;
      bismillahAudioRef.current?.pause();
      musicAudioRef.current?.pause();
    };
  }, [events]);

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ur' ? 'rtl' : 'ltr';
  }, [language]);

  useEffect(() => {
    if (!invitationOpen || datesRevealed) return;
    const timer = window.setTimeout(() => setRevealBtnReady(true), 120);
    return () => window.clearTimeout(timer);
  }, [invitationOpen, datesRevealed]);

  function revealWeddingDates() {
    setDatesRevealed(true);
    setFireworksActive(true);
    if (fireworksTimerRef.current !== null) window.clearTimeout(fireworksTimerRef.current);
    fireworksTimerRef.current = window.setTimeout(() => {
      setFireworksActive(false);
      fireworksTimerRef.current = null;
    }, 3000);
  }

  function fadeInMusic(audio: HTMLAudioElement) {
    if (musicFadeFrameRef.current !== null) window.cancelAnimationFrame(musicFadeFrameRef.current);
    const startedAt = performance.now();
    const duration = 3000;
    const targetVolume = 0.18;
    audio.volume = 0;
    const step = (now: number) => {
      const progress = Math.min(1, Math.max(0, (now - startedAt) / duration));
      audio.volume = Math.min(1, Math.max(0, targetVolume * progress));
      if (progress < 1) {
        musicFadeFrameRef.current = window.requestAnimationFrame(step);
      } else {
        musicFadeFrameRef.current = null;
      }
    };
    musicFadeFrameRef.current = window.requestAnimationFrame(step);
  }

  async function playAudioStage(stage: 'bismillah' | 'music') {
    pendingAudioStageRef.current = stage;
    const generation = audioGenerationRef.current;
    const audio = stage === 'bismillah' ? bismillahAudioRef.current : musicAudioRef.current;
    if (!audio) {
      setAudioNeedsGesture(true);
      if (stage === 'bismillah') setBismillahNeedsTap(true);
      return;
    }

    if (musicFadeFrameRef.current !== null) {
      window.cancelAnimationFrame(musicFadeFrameRef.current);
      musicFadeFrameRef.current = null;
    }
    audio.pause();
    audio.currentTime = 0;
    if (stage === 'bismillah') {
      audio.loop = false;
      audio.muted = musicMutedRef.current;
      audio.volume = 0.65;
    } else {
      audio.loop = true;
      audio.muted = musicMutedRef.current;
      audio.volume = 0;
    }

    try {
      await audio.play();
      if (generation !== audioGenerationRef.current) {
        audio.pause();
        return;
      }
      setAudioNeedsGesture(false);
      setBismillahNeedsTap(false);
      if (stage === 'music') fadeInMusic(audio);
    } catch {
      if (generation === audioGenerationRef.current) {
        setAudioNeedsGesture(true);
        if (stage === 'bismillah') setBismillahNeedsTap(true);
      }
    }
  }

  function startAudioSequence() {
    if (audioSequenceStartedRef.current) return;
    audioSequenceStartedRef.current = true;
    bismillahStartedRef.current = true;
    pendingAudioStageRef.current = 'bismillah';
    audioGenerationRef.current += 1;
    void playAudioStage('bismillah');
  }

  function toggleMusic() {
    if (audioNeedsGesture || bismillahNeedsTap) {
      if (pendingAudioStageRef.current === 'music') {
        musicMutedRef.current = false;
        setMusicMuted(false);
        if (musicAudioRef.current) musicAudioRef.current.muted = false;
      } else if (pendingAudioStageRef.current === 'bismillah') {
        musicMutedRef.current = false;
        setMusicMuted(false);
        if (bismillahAudioRef.current) bismillahAudioRef.current.muted = false;
      }
      setBismillahNeedsTap(false);
      void playAudioStage(pendingAudioStageRef.current);
      return;
    }

    const nextMuted = !musicMutedRef.current;
    musicMutedRef.current = nextMuted;
    setMusicMuted(nextMuted);
    if (bismillahAudioRef.current) {
      bismillahAudioRef.current.muted = nextMuted;
    }
    if (musicAudioRef.current) {
      musicAudioRef.current.muted = nextMuted;
      if (!nextMuted && pendingAudioStageRef.current === 'music') {
        fadeInMusic(musicAudioRef.current);
      }
    }
    if (videoRef.current && !videoFadeCompletedRef.current) {
      videoRef.current.muted = nextMuted;
      if (gainNodeRef.current && audioCtxRef.current) {
        try {
          gainNodeRef.current.gain.setValueAtTime(nextMuted ? 0 : 1, audioCtxRef.current.currentTime);
        } catch {}
      }
    }
  }

  function stopAudioSequence() {
    audioGenerationRef.current += 1;
    audioSequenceStartedRef.current = false;
    bismillahStartedRef.current = false;
    pendingAudioStageRef.current = 'bismillah';
    setAudioNeedsGesture(false);
    setBismillahNeedsTap(false);
    stopFadeMonitoring();
    if (musicDelayTimerRef.current !== null) {
      window.clearTimeout(musicDelayTimerRef.current);
      musicDelayTimerRef.current = null;
    }
    if (musicFadeFrameRef.current !== null) {
      window.cancelAnimationFrame(musicFadeFrameRef.current);
      musicFadeFrameRef.current = null;
    }
    bismillahAudioRef.current?.pause();
    musicAudioRef.current?.pause();
  }

  const updateVideoFade = useCallback((ct: number) => {
    if (videoFadeCompletedRef.current) return;
    const video = videoRef.current;
    if (!video) return;

    if (ct >= 2.0) {
      if (!videoFadeStartedRef.current) {
        videoFadeStartedRef.current = true;
      }
      // Linear volume fade over 1.0 second from 2.0s to 3.0s of actual video playback
      const progress = Math.min(1, Math.max(0, (ct - 2.0) / 1.0));
      const targetVolume = musicMutedRef.current ? 0 : Math.max(0, 1 - progress);

      if (gainNodeRef.current && audioCtxRef.current) {
        try {
          gainNodeRef.current.gain.setValueAtTime(targetVolume, audioCtxRef.current.currentTime);
        } catch {}
      }

      try {
        video.volume = targetVolume;
      } catch {}

      if (progress >= 1) {
        videoFadeCompletedRef.current = true;
        video.muted = true;
        if (gainNodeRef.current && audioCtxRef.current) {
          try {
            gainNodeRef.current.gain.setValueAtTime(0, audioCtxRef.current.currentTime);
          } catch {}
        }
        // Immediately after the fade completes, play the existing Bismillah audio once
        startAudioSequence();
      }
    }
  }, []);

  const checkVideoProgress = useCallback(() => {
    const video = videoRef.current;
    if (!video || video.paused || video.ended) return;

    updateVideoFade(video.currentTime);

    if (!videoFadeCompletedRef.current) {
      videoPlaybackLoopRef.current = window.requestAnimationFrame(checkVideoProgress);
    }
  }, [updateVideoFade]);

  const startFadeMonitoring = useCallback(() => {
    if (videoPlaybackLoopRef.current !== null) {
      window.cancelAnimationFrame(videoPlaybackLoopRef.current);
      videoPlaybackLoopRef.current = null;
    }
    if (!videoFadeCompletedRef.current) {
      videoPlaybackLoopRef.current = window.requestAnimationFrame(checkVideoProgress);
    }
  }, [checkVideoProgress]);

  const stopFadeMonitoring = useCallback(() => {
    if (videoPlaybackLoopRef.current !== null) {
      window.cancelAnimationFrame(videoPlaybackLoopRef.current);
      videoPlaybackLoopRef.current = null;
    }
  }, []);

  async function startFilm() {
    setPlaybackFailed(false);
    const video = videoRef.current;
    if (!video) return setPlaybackFailed(true);

    // Initialise or resume Web Audio routing on user gesture
    try {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass && !audioCtxRef.current) {
        const ctx = new AudioContextClass();
        audioCtxRef.current = ctx;
        if (!mediaElementSourceRef.current && video) {
          const src = ctx.createMediaElementSource(video);
          const gain = ctx.createGain();
          src.connect(gain);
          gain.connect(ctx.destination);
          mediaElementSourceRef.current = src;
          gainNodeRef.current = gain;
        }
      }
    } catch (e) {
      console.warn('Web Audio routing unavailable, falling back to media element volume/mute', e);
    }

    if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume().catch(() => {});
    }

    if ('audioSession' in navigator) {
      try {
        (navigator as unknown as { audioSession: { type: string } }).audioSession.type = 'playback';
      } catch {}
    }

    // Reset fade and sequence state for fresh film playback
    videoFadeStartedRef.current = false;
    videoFadeCompletedRef.current = false;
    bismillahStartedRef.current = false;
    setBismillahNeedsTap(false);

    video.muted = musicMutedRef.current;
    try {
      video.volume = musicMutedRef.current ? 0 : 1;
    } catch {}
    if (gainNodeRef.current && audioCtxRef.current) {
      try {
        gainNodeRef.current.gain.cancelScheduledValues(audioCtxRef.current.currentTime);
        gainNodeRef.current.gain.setValueAtTime(musicMutedRef.current ? 0 : 1, audioCtxRef.current.currentTime);
      } catch {}
    }

    try {
      await video.play();
      setPlaying(true);
      // Preload bismillah audio so buffer is ready by the 3-second mark
      bismillahAudioRef.current?.load();
      startFadeMonitoring();
    } catch {
      setPlaybackFailed(true);
      setPlaying(false);
    }
  }

  function openInvitation() {
    stopFadeMonitoring();
    const video = videoRef.current;
    if (video && !video.ended) video.pause();
    setPlaying(false);
    setInvitationOpen(true);

    // If intro is skipped before sequence completes, cancel pending video sequence
    // and use the single consistent Bismillah playback path.
    if (!audioSequenceStartedRef.current) {
      videoFadeCompletedRef.current = true;
      if (video) video.muted = true;
      startAudioSequence();
    }
  }

  function returnToCover() {
    stopFadeMonitoring();
    stopAudioSequence();
    const video = videoRef.current;
    if (video) {
      video.pause();
      video.currentTime = 0;
      video.muted = musicMutedRef.current;
      try {
        video.volume = musicMutedRef.current ? 0 : 1;
      } catch {}
    }
    if (gainNodeRef.current && audioCtxRef.current) {
      try {
        gainNodeRef.current.gain.cancelScheduledValues(audioCtxRef.current.currentTime);
        gainNodeRef.current.gain.setValueAtTime(musicMutedRef.current ? 0 : 1, audioCtxRef.current.currentTime);
      } catch {}
    }
    videoFadeStartedRef.current = false;
    videoFadeCompletedRef.current = false;
    bismillahStartedRef.current = false;
    setBismillahNeedsTap(false);
    setPlaying(false);
    setPlaybackFailed(false);
    setInvitationOpen(false);
    window.scrollTo({
      top: 0,
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
    });
  }

  // Active contact numbers list
  const activeContacts = weddingDetails?.contact_phone
    ? [weddingDetails.contact_phone, ...contacts.filter((c) => c !== weddingDetails.contact_phone)]
    : contacts;

  // Handle Page States
  if (pageStatus === 'loading') {
    return <InviteLoadingScreen language={language} />;
  }

  if (pageStatus === 'unavailable') {
    return <InviteUnavailableScreen language={language} contactNumbers={activeContacts} />;
  }

  if (pageStatus === 'error') {
    return <InviteErrorScreen language={language} onRetry={fetchData} />;
  }

  const groomDisplayName =
    weddingDetails?.groom_name || (language === 'ur' ? 'عاصم عبد الغفور' : 'Asim Abdul Ghafoor');
  const brideDisplayName =
    weddingDetails?.bride_name || (language === 'ur' ? 'ثناء عبد الخالق' : 'Sana Abdul Khaliq');

  const countdownTargetLabel = countdownData.targetName
    ? (language === 'ur'
        ? `${countdownData.targetName} ${t.countdownToPrefix}`
        : `${t.countdownToPrefix} ${countdownData.targetName}`)
    : (language === 'ur'
        ? `${t.celebrations} ${t.countdownToPrefix}`
        : `${t.countdownToPrefix} ${t.celebrations}`);

  return (
    <main
      className="invitation-page"
      lang={language}
      dir={language === 'ur' ? 'rtl' : 'ltr'}
      data-testid="page-wedding-invitation"
    >
      <audio
        ref={bismillahAudioRef}
        src={bismillahAudio}
        preload="none"
        aria-hidden="true"
        onEnded={() => {
          if (musicDelayTimerRef.current !== null) window.clearTimeout(musicDelayTimerRef.current);
          musicDelayTimerRef.current = window.setTimeout(() => {
            void playAudioStage('music');
            musicDelayTimerRef.current = null;
          }, 3000);
        }}
        onError={() => setAudioNeedsGesture(true)}
        data-testid="audio-bismillah"
      />
      <audio
        ref={musicAudioRef}
        src={weddingMusic}
        preload="none"
        loop
        muted={musicMuted}
        aria-hidden="true"
        onError={() => setAudioNeedsGesture(true)}
        data-testid="audio-background-music"
      />

      <section
        className={`intro-screen${invitationOpen ? ' is-opening' : ''}`}
        aria-label={t.openingLabel}
        aria-hidden={invitationOpen}
        data-testid="section-opening-film"
      >
        <video
          ref={videoRef}
          className="intro-video"
          poster={introPoster}
          playsInline
          preload="none"
          aria-label={t.openingLabel}
          data-testid="video-opening-film"
          onClick={startFilm}
          onEnded={() => {
            stopFadeMonitoring();
            openInvitation();
            setPlaying(false);
          }}
          onError={() => {
            stopFadeMonitoring();
            setPlaybackFailed(true);
          }}
          onPlay={() => {
            setPlaying(true);
            startFadeMonitoring();
          }}
          onPause={() => {
            stopFadeMonitoring();
          }}
          onTimeUpdate={(e) => {
            updateVideoFade((e.currentTarget as HTMLVideoElement).currentTime);
          }}
        >
          <source src={introVideoWebm} type="video/webm" />
          <source src={introVideoMp4} type="video/mp4" />
        </video>
        <div className="intro-vignette" />
        <div className="intro-sparkles" aria-hidden="true" />
        <div className="intro-controls">
          {playbackFailed && (
            <p className="intro-instruction" role="status" data-testid="status-video-unavailable">
              {t.videoUnavailable}
            </p>
          )}
          {!playing && !playbackFailed && <p className="intro-instruction">{t.introInstruction}</p>}
          {playing && <p className="intro-instruction">{t.enjoyFilm}</p>}
          {!playing && (
            <button className="intro-play" type="button" onClick={startFilm} data-testid="button-play-film">
              <Play size={15} fill="currentColor" />
              {playbackFailed ? t.tryFilmAgain : t.tapToBegin}
            </button>
          )}
          {bismillahNeedsTap && (
            <button
              className="intro-bismillah-btn"
              type="button"
              onClick={() => {
                setBismillahNeedsTap(false);
                void playAudioStage('bismillah');
              }}
              data-testid="button-play-bismillah"
            >
              <Volume2 size={15} />
              {t.tapToPlayBismillah}
            </button>
          )}
          <button type="button" className="intro-skip" onClick={openInvitation} data-testid="button-skip-film">
            {playing ? t.skipToInvitation : t.openInvitation}
          </button>
        </div>
      </section>

      <div className="page-shell">
        <nav className="site-nav" aria-label={t.navigation} data-testid="navigation-main">
          <button className="nav-cover" onClick={returnToCover} type="button" data-testid="button-return-to-cover">
            <ArrowLeft size={14} /> <span>{t.cover}</span>
          </button>
          <a href="#events" data-testid="link-nav-events">
            {t.events}
          </a>
          <a href="#venues" data-testid="link-nav-venues">
            {t.venues}
          </a>
          <button
            className="nav-language"
            type="button"
            onClick={() => setLanguage((current) => (current === 'en' ? 'ur' : 'en'))}
            aria-label={language === 'en' ? t.switchToUrdu : t.switchToEnglish}
            data-testid="button-language-toggle"
          >
            {language === 'en' ? t.languageButtonUrdu : t.languageButtonEnglish}
          </button>
          <button
            className="nav-audio"
            type="button"
            onClick={toggleMusic}
            aria-label={audioNeedsGesture ? t.enableAudio : musicMuted ? t.unmuteMusic : t.muteMusic}
            aria-pressed={musicMuted}
            title={audioNeedsGesture ? t.enableAudio : musicMuted ? t.unmuteMusic : t.muteMusic}
            data-testid="button-audio-toggle"
          >
            {musicMuted && !audioNeedsGesture ? (
              <VolumeX size={13} aria-hidden="true" />
            ) : (
              <Volume2 size={13} aria-hidden="true" />
            )}
          </button>
          <a className="nav-rsvp" href={rsvpUrl} target="_blank" rel="noreferrer" data-testid="link-nav-rsvp">
            {t.rsvp}
          </a>
        </nav>
        {(audioNeedsGesture || bismillahNeedsTap) && (
          <p className="audio-hint" role="status" aria-live="polite">
            <button
              type="button"
              className="underline hover:text-amber-100 cursor-pointer"
              onClick={() => {
                setBismillahNeedsTap(false);
                void playAudioStage(pendingAudioStageRef.current);
              }}
            >
              {pendingAudioStageRef.current === 'bismillah' ? t.tapToPlayBismillah : t.audioNeedsTap}
            </button>
          </p>
        )}

        <article className="invitation-card" data-testid="card-main-invitation">
          <div className="medallion medallion-top" aria-hidden="true" />
          <div className="medallion medallion-bottom" aria-hidden="true" />
          <header className="invitation-header">
            <p className="bismillah" lang="ar" dir="rtl" data-testid="text-bismillah">
              بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
            </p>
            <div className="foil-rule" aria-hidden="true">
              <span />
            </div>
            <h1 className="couple-names" id="couple-title" data-testid="text-couple-names">
              <span>{groomDisplayName}</span>
              <span className="ampersand">{language === 'ur' ? 'اور' : '&'}</span>
              <span>{brideDisplayName}</span>
            </h1>

            {/* Personalized Guest Display Name */}
            {guestName && (
              <div className="guest-display-container" data-testid="banner-guest-welcome">
                <div className="foil-rule guest-foil-rule" aria-hidden="true">
                  <span />
                </div>
                <h2 className="guest-display-name" data-testid="text-guest-name">
                  {guestName}
                </h2>
                <div className="foil-rule guest-foil-rule" aria-hidden="true">
                  <span />
                </div>
              </div>
            )}

            <p className="invitation-copy">
              {weddingDetails?.invitation_text &&
              weddingDetails.invitation_text !== 'We warmly invite you to celebrate our wedding with us.'
                ? weddingDetails.invitation_text
                : t.invitationCopy}
            </p>
            <blockquote className="verse-quote" dir="auto" data-testid="text-quran-translation">
              {language === 'en' && '“'}
              {t.quranQuote}
              {language === 'en' && '”'}
              <cite data-testid="text-quran-reference">{t.quranReference}</cite>
            </blockquote>
          </header>

          <section
            className={`dates-reveal${datesRevealed ? ' is-revealed' : ''}`}
            aria-label={t.revealDates}
            data-testid="section-date-reveal"
          >
            {fireworksActive && <FireworksOverlay />}
            {!datesRevealed ? (
              <div className={`reveal-intro${revealBtnReady ? ' reveal-ready' : ''}`}>
                <button
                  className="gold-button reveal-button"
                  type="button"
                  onClick={revealWeddingDates}
                  aria-controls="revealed-date-cards"
                  data-testid="button-reveal-dates"
                >
                  <Sparkles size={14} /> {t.revealDates}
                </button>
                <p className="reveal-hint">{t.revealHint}</p>
              </div>
            ) : (
              <div
                className="revealed-dates"
                id="revealed-date-cards"
                aria-live="polite"
                data-testid="status-dates-revealed"
              >
                <p className="eyebrow">{t.saveDates}</p>
                {events.length > 0 ? (
                  <div className="revealed-grid">
                    {events.map((evt) => {
                      const { day, month, year, dayOfWeek } = formatEventDate(evt.event_date, language);
                      const lower = evt.event_name.toLowerCase();
                      const isNikkah = lower.includes('nikkah');
                      const isBaraat = lower.includes('barat') || lower.includes('baraat');
                      const isWalima = lower.includes('walima');

                      const displayTitle = isNikkah
                        ? (language === 'ur' ? 'نکاح' : 'The Nikkah')
                        : isBaraat
                        ? (language === 'ur' ? 'بارات' : 'The Baraat')
                        : isWalima
                        ? (language === 'ur' ? 'ولیمہ' : 'The Walima')
                        : evt.event_name;

                      const timings = parseEventTimings(evt.event_time, evt.event_name);
                      const displayTime = isNikkah ? timings.subTime1 : timings.functionTime;
                      const cardTime = language === 'ur'
                        ? localizeDigits(displayTime, 'ur')
                        : displayTime;

                      return (
                        <article
                          className="revealed-date"
                          key={evt.event_id}
                          data-testid={`date-card-${evt.event_id}`}
                        >
                          <span>{displayTitle}</span>
                          <strong>{day}</strong>
                          <small>{`${month} ${year}`}</small>
                          <p>{`${dayOfWeek} · ${cardTime}`}</p>
                        </article>
                      );
                    })}
                  </div>
                ) : (
                  <div className="invite-notice-box">
                    <p>{t.personalInviteNotice}</p>
                  </div>
                )}
              </div>
            )}
          </section>

          <section className="countdown-section" aria-label={countdownTargetLabel} data-testid="section-countdown">
            <p className="eyebrow">{countdownTargetLabel}</p>
            <div className="countdown-clock" aria-label={countdownTargetLabel}>
              {[
                { key: 'days', label: t.countdownDays, value: countdownData.remaining.days },
                { key: 'hours', label: t.countdownHours, value: countdownData.remaining.hours },
                { key: 'minutes', label: t.countdownMinutes, value: countdownData.remaining.minutes },
                { key: 'seconds', label: t.countdownSeconds, value: countdownData.remaining.seconds },
              ].map(({ key, label, value }) => (
                <div className="countdown-unit" key={key} data-testid={`countdown-${key}`}>
                  <strong>{String(value).padStart(2, '0')}</strong>
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="events-section" id="events" aria-labelledby="events-title" data-testid="section-events">
            <div className="section-heading">
              <p className="eyebrow">{t.eventSection}</p>
              <h2 id="events-title">{t.eventSchedule}</h2>
              <p className="on-time-note">
                <Clock3 size={14} /> {t.onTime}
              </p>
            </div>
            {events.length > 0 ? (
              <div className="event-grid">
                {events.map((evt, idx) => {
                  const { dayOfWeek, day, month, year } = formatEventDate(evt.event_date, language);
                  const dayNumber = language === 'ur' ? localizeDigits(idx + 1, 'ur') : `0${idx + 1}`;
                  const lower = evt.event_name.toLowerCase();
                  const isNikkah = lower.includes('nikkah');
                  const isBaraat = lower.includes('barat') || lower.includes('baraat');
                  const isWalima = lower.includes('walima');

                  const displayTitle = isNikkah
                    ? (language === 'ur' ? 'نکاح' : 'The Nikkah')
                    : isBaraat
                    ? (language === 'ur' ? 'بارات' : 'The Baraat')
                    : isWalima
                    ? (language === 'ur' ? 'ولیمہ' : 'The Walima')
                    : evt.event_name;

                  const displayDesc = isNikkah
                    ? (language === 'ur'
                        ? 'خاندان اور قریبی پیاروں کی موجودگی میں ہمارے رشتے کو بابرکت بنانے والا مقدس اسلامی نکاح۔'
                        : 'The sacred Islamic marriage contract solemnizing our union in the presence of family and close loved ones.')
                    : isBaraat
                    ? (language === 'ur'
                        ? 'بارات کے پرشکوہ جلوس، استقبالیہ عشائیہ اور رخصتی کے جذباتی لمحات میں ہماری خوشیوں کا حصہ بنیں۔'
                        : 'Join us for the vibrant Baraat procession, grand reception dinner, and emotional Rukhsati farewell.')
                    : isWalima
                    ? (language === 'ur'
                        ? 'دولہے کے اہلِ خانہ کی جانب سے خوشی اور برکت بانٹنے کے لیے ایک پُرمسرت استقبالیہ عشائیہ۔'
                        : "A joyful reception dinner hosted by the groom's family to share blessings, happiness, and delicious food with loved ones.")
                    : evt.description;

                  const timings = parseEventTimings(evt.event_time, evt.event_name);
                  const ordinalDay = language === 'ur' ? day : getOrdinal(parseInt(day, 10));

                  return (
                    <article className="event-card" key={evt.event_id} data-testid={`event-card-${idx + 1}`}>
                      <div className="event-card-head">
                        <span>{language === 'ur' ? `دن ${dayNumber}` : `Day ${dayNumber}`}</span>
                        <span>{dayOfWeek}</span>
                      </div>
                      <h3>{displayTitle}</h3>
                      {displayDesc && <p className="event-description">{displayDesc}</p>}
                      <div className="event-times">
                        {isNikkah && (
                          <>
                            <p>
                              <span>{language === 'ur' ? 'تاریخ:' : 'Date:'}</span>
                              <strong>
                                {language === 'ur'
                                  ? `${day} ${month} ${year}`
                                  : `${ordinalDay} ${month} ${year}`}
                              </strong>
                            </p>
                            <p>
                              <span>{language === 'ur' ? 'تقریب کا وقت:' : 'Ceremony Time:'}</span>
                              <strong>{language === 'ur' ? localizeDigits(timings.subTime1, 'ur') : timings.subTime1}</strong>
                            </p>
                            <p>
                              <span>{language === 'ur' ? 'دعا اور تواضع:' : 'Dua & Refreshments:'}</span>
                              <strong>{language === 'ur' ? localizeDigits(timings.subTime2, 'ur') : timings.subTime2}</strong>
                            </p>
                          </>
                        )}
                        {isBaraat && (
                          <>
                            <p>
                              <span>{language === 'ur' ? 'تقریب کا وقت:' : 'Function Timing:'}</span>
                              <strong>{language === 'ur' ? localizeDigits(timings.functionTime, 'ur') : timings.functionTime}</strong>
                            </p>
                            <p>
                              <span>{language === 'ur' ? 'بارات کی آمد:' : 'Baraat Arrival:'}</span>
                              <strong>{language === 'ur' ? localizeDigits(timings.subTime1, 'ur') : timings.subTime1}</strong>
                            </p>
                            <p>
                              <span>{language === 'ur' ? 'عشائیہ:' : 'Dinner:'}</span>
                              <strong>{language === 'ur' ? localizeDigits(timings.subTime2, 'ur') : timings.subTime2}</strong>
                            </p>
                            {timings.subTime3 && (
                              <p>
                                <span>{language === 'ur' ? 'رخصتی:' : 'Rukhsati:'}</span>
                                <strong>{language === 'ur' ? localizeDigits(timings.subTime3, 'ur') : timings.subTime3}</strong>
                              </p>
                            )}
                          </>
                        )}
                        {isWalima && (
                          <>
                            <p>
                              <span>{language === 'ur' ? 'تقریب کا وقت:' : 'Function Timing:'}</span>
                              <strong>{language === 'ur' ? localizeDigits(timings.functionTime, 'ur') : timings.functionTime}</strong>
                            </p>
                            <p>
                              <span>{language === 'ur' ? 'مہمانوں کا استقبال:' : 'Guest Welcome:'}</span>
                              <strong>{language === 'ur' ? localizeDigits(timings.subTime1, 'ur') : timings.subTime1}</strong>
                            </p>
                            <p>
                              <span>{language === 'ur' ? 'عشائیہ:' : 'Dinner:'}</span>
                              <strong>{language === 'ur' ? localizeDigits(timings.subTime2, 'ur') : timings.subTime2}</strong>
                            </p>
                          </>
                        )}
                        {!isNikkah && !isBaraat && !isWalima && (
                          <>
                            <p>
                              <span>{t.functionTiming}</span>
                              <strong>{timings.functionTime}</strong>
                            </p>
                            {evt.venue_name && (
                              <p>
                                <span>{t.venues}:</span>
                                <strong>{evt.venue_name}</strong>
                              </p>
                            )}
                          </>
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : (
              <div className="invite-notice-box">
                <p>{t.personalInviteNotice}</p>
              </div>
            )}
          </section>

          <section className="venues-section" id="venues" aria-labelledby="venues-title" data-testid="section-venues">
            <div className="venue-overview">
              <div className="venue-intro">
                <p className="eyebrow">{t.venueEyebrow}</p>
                <h2 id="venues-title">{t.eventLocations}</h2>
                <p>{t.mapDirections}</p>

                {events.filter((evt) => Boolean(evt.venue_name || evt.map_link)).length > 0 ? (
                  <>
                    <div className="venue-cards-list">
                      {events
                        .filter((evt) => Boolean(evt.venue_name || evt.map_link))
                        .map((evt) => {
                        let mapUrl = evt.map_link;
                        if (!mapUrl) {
                          const lower = evt.event_name.toLowerCase();
                          if (lower.includes('barat') || lower.includes('baraat')) {
                            mapUrl = baraatMap;
                          } else if (lower.includes('walima')) {
                            mapUrl = walimaMap;
                          } else if (evt.venue_name) {
                            mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(evt.venue_name)}`;
                          }
                        }

                        return (
                          <div
                            className="venue-detail-card"
                            key={evt.event_id}
                            data-testid={`venue-card-${evt.event_id}`}
                          >
                            <div className="venue-detail-info">
                              <span className="venue-tag">{evt.event_name}</span>
                              <h4 className="venue-name">{evt.venue_name}</h4>
                            </div>
                            {mapUrl && (
                              <a
                                className="outline-button"
                                href={mapUrl}
                                target="_blank"
                                rel="noreferrer"
                                data-testid={`link-map-${evt.event_id}`}
                              >
                                <MapPin size={14} />{' '}
                                {language === 'ur'
                                  ? `${evt.event_name} کا نقشہ`
                                  : `${evt.event_name} Location Map`}
                              </a>
                            )}
                          </div>
                        );
                      })}
                    </div>
                    <div className="venue-actions">
                      <button
                        className="outline-button calendar-button"
                        type="button"
                        onClick={() => makeCalendarFile(events, language, weddingDetails || undefined)}
                        data-testid="button-add-to-calendar"
                      >
                        <CalendarDays size={14} /> {t.addCalendar}
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="invite-notice-box">
                    <p>{t.personalInviteNotice}</p>
                  </div>
                )}
              </div>

              <aside className="dress-code" data-testid="text-dress-code">
                <p className="eyebrow">{t.dressCode}</p>
                <p>{t.attire}</p>
                <span>{t.dressCodeNote}</span>
              </aside>
            </div>

            <section className="rsvp-section" aria-labelledby="rsvp-title" data-testid="section-rsvp">
              <p className="presence-note" id="rsvp-title">
                {t.presenceNote}
              </p>
              <a
                className="gold-button rsvp-button"
                href={rsvpUrl}
                target="_blank"
                rel="noreferrer"
                data-testid="link-rsvp"
              >
                {t.confirmAttendance} <ArrowUpRight size={14} />
              </a>
              <p className="rsvp-deadline">
                {weddingDetails?.rsvp_deadline
                  ? language === 'ur'
                    ? `براہِ کرم جواب دیں: ${weddingDetails.rsvp_deadline}`
                    : `Kindly respond before ${weddingDetails.rsvp_deadline}`
                  : t.rsvpDeadline}
              </p>
            </section>

            <div className="contact-section" data-testid="section-contacts">
              <p className="eyebrow">{t.contactEyebrow}</p>
              <h2>{t.contactTitle}</h2>
              <div className="contact-list" aria-label={t.contactsAria}>
                {activeContacts.map((number, index) => (
                  <a
                    className="contact-link"
                    dir="ltr"
                    href={`tel:${number.replaceAll('-', '')}`}
                    key={number}
                    data-testid={`link-contact-${index + 1}`}
                  >
                    <Phone size={14} />
                    {number}
                  </a>
                ))}
              </div>
            </div>
          </section>
        </article>

        <footer className="closing-footer">
          <p>
            {language === 'ur'
              ? `${groomDisplayName} اور ${brideDisplayName}`
              : `${groomDisplayName} & ${brideDisplayName}`}
          </p>
          <span>{t.footerGratitude}</span>
        </footer>
      </div>

      <StarPointer />
      <a href="#couple-title" className="skip-link" data-testid="link-skip-to-invitation">
        <ArrowDown size={14} /> {t.skipLink}
      </a>
      <span className="sr-only">{t.countdownScreenReader}</span>
    </main>
  );
}

/* ==========================================================================
   ROUTED ENTRYPOINTS
   ========================================================================== */

function PersonalizedInviteRoute() {
  const params = useParams<{ token?: string }>();
  return <WeddingInvitation token={params.token} />;
}

function PublicHomePageRoute() {
  return <WeddingInvitation />;
}

export default function App() {
  return (
    <Switch>
      <Route path="/" component={PublicHomePageRoute} />
      <Route path="/invite/:token" component={PersonalizedInviteRoute} />
      <Route path="/invite" component={PersonalizedInviteRoute} />
      <Route path="/admin">
        <Suspense
          fallback={
            <div
              style={{
                minHeight: '100vh',
                background: '#0b0f17',
                display: 'grid',
                placeItems: 'center',
                color: '#94a3b8',
              }}
            >
              Loading dashboard...
            </div>
          }
        >
          <AdminDashboard />
        </Suspense>
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}
