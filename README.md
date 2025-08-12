# H₂Optimize


## Instalation 

Avec npm : 

`npm i` + `npm run dev`

Avec docker : 

`make startd`


## Variable d'environnment

```
FRONTEND_HOST=frontend
FRONTEND_VERSION=0.0.1
GHCR_LOCATION=h2optimize-end-of-study-project-hetic

# ENVIRONMENT : development, production, testing
ENVIRONMENT=development

FRONTEND_EXT_PORT=80
VITE_BASE_PATH=/release/
# FRONTEND_INT_PORT=80

BACKEND_HOST=backend
BACKEND_PORT=8000
```

### Dans github 

```
PERSONAL_ACCESS_TOKEN = token 
SSH_PRIVATE_KEY = secret_key
FRONTEND_EXT_PORT = 81
FRONTEND_HOST = frontend_release
GHCR_LOCATION = h2optimize-end-of-study-project-hetic
GHCR_USER = j-renevier
SSH_HOST = admin-hetic.arcplex.tech
SSH_PORT = 2328
SSH_USER = joachim
VITE_BASE_PATH = /release/
```

## Tests

#### Command to run playwright :

npx playwright test
