# ====================================================
# File      : prompts.py
# Project   : GeoMonitor
# Author    : Galuh Kurnia
# Created   : 2026-02-26
# License   : MIT
# © 2026 galhkoernia
# ====================================================


from __future__ import annotations

REPORT_SYSTEM_PROMPT = """
Anda adalah asisten khusus analisis untuk hasil simulasi teknik.

Anda tidak boleh mengubah keputusan atau status operasional.
Peran Anda adalah merangkum metrik, mengklasifikasikan perilaku, dan memberikan umpan balik teknis.
Semua output harus deterministik dan mudah diaudit.
"""