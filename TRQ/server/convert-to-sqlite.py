#!/usr/bin/env python3
import re

# Read the file
with open('index.js', 'r') as f:
    content = f.read()

# Pattern 1: db.execute({ sql: 'SELECT ...', args: [...] }) -> db.prepare('SELECT ...').all()
# For SELECT queries that return multiple rows
pattern1 = r'const result = await db\.execute\(\{\s*sql:\s*[\'"`]([^\'"`]+)[\'"`],\s*args:\s*\[(.*?)\]\s*\}\);'
replacement1 = r"const result = db.prepare('\1').all();"

# But we need to handle the args properly
# Let's do a more careful replacement

def convert_execute_to_prepare(match):
    sql = match.group(1)
    args_str = match.group(2).strip()
    
    # Check if it's a SELECT query
    if 'SELECT' in sql.upper():
        if args_str:
            # Has parameters
            return f"const result = db.prepare('{sql}').all({args_str});"
        else:
            return f"const result = db.prepare('{sql}').all();"
    elif 'INSERT' in sql.upper():
        if args_str:
            return f"const result = db.prepare('{sql}').run({args_str});"
        else:
            return f"const result = db.prepare('{sql}').run();"
    elif 'UPDATE' in sql.upper() or 'DELETE' in sql.upper():
        if args_str:
            return f"db.prepare('{sql}').run({args_str});"
        else:
            return f"db.prepare('{sql}').run();"
    
    return match.group(0)

# This is complex because of multiline SQL strings
# Let's use a simpler approach - just replace the pattern

# Replace: await db.execute({ sql: '...', args: [...] })
# With: db.prepare('...').all() or .run() or .get()

# Pattern for single-line execute calls
pattern = r'await db\.execute\(\{\s*sql:\s*[\'"`]([^\'"`]+)[\'"`],\s*args:\s*\[(.*?)\]\s*\}\)'

def replace_func(match):
    sql = match.group(1)
    args = match.group(2).strip()
    
    if 'SELECT' in sql.upper():
        if args:
            return f"db.prepare('{sql}').all({args})"
        else:
            return f"db.prepare('{sql}').all()"
    else:
        if args:
            return f"db.prepare('{sql}').run({args})"
        else:
            return f"db.prepare('{sql}').run()"

content = re.sub(pattern, replace_func, content, flags=re.IGNORECASE)

# Also handle multiline SQL strings
# Pattern for multiline: await db.execute({ sql: `...`, args: [...] })
pattern_multiline = r'await db\.execute\(\{\s*sql:\s*`([^`]+)`\s*,\s*args:\s*\[(.*?)\]\s*\}\)'

def replace_multiline(match):
    sql = match.group(1).strip()
    args = match.group(2).strip()
    
    if 'SELECT' in sql.upper():
        if args:
            return f"db.prepare(`{sql}`).all({args})"
        else:
            return f"db.prepare(`{sql}`).all()"
    else:
        if args:
            return f"db.prepare(`{sql}`).run({args})"
        else:
            return f"db.prepare(`{sql}`).run()"

content = re.sub(pattern_multiline, replace_multiline, content, flags=re.IGNORECASE | re.DOTALL)

# Handle cases without args
pattern_no_args = r'await db\.execute\(\{\s*sql:\s*[\'"`]([^\'"`]+)[\'"`]\s*\}\)'

def replace_no_args(match):
    sql = match.group(1)
    if 'SELECT' in sql.upper():
        return f"db.prepare('{sql}').all()"
    else:
        return f"db.prepare('{sql}').run()"

content = re.sub(pattern_no_args, replace_no_args, content, flags=re.IGNORECASE)

# Remove 'await' from db.prepare calls since they're synchronous
content = re.sub(r'await db\.prepare', 'db.prepare', content)

# Write the file back
with open('index.js', 'w') as f:
    f.write(content)

print("Conversion complete!")
