import { useEffect, useRef, useState } from 'react';
import { ArrowDown, ArrowLeft, ArrowUpRight, CalendarDays, Clock3, MapPin, Phone, Play, Sparkles, Star, Volume2, VolumeX } from 'lucide-react';
import bismillahAudio from '@assets/0_bismillah_1792636329790.mp3';
import introVideoWebm from '@assets/0_intro_1792477792582.webm';
import introVideoMp4 from '@assets/0_intro_1792477792582.mp4';
import introPoster from '@assets/0_intro_1792477792582-poster.jpg';
import weddingMusic from '@assets/0_wedding-music_1792636335449.mp3';

const baraatMap = 'https://www.google.com/maps/place/Ahmad+Marriage+Hall/@31.6609563,74.2814482,17z/data=!3m1!4b1!4m6!3m5!1s0x39191f5123d53f13:0xfa85db4f4b865520!8m2!3d31.6609563!4d74.2814482!16s%2Fg%2F11pdrb8n42?entry=tts&g_ep=EgoyMDI2MDkxNi4wIPu8ASoASAFQAw%3D%3D&skid=99144b77-a619-4786-be4b-6d2ec67fc079';
const walimaMap = 'https://google.com/maps/place/Bhatti+Marriage+Hall/@31.6518502,74.2809667,17z/data=!3m1!4b1!4m6!3m5!1s0x39191e99388f08cf:0x253df6cddb41eafd!8m2!3d31.6518502!4d74.2835416!16s%2Fg%2F11b7q8j71n?entry=tts&g_ep=EgoyMDI2MDkwMi4wIPu8ASoASAFQAw%3D%3D&skid=306e2a1e-078b-4f70-ac33-77cbcc48c012';
const rsvpUrl = 'https://docs.google.com/forms/d/e/1FAIpQLSd-Grwo1IswhqHV7aUuLnQL2YEsvdHROZ14lOiK3tAh6MrhYw/viewform?usp=header';

const contacts = ['0310-4942561', '0306-4100759', '0313-4811013'];

type Language = 'en' | 'ur';

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
    audioNeedsTap: 'Tap the sound button to start the invitation audio.',
    invitationCopy: 'Together with their families, we warmly invite you to celebrate our Big moment. Your presence, love, and prayers mean the world to us as we begin this blessed new journey together.',
    quranQuote: '“And among His signs is that He created for you mates from among yourselves, that you may find tranquility in them; and He placed between you affection and mercy.”',
    quranReference: '— Surah Ar-Rum (30:21)',
    revealDates: 'Click to Reveal Wedding Dates',
    revealHint: 'Tap to unveil the celebrations.',
    saveDates: 'Save the auspicious dates',
    baraat: 'The Baraat',
    walima: 'The Walima',
    november: 'November',
    friday: 'Friday',
    saturday: 'Saturday',
    evening: 'Evening',
    pm: 'PM',
    countdownTo: 'Counting down to the Baraat',
    countdownDays: 'Days',
    countdownHours: 'Hours',
    countdownMinutes: 'Minutes',
    countdownSeconds: 'Seconds',
    countdownAria: 'Time remaining until 20 November 2026 at 6 PM Pakistan time',
    eventSection: 'Wedding celebrations',
    eventSchedule: 'Event Schedule',
    onTime: 'Kindly make sure to be on time to share every moment with us.',
    dayOne: 'Day 01',
    dayTwo: 'Day 02',
    baraatDescription: 'Join us for the vibrant Baraat procession, grand reception dinner, and emotional Rukhsati farewell.',
    walimaDescription: "A joyful reception dinner hosted by the groom's family to share blessings, happiness, and delicious food with loved ones.",
    functionTiming: 'Function Timing:',
    baraatArrival: 'Baraat Arrival:',
    dinnerRukhsati: 'Dinner & Rukhsati:',
    guestWelcome: 'Guest Welcome:',
    dinner: 'Dinner:',
    venueEyebrow: 'Venues & directions',
    eventLocations: 'Event Locations',
    mapDirections: 'Tap the map buttons below to easily open live GPS directions to the celebration venues:',
    baraatMap: 'Baraat Location Map',
    walimaMap: 'Walima Location Map',
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
    countdownScreenReader: 'Countdown calculated to 6:00 PM Pakistan Standard Time (UTC+05:00).',
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
    audioNeedsTap: 'دعوت کی آڈیو چلانے کے لیے آواز کے بٹن کو دبائیں۔',
    invitationCopy: 'اپنے اہلِ خانہ کے ساتھ، ہم آپ کو اپنی خوشی کے اس خاص موقع پر شرکت کی دعوت دیتے ہیں۔ آپ کی موجودگی، محبت اور دعائیں ہمارے لیے بہت قیمتی ہیں، کیونکہ ہم اپنی اس بابرکت نئی زندگی کا آغاز کر رہے ہیں۔',
    quranQuote: 'اور اُس کی نشانیوں میں سے یہ ہے کہ اُس نے تمہارے لیے تم ہی میں سے جوڑے بنائے تاکہ تم اُن سے سکون پاؤ، اور اُس نے تمہارے درمیان محبت اور رحمت رکھ دی۔',
    quranReference: '— سورۃ الروم (۳۰:۲۱)',
    revealDates: 'شادی کی تاریخیں دیکھیں',
    revealHint: 'تقریبات کی تاریخیں جاننے کے لیے ٹیپ کریں۔',
    saveDates: 'تقریبات کی مبارک تاریخیں',
    baraat: 'بارات',
    walima: 'ولیمہ',
    november: 'نومبر',
    friday: 'جمعہ',
    saturday: 'ہفتہ',
    evening: 'شام',
    pm: 'شام',
    countdownTo: 'بارات تک باقی وقت',
    countdownDays: 'دن',
    countdownHours: 'گھنٹے',
    countdownMinutes: 'منٹ',
    countdownSeconds: 'سیکنڈ',
    countdownAria: '۲۰ نومبر ۲۰۲۶ شام ۶ بجے تک باقی وقت، پاکستان کا معیاری وقت',
    eventSection: 'شادی کی تقریبات',
    eventSchedule: 'تقریبات کا شیڈول',
    onTime: 'ہر لمحہ ہمارے ساتھ گزارنے کے لیے بروقت تشریف لائیں۔',
    dayOne: 'پہلا دن',
    dayTwo: 'دوسرا دن',
    baraatDescription: 'بارات کے جلوس، پُرتکلف استقبالیہ عشائیے اور رخصتی کی یادگار شام میں ہمارے ساتھ شریک ہوں۔',
    walimaDescription: 'دولہے کے اہلِ خانہ کی جانب سے خوشی اور برکت بانٹنے کے لیے ایک پُرمسرت استقبالیہ عشائیہ۔',
    functionTiming: 'تقریب کا وقت:',
    baraatArrival: 'بارات کی آمد:',
    dinnerRukhsati: 'عشائیہ اور رخصتی:',
    guestWelcome: 'مہمانوں کا استقبال:',
    dinner: 'عشائیہ:',
    venueEyebrow: 'مقامات اور رہنمائی',
    eventLocations: 'تقریبات کے مقامات',
    mapDirections: 'تقریبات کے مقامات تک راستہ دیکھنے کے لیے نیچے دیے گئے نقشے کے بٹن دبائیں:',
    baraatMap: 'بارات کا نقشہ',
    walimaMap: 'ولیمہ کا نقشہ',
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
    countdownScreenReader: 'بارات کی الٹی گنتی پاکستان کے معیاری وقت کے مطابق شام ۶ بجے تک ہے۔',
  },
} satisfies Record<Language, Record<string, string>>;

function localizeDigits(value: string | number, language: Language) {
  if (language === 'en') return String(value);
  return String(value).replace(/\d/g, (digit) => '۰۱۲۳۴۵۶۷۸۹'[Number(digit)]);
}

function timeUntilBaraat() {
  const baraatStart = Date.UTC(2026, 10, 20, 13, 0, 0);
  const remaining = Math.max(0, baraatStart - Date.now());
  return {
    days: Math.floor(remaining / 86_400_000),
    hours: Math.floor((remaining % 86_400_000) / 3_600_000),
    minutes: Math.floor((remaining % 3_600_000) / 60_000),
    seconds: Math.floor((remaining % 60_000) / 1_000),
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
          {rays.map((ray) => <i className={`firework-ray firework-ray-${ray}`} key={ray} />)}
        </span>
      ))}
    </div>
  );
}

function makeCalendarFile(language: Language) {
  const calendarText = language === 'ur'
    ? {
        baraatSummary: 'بارات — عاصم اور ثناء',
        baraatLocation: 'احمد میرج ہال',
        baraatDescription: 'تقریب شام ۶:۰۰ سے ۹:۳۰ بجے تک۔ بارات کی آمد شام ۶:۰۰ بجے۔ عشائیہ اور رخصتی شام ۸:۰۰ بجے۔',
        walimaSummary: 'ولیمہ — عاصم اور ثناء',
        walimaLocation: 'بھٹی میرج ہال',
        walimaDescription: 'تقریب شام ۶:۰۰ سے ۹:۳۰ بجے تک۔ مہمانوں کا استقبال شام ۶:۰۰ بجے۔ عشائیہ شام ۸:۰۰ بجے۔',
      }
    : {
        baraatSummary: 'Baraat — Asim and Sana',
        baraatLocation: 'Ahmad Marriage Hall',
        baraatDescription: 'Function 6:00–9:30 PM. Arrival 6:00 PM. Dinner and Rukhsati 8:00 PM.',
        walimaSummary: 'Walima — Asim and Sana',
        walimaLocation: 'Bhatti Marriage Hall',
        walimaDescription: 'Function 6:00–9:30 PM. Guest welcome 6:00 PM. Dinner 8:00 PM.',
      };
  const calendar = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Asim and Sana//Wedding Invitation//EN',
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    'UID:asim-sana-baraat-20261120@example.com',
    'DTSTAMP:20261001T000000Z',
    'DTSTART:20261120T130000Z',
    'DTEND:20261120T163000Z',
    `SUMMARY:${calendarText.baraatSummary}`,
    `LOCATION:${calendarText.baraatLocation}`,
    `DESCRIPTION:${calendarText.baraatDescription}`,
    'END:VEVENT',
    'BEGIN:VEVENT',
    'UID:asim-sana-walima-20261121@example.com',
    'DTSTAMP:20261001T000000Z',
    'DTSTART:20261121T130000Z',
    'DTEND:20261121T163000Z',
    `SUMMARY:${calendarText.walimaSummary}`,
    `LOCATION:${calendarText.walimaLocation}`,
    `DESCRIPTION:${calendarText.walimaDescription}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
  const blob = new Blob([calendar], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = 'asim-and-sana-wedding.ics';
  anchor.click();
  URL.revokeObjectURL(url);
}

function App() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const bismillahAudioRef = useRef<HTMLAudioElement>(null);
  const musicAudioRef = useRef<HTMLAudioElement>(null);
  const fireworksTimerRef = useRef<number | null>(null);
  const musicFadeFrameRef = useRef<number | null>(null);
  const audioGenerationRef = useRef(0);
  const audioSequenceStartedRef = useRef(false);
  const pendingAudioStageRef = useRef<'bismillah' | 'music'>('bismillah');
  const musicMutedRef = useRef(false);
  const [invitationOpen, setInvitationOpen] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [playbackFailed, setPlaybackFailed] = useState(false);
  const [datesRevealed, setDatesRevealed] = useState(false);
  const [fireworksActive, setFireworksActive] = useState(false);
  const [language, setLanguage] = useState<Language>('en');
  const [musicMuted, setMusicMuted] = useState(false);
  const [audioNeedsGesture, setAudioNeedsGesture] = useState(false);
  const [countdown, setCountdown] = useState(timeUntilBaraat);
  const t = copy[language];
  const sixPm = language === 'ur' ? `${localizeDigits('06:00', language)} ${t.pm}` : '06:00 PM';
  const eightPm = language === 'ur' ? `${localizeDigits('08:00', language)} ${t.pm}` : '08:00 PM';
  const functionTime = language === 'ur'
    ? `${localizeDigits('06:00', language)} ${t.pm} تا ${localizeDigits('09:30', language)} ${t.pm}`
    : '06:00 PM to 09:30 PM';

  useEffect(() => {
    const timer = window.setInterval(() => setCountdown(timeUntilBaraat()), 1_000);
    return () => {
      window.clearInterval(timer);
      if (fireworksTimerRef.current !== null) window.clearTimeout(fireworksTimerRef.current);
      if (musicFadeFrameRef.current !== null) window.cancelAnimationFrame(musicFadeFrameRef.current);
      audioGenerationRef.current += 1;
      bismillahAudioRef.current?.pause();
      musicAudioRef.current?.pause();
    };
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ur' ? 'rtl' : 'ltr';
  }, [language]);

  function revealWeddingDates() {
    setDatesRevealed(true);
    setFireworksActive(true);
    if (fireworksTimerRef.current !== null) window.clearTimeout(fireworksTimerRef.current);
    fireworksTimerRef.current = window.setTimeout(() => {
      setFireworksActive(false);
      fireworksTimerRef.current = null;
    }, 3_000);
  }

  function fadeInMusic(audio: HTMLAudioElement) {
    if (musicFadeFrameRef.current !== null) window.cancelAnimationFrame(musicFadeFrameRef.current);
    const startedAt = performance.now();
    const duration = 2_400;
    const targetVolume = 0.34;
    const step = (now: number) => {
      const progress = Math.min(1, (now - startedAt) / duration);
      audio.volume = targetVolume * progress;
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
      audio.muted = false;
      audio.volume = 1;
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
      if (stage === 'music') fadeInMusic(audio);
    } catch {
      if (generation === audioGenerationRef.current) setAudioNeedsGesture(true);
    }
  }

  function startAudioSequence() {
    if (audioSequenceStartedRef.current) return;
    audioSequenceStartedRef.current = true;
    pendingAudioStageRef.current = 'bismillah';
    audioGenerationRef.current += 1;
    void playAudioStage('bismillah');
  }

  function toggleMusic() {
    if (audioNeedsGesture) {
      if (pendingAudioStageRef.current === 'music') {
        musicMutedRef.current = false;
        setMusicMuted(false);
        if (musicAudioRef.current) musicAudioRef.current.muted = false;
      }
      void playAudioStage(pendingAudioStageRef.current);
      return;
    }

    const nextMuted = !musicMutedRef.current;
    musicMutedRef.current = nextMuted;
    setMusicMuted(nextMuted);
    if (musicAudioRef.current) musicAudioRef.current.muted = nextMuted;
  }

  function stopAudioSequence() {
    audioGenerationRef.current += 1;
    audioSequenceStartedRef.current = false;
    pendingAudioStageRef.current = 'bismillah';
    setAudioNeedsGesture(false);
    if (musicFadeFrameRef.current !== null) {
      window.cancelAnimationFrame(musicFadeFrameRef.current);
      musicFadeFrameRef.current = null;
    }
    bismillahAudioRef.current?.pause();
    musicAudioRef.current?.pause();
  }

  async function startFilm() {
    setPlaybackFailed(false);
    const video = videoRef.current;
    if (!video) return setPlaybackFailed(true);
    try {
      await video.play();
      setPlaying(true);
    } catch {
      setPlaybackFailed(true);
      setPlaying(false);
    }
  }

  function openInvitation() {
    const video = videoRef.current;
    if (video && !video.ended) video.pause();
    setPlaying(false);
    setInvitationOpen(true);
    startAudioSequence();
    window.setTimeout(() => document.getElementById('couple-title')?.focus(), 250);
  }

  function returnToCover() {
    stopAudioSequence();
    const video = videoRef.current;
    if (video) {
      video.pause();
      video.currentTime = 0;
    }
    setPlaying(false);
    setPlaybackFailed(false);
    setInvitationOpen(false);
    window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  }

  return (
    <main className="invitation-page" lang={language} dir={language === 'ur' ? 'rtl' : 'ltr'} data-testid="page-wedding-invitation">
      <audio
        ref={bismillahAudioRef}
        src={bismillahAudio}
        preload="none"
        aria-hidden="true"
        onEnded={() => { void playAudioStage('music'); }}
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
          preload="auto"
          aria-label={t.openingLabel}
          data-testid="video-opening-film"
          onClick={startFilm}
          onEnded={() => { openInvitation(); setPlaying(false); }}
          onError={() => setPlaybackFailed(true)}
          onPlay={() => setPlaying(true)}
        >
          <source src={introVideoWebm} type="video/webm" />
          <source src={introVideoMp4} type="video/mp4" />
        </video>
        <div className="intro-vignette" />
        <div className="intro-sparkles" aria-hidden="true" />
        <div className="intro-controls">
          {playbackFailed && <p className="intro-instruction" role="status" data-testid="status-video-unavailable">{t.videoUnavailable}</p>}
          {!playing && !playbackFailed && <p className="intro-instruction">{t.introInstruction}</p>}
          {playing && <p className="intro-instruction">{t.enjoyFilm}</p>}
          {!playing && (
            <button className="intro-play" type="button" onClick={startFilm} data-testid="button-play-film">
              <Play size={15} fill="currentColor" />{playbackFailed ? t.tryFilmAgain : t.tapToBegin}
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
          <a href="#events" data-testid="link-nav-events">{t.events}</a>
          <a href="#venues" data-testid="link-nav-venues">{t.venues}</a>
          <button
            className="nav-language"
            type="button"
            onClick={() => setLanguage((current) => current === 'en' ? 'ur' : 'en')}
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
            {musicMuted && !audioNeedsGesture
              ? <VolumeX size={13} aria-hidden="true" />
              : <Volume2 size={13} aria-hidden="true" />}
          </button>
          <a className="nav-rsvp" href={rsvpUrl} target="_blank" rel="noreferrer" data-testid="link-nav-rsvp">{t.rsvp}</a>
        </nav>
        {audioNeedsGesture && <p className="audio-hint" role="status" aria-live="polite">{t.audioNeedsTap}</p>}

        <article className="invitation-card" data-testid="card-main-invitation">
          <div className="medallion medallion-top" aria-hidden="true" />
          <div className="medallion medallion-bottom" aria-hidden="true" />
          <header className="invitation-header">
            <p className="bismillah" lang="ar" dir="rtl" data-testid="text-bismillah">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p>
            <div className="foil-rule" aria-hidden="true"><span /></div>
            <h1 className="couple-names" id="couple-title" tabIndex={-1} data-testid="text-couple-names">
              <span>{language === 'ur' ? 'عاصم عبد الغفور' : 'Asim Abdul Ghafoor'}</span>
              <span className="ampersand">&amp;</span>
              <span>{language === 'ur' ? 'ثناء عبد الخالق' : 'Sana Abdul Khaliq'}</span>
            </h1>
            <p className="invitation-copy">{t.invitationCopy}</p>
            <blockquote className="verse-quote" dir="auto" data-testid="text-quran-translation">
              {language === 'en' && '“'}{t.quranQuote}{language === 'en' && '”'}
              <cite data-testid="text-quran-reference">{t.quranReference}</cite>
            </blockquote>
          </header>

          <section className={`dates-reveal${datesRevealed ? ' is-revealed' : ''}`} aria-label={t.revealDates} data-testid="section-date-reveal">
            {fireworksActive && <FireworksOverlay />}
            {!datesRevealed ? (
              <div className="reveal-intro">
                <button className="gold-button reveal-button" type="button" onClick={revealWeddingDates} aria-controls="revealed-date-cards" data-testid="button-reveal-dates">
                  <Sparkles size={14} /> {t.revealDates}
                </button>
                <p className="reveal-hint">{t.revealHint}</p>
              </div>
            ) : (
              <div className="revealed-dates" id="revealed-date-cards" aria-live="polite" data-testid="status-dates-revealed">
                <p className="eyebrow">{t.saveDates}</p>
                <div className="revealed-grid">
                  <article className="revealed-date" data-testid="date-card-baraat">
                    <span>{t.baraat}</span>
                    <strong>{localizeDigits(20, language)}</strong>
                    <small>{t.november} {localizeDigits(2026, language)}</small>
                    <p>{language === 'ur' ? `${t.friday} · ${sixPm}` : `${t.friday} ${t.evening} · ${sixPm}`}</p>
                  </article>
                  <article className="revealed-date" data-testid="date-card-walima">
                    <span>{t.walima}</span>
                    <strong>{localizeDigits(21, language)}</strong>
                    <small>{t.november} {localizeDigits(2026, language)}</small>
                    <p>{language === 'ur' ? `${t.saturday} · ${sixPm}` : `${t.saturday} ${t.evening} · ${sixPm}`}</p>
                  </article>
                </div>
              </div>
            )}
          </section>

          <section className="countdown-section" aria-label={t.countdownTo} data-testid="section-countdown">
            <p className="eyebrow">{t.countdownTo}</p>
            <div className="countdown-clock" aria-label={t.countdownAria}>
              {[
                {key: 'days', label: t.countdownDays, value: countdown.days},
                {key: 'hours', label: t.countdownHours, value: countdown.hours},
                {key: 'minutes', label: t.countdownMinutes, value: countdown.minutes},
                {key: 'seconds', label: t.countdownSeconds, value: countdown.seconds},
              ].map(({key, label, value}) => (
                <div className="countdown-unit" key={key} data-testid={`countdown-${key}`}>
                  <strong>{localizeDigits(String(value).padStart(2, '0'), language)}</strong><span>{label}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="events-section" id="events" aria-labelledby="events-title" data-testid="section-events">
            <div className="section-heading">
              <p className="eyebrow">{t.eventSection}</p>
              <h2 id="events-title">{t.eventSchedule}</h2>
              <p className="on-time-note"><Clock3 size={14} /> {t.onTime}</p>
            </div>
            <div className="event-grid">
              <article className="event-card" data-testid="event-baraat">
                <div className="event-card-head"><span>{t.dayOne}</span><span>{t.friday}</span></div>
                <h3>{t.baraat}</h3>
                <p className="event-description">{t.baraatDescription}</p>
                <div className="event-times">
                  <p><span>{t.functionTiming}</span><strong>{functionTime}</strong></p>
                  <p><span>{t.baraatArrival}</span><strong>{sixPm}</strong></p>
                  <p><span>{t.dinnerRukhsati}</span><strong>{eightPm}</strong></p>
                </div>
              </article>
              <article className="event-card" data-testid="event-walima">
                <div className="event-card-head"><span>{t.dayTwo}</span><span>{t.saturday}</span></div>
                <h3>{t.walima}</h3>
                <p className="event-description">{t.walimaDescription}</p>
                <div className="event-times">
                  <p><span>{t.functionTiming}</span><strong>{functionTime}</strong></p>
                  <p><span>{t.guestWelcome}</span><strong>{sixPm}</strong></p>
                  <p><span>{t.dinner}</span><strong>{eightPm}</strong></p>
                </div>
              </article>
            </div>
          </section>

          <section className="venues-section" id="venues" aria-labelledby="venues-title" data-testid="section-venues">
            <div className="venue-overview">
              <div className="venue-intro">
                <p className="eyebrow">{t.venueEyebrow}</p>
                <h2 id="venues-title">{t.eventLocations}</h2>
                <p>{t.mapDirections}</p>
                <div className="venue-actions">
                  <a className="outline-button" href={baraatMap} target="_blank" rel="noreferrer" data-testid="link-map-baraat">
                    <MapPin size={14} /> {t.baraatMap}
                  </a>
                  <a className="outline-button" href={walimaMap} target="_blank" rel="noreferrer" data-testid="link-map-walima">
                    <MapPin size={14} /> {t.walimaMap}
                  </a>
                  <button className="outline-button calendar-button" type="button" onClick={() => makeCalendarFile(language)} data-testid="button-add-to-calendar">
                    <CalendarDays size={14} /> {t.addCalendar}
                  </button>
                </div>
              </div>
              <aside className="dress-code" data-testid="text-dress-code">
                <p className="eyebrow">{t.dressCode}</p>
                <p>{t.attire}</p>
                <span>{t.dressCodeNote}</span>
              </aside>
            </div>

            <section className="rsvp-section" aria-labelledby="rsvp-title" data-testid="section-rsvp">
              <p className="presence-note" id="rsvp-title">{t.presenceNote}</p>
              <a className="gold-button rsvp-button" href={rsvpUrl} target="_blank" rel="noreferrer" data-testid="link-rsvp">
                {t.confirmAttendance} <ArrowUpRight size={14} />
              </a>
              <p className="rsvp-deadline">{t.rsvpDeadline}</p>
            </section>

            <div className="contact-section" data-testid="section-contacts">
              <p className="eyebrow">{t.contactEyebrow}</p>
              <h2>{t.contactTitle}</h2>
            <div className="contact-list" aria-label={t.contactsAria}>
              {contacts.map((number, index) => (
                <a className="contact-link" dir="ltr" href={`tel:${number.replaceAll('-', '')}`} key={number} data-testid={`link-contact-${index + 1}`}>
                  <Phone size={14} />{number}
                </a>
              ))}
            </div>
            </div>
          </section>
        </article>
        <footer className="closing-footer">
          <p>{language === 'ur' ? 'عاصم عبد الغفور & ثناء عبد الخالق' : 'Asim Abdul Ghafoor & Sana Abdul Khaliq'}</p>
          <span>{t.footerGratitude}</span>
        </footer>
      </div>
      <StarPointer />
      <a href="#couple-title" className="skip-link" data-testid="link-skip-to-invitation"><ArrowDown size={14} /> {t.skipLink}</a>
      <span className="sr-only">{t.countdownScreenReader}</span>
    </main>
  );
}

export default App;
