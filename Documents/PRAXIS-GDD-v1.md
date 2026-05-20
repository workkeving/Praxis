# PRAXIS
## Game Design Document — v1.0 MVP

> *Praxis (del griego πρᾶξις): la unión entre teoría y práctica clínica.*

---

| Atributo | Valor |
|---|---|
| **Tipo de producto** | Juego web de estudio médico |
| **Audiencia primaria** | Estudiantes de medicina en Colombia preparándose para examen de residencia |
| **Audiencia secundaria** | Estudiantes de medicina en Latinoamérica |
| **Plataforma** | Web responsive (PC + móvil), sin instalación |
| **Modelo** | Gratuito, sin login, progreso local |
| **Idioma del contenido** | Español 100% (terminología médica colombiana) |
| **Idioma del código/docs** | Inglés (estándar de desarrollo) |
| **Pipeline de desarrollo** | Asistido por Claude (Anthropic) |

---

## 1. VISIÓN

### Pitch

Praxis es un juego web inmersivo estilo manga/anime donde el jugador encarna a un médico que recorre un hospital virtual atendiendo casos clínicos reales del examen de residencia. Una asistente carismática lo acompaña en cada caso: le presenta al paciente, reacciona a sus decisiones y le enseña con calidez. No es un quiz más — es una experiencia narrativa que convierte el estudio en algo que quieres volver a abrir.

### Objetivo del jugador

Prepararse para el examen de residencia (UdeA, Nacional, similares) de forma interactiva, sin sentirse estudiando, mientras consolida conocimiento clínico colombiano real.

### Diferenciadores

- Narrativa + personaje: cada caso se siente como una mini-escena de visual novel
- Sin penalización por fallar: los errores se convierten en oportunidades de repaso
- Palabras clave clickeables → Wikipedia: profundización opcional in-game
- Banco de preguntas reales del examen UdeA
- Gratuito, sin login, sin paywall, sin ads
- Estética manga/anime de calidad, no clínica genérica
- 100% en español con contexto médico colombiano (guías Minsalud, OPS, normativas locales)

---

## 2. PERSONAJE: LA ASISTENTE

### Identidad

Joven residente o enfermera, compañera de turno del jugador. Personalidad inspirada en **Marin Kitagawa** (My Dress-Up Darling): amable, risueña, genuinamente entusiasta, expresiva — pero **inteligente y profesional**. Te trata como colega, no como alumno.

### Voz y tono

- Tutea al jugador o usa "doctor/doctora" según contexto
- Español natural colombiano sin caer en regionalismos pesados
- Frases cortas, expresivas, con energía
- Usa terminología médica correcta pero la traduce cuando hace falta
- Nunca condescendiente al equivocarse el jugador

### Rol narrativo

- Recibe al jugador al abrir el juego
- Pregunta qué modo quiere jugar
- Presenta cada caso clínico con su propio diálogo
- Reacciona a las respuestas (acierto/error)
- Explica con cariño qué pasó y por qué
- Envía recordatorios aleatorios cuando no estás jugando ("¡Doctor! Llegó un caso...")

### Expresiones en MVP (4)

| ID | Estado | Cuándo aparece |
|---|---|---|
| `idle` | Neutral feliz | Default entre interacciones |
| `acierto` | Celebra, orgullosa | Tras respuesta correcta |
| `error` | Preocupada, comprensiva | Tras respuesta incorrecta |
| `explicando` | Didáctica, gesto enseñando | Durante la explicación |

---

## 3. ESTÉTICA

### Estilo visual

- **Manga / anime 2D ilustrado** — no pixel-art, no realista, no flat design genérico
- Referencias: visual novels modernas, anime contemporáneo
- Composición: personaje en primer plano (lado derecho), fondo de contexto detrás, globo de diálogo estilo manga
- UI superpuesta limpia, no satura la escena

### Paleta

Determinada por las ilustraciones generadas. Dirección: cálida pero clínica, evita neón y dark mode pesado. Permite tonos que evoquen hospital sin caer en el blanco estéril.

### Tipografía

Por definir en build. Combinación recomendada: display anime-friendly + sans-serif legible para textos largos en español (caracteres con tildes y ñ deben renderizar perfecto).

---

## 4. MAPA: EL HOSPITAL

### Hub principal

Vista ilustrada del hospital con las salas visibles. El jugador hace tap directo en una sala y entra. No hay lobby intermedio que ralentice el acceso.

### Salas del MVP (3 fondos únicos)

| Sala | Fondo | Especialidades |
|---|---|---|
| **Urgencias** | `fondo_urgencias.jpg` | Cirugía aguda, trauma, urgencias, toxicología, ortopedia aguda |
| **Consultorio** | `fondo_consultorio.jpg` | Medicina interna ambulatoria, gineco, psiquiatría, derma, oftalmo, ORL, pediatría ambulatoria |
| **Hospitalización** | `fondo_hospitalizacion.jpg` | Medicina interna hospitalizada, UCI, post-quirúrgico, casos complejos |

### Indicador de dominio

Cada sala muestra cuántas preguntas de su pool ha resuelto correctamente al primer intento. Visual: 3 estrellas (0/3 → 3/3) + porcentaje.

---

## 5. MODOS DE JUEGO

Al abrir Praxis, la asistente recibe al jugador y pregunta: **"¿Qué quieres hacer hoy, doctor?"**

### Modo 1 — Urgencias (sesión rápida)
- Casos aleatorios solo de la sala Urgencias
- Sin límite de tiempo
- Ideal para sesiones cortas de 5-10 minutos

### Modo 2 — Consulta (sesión libre)
- Jugador elige sala/especialidad
- Recorre preguntas en orden o aleatorio
- Duración libre

### Modo 3 — Repaso (casos pendientes)
- Solo preguntas que falló antes
- Sistema de "recuperación": al dominar una pendiente, sale de la lista
- Repaso espaciado encubierto

### Modo 4 — Simulacro (examen completo)
- ~70 preguntas mezcladas de todas las especialidades
- Cronometrado (≈ 2 horas, como examen real)
- Sin retroalimentación durante el examen
- Al final: reporte detallado por especialidad

---

## 6. LOOP DE GAMEPLAY

### Flujo de una pregunta

```
1. PRESENTACIÓN
   La asistente narra el caso en formato manga:
   "Doctor, llegó un paciente de 25 años con..."
   Fondo: según la sala. Personaje: expresión idle.

2. PREGUNTA
   Enunciado completo + 4 opciones (a, b, c, d).
   Sin timer en modos libres.

3. SELECCIÓN
   Jugador toca/clickea una opción.

4a. SI ACIERTA:
    • Expresión cambia a "acierto"
    • Marco VERDE sobre la opción correcta
    • Diálogo breve de celebración
    • +XP, +stats por especialidad
    • Botón: "Ver explicación" o "Siguiente caso"

4b. SI FALLA:
    • Expresión cambia a "error"
    • VIÑETA ROJA sobre la opción incorrecta
    • Marco verde sobre la correcta
    • Diálogo comprensivo, no juzga
    • Caso entra a "Casos pendientes de repaso"

5. EXPLICACIÓN
   • Expresión "explicando"
   • Texto detallado: por qué la correcta es correcta y por qué las otras NO
   • Palabras clave en hipervínculo → Wikipedia ES (nueva pestaña)
   • Botón "Continuar"

6. SIGUIENTE CASO o VUELTA AL HUB
```

### Filosofía de no-penalización

- Sin vidas
- Sin timer en modos libres
- Cada error → entrada en lista de repaso
- La "recuperación" llega dominando pendientes — refuerzo positivo

---

## 7. PROGRESO Y EXPEDIENTE

### "Mi Expediente"

Métricas visibles:
- Casos resueltos totales
- Pacientes salvados (aciertos primer intento)
- Casos pendientes
- XP y nivel actual
- Racha diaria
- Insignias obtenidas
- Dominio por especialidad (gráfico radar)

### XP y niveles

| Acción | XP |
|---|---|
| Acierto primer intento | +10 |
| Acierto en repaso | +5 |
| Fallo | 0 (sin penalización) |
| Bonus racha 7 días | +50 |

Niveles 1-10 con nombres temáticos:
1. Estudiante
2. Interno
3. Médico general
4. R1
5. R2
6. R3
7. Residente jefe
8. Especialista
9. Jefe de servicio
10. Maestro de la praxis

### Insignias

- 🏥 **Primera consulta** — primer caso resuelto
- ⚕️ **Diagnóstico certero** — 10 aciertos seguidos
- 📚 **Estudioso** — repasar 20 casos pendientes
- 🏆 **Maestro de Urgencias** — 90% dominio en Urgencias
- 🔥 **Racha de fuego** — 7 días seguidos
- 🌙 **Trasnochador** — caso resuelto después de medianoche
- 🩺 **Generalista** — al menos 1 caso en cada especialidad
- 💎 **Perfeccionista** — 100% en una sala

### Recordatorios

- Notificaciones aleatorias durante el día (opt-in del usuario)
- Formato: "¡Doctor! Llegó un caso de [tema] a urgencias, ¿puede verlo?"
- Tap → caso aleatorio del tema

---

## 8. CONTENIDO: BANCO DE PREGUNTAS

### Banco inicial

~68 preguntas del examen UdeA (PDF proporcionado por Kevin). Cada pregunta tiene:
- Especialidad clínica
- Sala asignada
- Dificultad (1-3)
- Respuesta correcta validada clínicamente
- Explicación detallada (generada por Claude, revisada por Kevin)
- Palabras clave para hiperenlaces a Wikipedia ES

### Esquema JSON por pregunta

```json
{
  "id": 1,
  "especialidad": "pediatria",
  "sala": "consultorio",
  "dificultad": 1,
  "narracion_asistente": "Doctor, vino la mamá de un niño de 10 años...",
  "enunciado": "Niño de 10 años quien desde 1 año antes presenta síntomas nasales...",
  "opciones": [
    { "letra": "a", "texto": "Esteroide tópico en spray nasal cada 24 horas" },
    { "letra": "b", "texto": "Antihistamínico oral de primera generación" },
    { "letra": "c", "texto": "Antihistamínico oral de segunda generación" },
    { "letra": "d", "texto": "Montelukast oral 5 mg cada 24 horas" }
  ],
  "correcta": "a",
  "explicacion": "La rinitis alérgica persistente con hipertrofia de cornetes...",
  "palabras_clave": [
    { "termino": "rinitis alérgica", "wiki": "Rinitis_alérgica" },
    { "termino": "hipertrofia de cornetes", "wiki": "Cornete_nasal" }
  ]
}
```

### Consideración crítica sobre el contenido

**TODA explicación generada por Claude debe ser revisada por un humano con conocimiento médico antes de publicarse.** Claude puede equivocarse en detalles clínicos finos. Las respuestas correctas marcadas en el PDF original tienen prioridad sobre lo que Claude considere "más actualizado".

---

## 9. PERSISTENCIA

### LocalStorage del navegador

```javascript
praxis.progreso_global    // XP, nivel, racha, fecha último login
praxis.casos_resueltos    // [{id, outcome, fecha}]
praxis.casos_pendientes   // [id, id, id...]
praxis.insignias          // [id, id, id...]
praxis.stats              // {especialidad: {correctas, totales}}
praxis.config             // {notificaciones, sonido_futuro}
```

### Sin servidor en MVP

Todo en cliente. Funciona offline después de la primera carga.

### Reset

Botón "Reiniciar progreso" en settings, doble confirmación.

---

## 10. ASSETS REQUERIDOS PARA MVP

### Imágenes (8 archivos)

```
/assets
  /personaje
    asistente_idle.png          (PNG transparente, ≥1024px alto)
    asistente_acierto.png
    asistente_error.png
    asistente_explicando.png
  /fondos
    fondo_urgencias.jpg          (1920x1080, JPG)
    fondo_consultorio.jpg
    fondo_hospitalizacion.jpg
  /ui
    logo.png                     (PNG transparente)
```

### Pipeline de generación de assets

Kevin genera los assets con su pipeline AI personal (Flux/ComfyUI/Midjourney). El código se construye con placeholders visualmente coherentes que se reemplazan archivo por archivo sin tocar lógica.

---

## 11. STACK TÉCNICO

| Capa | Tecnología |
|---|---|
| Framework | React |
| Estilos | Tailwind CSS |
| Estado | React hooks (useState, useReducer) |
| Persistencia | localStorage |
| Animaciones | CSS transitions + Framer Motion si se necesita |
| Iconografía | Lucide React |
| Build inicial | Single-file artifact en Claude |
| Build de producción | Vite (cuando salga del artifact) |
| Backend MVP | Ninguno |
| Hosting recomendado | Vercel / Netlify / Cloudflare Pages (todos gratuitos) |

---

## 12. DESARROLLO ASISTIDO POR CLAUDE

Esta sección documenta cómo se construye Praxis usando Claude como copiloto.

### Flujo de trabajo

```
1. Kevin define qué construir (basado en el GDD)
   ↓
2. Claude implementa en un artifact (single-file React)
   ↓
3. Kevin prueba en el preview del artifact
   ↓
4. Iteración: Kevin pide ajustes, Claude refina
   ↓
5. Al estabilizarse: Kevin extrae el código del artifact a su repo local
   ↓
6. Kevin agrega assets reales (reemplaza placeholders)
   ↓
7. Kevin hace deploy a Vercel/Netlify
   ↓
8. Iteraciones posteriores: vuelven a Claude para features nuevas
```

### Rol de Claude en cada parte

| Componente | Rol de Claude | Rol de Kevin |
|---|---|---|
| Código React/TypeScript | Genera, refactoriza, debuggea | Revisa, prueba, integra |
| Lógica de gameplay | Implementa según GDD | Diseña y valida UX |
| Contenido médico (explicaciones) | Genera borradores | **Revisa y corrige** (crítico) |
| Diálogos de la asistente | Genera variaciones | Selecciona y ajusta tono |
| Assets visuales | NO los genera | Los genera con su pipeline AI |
| Testing | Sugiere casos de prueba | Ejecuta pruebas reales |
| Deploy | Da instrucciones | Ejecuta |

### Principios para prompts efectivos a Claude

Cuando Kevin pida features nuevas o ajustes a Claude:

1. **Referenciar el GDD**: "Según la sección X del GDD..."
2. **Ser específico sobre el alcance**: "Solo cambia el modal de explicación, no toques el hub"
3. **Pegar el código actual cuando se pide modificación**: evita que Claude reinvente
4. **Pedir un componente a la vez en código complejo**: el artifact se vuelve denso rápido
5. **Validar contenido médico independientemente**: no confiar ciegamente en explicaciones generadas

### Limitaciones conocidas de Claude para este proyecto

- **No genera imágenes** — Kevin las hace en su pipeline AI separado
- **Puede alucinar detalles clínicos** — toda explicación médica requiere revisión
- **No tiene memoria persistente entre sesiones** — el GDD vive en el repo, no en Claude
- **Single-file artifacts tienen límite de tamaño** — al crecer Praxis, se debe migrar fuera del artifact
- **No ejecuta el código** — Kevin valida en preview o en local

### Memoria viva del proyecto

El GDD vive en el repo del proyecto. Cuando Kevin abra una nueva conversación con Claude para trabajar en Praxis, debe:
1. Pegar el GDD actualizado al inicio (o link al archivo si está disponible)
2. Pegar el código actual del componente a modificar
3. Indicar claramente qué se está pidiendo

Esto garantiza que cada sesión empiece con contexto completo.

---

## 13. ROADMAP

### MVP (siguiente paso)
- Hub del hospital con 3 salas
- Personaje asistente con 4 expresiones
- Banco de ~30 preguntas del examen UdeA con explicaciones
- Modo Urgencias + Modo Consulta + Modo Repaso
- Sistema XP, niveles, racha, expediente
- Hiperenlaces a Wikipedia desde explicaciones
- Persistencia local
- Deploy en Vercel/Netlify con dominio gratuito

### v2
- Modo simulacro cronometrado completo
- Audio ambiente hospitalario
- 6-8 expresiones del personaje
- Avatares de pacientes
- Más fondos contextuales (calle, casa, UCI específica)
- Notificaciones push reales (PWA)
- Compartir resultados en redes
- Banco extendido a 100+ preguntas

### v3
- Multijugador / ranking semanal
- Más bancos de preguntas (otros exámenes nacionales)
- Voz sintetizada para la asistente (TTS)
- App móvil nativa (Capacitor o PWA install)
- Login opcional + sync entre dispositivos
- Editor de casos para la comunidad

---

## 14. NOMBRE DEL JUEGO

**PRAXIS**

*Del griego πρᾶξις: práctica, acción derivada del conocimiento.*

Por qué:
- Funciona idéntico en español e inglés
- Significado médico directo: "praxis clínica" = ejercicio de la medicina
- Significado filosófico: la unión entre teoría y acción
- Una sola palabra, corta, memorable
- Profesional con potencial de marca

---

## 15. PRINCIPIOS DE DISEÑO

Los lentes con los que se debe revisar cualquier decisión futura:

1. **El estudiante es el héroe.** La asistente y el juego están al servicio del aprendizaje, no para lucirse.
2. **Cero fricción, máxima inmersión.** Si una mecánica no aporta al estudio, se elimina.
3. **El error es información, no castigo.** Toda la mecánica refuerza esto.
4. **Conocimiento real y verificable.** Las preguntas vienen de exámenes reales, las explicaciones revisadas por humano.
5. **Gratis y accesible.** Sin paywall, sin login obligatorio, funciona en cualquier teléfono con navegador.
6. **Calidad estética = respeto al usuario.** No se ve como app médica genérica.
7. **Español primero.** Todo el contenido, diálogos y terminología en español natural colombiano.
8. **Claude es herramienta, no autoridad médica.** Toda decisión clínica del contenido la valida un humano competente.

---

**FIN DEL GDD v1.0 — Listo para implementación del MVP.**
