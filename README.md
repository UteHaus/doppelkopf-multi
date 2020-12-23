# doppelkopf-multi
Doppelkopf -->  sometimes abbreviated to Doko, is a trick-taking card game for four players
 
 It is a multiplayer Doppelkopf game. You can add tables and user. Users can play a game or view a game.


 ## Configurations
 ### Default
 - default user: admin and password: admin.
 - port: 8080


## build and run
`git clone doppelkopf-multi`

### Docker

1. Build the images `docker-compose build`
1. Run the as container `docker-compose up -d`

#### Posableites
To change the port of the client, at docker compose file change the client ports item `8080:80` to `xxxx:80`.

### local

#### api 
1. packages reload `dotnet reload`
1. start start api local `dotnet run`
1. build the api `dotnet build`

#### client 
1. install packages `yarn install`
1. start the angular app local `yarn start`
1. build the angular app `yarn build`


## ToDoś:
- die lezte Karte bleibt liegen obwohl gespielt, nach dem letzten 
spieler wird diese aktualisiert
- Ton beim spielen eier Karte
- aktellen Stich nur für 3 sekunden Anzeigen 
- 
- spielverlauf anzeigen
- Re Kontra --> DB vorhanden 
- Auflisten der Stiche am Ende
- info an wen man wartet
- Chate eine Zeile --> DB vorhanden 

- Übersetzungen beim Tisch überprüfen
- Bilder auf ihrer Größe Komprimieren bzw optimieren
- eventuell Tisch Bild
- einige müssen sich nach einem refresh neu Anmelden, es könnte am cocky
- Option Rod nicht abschmeißen 
- [Jitsi](https://github.com/jitsi/lib-jitsi-meet/blob/master/doc/API.md#installation)

### behoben
- König solo, Spieler 1 spiel unter herz und kein weiterer einen König und der letzte einen Herz Ass. Dabei gewinnt der 1 Spieler, es müsste aber der letzte Spieler den stich erhalten 
- Zuschauer --> DB vorhanden 
- Spielstand wird bei neuen Karten nicht richtig zurück gesetzt
- Karten werden Sortiert
- Geber und Anspieler mit angeben
- Update des Tisch states
- beim Client die Karten nach gesund sortieren



## Update State
- https://www.tpeczek.com/2017/02/server-sent-events-sse-support-for.html --> mit nuget repo
- https://dev.to/praneetnadkar/understanding-server-sent-events-17n8 