#!/usr/bin/env python3
"""Genera QRs grandes por estación/etapa para cierre manual de órdenes.

Cada QR abre WhatsApp (wa.me) con un mensaje precargado tipo "FIN acabado OT-".
El operador escanea con su teléfono, completa el número de orden y envía:
el mensaje llega al número de WhatsApp de la imprenta conectado a n8n
(webhook imprenta/checklist-reply), que registra quién y cuándo cerró la etapa.

Uso:
    pip install qrcode[pil]
    python generate_qrs.py --numero 5215512345678 --out ./qrs

Imprimir cada PNG en tamaño carta o mayor y colocarlo en la estación.
"""
import argparse
import urllib.parse
from pathlib import Path

import qrcode
from qrcode.constants import ERROR_CORRECT_H

STAGES = {
    "preprensa": "Preprensa",
    "planchas": "Planchas",
    "impresion": "Impresión",
    "acabado": "Acabado",
    "empaque": "Empaque",
}


def main() -> None:
    p = argparse.ArgumentParser()
    p.add_argument("--numero", required=True, help="Número WhatsApp de la imprenta (E.164 sin +, ej. 5215512345678)")
    p.add_argument("--out", default="./qrs", help="Directorio de salida")
    args = p.parse_args()

    out = Path(args.out)
    out.mkdir(parents=True, exist_ok=True)

    for code, label in STAGES.items():
        text = f"FIN {code} OT-"
        url = f"https://wa.me/{args.numero}?text={urllib.parse.quote(text)}"
        qr = qrcode.QRCode(error_correction=ERROR_CORRECT_H, box_size=20, border=4)
        qr.add_data(url)
        qr.make(fit=True)
        img = qr.make_image(fill_color="black", back_color="white")
        path = out / f"qr_fin_{code}.png"
        img.save(path)
        print(f"{label}: {path} -> {url}")


if __name__ == "__main__":
    main()
