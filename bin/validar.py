#!/usr/bin/env python3
"""
Valida el tema contra lo que Shopify acepta, antes de subirlo.

`shopify theme check` no cubre nada de esto: comprueba Liquid, no la
coherencia entre las plantillas JSON y los schemas de las secciones, ni
los límites del propio schema. Cada regla de aquí nació de un fallo real
de subida.

Uso:  python3 bin/validar.py
"""
import json
import os
import re
import sys
import glob

MAX_NAME = 25  # Shopify rechaza schemas con name de más de 25 caracteres.

errors = []


def schema_of(path):
    m = re.search(r'{%-?\s*schema\s*-?%}(.*?){%-?\s*endschema\s*-?%}',
                  open(path, encoding='utf-8').read(), re.S)
    if not m:
        return None
    try:
        return json.loads(m.group(1))
    except json.JSONDecodeError as e:
        errors.append('%s: schema no es JSON válido — %s' % (path, e))
        return None


def check_names():
    """Los name de schema, preset y bloque tienen tope de 25 caracteres.

    Sólo se miden los literales: las claves de traducción (`t:...`) se
    resuelven en el servidor a un texto más corto.
    """
    for f in sorted(glob.glob('sections/*.liquid')):
        d = schema_of(f)
        if not d:
            continue
        candidates = [('name', d.get('name', ''))]
        candidates += [('preset', p.get('name', '')) for p in d.get('presets', [])]
        candidates += [('bloque', b.get('name', '')) for b in d.get('blocks', [])]
        for kind, name in candidates:
            if not name.startswith('t:') and len(name) > MAX_NAME:
                errors.append('%s: %s "%s" tiene %d caracteres (máximo %d)'
                              % (f, kind, name, len(name), MAX_NAME))


def check_templates():
    """Cada sección de una plantilla debe existir, y sus ajustes también."""
    for gf in sorted(glob.glob('templates/*.json') + glob.glob('sections/*-group.json')):
        try:
            d = json.load(open(gf, encoding='utf-8'))
        except json.JSONDecodeError as e:
            errors.append('%s: JSON inválido — %s' % (gf, e))
            continue
        for key, sec in d.get('sections', {}).items():
            f = 'sections/%s.liquid' % sec['type']
            if not os.path.exists(f):
                errors.append('%s: la sección "%s" apunta a %s, que no existe' % (gf, key, f))
                continue
            sch = schema_of(f)
            if not sch:
                continue
            valid = {s['id'] for s in sch.get('settings', []) if 'id' in s}
            for k in sec.get('settings', {}):
                if k not in valid:
                    errors.append('%s → %s: ajuste "%s" no existe en %s' % (gf, key, k, sec['type']))
            for s in sch.get('settings', []):
                sid = s.get('id')
                if sid not in sec.get('settings', {}):
                    continue
                v = sec['settings'][sid]
                if s.get('type') == 'select':
                    opts = {o['value'] for o in s.get('options', [])}
                    if str(v) not in opts:
                        errors.append('%s → %s: %s = %r no está entre %s'
                                      % (gf, key, sid, v, sorted(opts)))
                if s.get('type') == 'range' and isinstance(v, (int, float)):
                    mn, mx, st = s.get('min'), s.get('max'), s.get('step')
                    if mn is not None and (v < mn or v > mx):
                        errors.append('%s → %s: %s = %s fuera de [%s, %s]' % (gf, key, sid, v, mn, mx))
                    elif st and mn is not None and (v - mn) % st:
                        errors.append('%s → %s: %s = %s no cae en el paso de %s' % (gf, key, sid, v, st))
            for bk, bv in sec.get('blocks', {}).items():
                bsch = next((b for b in sch.get('blocks', []) if b['type'] == bv['type']), None)
                if not bsch:
                    errors.append('%s → %s: bloque "%s" no existe en %s' % (gf, key, bv['type'], sec['type']))
                    continue
                bvalid = {s['id'] for s in bsch.get('settings', []) if 'id' in s}
                for k in bv.get('settings', {}):
                    if k not in bvalid:
                        errors.append('%s → %s → %s: ajuste "%s" no existe' % (gf, key, bk, k))


def check_theme_settings():
    """El preset de settings_data debe respetar settings_schema."""
    sch = json.load(open('config/settings_schema.json', encoding='utf-8'))
    defs = {s['id']: s for g in sch for s in g.get('settings', []) if 'id' in s}
    data = json.load(open('config/settings_data.json', encoding='utf-8'))
    for pname, preset in data.get('presets', {}).items():
        for k, v in preset.items():
            s = defs.get(k)
            if not s or not isinstance(v, (int, float)) or s.get('type') != 'range':
                continue
            mn, mx, st = s.get('min'), s.get('max'), s.get('step')
            if mn is None:
                continue
            if v < mn or v > mx:
                errors.append('settings_data → %s: %s = %s fuera de [%s, %s]' % (pname, k, v, mn, mx))
            elif st and (v - mn) % st:
                errors.append('settings_data → %s: %s = %s no cae en el paso de %s' % (pname, k, v, st))


def check_assets():
    """Toda referencia a asset_url debe existir en assets/."""
    for f in glob.glob('sections/gia-*.liquid') + glob.glob('snippets/gia-*.liquid') + ['layout/theme.liquid']:
        src = open(f, encoding='utf-8').read()
        for m in re.finditer(r"'([A-Za-z0-9._-]+\.(?:css|js|jpg|png|svg|otf|woff2?))'\s*\|\s*asset_url", src):
            if not os.path.exists('assets/' + m.group(1)):
                errors.append('%s: referencia a assets/%s, que no existe' % (f, m.group(1)))


def check_css():
    for f in glob.glob('assets/gia-*.css') + glob.glob('assets/section-gia-*.css'):
        s = open(f, encoding='utf-8').read()
        if s.count('{') != s.count('}'):
            errors.append('%s: llaves desbalanceadas (%d abren, %d cierran)'
                          % (f, s.count('{'), s.count('}')))


for fn in (check_names, check_templates, check_theme_settings, check_assets, check_css):
    fn()

if errors:
    print('%d problema(s):\n' % len(errors))
    for e in errors:
        print('  ✗ %s' % e)
    sys.exit(1)

print('Todo válido ✓')
