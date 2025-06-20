from models.project_model import Project
from extensions import db

def create_project(data):
    project = Project(
        title=data["title"],
        description=data.get("description"),
        status=data.get("status"),
        company_id=data.get("company_id")
    )
    db.session.add(project)
    db.session.commit()
    return project


def get_all_projects():
    return Project.query.all()