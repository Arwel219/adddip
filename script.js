let dipendenti = [];

    // Funzione per ottenere il numero dei giorni della settimana
    function getGiorniSettimana() {
        const oggi = new Date();
        const giornoCorrente = oggi.getDay(); // 0 = domenica, 1 = lunedì, ..., 6 = sabato
        const giorni = [];
        for (let i = 0; i < 7; i++) {
            const giorno = (giornoCorrente + i) % 7; // Calcola il giorno relativo alla settimana
            giorni.push(giorno);
        }

        // Mappiamo i numeri dei giorni della settimana
        const giorniNomi = ["Lunedì", "Martedì", "Mercoledì", "Giovedì", "Venerdì", "Sabato", "Domenica"];
        const giorniNumeri = giorni.map(g => giorniNomi[g]);
        
        // Impostiamo i numeri dei giorni nella pagina
        document.getElementById("giorniSettimana").textContent = giorniNumeri.join(" | ");
    }

    // Funzione per aggiungere un dipendente
    function aggiungiDipendente() {
        const nome = document.getElementById("nomeDipendente").value;
        if (nome === "") {
            alert("Inserisci il nome del dipendente.");
            return;
        }

        if (dipendenti.includes(nome)) {
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

        dipendenti.forEach(dipendente => {
            const row = tabella.insertRow();

            let cell = row.insertCell(0);
            cell.textContent = dipendente.nome;

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

    // Funzione per memorizzare i dati
    function memorizzaDati() {
        localStorage.setItem("dipendenti", JSON.stringify(dipendenti));
        alert("Dati memorizzati con successo!");
        window.location.href = "visualizzaOrari.html";
    }
