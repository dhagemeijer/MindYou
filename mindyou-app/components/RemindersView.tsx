"use client";

import { useEffect, useRef, useState } from "react";
import { Plus, Trash2, Pencil, Check, X, Bell, BellOff, AlertTriangle } from "lucide-react";
import { subscribeToPush, getPushSubscriptionStatus } from "@/lib/push-client";

type Repeat = "EENMALIG" | "DAGELIJKS" | "WEKELIJKS";

interface Reminder {
  id: string;
  title: string;
  time: string;
  repeat: Repeat;
  weekdays: number[];
  active: boolean;
}

const WEEKDAY_LABELS = ["Zo", "Ma", "Di", "Wo", "Do", "Vr", "Za"];

function RepeatPicker({
  repeat,
  setRepeat,
  weekdays,
  toggleWeekday,
}: {
  repeat: Repeat;
  setRepeat: (r: Repeat) => void;
  weekdays: number[];
  toggleWeekday: (d: number) => void;
}) {
  return (
    <>
      <div className="flex flex-wrap items-center gap-2">
        {(["EENMALIG", "DAGELIJKS", "WEKELIJKS"] as Repeat[]).map((r) => (
          <button
            key={r}
            type="button"
            onClick={() => setRepeat(r)}
            className={`rounded-full border px-3 py-1.5 font-sans text-xs transition-colors ${
              repeat === r
                ? "border-gold bg-gold text-ink"
                : "border-ink/15 text-ink/60 dark:border-cream/20 dark:text-cream/60"
            }`}
          >
            {r === "EENMALIG" ? "Eenmalig" : r === "DAGELIJKS" ? "Dagelijks" : "Wekelijks"}
          </button>
        ))}
      </div>
      {repeat === "WEKELIJKS" && (
        <div className="flex flex-wrap gap-1.5">
          {WEEKDAY_LABELS.map((label, i) => (
            <button
              key={label}
              type="button"
              onClick={() => toggleWeekday(i)}
              className={`h-8 w-8 rounded-full font-sans text-xs transition-colors ${
                weekdays.includes(i)
                  ? "bg-gold text-ink"
                  : "bg-ink/5 text-ink/50 dark:bg-cream/10 dark:text-cream/50"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      )}
    </>
  );
}

function EditReminderRow({
  reminder,
  onSave,
  onCancel,
}: {
  reminder: Reminder;
  onSave: (patch: Partial<Reminder>) => void;
  onCancel: () => void;
}) {
  const [title, setTitle] = useState(reminder.title);
  const [time, setTime] = useState(reminder.time);
  const [repeat, setRepeat] = useState<Repeat>(reminder.repeat);
  const [weekdays, setWeekdays] = useState<number[]>(reminder.weekdays);

  function toggleWeekday(day: number) {
    setWeekdays((prev) => (prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]));
  }

  return (
    <li className="flex flex-col gap-3 rounded-xl border border-gold/50 bg-gold/[0.05] px-4 py-4">
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full rounded-lg border border-ink/10 bg-cream px-3 py-2 font-sans text-sm text-ink focus:border-gold focus:outline-none dark:border-cream/15 dark:bg-ink dark:text-cream"
      />
      <div className="flex flex-wrap items-center gap-2">
        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className="rounded-lg border border-ink/10 bg-cream px-3 py-2 font-sans text-sm text-ink focus:border-gold focus:outline-none dark:border-cream/15 dark:bg-ink dark:text-cream"
        />
      </div>
      <RepeatPicker
        repeat={repeat}
        setRepeat={setRepeat}
        weekdays={weekdays}
        toggleWeekday={toggleWeekday}
      />
      <div className="flex items-center gap-2">
        <button
          onClick={() => onSave({ title, time, repeat, weekdays })}
          disabled={!title.trim()}
          className="flex items-center gap-1.5 rounded-full bg-ink px-4 py-1.5 font-sans text-xs font-medium text-cream disabled:opacity-40 dark:bg-gold dark:text-ink"
        >
          <Check className="h-3.5 w-3.5" />
          Opslaan
        </button>
        <button
          onClick={onCancel}
          className="flex items-center gap-1.5 rounded-full border border-ink/15 px-4 py-1.5 font-sans text-xs text-ink/60 dark:border-cream/20 dark:text-cream/60"
        >
          <X className="h-3.5 w-3.5" />
          Annuleren
        </button>
      </div>
    </li>
  );
}

export function RemindersView() {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [time, setTime] = useState("08:00");
  const [repeat, setRepeat] = useState<Repeat>("DAGELIJKS");
  const [weekdays, setWeekdays] = useState<number[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [permission, setPermission] = useState<NotificationPermission | "unsupported">(
    "default"
  );
  const [pushStatus, setPushStatus] = useState<
    "subscribed" | "not-subscribed" | "unsupported" | "loading"
  >("loading");
  const [subscribing, setSubscribing] = useState(false);
  const [testSending, setTestSending] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);
  const firedToday = useRef<Set<string>>(new Set());

  useEffect(() => {
    fetch("/api/reminders")
      .then((r) => r.json())
      .then(setReminders)
      .finally(() => setLoading(false));

    if (typeof window !== "undefined" && "Notification" in window) {
      setPermission(Notification.permission);
    } else {
      setPermission("unsupported");
    }

    getPushSubscriptionStatus().then(setPushStatus);
  }, []);

  async function enablePush() {
    setSubscribing(true);
    const result = await subscribeToPush();
    setPushStatus(result === "subscribed" ? "subscribed" : "not-subscribed");
    if (typeof window !== "undefined" && "Notification" in window) {
      setPermission(Notification.permission);
    }
    setSubscribing(false);
  }

  async function sendTestPush() {
    setTestSending(true);
    setTestResult(null);
    try {
      const res = await fetch("/api/push/test", { method: "POST" });
      const data = await res.json();
      setTestResult(
        res.ok
          ? `Verstuurd naar ${data.sent} toestel${data.sent === 1 ? "" : "len"}.`
          : data.error || "Versturen mislukt."
      );
    } catch {
      setTestResult("Versturen mislukt.");
    }
    setTestSending(false);
  }

  // Terwijl deze pagina open is: elke 20s checken of een reminder nu afgaat.
  useEffect(() => {
    if (permission !== "granted") return;
    const interval = setInterval(() => {
      const now = new Date();
      const hhmm = now.toTimeString().slice(0, 5);
      const weekday = now.getDay();
      const dateStamp = now.toISOString().slice(0, 10);

      reminders.forEach((r) => {
        if (!r.active || r.time !== hhmm) return;
        if (r.repeat === "WEKELIJKS" && !r.weekdays.includes(weekday)) return;
        const fireKey = `${r.id}-${dateStamp}-${hhmm}`;
        if (firedToday.current.has(fireKey)) return;
        firedToday.current.add(fireKey);
        new Notification("MindYou", { body: r.title, icon: "/icons/icon-192.png" });
      });
    }, 20_000);
    return () => clearInterval(interval);
  }, [reminders, permission]);

  async function createReminder(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    const res = await fetch("/api/reminders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, time, repeat, weekdays }),
    });
    const created = await res.json();
    setReminders((prev) => [...prev, created].sort((a, b) => a.time.localeCompare(b.time)));
    setTitle("");
    setTime("08:00");
    setRepeat("DAGELIJKS");
    setWeekdays([]);
  }

  async function toggleActive(r: Reminder) {
    setReminders((prev) =>
      prev.map((x) => (x.id === r.id ? { ...x, active: !x.active } : x))
    );
    await fetch(`/api/reminders/${r.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !r.active }),
    });
  }

  async function saveEdit(id: string, patch: Partial<Reminder>) {
    setReminders((prev) =>
      prev
        .map((r) => (r.id === id ? { ...r, ...patch } : r))
        .sort((a, b) => a.time.localeCompare(b.time))
    );
    setEditingId(null);
    await fetch(`/api/reminders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
  }

  async function deleteReminder(id: string) {
    setReminders((prev) => prev.filter((r) => r.id !== id));
    await fetch(`/api/reminders/${id}`, { method: "DELETE" });
  }

  function toggleWeekday(day: number) {
    setWeekdays((prev) => (prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]));
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="mb-1 font-display text-3xl font-medium text-ink dark:text-cream">
        Reminders
      </h1>
      <p className="mb-4 font-sans text-sm text-ink/55 dark:text-cream/55">
        Meldingen op een vast tijdstip.
      </p>

      {pushStatus === "subscribed" ? (
        <div className="mb-8 flex flex-col gap-2 rounded-lg border border-gold/40 bg-gold/10 px-4 py-3">
          <div className="flex items-center gap-2">
            <Bell className="h-4 w-4 shrink-0 text-gold" />
            <p className="font-sans text-sm text-ink dark:text-cream">
              Pushmeldingen staan aan — deze reminders werken nu ook als de app dicht is.
            </p>
          </div>
          <button
            onClick={sendTestPush}
            disabled={testSending}
            className="self-start font-sans text-xs text-ink/60 underline decoration-dotted underline-offset-2 hover:text-gold disabled:opacity-50 dark:text-cream/60"
          >
            {testSending ? "Versturen..." : "Stuur testmelding"}
          </button>
          {testResult && (
            <p className="font-sans text-xs text-ink/50 dark:text-cream/50">{testResult}</p>
          )}
        </div>
      ) : pushStatus === "unsupported" ? (
        <div className="mb-8 flex items-start gap-2 rounded-lg border border-ink/10 bg-ink/[0.02] px-4 py-3 dark:border-cream/10 dark:bg-cream/[0.03]">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
          <p className="font-sans text-xs leading-relaxed text-ink/60 dark:text-cream/60">
            Deze browser ondersteunt geen pushmeldingen. Op iPhone: voeg MindYou eerst toe aan je
            beginscherm en open de app vandaaruit, dan werkt het wel.
          </p>
        </div>
      ) : pushStatus === "loading" ? null : (
        <button
          onClick={enablePush}
          disabled={subscribing}
          className="mb-8 flex items-center gap-2 rounded-lg border border-gold/40 bg-gold/10 px-4 py-2.5 font-sans text-sm text-ink transition-opacity hover:opacity-90 disabled:opacity-50 dark:text-cream"
        >
          <Bell className="h-4 w-4 text-gold" />
          {subscribing ? "Bezig..." : "Pushmeldingen inschakelen"}
        </button>
      )}

      <form
        onSubmit={createReminder}
        className="mb-10 flex flex-col gap-3 rounded-2xl border border-ink/10 bg-ink/[0.02] p-4 dark:border-cream/10 dark:bg-cream/[0.03]"
      >
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Waar wil je aan herinnerd worden?"
          className="w-full rounded-lg border border-ink/10 bg-cream px-3 py-2.5 font-sans text-sm text-ink placeholder:text-ink/35 focus:border-gold focus:outline-none dark:border-cream/15 dark:bg-ink dark:text-cream dark:placeholder:text-cream/35"
        />

        <div className="flex flex-wrap items-center gap-2">
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="rounded-lg border border-ink/10 bg-cream px-3 py-2 font-sans text-sm text-ink focus:border-gold focus:outline-none dark:border-cream/15 dark:bg-ink dark:text-cream"
          />
        </div>
        <RepeatPicker
          repeat={repeat}
          setRepeat={setRepeat}
          weekdays={weekdays}
          toggleWeekday={toggleWeekday}
        />

        <button
          type="submit"
          disabled={!title.trim()}
          className="flex items-center justify-center gap-1.5 self-start rounded-full bg-ink px-5 py-2 font-sans text-sm font-medium text-cream transition-opacity hover:opacity-90 disabled:opacity-40 dark:bg-gold dark:text-ink"
        >
          <Plus className="h-4 w-4" />
          Reminder
        </button>
      </form>

      {loading ? (
        <p className="font-sans text-sm text-ink/40 dark:text-cream/40">Laden...</p>
      ) : reminders.length === 0 ? (
        <p className="font-sans text-sm text-ink/40 dark:text-cream/40">Nog geen reminders.</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {reminders.map((r) =>
            editingId === r.id ? (
              <EditReminderRow
                key={r.id}
                reminder={r}
                onSave={(patch) => saveEdit(r.id, patch)}
                onCancel={() => setEditingId(null)}
              />
            ) : (
              <li
                key={r.id}
                className="flex items-center gap-3 rounded-xl border border-ink/8 px-4 py-3 dark:border-cream/10"
              >
                <button onClick={() => toggleActive(r)} aria-label="Aan/uit">
                  {r.active ? (
                    <Bell className="h-4 w-4 text-gold" />
                  ) : (
                    <BellOff className="h-4 w-4 text-ink/30 dark:text-cream/30" />
                  )}
                </button>
                <span className="font-sans text-sm font-medium tabular-nums text-ink dark:text-cream">
                  {r.time}
                </span>
                <span
                  className={`flex-1 font-sans text-sm ${
                    r.active ? "text-ink dark:text-cream" : "text-ink/35 dark:text-cream/35"
                  }`}
                >
                  {r.title}
                </span>
                <span className="font-sans text-[11px] text-ink/40 dark:text-cream/40">
                  {r.repeat === "EENMALIG"
                    ? "Eenmalig"
                    : r.repeat === "DAGELIJKS"
                      ? "Dagelijks"
                      : r.weekdays.map((d) => WEEKDAY_LABELS[d]).join(" ")}
                </span>
                <button
                  onClick={() => setEditingId(r.id)}
                  aria-label="Bewerken"
                  className="rounded-full p-1.5 text-ink/25 transition-colors hover:bg-ink/5 hover:text-ink/50 dark:text-cream/25 dark:hover:bg-cream/10"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => deleteReminder(r.id)}
                  aria-label="Verwijderen"
                  className="rounded-full p-1.5 text-ink/25 transition-colors hover:bg-ink/5 hover:text-ink/50 dark:text-cream/25 dark:hover:bg-cream/10"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </li>
            )
          )}
        </ul>
      )}
    </div>
  );
}
