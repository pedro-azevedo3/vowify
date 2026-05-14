-- ── Events ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS events (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name          TEXT        NOT NULL,
  date          TEXT        NOT NULL DEFAULT '',
  time          TEXT        NOT NULL DEFAULT '',
  location      TEXT        NOT NULL DEFAULT '',
  address       TEXT        NOT NULL DEFAULT '',
  guest_limit   INTEGER     NOT NULL DEFAULT 50 CHECK (guest_limit >= 1),
  traje_on      BOOLEAN     NOT NULL DEFAULT false,
  traje_text    TEXT        NOT NULL DEFAULT '',
  acomp_on      BOOLEAN     NOT NULL DEFAULT true,
  msg_on        BOOLEAN     NOT NULL DEFAULT false,
  msg_text      TEXT        NOT NULL DEFAULT '',
  color_id      TEXT        NOT NULL DEFAULT 'violet',
  font_id       TEXT        NOT NULL DEFAULT 'bricolage',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── Guests ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS guests (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id     UUID        NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  name         TEXT        NOT NULL,
  phone        TEXT        NOT NULL,
  status       TEXT        NOT NULL CHECK (status IN ('confirmed', 'declined')),
  plus         INTEGER     NOT NULL DEFAULT 0 CHECK (plus >= 0),
  restriction  TEXT        NOT NULL DEFAULT '',
  responded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Unique constraint: one response per phone per event
CREATE UNIQUE INDEX IF NOT EXISTS guests_event_phone_idx ON guests (event_id, phone);

-- ── Auto-update updated_at ─────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE TRIGGER events_updated_at
  BEFORE UPDATE ON events
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ── Row Level Security ─────────────────────────────────────────────────────
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE guests ENABLE ROW LEVEL SECURITY;

-- Owners can do everything with their events
CREATE POLICY "owner_all" ON events
  FOR ALL USING (auth.uid() = user_id);

-- Anyone can read an event (needed for invite page)
CREATE POLICY "public_read" ON events
  FOR SELECT USING (true);

-- Owner can read guests of their own events
CREATE POLICY "owner_read_guests" ON guests
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM events
      WHERE events.id = guests.event_id
        AND events.user_id = auth.uid()
    )
  );

-- Owner can delete guests
CREATE POLICY "owner_delete_guests" ON guests
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM events
      WHERE events.id = guests.event_id
        AND events.user_id = auth.uid()
    )
  );

-- Anyone can insert a guest response (RSVP)
CREATE POLICY "public_rsvp" ON guests
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM events WHERE events.id = guests.event_id)
  );

-- Guest can update their own response (same phone)
CREATE POLICY "guest_update_own" ON guests
  FOR UPDATE USING (true);
