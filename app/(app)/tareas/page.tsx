import Link from "next/link";
import { DeadlineLegend, TaskRow } from "@/components/TaskRow";
import { getTasks } from "@/lib/data";
import { orderTasks, taskTiming } from "@/lib/format";

const FILTERS = ["Por entregar", "Entregadas", "Vencidas", "Todas"] as const;
type Filter = (typeof FILTERS)[number];

export default async function TareasPage({ searchParams }: PageProps<"/tareas">) {
  const params = await searchParams;
  const filter: Filter = FILTERS.includes(params.filtro as Filter) ? (params.filtro as Filter) : "Por entregar";
  const now = new Date();
  const { tasks, submittedIds } = await getTasks();

  const visible = orderTasks(
    tasks.filter((t) => {
      const done = submittedIds.has(t.id);
      if (filter === "Por entregar") return !done;
      if (filter === "Entregadas") return done;
      if (filter === "Vencidas") return !done && taskTiming(t, false, now).key === "overdue";
      return true;
    }),
    submittedIds,
    now,
  );

  const emptyText: Record<Filter, string> = {
    "Por entregar": "✓ Todo entregado. ¡Buen trabajo!",
    Entregadas: "Todavía no marcaste ninguna entrega.",
    Vencidas: "No tenés entregas vencidas.",
    Todas: "No hay actividades publicadas en tus cursos.",
  };

  return (
    <>
      <div className="row between page-heading">
        <div>
          <h1>Nada se te pasa.</h1>
          <p>Todos tus cursos. Todas tus entregas. Ordenadas por lo que vence primero.</p>
        </div>
      </div>
      <nav className="tabs" aria-label="Filtrar tareas">
        {FILTERS.map((f) => (
          <Link
            key={f}
            className={`tab ${filter === f ? "active" : ""}`}
            href={`/tareas?filtro=${encodeURIComponent(f)}`}
            aria-current={filter === f ? "page" : undefined}
            style={{ textDecoration: "none" }}
          >
            {f}
          </Link>
        ))}
      </nav>
      <DeadlineLegend />
      <div className="panel tasks">
        {visible.length ? (
          visible.map((t) => <TaskRow key={t.id} task={t} submitted={submittedIds.has(t.id)} now={now} />)
        ) : (
          <div className="empty">{emptyText[filter]}</div>
        )}
      </div>
      <div className="notice" style={{ marginTop: 20 }}>
        Las actividades vencidas siguen aceptando entregas: quedan marcadas como <b>Tarde</b>.
      </div>
    </>
  );
}
