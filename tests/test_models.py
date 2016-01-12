# -*- coding: utf-8 -*-
"""Model unit tests."""
import datetime as dt

import pytest

from p101stat.idol.models import DailyHistory, Idol

from .factories import IdolFactory


@pytest.mark.usefixtures('db')
class TestIdol:
    """Idol tests."""

    def test_get_by_id(self):
        """Get idol by ID."""
        idol = Idol(1, 'foo', 18)
        idol.save()

        retrieved = Idol.get_by_id(idol.id)
        assert retrieved == idol

    def test_get_by_idx(self):
        """Get idol by Mnet index."""
        idol = Idol(1, 'foo', 18)
        idol.save()

        retrieved = Idol.get_by_id(idol.idx)
        assert retrieved == idol

    def test_last_updated_defaults_to_datetime(self):
        """Test update date."""
        idol = Idol(1, 'foo', 18)
        idol.save()
        assert bool(idol.last_updated)
        assert isinstance(idol.last_updated, dt.datetime)

    def test_first_name_en_is_nullable(self):
        """Test null name."""
        idol = Idol(1, 'foo', 18)
        idol.save()
        assert idol.first_name_en is None

    def test_last_name_en_is_nullable(self):
        """Test null name."""
        idol = Idol(1, 'foo', 18)
        idol.save()
        assert idol.last_name_en is None

    def test_agency_is_nullable(self):
        """Test null agency."""
        idol = Idol(1, 'foo', 18)
        idol.save()
        assert idol.agency is None

    def test_factory(self, db):
        """Test idol factory."""
        idol = IdolFactory()
        db.session.commit()
        assert bool(idol.idx)
        assert bool(idol.name_kr)
        assert bool(idol.vote_percentage is not None)
        assert bool(idol.last_updated)
        assert idol.is_eliminated is False
        assert idol.is_vote_restricted is False

    def name_en(self):
        """Idol full English name."""
        idol = IdolFactory(first_name_en='Bar', last_name_en='Foo')
        assert idol.name_en == 'Foo Bar'

    def test_dailies(self):
        """Add a daily to a user."""
        idol = IdolFactory()
        daily = DailyHistory(idol=idol, date=dt.datetime.utcnow().date())
        daily.save()
        assert daily in idol.dailies
