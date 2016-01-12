"""empty message

Revision ID: d9e98cba5844
Revises: 3ab570ed87dc
Create Date: 2016-01-12 21:43:21.443713

"""

# revision identifiers, used by Alembic.
revision = 'd9e98cba5844'
down_revision = '3ab570ed87dc'

from alembic import op
import sqlalchemy as sa


def upgrade():
    ### commands auto generated by Alembic - please adjust! ###
    op.create_table('daily_history',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('idol_id', sa.Integer(), nullable=False),
    sa.Column('date', sa.Date(), nullable=False),
    sa.Column('vote_percentage', sa.Float(), nullable=False),
    sa.Column('rank', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['idol_id'], ['idols.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.add_column(u'idols', sa.Column('last_updated', sa.DateTime(), nullable=True))
    ### end Alembic commands ###


def downgrade():
    ### commands auto generated by Alembic - please adjust! ###
    op.drop_column(u'idols', 'last_updated')
    op.drop_table('daily_history')
    ### end Alembic commands ###