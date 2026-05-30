/**
 * File      : useDiagnostic.js
 * Project   : GeoMonitor
 * Author    : Galuh Kurnia
 * Created   : 2026-02-26
 * License   : MIT
 * © 2026 galhkoernia
 */

import { useEffect, useState } from "react";

/*

    useDiagnostic
    -------------

    Prinsip desain:
    - Tidak mempengaruhi runtime / decision
    - Aman jika tidak tersedia
    - Read-only
*/
export function useDiagnostic() {
    const [diagnostic, setDiagnostic] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        let cancelled = false;

        async function loadDiagnostic() {
            try {
                const response = await fetch(
                    "http://127.0.0.1:8080/diagnostic/latest",
                    { cache: "no-store"}
                );

                if (!response.ok) {
                    throw new Error("Diagnostic file not available");
                }

                const data = await response.json();

                if (!cancelled) {
                    setDiagnostic(data);
                }
            } catch (err) {
                if (!cancelled) {
                    setError(err);
                }
            }
        }

        loadDiagnostic();

        return () => {
            cancelled = true;
        };
    }, []);

    return { diagnostic, error };
}