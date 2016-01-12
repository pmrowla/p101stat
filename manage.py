#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""Management script."""
from __future__ import unicode_literals

import os
from glob import glob
from subprocess import call

from flask_migrate import MigrateCommand
from flask_script import Command, Manager, Option, Server, Shell
from flask_script.commands import Clean, ShowUrls

from p101stat.app import create_app
from p101stat.database import db
from p101stat.idol.models import Idol
from p101stat.settings import DevConfig, ProdConfig
from p101stat.utils import fetch_idol

CONFIG = ProdConfig if os.environ.get('P101STAT_ENV') == 'prod' else DevConfig
HERE = os.path.abspath(os.path.dirname(__file__))
TEST_PATH = os.path.join(HERE, 'tests')

app = create_app(CONFIG)
manager = Manager(app)


def _make_context():
    """Return context dict for a shell session so you can access app, db, and the Idol model by default."""
    return {'app': app, 'db': db, 'Idol': Idol}


@manager.command
def test():
    """Run the tests."""
    import pytest
    exit_code = pytest.main([TEST_PATH, '--verbose'])
    return exit_code


@manager.command
def update_idols():
    """Update db entries for all p101 idols."""
    for i in range(1, 102):
        idol_data = fetch_idol(i)
        if idol_data:
            idol = Idol.query.filter_by(idx=i).first()
            if idol:
                idol.vote_percentage = float(idol_data['per'])
            else:
                idol = Idol(idx=i, name_kr=idol_data['name'], age=int(idol_data['age']),
                            agency=idol_data['agency'], comment=idol_data['comment'],
                            vote_percentage=float(idol_data['per']))
                db.session.add(idol)
            db.session.commit()
    print 'Successfully fetched p101 idol data.'


class Lint(Command):
    """Lint and check code style with flake8 and isort."""

    def get_options(self):
        """Command line options."""
        return (
            Option('-f', '--fix-imports', action='store_true', dest='fix_imports', default=False,
                   help='Fix imports using isort, before linting'),
        )

    def run(self, fix_imports):
        """Run command."""
        skip = ['requirements']
        root_files = glob('*.py')
        root_directories = [name for name in next(os.walk('.'))[1] if not name.startswith('.')]
        files_and_directories = [arg for arg in root_files + root_directories if arg not in skip]

        def execute_tool(description, *args):
            """Execute a checking tool with its arguments."""
            command_line = list(args) + files_and_directories
            print('{}: {}'.format(description, ' '.join(command_line)))
            rv = call(command_line)
            if rv is not 0:
                exit(rv)

        if fix_imports:
            execute_tool('Fixing import order', 'isort', '-rc')
        execute_tool('Checking code style', 'flake8')


manager.add_command('server', Server())
manager.add_command('shell', Shell(make_context=_make_context))
manager.add_command('db', MigrateCommand)
manager.add_command('urls', ShowUrls())
manager.add_command('clean', Clean())
manager.add_command('lint', Lint())

if __name__ == '__main__':
    manager.run()
