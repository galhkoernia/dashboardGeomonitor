#
# Created on Wed Dec 17 2025
#
# Copyright (c) 2025 Your Company
#

import os
import shutil

PROJECT_ROOT = os.path.dirname(os.path.dirname(__file__))

def remove_pycache(root):
    for dirpath, dirnames, filenames in os.walk(root):
        if "__pycache__" in dirnames:
            path = os.path.join(dirpath, "__pycache__")
            print(f"Removing {path}")
            shutil.rmtree(path, ignore_errors=True)

def remove_extensions(root, exts):
    for dirpath, _, filenames in os.walk(root):
        for f in filenames:
            if any(f.endswith(ext) for ext in exts):
                path = os.path.join(dirpath, f)
                print(f"Removing {path}")
                os.remove(path)

def main():
    remove_pycache(PROJECT_ROOT)
    remove_extensions(PROJECT_ROOT, [".pyc", ".pyo"])

    csv_path = os.path.join(PROJECT_ROOT, "outputs", "runs", "latest.csv")
    if os.path.exists(csv_path):
        print(f"Removing {csv_path}")
        os.remove(csv_path)

    print("Clean complete.")

if __name__ == "__main__":
    main()
