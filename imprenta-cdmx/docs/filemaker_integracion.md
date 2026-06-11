# FileMaker (eikonsysleon.com) — Plan de integración

FileMaker queda como **sistema de registro**; n8n lee/escribe vía la **Data API** (REST).

## Paso 0 — Habilitar la Data API (requiere admin del servidor)

1. Entrar a la **Admin Console** del FileMaker Server (`https://eikonsysleon.com:16000/admin-console`).
2. Connectors → FileMaker Data API → **Enable**.
3. Crear una cuenta dedicada en el archivo del ERP con privilege set que incluya
   la extended privilege **`fmrest`** (mínimo necesario: ver/editar pedidos y holds).
4. Guardar usuario/contraseña como credencial en n8n (NUNCA en texto plano).

## Autenticación (sesiones de 15 min)

```text
POST https://eikonsysleon.com/fmi/data/vLatest/databases/{ERP}/sessions
Authorization: Basic base64(usuario:contraseña)
→ devuelve token; usar en "Authorization: Bearer <token>" y renovar al expirar
```

En n8n: subworkflow "FM Auth" que cachea el token (Data Table o Supabase) y lo renueva.

## Operaciones que usará la orquestación

| Acción | Endpoint |
|---|---|
| Buscar pedido por número | `POST /databases/{ERP}/layouts/{LayoutPedidos}/_find` |
| Actualizar etapa / ON HOLD | `PATCH /databases/{ERP}/layouts/{LayoutPedidos}/records/{recordId}` |
| Crear registro de hold/bitácora | `POST /databases/{ERP}/layouts/{LayoutHolds}/records` |

## FileMaker → n8n (dirección inversa)

Scripts de FileMaker con **`Insert from URL`** (cURL options) llaman a los webhooks:

- Al cambiar de etapa un pedido → `POST https://<n8n>/webhook/imprenta/stage-entered`
  con `{"order_number":"...","stage":"impresion","operator_phone":"..."}`
- Esto dispara el checklist de WhatsApp (WF2) automáticamente.

## Pendientes para activar esto (visita / llamada con Alex)

1. Confirmar nombre del archivo/base del ERP y layouts de pedidos.
2. ¿Los pedidos ya tienen campos de etapa? Si no, modelarlos (fase cero).
3. Crear la cuenta `fmrest` y pasarla a n8n como credencial.
4. Extraer esquema: `GET /databases/{ERP}/layouts` y `GET /layouts/{x}/metadata`.

## Hooks ya listos en n8n

- WF3 (Andon) tiene el nodo `TODO FileMaker: marcar ON HOLD` listo para sustituir
  por el PATCH real una vez habilitada la Data API.
- La tabla `orders.filemaker_record_id` en Supabase ya enlaza ambos sistemas.
