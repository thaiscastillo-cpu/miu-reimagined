import { cache } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Announcement, ClassSession, Course, Submission, Task } from "@/lib/format";

// Todas las consultas usan la sesión del usuario: RLS filtra lo que puede ver.

export const getUser = cache(async () => {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  if (!data?.claims) redirect("/login");
  const claims = data.claims as { sub: string; email?: string; user_metadata?: Record<string, string> };
  const { data: profile } = await supabase.from("profiles").select("display_name").eq("id", claims.sub).maybeSingle();
  const fullName = claims.user_metadata?.full_name || claims.user_metadata?.name || "";
  const name = profile?.display_name || fullName.split(" ")[0] || "Estudiante";
  const initials =
    (fullName || name as string)
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((w: string) => w[0]?.toUpperCase())
      .join("") || "E";
  return { id: claims.sub, name, initials };
});

export const getTasks = cache(async () => {
  const supabase = await createClient();
  const [{ data: tasks, error }, { data: subs, error: subsError }] = await Promise.all([
    supabase.from("tasks").select("*, courses(name)").order("due_at"),
    supabase.from("submissions").select("task_id, status, comment, submitted_at"),
  ]);
  if (error || subsError) throw new Error("No pudimos cargar tus tareas.");
  const submissions = new Map<number, Submission>((subs ?? []).map((s) => [s.task_id, s as Submission]));
  const submittedIds = new Set([...submissions.values()].filter((s) => s.status === "entregada").map((s) => s.task_id));
  return { tasks: (tasks ?? []) as Task[], submissions, submittedIds };
});

export const getSessions = cache(async () => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("class_sessions")
    .select("*, courses(name, section, teacher_name)")
    .order("weekday")
    .order("starts_at");
  if (error) throw new Error("No pudimos cargar tu horario.");
  return (data ?? []) as ClassSession[];
});

export const getAnnouncements = cache(async () => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("announcements")
    .select("*, courses(name)")
    .order("published_at", { ascending: false });
  if (error) throw new Error("No pudimos cargar los avisos.");
  return (data ?? []) as Announcement[];
});

export const getCourses = cache(async () => {
  const supabase = await createClient();
  const { data, error } = await supabase.from("courses").select("*").order("id");
  if (error) throw new Error("No pudimos cargar tus cursos.");
  return (data ?? []) as Course[];
});
