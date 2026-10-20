import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import { ArrowDown, ArrowUpRight, CalendarDays, Check, MapPin, Phone, Play, Sparkles, Star } from 'lucide-react';
import introVideoWebm from '@assets/0_intro_1792477792582.webm';
import introVideoMp4 from '@assets/0_intro_1792477792582.mp4';
import introPoster from '@assets/0_intro_1792477792582-poster.jpg';

const baraatMap = 'https://www.google.com/maps/place/Ahmad+Marriage+Hall/@31.6609563,74.2814482,17z/data=!3m1!4b1!4m6!3m5!1s0x39191f5123d53f13:0xfa85db4f4b865520!8m2!3d31.6609563!4d74.2814482!16s%2Fg%2F11pdrb8n42?entry=tts&g_ep=EgoyMDI2MDkxNi4wIPu8ASoASAFQAw%3D%3D&skid=99144b77-a619-4786-be4b-6d2ec67fc079';
const walimaMap = 'https://google.com/maps/place/Bhatti+Marriage+Hall/@31.6518502,74.2809667,17z/data=!3m1!4b1!4m6!3m5!1s0x39191e99388f08cf:0x253df6cddb41eafd!8m2!3d31.6518502!4d74.2835416!16s%2Fg%2F11b7q8j71n?entry=tts&g_ep=EgoyMDI2MDkwMi4wIPu8ASoASAFQAw%3D%3D&skid=306e2a1e-078b-4f70-ac33-77cbcc48c012';
const rsvpUrl = 'https://docs.google.com/forms/d/e/1FAIpQLSd-Grwo1IswhqHV7aUuLnQL2YEsvdHROZ14lOiK3tAh6MrhYw/viewform?usp=header';

const contacts = ['0310-4942561', '0306-4100759', '0313-4811013'];

function timeUntilBaraat() {
  const baraatStart = Date.UTC(2026, 10, 20, 0, 0, 0) - 5 * 60 * 60 * 1000;
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
    context.fillStyle = '#284c38';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.font = '600 11px "DM Sans", sans-serif';
    context.fillText('SCRATCH TO REVEAL', rect.width / 2, rect.height / 2 - 7);
    context.font = '22px "Cormorant Garamond", serif';
    context.fillText('Two days, one beautiful beginning', rect.width / 2, rect.height / 2 + 18);
    context.font = '10px "DM Sans", sans-serif';
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
    if (!video) {
      setPlaybackFailed(true);
      return;
    }
    try {
      await video.play();
      setPlaying(true);
    } catch {
      setPlaybackFailed(true);
      setPlaying(false);
    }
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
          onEnded={() => setInvitationOpen(true)}
          onError={() => setPlaybackFailed(true)}
          onPlay={() => setPlaying(true)}
        >
          <source src={introVideoWebm} type="video/webm" />
          <source src={introVideoMp4} type="video/mp4" />
        </video>
        <div className="intro-vignette" />
        <div className="intro-controls">
          {playbackFailed && (
            <p className="intro-instruction" role="status" data-testid="status-video-unavailable">
              The film could not be played. You can still open the invitation.
            </p>
          )}
          {!playing && !playbackFailed && <p className="intro-instruction">A moment made for you</p>}
          {playing && <p className="intro-instruction">Enjoy the film</p>}
          {!playing && (
            <button className="intro-play" type="button" onClick={startFilm} data-testid="button-play-film">
              <Play size={15} fill="currentColor" />
              {playbackFailed ? 'Try the film again' : 'Tap to begin'}
            </button>
          )}
          <button
            type="button"
            className="intro-skip"
            onClick={() => setInvitationOpen(true)}
            data-testid="button-skip-film"
          >
            {playing ? 'Skip to invitation' : 'Open invitation'}
          </button>
        </div>
      </section>

      <div className="page-shell">
        <section className="hero-section" aria-labelledby="couple-title" data-testid="section-hero">
          <div className="hero-ornament" aria-hidden="true" />
          <div className="hero-content">
            <p className="bismillah" lang="ar" dir="rtl" data-testid="text-bismillah">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p>
            <p className="bismillah-roman" lang="en">Bismillahirrahmanirrahim</p>
            <h1 className="couple-names" id="couple-title" data-testid="text-couple-names">
              <span>Asim Abdul Ghafoor</span>
              <span className="ampersand">&amp;</span>
              <span>Sana Abdul Khalik</span>
            </h1>
            <p className="invitation-kicker">With the blessings of our families</p>
            <div className="hero-rule" aria-hidden="true"><Sparkles size={15} /></div>
            <p className="hero-description">
              Together with their families, Asim and Sana joyfully invite you to share in the celebration of their marriage.
            </p>
            <p className="hero-date">Baraat · 20 November 2026 &nbsp; / &nbsp; Walima · 21 November 2026</p>
          </div>
        </section>

        <section className="reflection-section" aria-labelledby="reflection-title" data-testid="section-reflection">
          <div className="section-wrap">
            <p className="section-label">A reflection on marriage</p>
            <h2 className="reflection-title display-serif" id="reflection-title">A sign of His mercy</h2>
            <span className="verse-mark" aria-hidden="true">“</span>
            <blockquote className="verse-copy" data-testid="text-quran-translation">
              And of His signs is that He created for you from yourselves mates that you may find tranquility in them; and He placed between you affection and mercy. Indeed in that are signs for a people who give thought.
            </blockquote>
            <p className="verse-reference" data-testid="text-quran-reference">The Holy Qur’an · Surah Ar-Rum · 30:21</p>
          </div>
        </section>

        <section className="event-section" aria-labelledby="events-title" data-testid="section-events">
          <div className="section-wrap">
            <header className="event-heading">
              <p className="section-label">Please join us</p>
              <h2 id="events-title">Two celebrations</h2>
            </header>
            <div className="scratch-card" data-testid="panel-event-dates">
              <div className="scratch-info">
                <article className="event-item" data-testid="event-baraat">
                  <h3>Baraat</h3>
                  <p>Friday, 20 November 2026</p>
                  <span className="event-date">Ahmad Marriage Hall</span>
                </article>
                <div className="scratch-divider" aria-hidden="true" />
                <article className="event-item" data-testid="event-walima">
                  <h3>Walima</h3>
                  <p>Saturday, 21 November 2026</p>
                  <span className="event-date">Bhatti Marriage Hall</span>
                </article>
              </div>
              {!datesRevealed && (
                <ScratchReveal onReveal={() => setDatesRevealed(true)} revealed={datesRevealed} />
              )}
            </div>
            <div className="scratch-access">
              {datesRevealed ? (
                <span className="text-button" role="status" data-testid="status-dates-revealed"><Check size={14} /> Dates revealed</span>
              ) : (
                <button
                  className="text-button"
                  type="button"
                  onClick={() => setDatesRevealed(true)}
                  data-testid="button-reveal-dates"
                >
                  <CalendarDays size={14} /> Reveal dates without scratching
                </button>
              )}
            </div>
          </div>
        </section>

        <section className="countdown-section" aria-label="Countdown to Baraat day" data-testid="section-countdown">
          <div className="countdown-inner">
            <div className="countdown-clock" aria-label="Time remaining to Baraat day">
              {[
                ['Days', countdown.days],
                ['Hours', countdown.hours],
                ['Minutes', countdown.minutes],
                ['Seconds', countdown.seconds],
              ].map(([label, value]) => (
                <div className="countdown-unit" key={label} data-testid={`countdown-${String(label).toLowerCase()}`}>
                  <span className="countdown-number">{String(value).padStart(2, '0')}</span>
                  <span className="countdown-label">{label}</span>
                </div>
              ))}
            </div>
            <div className="countdown-copy">
              <p className="section-label">Until Baraat</p>
              <h2>{countdown.days === 0 && countdown.hours === 0 && countdown.minutes === 0 && countdown.seconds === 0 ? 'The day is here' : 'Baraat day is approaching'}</h2>
              <p>Counting down to midnight at the start of 20 November in Pakistan time. No event start time has been set.</p>
            </div>
          </div>
        </section>

        <section className="venue-section" aria-labelledby="venue-title" data-testid="section-venues">
          <div className="section-wrap">
            <header className="venue-heading">
              <p className="section-label">Gather with us</p>
              <h2 id="venue-title">Where to celebrate</h2>
            </header>
            <div className="venue-grid">
              <article className="venue-card" data-testid="card-venue-baraat">
                <div>
                  <div className="venue-card-top">
                    <span className="venue-index">01 / Baraat</span>
                    <span className="venue-icon" aria-hidden="true"><MapPin size={17} /></span>
                  </div>
                  <h3>Ahmad Marriage Hall</h3>
                  <p>Friday, 20 November 2026</p>
                </div>
                <a
                  className="venue-link"
                  href={baraatMap}
                  target="_blank"
                  rel="noreferrer"
                  data-testid="link-map-baraat"
                >
                  Open directions <ArrowUpRight size={15} />
                </a>
              </article>
              <article className="venue-card" data-testid="card-venue-walima">
                <div>
                  <div className="venue-card-top">
                    <span className="venue-index">02 / Walima</span>
                    <span className="venue-icon" aria-hidden="true"><MapPin size={17} /></span>
                  </div>
                  <h3>Bhatti Marriage Hall</h3>
                  <p>Saturday, 21 November 2026</p>
                </div>
                <a
                  className="venue-link"
                  href={walimaMap}
                  target="_blank"
                  rel="noreferrer"
                  data-testid="link-map-walima"
                >
                  Open directions <ArrowUpRight size={15} />
                </a>
              </article>
            </div>
          </div>
        </section>

        <section className="gallery-section" aria-label="Wedding photographs" data-testid="section-gallery">
          <div className="section-wrap">
            <div className="gallery-placeholder" data-testid="empty-gallery">
              <div className="gallery-copy">
                <Sparkles className="gallery-spark" size={17} aria-hidden="true" />
                <h2>Memories, soon</h2>
                <p>A little space for photographs from our celebrations. We look forward to sharing them with you.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="rsvp-section" aria-labelledby="rsvp-title" data-testid="section-rsvp">
          <p className="section-label">Your presence is a gift</p>
          <h2 id="rsvp-title">Will you join us?</h2>
          <p>Kindly let our families know if we may count you among our guests.</p>
          <a className="rsvp-button" href={rsvpUrl} target="_blank" rel="noreferrer" data-testid="link-rsvp">
            Respond to invitation <ArrowUpRight size={15} />
          </a>
        </section>

        <footer className="footer-section" data-testid="section-contacts">
          <div className="footer-inner">
            <div className="contact-layout">
              <div className="contact-title">
                <p className="section-label">Questions or wishes</p>
                <h2>Reach our families</h2>
                <p>We would be happy to hear from you.</p>
              </div>
              <div className="contact-list" aria-label="Family contact numbers">
                {contacts.map((number, index) => (
                  <a
                    className="contact-link"
                    href={`tel:${number.replaceAll('-', '')}`}
                    key={number}
                    data-testid={`link-contact-${index + 1}`}
                  >
                    <Phone size={14} /> {number}
                  </a>
                ))}
              </div>
            </div>
            <div className="footer-bottom">
              <p>With love, Asim &amp; Sana</p>
              <p>20 — 21 November 2026</p>
            </div>
          </div>
        </footer>
      </div>
      <a href="#couple-title" className="sr-only" data-testid="link-back-to-invitation">Return to invitation</a>
      <span className="sr-only" data-testid="text-countdown-timezone">Countdown calculated to midnight Pakistan Standard Time (UTC+05:00).</span>
      <a href="#couple-title" className="skip-link" data-testid="link-skip-to-invitation"><ArrowDown size={14} /> Invitation details</a>
      <StarPointer />
    </main>
  );
}

export default App;
