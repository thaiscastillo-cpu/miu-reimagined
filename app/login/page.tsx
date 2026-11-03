import { DemoBar } from "@/components/DemoBar";
import { GoogleButton } from "./GoogleButton";

export default async function LoginPage({ searchParams }: PageProps<"/login">) {
  const params = await searchParams;
  const next = typeof params.next === "string" ? params.next : "/";
  const error = params.error === "auth";

  return (
    <>
      <DemoBar />
      <div className="login">
        <section className="login-story">
          <div className="row brand">
            <span className="brand-mark" aria-hidden="true">M</span>
            <div>
              <b>MiU</b>
              <small>REIMAGINED · DEMO</small>
            </div>
          </div>
          <h1>
            Tu universidad.
            <br />
            A tu ritmo.
          </h1>
          <p>Menos vueltas. Más tiempo para lo que importa. Tus clases, entregas y avisos, en un solo lugar.</p>
          <span className="eyebrow">UNA PROPUESTA ESTUDIANTIL</span>
        </section>
        <section className="login-form">
          <div className="login-box">
            <span className="badge">Prototipo académico no oficial</span>
            <h2 style={{ marginTop: 20 }}>
              Tu próximo paso
              <br />
              empieza aquí.
            </h2>
            <p>Entrá con tu cuenta de Google para ver tus entregas, tu horario y los avisos de tus cursos.</p>
            <GoogleButton next={next} />
            {error ? (
              <p className="status-msg err" role="alert">
                No pudimos iniciar tu sesión. Probá de nuevo; si sigue fallando, avisale al equipo.
              </p>
            ) : null}
            <div className="demo-disclaimer">
              Demo estudiantil sin vinculación operativa con MIU/UFM. Google solo confirma quién sos: no accedemos a tu
              correo, archivos ni a sistemas de la universidad. Cursos, tareas y avisos son ficticios.
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
