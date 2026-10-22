import { useEffect, useRef, useState } from 'react';
import { ArrowDown, ArrowLeft, ArrowUpRight, CalendarDays, Clock3, MapPin, Phone, Play, Sparkles, Star } from 'lucide-react';
import introVideoWebm from '@assets/0_intro_1792477792582.webm';
import introVideoMp4 from '@assets/0_intro_1792477792582.mp4';
import introPoster from '@assets/0_intro_1792477792582-poster.jpg';

const baraatMap = 'https://www.google.com/maps/place/Ahmad+Marriage+Hall/@31.6609563,74.2814482,17z/data=!3m1!4b1!4m6!3m5!1s0x39191f5123d53f13:0xfa85db4f4b865520!8m2!3d31.6609563!4d74.2814482!16s%2Fg%2F11pdrb8n42?entry=tts&g_ep=EgoyMDI2MDkxNi4wIPu8ASoASAFQAw%3D%3D&skid=99144b77-a619-4786-be4b-6d2ec67fc079';
const walimaMap = 'https://google.com/maps/place/Bhatti+Marriage+Hall/@31.6518502,74.2809667,17z/data=!3m1!4b1!4m6!3m5!1s0x39191e99388f08cf:0x253df6cddb41eafd!8m2!3d31.6518502!4d74.2835416!16s%2Fg%2F11b7q8j71n?entry=tts&g_ep=EgoyMDI2MDkwMi4wIPu8ASoASAFQAw%3D%3D&skid=306e2a1e-078b-4f70-ac33-77cbcc48c012';
const rsvpUrl = 'https://docs.google.com/forms/d/e/1FAIpQLSd-Grwo1IswhqHV7aUuLnQL2YEsvdHROZ14lOiK3tAh6MrhYw/viewform?usp=header';

const contacts = ['0310-4942561', '0306-4100759', '0313-4811013'];

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
      if (now - lastTrail < 34) return;
      lastTrail = now;
      const dot = document.createElement('span');
      dot.className = 'star-trail';
      dot.style.left = `${event.clientX}px`;
      dot.style.top = `${event.clientY}px`;
      document.body.appendChild(dot);
      window.setTimeout(() => dot.remove(), 700);
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

function makeCalendarFile() {
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
    'SUMMARY:Baraat — Asim and Sana',
    'LOCATION:Ahmad Marriage Hall',
    'DESCRIPTION:Function 6:00–9:30 PM. Arrival 6:00 PM. Dinner and Rukhsati 8:00 PM.',
    'END:VEVENT',
    'BEGIN:VEVENT',
    'UID:asim-sana-walima-20261121@example.com',
    'DTSTAMP:20261001T000000Z',
    'DTSTART:20261121T130000Z',
    'DTEND:20261121T163000Z',
    'SUMMARY:Walima — Asim and Sana',
    'LOCATION:Bhatti Marriage Hall',
    'DESCRIPTION:Function 6:00–9:30 PM. Guest welcome 6:00 PM. Dinner 8:00 PM.',
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
  const [invitationOpen, setInvitationOpen] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [playbackFailed, setPlaybackFailed] = useState(false);
  const [datesRevealed, setDatesRevealed] = useState(false);
  const [countdown, setCountdown] = useState(timeUntilBaraat);

  useEffect(() => {
    const timer = window.setInterval(() => setCountdown(timeUntilBaraat()), 1_000);
    return () => window.clearInterval(timer);
  }, []);

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
    setInvitationOpen(true);
    window.setTimeout(() => document.getElementById('couple-title')?.focus(), 250);
  }

  function returnToCover() {
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
    <main className="invitation-page" data-testid="page-wedding-invitation">
      <section
        className={`intro-screen${invitationOpen ? ' is-opening' : ''}`}
        aria-label="Opening film"
        aria-hidden={invitationOpen}
        data-testid="section-opening-film"
      >
        <video
          ref={videoRef}
          className="intro-video"
          poster={introPoster}
          playsInline
          preload="auto"
          aria-label="A personal opening film for Asim and Sana"
          data-testid="video-opening-film"
          onClick={startFilm}
          onEnded={() => { setInvitationOpen(true); setPlaying(false); }}
          onError={() => setPlaybackFailed(true)}
          onPlay={() => setPlaying(true)}
        >
          <source src={introVideoWebm} type="video/webm" />
          <source src={introVideoMp4} type="video/mp4" />
        </video>
        <div className="intro-vignette" />
        <div className="intro-controls">
          {playbackFailed && <p className="intro-instruction" role="status" data-testid="status-video-unavailable">The film could not be played. You can still open the invitation.</p>}
          {!playing && !playbackFailed && <p className="intro-instruction">A moment made for you</p>}
          {playing && <p className="intro-instruction">Enjoy the film</p>}
          {!playing && (
            <button className="intro-play" type="button" onClick={startFilm} data-testid="button-play-film">
              <Play size={15} fill="currentColor" />{playbackFailed ? 'Try the film again' : 'Tap to begin'}
            </button>
          )}
          <button type="button" className="intro-skip" onClick={openInvitation} data-testid="button-skip-film">
            {playing ? 'Skip to invitation' : 'Open invitation'}
          </button>
        </div>
      </section>

      <div className="page-shell">
        <nav className="site-nav" aria-label="Invitation navigation" data-testid="navigation-main">
          <button className="nav-cover" onClick={returnToCover} type="button" data-testid="button-return-to-cover">
            <ArrowLeft size={14} /> <span>Cover</span>
          </button>
          <a href="#events" data-testid="link-nav-events">Events</a>
          <a href="#venues" data-testid="link-nav-venues">Venues</a>
          <a className="nav-rsvp" href={rsvpUrl} target="_blank" rel="noreferrer" data-testid="link-nav-rsvp">RSVP</a>
        </nav>

        <article className="invitation-card" data-testid="card-main-invitation">
          <div className="medallion medallion-top" aria-hidden="true" />
          <div className="medallion medallion-bottom" aria-hidden="true" />
          <header className="invitation-header">
            <p className="bismillah" lang="ar" dir="rtl" data-testid="text-bismillah">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p>
            <div className="foil-rule" aria-hidden="true"><span /></div>
            <h1 className="couple-names" id="couple-title" tabIndex={-1} data-testid="text-couple-names">
              <span>Asim Abdul Ghafoor</span><span className="ampersand">&amp;</span><span>Sana Abdul Khaliq</span>
            </h1>
            <p className="invitation-copy">Together with their families, we warmly invite you to celebrate our Big moment. Your presence, love, and prayers mean the world to us as we begin this blessed new journey together.</p>
            <blockquote className="verse-quote" data-testid="text-quran-translation">
              “And among His signs is that He created for you mates from among yourselves, that you may find tranquility in them; and He placed between you affection and mercy.”
              <cite data-testid="text-quran-reference">— Surah Ar-Rum (30:21)</cite>
            </blockquote>
          </header>

          <section className={`dates-reveal${datesRevealed ? ' is-revealed' : ''}`} aria-labelledby="dates-title" data-testid="section-date-reveal">
            {!datesRevealed ? (
              <div className="reveal-intro">
                <button className="gold-button reveal-button" type="button" onClick={() => setDatesRevealed(true)} aria-controls="revealed-date-cards" data-testid="button-reveal-dates">
                  <Sparkles size={14} /> Click to Reveal Wedding Dates
                </button>
                <p className="reveal-hint">Tap to unveil the celebrations.</p>
              </div>
            ) : (
              <div className="revealed-dates" id="revealed-date-cards" aria-live="polite" data-testid="status-dates-revealed">
                <p className="eyebrow">Save the auspicious dates</p>
                <div className="revealed-grid">
                  <article className="revealed-date" data-testid="date-card-baraat">
                    <span>The Baraat</span><strong>20</strong><small>November 2026</small><p>Friday Evening · 06:00 PM</p>
                  </article>
                  <article className="revealed-date" data-testid="date-card-walima">
                    <span>The Walima</span><strong>21</strong><small>November 2026</small><p>Saturday Evening · 06:00 PM</p>
                  </article>
                </div>
              </div>
            )}
          </section>

          <section className="countdown-section" aria-label="Countdown to Baraat" data-testid="section-countdown">
            <p className="eyebrow">Counting down to the Baraat</p>
            <div className="countdown-clock" aria-label="Time remaining until 20 November 2026 at 6 PM Pakistan time">
              {[
                ['Days', countdown.days],
                ['Hours', countdown.hours],
                ['Minutes', countdown.minutes],
                ['Seconds', countdown.seconds],
              ].map(([label, value]) => (
                <div className="countdown-unit" key={label} data-testid={`countdown-${String(label).toLowerCase()}`}>
                  <strong>{String(value).padStart(2, '0')}</strong><span>{label}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="events-section" id="events" aria-labelledby="events-title" data-testid="section-events">
            <div className="section-heading">
              <p className="eyebrow">Wedding celebrations</p>
              <h2 id="events-title">Event Schedule</h2>
              <p className="on-time-note"><Clock3 size={14} /> Kindly make sure to be on time to share every moment with us.</p>
            </div>
            <div className="event-grid">
              <article className="event-card" data-testid="event-baraat">
                <div className="event-card-head"><span>Day 01</span><span>Friday</span></div>
                <h3>The Baraat</h3>
                <p className="event-description">Join us for the vibrant Baraat procession, grand reception dinner, and emotional Rukhsati farewell.</p>
                <div className="event-times">
                  <p><span>Function Timing:</span><strong>06:00 PM to 09:30 PM</strong></p>
                  <p><span>Baraat Arrival:</span><strong>06:00 PM</strong></p>
                  <p><span>Dinner &amp; Rukhsati:</span><strong>08:00 PM</strong></p>
                </div>
              </article>
              <article className="event-card" data-testid="event-walima">
                <div className="event-card-head"><span>Day 02</span><span>Saturday</span></div>
                <h3>The Walima</h3>
                <p className="event-description">A joyful reception dinner hosted by the groom's family to share blessings, happiness, and delicious food with loved ones.</p>
                <div className="event-times">
                  <p><span>Function Timing:</span><strong>06:00 PM to 09:30 PM</strong></p>
                  <p><span>Guest Welcome:</span><strong>06:00 PM</strong></p>
                  <p><span>Dinner:</span><strong>08:00 PM</strong></p>
                </div>
              </article>
            </div>
          </section>

          <section className="venues-section" id="venues" aria-labelledby="venues-title" data-testid="section-venues">
            <div className="venue-overview">
              <div className="venue-intro">
                <p className="eyebrow">Venues &amp; directions</p>
                <h2 id="venues-title">Event Locations</h2>
                <p>Tap the map buttons below to easily open live GPS directions to the celebration venues:</p>
                <div className="venue-actions">
                  <a className="outline-button" href={baraatMap} target="_blank" rel="noreferrer" data-testid="link-map-baraat">
                    <MapPin size={14} /> Baraat Location Map
                  </a>
                  <a className="outline-button" href={walimaMap} target="_blank" rel="noreferrer" data-testid="link-map-walima">
                    <MapPin size={14} /> Walima Location Map
                  </a>
                  <button className="outline-button calendar-button" type="button" onClick={makeCalendarFile} data-testid="button-add-to-calendar">
                    <CalendarDays size={14} /> Add to Calendar
                  </button>
                </div>
              </div>
              <aside className="dress-code" data-testid="text-dress-code">
                <p className="eyebrow">Dress code</p>
                <p>Formal Traditional or Evening Wear</p>
                <span>We warmly look forward to celebrating together in festive formal attire.</span>
              </aside>
            </div>

            <section className="rsvp-section" aria-labelledby="rsvp-title" data-testid="section-rsvp">
              <p className="presence-note" id="rsvp-title">Your presence would complete our happiness</p>
              <a className="gold-button rsvp-button" href={rsvpUrl} target="_blank" rel="noreferrer" data-testid="link-rsvp">
                Confirm Your Attendance (RSVP) <ArrowUpRight size={14} />
              </a>
              <p className="rsvp-deadline">Kindly respond before November 1, 2026</p>
            </section>

            <div className="contact-section" data-testid="section-contacts">
              <p className="eyebrow">For queries &amp; RSVP contact</p>
              <h2>Contact Information</h2>
            <div className="contact-list" aria-label="Family contact numbers">
              {contacts.map((number, index) => (
                <a className="contact-link" href={`tel:${number.replaceAll('-', '')}`} key={number} data-testid={`link-contact-${index + 1}`}>
                  <Phone size={14} />{number}
                </a>
              ))}
            </div>
            </div>
          </section>
        </article>
        <footer className="closing-footer">
          <p>Asim Abdul Ghafoor &amp; Sana Abdul Khaliq</p>
          <span>#ASIMANDSANA2026 · WITH WARM GRATITUDE</span>
        </footer>
      </div>
      <StarPointer />
      <a href="#couple-title" className="skip-link" data-testid="link-skip-to-invitation"><ArrowDown size={14} /> Invitation details</a>
      <span className="sr-only">Countdown calculated to 6:00 PM Pakistan Standard Time (UTC+05:00).</span>
    </main>
  );
}

export default App;
