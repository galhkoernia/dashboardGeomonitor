#
# Created on Mon Jun 29 2026
#
# Copyright (c) 2026 Your Company
#


from fastapi import FastAPI

print(">>> Debug Server Loaded <<<")

app = FastAPI()

@app.get("/")
def root():
    print(">>> Debug Root Hit <<<")
    return {"ok": True}
