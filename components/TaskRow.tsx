import Link from "next/link";
import { Icon } from "./Icon";
import { formatDue, taskTiming, type Task } from "@/lib/format";

export function TaskRow({ task, submitted, now }: { task: Task; submitted: boolean; now: Date }) {
  const timing = taskTiming(task, submitted, now);
  const due = formatDue(task.due_at);
  const icon = task.is_group ? "users" : task.type === "Examen" ? "calendar" : "file";
  const action = submitted ? "Ver entrega" : task.type === "Examen" || task.type === "Lectura" ? "Ver detalle" : "Entregar";

  return (
    <div className={`task-row due-${timing.key}`}>
      <div className="task-icon">
        <Icon name={icon} />
      </div>
      <div className="task-copy">
        <h3>{task.title}</h3>
        <p>
          {task.courses?.name} · {task.weight}% de la nota
        </p>
        <div className="task-meta">
          <span className="badge due-status">{timing.label}</span>
          {!submitted ? <span className="small muted">{task.type}</span> : null}
          {task.is_group ? <span className="small muted">En grupo</span> : null}
        </div>
      </div>
      <div className="task-due">
        <time dateTime={task.due_at}>
          {due.day}
          <br />
          {due.time}
        </time>
      </div>
      <Link className="btn secondary" href={`/tareas/${task.id}`}>
        {action}
        <Icon name="arrow" />
      </Link>
    </div>
  );
}

export function DeadlineLegend() {
  return (
    <div className="deadline-legend" aria-label="Colores de los pendientes">
      <span>
        <i className="legend-today" aria-hidden="true" />
        Vence hoy
      </span>
      <span>
        <i className="legend-overdue" aria-hidden="true" />
        Vencida
      </span>
      <span>
        <i className="legend-soon" aria-hidden="true" />
        Vence en unos días
      </span>
    </div>
  );
}
