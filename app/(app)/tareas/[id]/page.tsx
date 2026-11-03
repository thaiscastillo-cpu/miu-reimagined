import Link from "next/link";
import { notFound } from "next/navigation";
import { getCourses, getTasks } from "@/lib/data";
import { formatDate, taskTiming } from "@/lib/format";
import { SubmitForm } from "./SubmitForm";

export default async function TaskDetail({ params }: PageProps<"/tareas/[id]">) {
  const { id } = await params;
  const now = new Date();
  const [{ tasks, submissions }, courses] = await Promise.all([getTasks(), getCourses()]);
  const task = tasks.find((t) => t.id === Number(id));
  if (!task) notFound();

  const course = courses.find((c) => c.id === task.course_id);
  const sub = submissions.get(task.id);
  const submitted = sub?.status === "entregada";
  const timing = taskTiming(task, submitted, now);
  const late = submitted ? new Date(sub!.submitted_at) > new Date(task.due_at) : timing.key === "overdue";

  return (
    <>
      <Link className="text-btn" href="/tareas">
        ← Mis tareas
      </Link>
      <div className="row between page-heading" style={{ marginTop: 8 }}>
        <div>
          <h1>{task.title}</h1>
          <p>
            {course?.name} · {task.type}
            {task.is_group ? " · En grupo" : ""}
          </p>
        </div>
        <span className={`badge ${timing.key === "overdue" ? "red" : ""}`}>{timing.label}</span>
      </div>

      <section className="panel" style={{ padding: 24 }}>
        <div className="detail-meta">
          <div>
            Vence
            <b>{formatDate(task.due_at)}</b>
          </div>
          <div>
            Valor
            <b>{task.weight}% de la nota</b>
          </div>
          <div>
            Catedrático
            <b>{course?.teacher_name}</b>
          </div>
        </div>
        <p className="detail-body">{task.description}</p>
        {task.type === "Examen" ? (
          <div className="notice">
            Los exámenes no se entregan aquí. Revisá <Link href="/avisos">los avisos</Link> por si cambia el aula.
          </div>
        ) : (
          <SubmitForm
            taskId={task.id}
            submitted={submitted}
            comment={sub?.comment ?? null}
            late={late}
            needsFile={task.type !== "Lectura"}
          />
        )}
      </section>
    </>
  );
}
