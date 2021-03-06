# -*- coding: utf-8 -*-
"""The app module, containing the app factory function."""
from flask import Flask, render_template

from p101stat import idol, public
from p101stat.assets import assets
from p101stat.extensions import api_manager, babel, bcrypt, cache, db, debug_toolbar, login_manager, migrate
from p101stat.settings import ProdConfig


def create_app(config_object=ProdConfig):
    """An application factory, as explained here: http://flask.pocoo.org/docs/patterns/appfactories/.

    :param config_object: The configuration object to use.
    """
    app = Flask(__name__)
    app.config.from_object(config_object)
    register_extensions(app)
    register_blueprints(app)
    register_errorhandlers(app)
    return app


def register_extensions(app):
    """Register Flask extensions."""
    assets.init_app(app)
    babel.init_app(app)
    bcrypt.init_app(app)
    cache.init_app(app)
    db.init_app(app)
    login_manager.init_app(app)
    debug_toolbar.init_app(app)
    migrate.init_app(app, db)
    api_manager.init_app(app, flask_sqlalchemy_db=db)
    register_apis(app)
    return None


def register_blueprints(app):
    """Register Flask blueprints."""
    app.register_blueprint(public.views.blueprint)
    app.register_blueprint(idol.views.blueprint)
    return None


def register_apis(app):
    """Register restless endpoints."""
    api_manager.create_api(idol.models.Idol, methods=['GET'], exclude_columns=['dailies', 'idx'], max_results_per_page=101, app=app)
    api_manager.create_api(idol.models.DailyHistory, methods=['GET'], exclude_columns=['idol'], max_results_per_page=101, app=app)
    return None


def register_errorhandlers(app):
    """Register error handlers."""
    def render_error(error):
        """Render error template."""
        # If a HTTPException, pull the `code` attribute; default to 500
        error_code = getattr(error, 'code', 500)
        return render_template('{0}.html'.format(error_code)), error_code
    for errcode in [401, 404, 500]:
        app.errorhandler(errcode)(render_error)
    return None
