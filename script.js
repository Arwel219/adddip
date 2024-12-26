        // Variabili globali
        let db;
        const dbName = "GestioneOrariLavoro";
        const storeName = "dipendenti";
        let dipendenti = [];  // Assicurati che dipendenti sia un array vuoto all'inizio

        // Funzione per aprire IndexedDB
        function apriDatabase() {
            console.log("Tentando di aprire il database...");
            const request = indexedDB.open(dbName, 1);

            request.onerror = function(event) {
                console.error("Errore nell'aprire il database", event);
            };

            request.onsuccess = function(event) {
                db = event.target.result;
                console.log("Database aperto con successo!");
                // Carica i dipendenti, se esistono
                caricaDipendenti();
            };

            request.onupgradeneeded = function(event) {
                const db = event.target.result;
                if (!db.objectStoreNames.contains(storeName)) {
                    const objectStore = db.createObjectStore(storeName, { keyPath: "nome" });
                    objectStore.createIndex("orari", "orari", { unique: false });
                    console.log("Store creato.");
                }
            };
        }

        // Funzione per caricare i dipendenti da IndexedDB
        function caricaDipendenti() {
            const transaction = db.transaction([storeName], "readonly");
            const objectStore = transaction.objectStore(storeName);
            const request = objectStore.getAll();  // Ottieni tutti i dipendenti

            request.onsuccess = function(event) {
                dipendenti = event.target.result;
                aggiornaTabella();
            };

            request.onerror = function(event) {
                console.error("Errore nel caricare i dipendenti", event);
            };
        }

        // Funzione per aggiungere un dipendente
        function aggiungiDipendente() {
            const nome = document.getElementById("nomeDipendente").value;
            if (nome === "") {
                alert("Inserisci il nome del dipendente.");
                return;
            }

            if (dipendenti.some(d => d.nome === nome)) {
                alert("Questo dipendente è già stato aggiunto.");
                return;
            }

            dipendenti.push({ nome: nome, orari: Array(7).fill("riposo") });
            document.getElementById("nomeDipendente").value = "";  // Reset del campo
            aggiornaTabella();
        }

        // Funzione per aggiornare la tabella
        function aggiornaTabella() {
            const tabella = document.getElementById("tabellaOrari").getElementsByTagName('tbody')[0];
            tabella.innerHTML = "";  // Pulisce la tabella

            dipendenti.forEach((dipendente, index) => {
                const row = tabella.insertRow();

                let cell = row.insertCell(0);
                cell.textContent = dipendente.nome;
                cell.classList.add("nome"); // Aggiungi la classe 'nome'

                // Crea le celle per ogni giorno della settimana
                for (let i = 0; i < 7; i++) {
                    cell = row.insertCell(i + 1);
                    const select = document.createElement("select");
                    select.innerHTML = `
                        <option value="mattina" ${dipendente.orari[i] === "mattina" ? "selected" : ""}>Mattina</option>
                        <option value="sera" ${dipendente.orari[i] === "sera" ? "selected" : ""}>Sera</option>
                        <option value="riposo" ${dipendente.orari[i] === "riposo" ? "selected" : ""}>Riposo</option>
                    `;
                    select.onchange = function() {
                        dipendente.orari[i] = select.value;
                    };
                    cell.appendChild(select);
                }

                // Colonna per il pulsante di eliminazione
                cell = row.insertCell(8);
                const deleteBtn = document.createElement("button");
                deleteBtn.textContent = "Elimina";
                deleteBtn.classList.add("delete-btn");
                deleteBtn.onclick = function() {
                    eliminaDipendente(index);
                };
                cell.appendChild(deleteBtn);
            });
        }

        // Funzione per eliminare un dipendente
function eliminaDipendente(index) {
    if (confirm(`Sei sicuro di voler eliminare ${dipendenti[index].nome}?`)) {
        // Rimuovi il dipendente dall'array
        const dipendenteEliminato = dipendenti.splice(index, 1)[0];  // Rimuovi il dipendente dall'array

        // Rimuovi il dipendente dal database
        const transaction = db.transaction([storeName], "readwrite");
        const objectStore = transaction.objectStore(storeName);

        // Rimuovi il dipendente dal database usando la sua "chiave primaria" (nome)
        objectStore.delete(dipendenteEliminato.nome);

        transaction.oncomplete = function() {
            console.log(`Dipendente ${dipendenteEliminato.nome} eliminato dal database.`);
            aggiornaTabella();  // Rende aggiornata la tabella
        };

        transaction.onerror = function(event) {
            console.error("Errore nell'eliminare il dipendente dal database", event);
        };

        // Rendi persistente la modifica nel database
        memorizzaDati();  // Memorizza i dati aggiornati
    }
}

		
		// Funzione per memorizzare i dati in IndexedDB
        function memorizzaDati() {
            if (!db) {
                alert("Database non è stato aperto correttamente. Riprova.");
                return;
            }

            const transaction = db.transaction([storeName], "readwrite");
            const objectStore = transaction.objectStore(storeName);

            dipendenti.forEach(dipendente => {
                objectStore.put(dipendente); // Salva o aggiorna il dipendente
            });

            transaction.oncomplete = function() {
                console.log("Dati memorizzati con successo!");
            };

            transaction.onerror = function(event) {
                console.error("Errore nel salvataggio dei dati in IndexedDB", event);
            };
        }

        // Funzione per memorizzare i dati in IndexedDB tramite bottone
        function memorizzaDatib() {
            if (!db) {
                alert("Database non è stato aperto correttamente. Riprova.");
                return;
            }

            const transaction = db.transaction([storeName], "readwrite");
            const objectStore = transaction.objectStore(storeName);

            dipendenti.forEach(dipendente => {
                objectStore.put(dipendente); // Salva o aggiorna il dipendente
            });

            transaction.oncomplete = function() {
                alert("Dati memorizzati con successo!");
                window.location.href = "visualizzaOrari.html"; // Redirigi alla pagina dei dati salvati
            };

            transaction.onerror = function(event) {
                console.error("Errore nel salvataggio dei dati in IndexedDB", event);
            };
        }

        // Funzione per cancellare il database IndexedDB
        function resetIndexedDB() {
            console.log("Provo a cancellare il database:", dbName);

            const deleteRequest = indexedDB.deleteDatabase(dbName);

            deleteRequest.onsuccess = function() {
                console.log(`Database ${dbName} cancellato con successo.`);
                alert("Tutti i dati sono stati resettati.");
                location.reload(); // Ricarica la pagina per resettare tutto
            };

            deleteRequest.onerror = function(event) {
                console.error("Errore nel cancellare il database:", event.target.error);
                alert("Si è verificato un errore nel reset dei dati.");
            };

            deleteRequest.onblocked = function() {
                alert("Il reset del database per essere completato devi cliccare su memorizza dati.");
            };
        }

        // Aggiungi l'evento al pulsante per resettare i dati
        document.getElementById("resetButton").addEventListener("click", function() {
            if (confirm("Sei sicuro di voler resettare tutti i dati del database?")) {
                resetIndexedDB();
            }
        });

	
// Aggiungi la classe 'selected' alla cella quando viene cliccata
document.querySelectorAll("td").forEach(cell => {
    cell.addEventListener("click", function() {
        // Toglia la selezione dalle altre celle
        document.querySelectorAll("td").forEach(c => c.classList.remove("selected"));
        // Aggiungi la classe 'selected' alla cella cliccata
        this.classList.add("selected");
    });
});

// Aggiungi un event listener per aggiornare lo stato delle selezioni
document.querySelectorAll('.scelta-giorno').forEach(select => {
    select.addEventListener('change', function() {
        const giorno = this.closest('td').textContent.trim();
        const valoreSelezionato = this.value;
        console.log(`Selezionato per ${giorno}: ${valoreSelezionato}`);
    });
});
        
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