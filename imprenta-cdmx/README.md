# Imprenta CDMX — Orquestación IA de Producción

Proyecto para la imprenta de Alex (CDMX): checklists por etapa vía WhatsApp, paro de línea
(andon) con clasificación IA, mantenimiento preventivo y verificación con CCTV — con
**n8n** como cerebro, **Supabase** como capa de datos operativa y **FileMaker** como
sistema de registro.

## Estado actual (11 jun 2026)

**Desplegado y probado:**

- Proyecto Supabase **`imprenta-cdmx`** (`fjdwdyrtnbbwwdnqkrns`) con el esquema completo
  (máquinas, órdenes, etapas, checklists, holds, mantenimiento, eventos) y datos semilla.
- 4 workflows **activos** en n8n:
  | WF | Nombre | Trigger |
  |---|---|---|
  | WF1 | Event Router | `POST /webhook/imprenta/events/{jmf\|fiery\|printos\|frigate}` |
  | WF2 | Checklist por Etapa | `POST /webhook/imprenta/stage-entered` |
  | WF3 | Andon / Paro de Línea | `POST /webhook/imprenta/andon` |
  | WF4 | Mantenimiento Preventivo | cron horario |

**Pendiente de credenciales reales (placeholders creados en n8n):**

- `IMPCDMX Anthropic x-api-key — REEMPLAZAR` (clasificación de severidad + visión).
  Sin ella, el andon usa fallback conservador `major`.
- `IMPCDMX WhatsApp (WaSender) — REEMPLAZAR` (número de WhatsApp de la imprenta).
- FileMaker Data API (ver `docs/filemaker_integracion.md`).

## Estructura

```
imprenta-cdmx/
├── docs/
│   ├── verificaciones_enrolamiento.md   # PrintBeat (NO soporta Serie 2) y Fiery IQ
│   ├── frigate_claude_spec.md           # CCTV → Frigate → Claude vision
│   └── filemaker_integracion.md         # Plan Data API + hooks ya listos
├── n8n/                                 # JSON fuente de los 4 workflows desplegados
├── supabase/migrations/                 # Esquema + seeds (ya aplicados)
└── tools/generate_qrs.py                # QRs wa.me por estación (cierre manual de etapa)
```

## Decisiones clave

- **Indigo 5500 (Serie 2)**: Print Beat sólo soporta Serie 3+ → ruta agente local/CCTV.
- **VUTEk**: Fiery IQ probable (GS3250x/LX Pro soportadas); confirmar placa y serie.
- **Cierre manual de etapas**: QR grande por estación que abre wa.me con mensaje
  precargado (`FIN acabado OT-`) + verificación con Frigate/Claude vision
  (el CCTV no decodifica QRs de forma fiable; se usa como evidencia, no como captura).

## Probar

```bash
# Evento de máquina (router + andon automático si es error)
curl -X POST https://<n8n>/webhook/imprenta/events/jmf \
  -H 'Content-Type: application/json' \
  -d '{"event_type":"Error","machine_code":"jeti-mira"}'

# Checklist de etapa
curl -X POST https://<n8n>/webhook/imprenta/stage-entered \
  -H 'Content-Type: application/json' \
  -d '{"order_number":"OT-TEST-001","stage":"impresion","operator_phone":"+52..."}'

# Reporte andon de operador
curl -X POST https://<n8n>/webhook/imprenta/andon \
  -H 'Content-Type: application/json' \
  -d '{"machine_code":"vutek-gs3","order_number":"OT-TEST-001","description":"error de cabezal"}'
```
