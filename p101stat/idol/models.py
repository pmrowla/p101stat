# -*- coding: utf-8 -*-
"""User models."""
from __future__ import unicode_literals

from p101stat.database import Column, Model, SurrogatePK, db


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
