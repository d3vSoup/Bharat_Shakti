#!/usr/bin/env python3
"""
Bharat Shakti — Supabase Asset Upload Script
Uploads all ISL gesture images and Hindi sign images to Supabase Storage.

Usage:
    python3 upload_to_supabase.py

Requirements:
    pip install supabase python-dotenv
"""

import os
import sys
import json
import time
from pathlib import Path
from dotenv import load_dotenv

# Load .env from repo root
repo_root = Path(__file__).parent
load_dotenv(repo_root / ".env")

SUPABASE_URL        = os.environ.get("SUPABASE_URL", "").rstrip("/")
SUPABASE_SERVICE_KEY = os.environ.get("SUPABASE_SERVICE_KEY", "")
BUCKET_NAME         = "isl-gestures"

if not SUPABASE_URL or not SUPABASE_SERVICE_KEY:
    print("❌  Missing SUPABASE_URL or SUPABASE_SERVICE_KEY in .env")
    sys.exit(1)

if "PASTE_YOUR" in SUPABASE_SERVICE_KEY:
    print("❌  Please fill in SUPABASE_SERVICE_KEY in your .env file first.")
    print("   Find it: Supabase Dashboard → Settings → API → service_role")
    sys.exit(1)

try:
    from supabase import create_client, Client
except ImportError:
    print("❌  Install supabase: python3 -m pip install supabase python-dotenv")
    sys.exit(1)

supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)

# ── 1. Ensure bucket exists ──────────────────────────────────────────────────
print(f"📦  Ensuring bucket '{BUCKET_NAME}' exists…")
try:
    buckets = supabase.storage.list_buckets()
    bucket_names = [b.name for b in buckets]
    if BUCKET_NAME not in bucket_names:
        supabase.storage.create_bucket(BUCKET_NAME, options={"public": True})
        print(f"   ✅ Created public bucket: {BUCKET_NAME}")
    else:
        print(f"   ✅ Bucket already exists: {BUCKET_NAME}")
except Exception as e:
    print(f"   ⚠️  Bucket check/create: {e}")

# ── 2. Upload helper ─────────────────────────────────────────────────────────
upload_count = 0
skip_count   = 0
error_count  = 0
url_map      = {}   # local_path → public_url

def upload_file(local_path: Path, storage_path: str):
    global upload_count, skip_count, error_count
    content_type = "image/gif" if local_path.suffix.lower() == ".gif" else "image/jpeg"
    try:
        with open(local_path, "rb") as f:
            data = f.read()
        supabase.storage.from_(BUCKET_NAME).upload(
            path=storage_path,
            file=data,
            file_options={"content-type": content_type, "upsert": "true"}
        )
        public_url = f"{SUPABASE_URL}/storage/v1/object/public/{BUCKET_NAME}/{storage_path}"
        url_map[str(local_path)] = public_url
        upload_count += 1
        if upload_count % 20 == 0:
            print(f"   ↑  {upload_count} uploaded…")
    except Exception as e:
        if "already exists" in str(e).lower() or "409" in str(e):
            skip_count += 1
            public_url = f"{SUPABASE_URL}/storage/v1/object/public/{BUCKET_NAME}/{storage_path}"
            url_map[str(local_path)] = public_url
        else:
            print(f"   ❌ Error uploading {storage_path}: {e}")
            error_count += 1

# ── 3. ISL English letter images (letters/a.jpg … z.jpg) ─────────────────────
letters_dir = repo_root / "frontend" / "isl_gestures" / "letters"
if letters_dir.exists():
    print(f"\n✋  Uploading ISL English letter images ({len(list(letters_dir.glob('*.jpg')))} files)…")
    for img in sorted(letters_dir.glob("*.jpg")):
        upload_file(img, f"letters/{img.name}")
    print(f"   Done. {upload_count} new, {skip_count} skipped, {error_count} errors")

# ── 4. ISL word GIFs (words/*.gif) ───────────────────────────────────────────
words_dir = repo_root / "frontend" / "isl_gestures" / "words"
if words_dir.exists():
    gif_files = list(words_dir.glob("*.gif"))
    print(f"\n📚  Uploading ISL word GIFs ({len(gif_files)} files)…")
    prev = upload_count
    for img in sorted(gif_files):
        upload_file(img, f"words/{img.name}")
    print(f"   Done. {upload_count - prev} new, {error_count} errors")

# ── 5. ISL Hindi letter images (hindi_letters/) ───────────────────────────────
hindi_isl_dir = repo_root / "frontend" / "isl_gestures" / "hindi_letters"
if hindi_isl_dir.exists():
    imgs = list(hindi_isl_dir.glob("*"))
    print(f"\n🇮🇳  Uploading ISL Hindi letter images ({len(imgs)} files)…")
    prev = upload_count
    for img in sorted(imgs):
        if img.suffix.lower() in (".jpg", ".jpeg", ".gif", ".png"):
            upload_file(img, f"hindi_letters/{img.name}")
    print(f"   Done. {upload_count - prev} new, {error_count} errors")

# ── 6. HindiSignImages48x48 — 1 representative image per Devanagari letter ───
# Each letter folder has ~1200 training images. We pick ONLY the first sorted
# image from each folder as the representative display image for the ISL viewer.
hindi_signs_root = repo_root / "HindiSignImages48x48"
if hindi_signs_root.exists():
    letter_folders = [d for d in sorted(hindi_signs_root.iterdir()) if d.is_dir()]
    print(f"\n🕉️   Uploading representative Hindi sign images ({len(letter_folders)} letters × 1 image)…")
    prev = upload_count
    hindi_sign_url_map = {}  # letter → url
    for folder in letter_folders:
        letter_name = folder.name  # e.g. 'अ', 'आ', etc.
        imgs = sorted([f for f in folder.iterdir() if f.suffix.lower() in (".jpg",".jpeg",".png")])
        if not imgs:
            continue
        best = imgs[0]  # first sorted image = representative
        safe_name = letter_name + ".jpg"  # e.g. 'अ.jpg'
        storage_path = f"hindi_signs/{safe_name}"
        upload_file(best, storage_path)
        public_url = f"{SUPABASE_URL}/storage/v1/object/public/{BUCKET_NAME}/{storage_path}"
        hindi_sign_url_map[letter_name] = public_url
    print(f"   Done. {upload_count - prev} new, {error_count} errors")

    # Save the Hindi sign URL map as JSON for use in isl-dict.js
    out_path = repo_root / "frontend" / "hindi_sign_urls.json"
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(hindi_sign_url_map, f, ensure_ascii=False, indent=2)
    print(f"\n💾  Saved Hindi sign URL map → frontend/hindi_sign_urls.json")

# ── 7. Summary ───────────────────────────────────────────────────────────────
print(f"\n{'='*55}")
print(f"  UPLOAD COMPLETE")
print(f"  ✅  {upload_count} uploaded")
print(f"  ⏭️   {skip_count} already existed (skipped)")
print(f"  ❌  {error_count} errors")
print(f"\n  Bucket URL: {SUPABASE_URL}/storage/v1/object/public/{BUCKET_NAME}/")
print(f"{'='*55}")
print("\nNext step: run  python3 update_isl_dict_urls.py  to patch isl-dict.js URLs")
