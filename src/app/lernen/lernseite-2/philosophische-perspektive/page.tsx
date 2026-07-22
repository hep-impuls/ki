import Link from "next/link";
import ActivityTracker from "@/components/ActivityTracker";
import AppLayout from "@/components/layout/AppLayout";
import AbschnittKopf from "../_components/AbschnittKopf";
import VideoImpuls from "../_components/VideoImpuls";
import AkkordeonPosten from "../_components/AkkordeonPosten";
import HistorienTeppich from "../_components/HistorienTeppich";
import VerunsicherungsEpochen from "../_components/VerunsicherungsEpochen";
import SeitenNavigation from "../_components/SeitenNavigation";
import AktivitaetsNetzFloat from "../_components/AktivitaetsNetzFloat";
import Inhaltsverzeichnis from "../_components/Inhaltsverzeichnis";
import Aufgabe from "../_components/Aufgabe";
import Ausklapptext from "../_components/Ausklapptext";
import ModulMiniNav from "../_components/ModulMiniNav";

/**
 * Thema 02 — «Philosophische Perspektive».
 *
 * Drei Schritte: (0) «Was ist Philosophie?» (AkkordeonPosten), (1) «Teppich des
 * Wandels» (HistorienTeppich — Vier-Fäden-Gewebe), (2) «Philosophie in Zeiten
 * der Verunsicherung» (VerunsicherungsEpochen — acht Epochen, je Bausteine
 * Technologie / Verunsicherung / Philosophie).
 */

export default function Lernseite2PhilosophischePerspektive() {
  return (
    <AppLayout>
      <ActivityTracker
        type="lesson_open"
        page="lernseite-2/philosophische-perspektive"
        lessonId="lernseite-2-philosophische-perspektive"
      />

      {/* Mitfahrendes Aktivitätsnetz — wie auf Hub & Auftakt */}
      <AktivitaetsNetzFloat />

      <ModulMiniNav />

      <Link
        href="/lernen/lernseite-2"
        className="inline-flex items-center gap-xs text-label-md text-on-surface-variant hover:text-on-surface transition-colors"
      >
        <span className="material-symbols-outlined text-[18px]">arrow_back</span>
        Zurück zu Lernseite 2
      </Link>

      <AbschnittKopf bild="/art/philosophie-kopf.webp" gross className="mt-lg">
        <p className="text-label-md uppercase tracking-wider text-tertiary">
          Thema 02 · Orientierung
        </p>
        <h1 className="mt-sm text-headline-xl text-on-surface">
          Philosophische Perspektive
        </h1>
        <p className="mt-md max-w-3xl text-body-lg text-on-surface-variant">
          Technische Umbrüche verunsichern — das ist nicht neu. Diese Seite
          geht dem in drei Schritten nach: Zuerst klärst du kurz, was{" "}
          <strong className="text-on-surface">Philosophie</strong> überhaupt ist
          und warum gerade jetzt. Dann webst du den{" "}
          <strong className="text-on-surface">«Teppich des Wandels»</strong> —
          ein Gewebe aus Technologien, Entdeckungen, Ereignissen und kulturellen
          Praxen, das zeigt: Wandel hat nie nur eine Ursache. Und schliesslich
          gehst du durch <strong className="text-on-surface">acht Epochen</strong>,
          von der Antike bis zu Umwelt und KI heute — jede mit einer Technologie,
          der Verunsicherung, die sie auslöste, und der Philosophie, die Halt
          gab, als aufklappbare, bewertbare Bausteine. Öffne, was dich
          interessiert. Und heute, mit KI?
        </p>
        <blockquote className="mt-md max-w-3xl border-l-4 border-tertiary pl-md">
          <p className="text-body-md italic text-on-surface-variant">
            «Die Eule der Minerva beginnt erst mit der einbrechenden Dämmerung
            ihren Flug.»
          </p>
          <footer className="mt-xs text-label-sm text-on-surface-variant">
            G. W. F. Hegel — die Philosophie sieht nicht voraus: Sie begreift,
            was war, und gewinnt daraus Antworten für die Gegenwart.
          </footer>
        </blockquote>
      </AbschnittKopf>

      {/* Inhaltsverzeichnis + Klammersymbol (oben rechts) */}
      <Inhaltsverzeichnis
        className="mt-xl max-w-3xl"
        eintraege={[
          { id: "was-philosophie", label: "Was ist Philosophie?", prefixe: ["philosophische-perspektive:einstieg"] },
          { id: "teppich", label: "Der Teppich des Wandels", prefixe: ["philosophische-perspektive:teppich"] },
          { id: "epochen", label: "Philosophie in Zeiten der Verunsicherung", prefixe: ["philosophische-perspektive:epochen"] },
        ]}
      />

      {/* Video-Impuls zum Auftakt — vor «Was ist Philosophie» (YouTube-ID folgt) */}
      <VideoImpuls
        className="mt-xl"
        spurId="video:philosophie"
        titel="Philosophie als Orientierung"
        beschreibung="Ein kurzer Input zum Auftakt: Wie hat Philosophie schon mehrfach Orientierung gestiftet, wenn Technik und Ereignisse die Welt verunsicherten?"
      />

      {/* 0 — Einstieg: Was ist Philosophie? (erster Aktivitätsposten) */}
      <section id="was-philosophie" className="mt-xl max-w-4xl scroll-mt-24" aria-label="Was ist Philosophie?">
        <AbschnittKopf bild="/art/philosophie-einstieg.webp">
          <h2 className="text-headline-lg text-on-surface">
            Was ist Philosophie — und warum jetzt?
          </h2>
          <p className="mt-sm text-body-lg text-on-surface-variant">
            Bevor wir in die Geschichte eintauchen: Was ist Philosophie
            überhaupt? Wörtlich heisst sie «Liebe zur Weisheit». Sie gibt keine
            fertigen Antworten wie eine Einzelwissenschaft, sondern stellt die
            grundlegenden Fragen — nach Wissen, Wahrheit, Recht, dem guten Leben
            und dem Menschen selbst — und prüft, wie wir sie begründen. Gerade
            heute, wo Maschinen sprechen, entscheiden und gestalten, brechen
            diese Fragen neu auf: Was ist der Mensch, wenn eine Maschine vieles
            ebenso gut kann? Philosophie hilft, im Umbruch Orientierung zu
            finden, statt der Technik nur hinterherzulaufen.
          </p>
        </AbschnittKopf>
        <Aufgabe className="mt-md">Klappe die Punkte auf, die dich neugierig machen.</Aufgabe>
        <AkkordeonPosten
          className="mt-lg"
          spurKey="philosophische-perspektive:einstieg"
          begriff="Fragen"
          ariaLabel="Was ist Philosophie? — aufklappbare Punkte"
          punkte={[
            {
              titel: "Sie beginnt mit Staunen und Zweifeln",
              text: "Schon Platon und Aristoteles sagten: Am Anfang der Philosophie steht das Staunen — das Innehalten vor dem, was selbstverständlich schien. Dazu kommt der Zweifel: Descartes' «Ich denke, also bin ich» beginnt damit, alles anzuzweifeln, bis ein sicherer Punkt bleibt. Staunen öffnet die Frage, Zweifel prüft die Antwort.",
            },
            {
              titel: "Ihre Hauptfrage: Was ist der Mensch?",
              text: "Immanuel Kant bündelte die Philosophie in vier Fragen: Was kann ich wissen? Was soll ich tun? Was darf ich hoffen? — und, so Kant, alle laufen zusammen in der einen: Was ist der Mensch? Was uns auszeichnet — Vernunft, Sprache, Bewusstsein, Freiheit — stand immer im Zentrum.",
            },
            {
              titel: "Die KI stellt diese Frage neu — und dringlich",
              text: "Nicht wörtlich: «Was ist der Mensch?» wird laut Google Trends kaum häufiger gesucht als früher. Aber in unzähligen Reden und Texten über KI kehrt die Frage in konkreter Form wieder — müssen wir überhaupt noch selbst denken und schreiben? Wie verändert uns die tägliche Nutzung? Und welche Rolle bekommen wir neben der Maschine: eher anleitend, prüfend und verantwortend statt ausführend? So taucht die alte philosophische Frage nach dem Menschen neu auf, mitten im Alltag.",
            },
            {
              titel: "Sie gibt keine Rezepte, sondern Orientierung",
              text: "Philosophie liefert keine Bedienungsanleitung und keine Prognose. Sie ordnet Begriffe, deckt verborgene Annahmen auf und wägt Gründe ab — sie hilft zu klären, worüber wir eigentlich streiten. Hegels Bild der «Eule der Minerva» (oben) sagt: Verstehen kommt oft erst im Rückblick — aber genau dieses Begreifen brauchen wir, um die Gegenwart zu gestalten.",
            },
          ]}
        />
      </section>

      {/* Interaktives Muster der Seite: der Teppich des Wandels — vier Fäden
          (Technologie, Entdeckungen, gesellschaftliche Ereignisse, kulturelle
          Praxen), die sich erst durchs Anklicken der Punkte einweben */}
      <section id="teppich" className="mt-xl max-w-5xl scroll-mt-24" aria-label="Teppich des Wandels">
        <AbschnittKopf bild="/art/philosophie-teppich.webp">
          <h2 className="text-headline-lg text-on-surface">
            Der Teppich des Wandels
          </h2>
          <p className="mt-sm max-w-4xl text-body-lg text-on-surface-variant">
            Geschichte verläuft nicht als eine Linie von Epoche zu Epoche. Vier
            Fäden laufen nebeneinander durch die Zeit:{" "}
            <strong className="text-on-surface">Technologien</strong>, die
            eingeführt werden,{" "}
            <strong className="text-on-surface">Entdeckungen</strong>, die das
            Weltbild verschieben,{" "}
            <strong className="text-on-surface">gesellschaftliche Ereignisse</strong>,
            die alles umwälzen — und{" "}
            <strong className="text-on-surface">kulturelle Praxen</strong> wie
            Ackerbau, Gewürzhandel oder Kaffeehaus-Gespräch, in denen Menschen
            ihr Zusammenleben ordnen. Der Teppich beginnt bei Pflug, Rad und
            Schrift, spannt sich über die ganze Welt — Mesopotamien, Ägypten,
            Indien, China, Bagdad, Europa — und reicht bis zur KI. Manchmal
            kreuzen sich die Fäden, manchmal laufen sie allein; an einigen
            Punkten wartet ein{" "}
            <strong className="text-on-surface">Verunsicherungs-Stopp</strong>,
            der zur passenden Epoche im Abschnitt «Philosophie in Zeiten der
            Verunsicherung» weiter unten führt.
          </p>
        </AbschnittKopf>
        <Aufgabe className="mt-md max-w-4xl">
          Tippe die Punkte an — jeder erzählt seine Geschichte, und Stück für
          Stück webt sich der Teppich. Bewerte in jeder Karte, ob dir der Punkt
          bekannt war und wie relevant er für dein Leben ist. Erneutes Antippen
          wählt ab; die Legende schaltet ganze Fäden an und aus.
        </Aufgabe>
        <HistorienTeppich
          className="mt-lg"
          spurKey="philosophische-perspektive:teppich"
          bewertungen={[
            {
              prefix: "philosophische-perspektive:bekanntheit",
              frage: "Das war mir bekannt:",
              stufen: ["gar nicht", "etwas", "gut"],
            },
            {
              prefix: "philosophische-perspektive:relevanz",
              frage: "Mein Leben sähe ohne diesen Punkt anders aus:",
              stufen: ["kaum", "etwas", "stark"],
            },
          ]}
          punkte={[
            /* ── Faden: gesellschaftliche Ereignisse ── */
            {
              faden: "ereignisse",
              x: 125,
              y: 175,
              titel: "Der Prozess des Sokrates",
              kurz: "Sokrates-Prozess",
              jahr: "399 v. Chr.",
              text: "Athen verurteilt seinen unbequemsten Frager zum Tod. Der Prozess zeigt eine Stadt in der Krise — zwischen alter Ordnung und neuem Denken.",
              mehr: "Sokrates hatte nichts geschrieben, nur gefragt — und damit Gewissheiten zersetzt. Sein Todesurteil machte ihn zur Gründungsfigur der Philosophie: Platon, sein Schüler, baute auf diesem Schock sein Werk auf.",
              verunsicherung:
                "Die alte, mythische Ordnung trägt nicht mehr, die Sophisten machen jede Wahrheit verhandelbar — die Antike ist zutiefst verunsichert. In den Epochen unten zeigt die Antike, wie Aristoteles darauf antwortet: beobachten, ordnen, begründen.",
            },
            {
              faden: "ereignisse",
              x: 215,
              y: 140,
              labelOben: true,
              titel: "Der Fall Roms",
              kurz: "Fall Roms",
              jahr: "410/476",
              text: "Rom wird 410 geplündert, 476 endet das weströmische Reich. Für die Zeitgenossen wankt die Weltordnung selbst.",
              mehr: "Der Zusammenbruch war ein langer Prozess aus Völkerwanderung, Wirtschaftskrise und innerem Zerfall. Wichtig für diese Seite: Aus der Erschütterung entstand eine neue Orientierung, die tausend Jahre trug.",
              verunsicherung:
                "Mit Rom fällt für die Zeitgenossen die Ordnung der Welt. In den Epochen unten zeigt «Zerbrechen der Ordnung», wie Augustinus den Halt vom äusseren Reich nach innen verlegt: Glaube, Gewissen, Erinnerung.",
            },
            {
              faden: "ereignisse",
              x: 340,
              y: 95,
              labelOben: true,
              titel: "Kolonialisierung",
              kurz: "Kolonialisierung",
              jahr: "ab 1492",
              text: "Mit den neuen Schiffen greifen europäische Mächte über die Ozeane aus: Eroberung, Handel, Sklaverei. Der Reichtum Europas und das Leid ganzer Kontinente hängen am selben Faden.",
              mehr: "Die Kolonialisierung verband Technologie (Schiffe, Waffen, Kompass), Entdeckung (neue Kontinente aus europäischer Sicht) und Gewaltgeschichte — sie ist die gewaltsame Seite der frühen Globalisierung. Ihre Folgen — globale Handelswege, Ausbeutung, kulturelle Dominanz — wirken bis in heutige Debatten über Wissensmacht und kulturellen Bias der KI nach.",
            },
            {
              faden: "ereignisse",
              x: 362,
              y: 215,
              titel: "Reformation",
              kurz: "Reformation",
              jahr: "1517",
              text: "Luthers Thesen spalten die Kirche — verbreitet in Windeseile durch den Buchdruck. Eine neue Technologie und ein gesellschaftlicher Umbruch greifen ineinander.",
              mehr: "Ohne Buchdruck keine Reformation in dieser Wucht: Flugschriften machten aus einer Gelehrtendebatte eine Massenbewegung. Ein frühes Beispiel dafür, wie ein neues Medium bestimmt, welche Ideen sich durchsetzen — eine Frage, die sich bei Social-Media-Algorithmen und KI neu stellt.",
            },
            {
              faden: "ereignisse",
              x: 425,
              y: 250,
              titel: "Das Erdbeben von Lissabon",
              kurz: "Lissabon",
              jahr: "1755",
              text: "Am Allerheiligentag zerstören Beben, Feuer und Flutwelle die fromme Stadt. Ganz Europa fragt: Wie kann ein gütiger Gott das zulassen?",
              mehr: "Das Beben wurde zum Medienereignis der Aufklärung: Voltaire spottete über den «besten aller Welten»-Optimismus, Kant schrieb drei Abhandlungen über die Ursachen — ein früher Schritt zur wissenschaftlichen Erdbebenkunde.",
              verunsicherung:
                "Mit der Stadt zerbricht der Glaube an einen gütigen Weltplan. In den Epochen unten zeigt die Aufklärung, wie daraus Kants Zumutung wird: Verlass dich nicht auf Autoritäten — denke selbst.",
            },
            {
              faden: "ereignisse",
              x: 470,
              y: 80,
              labelOben: true,
              titel: "Französische Revolution",
              kurz: "Revolution",
              jahr: "1789",
              text: "Das Volk stürzt die alte Ordnung: Freiheit, Gleichheit, Brüderlichkeit. Die Ideen der Aufklärung werden politisch — mit Hoffnung und Terror zugleich.",
              mehr: "Die Revolution zeigt, wie Denken die Welt verändert: Kants «Habe Mut, dich deines eigenen Verstandes zu bedienen» wird zur politischen Sprengkraft. Zugleich mahnt ihr Umschlag in den Terror, dass Umbrüche Orientierung brauchen — genau das Thema dieser Seite.",
            },
            {
              faden: "ereignisse",
              x: 550,
              y: 125,
              labelOben: true,
              titel: "Zweiter Weltkrieg",
              kurz: "Weltkrieg",
              jahr: "1939–45",
              text: "Der industrialisierte Krieg und die Schoah erschüttern den Glauben an den Fortschritt im Kern. Zugleich treibt der Krieg Technologien voran — Radar, Rakete, Computer.",
              mehr: "Turings Bombe entschlüsselt Enigma, in Deutschland rechnet Zuses Z3, in den USA entsteht ENIAC: Der Computer wird im Krieg geboren. Nach 1945 fragt die Philosophie neu, wie Zivilisation und Barbarei zusammengehen konnten — und was Technik ohne Verantwortung anrichtet.",
            },
            {
              faden: "ereignisse",
              x: 622,
              y: 45,
              labelOben: true,
              titel: "Mondfahrt im Kalten Krieg",
              kurz: "Mondfahrt",
              jahr: "1969",
              text: "Im Wettlauf der Supermächte betreten Menschen den Mond. Die Mondfahrt ist Triumph der Technik — und zugleich Machtdemonstration im Kalten Krieg.",
              mehr: "Sputnik (1957) löste den «Sputnik-Schock» aus, die Mondlandung (1969) antwortete darauf. Nebenprodukte des Wettlaufs — Miniaturisierung, Satelliten, das ARPANET als militärisches Forschungsnetz — wurden zu Grundlagen unserer digitalen Welt. Und das Foto der Erde aus dem All veränderte den Blick auf den Planeten.",
            },
            {
              faden: "ereignisse",
              x: 680,
              y: 150,
              titel: "Zusammenbruch der Sowjetunion",
              kurz: "Ende der UdSSR",
              jahr: "1991",
              text: "Der Ostblock zerfällt, der Kalte Krieg endet. Im selben Jahr wird das World Wide Web freigegeben — die vernetzte, globalisierte Welt beginnt.",
              mehr: "1989 fällt die Mauer, 1991 löst sich die Sowjetunion auf. Manche riefen das «Ende der Geschichte» aus — die endgültige Weltordnung. Rückblickend begann stattdessen ein neuer Umbruch: Globalisierung und Digitalisierung, deren Verunsicherungen wir heute mit der KI erleben.",
            },
            /* ── Faden: Technologie ── */
            {
              faden: "technologie",
              x: 50,
              y: 140,
              labelOben: true,
              titel: "Der Pflug",
              kurz: "Pflug",
              jahr: "Jungsteinzeit",
              text: "Der Pflug vervielfacht, was ein Feld hergibt. Mit ihm werden Überschüsse möglich — und damit Städte, Arbeitsteilung und Herrschaft.",
              mehr: "Vom Grabstock zum Hakenpflug zum Räderpflug — entwickelt in Mesopotamien, Ägypten, Indien und China unabhängig voneinander. Der Pflug ist das Urbild der Technologie: ein Werkzeug, das nicht nur Arbeit erleichtert, sondern die Gesellschaft umbaut, die es benutzt.",
            },
            {
              faden: "technologie",
              x: 78,
              y: 235,
              titel: "Das Rad",
              kurz: "Rad",
              jahr: "~3500 v. Chr.",
              text: "Töpferscheibe und Wagenrad entstehen in Mesopotamien und dem Schwarzmeerraum. Das Rad macht Lasten beweglich — Transport, Handel und Krieg verändern sich.",
              mehr: "Das Rad ist keine europäische Erfindung — die ältesten Belege stammen aus Mesopotamien und dem Kaukasus. Bemerkenswert: Die Hochkulturen Amerikas kannten das Rad (an Spielzeugfiguren), nutzten es aber nicht für Transport, unter anderem mangels Zugtieren. Technik setzt sich nur durch, wo sie in Umwelt und Praxis passt.",
            },
            {
              faden: "technologie",
              x: 100,
              y: 70,
              labelOben: true,
              titel: "Die Schrift",
              kurz: "Schrift",
              jahr: "~3300 v. Chr.",
              text: "In Mesopotamien entsteht die Schrift — zuerst für Buchhaltung und Vorräte. Denken und Erinnern werden erstmals ausserhalb des Kopfes gespeichert.",
              mehr: "Die frühesten Keilschrifttafeln sind Verwaltungslisten: Getreide, Vieh, Schulden. Schrift entstand mehrfach unabhängig — in Mesopotamien, China und Mittelamerika; die Anden-Kulturen speicherten stattdessen in Knotenschnüren (Quipus). Die Schrift eröffnet die Medienlinie dieses Teppichs — Buchdruck, Internet und KI setzen sie fort: Immer mehr Denken wandert in Dinge aus.",
            },
            {
              faden: "technologie",
              x: 126,
              y: 105,
              labelOben: true,
              titel: "Papyrus und Papier",
              kurz: "Papyrus & Papier",
              jahr: "Ägypten · China",
              text: "In Ägypten wird aus Schilf Papyrus (~3000 v. Chr.), in China erfindet Cai Lun das Papier (105 n. Chr.): leichte, billige Schreibflächen. Wissen wird tragbar.",
              mehr: "Das Papier wanderte über die islamische Welt nach Europa — Papiermühlen in Samarkand und Bagdad ab dem 8. Jahrhundert. Erst mit billigem Papier lohnte sich später der Buchdruck. Die Medienlinie dieses Teppichs ist eine Weltreise: Ägypten, China, Bagdad, Mainz.",
            },
            {
              faden: "technologie",
              x: 262,
              y: 130,
              titel: "Kompass und Schiesspulver",
              kurz: "Kompass",
              jahr: "China, ~1000",
              text: "Chinesische Seefahrer navigieren mit der Magnetnadel; über arabische und indische Händler erreicht sie Europa. Ohne Kompass keine Ozeanfahrt.",
              mehr: "Auch Schiesspulver und der Druck mit beweglichen Lettern (Bi Sheng, ~1040) stammen aus China; Koreas «Jikji» (1377) ist das älteste erhaltene Buch aus Metalllettern. Viele «europäische Erfindungen» stehen auf den Schultern anderer Weltgegenden — Technikgeschichte ist Weltgeschichte.",
            },
            {
              faden: "technologie",
              x: 278,
              y: 60,
              labelOben: true,
              titel: "Der Buchdruck",
              kurz: "Buchdruck",
              jahr: "um 1450",
              text: "Gutenbergs bewegliche Lettern machen Wissen massenhaft kopierbar. Was bisher Klöstern und Höfen gehörte, kann sich nun verbreiten — Kontrolle über Wissen geht verloren und wird neu verteilt.",
              mehr: "Der Buchdruck gilt als Medienrevolution schlechthin: Er ermöglichte Reformation, Wissenschaft und Aufklärung. Jede spätere Medientechnik — Zeitung, Radio, Internet, KI — wiederholt seine Grundfrage: Wer darf sprechen, wer wird gehört, wer prüft die Wahrheit?",
            },
            {
              faden: "technologie",
              x: 292,
              y: 185,
              titel: "Ozeantaugliche Schiffe",
              kurz: "Seefahrt",
              jahr: "15. Jh.",
              text: "Karavelle, Kompass und Kanonen machen die Ozeane befahrbar. Der Beginn der europäischen Schifffahrt öffnet die Welt — und ebnet der Kolonialisierung den Weg.",
              mehr: "Ozeanfahrt war keine europäische Premiere: Schon 1405–1433 segelten Zheng Hes riesige chinesische Flotten bis Ostafrika, polynesische Seefahrer querten den Pazifik Jahrhunderte früher. Und Technik ist nie neutral: Dieselben Schiffe, die Entdeckungen ermöglichten, transportierten Eroberer und versklavte Menschen — die Verflechtung von Können und Machtinteresse ist bei Rechenzentren und KI-Chips heute nicht anders.",
            },
            {
              faden: "technologie",
              x: 445,
              y: 115,
              labelOben: true,
              titel: "Die Dampfmaschine",
              kurz: "Dampfmaschine",
              jahr: "1769",
              text: "Watts Dampfmaschine setzt erstmals Kraft frei, die nicht von Muskel, Wind oder Wasser stammt. Fabriken, Eisenbahnen und Städte wachsen — die Industrialisierung pflügt die Gesellschaft um.",
              mehr: "Mit der Dampfmaschine beginnt die Automatisierung: Maschinen übernehmen körperliche Arbeit, Menschen wandern in neue Rollen. Die KI setzt diese Linie bei der Kopf- und Sprachaufgabe fort — deshalb lohnt der Vergleich mit den Umbrüchen und Ängsten von damals.",
              verunsicherung:
                "Die Industrialisierung reisst die alte Gesellschaft auseinander: Landflucht, Kinderarbeit, Elendsquartiere im Schatten der Fabriken — 1848 entlädt sich die Spannung in Revolutionen quer durch Europa. In den Epochen unten zeigt die Industriemoderne, wie Marx den Umbruch begreift.",
            },
            {
              faden: "technologie",
              x: 575,
              y: 245,
              titel: "Der Computer",
              kurz: "Computer",
              jahr: "1941–45",
              text: "Im Schatten des Kriegs entstehen die ersten programmierbaren Rechner — Zuses Z3, Colossus, ENIAC. Turings Idee der universellen Maschine wird Wirklichkeit.",
              mehr: "Der Computer kreuzt hier den Ereignis-Faden: Er wird für Ballistik und Code-Knacken gebaut, nicht für den Alltag. Erst Jahrzehnte später wandert er auf Schreibtische und in Hosentaschen — und wird zur Grundlage von Internet und KI.",
            },
            {
              faden: "technologie",
              x: 600,
              y: 90,
              labelOben: true,
              titel: "Die Rakete",
              kurz: "Rakete",
              jahr: "1942–57",
              text: "Von der V2 des Kriegs zur Sputnik-Rakete des Kalten Kriegs: Dieselbe Technik trägt Sprengköpfe oder Satelliten. Die Rakete macht den Weltraum erreichbar.",
              mehr: "Kaum eine Technologie zeigt die Doppelgesichtigkeit deutlicher: Wernher von Brauns V2 tötete in London, seine Saturn V brachte Menschen zum Mond. Ob eine Technik Fluch oder Segen ist, entscheidet nicht die Technik — sondern der gesellschaftliche Faden, mit dem sie verwoben ist.",
            },
            {
              faden: "technologie",
              x: 650,
              y: 200,
              titel: "Internet & World Wide Web",
              kurz: "Internet",
              jahr: "1969–91",
              text: "Aus dem militärischen ARPANET (1969) wird das offene World Wide Web (1991). Information fliesst plötzlich weltweit, sofort und für alle — das grösste Medienereignis seit dem Buchdruck.",
              mehr: "Das Netz begann im Kalten Krieg und wurde durch Tim Berners-Lees WWW zur Alltagstechnik. Es lieferte die Daten, auf denen heutige KI trainiert — ohne Internet keine Sprachmodelle. Zugleich begann hier die algorithmische Sortierung der Aufmerksamkeit.",
            },
            {
              faden: "technologie",
              x: 708,
              y: 120,
              labelOben: true,
              titel: "KI wird öffentlich",
              kurz: "KI",
              jahr: "1956 → 2022",
              text: "Erfunden wurde die KI nicht 2022: Benannt und erforscht wird sie seit 1956 (Dartmouth-Konferenz). Mit GPT und ChatGPT tritt sie 2022 an die Öffentlichkeit — und wird alltäglich.",
              mehr: "Dazwischen liegen Jahrzehnte von Aufbrüchen und «KI-Wintern»: symbolische KI, Expertensysteme, statistisches Lernen, Deep Learning. 2022 änderte sich nicht die Erfindung, sondern der Zugang — ein Chatfenster machte KI für alle bedienbar. Alle Fäden laufen hier zusammen: die Technologielinie der Automatisierung, die Entdeckungslinie des Weltverstehens, die gesellschaftliche Frage, wer wir neben der Maschine sind — und die Praxen, in denen wir täglich mit ihr umgehen.",
              verunsicherung:
                "Bilder, Stimmen und Texte lassen sich täuschend echt erzeugen: Was ist noch echt, welche Fähigkeiten lohnen sich noch — und wer hat etwas gemacht: ich, die Maschine, beide? In den Epochen unten sucht «Jetzt: Umwelt & KI» nach der Schablone unserer Zeit.",
            },
            /* ── Faden: Entdeckungen ── */
            {
              faden: "entdeckungen",
              x: 160,
              y: 45,
              labelOben: true,
              titel: "Die Erde wird vermessen",
              kurz: "Erdumfang",
              jahr: "~240 v. Chr.",
              text: "Eratosthenes berechnet den Erdumfang — mit Schatten, Brunnen und Geometrie, erstaunlich genau. Die Welt wird messbar.",
              mehr: "Zwei Städte, ein Sonnenstand, ein Winkel: Aus einfachsten Beobachtungen erschliesst Eratosthenes die Grösse des Planeten. Die antike Entdeckung zeigt, was die neue Denk-Schablone — beobachten, ordnen, begründen — leisten kann.",
            },
            {
              faden: "entdeckungen",
              x: 205,
              y: 90,
              titel: "Die Null und das Stellenwertsystem",
              kurz: "Die Null",
              jahr: "Indien, ~500–700",
              text: "Indische Gelehrte machen die Null zur Zahl und schaffen das Stellenwertsystem — unsere heutigen Ziffern. Rechnen wird einfach genug für alle.",
              mehr: "Über arabische Gelehrte kam das System nach Europa — deshalb «arabische Ziffern». Al-Chwarizmi beschrieb es um 820 in Bagdad; aus seinem Namen wurde das Wort «Algorithmus». Ohne die indische Null keine Informatik: Auch der Computer rechnet mit Stellenwerten aus 0 und 1.",
            },
            {
              faden: "entdeckungen",
              x: 315,
              y: 255,
              titel: "Amerika — die Welt wird grösser",
              kurz: "Amerika",
              jahr: "1492",
              text: "Kolumbus erreicht Amerika — für Europa die Entdeckung einer neuen Welt, für deren Bewohner der Beginn der Eroberung. Das europäische Weltbild dehnt sich schlagartig.",
              mehr: "«Entdeckung» ist eine Perspektive: Aus Sicht der Anden- und Mittelamerika-Kulturen war es eine Invasion. Der Punkt liegt bewusst an der Kreuzung von Seefahrt (Technologie) und Kolonialisierung (Ereignis) — Entdeckungen kommen selten allein.",
            },
            {
              faden: "entdeckungen",
              x: 385,
              y: 150,
              titel: "Die Erde verliert die Mitte",
              kurz: "Heliozentrik",
              jahr: "1543",
              text: "Kopernikus setzt die Sonne ins Zentrum — die Erde ist nur noch ein Planet unter Planeten. Eine Kränkung des menschlichen Selbstbilds, die tief sitzt.",
              mehr: "Freud sprach später von drei Kränkungen des Menschen: Kopernikus (nicht Mittelpunkt des Alls), Darwin (nicht Krone der Schöpfung), Psychoanalyse (nicht Herr im eigenen Haus). Manche sehen in der KI eine vierte: nicht mehr allein im Denken.",
            },
            {
              faden: "entdeckungen",
              x: 498,
              y: 170,
              titel: "Die Evolution",
              kurz: "Evolution",
              jahr: "1859",
              text: "Darwins «Entstehung der Arten» reiht den Menschen in die Naturgeschichte ein. Nicht Krone der Schöpfung, sondern Ergebnis von Variation und Auslese.",
              mehr: "Die Evolutionstheorie verschob die Frage «Was ist der Mensch?» fundamental — mitten in die Industriemoderne hinein. Sie zeigt, wie eine wissenschaftliche Entdeckung gesellschaftliche und religiöse Gewissheiten erschüttern kann, lange bevor Technik daraus wird.",
            },
            {
              faden: "entdeckungen",
              x: 528,
              y: 240,
              labelOben: true,
              titel: "Die Kernspaltung",
              kurz: "Kernspaltung",
              jahr: "1938",
              text: "Hahn, Strassmann und Meitner spalten den Atomkern. Wenige Jahre später wird aus der Entdeckung die Bombe — Wissenschaft und Weltpolitik sind untrennbar verknotet.",
              mehr: "Kaum eine Entdeckung kreuzte den Ereignis-Faden so schnell und so folgenreich: 1938 Laborbefund, 1945 Hiroshima. Seither diskutiert die Wissenschaft ihre Verantwortung für das, was aus Erkenntnis gemacht wird — eine Debatte, die bei der KI in neuer Form geführt wird.",
            },
            /* ── Faden: kulturelle Praxen ── */
            {
              faden: "praxen",
              x: 30,
              y: 210,
              titel: "Ackerbau & Sesshaftigkeit",
              kurz: "Ackerbau",
              jahr: "Jungsteinzeit",
              text: "Menschen werden sesshaft, säen, ernten, lagern. Mit dem Ackerbau entstehen Dorf, Eigentum und Vorratshaltung — die Praxis, von der alle weiteren Fäden ausgehen.",
              mehr: "Die «neolithische Revolution» veränderte den Alltag tiefer als jede spätere Technik: Wer Vorräte hat, braucht Verwaltung, Schutz und Regeln. Aus der Praxis des Ackerbaus wachsen der Pflug (Technologie), die Schrift (Verwaltung!) und schliesslich Städte und Herrschaft.",
            },
            {
              faden: "praxen",
              x: 160,
              y: 250,
              titel: "Gewürz- und Seidenhandel",
              kurz: "Gewürzhandel",
              jahr: "ab ~100 v. Chr.",
              text: "Karawanen und Schiffe verbinden China, Indien, Arabien und Europa: Seide, Pfeffer, Zimt — und mit den Waren reisen Ideen, Techniken und Krankheiten.",
              mehr: "Handel ist eine kulturelle Praxis, die Welten verknüpft — eine frühe Form der Globalisierung: Papier, Schiesspulver und unsere Ziffern kamen über diese Routen nach Europa. Der Gewürzhandel wurde später zum Hauptmotiv der europäischen Seefahrt — hier kreuzen sich Praxis, Technologie und Ereignis.",
            },
            {
              faden: "praxen",
              x: 218,
              y: 258,
              labelOben: true,
              titel: "Das Haus der Weisheit",
              kurz: "Haus der Weisheit",
              jahr: "Bagdad, ~820",
              text: "Im Bagdader «Haus der Weisheit» übersetzen, sammeln und erweitern Gelehrte das Wissen Griechenlands, Persiens und Indiens. Wissenschaft als organisierte Praxis — Jahrhunderte vor Europas Universitäten.",
              mehr: "Hier wirkte al-Chwarizmi, dessen Rechenverfahren dem «Algorithmus» den Namen gaben. Die islamische Blütezeit bewahrte und verband das Wissen der Welt; über Übersetzerschulen wie Toledo floss es später nach Europa. Wissensgeschichte ist Weltgeschichte — und was in Archiven oder Trainingsdaten fehlt, verschwindet auch heute aus dem Blick.",
            },
            {
              faden: "praxen",
              x: 248,
              y: 190,
              labelOben: true,
              titel: "Die Universität",
              kurz: "Universitäten",
              jahr: "um 1200",
              text: "In Bologna, Paris und Oxford entsteht eine neue Praxis: gemeinsames, geregeltes Lernen und Streiten. Wissen bekommt einen eigenen Ort — und eigene Regeln.",
              mehr: "Die Universität institutionalisiert das Weiterreichen von Wissen über Generationen: Disputation, Prüfung, akademischer Grad. Praktiken, die bis heute prägen, wie Wissen anerkannt wird — eine Frage, die KI-generierte Texte gerade neu aufwerfen.",
            },
            {
              faden: "praxen",
              x: 400,
              y: 55,
              labelOben: true,
              titel: "Kaffeehaus-Öffentlichkeit",
              kurz: "Kaffeehäuser",
              jahr: "um 1700",
              text: "In den Kaffeehäusern von London und Paris diskutieren Bürger über Zeitungen, Politik und Wissenschaft. Es entsteht eine Öffentlichkeit ausserhalb von Hof und Kirche.",
              mehr: "Für den Preis einer Tasse Kaffee konnte man mitreden: Die Praxis des öffentlichen Räsonierens trug die Aufklärung. Heute übernehmen Plattformen und ihre Algorithmen diese Rolle der Öffentlichkeit — mit ganz eigenen Regeln, wer gehört wird.",
            },
            {
              faden: "praxen",
              x: 668,
              y: 255,
              labelOben: true,
              titel: "Grenzenloser Welthandel",
              kurz: "Welthandel",
              jahr: "ab 1990",
              text: "Container, Freihandelsabkommen und das Internet verflechten die Weltwirtschaft fast grenzenlos: Waren, Kapital und Daten zirkulieren rund um den Planeten. Es ist die jüngste und dichteste Form der Globalisierung.",
              mehr: "«Globalisierung» zieht sich als roter Faden durch den ganzen Teppich — Gewürzhandel, Kolonialisierung und Weltmission waren frühere Formen davon. Nach dem Ende des Kalten Kriegs erreichte sie eine neue Stufe: weltweite Lieferketten nahezu in Echtzeit. Auch die KI ist ihr Kind — global gesammelte Daten, Chips aus Taiwan, Rechenzentren überall und weltweit geteilte Antworten.",
            },
          ]}
        />
      </section>

      {/* Philosophie in Zeiten der Verunsicherung — acht Epochen, je 2 Bilder
          und 3 bewertbare Bausteine (Technologie, Verunsicherung, Philosophie) */}
      <section id="epochen" className="mt-xl max-w-5xl scroll-mt-24" aria-label="Philosophie in Zeiten der Verunsicherung">
        <AbschnittKopf bild="/art/philosophie-epochen.webp">
          <h2 className="text-headline-lg text-on-surface">
            Philosophie in Zeiten der Verunsicherung
          </h2>
          <p className="mt-sm max-w-4xl text-body-lg text-on-surface-variant">
            Der Teppich des Wandels hat die Verunsicherungs-Stopps markiert —
            hier folgt, wie die Philosophie jeweils geantwortet hat. Denn gerade
            in Zeiten der Verunsicherung braucht es neue Deutungen und
            Orientierungsmuster — und die liefert, oder erdenkt zumindest, die
            Philosophie. Sie arbeitet langsam und{" "}
            <strong className="text-on-surface">reflexiv</strong>, an
            Grundlagen, die sich nicht ständig ändern. Genau das macht sie
            wertvoll: Manchmal bringt schon eine{" "}
            <strong className="text-on-surface">neue Gewichtung grundlegender
            Lebenselemente</strong> mehr Klarheit als jede neue Technik.
          </p>
        </AbschnittKopf>
        <Ausklapptext
          className="mt-md max-w-4xl"
          titel="Mehr dazu: die wiederkehrenden Züge der Verunsicherung"
        >
          <p>
            Auffällig: In der westlichen Geschichte kehren dieselben Züge der
            Verunsicherung immer wieder, nur anders gewichtet —{" "}
            <strong className="text-on-surface">Beschleunigung</strong> durch
            Technik, <strong className="text-on-surface">Verstädterung</strong>,{" "}
            <strong className="text-on-surface">Automatisierung</strong> der
            Arbeit, <strong className="text-on-surface">Kapitalisierung</strong>{" "}
            des Lebens (was bezahlbar ist, wird aneigenbar),{" "}
            <strong className="text-on-surface">Individualisierung</strong>,{" "}
            <strong className="text-on-surface">Naturzerstörung</strong>, dazu die
            verschobene <strong className="text-on-surface">Deutungsmacht</strong>{" "}
            durch neue Medien und die{" "}
            <strong className="text-on-surface">Entwertung von Wissen und
            Können</strong>. Je nach Epoche trifft es andere Menschen besonders
            hart.
          </p>
        </Ausklapptext>
        <Aufgabe className="mt-md max-w-4xl">
          Klappe in jeder Epoche die drei Bausteine auf — Technologie,
          Verunsicherung, Philosophie —, lies sie einfach erklärt, und bewerte,
          was dich noch heute betrifft.
        </Aufgabe>
        <VerunsicherungsEpochen className="mt-lg" />
      </section>

      <SeitenNavigation
        zurueck={{
          href: "/lernen/lernseite-2/vorhang-auf",
          label: "Vorhang auf",
        }}
        weiter={{
          href: "/lernen/lernseite-2/das-orakel",
          label: "Das Orakel",
        }}
      />
    </AppLayout>
  );
}
