# PSR-Lab-Sklady-Dokumentow

## Uruchamianie aplikacji
Aplikacje do uruchomienia wymagają środowiska uruchomieniowego Node (https://nodejs.org/en/download/). Następnie w folderze z projektem (PrzychodniaFirebase lub PrzychodniaMongoDB) należy uruchomić konsolę i wpisać polecenie `npm install`. Po pozytywnym zainstalowaniu wszystkich dependencji należy wpisać polecenie `node index.js`. Uruchomi ono aplikację, która jest dostępna pod adresem `http://localhost:3001/`.

Pliki odpowiedzialne za logię komunikacji ze składem dokumentów znajdują się w folderze `controllers`.

Do stworzenia aplikacji zostały wykorzystane biblioteki takie jak:
- body-parser: `https://www.npmjs.com/package/body-parser`
- ejs: `https://www.npmjs.com/package/ejs`
- express: `https://www.npmjs.com/package/express`
- method-override: `https://www.npmjs.com/package/method-override`
- uuid: `https://www.npmjs.com/package/uuid`
- firebase: `https://www.npmjs.com/package/firebase`
- mongodb: `https://www.npmjs.com/package/mongodb`
