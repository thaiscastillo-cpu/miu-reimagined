"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type ActionState = { ok: boolean; message: string } | null;

// Marca (o actualiza) la entrega del usuario actual. RLS impide escribir a nombre de otro.
export async function submitTask(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const taskId = Number(formData.get("task_id"));
  const comment = String(formData.get("comment") ?? "").trim().slice(0, 1000) || null;
  if (!Number.isInteger(taskId)) return { ok: false, message: "Tarea no válida." };

  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  if (!data?.claims) return { ok: false, message: "Tu sesión expiró. Volvé a iniciar sesión." };

  // Insertar la primera vez; si ya existe (p. ej. se deshizo), actualizar solo estado/comentario/fecha.
  const values = { status: "entregada", comment, submitted_at: new Date().toISOString() };
  const { data: existing } = await supabase
    .from("submissions")
    .select("id")
    .eq("task_id", taskId)
    .eq("user_id", data.claims.sub)
    .maybeSingle();
  const { error } = existing
    ? await supabase.from("submissions").update(values).eq("id", existing.id)
    : await supabase.from("submissions").insert({ task_id: taskId, ...values });

  if (error) return { ok: false, message: "No pudimos guardar tu entrega. Intentá de nuevo." };
  revalidatePath("/", "layout");
  return { ok: true, message: "✓ Entrega registrada. Sigue guardada aunque recargues la página." };
}

// Deshacer: vuelve la tarea a "en progreso" (no se borra el registro).
export async function undoSubmission(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const taskId = Number(formData.get("task_id"));
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  if (!data?.claims) return { ok: false, message: "Tu sesión expiró. Volvé a iniciar sesión." };

  const { error } = await supabase
    .from("submissions")
    .update({ status: "en_progreso" })
    .eq("task_id", taskId)
    .eq("user_id", data.claims.sub);

  if (error) return { ok: false, message: "No pudimos actualizar la entrega." };
  revalidatePath("/", "layout");
  return { ok: true, message: "La tarea volvió a tus pendientes." };
}
