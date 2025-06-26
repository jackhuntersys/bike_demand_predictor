
# ! Bu file packages ni topish uchun ishlatiladi
import os           

def find_python_packages(root_dir):
    python_packages = []
    for dirpath, dirnames, filenames in os.walk(root_dir):
        if "__init__.py" in filenames:
            python_packages.append(dirpath)
    return python_packages

if __name__ == "__main__":
    # Change this to the root of your project (e.g., "src")
    root_directory = "src"

    packages = find_python_packages(root_directory)
    
    if packages:
        print("📦 Python packages found:")
        for pkg in packages:
            print(" -", pkg)
    else:
        print("❌ No Python packages found.")
