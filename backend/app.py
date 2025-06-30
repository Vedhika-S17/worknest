from flask import Flask, jsonify
from config import Config
from extensions import db, migrate, jwt
from flask_cors import CORS
from routes.auth import auth_bp
from routes.onboarding import onboarding_bp
from dotenv import load_dotenv
from routes.profiles import profiles_bp
from routes.projects import project_bp
load_dotenv()
from routes.skills import skills_bp


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    CORS(app, supports_credentials=True, resources={
        r"/*": {"origins": "http://localhost:5173"}
    })

    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)

    # ✅ Register blueprints
    app.register_blueprint(auth_bp, url_prefix="/auth")
    app.register_blueprint(onboarding_bp)
    app.register_blueprint(profiles_bp, url_prefix="/profiles")
    app.register_blueprint(project_bp)
    app.register_blueprint(skills_bp, url_prefix="/skills")
    # ✅ Health check
    @app.route("/")
    def index():
        print("✅ Flask server is running")
        return jsonify({"message": "Server is running"}), 200

    # ✅ Global 422 handler (for malformed JSON, etc.)
    @app.errorhandler(422)
    def handle_422(err):
        print("🚨 GLOBAL 422 HANDLER TRIGGERED")
        print("🚨 ERROR DETAILS:", err)
        return jsonify({"error": "Unprocessable Entity", "message": str(err)}), 422

    # ✅ Catch-all internal server errors
    @app.errorhandler(Exception)
    def handle_any_exception(err):
        print("🔥 UNHANDLED EXCEPTION:", err)
        return jsonify({"error": "Internal Server Error", "message": str(err)}), 500

    return app
