import Link from "next/link";
import { Icon } from "@/components/Icon";
import { getCourses, getSessions } from "@/lib/data";
import { WEEKDAYS, hhmm, nextSession } from "@/lib/format";

export default async function HorarioPage({ searchParams }: PageProps<"/horario">) {
  const params = await searchParams;
  const now = new Date();
  const [sessions, courses] = await Promise.all([getSessions(), getCourses()]);
  const next = nextSession(sessions, now);
  const selected = sessions.find((s) => s.id === Number(params.clase)) ?? next;
  const selectedCourse = selected ? courses.find((c) => c.id === selected.course_id) : null;

  const slots = [...new Set(sessions.map((s) => s.starts_at))].sort();
  const days = [1, 2, 3, 4, 5];
  const palette = ["", "blue", "peach"];

  return (
    <>
      <div className="row between page-heading">
        <div>
          <h1>Tu semana, de un vistazo.</h1>
          <p>Tocá una clase para ver el aula, el horario y quién la da.</p>
        </div>
      </div>

      {selected && selectedCourse ? (
        <section className="panel" style={{ padding: 22, marginBottom: 20 }} aria-live="polite">
          <span className="eyebrow" style={{ color: "var(--purple)" }}>
            {selected.id === next?.id ? "Tu próxima clase" : "Clase seleccionada"}
          </span>
          <h2 style={{ margin: "8px 0 4px" }}>{selectedCourse.name}</h2>
          <p className="muted small">
            {selectedCourse.code} · Sección {selectedCourse.section}
          </p>
          <div className="detail-meta">
            <div>
              <Icon name="clock" /> Cuándo
              <b>
                {WEEKDAYS[selected.weekday]} · {hhmm(selected.starts_at)}–{hhmm(selected.ends_at)}
              </b>
            </div>
            <div>
              <Icon name="pin" /> Dónde
              <b>{selected.location}</b>
            </div>
            <div>
              <Icon name="users" /> Catedrático
              <b>{selectedCourse.teacher_name}</b>
            </div>
          </div>
          <div className="row wrap">
            <Link className="text-btn" href={`/avisos?curso=${selectedCourse.id}`}>
              Avisos del curso ↗
            </Link>
          </div>
        </section>
      ) : null}

      {sessions.length ? (
        <div className="panel table-wrap" style={{ overflowX: "auto" }}>
          <div className="schedule" aria-label="Horario semanal">
            <div />
            {days.map((d) => (
              <div key={d} className="sched-head">
                {WEEKDAYS[d]}
              </div>
            ))}
            {slots.map((slot) => (
              <div key={slot} style={{ display: "contents" }}>
                <div className="sched-time">
                  {hhmm(slot)}
                </div>
                {days.map((d) => {
                  const s = sessions.find((x) => x.weekday === d && x.starts_at === slot);
                  if (!s) return <div key={d} className="cell" />;
                  const isNext = s.id === next?.id;
                  const isSelected = s.id === selected?.id;
                  return (
                    <Link
                      key={d}
                     
                      href={`/horario?clase=${s.id}`}
                      scroll={false}
                      aria-current={isSelected ? "true" : undefined}
                      className={`cell class-cell ${palette[s.course_id % 3]} ${isSelected ? "next-class-cell" : ""}`}
                      style={{ textDecoration: "none", display: "block" }}
                    >
                      <strong>{s.courses?.name}</strong>
                      {s.location}
                      <br />
                      {hhmm(s.starts_at)}–{hhmm(s.ends_at)}
                      {isNext ? (
                        <>
                          <br />
                          <span className="badge" style={{ marginTop: 6 }}>
                            Próxima
                          </span>
                        </>
                      ) : null}
                    </Link>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="panel empty">Todavía no tenés clases asignadas.</div>
      )}
    </>
  );
}
