#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""Management script."""
from __future__ import unicode_literals

import os
import sys
from datetime import datetime
from glob import glob
from subprocess import call

from flask_migrate import MigrateCommand
from flask_script import Command, Manager, Option, Server, Shell
from flask_script.commands import Clean, ShowUrls
from sqlalchemy import and_, desc

from p101stat.app import create_app
from p101stat.database import db
from p101stat.idol.models import DailyHistory, Idol
from p101stat.settings import DevConfig, ProdConfig
from p101stat.utils import fetch_idol

CONFIG = ProdConfig if os.environ.get('P101STAT_ENV') == 'prod' else DevConfig
HERE = os.path.abspath(os.path.dirname(__file__))
TEST_PATH = os.path.join(HERE, 'tests')

app = create_app(CONFIG)
manager = Manager(app)


def _make_context():
    """Return context dict for a shell session so you can access app, db, and the default models."""
    return {'app': app, 'db': db, 'Idol': Idol, 'DailyHistory': DailyHistory}


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
        idol = Idol.query.filter_by(idx=i).first()
        idol_data = fetch_idol(i)
        if idol_data:
            if idol:
                idol.update(vote_percentage=float(idol_data['per']), last_updated=datetime.utcnow())
                print('Updated existing idol {}'.format(idol.name_kr))
            else:
                Idol.create(idx=i, name_kr=idol_data['name'], age=int(idol_data['age']),
                            agency=idol_data['agency'], comment=idol_data['comment'],
                            vote_percentage=float(idol_data['per']))
                print('Created new idol {}'.format(idol.name_kr))
        elif idol:
            print('Could not fetch data for idol {}'.format(idol.name_kr), sys.stderr)
        else:
            print('Could not fetch data for index {}'.format(idx), sys.stderr)
    for i, idol in enumerate(Idol.query.order_by(desc(Idol.vote_percentage)).all()):
        # we don't update previous rank here, this should only be done daily
        # (see update_dailies)
        idol.update(rank=i + 1)
    print('Successfully fetched p101 idol data.')


@manager.command
def update_dailies():
    """Update daily rank information."""
    # Do this once to get consistent results in the event that the day changes
    # while we are running this function
    today = datetime.now().date()
    for i, idol in enumerate(Idol.query.order_by(desc(Idol.vote_percentage)).all()):
        daily = DailyHistory.query.filter(and_(DailyHistory.idol == idol, DailyHistory.date == today)).first()
        if daily:
            daily.update(vote_percentage=idol.vote_percentage, rank=i + 1)
        else:
            daily = DailyHistory.create(idol=idol, date=today, vote_percentage=idol.vote_percentage, rank=i + 1)
        idol.update(prev_rank=daily.rank, prev_vote_percentage=daily.vote_percentage)
    print('Successfully updated dailies')


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
