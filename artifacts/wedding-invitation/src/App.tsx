import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
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

function ScratchReveal({ onReveal, revealed }: { onReveal: () => void; revealed: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const strokeCount = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || revealed) return;
    const context = canvas.getContext('2d');
    if (!context) return;
    const rect = canvas.getBoundingClientRect();
    const ratio = Math.max(1, window.devicePixelRatio || 1);
    canvas.width = Math.round(rect.width * ratio);
    canvas.height = Math.round(rect.height * ratio);
    context.scale(ratio, ratio);
    context.fillStyle = '#c5a35a';
    context.fillRect(0, 0, rect.width, rect.height);

    const gradient = context.createLinearGradient(0, 0, rect.width, rect.height);
    gradient.addColorStop(0, 'rgba(238, 217, 158, .7)');
    gradient.addColorStop(.48, 'rgba(181, 138, 59, .08)');
    gradient.addColorStop(1, 'rgba(133, 94, 31, .28)');
    context.fillStyle = gradient;
    context.fillRect(0, 0, rect.width, rect.height);

    context.strokeStyle = 'rgba(255, 248, 226, .22)';
    context.lineWidth = 1;
    for (let x = -rect.height; x < rect.width + rect.height; x += 15) {
      context.beginPath();
      context.moveTo(x, 0);
      context.lineTo(x + rect.height, rect.height);
      context.stroke();
    }
    context.fillStyle = 'rgba(255, 248, 226, .42)';
    for (let x = 12; x < rect.width; x += 25) {
      for (let y = 12; y < rect.height; y += 25) {
        context.beginPath();
        context.arc(x, y, 1, 0, Math.PI * 2);
        context.fill();
      }
    }
    context.fillStyle = '#3b2b08';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.font = '600 11px Montserrat, sans-serif';
    context.fillText('SCRATCH TO REVEAL', rect.width / 2, rect.height / 2 - 7);
    context.font = '22px "Cormorant Garamond", serif';
    context.fillText('Two days, one beautiful beginning', rect.width / 2, rect.height / 2 + 18);
    context.font = '10px Montserrat, sans-serif';
    context.fillText('USE A FINGER OR MOUSE', rect.width / 2, rect.height / 2 + 42);
  }, [revealed]);

  function eraseAt(event: ReactPointerEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!canvas || !context) return;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    context.globalCompositeOperation = 'destination-out';
    context.lineWidth = 48;
    context.lineCap = 'round';
    context.lineJoin = 'round';
    context.lineTo(x, y);
    context.stroke();
    context.beginPath();
    context.moveTo(x, y);
    strokeCount.current += 1;

    if (strokeCount.current % 7 === 0 && canvas.width && canvas.height) {
      const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;
      let transparent = 0;
      for (let i = 3; i < pixels.length; i += 4) {
        if (pixels[i] < 100) transparent += 1;
      }
      if (transparent / (pixels.length / 4) > .34) onReveal();
    }
  }

  return (
    <canvas
      ref={canvasRef}
      className="scratch-canvas"
      aria-hidden="true"
      data-testid="scratch-surface"
      onPointerDown={(event) => {
        event.currentTarget.setPointerCapture(event.pointerId);
        const rect = event.currentTarget.getBoundingClientRect();
        const context = event.currentTarget.getContext('2d');
        if (context) {
          context.beginPath();
          context.moveTo(event.clientX - rect.left, event.clientY - rect.top);
        }
        eraseAt(event);
      }}
      onPointerMove={(event) => {
        if (event.buttons > 0 || event.pointerType === 'touch') eraseAt(event);
      }}
      onPointerUp={() => {
        const context = canvasRef.current?.getContext('2d');
        context?.beginPath();
      }}
    />
  );
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
            <p className="bismillah-roman">Bismillahirrahmanirrahim</p>
            <div className="foil-rule" aria-hidden="true"><span /></div>
            <p className="eyebrow">Together with their families</p>
            <h1 className="couple-names" id="couple-title" tabIndex={-1} data-testid="text-couple-names">
              <span>Asim Abdul Ghafoor</span><span className="ampersand">&amp;</span><span>Sana Abdul Khaliq</span>
            </h1>
            <p className="invitation-copy">With grateful hearts, our families warmly invite you to join us in celebrating the marriage of Asim and Sana. Your presence, prayers, and good wishes will make these days all the more meaningful.</p>
            <blockquote className="verse-quote" data-testid="text-quran-translation">
              “And of His signs is that He created for you from yourselves mates that you may find tranquility in them; and He placed between you affection and mercy. Indeed in that are signs for a people who give thought.”
              <cite data-testid="text-quran-reference">Qur’an · Surah Ar-Rum · 30:21</cite>
            </blockquote>
          </header>

          <section className={`dates-reveal${datesRevealed ? ' is-revealed' : ''}`} aria-labelledby="dates-title" data-testid="section-date-reveal">
            {!datesRevealed ? (
              <>
                <div className="scratch-card" data-testid="panel-event-dates">
                  <div className="scratch-info">
                    <div className="date-display"><span>Baraat</span><strong>20</strong><small>November 2026 · Friday</small></div>
                    <div className="scratch-divider" aria-hidden="true" />
                    <div className="date-display"><span>Walima</span><strong>21</strong><small>November 2026 · Saturday</small></div>
                  </div>
                  <ScratchReveal onReveal={() => setDatesRevealed(true)} revealed={datesRevealed} />
                </div>
                <button className="gold-button reveal-button" type="button" onClick={() => setDatesRevealed(true)} data-testid="button-reveal-dates">
                  <Sparkles size={15} /> Reveal the wedding dates
                </button>
                <p className="reveal-hint">Scratch the gold panel, or use the button to unveil the celebrations.</p>
              </>
            ) : (
              <div className="revealed-dates" role="status" data-testid="status-dates-revealed">
                <p className="eyebrow">The days we will remember</p>
                <h2 id="dates-title">Save the dates</h2>
                <div className="revealed-grid">
                  <div className="revealed-date"><span>Baraat · Friday</span><strong>20</strong><small>November 2026</small></div>
                  <div className="revealed-date"><span>Walima · Saturday</span><strong>21</strong><small>November 2026</small></div>
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
            <p className="timezone-note" data-testid="text-countdown-timezone">Friday, 20 November 2026 · 6:00 PM · Pakistan Standard Time (UTC+05:00)</p>
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
                <h3>Baraat</h3>
                <p className="event-card-date">20 November 2026</p>
                <div className="event-times">
                  <p><span>Function timing</span><strong>6:00–9:30 PM</strong></p>
                  <p><span>Arrival</span><strong>6:00 PM</strong></p>
                  <p><span>Dinner and Rukhsati</span><strong>8:00 PM</strong></p>
                </div>
              </article>
              <article className="event-card" data-testid="event-walima">
                <div className="event-card-head"><span>Day 02</span><span>Saturday</span></div>
                <h3>Walima</h3>
                <p className="event-card-date">21 November 2026</p>
                <div className="event-times">
                  <p><span>Function timing</span><strong>6:00–9:30 PM</strong></p>
                  <p><span>Guest welcome</span><strong>6:00 PM</strong></p>
                  <p><span>Dinner</span><strong>8:00 PM</strong></p>
                </div>
              </article>
            </div>
          </section>

          <section className="venues-section" id="venues" aria-labelledby="venues-title" data-testid="section-venues">
            <div className="venue-intro">
              <p className="eyebrow">Venues &amp; directions</p>
              <h2 id="venues-title">Event Locations</h2>
              <p>Choose a venue to open directions in Google Maps.</p>
              <button className="outline-button calendar-button" type="button" onClick={makeCalendarFile} data-testid="button-add-to-calendar">
                <CalendarDays size={16} /> Add both events to calendar
              </button>
            </div>
            <div className="venue-list">
              <article className="venue-row" data-testid="card-venue-baraat">
                <div className="venue-mark"><MapPin size={17} /></div>
                <div><span>Baraat · Friday, 20 November</span><h3>Ahmad Marriage Hall</h3></div>
                <a className="map-button" href={baraatMap} target="_blank" rel="noreferrer" data-testid="link-map-baraat">Directions <ArrowUpRight size={15} /></a>
              </article>
              <article className="venue-row" data-testid="card-venue-walima">
                <div className="venue-mark"><MapPin size={17} /></div>
                <div><span>Walima · Saturday, 21 November</span><h3>Bhatti Marriage Hall</h3></div>
                <a className="map-button" href={walimaMap} target="_blank" rel="noreferrer" data-testid="link-map-walima">Directions <ArrowUpRight size={15} /></a>
              </article>
            </div>
            <aside className="dress-code" data-testid="text-dress-code">
              <p className="eyebrow">Dress code</p>
              <p>Formal Traditional or Evening Wear</p>
              <span>We warmly look forward to celebrating together in festive formal attire.</span>
            </aside>
          </section>

          <section className="gallery-section" aria-label="Wedding photographs" data-testid="section-gallery">
            <div className="gallery-placeholder" data-testid="empty-gallery">
              <div className="gallery-frame" aria-hidden="true" />
              <p className="eyebrow">A place for memories</p>
              <h2>Our photographs, soon</h2>
              <p>We look forward to sharing moments from our celebrations with you.</p>
            </div>
          </section>

          <section className="rsvp-section" aria-labelledby="rsvp-title" data-testid="section-rsvp">
            <p className="eyebrow">Your presence is a gift</p>
            <h2 id="rsvp-title">Will you join us?</h2>
            <p>Kindly let our families know if we may count you among our guests.</p>
            <a className="gold-button rsvp-button" href={rsvpUrl} target="_blank" rel="noreferrer" data-testid="link-rsvp">Respond to invitation <ArrowUpRight size={15} /></a>
          </section>

          <footer className="contact-section" data-testid="section-contacts">
            <div className="contact-copy"><p className="eyebrow">Questions or wishes</p><h2>Reach our families</h2><p>We would be happy to hear from you.</p></div>
            <div className="contact-list" aria-label="Family contact numbers">
              {contacts.map((number, index) => (
                <a className="contact-link" href={`tel:${number.replaceAll('-', '')}`} key={number} data-testid={`link-contact-${index + 1}`}>
                  <Phone size={14} />{number}
                </a>
              ))}
            </div>
            <div className="footer-bottom"><span>With love, Asim &amp; Sana</span><span>20 — 21 November 2026</span></div>
          </footer>
        </article>
      </div>
      <StarPointer />
      <a href="#couple-title" className="skip-link" data-testid="link-skip-to-invitation"><ArrowDown size={14} /> Invitation details</a>
      <span className="sr-only">Countdown calculated to 6:00 PM Pakistan Standard Time (UTC+05:00).</span>
    </main>
  );
}

export default App;
