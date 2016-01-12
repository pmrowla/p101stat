# -*- coding: utf-8 -*-
"""User views."""
from flask import Blueprint

blueprint = Blueprint('idol', __name__, url_prefix='/idols', static_folder='../static')
