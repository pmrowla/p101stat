# -*- coding: utf-8 -*-
"""Public section, including homepage."""
from flask import Blueprint, render_template

from ..idol.models import Idol

blueprint = Blueprint('public', __name__, static_folder='../static')


@blueprint.route('/', methods=['GET', 'POST'])
def home():
    """Home page."""
    top_five = Idol.query.order_by(Idol.rank).limit(5).all()
    last_updated = top_five[0].last_updated
    return render_template('public/home.html', last_updated=last_updated, top_five=top_five)
