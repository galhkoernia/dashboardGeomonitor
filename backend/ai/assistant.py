#
# Created on Mon Jun 29 2026
#
# Copyright (c) 2026 Your Company
#

from __future__ import annotations

import math
from typing import Dict, Any, List

from analysis.metrics import RunSummary
from ai.schemas import AIConfig, AIReport, AnalysisResult


class AIAssistant:
    """
    Artificial Intelligence Assistant untuk menganalisis hasil eksperimen simulasi dan memberikan interpretasi serta rekomendasi berbasis data:
    - Tidak mengubah RuleEngine
    - Tidak mempengaruhi status runtime
    - AI hanya membuat ringkasan laporan berdasarkan data dengan basis CSV + metrik
    """

    def __init__(self, cfg: AIConfig):
        self.cfg = cfg

    def _classify_analysis(self, summary: RunSummary) -> AnalysisResult:
        flags: List[str] = []

        # NOTE:
        # Ambang batas yang digunakan di bawah ini hanya heuristik analisis
        # Ambang batas ini tidak sesuai dengan ambang batas pada keamanan RuleEngine

        # Indikator anomali berbasis Delta
        if summary.max_abs_delta_deg >= 0.5:
            flags.append("Delta Spike (analysis heuristic)")

        # Indikator kemiringan besar
        if summary.max_abs_slope_deg_per_hour >= 5.0:
            flags.append("Extreme Slope (analysis heuristic)")

        # Kualitas tren rendah
        # Trend dianggap berkualitas rendah hanya jika tidak pernah tervalidasi
        if summary.slope_ok_true_ratio == 0.0:
            flags.append("Low Trend Quality (analysis)")
            
        # Analysis_level bukan status runtime, tapi klasifikasi pola risiko berdasarkan hasil eksperimen.
        # Ini hanya mewakili klasifikasi pola risiko pasca-eksekusi.
        if summary.danger_count > 0:
            level = "HighRiskPattern"
        elif summary.warning_count > 0 or flags:
            level = "MediumRiskPattern"
        else:
            level = "NominalPattern"

        # Antarmuka event_type juga hanya mewakili klasifikasi pola risiko pasca-eksekusi, bukan status runtime.
        if "Delta Spike (analysis heuristic)" in flags:
            event_type = "Step Anomaly"
        elif (
            summary.slope_ok_true_ratio > 0.0
            and "Extreme Slope (analysis heuristic)" in flags
        ):
            event_type = "Slow Drift"
        else:
            event_type = "None"

        return AnalysisResult(
            analysis_level=level,
            event_type=event_type,
            flags=flags,
        )

    def generate_report(self, exp_name: str, summary: RunSummary) -> AIReport:
        analysis = self._classify_analysis(summary)
        title    = "GeoMonitor Simulation - AI Analysis Report"

        rmse_note = ""
        if math.isnan(summary.rmse_tilt_deg):
            rmse_note = " (N/A: true_tilt_deg not available)"

        summary_lines = [
            "Summary of Simulation Results",
            f"- rows: {summary.n_rows}",
            f"- duration_sec: {summary.duration_sec}",
            f"- rmse_tilt_deg: {summary.rmse_tilt_deg:.4f}{rmse_note}",
            f"- max_abs_delta_deg: {summary.max_abs_delta_deg:.4f}",
            f"- max_abs_slope_deg_per_hour: {summary.max_abs_slope_deg_per_hour:.4f}",
            f"- warning_count: {summary.warning_count}",
            f"- danger_count: {summary.danger_count}",
            f"- first_warning_t: {summary.first_warning_t}",
            f"- first_danger_t: {summary.first_danger_t}",
            "",
            "Diagnosis Quality (if available)",
            f"- avg_r2: {summary.avg_r2:.3f}",
            f"- avg_sigma: {summary.avg_sigma:.4f}",
            f"- slope_ok_true_ratio: {summary.slope_ok_true_ratio:.3f}",
        ]

        interpretation_lines = ["Interpreation (deterministic)"]

        # Global system state
        if summary.danger_count > 0:
            interpretation_lines.append(
                "- Sistem sempat memasuki kondisi BAHAYA selama eksperimen."
            )
        elif summary.warning_count > 0:
            interpretation_lines.append(
                "- Sistem sempat berada pada kondisi PERINGATAN selama eksperimen."
            )
        else:
            interpretation_lines.append(
                "- Sistem tetap berada pada kondisi NORMAL sepanjang eksperimen."
            )

        # Dominant decision pathway
        if summary.slope_ok_true_ratio == 0.0:
            interpretation_lines.append(
                "- Keputusan keselamatan didominasi oleh perubahan cepat (delta) "
                "dan/atau kemiringan absolut."
            )
        else:
            interpretation_lines.append(
                "- Sebagian keputusan keselamatan dipengaruhi oleh tren jangka panjang "
                "yang tervalidasi."
            )

        # Trend analysis explanation
        if summary.slope_ok_true_ratio == 0.0:
            interpretation_lines.extend(
                [
                    "- Trend analyzer tidak menghasilkan satu pun slope yang tervalidasi "
                    "(slope_ok = false pada seluruh run).",
                    "- Nilai slope sesaat yang besar tidak digunakan sebagai dasar keputusan "
                    "karena tidak memenuhi kriteria kualitas statistik (R² dan sigma).",
                ]
            )

        # Scenario consistency
        if summary.slope_ok_true_ratio > 0.0 and summary.max_abs_delta_deg < 0.2:
            interpretation_lines.append(
                "- Pola respons sistem konsisten dengan settlement progresif yang berkelanjutan."
            )
        elif summary.max_abs_delta_deg >= 0.2:
            interpretation_lines.append(
                "- Pola respons sistem konsisten dengan skenario anomali atau perubahan mendadak."
            )
        else:
            interpretation_lines.append(
                "- Pola respons sistem menunjukkan kombinasi antara tren jangka panjang "
                "dan fluktuasi jangka pendek."
            )   

        recommendations: List[str] = []

        if summary.max_abs_slope_deg_per_hour >= 0.2 and summary.warning_count == 0:
            recommendations.extend(
                [
                    "PERINGATAN: kemiringan besar tetapi tidak ada status PERINGATAN yang terjadi.",
                    "Periksa apakah slope_ok pada RuleEngine benar-benar berasal dari TrendAnalyzer.",
                    "Periksa apakah slope_deg_per_hour yang dikirim ke evaluate() bukan nilai usang.",
                ]
            )

        notes = "AI is analysis-only. Decision status remains deterministic for RuleEngine."

        return AIReport(
            title=title,
            experiment=exp_name,
            summary_lines=summary_lines,
            analysis=analysis,
            interpretation_lines=interpretation_lines,
            recommendations=recommendations,
            notes=notes,
        )

    def render_report_text(self, report: AIReport) -> str:
        lines: List[str] = []
        lines.append(report.title)
        lines.append("----------------------------------------")
        lines.append(f"experiment: {report.experiment}")
        lines.append("")
        lines.extend(report.summary_lines)
        lines.append("")
        lines.extend(report.interpretation_lines)

        if report.recommendations:
            lines.append("")
            lines.append("Reccomendations")
            for r in report.recommendations:
                lines.append(f"- {r}")

        if report.notes:
            lines.append("")
            lines.append("Notes")
            lines.append(f"- {report.notes}")

        return "\n".join(lines)


def parse_ai_config(cfg_dict: Dict[str, Any]) -> AIConfig:
    ai_raw = cfg_dict.get("ai", {}) if isinstance(cfg_dict, dict) else {}
    return AIConfig(
        enabled=bool(ai_raw.get("enabled", False)),
        provider=str(ai_raw.get("provider", "none")),
        model=str(ai_raw.get("model", "gpt-4.1-mini")),
        report_path=str(ai_raw.get("report_path", "outputs/runs/latest_report.txt")),
    )