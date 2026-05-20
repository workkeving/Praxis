# Praxis

Juego web de estudio médico para exámenes de residencia colombianos. Casos clínicos reales del examen de la Universidad de Antioquia presentados por una asistente carismática que acompaña al estudiante caso por caso.

Gratuito, sin login, sin backend. Pensado mobile-first para estudiar en el bus, en el descanso del turno o entre rondas.

## Concepto

El jugador recorre un hospital virtual con tres salas (Urgencias, Consultorio, Hospitalización) y resuelve casos clínicos en formato de selección múltiple. La asistente reacciona a cada respuesta, explica los conceptos clave y refuerza el aprendizaje con repaso espaciado de los errores. Las palabras clave de cada explicación enlazan a Wikipedia en español.

Cuatro pantallas por caso:

1. Llegada: gancho corto de la asistente
2. Caso: ficha clínica + pregunta + opciones, todo visible
3. Feedback: marco verde o rojo + reacción breve
4. Explicación: TL;DR + tratamiento + por qué las otras opciones no + cierre

## Stack

- React 18 + TypeScript + Vite
- Tailwind CSS para estilos
- Zustand (con persist) para estado y progreso en localStorage
- Framer Motion para transiciones
- Monorepo con npm workspaces (`apps/web` + `packages/data`)

## Estructura

```
praxis-app/
  apps/web/         Aplicación Vite + React
  packages/data/    Banco de preguntas (68 casos)
assets/             Personaje, fondos y logo
Documents/          GDD y notas de diseño
tools/              Scripts auxiliares (generación de arte, capturas)
```

## Cómo correrlo

Requiere Node 18 o superior.

```bash
cd praxis-app
npm install
npm run dev
```

Vite arranca en `http://localhost:5173` con `--host` activo para probar desde el móvil en la misma red. Build de producción con `npm run build`.

## Estado

MVP funcional con:

- Hub del hospital (3 salas + Repaso + Simulacro)
- Flujo de 4 pantallas por caso
- Expediente con XP, nivel, racha, estadísticas por especialidad e insignias
- Simulacro cronometrado de 2 horas con resultado por especialidad
- Persistencia local del progreso
- 68 preguntas reales del examen UdeA (19 marcadas como `revisar: true` pendientes de validación médica antes de publicación pública)

## Distribución del banco

- Por sala: Consultorio 39 / Urgencias 26 / Hospitalización 3
- Top especialidades: pediatría 8, cirugía 6, ortopedia 6, neurología 6, cardiología 6

## Principios de diseño

Resumidos del GDD (`Documents/PRAXIS-GDD-v1.md`):

- El estudiante es el héroe
- Cero fricción para entrar
- El error es información, no castigo
- Español primero
- Praxis no es autoridad médica: complementa, no reemplaza al currículum

## Licencia

MIT. Ver [LICENSE](LICENSE).

El contenido de las preguntas proviene del examen público de la Universidad de Antioquia y se reproduce con fines educativos. El PDF original no se distribuye en este repositorio.

## Contribuir

Si eres médico o residente y quieres revisar las preguntas marcadas con `revisar: true` en `praxis-app/packages/data/src/preguntas.json`, abre un PR o un issue. Si quieres aportar casos nuevos, revisa primero el GDD para mantener el tono y la estructura.
