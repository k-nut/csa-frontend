import moment from "moment";
import * as _ from "lodash";

const getDifferenceText = (share, deposits) => {
  const lastDecember = moment()
    .startOf("year")
    .subtract(1, "month");
  const validDeposits = deposits
    .filter(deposit => !(deposit.ignore || deposit.is_security))
    .filter(deposit => moment(deposit.timestamp).isAfter(lastDecember));
  const payments = validDeposits
    .sort((a, b) => moment(a.timestamp) - moment(b.timestamp))
    .map((deposit, index) => {
      return `${index + 1}) ${moment(deposit.timestamp).format(
        "DD.MM.YYYY"
      )} - ${deposit.amount} Euro`;
    })
    .join("\n\n");

  const totalDeposits = _.sumBy(validDeposits, "amount");

  const months = [
    "Januar",
    "Februar",
    "März",
    "April",
    "Mai",
    "Juni",
    "Juli",
    "August",
    "September",
    "Oktober",
    "November",
    "Dezember"
  ];

  const thisMonth = moment().month();
  const thisYear = moment().year();

  const body = window.encodeURIComponent(`Hallo,
        
Ich bin bei der Solawi für die Kontoverwaltung zuständig.

Leider gibt es noch Unstimmigkeiten mit deinem Beitrag.

Wir haben bisher von dir im Wirtschaftsjahr ${thisYear} bekommen: 

${payments}

Damit hast du bei uns einen Zahlungseingang von ${totalDeposits} Euro.

Bitte überweise deshalb im ${months[thisMonth]} einmalig ${-1 *
    share.difference_today} Euro.
Bitte richte ab ${months[(thisMonth + 1) % 12]} einen Dauerauftrag ein.

Vielen lieben Dank!
        `);
  const subject = window.encodeURIComponent("Solawi - Unstimmigkeiten");
  return `mailto:${share.email}?subject=${subject}&body=${body}`;
};

const getMissingText = share => {
  const body = window.encodeURIComponent(`Hallo!

Ich bin bei der Solawi für die Kontoverwaltung zuständig.

Dein aktueller Monatsbeitrag fehlt noch.
Es wäre toll, wenn du einen Dauerauftrag einrichten könntest,
sodass das Geld um den 26. des Vormonats eingeht. 
Falls das nicht geht, überweise bitte immer um den 26. des Vormonats, 
sodass das Geld rechtzeitig da ist.

Das ist wichtig, sonst ist deine Überweisung noch nicht im System sichtbar,
weil wir oft mit den Umsätzen vom 29. des Monats arbeiten
 (das ist ja das Datum, zu dem der Beitrag eingegangen sein soll).

Danke dir!
        `);
  const subject = window.encodeURIComponent("Solawi - Fehlender Beitrag");
  return `mailto:${share.email}?subject=${subject}&body=${body}`;
};

export { getDifferenceText, getMissingText };
