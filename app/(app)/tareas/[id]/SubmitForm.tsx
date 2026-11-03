"use client";

import { useActionState } from "react";
import { Icon } from "@/components/Icon";
import { submitTask, undoSubmission, type ActionState } from "../actions";

type Props = { taskId: number; submitted: boolean; comment: string | null; late: boolean; needsFile: boolean };

export function SubmitForm({ taskId, submitted, comment, late, needsFile }: Props) {
  const [state, submit, submitting] = useActionState<ActionState, FormData>(submitTask, null);
  const [undoState, undo, undoing] = useActionState<ActionState, FormData>(undoSubmission, null);
  const message = undoState ?? state;

  if (submitted) {
    return (
      <>
        <div className="receipt">
          <b>✓ Entregada{late ? " · Tarde" : ""}</b>
          {comment ? (
            <>
              <br />
              Tu comentario: “{comment}”
            </>
          ) : null}
          <br />
          Registrada en tu cuenta. Solo vos podés ver esta entrega.
        </div>
        <form action={undo} className="form-row">
          <input type="hidden" name="task_id" value={taskId} />
          <button className="btn secondary" type="submit" disabled={undoing}>
            {undoing ? "Actualizando…" : "Deshacer entrega"}
          </button>
        </form>
        {message ? (
          <p className={`status-msg ${message.ok ? "ok" : "err"}`} role="status">
            {message.message}
          </p>
        ) : null}
      </>
    );
  }

  return (
    <form action={submit}>
      <input type="hidden" name="task_id" value={taskId} />
      {late ? (
        <div className="notice" style={{ background: "#fde7e7", color: "#992d2d", borderColor: "#efc2c2", marginBottom: 14 }}>
          El plazo terminó. Podés entregar igual; quedará marcada como <b>Tarde</b>.
        </div>
      ) : null}
      <div className="field">
        <label htmlFor="comment">{needsFile ? "Comentario para el catedrático (opcional)" : "Nota personal (opcional)"}</label>
        <textarea id="comment" name="comment" maxLength={1000} placeholder="Algo que quieras agregar…" defaultValue="" />
      </div>
      <p className="small muted" style={{ marginTop: 8 }}>
        En esta demo la entrega se registra como hecha; no se suben archivos.
      </p>
      <div className="form-row">
        <button className="btn" type="submit" disabled={submitting}>
          {submitting ? "Guardando…" : needsFile ? "Marcar como entregada" : "Marcar como completada"}
          <Icon name="check" />
        </button>
      </div>
      {message ? (
        <p className={`status-msg ${message.ok ? "ok" : "err"}`} role="status">
          {message.message}
        </p>
      ) : null}
    </form>
  );
}
