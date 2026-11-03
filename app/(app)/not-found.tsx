import Link from "next/link";

export default function NotFound() {
  return (
    <div className="panel empty">
      <h2>No encontramos esto.</h2>
      <p style={{ margin: "10px 0 18px" }}>Puede que no exista o que no sea de uno de tus cursos.</p>
      <Link className="btn" href="/">
        Volver al dashboard
      </Link>
    </div>
  );
}
