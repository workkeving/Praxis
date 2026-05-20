# Praxis — Prompts de generación de assets

Generados con **Everbot** (`gemini-3-pro-image-preview` / nano-banana) el **2026-05-20**.

Para regenerar variantes: editar el archivo JSON correspondiente en `tools/params/` y ejecutar:

```bash
cd "K:/01. Personal Projects/07. Praxis/tools"
node gen-asset.mjs "params/<nombre>.json"
```

---

## Personaje (4 expresiones, 9:16, fondo gris)

Referencias usadas: `Documents/Art References/Asistente.png` (+ `asistente_idle.png` como segunda referencia en las expresiones 2-4 para coherencia).

### asistente_idle.png

```
2D anime manga illustration of a young female medical assistant, same character as the reference image: short dark hair, white medical lab coat over casual clothes, stethoscope around neck, friendly approachable expression. Pose: standing relaxed facing the viewer slightly, gentle warm smile, eyes looking at the viewer, hands relaxed at sides or one hand near her chest holding the stethoscope lightly. Style: clean line art, soft cel-shading, professional but warm. Solid neutral medium gray background. Three-quarter body composition centered vertically. Portrait 9:16 mobile aspect ratio. High quality anime illustration.
```

### asistente_acierto.png

```
2D anime manga illustration of the same young female medical assistant from the reference image: short dark hair, white medical lab coat over blue scrubs, stethoscope around neck. Pose and expression: celebrating success, bright joyful eyes, proud warm smile, slight cheerful gesture with one hand raised lightly in a thumbs-up or both hands clasped near her chest in encouragement. Looking directly at viewer with warm approval. Style: clean line art, soft cel-shading, vibrant but professional. Solid neutral medium gray background. Three-quarter body composition centered vertically. Portrait 9:16 mobile aspect ratio. High quality anime illustration.
```

### asistente_error.png

```
2D anime manga illustration of the same young female medical assistant from the reference image: short dark hair, white medical lab coat over blue scrubs, stethoscope around neck. Pose and expression: gently concerned but supportive, soft worried smile, slightly tilted head, one hand near her cheek or holding her chin thoughtfully. Empathetic, NOT judgmental or sad. Looking at the viewer with kind warm eyes. Style: clean line art, soft cel-shading. Solid neutral medium gray background. Three-quarter body composition centered vertically. Portrait 9:16 mobile aspect ratio. High quality anime illustration.
```

### asistente_explicando.png

```
2D anime manga illustration of the same young female medical assistant from the reference image: short dark hair, white medical lab coat over blue scrubs, stethoscope around neck. Pose and expression: teaching gesture, didactic and friendly, one hand raised with index finger pointing up or gesturing as if explaining a concept, confident warm smile, eyes engaging the viewer. Style: clean line art, soft cel-shading. Solid neutral medium gray background. Three-quarter body composition centered vertically. Portrait 9:16 mobile aspect ratio. High quality anime illustration.
```

---

## Fondos hospitalarios (3, 9:16)

Referencias usadas: `Mesto_1_1.webp`, `Mesto_3_1.webp`, `Mesto_4_5.webp`.

### fondo_urgencias.png

```
2D anime manga illustration, hospital emergency room interior, portrait vertical composition for a mobile visual novel. View from inside the ER showing: a stretcher in the foreground slightly off-center, vital signs monitor on a wall mount with subtle screen glow, IV stand, sliding glass doors at the back, fluorescent ceiling light. No people visible. Atmosphere: clean, slightly tense but warm, soft volumetric lighting. Style: clean anime background art with sharp linework, gentle cel-shading, painterly anime style similar to the reference images. Color palette with warm whites, soft greens, subtle accents of red emergency signs. Portrait 9:16 mobile aspect ratio. High detail anime background.
```

### fondo_consultorio.png

```
2D anime manga illustration, medical outpatient consultation room interior, portrait vertical composition for a mobile visual novel. View showing: a clean desk with a laptop and stethoscope in the foreground, an exam bed against the wall to one side, a window with soft daylight filtering in, anatomy poster on the wall, small potted plant, neatly organized. No people visible. Atmosphere: calm, welcoming, professional. Style: clean anime background art with sharp linework, gentle cel-shading, painterly anime style similar to the reference images. Color palette with soft creams, light blues, natural wood tones. Portrait 9:16 mobile aspect ratio. High detail anime background.
```

### fondo_hospitalizacion.png

```
2D anime manga illustration, hospital inpatient room interior, portrait vertical composition for a mobile visual novel. View showing: an empty hospital bed against the side wall, IV drip stand next to it, window with soft natural light filtering in through partly-drawn blinds, side table with a glass of water and a clipboard, calm ambient lighting. No people visible. Atmosphere: quiet, peaceful, slightly somber. Style: clean anime background art with sharp linework, gentle cel-shading, painterly anime style similar to the reference images. Color palette with muted blues, soft whites, warm beige accents. Portrait 9:16 mobile aspect ratio. High detail anime background.
```

---

## Logo (1, 1:1)

### logo.png

```
Minimalist modern logo for a medical study mobile game called 'PRAXIS'. Wordmark with the word PRAXIS in clean modern sans-serif typography, subtle medical motif integrated as a small accent (a stylized stethoscope curve, an EKG line, or a small cross), color scheme: deep teal-green and warm off-white, on a clean solid white background, vector-style flat design, professional and inviting, suitable for both light and dark UI backgrounds. Centered composition. Square 1:1 aspect ratio. Single coherent logo composition.
```

---

## Notas y observaciones

- **fondo_urgencias.png** salió con caracteres japoneses (急行) además del texto "EMERGENCY". Si Kevin lo quiere 100% latino, regenerar añadiendo al prompt: `signs and text in English/Spanish only, no Japanese or Chinese characters`.
- Las 4 expresiones del personaje muestran muy buena coherencia entre sí gracias a usar `asistente_idle.png` como segunda referencia en acierto/error/explicando.
- El fondo gris del personaje permite usar **rembg** después para hacer transparente si se necesita superponer sobre los fondos hospitalarios sin halos.
- Para variantes: cambiar `temperature` entre 0.4 (más consistente) y 0.9 (más variado) en el JSON correspondiente.

---

## Costo de tokens (esta tanda)

| Asset | Tokens totales |
|---|---|
| asistente_idle | 1,887 |
| Otros 7 assets | ~12-14K estimado (no medido en paralelo) |
| **Total aproximado** | **~15K tokens** |
