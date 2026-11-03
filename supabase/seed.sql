-- MIU Reimagined · Datos semilla FICTICIOS (ningún dato real de estudiantes).
-- Fechas en hora de Guatemala (UTC-6), alrededor de la semana del 2 al 13 de noviembre de 2026.

insert into public.courses (id, name, code, section, teacher_name, room, schedule_label, symbol) values
  (1, 'Contabilidad Financiera', 'C0004', 'H', 'Elena Morales',   'Aula B-304', 'Lun · Mié 08:00–09:20', '∑'),
  (2, 'Economía II',             'E004',  'B', 'Andrés Castillo', 'Aula C-201', 'Mar · Jue 10:00–11:20', '↗'),
  (3, 'Cálculo Diferencial',     'MC05',  'C', 'Lucía Herrera',   'Aula B-202', 'Lun · Mié 11:30–12:50', '∂'),
  (4, 'Física I',                'MF005', 'A', 'Lucía Herrera',   'Laboratorio F-101', 'Mar · Jue 14:00–15:20', 'F'),
  (5, 'Discovering the Business World II', 'G0003', 'C', 'Andrés Castillo', 'Aula D-105', 'Vie 09:00–10:50', '◎')
on conflict (id) do nothing;

insert into public.class_sessions (id, course_id, weekday, starts_at, ends_at, location) values
  (1, 1, 1, '08:00', '09:20', 'Aula B-304'),
  (2, 1, 3, '08:00', '09:20', 'Aula B-304'),
  (3, 2, 2, '10:00', '11:20', 'Aula C-201'),
  (4, 2, 4, '10:00', '11:20', 'Aula C-201'),
  (5, 3, 1, '11:30', '12:50', 'Aula B-202'),
  (6, 3, 3, '11:30', '12:50', 'Aula B-202'),
  (7, 4, 2, '14:00', '15:20', 'Laboratorio F-101'),
  (8, 4, 4, '14:00', '15:20', 'Laboratorio F-101'),
  (9, 5, 5, '09:00', '10:50', 'Aula D-105')
on conflict (id) do nothing;

insert into public.tasks (id, course_id, title, description, type, is_group, weight, due_at) values
  (1, 1, 'Análisis de estados financieros',
   'Analizá el balance general y el estado de resultados del caso del curso. Entregá tus indicadores, interpretación y conclusiones.',
   'Tarea', false, 10, '2026-11-04 23:59-06'),
  (2, 2, 'Ensayo: incentivos y decisiones',
   'Elegí una decisión cotidiana y explicá cómo cambian los incentivos de sus participantes. Extensión sugerida: 800 a 1,000 palabras.',
   'Tarea', false, 15, '2026-11-05 18:00-06'),
  (3, 3, 'Proyecto de aplicaciones de cálculo',
   'Presenten un modelo de aplicación de derivadas a un problema de negocio. Una persona entrega en nombre del grupo.',
   'Proyecto', true, 20, '2026-10-30 23:59-06'),
  (4, 2, 'Segundo examen parcial',
   'Repasá los temas 5 al 8 y los ejercicios de incentivos. Examen presencial en el aula C-201. Traé tu carné y materiales permitidos.',
   'Examen', false, 20, '2026-11-12 10:00-06'),
  (5, 1, 'Lectura: flujo de efectivo',
   'Leé el capítulo sobre flujo de efectivo antes de clase. Prepará dos preguntas para la discusión.',
   'Lectura', false, 0, '2026-11-09 08:00-06'),
  (6, 4, 'Laboratorio 4: movimiento rectilíneo',
   'Completá la hoja de datos del laboratorio y respondé las preguntas de análisis. Incluí tus gráficas.',
   'Tarea', false, 10, '2026-11-06 14:00-06'),
  (7, 5, 'Pitch de idea de negocio',
   'Prepará un pitch de 2 minutos con el problema, el cliente y la propuesta de valor de tu idea.',
   'Proyecto', true, 15, '2026-11-13 09:00-06')
on conflict (id) do nothing;

insert into public.announcements (id, course_id, title, body, important, published_at) values
  (1, 2, 'Cambio de aula para el segundo parcial',
   'El segundo examen parcial será en el aula C-305 en lugar de la C-201. La fecha y la hora no cambian: jueves 12 de noviembre a las 10:00.',
   true, '2026-11-03 09:15-06'),
  (2, 1, 'Material de apoyo publicado',
   'Ya está disponible la guía de ejercicios resueltos sobre razones financieras. Les recomiendo revisarla antes de entregar el análisis de estados financieros.',
   false, '2026-11-02 16:40-06'),
  (3, 3, 'Horario de consulta esta semana',
   'Esta semana tendré horario de consulta el martes de 15:00 a 16:00 en la oficina B-210 para dudas del proyecto.',
   false, '2026-11-02 10:05-06'),
  (4, 4, 'Traer bata al laboratorio',
   'Para el laboratorio del jueves es obligatorio traer bata. Sin bata no se podrá ingresar al laboratorio F-101.',
   true, '2026-11-01 18:30-06'),
  (5, 5, 'Invitado especial el viernes',
   'El viernes nos visita una emprendedora para hablar sobre validación de ideas. La asistencia cuenta como participación.',
   false, '2026-10-30 12:00-06')
on conflict (id) do nothing;
