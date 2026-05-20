// Correcciones al banco de preguntas tras auditoría vs PDF original UdeA.
// Solo modifica preguntas con discrepancias confirmadas contra el examen original.

import { readFileSync, writeFileSync } from 'node:fs';

const path = 'K:/01. Personal Projects/07. Praxis/Documents/preguntas.json';
const data = JSON.parse(readFileSync(path, 'utf8'));

function find(id) {
  const p = data.preguntas.find((q) => q.id === id);
  if (!p) throw new Error(`Pregunta #${id} no encontrada`);
  return p;
}

// === #63 — Eliminar opción d (haloperidol) inventada. PDF solo tiene 3 opciones. ===
{
  const p = find(63);
  p.opciones = p.opciones.filter((o) => o.letra !== 'd');
  delete p.explicacion.por_que_otras_no.d;
  p.revisar = false;
  delete p.nota_revisar;
  console.log('#63 corregida: opciones', p.opciones.length);
}

// === #64 — Eliminar opción d (clonazepam) inventada. PDF solo tiene 3 opciones. ===
{
  const p = find(64);
  p.opciones = p.opciones.filter((o) => o.letra !== 'd');
  delete p.explicacion.por_que_otras_no.d;
  p.revisar = false;
  delete p.nota_revisar;
  console.log('#64 corregida: opciones', p.opciones.length);
}

// === #68 — Reescribir completamente. El JSON tenía un caso de absceso renal inventado. ===
// PDF: Mujer 30 años, 30 días de dolor lumbar derecho + ITU sintomática
// (orina fétida, polaquiuria, tenesmo, fiebre). Antecedente: estrechez ureteral previa
// corregida + ITU a repetición en la niñez. Urocultivo: E. coli >100.000 UFC sensible
// a ciprofloxacina/TMS/gentamicina/ceftriaxona. Cr 1.0.
// La clave es el antecedente de estrechez ureteral → uropatía obstructiva subyacente
// → necesita imagen (UROTAC) además del antibiótico.
{
  const p = find(68);
  p.especialidad = 'urologia';
  p.sala = 'consultorio';
  p.dificultad = 2;
  p.llegada = 'Doctor, mujer de 30 años con dolor lumbar derecho y signos de ITU recurrente, con antecedente quirúrgico ureteral.';
  p.narracion_caso =
    'Mujer de 30 años, consulta por 30 días de dolor lumbar derecho con los movimientos, esfuerzos y cambios de posición. Refiere orina fétida y turbia, polaquiuria, tenesmo y fiebre. Antecedente: estrechez ureteral derecha corregida quirúrgicamente e infecciones urinarias a repetición en la niñez. PA 100/70, FC 65, T 36.8°C, dolor a la palpación lumbar derecha. Urocultivo: E. coli >100.000 UFC/mL sensible a ciprofloxacina, TMS, gentamicina y ceftriaxona. Creatinina 1.0 mg/dL.';
  p.ficha_clinica = {
    paciente: 'Mujer, 30 años',
    sintomas: '30 días de dolor lumbar derecho + ITU sintomática',
    antecedente: 'Estrechez ureteral derecha corregida + ITU recurrentes en la niñez',
    urocultivo: 'E. coli >100.000 UFC/mL, sensible a ciprofloxacina',
    funcion_renal: 'Creatinina 1.0 mg/dL',
  };
  p.pregunta = '¿Cuál es la conducta más adecuada?';
  p.opciones = [
    {
      letra: 'a',
      texto:
        'Iniciar AINES, aumentar consumo de líquidos y ejercicio terapéutico',
    },
    {
      letra: 'b',
      texto:
        'Tratar como ITU sintomática con ciprofloxacina y ejercicio terapéutico',
    },
    {
      letra: 'c',
      texto:
        'Tratar como ITU sintomática con ciprofloxacina oral 500 mg cada 12 horas por 7 días y solicitar UROTAC',
    },
    {
      letra: 'd',
      texto:
        'Tratar como ITU sintomática con gentamicina 80 mg IM cada día por la alta tasa de resistencia a la ciprofloxacina en nuestro medio',
    },
  ];
  p.correcta = 'c';
  p.reaccion_acierto =
    'Exacto. Antibiótico dirigido + imagen para descartar obstrucción residual.';
  p.reaccion_error =
    'Pensá en el antecedente: estrechez ureteral previa + ITU recurrente.';
  p.explicacion = {
    tldr:
      'ITU sintomática en paciente con antecedente de uropatía obstructiva (estrechez ureteral corregida) e ITU a repetición. Hay que tratar la infección con antibiótico dirigido (cipro sensible por urocultivo) y solicitar imagen (UROTAC) para descartar recidiva de la obstrucción o complicación anatómica.',
    tratamiento:
      'Ciprofloxacina 500 mg VO cada 12 horas por 7 días + UROTAC para evaluar vía urinaria. Seguimiento clínico y con urocultivo de control.',
    por_que_otras_no: {
      a: 'AINES y líquidos no tratan la ITU bacteriana confirmada por urocultivo.',
      b: 'Ciprofloxacina sin imagen pierde la oportunidad de evaluar el antecedente quirúrgico de estrechez ureteral; el ejercicio terapéutico no es parte del manejo de ITU.',
      d: 'Gentamicina IM no es primera línea cuando el urocultivo muestra sensibilidad a ciprofloxacina; quinolona oral es más cómoda y eficaz.',
    },
  };
  p.cierre_acierto =
    'Bien hecho. En ITU recurrente con antecedente obstructivo, siempre pensar en imagen además del antibiótico.';
  p.cierre_error =
    'Tranquilo. Regla: ITU + antecedente de cirugía urológica = pedir imagen para descartar causa estructural.';
  p.palabras_clave = [
    { termino: 'infección urinaria recurrente', wiki: 'Infección_urinaria' },
    { termino: 'estrechez ureteral', wiki: 'Estenosis_ureteral' },
    { termino: 'urotac', wiki: 'Urografía_por_tomografía' },
  ];
  p.revisar = false;
  delete p.nota_revisar;
  console.log('#68 reescrita: caso ahora coincide con PDF (ITU + estrechez ureteral)');
}

// === #24, #40, #41 — Defendibles. Mantener marca de revisar pero actualizar nota. ===
{
  const p24 = find(24);
  p24.nota_revisar =
    'Diltiazem también es válido (AHA: bbloqueador o CCB tras adenosina). Cardioversión sincronizada es la opción más definitiva cuando ya fallaron 2 clases de drogas.';

  const p40 = find(40);
  p40.nota_revisar =
    'Wake-up stroke clásicamente fuera de ventana (último visto bien = noche anterior). El PDF no menciona TC. Sin TC + síndrome cerebeloso + HTA severa también plantea hemorragia cerebelosa. La respuesta esperada en UdeA parece ser alteplase asumiendo ventana cumplida y TC normal.';

  const p41 = find(41);
  p41.nota_revisar =
    'PDF del examen original solo tiene 3 opciones (incluyendo el typo "fosfenitoína nasal"). Valproato IV es respuesta correcta por ESETT 2019 (equivalencia con fosfenitoína y levetiracetam).';

  console.log('#24, #40, #41: notas de revisar actualizadas');
}

// Escribir el JSON con indentación de 2 espacios (compatible con el formato existente)
writeFileSync(path, JSON.stringify(data, null, 2) + '\n', 'utf8');
console.log('\nGuardado en:', path);
console.log('Total preguntas:', data.preguntas.length);
