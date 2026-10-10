import re

files = ['index.html', 'tos.html', 'privacy.html', 'style.css']

for file in files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()

    # 2. ui-avatars fallback URLs
    content = content.replace('background=0284c7', 'background=b91c1c')

    # 3. Merge exact duplicates
    content = re.sub(r'--t-white:\s*#faf7f7', '--t-white:var(--text)', content)
    content = re.sub(r'--t-muted:\s*#a1999b', '--t-muted:var(--muted)', content)
    
    # btn-primary:hover
    content = re.sub(
        r'\.btn-primary:hover\{background:linear-gradient\(135deg,var\(--p600\)\s*0,var\(--p700\)\s*100%\);border-color:rgba\(255,255,255,\.2\)\}',
        '.btn-primary:hover{background:linear-gradient(135deg,var(--p600) 0,var(--p500) 100%);border-color:rgba(255,255,255,.2);box-shadow:0 10px 20px -5px rgba(255,0,51,.5)}',
        content
    )
    
    # lofi-play-btn
    content = content.replace(
        '.lofi-play-btn{flex:0 0 auto;width:44px;height:44px;border-radius:50%;background:linear-gradient(135deg,var(--p500),var(--p600));',
        '.lofi-play-btn{flex:0 0 auto;width:44px;height:44px;border-radius:50%;background:linear-gradient(135deg,var(--p400),var(--p500));'
    )
    
    # .grad shimmer gradients check (spaces or no spaces)
    content = content.replace(
        '#ff8a95 0,#b91c1c 25%,#ff3b57 50%,#b91c1c 75%,#ff8a95 100%',
        '#ff2a2a 0,#ff0033 25%,#ff0040 50%,#ff0033 75%,#ff2a2a 100%'
    )

    with open(file, 'w', encoding='utf-8') as f:
        f.write(content)

print("Addendum applied.")
