# -*- coding: utf-8 -*-
"""Helper utilities and decorators."""
from __future__ import unicode_literals

import requests
from flask import flash


def flash_errors(form, category='warning'):
    """Flash all errors for a form."""
    for field, errors in form.errors.items():
        for error in errors:
            flash('{0} - {1}'.format(getattr(form, field).label.text, error), category)


def fetch_idol(idx):
    """Fetch data for a single idol."""
    r = requests.post('https://www.produce101event.com/entry_info.php', data={'idx': idx})
    r.raise_for_status()
    idol_data = r.json()
    if idol_data['result'] == 'success' and idol_data['name']:
        return idol_data
    else:
        return None
