import moment from "moment";

const getDifferenceText = (share) => {
    const deposists = share.deposits.map((deposit, index) => {
        return `${index + 1}) ${moment(deposit.timestamp).format("DD.MM.YYYY")} - ${deposit.amount} Euro`
    }).join("\n\n");

    const body = window.encodeURIComponent(`Hallo,
        
Ich bin bei der Solawi für die Kontoverwaltung zuständig.

Leider gibt es noch Unstimmigkeiten mit deinem Beitrag.

Wir haben bisher von dir im Wirtschaftsjahr 2017 bekommen: 

${deposists}

Damit hast du bei uns ein Guthaben von ${share.total_deposits} Euro.

Bitte überweise deshalb im (Monat) einmalig ${-1 * share.difference_today} Euro.
Bitte richte ab (Folgemonat) einen Dauerauftrag ein.

Vielen lieben Dank!
        `);
    const subject = window.encodeURIComponent("Solawi - Fehlender Beitrag")
    return `mailto:${share.email}?subject=${subject}&body=${body}`;
};

const getMissingText = (share) => {
    const body = window.encodeURIComponent(`Hallo!

Ich bin bei der Solawi für die Kontoverwaltung zuständig.

Dein aktueller Monatsbeitrag fehlt noch. Es wäre toll, wenn du einen Dauerauftrag einrichten könntest, sodass das Geld vor Ende des Vormonats eingeht. Falls das nicht geht, überweise bitte immer um den 26. des Vormonats, sodass das Geld rechtzeitig da ist.


Danke dir!
        `);
    const subject = window.encodeURIComponent("Solawi - Fehlender Beitrag")
    return `mailto:${share.email}?subject=${subject}&body=${body}`;
};

export {
    getDifferenceText,
    getMissingText
}