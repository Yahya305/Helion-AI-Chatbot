"""fix memory schema

Revision ID: d4e5f6g7h8i9
Revises: c2e0daa22197
Create Date: 2025-11-28 18:25:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from pgvector.sqlalchemy import Vector


# revision identifiers, used by Alembic.
revision: str = 'd4e5f6g7h8i9'
down_revision: Union[str, Sequence[str], None] = 'c2e0daa22197'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Drop the table if it exists (to clear bad schema/data)
    # Note: cascade=True might be needed if there are dependencies, but usually simple drop works if no other tables depend on it.
    # semantic_memories depends on user, but nothing depends on semantic_memories.
    conn = op.get_bind()
    inspector = sa.inspect(conn)
    existing_tables = inspector.get_table_names()

    if 'semantic_memories' in existing_tables:
        op.drop_table('semantic_memories')

    # Recreate with correct schema
    op.create_table('semantic_memories',
        sa.Column('id', sa.UUID(), nullable=False),
        sa.Column('user_id', sa.UUID(), nullable=False),
        sa.Column('content', sa.String(), nullable=False),
        sa.Column('importance', sa.String(), nullable=True),
        sa.Column('embedding', Vector(dim=768), nullable=True),
        sa.Column('created_at', sa.TIMESTAMP(), server_default=sa.text('now()'), nullable=False),
        sa.ForeignKeyConstraint(['user_id'], ['user.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_semantic_memories_id'), 'semantic_memories', ['id'], unique=False)
    op.create_index(op.f('ix_semantic_memories_user_id'), 'semantic_memories', ['user_id'], unique=False)


def downgrade() -> None:
    op.drop_index(op.f('ix_semantic_memories_user_id'), table_name='semantic_memories')
    op.drop_index(op.f('ix_semantic_memories_id'), table_name='semantic_memories')
    op.drop_table('semantic_memories')
