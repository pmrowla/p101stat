# -*- coding: utf-8 -*-
"""Factories to help in tests."""
from __future__ import unicode_literals

from factory import Sequence
from factory.alchemy import SQLAlchemyModelFactory

from p101stat.database import db
from p101stat.idol.models import Idol


class BaseFactory(SQLAlchemyModelFactory):
    """Base factory."""

    class Meta:
        """Factory configuration."""

        abstract = True
        sqlalchemy_session = db.session


class IdolFactory(BaseFactory):
    """Idol factory."""

    idx = Sequence(lambda n: n + 1)
    name_kr = Sequence(lambda n: 'idol{0}'.format(n))
    age = Sequence(lambda n: n)
    vote_percentage = Sequence(lambda n: float(n))

    class Meta:
        """Factory configuration."""

        model = Idol
