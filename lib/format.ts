// Fechas y estados de entrega. Todo se muestra en hora de Guatemala.
export const TZ = "America/Guatemala";

export type Course = {
  id: number;
  name: string;
  code: string;
  section: string;
  teacher_name: string;
  room: string;
  schedule_label: string;
  symbol: string;
};

export type Task = {
  id: number;
  course_id: number;
  title: string;
  description: string;
  type: "Tarea" | "Proyecto" | "Examen" | "Lectura";
  is_group: boolean;
  weight: number;
  due_at: string;
  courses?: Pick<Course, "name"> | null;
};

export type Submission = {
  task_id: number;
  status: "en_progreso" | "entregada";
  comment: string | null;
  submitted_at: string;
};

export type ClassSession = {
  id: number;
  course_id: number;
  weekday: number; // 1 = lunes
  starts_at: string; // "08:00:00"
  ends_at: string;
  location: string;
  courses?: Pick<Course, "name" | "section" | "teacher_name"> | null;
};

export type Announcement = {
  id: number;
  course_id: number;
  title: string;
  body: string;
  important: boolean;
  published_at: string;
  courses?: Pick<Course, "name"> | null;
};

const dayKey = (d: Date) =>
  new Intl.DateTimeFormat("en-CA", { timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit" }).format(d);

export function formatDue(iso: string) {
  const d = new Date(iso);
  const day = new Intl.DateTimeFormat("es-GT", { timeZone: TZ, weekday: "short", day: "numeric", month: "short" }).format(d);
  const time = new Intl.DateTimeFormat("es-GT", { timeZone: TZ, hour: "2-digit", minute: "2-digit", hour12: false }).format(d);
  return { day: day.replace(".", ""), time };
}

export function formatDate(iso: string) {
  return new Intl.DateTimeFormat("es-GT", { timeZone: TZ, weekday: "long", day: "numeric", month: "long", hour: "2-digit", minute: "2-digit", hour12: false }).format(new Date(iso));
}

export function todayLabel(now = new Date()) {
  const s = new Intl.DateTimeFormat("es-GT", { timeZone: TZ, weekday: "long", day: "numeric", month: "long" }).format(now);
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export type TimingKey = "overdue" | "today" | "soon" | "neutral" | "submitted";

export function taskTiming(task: Task, submitted: boolean, now = new Date()): { key: TimingKey; label: string } {
  if (submitted) return { key: "submitted", label: "Entregada" };
  const due = new Date(task.due_at);
  if (due.getTime() < now.getTime()) return { key: "overdue", label: "Vencida" };
  if (dayKey(due) === dayKey(now)) return { key: "today", label: "Vence hoy" };
  if (due.getTime() - now.getTime() <= 7 * 86_400_000) return { key: "soon", label: "Vence en unos días" };
  return { key: "neutral", label: "Próxima entrega" };
}

const RANK: Record<TimingKey, number> = { overdue: 0, today: 1, soon: 2, neutral: 3, submitted: 4 };

// Urgencia primero (vencidas, hoy, esta semana), luego por fecha y peso.
export function orderTasks(tasks: Task[], submittedIds: Set<number>, now = new Date()) {
  return [...tasks].sort((a, b) => {
    const ra = RANK[taskTiming(a, submittedIds.has(a.id), now).key];
    const rb = RANK[taskTiming(b, submittedIds.has(b.id), now).key];
    return ra - rb || new Date(a.due_at).getTime() - new Date(b.due_at).getTime() || b.weight - a.weight;
  });
}

export const WEEKDAYS = ["", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
export const hhmm = (t: string) => t.slice(0, 5);

// Próxima clase a partir de ahora (hora de Guatemala), recorriendo la semana.
export function nextSession<T extends ClassSession>(sessions: T[], now = new Date()): T | null {
  if (!sessions.length) return null;
  const parts = new Intl.DateTimeFormat("en-US", { timeZone: TZ, weekday: "short", hour: "2-digit", minute: "2-digit", hour12: false }).formatToParts(now);
  const wd = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].indexOf(parts.find((p) => p.type === "weekday")!.value) + 1;
  const minutes = Number(parts.find((p) => p.type === "hour")!.value) % 24 * 60 + Number(parts.find((p) => p.type === "minute")!.value);
  const toMin = (t: string) => Number(t.slice(0, 2)) * 60 + Number(t.slice(3, 5));
  const score = (s: T) => {
    let diff = (s.weekday - wd) * 1440 + toMin(s.starts_at) - minutes;
    if (diff < 0) diff += 7 * 1440;
    return diff;
  };
  return [...sessions].sort((a, b) => score(a) - score(b))[0];
}
