# -*- coding: utf-8 -*-
"""User models."""
from __future__ import unicode_literals

from datetime import datetime

from sqlalchemy import UniqueConstraint

from p101stat.database import Column, Model, SurrogatePK, db, reference_col, relationship


class Idol(SurrogatePK, Model):
    """A Produce 101 idol."""

    __tablename__ = 'idols'
    # Mnet's numeric index for this idol
    idx = Column(db.Integer(), unique=True, nullable=False)
    name_kr = Column(db.String(32), nullable=False)
    first_name_en = Column(db.String(32), nullable=True)
    last_name_en = Column(db.String(32), nullable=True)
    agency = Column(db.String(256), nullable=True)
    age = Column(db.Integer(), nullable=False)
    comment = Column(db.String(256), nullable=True)
    vote_percentage = Column(db.Float(), default=0.0, nullable=False)
    is_eliminated = Column(db.Boolean(), default=False, nullable=False)
    is_vote_restricted = Column(db.Boolean(), default=False, nullable=False)
    last_updated = Column(db.DateTime(), default=datetime.utcnow(), nullable=True)

    def __init__(self, idx, name_kr, age, **kwargs):
        """Create instance."""
        db.Model.__init__(self, idx=idx, name_kr=name_kr, age=age, **kwargs)

    @property
    def name_en(self):
        """English name in Last First format."""
        if self.last_name_en:
            return '{0} {1}'.format(self.last_name_en, self.first_name_en)
        else:
            return ''

    def __repr__(self):
        """Represent instance as a unique string."""
        return '<Idol({name!r})>'.format(name=self.name_en)


class DailyHistory(SurrogatePK, Model):
    """Daily voting history for Produce 101 idols."""

    __tablename__ = 'daily_history'
    idol_id = reference_col('idols')
    idol = relationship('Idol', backref='dailies')
    date = Column(db.Date(), nullable=False)
    vote_percentage = Column(db.Float(), default=0.0, nullable=False)
    rank = Column(db.Integer, default=0, nullable=False)

    UniqueConstraint('idol_id', 'date')
