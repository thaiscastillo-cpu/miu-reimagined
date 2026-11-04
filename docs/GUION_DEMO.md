# Guion de demo · 3 minutos

**URL:** https://miu-reimagined.vercel.app

## Antes de presentar (10 min antes)

- [ ] Los correos de quienes van a entrar están en Google Cloud → Audience → **Test users**.
- [ ] Ventana normal: sesión iniciada con **tu cuenta** (Administración).
- [ ] Ventana de incógnito: sesión iniciada con **una cuenta de estudiante**, inscrita en el curso de la demo.
- [ ] En Cursos y cupos → «Cursos: catedráticos y estudiantes», **asignate como catedrática** de Contabilidad Financiera. Si no, en la vista de catedrático no vas a ver entregas.
- [ ] Como catedrática, publicá una tarea con fecha **futura** en ese curso (Tareas y entregas → + Publicación rápida). Así el estudiante la ve y se puede mostrar «Volver a entregar».
- [ ] Tené un documento corto en tu Drive o en la computadora para adjuntar.
- [ ] Zoom del navegador al 110–125 % para que se lea en el proyector.

## Guion

| Tiempo | Qué decir | Qué mostrar |
|---|---|---|
| **0:00–0:30** · El problema | «En las entrevistas a ~30 estudiantes encontramos que [problema principal]. Por ejemplo, [cita o dato]. Hoy esa información está repartida en [dónde].» | Una diapositiva o solo hablar. Usá **evidencia real** de `docs/INVESTIGACION_USUARIOS.md`. |
| **0:30–1:00** · La experiencia | «Diseñamos MiU en Claude Design: un solo lugar con tu próxima entrega, tu clase y los avisos. La decisión clave fue **ordenar por urgencia con color**: amarillo vence hoy, rojo vencida, verde en unos días. Cada rol ve lo que necesita.» | Dashboard del estudiante (incógnito): «Mis pendientes» con la leyenda de colores. |
| **1:00–2:00** · Demo real | 1. «Entro con Google; es mi cuenta, mi nombre y mi foto.» 2. «Abro la tarea más urgente y la entrego desde **mi Drive real**.» → comprobante. 3. «Ahora soy la catedrática:» cambio a Catedrático → Tareas y entregas → Revisar → abro el archivo → pongo nota. 4. «El estudiante recarga y ya ve su nota.» 5. (Si sobra tiempo) «Administración asigna roles y cursos; un estudiante no puede subirse de rol.» | Incógnito (estudiante): Entregar → Google Drive → Confirmar. Tu ventana: selector **Catedrático** → Tareas y entregas → Revisar → calificar. Incógnito: recargar → Ver entrega con la nota. |
| **2:00–2:40** · Tres alumnos lo probaron | «Lo probamos con 3 estudiantes. [X de 3] completaron [tarea] sin ayuda. La mayor fricción fue [hallazgo]. Por eso cambiamos [mejora 1] y [mejora 2].» | Antes y después, o la pantalla ya corregida. Fuente: `docs/CAMBIOS.md` sección 1. |
| **2:40–3:00** · Lo que sigue | «Es un prototipo académico **no oficial**. Para usarlo en la U faltaría conectarlo al sistema académico real con autorización de TI, aprobar la app para los correos @ufm.edu y hacer un piloto con 1 o 2 cursos.» | `docs/PARA_IMPLEMENTAR_EN_LA_UFM.md` (solo mencionarlo). |

## Plan B (si algo falla en vivo)

- **Google no deja entrar:** el correo no está en Test users. Usá tu cuenta, que ya funciona, y mostrá el resto cambiando de rol con el selector.
- **Drive falla:** adjuntá con «Subir archivos» desde la computadora. El catedrático también lo puede abrir.
- **Internet lento:** tené capturas de cada paso en una diapositiva de respaldo.

## Frases cortas por si te preguntan

- **¿Qué es real?** Login con Google, roles, entregas, archivos, notas, chat y asistencia se guardan en Supabase con reglas de seguridad. Pagos, parqueo, pensum y horarios son datos de ejemplo.
- **¿Es seguro?** Cada tabla tiene reglas (RLS). Un estudiante no ve los datos de otro, no puede ponerse nota ni cambiarse de rol. Lo probamos con usuarios distintos.
- **¿Por qué no Next.js?** Para respetar el diseño aprobado tal cual. La versión en Next.js quedó en la rama `nextjs-supabase`.
