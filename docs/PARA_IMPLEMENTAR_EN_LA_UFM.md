# Qué falta para usar MiU de verdad en la universidad

MiU hoy es un **prototipo funcional**:
- Login con Google, roles y permisos son reales.
- Las entregas, notas, chat y Drive funcionan con datos de verdad.
- Los cursos, horarios, pagos y conferencias son de ejemplo.

Para que la universidad lo use con estudiantes reales faltan dos tipos de cosas.

## A. Lo que se puede construir (trabajo técnico)

| # | Qué falta | Por qué importa |
|---|---|---|
| 1 | **Cursos, secciones e inscripciones en la base de datos** (hoy vienen escritos dentro del diseño) y que Administración los cree y asigne a estudiantes y catedráticos. | Cada catedrático debe ver solo a sus alumnos y cada estudiante solo sus cursos. |
| 2 | **Tareas publicadas por el catedrático visibles para sus estudiantes** (hoy "Publicación rápida" queda solo en la cuenta del catedrático). | Es el flujo principal: publicar → entregar → calificar. |
| 3 | **Archivos subidos guardados de verdad** (Supabase Storage), con límite de tamaño y tipos permitidos. Hoy solo se guarda el nombre (Drive sí funciona). | El catedrático tiene que poder abrir lo que se entregó desde la computadora. |
| 4 | **Asistencia a conferencias real**: Administración escanea el QR del estudiante y se le acredita en su cuenta. | Hoy el registro no le llega al estudiante. |
| 5 | **Hilos y "Me gusta" del chat compartidos**, y moderación (borrar mensajes, reportar). | Hoy solo se comparten los mensajes principales. |
| 6 | **Avisos reales** entre usuarios (nota publicada, cambio de fecha, nueva tarea), y opcionalmente por correo. | Hoy los avisos se generan en el navegador de cada persona. |
| 7 | **Historial de cambios** (quién calificó o cambió un rol y cuándo). | Necesario para reclamos y auditoría. |
| 8 | **Pruebas automáticas** de permisos y de los recorridos principales, y un entorno de prueba separado del real. | Para no romper nada al publicar cambios. |
| 9 | **Plan pagado de Supabase y Vercel**. El plan gratuito de Vercel no permite uso institucional, y el de Supabase se pausa por inactividad. Además: respaldos diarios y monitoreo de errores. | Disponibilidad y no perder datos. |
| 10 | **Pagos y parqueo**: conectarlos a un procesador de pagos real o quitarlos. | Hoy son simulados y no deben parecer reales. |

## B. Lo que solo la universidad puede decidir o dar

1. **Autorización oficial**:
   - permiso para usar el nombre MiU, la marca y el logo de la universidad;
   - un dominio institucional;
   - un responsable dentro de la universidad.
2. **Datos reales**: acceso al sistema académico (cursos, secciones, inscripciones, notas, pensum) mediante una integración aprobada por TI. **Nunca copiar datos a mano.**
3. **Cuentas institucionales**: que el administrador de Google Workspace de la universidad apruebe la app para los correos @ufm.edu (login y Drive). También hay que verificarla con Google, que hoy está en "modo de prueba", limitado a usuarios agregados a mano.
4. **Privacidad y aspectos legales**: aviso de privacidad, consentimiento y política de retención de datos de estudiantes. También una revisión de seguridad hecha por TI.
5. **Piloto**: probar con 1 o 2 cursos reales y un grupo pequeño antes de abrirlo a toda la universidad. Además, capacitar a catedráticos y definir quién da soporte.

## Recomendación

Para el workshop, MiU ya cumple lo que se pide: URL pública, login, datos que se guardan, seguridad entre usuarios y la etiqueta de "no oficial".

Para llevarlo a la universidad:
- El paso realista es presentarlo como **propuesta piloto** a la universidad, con este documento.
- Mientras tanto, se pueden construir los puntos 1 a 3 de la parte A, que son los que lo hacen usable para un curso piloto.
