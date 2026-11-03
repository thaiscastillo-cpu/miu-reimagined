import Link from "next/link";
import { getAnnouncements, getCourses } from "@/lib/data";
import { formatDate } from "@/lib/format";

export default async function AvisosPage({ searchParams }: PageProps<"/avisos">) {
  const params = await searchParams;
  const [announcements, courses] = await Promise.all([getAnnouncements(), getCourses()]);
  const courseId = Number(params.curso) || null;
  const course = courses.find((c) => c.id === courseId) ?? null;
  const visible = course ? announcements.filter((a) => a.course_id === course.id) : announcements;

  return (
    <>
      <div className="row between page-heading">
        <div>
          <h1>Lo que tus catedráticos publicaron.</h1>
          <p>Avisos de tus cursos, del más reciente al más antiguo. Los importantes van marcados.</p>
        </div>
      </div>
      <nav className="tabs" aria-label="Filtrar por curso">
        <Link className={`tab ${!course ? "active" : ""}`} href="/avisos" style={{ textDecoration: "none" }} aria-current={!course ? "page" : undefined}>
          Todos
        </Link>
        {courses.map((c) => (
          <Link
            key={c.id}
            className={`tab ${course?.id === c.id ? "active" : ""}`}
            href={`/avisos?curso=${c.id}`}
            style={{ textDecoration: "none" }}
            aria-current={course?.id === c.id ? "page" : undefined}
          >
            {c.name}
          </Link>
        ))}
      </nav>
      <div className="panel">
        {visible.length ? (
          visible.map((a) => (
            <Link key={a.id} className="announce-item" href={`/avisos/${a.id}`}>
              <div className="row wrap" style={{ gap: 8 }}>
                <span className="small muted">{a.courses?.name}</span>
                {a.important ? <span className="badge red">Importante</span> : null}
              </div>
              <h3>{a.title}</h3>
              <p>{a.body.length > 140 ? a.body.slice(0, 140) + "…" : a.body}</p>
              <span className="small muted">{formatDate(a.published_at)}</span>
            </Link>
          ))
        ) : (
          <div className="empty">{course ? `No hay avisos de ${course.name} todavía.` : "Estás al día. Los nuevos avisos aparecerán aquí."}</div>
        )}
      </div>
    </>
  );
}
