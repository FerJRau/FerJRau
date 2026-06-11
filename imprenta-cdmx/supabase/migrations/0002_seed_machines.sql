-- Datos semilla: máquinas identificadas el 10-jun-2026 (serie/versión pendientes de la próxima visita)
insert into machines (code, name, machine_type, integration_route, metadata) values
  ('indigo-5500', 'HP Indigo 5500', 'digital_offset', 'cctv_agent',
   '{"nota": "Serie 2 (~2007). Print Beat API soporta sólo Serie 3+; ruta por defecto: agente local / CCTV. Confirmar con HP México."}'),
  ('vutek-gs3', 'EFI VUTEk GS3 Pro', 'superwide_uv', 'fiery_iq',
   '{"nota": "Confirmar modelo exacto en placa: GS3250x Pro / GS3250LX Pro soportados en todas las versiones; GS3250r excluye series 163XXX-183XXX y 193XXX."}'),
  ('jeti-mira', 'Agfa Jeti Mira LED MG2710', 'flatbed_uv', 'jmf',
   '{"nota": "Vía RIP Agfa Asanti, mensajes JDF/JMF hacia webhook de n8n."}'),
  ('acabado', 'Acabado y otros', 'finishing', 'cctv_agent',
   '{"nota": "Sin API propia: CCTV (Frigate) + agente local."}');
