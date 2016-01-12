# -*- coding: utf-8 -*-
"""Public section, including homepage."""
from flask import Blueprint, render_template
from sqlalchemy import desc

from ..idol.models import Idol

blueprint = Blueprint('public', __name__, static_folder='../static')


@blueprint.route('/', methods=['GET', 'POST'])
def home():
    """Home page."""
    query = Idol.query.order_by(desc(Idol.vote_percentage))
    return render_template('public/home.html', idols=query.all())
