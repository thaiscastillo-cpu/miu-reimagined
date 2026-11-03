import Link from "next/link";
import { notFound } from "next/navigation";
import { getAnnouncements, getCourses } from "@/lib/data";
import { formatDate } from "@/lib/format";

export default async function AvisoDetail({ params }: PageProps<"/avisos/[id]">) {
  const { id } = await params;
  const [announcements, courses] = await Promise.all([getAnnouncements(), getCourses()]);
  const a = announcements.find((x) => x.id === Number(id));
  if (!a) notFound();
  const course = courses.find((c) => c.id === a.course_id);

  return (
    <>
      <Link className="text-btn" href="/avisos">
        ← Avisos
      </Link>
      <article className="panel" style={{ padding: 26, marginTop: 10 }}>
        <div className="row wrap" style={{ gap: 8 }}>
          <span className="small muted">
            {course?.name} · {course?.teacher_name}
          </span>
          {a.important ? <span className="badge red">Importante</span> : null}
        </div>
        <h1 style={{ margin: "12px 0 6px", fontSize: 26 }}>{a.title}</h1>
        <p className="small muted">Publicado el {formatDate(a.published_at)}</p>
        <p className="detail-body">{a.body}</p>
        <div className="row wrap">
          <Link className="btn secondary" href={`/avisos?curso=${a.course_id}`}>
            Más avisos de este curso
          </Link>
          <Link className="text-btn" href="/horario">
            Ver horario ↗
          </Link>
        </div>
      </article>
    </>
  );
}
