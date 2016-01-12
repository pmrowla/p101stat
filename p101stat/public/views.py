# -*- coding: utf-8 -*-
"""Public section, including homepage."""
from datetime import date

from flask import Blueprint, render_template
from sqlalchemy import desc

from ..database import db
from ..idol.models import DailyHistory, Idol

blueprint = Blueprint('public', __name__, static_folder='../static')


@blueprint.route('/', methods=['GET', 'POST'])
def home():
    """Home page."""
    query = db.session.query(Idol, DailyHistory.rank.label('daily_rank'), DailyHistory.vote_percentage.label('daily_percentage')).\
        join(Idol.dailies).\
        filter(DailyHistory.date == date.today()).\
        order_by(desc(Idol.vote_percentage))
    idols = query.all()
    assert(len(idols) == 101)
    last_updated = idols[0][0].last_updated
    return render_template('public/home.html', idols=idols, last_updated=last_updated)
