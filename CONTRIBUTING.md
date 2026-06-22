# Contributing to Emergency Response App

Thank you for your interest in contributing! This document provides guidelines for contributing to the project.

## Code of Conduct

Please treat all contributors with respect. Be constructive in your feedback and help others succeed.

## Getting Started

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Make your changes
4. Write or update tests
5. Submit a pull request

## Development Setup

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/emergency-response-app.git
cd emergency-response-app

# Create virtual environment
python -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r backend/requirements.txt

# Setup database
alembic upgrade head

# Start development server
uvicorn app.main:app --reload
```

## Code Style

### Python

- Follow PEP 8
- Use Black for formatting
- Use isort for import sorting
- Use mypy for type checking

```bash
black app/
isort app/
mypy app/
```

### TypeScript/React

- Use ESLint
- Use Prettier for formatting
- Follow React best practices

```bash
cd frontend
npm run lint
npm run format
```

## Testing

### Backend Tests

```bash
pytest backend/tests/ -v --cov=app
```

### Frontend Tests

```bash
cd frontend
npm test
```

## Commit Messages

Use descriptive commit messages:

```
feat: Add emergency alert WebSocket support
fix: Resolve database connection timeout
docs: Update API documentation
test: Add tests for location tracking
```

## Pull Request Process

1. Update documentation
2. Add tests for new features
3. Ensure all tests pass
4. Update CHANGELOG.md
5. Request review from maintainers

## Reporting Issues

- Use GitHub Issues
- Provide clear description
- Include steps to reproduce
- Include error messages and logs
- Include environment information

## Questions?

Open an issue or contact the maintainers at support@emergencyresponse.app
