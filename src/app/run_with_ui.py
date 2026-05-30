# ====================================================
# File      : run_with_ui.py
# Project   : GeoMonitor
# Author    : Galuh Kurnia
# Created   : 2026-02-26
# License   : MIT
# © 2026 galhkoernia
# ====================================================

from multiprocessing import Queue
import threading
import uvicorn

from src.ui.server import create_app, set_state_queue
from src.io.queue_publisher import QueuePublisher
from src.app.main import main

def start_ui_server(app) -> None:
    """
    Start UI Server
    """
    config = uvicorn.Config(
        app=app,
        host="0.0.0.0",
        port=8000,
        log_level="info",
        reload=False,
    )

    server = uvicorn.Server(config=config)
    server.run()

def run() -> None:
    """
     Entry point that launches:
    - UI server
    - Runtime core
    """
    state_queue: Queue = Queue()
   
    app = create_app()
    
    set_state_queue(state_queue)

    publisher = QueuePublisher(state_queue)

    # Start UI server
    ui_thread = threading.Thread(
        target=start_ui_server,
        args=(app,),
        name="UI-Server-Thread",
        daemon=True
    )
    ui_thread.start()

    # Run runtime core (blocking)
    try:
        main(publisher=publisher)
    except KeyboardInterrupt:
        print("Interrupted by user" )

if __name__ == "__main__":
    run()