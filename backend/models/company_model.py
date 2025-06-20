from extensions import db

class Company(db.Model):
    __tablename__ = 'companies'

    company_id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(150), nullable=False)
    contact_email = db.Column(db.String(255))
    industry = db.Column(db.String(100))
    created_at = db.Column(db.DateTime, server_default=db.func.now())
