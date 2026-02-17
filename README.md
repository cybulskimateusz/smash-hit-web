# Quick setup

1. Make sure you're docker is running.
2. Run:
```
nvm use
npm i
make dev
```
3. On desktop go to https://YOUR_IP:8080 and accept unsafe connection - neccessary to enable WS server, then open https://YOUR_IP:3000
4. On mobile go to https://YOUR_IP:8080 and accept unsafe connection, then scan QR code from desktop to start game.
5. localhost:3001 is a library of separate modules displayed in isolated environment. Something like storybook, but I found it unneccesarly complex to use storybook in this kind of project.
