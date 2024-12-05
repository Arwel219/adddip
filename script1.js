
let db;
const dbName = "GestioneOrariLavoro";
const storeName = "dipendenti";

// Funzione per aprire IndexedDB
function apriDatabase() {
    const request = indexedDB.open(dbName, 1);

    request.onerror = function(event) {
        console.error("Errore nell'aprire il database", event);
    };

    request.onsuccess = function(event) {
        db = event.target.result;
        console.log("Database aperto con successo!");
        caricaDipendenti(); // Carichiamo i dipendenti dopo che il database è aperto
    };

    request.onupgradeneeded = function(event) {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(storeName)) {
            db.createObjectStore(storeName, { keyPath: "nome" });
        }
    };
}

// Funzione per caricare i dipendenti dalla IndexedDB e aggiornarli nella tabella
function caricaDipendenti() {
    const transaction = db.transaction([storeName], "readonly");
    const objectStore = transaction.objectStore(storeName);
    const request = objectStore.getAll(); // Recuperiamo tutti i dipendenti

    request.onsuccess = function(event) {
        const dipendenti = event.target.result;
        aggiornaTabella(dipendenti); // Mostriamo i dati nella tabella
    };
}

// Funzione per aggiornare la tabella con i dati dei dipendenti
function aggiornaTabella(dipendenti) {
    const tabella = document.getElementById("tabellaOrari").getElementsByTagName('tbody')[0];
    tabella.innerHTML = ""; // Pulisce la tabella

    dipendenti.forEach(dipendente => {
        const row = tabella.insertRow();

        let cell = row.insertCell(0);
        cell.textContent = dipendente.nome;

        // Crea le celle per ogni giorno della settimana
        for (let i = 0; i < 7; i++) {
            cell = row.insertCell(i + 1);
            cell.textContent = dipendente.orari[i]; // Mostra il turno per il giorno
        }
    });

}

    // Ottieni la data attuale

    var dataAttuale = new Date();

    // Calcola il numero del giorno del mese (inizio e fine settimana)
    var giornoAttuale = dataAttuale.getDate();
    var giornoDellaSettimana = dataAttuale.getDay();  // 0 = Domenica, 1 = Lunedì, ..., 6 = Sabato

    // Calcola il numero del giorno del mese per il lunedì della settimana
    var inizioSettimana = new Date(dataAttuale);
    inizioSettimana.setDate(giornoAttuale - giornoDellaSettimana + 1);  // 1 = Lunedì
    var giornoInizioSettimana = inizioSettimana.getDate();

    // Calcola il numero del giorno del mese per la domenica della settimana
    var fineSettimana = new Date(dataAttuale);
    fineSettimana.setDate(giornoAttuale - giornoDellaSettimana + 7);  // 7 = Domenica
    var giornoFineSettimana = fineSettimana.getDate();

    // Ottieni mese e anno
    var mese = dataAttuale.getMonth() + 1;  // getMonth() è zero-indexed (0 = gennaio, 11 = dicembre)
    var anno = dataAttuale.getFullYear();

    // Visualizza il numero del giorno di inizio e fine settimana, mese e anno
    document.getElementById("inizio-settimana").textContent = giornoInizioSettimana;
    document.getElementById("fine-settimana").textContent = giornoFineSettimana;
    document.getElementById("mese-anno").textContent = `${mese}/${anno}`;

// Avvia il database quando la pagina è caricata
window.onload = apriDatabase;

