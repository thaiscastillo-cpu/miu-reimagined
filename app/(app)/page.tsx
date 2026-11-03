import Link from "next/link";
import { Icon } from "@/components/Icon";
import { DeadlineLegend, TaskRow } from "@/components/TaskRow";
import { getAnnouncements, getCourses, getSessions, getTasks, getUser } from "@/lib/data";
import { WEEKDAYS, formatDate, formatDue, hhmm, nextSession, orderTasks, taskTiming, todayLabel } from "@/lib/format";

export default async function Dashboard() {
  const now = new Date();
  const [user, { tasks, submittedIds }, sessions, announcements, courses] = await Promise.all([
    getUser(),
    getTasks(),
    getSessions(),
    getAnnouncements(),
    getCourses(),
  ]);

  const pending = orderTasks(tasks.filter((t) => !submittedIds.has(t.id)), submittedIds, now);
  const upcoming = pending.find((t) => new Date(t.due_at) >= now) ?? pending[0];
  const nextClass = nextSession(sessions, now);
  const latestImportant = announcements.find((a) => a.important) ?? announcements[0];

  return (
    <>
      <div className="row between page-heading">
        <div>
          <h1>Hola, {user.name}.</h1>
          <p>Un vistazo a tu día. Y a lo que sigue.</p>
        </div>
        <span className="today-date">{todayLabel(now)}</span>
      </div>

      <section className="next-cards" aria-label="Lo próximo">
        {upcoming ? (
          <Link className="next-card" href={`/tareas/${upcoming.id}`}>
            <span className="eyebrow">Próxima entrega</span>
            <h3>{upcoming.title}</h3>
            <p>
              {upcoming.courses?.name} · vence {formatDue(upcoming.due_at).day}, {formatDue(upcoming.due_at).time}
            </p>
            <span className="badge">{taskTiming(upcoming, false, now).label}</span>
          </Link>
        ) : (
          <div className="next-card">
            <span className="eyebrow">Próxima entrega</span>
            <h3>Todo entregado.</h3>
            <p>No tenés entregas pendientes.</p>
          </div>
        )}
        {nextClass ? (
          <Link className="next-card" href={`/horario?clase=${nextClass.id}`}>
            <span className="eyebrow">Próxima clase</span>
            <h3>{nextClass.courses?.name}</h3>
            <p>
              {WEEKDAYS[nextClass.weekday]} {hhmm(nextClass.starts_at)}–{hhmm(nextClass.ends_at)} · {nextClass.location}
              <br />
              {nextClass.courses?.teacher_name}
            </p>
          </Link>
        ) : (
          <div className="next-card">
            <span className="eyebrow">Próxima clase</span>
            <h3>Sin clases programadas.</h3>
          </div>
        )}
      </section>

      {latestImportant ? (
        <Link className="notice" href={`/avisos/${latestImportant.id}`} style={{ display: "block", marginBottom: 22, textDecoration: "none" }}>
          <span className="badge red" style={{ marginRight: 8 }}>
            {latestImportant.important ? "Aviso importante" : "Último aviso"}
          </span>
          <b>{latestImportant.title}</b> · {latestImportant.courses?.name}
          <span className="small muted" style={{ display: "block", marginTop: 6 }}>
            {formatDate(latestImportant.published_at)} · Ver aviso ↗
          </span>
        </Link>
      ) : null}

      <div className="dashboard">
        <div className="main-col">
          <div className="row between" style={{ marginBottom: 12 }}>
            <h2>
              Mis pendientes <span className="muted small" style={{ marginLeft: 6 }}>{pending.length}</span>
            </h2>
            <Link className="text-btn" href="/tareas">
              Ver todo ↗
            </Link>
          </div>
          <DeadlineLegend />
          <div className="panel tasks">
            {pending.length ? (
              pending.slice(0, 3).map((t) => <TaskRow key={t.id} task={t} submitted={false} now={now} />)
            ) : (
              <div className="empty">✓ Todo entregado. ¡Buen trabajo!</div>
            )}
          </div>
        </div>
        <aside className="right-col">
          <Link className="btn secondary dashboard-week-link" href="/horario" style={{ display: "flex" }}>
            <Icon name="calendar" />
            Ver mi semana
          </Link>
          <section>
            <h2 style={{ margin: "18px 0 12px" }}>Mis cursos</h2>
            <div className="dashboard-course-links">
              {courses.map((c) => (
                <Link key={c.id} href={`/avisos?curso=${c.id}`} style={{ textDecoration: "none", color: "inherit" }}>
                  <span>
                    <b>{c.name}</b>
                    <small>
                      Sección {c.section} · {c.room}
                    </small>
                  </span>
                  <span aria-hidden="true">↗</span>
                </Link>
              ))}
            </div>
          </section>
        </aside>
      </div>
    </>
  );
}
