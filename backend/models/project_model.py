from extensions import db

class Project(db.Model):
    __tablename__ = 'projects'

    project_id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(150), nullable=False)
    description = db.Column(db.Text)
    status = db.Column(db.String(30))
    company_id = db.Column(db.Integer, db.ForeignKey('companies.company_id'))
    created_at = db.Column(db.DateTime, server_default=db.func.now())
