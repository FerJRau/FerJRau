# Frigate + Claude Vision — Especificación

## Concepto

No se transmite video a la IA. Frigate (NVR open-source) corre en una mini PC en sitio,
hace detección local sobre las cámaras RTSP existentes, y **sólo en momentos de decisión**
manda fotogramas individuales a n8n → Claude vision:

- Verificar evidencia de checklist (foto del operador vs. lo que ve la cámara).
- Confirmar cierre manual de etapa reportado por QR/WhatsApp (persona/actividad en la zona).
- Alertas de zona (actividad en máquina que debería estar detenida por hold).

## Hardware mínimo recomendado

| Componente | Recomendación |
|---|---|
| Mini PC | Intel N100 / i3 de 8.ª gen o superior, 8–16 GB RAM (ej. Beelink/NUC, ~$3,500–6,000 MXN) |
| Detector | iGPU Intel con **OpenVINO** (recomendación actual de Frigate) o Google Coral USB (~$1,500 MXN) si el CPU es muy modesto |
| Almacenamiento | SSD 256 GB+ (retención de clips ~7 días para 4–8 cámaras) |
| SO | Debian/Ubuntu bare-metal con Docker (evitar VM) |

Notas (docs oficiales de Frigate):
- Un solo Coral maneja muchas cámaras; pero hoy la recomendación primaria es OpenVINO sobre iGPU Intel.
- Puertos: `8971` (UI/API autenticada), `5000` (API interna), `8554` (restream RTSP).

## Requisito previo en sitio (pendiente #4 de la visita)

Confirmar marca del CCTV y si expone **RTSP** (la mayoría de DVR/NVR Dahua/Hikvision sí).
URL típica: `rtsp://usuario:pass@IP:554/...`

## Config de ejemplo (`config.yml`)

```yaml
mqtt:
  enabled: false

detectors:
  ov:
    type: openvino
    device: GPU

cameras:
  acabado:
    ffmpeg:
      inputs:
        - path: rtsp://usuario:pass@192.168.1.50:554/cam/realmonitor?channel=1&subtype=0
          roles: [detect, record]
    detect:
      width: 1280
      height: 720
    objects:
      track: [person]
    zones:
      mesa_acabado:
        coordinates: 0.2,0.3,0.8,0.3,0.8,0.9,0.2,0.9
    record:
      enabled: true
      retain:
        days: 7
```

## Integración con n8n

1. **Eventos**: Frigate publica eventos (inicio/fin de detección por zona). Vía su API
   (`/api/events`) o un puente MQTT→HTTP, se postean a
   `https://<n8n>/webhook/imprenta/events/frigate` con `{ machine_code, event_type, ... }`.
2. **Fotograma bajo demanda**: cuando n8n necesita verificar algo, pide
   `GET /api/<camera>/latest.jpg` a Frigate (vía túnel/VPN al sitio), sube la imagen a
   Supabase Storage y la manda a Claude (`claude-sonnet-4-5`, mensaje con bloque `image`)
   con el `vision_check_prompt` del item de checklist.
3. **Veredicto**: Claude responde `approved | rejected | uncertain` → se guarda en
   `checklist_run_items.vision_verdict`; `rejected/uncertain` notifica al supervisor.

## Costo estimado de visión

Fotogramas de 720p ≈ 1,100 tokens de imagen. A ~50 verificaciones/día con Claude Sonnet:
del orden de **$2–4 USD/mes** — despreciable.
