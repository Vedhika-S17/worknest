"""Add project_requests table

Revision ID: 9d59514a764c
Revises: f45963138d18
Create Date: 2025-06-24 00:43:01.240083

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '9d59514a764c'
down_revision = 'f45963138d18'
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        'project_requests',
        sa.Column('request_id', sa.Integer(), primary_key=True),
        sa.Column('project_id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('admin_id', sa.Integer(), nullable=False),
        sa.Column('status', sa.Enum('pending', 'approved', 'rejected', name='statusenum'), server_default='pending'),
        sa.Column('requested_at', sa.DateTime(), server_default=sa.func.now()),
        sa.ForeignKeyConstraint(['project_id'], ['projects.project_id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['user_id'], ['users.user_id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['admin_id'], ['users.user_id'], ondelete='CASCADE')
    )


def downgrade():
    op.drop_table('project_requests')
    sa.Enum(name='statusenum').drop(op.get_bind())
