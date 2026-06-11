-- Plantillas de checklist iniciales por etapa (borrador: ajustar con Alex y los operadores)
with t as (
  insert into checklist_templates (stage, title) values
    ('preprensa', 'Checklist Preprensa'),
    ('planchas', 'Checklist Planchas'),
    ('impresion', 'Checklist Impresión'),
    ('acabado', 'Checklist Acabado'),
    ('empaque', 'Checklist Empaque')
  returning id, stage
)
insert into checklist_template_items (template_id, position, prompt, requires_photo, vision_check_prompt)
select id, x.position, x.prompt, x.requires_photo, x.vision_prompt from t
join lateral (
  values
    (1, 'Verifica que el PDF aprobado coincide con la orden de trabajo (versión y medidas)', false, null),
    (2, 'Confirma perfil de color correcto para el sustrato', false, null)
) as x(position, prompt, requires_photo, vision_prompt) on t.stage = 'preprensa'
union all
select id, x.position, x.prompt, x.requires_photo, x.vision_prompt from t
join lateral (
  values
    (1, 'Revisa plancha sin rayones ni defectos', true, '¿La plancha de impresión mostrada está libre de rayones y defectos visibles?'),
    (2, 'Confirma registro de planchas según orden', false, null)
) as x(position, prompt, requires_photo, vision_prompt) on t.stage = 'planchas'
union all
select id, x.position, x.prompt, x.requires_photo, x.vision_prompt from t
join lateral (
  values
    (1, 'Verifica sustrato cargado = sustrato de la orden', false, null),
    (2, 'Manda foto del primer pliego aprobado contra muestra', true, '¿El pliego impreso mostrado se ve correctamente registrado, sin manchas ni colores fuera de rango evidentes?'),
    (3, 'Confirma niveles de tinta suficientes para el tiraje', false, null)
) as x(position, prompt, requires_photo, vision_prompt) on t.stage = 'impresion'
union all
select id, x.position, x.prompt, x.requires_photo, x.vision_prompt from t
join lateral (
  values
    (1, 'Confirma medida de corte/doblez contra la orden', false, null),
    (2, 'Manda foto de la primera pieza terminada', true, '¿La pieza terminada mostrada tiene cortes limpios y dobleces alineados?')
) as x(position, prompt, requires_photo, vision_prompt) on t.stage = 'acabado'
union all
select id, x.position, x.prompt, x.requires_photo, x.vision_prompt from t
join lateral (
  values
    (1, 'Cuenta y confirma cantidad empacada vs. orden', false, null),
    (2, 'Manda foto del empaque etiquetado', true, '¿El paquete mostrado está etiquetado y cerrado correctamente?')
) as x(position, prompt, requires_photo, vision_prompt) on t.stage = 'empaque';

-- Tareas de mantenimiento preventivo iniciales (horarios en UTC; CDMX = UTC-6)
insert into maintenance_tasks (machine_id, name, cron_expression, escalation_hours)
select m.id, x.name, x.cron, x.esc from machines m
join lateral (
  values
    ('indigo-5500', 'Limpieza de mantilla (blanket)', '0 13 * * *', 4),
    ('indigo-5500', 'Revisión de BID y fotoconductor', '0 13 * * 1', 8),
    ('vutek-gs3', 'Purga y limpieza de cabezales UV', '0 13 * * *', 4),
    ('jeti-mira', 'Limpieza de cabezales y mesa de vacío', '0 13 * * *', 4),
    ('jeti-mira', 'Calibración de color', '0 13 * * 1', 24)
) as x(code, name, cron, esc) on m.code = x.code;
