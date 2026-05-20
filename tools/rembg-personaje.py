"""Remove gray background from the 4 asistente expressions using rembg."""
from pathlib import Path
from rembg import remove
from PIL import Image

ASSETS_DIR = Path(r"K:\01. Personal Projects\07. Praxis\assets\personaje")
PUBLIC_DIR = Path(r"K:\01. Personal Projects\07. Praxis\praxis-app\apps\web\public\assets\personaje")
RAW_DIR = ASSETS_DIR / "_raw"

EXPRESIONES = ["asistente_idle", "asistente_acierto", "asistente_error", "asistente_explicando"]

def main():
    RAW_DIR.mkdir(parents=True, exist_ok=True)
    for name in EXPRESIONES:
        src = ASSETS_DIR / f"{name}.png"
        if not src.exists():
            print(f"SKIP: {src} not found")
            continue
        backup = RAW_DIR / f"{name}_grey.png"
        # Mover el original a _raw como backup (sólo la primera vez)
        if not backup.exists():
            backup.write_bytes(src.read_bytes())
            print(f"Backed up to: {backup}")
        # Procesar con rembg
        with Image.open(backup) as im:
            result = remove(im)
            result.save(src, "PNG")
            print(f"rembg -> {src}")
            # También sincronizar a public/
            public_path = PUBLIC_DIR / f"{name}.png"
            public_path.parent.mkdir(parents=True, exist_ok=True)
            result.save(public_path, "PNG")
            print(f"sync   -> {public_path}")
    print("Done.")

if __name__ == "__main__":
    main()
