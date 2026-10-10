import re
import glob

files_to_process = ['index.html', 'tos.html', 'privacy.html', 'style.css']

# The replacement mappings
replacements = {
    # Hex
    r'#080b12': '#050304',
    r'#0d111c': '#0e0709',
    r'#121826': '#160b0e',
    r'#7dd3fc': '#ff8a95',
    r'#38bdf8': '#ff3b57',
    r'#0ea5e9': '#dc2626',
    r'#0284c7': '#b91c1c',
    r'#0369a1': '#7f1d1d',
    r'#8595ad': '#a1999b',
    r'#94a3b8': '#b8b0b2',
    r'#f8fafc': '#faf7f7',
    r'#17202f': '#1c0d10',
    # RGB/A mappings with flexible spacing
    r'rgba\(\s*14\s*,\s*165\s*,\s*233\s*,\s*([0-9.]+)\s*\)': r'rgba(255,0,51,\1)',
    r'rgba\(\s*56\s*,\s*189\s*,\s*248\s*,\s*([0-9.]+)\s*\)': r'rgba(255,59,87,\1)',
    r'rgba\(\s*2\s*,\s*132\s*,\s*199\s*,\s*([0-9.]+)\s*\)': r'rgba(180,0,30,\1)',
    r'rgba\(\s*8\s*,\s*11\s*,\s*18\s*,\s*([0-9.]+)\s*\)': r'rgba(5,3,4,\1)',
    r'rgba\(\s*13\s*,\s*17\s*,\s*28\s*,\s*([0-9.]+)\s*\)': r'rgba(14,7,9,\1)',
    r'rgba\(\s*14\s*,\s*21\s*,\s*38\s*,\s*([0-9.]+)\s*\)': r'rgba(22,11,14,\1)',
    r'rgba\(\s*30\s*,\s*41\s*,\s*59\s*,\s*([0-9.]+)\s*\)': r'rgba(40,12,16,\1)',
    r'rgba\(\s*15\s*,\s*23\s*,\s*42\s*,\s*([0-9.]+)\s*\)': r'rgba(18,8,10,\1)',
    
    # Specific exceptions or gradients
    # "#7dd3fc 0, #0284c7 25%, #38bdf8 50%, #0284c7 75%, #7dd3fc 100%" -> logo gradient
    r'#7dd3fc\s+0%?,\s*#0284c7\s+25%?,\s*#38bdf8\s+50%?,\s*#0284c7\s+75%?,\s*#7dd3fc\s+100%?': '#ff2a2a 0%, #ff0033 25%, #ff0040 50%, #ff0033 75%, #ff2a2a 100%',
    r'#7dd3fc\s+0,\s*#0284c7\s+25%,\s*#38bdf8\s+50%,\s*#0284c7\s+75%,\s*#7dd3fc\s+100%': '#ff2a2a 0, #ff0033 25%, #ff0040 50%, #ff0033 75%, #ff2a2a 100%',
    
    # Check for #0284c7 in skip-link or theme-color
    r'content="#0284c7"': 'content="#dc2626"',
    r'background:#0284c7': 'background:#dc2626',
    
}

for file in files_to_process:
    try:
        with open(file, 'r', encoding='utf-8') as f:
            content = f.read()
            
        new_content = content
        for pattern, replacement in replacements.items():
            new_content = re.sub(pattern, replacement, new_content, flags=re.IGNORECASE)
            
        with open(file, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Processed {file}")
    except Exception as e:
        print(f"Error processing {file}: {e}")

# Now let's grep for any remaining #.... colors
hex_colors = set()
for file in files_to_process:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
        hexes = re.findall(r'#[0-9a-fA-F]{3,6}', content)
        hex_colors.update(hexes)

print("Remaining hex colors:")
print(", ".join(sorted(list(hex_colors))))
