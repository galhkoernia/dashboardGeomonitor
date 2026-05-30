/*
 * Created on Mon Jan 05 2026
 *
 * Copyright (c) 2026 Your Company
 */

import { useDiagnostic } from '../../state/useDiagnostic.js';

export default function DiagnosticPanel() {
    const { diagnostic, error } = useDiagnostic();

    return (
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-base font-semibold text-gray-900">
                    System Diagnostic
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                    Diagnostik kondisi sistem pemantauan
                </p>
            </div>

            {/* Body */}
            <div className="p-6 text-sm">
                {error && (
                    <p className="text-gray-600">
                        Diagnostik sistem tidak tersedia.
                    </p>
                )}

                {!diagnostic && !error && (
                    <p className="text-gray-600">
                        Memuat data diagnostik sistem…
                    </p>
                )}

                {diagnostic && diagnostic.available === false && (
                    <p className="text-gray-600">
                        Data diagnostik belum tersedia.
                    </p>
                )}

                {diagnostic && diagnostic.available === true && diagnostic.diagnostic && (
                    <DiagnosticContent data={diagnostic.diagnostic} />
                )}
            </div>
        </div>
    );
}

function DiagnosticContent({ data }) {
    const s = data.summary || {};

    return (
        <div className="space-y-8 text-gray-800">

            {/* METADATA */}
            <section>
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                    Konteks Analisis
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                    <Meta label="Source" value={data.experiment} />
                    <Meta label="Pattern Level" value={data.analysis_level} />
                </div>

                <p className="text-[11px] text-gray-400 mt-2">
                    Informasi sumber dan tingkat analisis data
                </p>
            </section>

            <Divider />

            {/* METRICS */}
            <section>
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
                    Ringkasan Kondisi
                </h4>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                    <Metric label="Warning Count" value={s.warning_count} />
                    <Metric label="Danger Count" value={s.danger_count} />
                    <Metric
                        label="Trend Valid Ratio"
                        value={
                            typeof s.slope_ok_true_ratio === "number"
                                ? s.slope_ok_true_ratio.toFixed(2)
                                : "-"
                        }
                    />
                    <Metric
                        label="Max Delta (deg)"
                        value={
                            typeof s.max_abs_delta_deg === "number"
                                ? s.max_abs_delta_deg.toFixed(3)
                                : "-"
                        }
                    />
                </div>
            </section>

            <Divider />

            {/* FLAGS */}
            <section>
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                    Indikator Sistem
                </h4>

                {Array.isArray(data.flags) && data.flags.length > 0 ? (
                    <ul className="space-y-2">
                        {data.flags.map((f) => (
                            <li
                                key={f}
                                className="flex items-start gap-2 text-sm text-gray-700"
                            >
                                <span className="mt-1 w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                                <span>{f}</span>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className="text-gray-500">
                        Tidak ada indikator khusus
                    </div>
                )}
            </section>
        </div>
    );
}

/* ---- Small UI atoms ----- */

function Meta({ label, value }) {
    return (
        <div>
            <div className="text-[11px] uppercase tracking-wide text-gray-400">
                {label}
            </div>
            <div className="font-medium text-gray-900">
                {value ?? "-"}
            </div>
        </div>
    );
}

function Metric({ label, value }) {
    return (
        <div className="rounded-lg border border-gray-200 p-4 bg-gray-50">
            <div className="text-[11px] text-gray-500 mb-1">
                {label}
            </div>
            <div className="text-lg font-semibold text-gray-900">
                {value ?? "-"}
            </div>
        </div>
    );
}

function Divider() {
    return (
        <div className="border-t border-gray-200" />
    );
}