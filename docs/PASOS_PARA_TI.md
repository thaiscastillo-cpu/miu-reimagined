# Lo que te toca hacer a vos (en orden)

Ya está hecho: la app Next.js, la base de datos en Supabase (tablas, seguridad y datos ficticios) y el primer deploy en Vercel.
Faltan cosas que **solo vos podés hacer** porque piden tu cuenta o tu navegador.

---

## 1. Activar el login con Google (≈15 min) — imprescindible

Sin esto, el botón "Continuar con Google" da error.

### A. Google Cloud Console
1. Entrá a https://console.cloud.google.com/ con tu cuenta **personal de Gmail** (los correos @ufm.edu pueden estar bloqueados por la universidad).
2. Arriba a la izquierda → **Select a project → New project** → nombre: `MIU Reimagined Demo` → **Create**.
3. Menú → **Google Auth Platform** → **Get started**:
   - App name: `MIU Reimagined – Demo`
   - Support email: tu correo
   - Audience: **External**
   - Contact email: tu correo → **Create**
4. **Data Access** → **Add or remove scopes** → marcá `openid`, `.../auth/userinfo.email` y `.../auth/userinfo.profile` → **Save**.
5. **Audience** → **Test users** → **Add users**: agregá tu correo y el de los 3 compañeros que van a probar.
6. **Clients** → **Create client** → Application type: **Web application** → nombre `MIU web`.
   - En **Authorized redirect URIs** pegá exactamente:
     ```
     https://nsmjewjnyskwmusklthv.supabase.co/auth/v1/callback
     ```
   - **Create**. Copiá el **Client ID** y el **Client Secret** (no los mandes por chat ni los subas a GitHub).

### B. Supabase
1. https://supabase.com/dashboard/project/nsmjewjnyskwmusklthv/auth/providers → **Google** → activar.
2. Pegá **Client ID** y **Client Secret** → **Save**.
3. https://supabase.com/dashboard/project/nsmjewjnyskwmusklthv/auth/url-configuration
   - **Site URL**: `https://miu-reimagined-thais-7bb8.vercel.app`
   - **Redirect URLs** → Add URL (una por una):
     ```
     https://miu-reimagined-thais-7bb8.vercel.app/auth/callback
     http://localhost:3000/auth/callback
     ```
   - **Save**.

### C. Probar
Abrí la URL en una ventana de incógnito → **Continuar con Google** → deberías ver "Hola, [tu nombre]."
Probá también en el teléfono y con una segunda cuenta de Google.

---

## 2. Subir el código a GitHub (≈5 min)

1. En https://github.com/new creá un repositorio **privado** llamado `miu-reimagined`, **vacío** (sin README ni .gitignore).
2. Pasame tu usuario de GitHub en el chat: conecto el repo a esta sesión y hago el push.
3. Después, en Vercel → proyecto `miu-reimagined` → **Settings → Git → Connect** ese repo, para que cada push vuelva a publicar solo.

---

## 3. Pruebas con 3 estudiantes (sesión 3 de la guía)

Guion de 10–12 min por persona (sección 10 de la guía):
1. Pedí permiso para tomar notas o usar Granola.
2. «¿Cómo gestionás hoy tareas, horarios y avisos?»
3. **Tarea A:** «Encontrá qué tarea requiere tu atención primero y decime cuándo vence.»
4. **Tarea B:** «Averiguá a qué hora y dónde es tu próxima clase.»
5. **Tarea C:** «Encontrá el último aviso importante de uno de tus cursos.»
6. «¿Qué fue confuso? ¿Qué cambiarías primero?»

No les digas dónde hacer clic. Anotá Sí / Parcial / No por tarea y la mayor fricción. Pasame las notas y te ayudo a elegir e implementar las 2 mejoras.

---

## 4. Pendiente de la guía que no puedo inventar

- **El documento de las ~30 entrevistas:** la guía pide que el problema principal salga de ahí. Mandámelo y ajusto el texto del README y del demo con evidencia real.
