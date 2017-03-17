# ezChat
Where the Heartless talk shit, a simple chat for the heatless gamming community.

<p align="center">
    <img src="https://jlynnrowanliterature.files.wordpress.com/2013/02/minion.gif">
</p>

This app is curently under developement and will be available under [heartlessgaming.com/ezChat](https://heartlessgaming/ezChat). 

## Start coding

Intall the project dependencie using a regular npm install.
```bash
$ npm i
```

Start a live reload server on [localhost:4200](http://localhost:4200) that listen to file changes of the front end **and** back end. (thanks [Parallelshell](https://github.com/keithamus/parallelshell))
```bash
$ npm start
```

Start coding with a simple `npm start` from there on out.

## Self Host

**Front :** Use `npm run build` to build the project for Production environement. A *dist* directory will be created containing the app code ready to be hosted on your web server.

**Back :** start the *server/index.js* file under a forever process. (Details will be added soon)

## Front
angular cli : https://github.com/angular/angular-cli  
angular material2  (ez component / easy theming) :  https://github.com/angular/material2  
Fonctionnalities :
- see who is connected
- see new messages
  - emoji interpretation
  - gif interpretation
  - youtube interpretation
- write a message
  - emoji selector
- notification in browser tab
- sound notifiaction ? (maybe borring will see)

### TODOs
- init project : done
- maquette with real component
- integration API

## Back :skull:
[![js-standard-style](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)

The back office of ezChat is located in the **server** directory.

The purpose of the ezChat server is to handle events of the front-end users. eg : chat message received, user connected, user just left the chat.

Npm Script for back office developement
```bash
npm run devback
```
Restart de dev when change are made to the server directory (use [nodemon](https://github.com/remy/nodemon)).

Express : http://expressjs.com/
