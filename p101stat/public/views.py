# -*- coding: utf-8 -*-
"""Public section, including homepage."""
from flask import Blueprint, render_template

from ..idol.models import Idol

blueprint = Blueprint('public', __name__, static_folder='../static')


@blueprint.route('/', methods=['GET', 'POST'])
def home():
    """Home page."""
    last_updated = Idol.query.first().last_updated
    return render_template('public/home.html', last_updated=last_updated)

@blueprint.route('/about/', methods=['GET', 'POST'])
def about():
    """About page."""
    return render_template('public/about.html')
