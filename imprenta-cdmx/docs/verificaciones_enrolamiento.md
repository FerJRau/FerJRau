# Verificaciones de enrolamiento — 11 jun 2026

## HP Indigo 5500 (Serie 2) → PrintOS / Print Beat

**Resultado: NO compatible con las APIs de Print Beat.**

- La documentación oficial de HP (Developer Portal y PrintOS Help Center) indica que tanto la vista en tiempo real de Print Beat como la **Print Beat API (jobs/OEE)** soportan únicamente **prensas Serie 3 o superior** (excluyendo W72x0).
  - "Presses that are cloud supported (Ser. 3 or higher, excluding Indigo 72x0)" — [PrintOS Help Center](https://intercom.help/hp-printos/en/articles/2477060-how-can-i-view-my-jobs)
  - "Supported Presses: HP Indigo Series 3 Presses and above" — [HP Developer Portal, Print Beat API](https://developers.hp.com/node/156021)
- La Indigo 5500 es Serie 2 (~2007) → **plan B confirmado**: esa prensa va por la ruta **agente local / CCTV** sin cambiar la arquitectura.
- Vale la pena la llamada con el ingeniero de HP México sólo para confirmar si hay alguna vía vieja (Print Care / reporting local), pero no contar con PrintOS.

## EFI VUTEk "GS3 Pro" → Fiery IQ

**Resultado: depende del modelo exacto — pedir placa y serie.**

Según la [lista oficial de Fiery IQ for EFI printers](https://www.fiery.com/products/large-format/partners/efi/engines/fiery-iq-for-efi-printers/):

| Modelo | Soporte |
|---|---|
| GS3250x Pro / GS3250LX Pro / LX3 Pro / H2000 Pro | **Todas las versiones** ✔ |
| GS3200 | Excluidas series 152XXX–153XXX |
| GS3250r | Excluidas series 163XXX–183XXX y 193XXX |
| GS2000x Pro / GS2000LX Pro | Excluidas series 152XXX–153XXX y 163XXX–183XXX |

- "GS3 Pro" no existe literal en la lista; lo más probable es que sea una **GS3250x Pro o GS3250LX Pro** (soportadas sin restricción) → buenas probabilidades.
- Confirmar en la placa: **modelo exacto + número de serie + versión de software**.
- Recordatorio: la PC de control necesita salida a internet para el agente de Fiery IQ.

## Conclusión operativa

- **VUTEk**: ruta principal Fiery IQ (gratuita: Dashboard, Notify, IQ Go). Enrolamiento self-serve en `accounts.fiery.com`.
- **Indigo 5500**: ruta agente local + CCTV/Frigate desde el día uno; no esperar a PrintOS.
- **Jeti Mira**: JMF vía RIP Asanti → webhook n8n (`/webhook/imprenta/events/jmf`).
- **Acabado**: CCTV/Frigate + QRs wa.me para cierre manual de etapa.
