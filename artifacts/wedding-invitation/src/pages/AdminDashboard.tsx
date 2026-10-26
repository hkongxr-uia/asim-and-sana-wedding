import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import {
  Users,
  UserPlus,
  Search,
  Copy,
  Check,
  RefreshCw,
  LogOut,
  Lock,
  Globe,
  Laptop,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Edit2,
  X,
  ExternalLink,
  Calendar,
  Heart,
  Save,
  MapPin,
  Link2,
  Clock,
} from 'lucide-react';
import '@/admin.css';
import { parseEventTimings } from '@/App';

interface EventItem {
  id: string;
  name: string;
  event_date: string;
  event_time?: string;
  venue_name?: string;
  map_link?: string;
  description?: string;
  is_enabled: boolean;
  sort_order: number;
}

interface EventDraft {
  event_date: string;
  venue_name: string;
  map_link: string;
  functionTime: string;
  subTime1: string;
  subTime2: string;
  subTime3: string;
}

interface GuestItem {
  id: string;
  display_name: string;
  seats_reserved: number;
  invite_token: string;
  is_active: boolean;
  created_at: string;
  assigned_event_ids: string[];
}

const ADMIN_UID = '90ea5a7e-baa2-458f-aa80-0e93909d68f8';
const DEFAULT_PROD_DOMAIN = 'https://asim-and-sana-wedding.vercel.app';

export default function AdminDashboard() {
  const [sessionUser, setSessionUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Active top tab
  const [activeTab, setActiveTab] = useState<'guests' | 'wedding'>('guests');

  // Login form
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loggingIn, setLoggingIn] = useState(false);

  // Data
  const [events, setEvents] = useState<EventItem[]>([]);
  const [guests, setGuests] = useState<GuestItem[]>([]);
  const [dataLoading, setDataLoading] = useState(false);
  const [dataError, setDataError] = useState('');

  // Wedding Details
  const [weddingDetailsId, setWeddingDetailsId] = useState<string | null>(null);
  const [groomName, setGroomName] = useState('');
  const [brideName, setBrideName] = useState('');
  const [savingNames, setSavingNames] = useState(false);
  const [namesStatus, setNamesStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Event date/time drafts
  const [eventDrafts, setEventDrafts] = useState<Record<string, EventDraft>>({});
  const [savingEventId, setSavingEventId] = useState<string | null>(null);
  const [eventStatuses, setEventStatuses] = useState<Record<string, { type: 'success' | 'error'; message: string }>>({});

  // Add Guest form
  const [newName, setNewName] = useState('');
  const [newSeats, setNewSeats] = useState(1);
  const [newSelectedEvents, setNewSelectedEvents] = useState<string[]>([]);
  const [savingGuest, setSavingGuest] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [recentlyCreated, setRecentlyCreated] = useState<{ name: string; token: string } | null>(null);

  // URL mode
  const [urlMode, setUrlMode] = useState<'production' | 'local'>('production');
  const [prodBaseUrl, setProdBaseUrl] = useState(DEFAULT_PROD_DOMAIN);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Search
  const [search, setSearch] = useState('');

  // Edit modal
  const [editingGuest, setEditingGuest] = useState<GuestItem | null>(null);
  const [editName, setEditName] = useState('');
  const [editSeats, setEditSeats] = useState(1);
  const [editEvents, setEditEvents] = useState<string[]>([]);
  const [savingEdit, setSavingEdit] = useState(false);

  // Regen modal
  const [confirmRegenGuest, setConfirmRegenGuest] = useState<GuestItem | null>(null);
  const [regenerating, setRegenerating] = useState(false);

  // ─── AUTH ───────────────────────────────────────────────────────────────────
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSessionUser(session?.user ?? null);
      setAuthLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSessionUser(session?.user ?? null);
      setAuthLoading(false);
    });
    return () => subscription.unsubscribe();
  }, []);

  const isAdmin = useMemo(() => sessionUser?.id === ADMIN_UID, [sessionUser]);

  // ─── DATA LOADING ───────────────────────────────────────────────────────────
  const loadData = async () => {
    setDataLoading(true);
    setDataError('');
    try {
      const { data: detailsData } = await supabase
        .from('wedding_details')
        .select('*')
        .limit(1)
        .single();

      if (detailsData) {
        setWeddingDetailsId(detailsData.id);
        setGroomName(detailsData.groom_name || '');
        setBrideName(detailsData.bride_name || '');
      }

      const { data: eventsData, error: eventsError } = await supabase
        .from('events')
        .select('*')
        .order('sort_order', { ascending: true });

      if (eventsError) throw eventsError;

      const loaded: EventItem[] = eventsData || [];
      setEvents(loaded);

      const drafts: Record<string, EventDraft> = {};
      loaded.forEach((e) => {
        const t = parseEventTimings(e.event_time, e.name);
        drafts[e.id] = {
          event_date: e.event_date || '',
          venue_name: e.venue_name || '',
          map_link: e.map_link || '',
          functionTime: t.functionTime,
          subTime1: t.subTime1,
          subTime2: t.subTime2,
          subTime3: t.subTime3,
        };
      });
      setEventDrafts(drafts);

      if (newSelectedEvents.length === 0) {
        setNewSelectedEvents(loaded.filter((e) => e.is_enabled).map((e) => e.id));
      }

      const { data: guestsData, error: guestsError } = await supabase.rpc('admin_get_guest_list');
      if (guestsError) throw guestsError;
      setGuests(guestsData || []);
    } catch (err: any) {
      setDataError(err.message || 'Failed to load data. Please refresh.');
    } finally {
      setDataLoading(false);
    }
  };

  useEffect(() => { if (isAdmin) loadData(); }, [isAdmin]);

  // ─── LOGIN / LOGOUT ─────────────────────────────────────────────────────────
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setLoggingIn(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
      if (error) { setLoginError(error.message); return; }
      if (data.user?.id !== ADMIN_UID) {
        await supabase.auth.signOut();
        setLoginError('Access denied: this account is not an authorized administrator.');
      }
    } catch (err: any) {
      setLoginError(err.message || 'Login failed.');
    } finally {
      setLoggingIn(false);
    }
  };

  const handleLogout = () => supabase.auth.signOut();

  // ─── COUPLE NAMES ───────────────────────────────────────────────────────────
  const handleSaveCoupleNames = async (e: React.FormEvent) => {
    e.preventDefault();
    setNamesStatus(null);
    const g = groomName.trim(), b = brideName.trim();
    if (!g) return setNamesStatus({ type: 'error', message: "Groom's name cannot be blank." });
    if (!b) return setNamesStatus({ type: 'error', message: "Bride's name cannot be blank." });
    if (!weddingDetailsId) return setNamesStatus({ type: 'error', message: 'No wedding details record found.' });

    setSavingNames(true);
    try {
      const { data, error } = await supabase
        .from('wedding_details')
        .update({ groom_name: g, bride_name: b })
        .eq('id', weddingDetailsId)
        .select();

      if (error) setNamesStatus({ type: 'error', message: error.message });
      else if (!data?.length) setNamesStatus({ type: 'error', message: 'Record not updated — check permissions.' });
      else {
        setNamesStatus({ type: 'success', message: 'Names saved! Changes reflect on all public pages.' });
        setTimeout(() => setNamesStatus(null), 4000);
      }
    } catch (err: any) {
      setNamesStatus({ type: 'error', message: err.message });
    } finally {
      setSavingNames(false);
    }
  };

  // ─── EVENT DATE/TIME ────────────────────────────────────────────────────────
  const handleEventDraftChange = (id: string, field: keyof EventDraft, value: string) => {
    setEventDrafts((prev) => ({ ...prev, [id]: { ...prev[id], [field]: value } }));
  };

  const handleSaveEvent = async (evt: EventItem) => {
    setEventStatuses((p) => { const c = { ...p }; delete c[evt.id]; return c; });
    const draft = eventDrafts[evt.id];
    if (!draft?.event_date) return setEventStatuses((p) => ({ ...p, [evt.id]: { type: 'error', message: 'Date is required.' } }));

    const lower = evt.name.toLowerCase();
    const isNikkah = lower.includes('nikkah');
    const isBaraat = lower.includes('barat') || lower.includes('baraat');
    const isWalima = lower.includes('walima');
    const hasVenue = isBaraat || isWalima;

    // Validate map link URL if provided for venue events
    if (hasVenue && draft.map_link?.trim()) {
      try { new URL(draft.map_link.trim()); } catch {
        return setEventStatuses((p) => ({ ...p, [evt.id]: { type: 'error', message: 'Map link must be a valid URL (starting with https://).' } }));
      }
    }

    const serializedTime = JSON.stringify({
      functionTime: (draft.functionTime || '').trim() || (isBaraat ? '7:00 PM' : isWalima ? '7:30 PM' : '05:00 PM'),
      subTime1: (draft.subTime1 || '').trim() || (isNikkah ? '05:00 PM' : '06:00 PM'),
      subTime2: (draft.subTime2 || '').trim() || (isNikkah ? '06:30 PM' : '08:30 PM'),
      subTime3: (draft.subTime3 || '').trim() || (isBaraat ? '09:30 PM' : ''),
    });

    setSavingEventId(evt.id);
    try {
      const updatePayload: Record<string, string> = {
        event_date: draft.event_date,
        event_time: serializedTime,
      };

      // Only update venue/map for Baraat & Walima
      if (hasVenue) {
        updatePayload.venue_name = (draft.venue_name || '').trim();
        updatePayload.map_link = (draft.map_link || '').trim();
      }

      const { data, error } = await supabase
        .from('events')
        .update(updatePayload)
        .eq('id', evt.id)
        .select();

      if (error) setEventStatuses((p) => ({ ...p, [evt.id]: { type: 'error', message: error.message } }));
      else if (!data?.length) setEventStatuses((p) => ({ ...p, [evt.id]: { type: 'error', message: 'Event not found or not updated.' } }));
      else {
        setEvents((p) => p.map((e) => e.id === evt.id ? {
          ...e,
          event_date: draft.event_date,
          event_time: serializedTime,
          ...(hasVenue ? { venue_name: (draft.venue_name || '').trim(), map_link: (draft.map_link || '').trim() } : {}),
        } : e));
        setEventStatuses((p) => ({ ...p, [evt.id]: { type: 'success', message: 'Updated successfully!' } }));
        setTimeout(() => setEventStatuses((p) => { const c = { ...p }; if (c[evt.id]?.type === 'success') delete c[evt.id]; return c; }), 4000);
      }
    } catch (err: any) {
      setEventStatuses((p) => ({ ...p, [evt.id]: { type: 'error', message: err.message } }));
    } finally {
      setSavingEventId(null);
    }
  };

  // ─── ADD GUEST ──────────────────────────────────────────────────────────────
  const handleAddGuest = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveError('');
    setRecentlyCreated(null);
    const name = newName.trim();
    if (!name) return setSaveError('Guest name is required.');
    if (newSeats < 1) return setSaveError('Reserved seats must be at least 1.');
    if (newSelectedEvents.length === 0) return setSaveError('Select at least one event.');

    setSavingGuest(true);
    try {
      const { data, error } = await supabase.rpc('admin_create_guest', {
        p_display_name: name,
        p_seats_reserved: newSeats,
        p_event_ids: newSelectedEvents,
      });
      if (error) throw error;
      if (!data?.length) throw new Error('Failed to create guest.');
      setRecentlyCreated({ name: data[0].display_name, token: data[0].invite_token });
      setNewName('');
      setNewSeats(1);
      await loadData();
    } catch (err: any) {
      setSaveError(err.message || 'Failed to create guest.');
    } finally {
      setSavingGuest(false);
    }
  };

  // ─── EDIT GUEST ─────────────────────────────────────────────────────────────
  const openEditModal = (g: GuestItem) => {
    setEditingGuest(g);
    setEditName(g.display_name);
    setEditSeats(g.seats_reserved);
    setEditEvents(g.assigned_event_ids ? [...g.assigned_event_ids] : []);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingGuest) return;
    const name = editName.trim();
    if (!name) return alert('Guest name cannot be empty.');
    if (editSeats < 1) return alert('Seats must be at least 1.');
    if (editEvents.length === 0) return alert('Select at least one event.');

    setSavingEdit(true);
    try {
      const { error } = await supabase.rpc('admin_update_guest', {
        p_guest_id: editingGuest.id,
        p_display_name: name,
        p_seats_reserved: editSeats,
        p_event_ids: editEvents,
      });
      if (error) throw error;
      setEditingGuest(null);
      await loadData();
    } catch (err: any) {
      alert('Failed to update: ' + err.message);
    } finally {
      setSavingEdit(false);
    }
  };

  // ─── TOGGLE ACTIVE ──────────────────────────────────────────────────────────
  const handleToggleActive = async (g: GuestItem) => {
    const action = g.is_active ? 'deactivate' : 'reactivate';
    if (!confirm(`${action.charAt(0).toUpperCase() + action.slice(1)} the invitation for "${g.display_name}"?`)) return;
    try {
      const { error } = await supabase.rpc('admin_toggle_guest_active', { p_guest_id: g.id, p_is_active: !g.is_active });
      if (error) throw error;
      await loadData();
    } catch (err: any) {
      alert('Failed: ' + err.message);
    }
  };

  // ─── REGEN TOKEN ────────────────────────────────────────────────────────────
  const handleRegenerateToken = async () => {
    if (!confirmRegenGuest) return;
    setRegenerating(true);
    try {
      const { data, error } = await supabase.rpc('admin_regenerate_token', { p_guest_id: confirmRegenGuest.id });
      if (error) throw error;
      setConfirmRegenGuest(null);
      await loadData();
      if (data?.[0]?.invite_token) copyInviteLink(data[0].invite_token, confirmRegenGuest.id);
    } catch (err: any) {
      alert('Failed: ' + err.message);
    } finally {
      setRegenerating(false);
    }
  };

  // ─── LINK HELPERS ───────────────────────────────────────────────────────────
  const getInviteLink = (token: string) => {
    if (urlMode === 'local') {
      const port = window.location.port ? `:${window.location.port}` : '';
      return `${window.location.protocol}//${window.location.hostname}${port}/invite/${token}`;
    }
    return `${prodBaseUrl.trim().replace(/\/+$/, '')}/invite/${token}`;
  };

  const copyInviteLink = async (token: string, id: string) => {
    const link = getInviteLink(token);
    try {
      if (navigator?.clipboard?.writeText) await navigator.clipboard.writeText(link);
      else {
        const ta = document.createElement('textarea');
        ta.value = link;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      }
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2500);
    } catch {
      alert('Could not auto-copy. Link: ' + link);
    }
  };

  const filteredGuests = useMemo(() => {
    if (!search.trim()) return guests;
    const q = search.toLowerCase();
    return guests.filter((g) => g.display_name.toLowerCase().includes(q));
  }, [guests, search]);

  const activeCount = guests.filter((g) => g.is_active).length;

  // ────────────────────────────────────────────────────────────────────────────
  // AUTH SCREENS
  // ────────────────────────────────────────────────────────────────────────────
  if (authLoading) {
    return (
      <div className="login-backdrop">
        <div style={{ color: 'var(--admin-gold)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
          <RefreshCw size={18} className="spinning" /> Verifying session…
        </div>
      </div>
    );
  }

  if (!sessionUser) {
    return (
      <div className="login-backdrop">
        <div className="login-card">
          <div className="login-header">
            <div className="login-icon-box"><Lock size={22} color="var(--admin-gold)" /></div>
            <h2>Admin Portal</h2>
            <p>Sign in with your administrator credentials to continue.</p>
          </div>
          {loginError && <div className="login-error-msg">{loginError}</div>}
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label className="form-label" htmlFor="admin-email">Email Address</label>
              <input id="admin-email" type="email" className="form-input" placeholder="admin@example.com"
                value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="admin-pass">Password</label>
              <input id="admin-pass" type="password" className="form-input" placeholder="••••••••••"
                value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '0.25rem' }} disabled={loggingIn}>
              {loggingIn ? <><RefreshCw size={16} className="spinning" /> Verifying…</> : 'Sign In to Dashboard'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="login-backdrop">
        <div className="login-card" style={{ textAlign: 'center' }}>
          <div className="login-icon-box" style={{ background: 'var(--admin-rose-bg)', margin: '0 auto 1rem' }}>
            <XCircle size={24} color="var(--admin-rose)" />
          </div>
          <h2>Unauthorized</h2>
          <p style={{ marginTop: '0.5rem', color: 'var(--admin-text-muted)', fontSize: '0.85rem' }}>
            Signed in as <strong>{sessionUser.email}</strong>. This account does not have admin access.
          </p>
          <button onClick={handleLogout} className="btn-secondary" style={{ width: '100%', marginTop: '1.5rem' }}>
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </div>
    );
  }

  // ────────────────────────────────────────────────────────────────────────────
  // MAIN DASHBOARD
  // ────────────────────────────────────────────────────────────────────────────
  return (
    <div className="admin-layout">
      <div className="admin-container">

        {/* ── Header ── */}
        <header className="admin-header">
          <div className="admin-title-area">
            <h1>Wedding Admin Portal</h1>
            <p>Private management portal • Row-Level Security enforced via Supabase</p>
          </div>
          <div className="admin-user-bar">
            <span className="admin-badge">
              <span className="admin-badge-dot" /> Admin Verified
            </span>
            <button onClick={handleLogout} className="btn-subtle">
              <LogOut size={15} /> Sign Out
            </button>
          </div>
        </header>

        {/* ── Tabs ── */}
        <nav className="admin-tabs-nav">
          <button
            type="button"
            className={`admin-tab-btn ${activeTab === 'guests' ? 'active' : ''}`}
            onClick={() => setActiveTab('guests')}
          >
            <Users size={17} /> Guest Management
          </button>
          <button
            type="button"
            className={`admin-tab-btn ${activeTab === 'wedding' ? 'active' : ''}`}
            onClick={() => setActiveTab('wedding')}
          >
            <Heart size={17} /> Wedding Details &amp; Schedule
          </button>
        </nav>

        {/* ── Data error banner ── */}
        {dataError && (
          <div className="alert-error">
            <AlertTriangle size={16} />
            <span style={{ flex: 1 }}>{dataError}</span>
            <button className="btn-subtle" onClick={loadData} style={{ padding: '0.2rem 0.6rem', fontSize: '0.78rem' }}>
              Retry
            </button>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════════════
            TAB: GUEST MANAGEMENT
        ══════════════════════════════════════════════════════════════════════ */}
        {activeTab === 'guests' && (
          <>
            {/* ── Top bar: stats + domain switcher ── */}
            <div className="guest-top-bar">
              <div className="guest-quick-stats">
                <div className="quick-stat-item">
                  <span className="quick-stat-label">Total Guests</span>
                  <span className="quick-stat-val">{guests.length}</span>
                </div>
                <div className="quick-stat-divider" />
                <div className="quick-stat-item">
                  <span className="quick-stat-label">Active Links</span>
                  <span className="quick-stat-val text-emerald">{activeCount}</span>
                </div>
                <div className="quick-stat-divider" />
                <div className="quick-stat-item">
                  <span className="quick-stat-label">Deactivated</span>
                  <span className="quick-stat-val">{guests.length - activeCount}</span>
                </div>
              </div>

              <div className="link-domain-box">
                <div className="link-domain-mode-row">
                  <span className="link-domain-title">
                    <Globe size={14} color="var(--admin-gold)" /> Link Domain
                  </span>
                  <div className="domain-segmented-pills">
                    <button
                      type="button"
                      className={`domain-segment-btn ${urlMode === 'production' ? 'active' : ''}`}
                      onClick={() => setUrlMode('production')}
                    >
                      <Globe size={13} /> Production
                    </button>
                    <button
                      type="button"
                      className={`domain-segment-btn ${urlMode === 'local' ? 'active' : ''}`}
                      onClick={() => setUrlMode('local')}
                    >
                      <Laptop size={13} /> Local
                    </button>
                  </div>
                </div>
                {urlMode === 'production' && (
                  <div className="domain-input-inline">
                    <input
                      type="text"
                      className="domain-input"
                      value={prodBaseUrl}
                      onChange={(e) => setProdBaseUrl(e.target.value)}
                      placeholder="https://your-domain.com"
                    />
                    <span className="domain-badge-live">✓ Live</span>
                  </div>
                )}
                {urlMode === 'local' && (
                  <span style={{ fontSize: '0.72rem', color: '#fb923c' }}>
                    ⚠ Local — do not share these links with guests
                  </span>
                )}
              </div>
            </div>

            {/* ── Main grid: Add Guest | Guest Directory ── */}
            <div className="admin-grid-main">

              {/* ── ADD GUEST FORM ── */}
              <div className="admin-card">
                <div className="card-header">
                  <div className="card-icon"><UserPlus size={18} color="var(--admin-gold)" /></div>
                  <div>
                    <h2 className="card-title">Add New Guest</h2>
                    <p className="card-subtitle">Generate a personalised invitation link</p>
                  </div>
                </div>

                {saveError && (
                  <div className="alert-error"><AlertTriangle size={15} /> {saveError}</div>
                )}

                <form onSubmit={handleAddGuest}>
                  <div className="form-group">
                    <label className="form-label" htmlFor="guest-name">Guest / Family Name *</label>
                    <input
                      id="guest-name"
                      type="text"
                      className="form-input"
                      placeholder="e.g. Uncle Tariq &amp; Family"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.45rem' }}>
                      <label className="form-label" style={{ margin: 0 }} htmlFor="guest-seats">Reserved Seats *</label>
                      <span style={{ fontSize: '0.72rem', color: 'var(--admin-text-muted)' }}>🔒 Private — not shown on invite</span>
                    </div>
                    <input
                      id="guest-seats"
                      type="number"
                      min={1}
                      max={50}
                      className="form-input"
                      value={newSeats}
                      onChange={(e) => setNewSeats(Math.max(1, parseInt(e.target.value) || 1))}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Assigned Events *</label>
                    <div className="event-checkbox-list">
                      {events.map((evt) => {
                        const checked = newSelectedEvents.includes(evt.id);
                        return (
                          <label key={evt.id} className={`event-checkbox-item ${checked ? 'checked' : ''}`}>
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={(e) => {
                                if (e.target.checked) setNewSelectedEvents([...newSelectedEvents, evt.id]);
                                else setNewSelectedEvents(newSelectedEvents.filter((id) => id !== evt.id));
                              }}
                            />
                            <span className="event-checkbox-label">{evt.name}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  <button type="submit" className="btn-primary" style={{ width: '100%' }} disabled={savingGuest}>
                    {savingGuest
                      ? <><RefreshCw size={16} className="spinning" /> Creating…</>
                      : <><UserPlus size={16} /> Save &amp; Generate Link</>}
                  </button>
                </form>

                {/* Success: newly created guest link */}
                {recentlyCreated && (
                  <div className="link-copy-box" style={{ marginTop: '1.25rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--admin-emerald)', fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.35rem' }}>
                      <CheckCircle2 size={16} /> {recentlyCreated.name} created!
                    </div>
                    <p style={{ margin: '0 0 0.6rem', fontSize: '0.78rem', color: 'var(--admin-text-muted)' }}>
                      Copy and share this private invitation link:
                    </p>
                    <div className="link-copy-row">
                      <input type="text" readOnly value={getInviteLink(recentlyCreated.token)} />
                      <button
                        type="button"
                        className="btn-primary"
                        style={{ padding: '0.45rem 0.85rem', whiteSpace: 'nowrap', flexShrink: 0 }}
                        onClick={() => copyInviteLink(recentlyCreated.token, 'recent')}
                      >
                        {copiedId === 'recent' ? <><Check size={14} /> Copied!</> : <><Copy size={14} /> Copy</>}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* ── GUEST DIRECTORY ── */}
              <div className="admin-card">
                <div className="guest-directory-header">
                  <div className="card-header" style={{ margin: 0, gap: '0.85rem', flex: 1 }}>
                    <div className="card-icon"><Users size={18} color="var(--admin-gold)" /></div>
                    <div>
                      <h2 className="card-title">
                        Guest Directory
                        <span className="count-pill">{filteredGuests.length} / {guests.length}</span>
                      </h2>
                      <p className="card-subtitle">Search, edit, deactivate, or regenerate links</p>
                    </div>
                  </div>
                  <button onClick={loadData} className="btn-subtle" disabled={dataLoading} style={{ flexShrink: 0 }}>
                    <RefreshCw size={14} className={dataLoading ? 'spinning' : ''} /> Refresh
                  </button>
                </div>

                {/* Search */}
                <div className="search-bar">
                  <Search size={15} className="search-icon" />
                  <input
                    type="text"
                    className="form-input search-input"
                    placeholder="Search by guest name…"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  {search && (
                    <button className="search-clear-btn" onClick={() => setSearch('')}>
                      <X size={14} />
                    </button>
                  )}
                </div>

                {/* Table */}
                {dataLoading && guests.length === 0 ? (
                  <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--admin-text-muted)' }}>
                    <RefreshCw size={22} className="spinning" style={{ display: 'block', margin: '0 auto 0.75rem', color: 'var(--admin-gold)' }} />
                    Loading guest records…
                  </div>
                ) : filteredGuests.length === 0 ? (
                  <div style={{ padding: '2.5rem', textAlign: 'center', color: 'var(--admin-text-muted)', fontSize: '0.88rem' }}>
                    {search ? 'No guests match your search.' : 'No guests yet — add one using the form.'}
                  </div>
                ) : (
                  <div className="table-wrapper">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Guest / Family</th>
                          <th>Seats</th>
                          <th>Events</th>
                          <th>Status</th>
                          <th>Invite Link</th>
                          <th style={{ textAlign: 'right' }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredGuests.map((g) => {
                          const isCopied = copiedId === g.id;
                          return (
                            <tr key={g.id} className={!g.is_active ? 'row-inactive' : ''}>

                              {/* Name + date */}
                              <td className="cell-guest">
                                <div className="guest-name">{g.display_name}</div>
                                <div className="guest-date">
                                  Added {new Date(g.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                                </div>
                              </td>

                              {/* Seats */}
                              <td className="cell-seats">
                                <span className="seats-badge">
                                  {g.seats_reserved} {g.seats_reserved === 1 ? 'seat' : 'seats'}
                                </span>
                              </td>

                              {/* Event tags */}
                              <td className="cell-events">
                                <div className="event-badges-container">
                                  {events
                                    .filter((e) => g.assigned_event_ids?.includes(e.id))
                                    .map((e) => (
                                      <span key={e.id} className="badge-event">
                                        {e.name.replace(/^The\s+/i, '')}
                                      </span>
                                    ))}
                                </div>
                              </td>

                              {/* Status */}
                              <td className="cell-status">
                                <span className={`status-pill ${g.is_active ? 'active' : 'inactive'}`}>
                                  <span className="status-dot" />
                                  {g.is_active ? 'Active' : 'Deactivated'}
                                </span>
                              </td>

                              {/* Copy + open */}
                              <td className="cell-link">
                                <div className="link-cell-group">
                                  <button
                                    className={`btn-copy-link ${isCopied ? 'copied' : ''}`}
                                    onClick={() => copyInviteLink(g.invite_token, g.id)}
                                    disabled={!g.is_active}
                                    title="Copy invitation link"
                                  >
                                    {isCopied ? <><Check size={13} /> Copied!</> : <><Copy size={13} /> Copy Link</>}
                                  </button>
                                  <a
                                    href={getInviteLink(g.invite_token)}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="btn-icon-link"
                                    title="Preview invitation"
                                  >
                                    <ExternalLink size={13} />
                                  </a>
                                </div>
                              </td>

                              {/* Row actions */}
                              <td className="cell-actions">
                                <div className="row-actions-group">
                                  <button
                                    className="btn-row-action action-edit"
                                    onClick={() => openEditModal(g)}
                                    title="Edit guest"
                                  >
                                    <Edit2 size={14} />
                                  </button>
                                  <button
                                    className="btn-row-action action-regen"
                                    onClick={() => setConfirmRegenGuest(g)}
                                    title="Regenerate link"
                                  >
                                    <RefreshCw size={14} />
                                  </button>
                                  <button
                                    className={`btn-row-action ${g.is_active ? 'action-status-deactivate' : 'action-status-reactivate'}`}
                                    onClick={() => handleToggleActive(g)}
                                    title={g.is_active ? 'Deactivate link' : 'Reactivate link'}
                                  >
                                    {g.is_active ? <XCircle size={14} /> : <CheckCircle2 size={14} />}
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* ══════════════════════════════════════════════════════════════════════
            TAB: WEDDING DETAILS & SCHEDULE
        ══════════════════════════════════════════════════════════════════════ */}
        {activeTab === 'wedding' && (
          <div className="details-grid">

            {/* Couple Names */}
            <div className="admin-card">
              <div className="card-header">
                <div className="card-icon"><Heart size={18} color="var(--admin-gold)" /></div>
                <div>
                  <h2 className="card-title">Couple Names</h2>
                  <p className="card-subtitle">Updates headings, invitation copy &amp; calendar files</p>
                </div>
              </div>

              {namesStatus && (
                <div className={namesStatus.type === 'success' ? 'alert-success' : 'alert-error'}>
                  {namesStatus.type === 'success' ? <CheckCircle2 size={15} /> : <AlertTriangle size={15} />}
                  <span>{namesStatus.message}</span>
                </div>
              )}

              <form onSubmit={handleSaveCoupleNames}>
                <div className="form-group">
                  <label className="form-label" htmlFor="groom-name">Groom&apos;s Name *</label>
                  <input id="groom-name" type="text" className="form-input"
                    value={groomName} onChange={(e) => setGroomName(e.target.value)}
                    placeholder="e.g. Asim" required />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="bride-name">Bride&apos;s Name *</label>
                  <input id="bride-name" type="text" className="form-input"
                    value={brideName} onChange={(e) => setBrideName(e.target.value)}
                    placeholder="e.g. Sana" required />
                </div>
                <p style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)', lineHeight: '1.5', marginBottom: '1rem' }}>
                  ℹ️ Names update all site text, headings &amp; calendar exports.
                  Intro video titles are baked into the video and cannot be changed here.
                </p>
                <button type="submit" className="btn-primary" style={{ width: '100%' }} disabled={savingNames}>
                  {savingNames ? <><RefreshCw size={15} className="spinning" /> Saving…</> : <><Save size={15} /> Save Couple Names</>}
                </button>
              </form>
            </div>

            {/* Celebration Schedule */}
            <div className="admin-card">
              <div className="card-header">
                <div className="card-icon"><Calendar size={18} color="var(--admin-gold)" /></div>
                <div>
                  <h2 className="card-title">Celebration Schedule</h2>
                  <p className="card-subtitle">Edit dates &amp; times in PKT (UTC+5)</p>
                </div>
              </div>

              {events.length === 0 ? (
                <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--admin-text-muted)' }}>Loading events…</div>
              ) : events.map((evt, idx) => {
                const draft = eventDrafts[evt.id] || {
                  event_date: evt.event_date || '',
                  venue_name: evt.venue_name || '',
                  map_link: evt.map_link || '',
                  functionTime: '',
                  subTime1: '',
                  subTime2: '',
                  subTime3: '',
                };
                const isSavingThis = savingEventId === evt.id;
                const status = eventStatuses[evt.id];
                const lower = evt.name.toLowerCase();
                const isNikkah = lower.includes('nikkah');
                const isBaraat = lower.includes('barat') || lower.includes('baraat');
                const isWalima = lower.includes('walima');
                const hasVenue = isBaraat || isWalima;

                return (
                  <div key={evt.id} className="event-edit-card">
                    <div className="event-edit-header">
                      <div>
                        <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--admin-gold)', fontWeight: 700, marginBottom: '0.2rem' }}>
                          Day 0{idx + 1}
                        </div>
                        <h3 style={{ margin: 0, fontSize: '1rem', color: '#fff' }}>{evt.name}</h3>
                      </div>
                      <span className={`status-pill ${evt.is_enabled ? 'active' : 'inactive'}`} style={{ fontSize: '0.7rem' }}>
                        <span className="status-dot" />
                        {evt.is_enabled ? 'Enabled' : 'Disabled'}
                      </span>
                    </div>

                    {status && (
                      <div className={status.type === 'success' ? 'alert-success' : 'alert-error'} style={{ padding: '0.45rem 0.75rem', margin: 0, fontSize: '0.8rem' }}>
                        {status.type === 'success' ? <CheckCircle2 size={14} /> : <AlertTriangle size={14} />}
                        {status.message}
                      </div>
                    )}

                    {/* Date input */}
                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label" style={{ fontSize: '0.78rem' }}>Date (YYYY-MM-DD) *</label>
                      <input
                        type="date"
                        className="form-input"
                        value={draft.event_date}
                        onChange={(e) => handleEventDraftChange(evt.id, 'event_date', e.target.value)}
                        required
                      />
                    </div>

                    {/* Timings section */}
                    <div className="event-venue-section">
                      <div className="event-venue-divider">
                        <Clock size={13} color="var(--admin-gold)" />
                        <span>Schedule Timings (PKT)</span>
                      </div>

                      {/* Baraat Timing Inputs */}
                      {isBaraat && (
                        <div className="event-timings-grid">
                          <div className="form-group" style={{ margin: 0 }}>
                            <label className="form-label" style={{ fontSize: '0.78rem' }}>Function Timing</label>
                            <input
                              type="text"
                              className="form-input"
                              value={draft.functionTime}
                              onChange={(e) => handleEventDraftChange(evt.id, 'functionTime', e.target.value)}
                              placeholder="7:00 PM"
                            />
                          </div>
                          <div className="form-group" style={{ margin: 0 }}>
                            <label className="form-label" style={{ fontSize: '0.78rem' }}>Baraat Arrival</label>
                            <input
                              type="text"
                              className="form-input"
                              value={draft.subTime1}
                              onChange={(e) => handleEventDraftChange(evt.id, 'subTime1', e.target.value)}
                              placeholder="06:00 PM"
                            />
                          </div>
                          <div className="form-group" style={{ margin: 0 }}>
                            <label className="form-label" style={{ fontSize: '0.78rem' }}>Dinner</label>
                            <input
                              type="text"
                              className="form-input"
                              value={draft.subTime2}
                              onChange={(e) => handleEventDraftChange(evt.id, 'subTime2', e.target.value)}
                              placeholder="08:30 PM"
                            />
                          </div>
                          <div className="form-group" style={{ margin: 0 }}>
                            <label className="form-label" style={{ fontSize: '0.78rem' }}>Rukhsati</label>
                            <input
                              type="text"
                              className="form-input"
                              value={draft.subTime3}
                              onChange={(e) => handleEventDraftChange(evt.id, 'subTime3', e.target.value)}
                              placeholder="09:30 PM"
                            />
                          </div>
                        </div>
                      )}

                      {/* Walima Timing Inputs */}
                      {isWalima && (
                        <div className="event-timings-grid">
                          <div className="form-group" style={{ margin: 0 }}>
                            <label className="form-label" style={{ fontSize: '0.78rem' }}>Function Timing</label>
                            <input
                              type="text"
                              className="form-input"
                              value={draft.functionTime}
                              onChange={(e) => handleEventDraftChange(evt.id, 'functionTime', e.target.value)}
                              placeholder="7:30 PM"
                            />
                          </div>
                          <div className="form-group" style={{ margin: 0 }}>
                            <label className="form-label" style={{ fontSize: '0.78rem' }}>Guest Welcome</label>
                            <input
                              type="text"
                              className="form-input"
                              value={draft.subTime1}
                              onChange={(e) => handleEventDraftChange(evt.id, 'subTime1', e.target.value)}
                              placeholder="06:00 PM"
                            />
                          </div>
                          <div className="form-group" style={{ margin: 0 }}>
                            <label className="form-label" style={{ fontSize: '0.78rem' }}>Dinner</label>
                            <input
                              type="text"
                              className="form-input"
                              value={draft.subTime2}
                              onChange={(e) => handleEventDraftChange(evt.id, 'subTime2', e.target.value)}
                              placeholder="08:30 PM"
                            />
                          </div>
                        </div>
                      )}

                      {/* Nikkah Timing Inputs */}
                      {isNikkah && (
                        <div className="event-timings-grid">
                          <div className="form-group" style={{ margin: 0 }}>
                            <label className="form-label" style={{ fontSize: '0.78rem' }}>Ceremony Time</label>
                            <input
                              type="text"
                              className="form-input"
                              value={draft.subTime1}
                              onChange={(e) => handleEventDraftChange(evt.id, 'subTime1', e.target.value)}
                              placeholder="05:00 PM"
                            />
                          </div>
                          <div className="form-group" style={{ margin: 0 }}>
                            <label className="form-label" style={{ fontSize: '0.78rem' }}>Dua & Refreshments</label>
                            <input
                              type="text"
                              className="form-input"
                              value={draft.subTime2}
                              onChange={(e) => handleEventDraftChange(evt.id, 'subTime2', e.target.value)}
                              placeholder="06:30 PM"
                            />
                          </div>
                        </div>
                      )}

                      {!isNikkah && !isBaraat && !isWalima && (
                        <div className="form-group" style={{ margin: 0 }}>
                          <label className="form-label" style={{ fontSize: '0.78rem' }}>Function Timing</label>
                          <input
                            type="text"
                            className="form-input"
                            value={draft.functionTime}
                            onChange={(e) => handleEventDraftChange(evt.id, 'functionTime', e.target.value)}
                            placeholder="06:00 PM to 09:30 PM"
                          />
                        </div>
                      )}
                    </div>

                    {/* Venue & Map — Baraat and Walima only */}
                    {hasVenue && (
                      <div className="event-venue-section">
                        <div className="event-venue-divider">
                          <MapPin size={13} color="var(--admin-gold)" />
                          <span>Location</span>
                        </div>
                        <div className="event-venue-row">
                          <div className="form-group" style={{ margin: 0, flex: 1 }}>
                            <label className="form-label" style={{ fontSize: '0.78rem' }}>Venue / Hall Name</label>
                            <input
                              type="text"
                              className="form-input"
                              value={draft.venue_name}
                              onChange={(e) => handleEventDraftChange(evt.id, 'venue_name', e.target.value)}
                              placeholder="e.g. Ahmad Marriage Hall"
                            />
                          </div>
                          <div className="form-group" style={{ margin: 0, flex: 2 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.45rem' }}>
                              <label className="form-label" style={{ margin: 0, fontSize: '0.78rem' }}>
                                <Link2 size={12} style={{ display: 'inline', marginRight: '0.3rem', verticalAlign: 'middle' }} />
                                Google Maps Link
                              </label>
                              {(draft.map_link || evt.map_link) && (
                                <a
                                  href={draft.map_link || evt.map_link}
                                  target="_blank"
                                  rel="noreferrer"
                                  style={{ fontSize: '0.72rem', color: 'var(--admin-blue)', display: 'flex', alignItems: 'center', gap: '0.25rem', textDecoration: 'none' }}
                                >
                                  <ExternalLink size={11} /> Preview
                                </a>
                              )}
                            </div>
                            <input
                              type="url"
                              className="form-input"
                              value={draft.map_link}
                              onChange={(e) => handleEventDraftChange(evt.id, 'map_link', e.target.value)}
                              placeholder="https://maps.google.com/..."
                            />
                          </div>
                        </div>
                        <p style={{ fontSize: '0.72rem', color: 'var(--admin-text-muted)', margin: 0, lineHeight: 1.5 }}>
                          The venue name and map link update the public venue card and map button on the invitation site.
                        </p>
                      </div>
                    )}

                    {!hasVenue && (
                      <div style={{ fontSize: '0.72rem', color: 'var(--admin-text-muted)' }}>
                        📍 Solemnized privately — no public venue listing
                      </div>
                    )}

                    {/* Save Button for this event */}
                    <button
                      type="button"
                      className="btn-primary"
                      onClick={() => handleSaveEvent(evt)}
                      disabled={isSavingThis}
                      style={{ width: '100%', height: '42px', marginTop: '0.5rem' }}
                    >
                      {isSavingThis ? (
                        <>
                          <RefreshCw size={15} className="spinning" /> Saving {evt.name}...
                        </>
                      ) : (
                        <>
                          <Save size={15} /> Save {evt.name}
                        </>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* ── EDIT GUEST MODAL ── */}
      {editingGuest && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="modal-header">
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Edit2 size={18} color="var(--admin-gold)" /> Edit Guest
              </h3>
              <button className="btn-subtle" onClick={() => setEditingGuest(null)} style={{ padding: '0.3rem', border: 'none' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveEdit}>
              <div className="form-group">
                <label className="form-label">Guest / Family Name *</label>
                <input type="text" className="form-input" value={editName}
                  onChange={(e) => setEditName(e.target.value)} required />
              </div>

              <div className="form-group">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.45rem' }}>
                  <label className="form-label" style={{ margin: 0 }}>Reserved Seats *</label>
                  <span style={{ fontSize: '0.72rem', color: 'var(--admin-text-muted)' }}>🔒 Private</span>
                </div>
                <input type="number" min={1} max={50} className="form-input" value={editSeats}
                  onChange={(e) => setEditSeats(Math.max(1, parseInt(e.target.value) || 1))} required />
              </div>

              <div className="form-group">
                <label className="form-label">Assigned Events *</label>
                <div className="event-checkbox-list">
                  {events.map((evt) => {
                    const checked = editEvents.includes(evt.id);
                    return (
                      <label key={evt.id} className={`event-checkbox-item ${checked ? 'checked' : ''}`}>
                        <input type="checkbox" checked={checked}
                          onChange={(e) => {
                            if (e.target.checked) setEditEvents([...editEvents, evt.id]);
                            else setEditEvents(editEvents.filter((id) => id !== evt.id));
                          }} />
                        <span className="event-checkbox-label">{evt.name}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button type="button" className="btn-secondary" onClick={() => setEditingGuest(null)}>Cancel</button>
                <button type="submit" className="btn-primary" disabled={savingEdit}>
                  {savingEdit ? <><RefreshCw size={15} className="spinning" /> Saving…</> : <><Save size={15} /> Save Changes</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── CONFIRM REGEN MODAL ── */}
      {confirmRegenGuest && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="modal-header">
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#fda4af' }}>
                <AlertTriangle size={18} /> Regenerate Link?
              </h3>
              <button className="btn-subtle" onClick={() => setConfirmRegenGuest(null)} style={{ padding: '0.3rem', border: 'none' }}>
                <X size={18} />
              </button>
            </div>

            <p style={{ fontSize: '0.88rem', lineHeight: '1.65', marginBottom: '0.75rem' }}>
              Regenerate the invitation link for <strong>{confirmRegenGuest.display_name}</strong>?
            </p>
            <div className="alert-error" style={{ marginBottom: '1.25rem' }}>
              <AlertTriangle size={14} />
              <span>The old link will <strong>immediately stop working</strong>. Guests who saved the old URL will see "Invitation Unavailable".</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button type="button" className="btn-secondary" onClick={() => setConfirmRegenGuest(null)}>Cancel</button>
              <button type="button" className="btn-danger" onClick={handleRegenerateToken} disabled={regenerating}>
                {regenerating ? <><RefreshCw size={15} className="spinning" /> Regenerating…</> : 'Yes, Generate New Link'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
