# ====================================================
# File      : queue_publisher.py
# Project   : GeoMonitor
# Author    : Galuh Kurnia
# Created   : 2026-02-26
# License   : MIT
# © 2026 galhkoernia
# ====================================================

from typing import Dict, Any
import asyncio
from backend.io.state_publisher import StatePublisher


class AsyncQueueStatePublisher(StatePublisher):
    """
    Publish snapshot runtime ke asyncio.Queue secara thread-safe.
    """

    def __init__(self, queue: asyncio.Queue, loop: asyncio.AbstractEventLoop):
        self._queue = queue
        self._loop = loop

    def publish(self, snapshot: Dict[str, Any]) -> None:
        def _put():
            try:
                if self._queue.full():
                    self._queue.get_nowait()

                self._queue.put_nowait(snapshot)

            except Exception as e:
                print("[PUBLISH ERROR]", repr(e))

        try:
            if self._loop.is_closed():
                print("[PUBLISH] event loop closed, dropping snapshot")
                return

            self._loop.call_soon_threadsafe(_put)

        except Exception as e:
            print("[PUBLISH THREADSAFE ERROR]", repr(e))