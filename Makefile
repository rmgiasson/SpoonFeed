all: start-frontend start-backend start-database


start-frontend:
	cmd /c start cmd /k "cd client && cd src && npm start"

start-backend:
	cmd /c start cmd /k "cd server && node server.js"

start-database:
	cmd /c start cmd /k "mongosh"


