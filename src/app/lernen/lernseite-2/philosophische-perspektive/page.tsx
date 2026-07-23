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
import NeustartButton from "../_components/NeustartButton";

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
        <div className="mt-md max-w-3xl space-y-sm text-body-lg text-on-surface-variant">
          <p>
            Seit Jahrzehnten verändert die Digitalisierung, wie wir leben und
            arbeiten. Mit der KI zieht dieser Wandel noch einmal an. Was sich
            lange bewährt hat, wird plötzlich hinterfragt.{" "}
            <strong className="text-on-surface">Neue Berufe entstehen, andere
            verschwinden</strong>, und vertraute Abläufe werden umgestellt. Auch
            soziale Strukturen und Rollenbilder verschieben sich.
          </p>
          <p>
            Diese Seite will dem Verlorenen nicht nachtrauern. Sie stellt eine
            andere Frage.{" "}
            <strong className="text-on-surface">Was ist eigentlich neu, und was
            hat sich verändert?</strong> Sie schaut dabei immer zugleich zurück
            und auf heute. Besonders eine Frage bricht mit der KI neu auf, die
            Frage nach dem Menschen selbst.
          </p>
          <p>
            Der Weg dahin ist ein doppelter. Du webst den{" "}
            <strong className="text-on-surface">«Teppich des Wandels»</strong>{" "}
            und gehst durch <strong className="text-on-surface">acht Epochen</strong>.
            Jede Epoche hat eine neue Technik, eine Verunsicherung und die
            Philosophie, die Halt gab. Öffne, was dich interessiert. Und wie ist
            es heute, mit KI?
          </p>
        </div>
        <blockquote className="mt-md max-w-3xl border-l-4 border-tertiary pl-md">
          <p className="text-body-md italic text-on-surface-variant">
            «Die Eule der Minerva beginnt erst mit der einbrechenden Dämmerung
            ihren Flug.»
          </p>
          <footer className="mt-xs text-label-sm text-on-surface-variant">
            G. W. F. Hegel. Die Philosophie sieht nicht voraus. Sie begreift,
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
            Was ist Philosophie, und warum jetzt?
          </h2>
          <div className="mt-sm space-y-sm text-body-lg text-on-surface-variant">
            <p>
              Was ist Philosophie überhaupt? Wörtlich heisst sie «Liebe zur
              Weisheit». Sie ist <strong className="text-on-surface">keine
              strenge Wissenschaft</strong>, die mit Messdaten beweist, wie etwas
              zusammenhängt. Das tun Physik oder Statistik. Philosophie arbeitet
              stattdessen mit{" "}
              <strong className="text-on-surface">Ideen und Denkbildern</strong>.
              Sie hilft uns, neu zu ordnen und zu verstehen, was der Wandel
              durcheinanderbringt.
            </p>
            <p>
              Darum geht es in diesem Modul vor allem um eine Frage, die mit der
              KI neu aufbricht.{" "}
              <strong className="text-on-surface">Was ist der Mensch?</strong>{" "}
              Lange galt er als der, der Wissen schafft, weitergibt und Neues
              erdenkt. Wenn nun eine Maschine schreibt, erklärt und gestaltet,
              gerät genau das ins Wanken, unser Denken und unsere Kreativität.
              Neu ist die Frage aber nicht. Schon Immanuel Kant hat gefragt, was
              den Menschen eigentlich ausmacht.
            </p>
          </div>
        </AbschnittKopf>
        <Ausklapptext
          className="mt-md max-w-4xl"
          titel="Mehr dazu: Wie wir mit KI zusammenarbeiten"
        >
          <p>
            Die alte Aufteilung «hier der Mensch als{" "}
            <strong className="text-on-surface">Subjekt</strong>, dort die
            Maschine als <strong className="text-on-surface">Objekt</strong>»
            hilft hier nur bedingt. Denn wir stellen den Menschen nicht nur der
            KI gegenüber. Wir fragen auch, wie wir mit ihr{" "}
            <strong className="text-on-surface">zusammenarbeiten</strong> sollen.{" "}
            <strong className="text-on-surface">Netzwerk- und Systemtheorien</strong>{" "}
            setzen genau dort an. Sie schauen nicht auf einzelne «Täter» und
            blosse «Werkzeuge», sondern darauf, wie Menschen, Maschinen, Daten
            und Regeln in einer gemeinsamen Praxis zusammenwirken. Ein Beispiel
            macht das deutlich. Wer einen Text mit KI schreibt, ist weder allein
            Autorin noch bloss Nutzer. Mensch, Modell, Trainingsdaten und die
            eigene Eingabe bilden zusammen ein Netz, in dem der Text entsteht.
          </p>
        </Ausklapptext>
        <Aufgabe className="mt-md">Klappe die Punkte auf, die dich neugierig machen.</Aufgabe>
        <AkkordeonPosten
          className="mt-lg"
          spurKey="philosophische-perspektive:einstieg"
          begriff="Fragen"
          ariaLabel="Was ist Philosophie? Aufklappbare Punkte"
          glossar
          punkte={[
            {
              titel: "Sie beginnt mit Staunen und Zweifeln",
              text: "Schon Platon und Aristoteles sagten es: Am Anfang der Philosophie steht das Staunen. Gemeint ist das Innehalten vor dem, was eben noch selbstverständlich schien. Dazu kommt der Zweifel. Descartes' Satz «Ich denke, also bin ich» beginnt damit, alles anzuzweifeln, bis ein sicherer Punkt übrig bleibt. Das Staunen öffnet die Frage, der Zweifel prüft die Antwort.",
            },
            {
              titel: "Ihre Hauptfrage: Was ist der Mensch?",
              text: "Immanuel Kant bündelte die Philosophie in vier Fragen. Was kann ich wissen? Was soll ich tun? Was darf ich hoffen? Alle drei laufen laut Kant in einer vierten zusammen. Was ist der Mensch? Was uns auszeichnet, also Vernunft, Sprache, Bewusstsein und Freiheit, stand dabei immer im Zentrum.",
            },
            {
              titel: "Die KI stellt diese Frage neu und dringlich",
              text: "Wörtlich wird «Was ist der Mensch?» laut Google Trends kaum häufiger gesucht als früher. Aber in unzähligen Reden und Texten über KI kehrt die Frage in konkreter Form wieder. Müssen wir überhaupt noch selbst denken und schreiben? Wie verändert uns die tägliche Nutzung? Und welche Rolle bekommen wir neben der Maschine, eher anleitend, prüfend und verantwortend statt ausführend? So taucht die alte philosophische Frage nach dem Menschen mitten im Alltag neu auf.",
            },
            {
              titel: "Sie gibt keine Rezepte, sondern Orientierung",
              text: "Philosophie liefert keine Bedienungsanleitung und keine Prognose. Sie ordnet Begriffe, deckt verborgene Annahmen auf und wägt Gründe ab. So hilft sie zu klären, worüber wir eigentlich streiten. Hegels Bild der «Eule der Minerva» oben sagt, dass Verstehen oft erst im Rückblick kommt. Genau dieses Begreifen brauchen wir aber, um die Gegenwart zu gestalten.",
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
          <div className="mt-sm max-w-4xl space-y-sm text-body-lg text-on-surface-variant">
            <p>
              Der Teppich zeigt Ereignisse, die{" "}
              <strong className="text-on-surface">technologisch</strong>,{" "}
              <strong className="text-on-surface">gesellschaftlich</strong>,{" "}
              <strong className="text-on-surface">kulturell</strong> oder{" "}
              <strong className="text-on-surface">erfinderisch</strong> sind.
              Sie bilden vier Fäden, die nebeneinander durch die Zeit laufen,
              von Pflug, Rad und Schrift bis zur KI. Das Entscheidende ist ihre{" "}
              <strong className="text-on-surface">Wechselwirkung</strong>, denn
              sie hängen voneinander ab. Eisenbahn und Schifffahrt etwa hätten
              sich nie so verbreitet, wenn nicht auch kulturell das Interesse
              bestanden hätte, zu reisen, Handel zu treiben und neue Länder zu
              besitzen.
            </p>
            <p>
              Wozu das Ganze? Die Beschäftigung mit dem Teppich bereitet darauf
              vor, <strong className="text-on-surface">technologische
              Errungenschaften, Verunsicherungen der Gesellschaft und
              philosophische Orientierungsleistungen miteinander zu
              verknüpfen</strong>. An einigen Punkten wartet dafür ein{" "}
              <strong className="text-on-surface">Verunsicherungs-Stopp</strong>,
              der zur passenden Epoche weiter unten führt. Diese Verknüpfung
              leisten auch die <strong className="text-on-surface">Bilder</strong>.
              Bildende Kunst hilft neben der Philosophie, komplexe Zusammenhänge
              und Zeitphänomene in vereinfachter Form auszudrücken.
            </p>
          </div>
        </AbschnittKopf>
        <Aufgabe className="mt-md max-w-4xl">
          Tippe die Punkte an. Jeder erzählt seine Geschichte, und Stück für
          Stück webt sich der Teppich. Bewerte in jeder Karte, ob dir der Punkt
          bekannt war und wie relevant er für dein Leben ist. Erneutes Antippen
          wählt ihn wieder ab. Die Legende schaltet ganze Fäden an und aus.
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
              text: "Athen verurteilt seinen unbequemsten Frager zum Tod. Der Prozess zeigt eine Stadt in der Krise, hin- und hergerissen zwischen alter Ordnung und neuem Denken.",
              mehr: "Sokrates hatte nichts geschrieben, nur gefragt. Damit hat er Gewissheiten zersetzt. Sein Todesurteil machte ihn zur Gründungsfigur der Philosophie: Platon, sein Schüler, baute auf diesem Schock sein Werk auf.",
              verunsicherung:
                "Die alte, mythische Ordnung trägt nicht mehr, die Sophisten machen jede Wahrheit verhandelbar. Die Antike ist zutiefst verunsichert. In den Epochen unten zeigt die Antike, wie Aristoteles darauf antwortet: beobachten, ordnen, begründen.",
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
              mehr: "Die Kolonialisierung verband Technologie (Schiffe, Waffen, Kompass), Entdeckung (neue Kontinente aus europäischer Sicht) und Gewaltgeschichte. Sie ist die gewaltsame Seite der frühen Globalisierung. Ihre Folgen sind globale Handelswege, Ausbeutung und kulturelle Dominanz. Sie wirken bis in heutige Debatten über Wissensmacht und kulturellen Bias der KI nach.",
            },
            {
              faden: "ereignisse",
              x: 362,
              y: 215,
              titel: "Reformation",
              kurz: "Reformation",
              jahr: "1517",
              text: "Luthers Thesen spalten die Kirche. Der Buchdruck verbreitet sie in Windeseile. Eine neue Technologie und ein gesellschaftlicher Umbruch greifen ineinander.",
              mehr: "Ohne Buchdruck keine Reformation in dieser Wucht: Flugschriften machten aus einer Gelehrtendebatte eine Massenbewegung. Ein frühes Beispiel dafür, wie ein neues Medium bestimmt, welche Ideen sich durchsetzen. Das ist eine Frage, die sich bei Social-Media-Algorithmen und KI neu stellt.",
            },
            {
              faden: "ereignisse",
              x: 425,
              y: 250,
              titel: "Das Erdbeben von Lissabon",
              kurz: "Lissabon",
              jahr: "1755",
              text: "Am Allerheiligentag zerstören Beben, Feuer und Flutwelle die fromme Stadt. Ganz Europa fragt: Wie kann ein gütiger Gott das zulassen?",
              mehr: "Das Beben wurde zum Medienereignis der Aufklärung: Voltaire spottete über den «besten aller Welten»-Optimismus, Kant schrieb drei Abhandlungen über die Ursachen. Das war ein früher Schritt zur wissenschaftlichen Erdbebenkunde.",
              verunsicherung:
                "Mit der Stadt zerbricht der Glaube an einen gütigen Weltplan. In den Epochen unten zeigt die Aufklärung, wie daraus Kants Zumutung wird: Verlass dich nicht auf Autoritäten, sondern denke selbst.",
            },
            {
              faden: "ereignisse",
              x: 470,
              y: 80,
              labelOben: true,
              titel: "Französische Revolution",
              kurz: "Revolution",
              jahr: "1789",
              text: "Das Volk stürzt die alte Ordnung: Freiheit, Gleichheit, Brüderlichkeit. Die Ideen der Aufklärung werden politisch, mit Hoffnung und Terror zugleich.",
              mehr: "Die Revolution zeigt, wie Denken die Welt verändert: Kants «Habe Mut, dich deines eigenen Verstandes zu bedienen» wird zur politischen Sprengkraft. Zugleich mahnt ihr Umschlag in den Terror, dass Umbrüche Orientierung brauchen. Das ist genau das Thema dieser Seite.",
            },
            {
              faden: "ereignisse",
              x: 550,
              y: 125,
              labelOben: true,
              titel: "Zweiter Weltkrieg",
              kurz: "Weltkrieg",
              jahr: "1939–45",
              text: "Der industrialisierte Krieg und die Schoah erschüttern den Glauben an den Fortschritt im Kern. Zugleich treibt der Krieg Technologien voran, etwa Radar, Rakete und Computer.",
              mehr: "Turings Bombe entschlüsselt Enigma, in Deutschland rechnet Zuses Z3, in den USA entsteht ENIAC: Der Computer wird im Krieg geboren. Nach 1945 fragt die Philosophie neu, wie Zivilisation und Barbarei zusammengehen konnten. Und sie fragt, was Technik ohne Verantwortung anrichtet.",
            },
            {
              faden: "ereignisse",
              x: 622,
              y: 45,
              labelOben: true,
              titel: "Mondfahrt im Kalten Krieg",
              kurz: "Mondfahrt",
              jahr: "1969",
              text: "Im Wettlauf der Supermächte betreten Menschen den Mond. Die Mondfahrt ist Triumph der Technik und zugleich Machtdemonstration im Kalten Krieg.",
              mehr: "Sputnik (1957) löste den «Sputnik-Schock» aus, die Mondlandung (1969) antwortete darauf. Nebenprodukte des Wettlaufs wurden zu Grundlagen unserer digitalen Welt, etwa die Miniaturisierung, die Satelliten und das ARPANET als militärisches Forschungsnetz. Und das Foto der Erde aus dem All veränderte den Blick auf den Planeten.",
            },
            {
              faden: "ereignisse",
              x: 680,
              y: 150,
              titel: "Zusammenbruch der Sowjetunion",
              kurz: "Ende der UdSSR",
              jahr: "1991",
              text: "Der Ostblock zerfällt, der Kalte Krieg endet. Im selben Jahr wird das World Wide Web freigegeben. Die vernetzte, globalisierte Welt beginnt.",
              mehr: "1989 fällt die Mauer, 1991 löst sich die Sowjetunion auf. Manche riefen das «Ende der Geschichte» aus und meinten damit die endgültige Weltordnung. Rückblickend begann stattdessen ein neuer Umbruch: Globalisierung und Digitalisierung, deren Verunsicherungen wir heute mit der KI erleben.",
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
              text: "Der Pflug vervielfacht, was ein Feld hergibt. Mit ihm werden Überschüsse möglich und damit auch Städte, Arbeitsteilung und Herrschaft.",
              mehr: "Er entwickelte sich vom Grabstock zum Hakenpflug zum Räderpflug, unabhängig voneinander in Mesopotamien, Ägypten, Indien und China. Der Pflug ist das Urbild der Technologie: ein Werkzeug, das nicht nur Arbeit erleichtert, sondern die Gesellschaft umbaut, die es benutzt.",
            },
            {
              faden: "technologie",
              x: 78,
              y: 235,
              titel: "Das Rad",
              kurz: "Rad",
              jahr: "~3500 v. Chr.",
              text: "Töpferscheibe und Wagenrad entstehen in Mesopotamien und dem Schwarzmeerraum. Das Rad macht Lasten beweglich. Transport, Handel und Krieg verändern sich.",
              mehr: "Das Rad ist keine europäische Erfindung. Die ältesten Belege stammen aus Mesopotamien und dem Kaukasus. Bemerkenswert: Die Hochkulturen Amerikas kannten das Rad (an Spielzeugfiguren), nutzten es aber nicht für Transport, unter anderem mangels Zugtieren. Technik setzt sich nur durch, wo sie in Umwelt und Praxis passt.",
            },
            {
              faden: "technologie",
              x: 100,
              y: 70,
              labelOben: true,
              titel: "Die Schrift",
              kurz: "Schrift",
              jahr: "~3300 v. Chr.",
              text: "In Mesopotamien entsteht die Schrift, zuerst für Buchhaltung und Vorräte. Denken und Erinnern werden erstmals ausserhalb des Kopfes gespeichert.",
              mehr: "Die frühesten Keilschrifttafeln sind Verwaltungslisten: Getreide, Vieh, Schulden. Schrift entstand mehrfach unabhängig, in Mesopotamien, China und Mittelamerika. Die Anden-Kulturen speicherten stattdessen in Knotenschnüren (Quipus). Die Schrift eröffnet die Medienlinie dieses Teppichs. Buchdruck, Internet und KI setzen sie fort: Immer mehr Denken wandert in Dinge aus.",
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
              mehr: "Das Papier wanderte über die islamische Welt nach Europa. Papiermühlen gab es in Samarkand und Bagdad ab dem 8. Jahrhundert. Erst mit billigem Papier lohnte sich später der Buchdruck. Die Medienlinie dieses Teppichs ist eine Weltreise: Ägypten, China, Bagdad, Mainz.",
            },
            {
              faden: "technologie",
              x: 262,
              y: 130,
              titel: "Kompass und Schiesspulver",
              kurz: "Kompass",
              jahr: "China, ~1000",
              text: "Chinesische Seefahrer navigieren mit der Magnetnadel. Über arabische und indische Händler erreicht sie Europa. Ohne Kompass keine Ozeanfahrt.",
              mehr: "Auch Schiesspulver und der Druck mit beweglichen Lettern (Bi Sheng, ~1040) stammen aus China. Koreas «Jikji» (1377) ist das älteste erhaltene Buch aus Metalllettern. Viele «europäische Erfindungen» stehen auf den Schultern anderer Weltgegenden. Technikgeschichte ist Weltgeschichte.",
            },
            {
              faden: "technologie",
              x: 278,
              y: 60,
              labelOben: true,
              titel: "Der Buchdruck",
              kurz: "Buchdruck",
              jahr: "um 1450",
              text: "Gutenbergs bewegliche Lettern machen Wissen massenhaft kopierbar. Was bisher Klöstern und Höfen gehörte, kann sich nun verbreiten. Die Kontrolle über Wissen geht verloren und wird neu verteilt.",
              mehr: "Der Buchdruck gilt als Medienrevolution schlechthin: Er ermöglichte Reformation, Wissenschaft und Aufklärung. Jede spätere Medientechnik wie Zeitung, Radio, Internet und KI wiederholt seine Grundfrage: Wer darf sprechen, wer wird gehört, wer prüft die Wahrheit?",
            },
            {
              faden: "technologie",
              x: 292,
              y: 185,
              titel: "Ozeantaugliche Schiffe",
              kurz: "Seefahrt",
              jahr: "15. Jh.",
              text: "Karavelle, Kompass und Kanonen machen die Ozeane befahrbar. Der Beginn der europäischen Schifffahrt öffnet die Welt und ebnet der Kolonialisierung den Weg.",
              mehr: "Ozeanfahrt war keine europäische Premiere: Schon 1405–1433 segelten Zheng Hes riesige chinesische Flotten bis Ostafrika, polynesische Seefahrer querten den Pazifik Jahrhunderte früher. Und Technik ist nie neutral: Dieselben Schiffe, die Entdeckungen ermöglichten, transportierten Eroberer und versklavte Menschen. Die Verflechtung von Können und Machtinteresse ist bei Rechenzentren und KI-Chips heute nicht anders.",
            },
            {
              faden: "technologie",
              x: 445,
              y: 115,
              labelOben: true,
              titel: "Die Dampfmaschine",
              kurz: "Dampfmaschine",
              jahr: "1769",
              text: "Watts Dampfmaschine setzt erstmals Kraft frei, die nicht von Muskel, Wind oder Wasser stammt. Fabriken, Eisenbahnen und Städte wachsen. Die Industrialisierung pflügt die Gesellschaft um.",
              mehr: "Mit der Dampfmaschine beginnt die Automatisierung: Maschinen übernehmen körperliche Arbeit, Menschen wandern in neue Rollen. Die KI setzt diese Linie bei der Kopf- und Sprachaufgabe fort. Deshalb lohnt der Vergleich mit den Umbrüchen und Ängsten von damals.",
              verunsicherung:
                "Die Industrialisierung reisst die alte Gesellschaft auseinander: Landflucht, Kinderarbeit, Elendsquartiere im Schatten der Fabriken. 1848 entlädt sich die Spannung in Revolutionen quer durch Europa. In den Epochen unten zeigt die Industriemoderne, wie Marx den Umbruch begreift.",
            },
            {
              faden: "technologie",
              x: 575,
              y: 245,
              titel: "Der Computer",
              kurz: "Computer",
              jahr: "1941–45",
              text: "Im Schatten des Kriegs entstehen die ersten programmierbaren Rechner, etwa Zuses Z3, Colossus und ENIAC. Turings Idee der universellen Maschine wird Wirklichkeit.",
              mehr: "Der Computer kreuzt hier den Ereignis-Faden: Er wird für Ballistik und Code-Knacken gebaut, nicht für den Alltag. Erst Jahrzehnte später wandert er auf Schreibtische und in Hosentaschen. So wird er zur Grundlage von Internet und KI.",
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
              mehr: "Kaum eine Technologie zeigt die Doppelgesichtigkeit deutlicher: Wernher von Brauns V2 tötete in London, seine Saturn V brachte Menschen zum Mond. Ob eine Technik Fluch oder Segen ist, entscheidet nicht die Technik, sondern der gesellschaftliche Faden, mit dem sie verwoben ist.",
            },
            {
              faden: "technologie",
              x: 650,
              y: 200,
              titel: "Internet & World Wide Web",
              kurz: "Internet",
              jahr: "1969–91",
              text: "Aus dem militärischen ARPANET (1969) wird das offene World Wide Web (1991). Information fliesst plötzlich weltweit, sofort und für alle. Das ist das grösste Medienereignis seit dem Buchdruck.",
              mehr: "Das Netz begann im Kalten Krieg und wurde durch Tim Berners-Lees WWW zur Alltagstechnik. Es lieferte die Daten, auf denen heutige KI trainiert. Ohne Internet keine Sprachmodelle. Zugleich begann hier die algorithmische Sortierung der Aufmerksamkeit.",
            },
            {
              faden: "technologie",
              x: 708,
              y: 120,
              labelOben: true,
              titel: "KI wird öffentlich",
              kurz: "KI",
              jahr: "1956 → 2022",
              text: "Erfunden wurde die KI nicht 2022: Benannt und erforscht wird sie seit 1956 (Dartmouth-Konferenz). Mit GPT und ChatGPT tritt sie 2022 an die Öffentlichkeit und wird alltäglich.",
              mehr: "Dazwischen liegen Jahrzehnte von Aufbrüchen und «KI-Wintern»: symbolische KI, Expertensysteme, statistisches Lernen, Deep Learning. 2022 änderte sich nicht die Erfindung, sondern der Zugang. Ein Chatfenster machte KI für alle bedienbar. Alle Fäden laufen hier zusammen: die Technologielinie der Automatisierung, die Entdeckungslinie des Weltverstehens, die gesellschaftliche Frage, wer wir neben der Maschine sind, und die Praxen, in denen wir täglich mit ihr umgehen.",
              verunsicherung:
                "Bilder, Stimmen und Texte lassen sich täuschend echt erzeugen: Was ist noch echt, welche Fähigkeiten lohnen sich noch, und wer hat etwas gemacht: ich, die Maschine, beide? In den Epochen unten sucht «Jetzt: Umwelt & KI» nach der Schablone unserer Zeit.",
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
              text: "Eratosthenes berechnet den Erdumfang mit Schatten, Brunnen und Geometrie, erstaunlich genau. Die Welt wird messbar.",
              mehr: "Zwei Städte, ein Sonnenstand, ein Winkel: Aus einfachsten Beobachtungen erschliesst Eratosthenes die Grösse des Planeten. Die antike Entdeckung zeigt, was die neue Denk-Schablone leisten kann, nämlich beobachten, ordnen und begründen.",
            },
            {
              faden: "entdeckungen",
              x: 205,
              y: 90,
              titel: "Die Null und das Stellenwertsystem",
              kurz: "Die Null",
              jahr: "Indien, ~500–700",
              text: "Indische Gelehrte machen die Null zur Zahl und schaffen das Stellenwertsystem, unsere heutigen Ziffern. Rechnen wird einfach genug für alle.",
              mehr: "Über arabische Gelehrte kam das System nach Europa. Daher stammt der Name «arabische Ziffern». Al-Chwarizmi beschrieb es um 820 in Bagdad. Aus seinem Namen wurde das Wort «Algorithmus». Ohne die indische Null keine Informatik: Auch der Computer rechnet mit Stellenwerten aus 0 und 1.",
            },
            {
              faden: "entdeckungen",
              x: 315,
              y: 255,
              titel: "Amerika, die Welt wird grösser",
              kurz: "Amerika",
              jahr: "1492",
              text: "Kolumbus erreicht Amerika. Für Europa ist es die Entdeckung einer neuen Welt, für deren Bewohner der Beginn der Eroberung. Das europäische Weltbild dehnt sich schlagartig.",
              mehr: "«Entdeckung» ist eine Perspektive: Aus Sicht der Anden- und Mittelamerika-Kulturen war es eine Invasion. Der Punkt liegt bewusst an der Kreuzung von Seefahrt (Technologie) und Kolonialisierung (Ereignis). Entdeckungen kommen selten allein.",
            },
            {
              faden: "entdeckungen",
              x: 385,
              y: 150,
              titel: "Die Erde verliert die Mitte",
              kurz: "Heliozentrik",
              jahr: "1543",
              text: "Kopernikus setzt die Sonne ins Zentrum. Die Erde ist nur noch ein Planet unter Planeten. Eine Kränkung des menschlichen Selbstbilds, die tief sitzt.",
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
              mehr: "Die Evolutionstheorie verschob die Frage «Was ist der Mensch?» fundamental, und zwar mitten in die Industriemoderne hinein. Sie zeigt, wie eine wissenschaftliche Entdeckung gesellschaftliche und religiöse Gewissheiten erschüttern kann, lange bevor Technik daraus wird.",
            },
            {
              faden: "entdeckungen",
              x: 528,
              y: 240,
              labelOben: true,
              titel: "Die Kernspaltung",
              kurz: "Kernspaltung",
              jahr: "1938",
              text: "Hahn, Strassmann und Meitner spalten den Atomkern. Wenige Jahre später wird aus der Entdeckung die Bombe. Wissenschaft und Weltpolitik sind untrennbar verknotet.",
              mehr: "Kaum eine Entdeckung kreuzte den Ereignis-Faden so schnell und so folgenreich: 1938 Laborbefund, 1945 Hiroshima. Seither diskutiert die Wissenschaft ihre Verantwortung für das, was aus Erkenntnis gemacht wird. Das ist eine Debatte, die bei der KI in neuer Form geführt wird.",
            },
            /* ── Faden: kulturelle Praxen ── */
            {
              faden: "praxen",
              x: 30,
              y: 210,
              titel: "Ackerbau & Sesshaftigkeit",
              kurz: "Ackerbau",
              jahr: "Jungsteinzeit",
              text: "Menschen werden sesshaft, säen, ernten, lagern. Mit dem Ackerbau entstehen Dorf, Eigentum und Vorratshaltung. Das ist die Praxis, von der alle weiteren Fäden ausgehen.",
              mehr: "Die «neolithische Revolution» veränderte den Alltag tiefer als jede spätere Technik: Wer Vorräte hat, braucht Verwaltung, Schutz und Regeln. Aus der Praxis des Ackerbaus wachsen der Pflug (Technologie), die Schrift (Verwaltung!) und schliesslich Städte und Herrschaft.",
            },
            {
              faden: "praxen",
              x: 160,
              y: 250,
              titel: "Gewürz- und Seidenhandel",
              kurz: "Gewürzhandel",
              jahr: "ab ~100 v. Chr.",
              text: "Karawanen und Schiffe verbinden China, Indien, Arabien und Europa: Seide, Pfeffer, Zimt. Und mit den Waren reisen Ideen, Techniken und Krankheiten.",
              mehr: "Handel ist eine kulturelle Praxis, die Welten verknüpft. Er ist eine frühe Form der Globalisierung. Papier, Schiesspulver und unsere Ziffern kamen über diese Routen nach Europa. Der Gewürzhandel wurde später zum Hauptmotiv der europäischen Seefahrt. Hier kreuzen sich Praxis, Technologie und Ereignis.",
            },
            {
              faden: "praxen",
              x: 218,
              y: 258,
              labelOben: true,
              titel: "Das Haus der Weisheit",
              kurz: "Haus der Weisheit",
              jahr: "Bagdad, ~820",
              text: "Im Bagdader «Haus der Weisheit» übersetzen, sammeln und erweitern Gelehrte das Wissen Griechenlands, Persiens und Indiens. Das ist Wissenschaft als organisierte Praxis, Jahrhunderte vor Europas Universitäten.",
              mehr: "Hier wirkte al-Chwarizmi, dessen Rechenverfahren dem «Algorithmus» den Namen gaben. Die islamische Blütezeit bewahrte und verband das Wissen der Welt. Über Übersetzerschulen wie Toledo floss es später nach Europa. Wissensgeschichte ist Weltgeschichte. Und was in Archiven oder Trainingsdaten fehlt, verschwindet auch heute aus dem Blick.",
            },
            {
              faden: "praxen",
              x: 248,
              y: 190,
              labelOben: true,
              titel: "Die Universität",
              kurz: "Universitäten",
              jahr: "um 1200",
              text: "In Bologna, Paris und Oxford entsteht eine neue Praxis: gemeinsames, geregeltes Lernen und Streiten. Wissen bekommt einen eigenen Ort und eigene Regeln.",
              mehr: "Die Universität institutionalisiert das Weiterreichen von Wissen über Generationen: Disputation, Prüfung, akademischer Grad. Praktiken, die bis heute prägen, wie Wissen anerkannt wird. Das ist eine Frage, die KI-generierte Texte gerade neu aufwerfen.",
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
              mehr: "Für den Preis einer Tasse Kaffee konnte man mitreden: Die Praxis des öffentlichen Räsonierens trug die Aufklärung. Heute übernehmen Plattformen und ihre Algorithmen diese Rolle der Öffentlichkeit, mit ganz eigenen Regeln, wer gehört wird.",
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
              mehr: "«Globalisierung» zieht sich als roter Faden durch den ganzen Teppich. Gewürzhandel, Kolonialisierung und Weltmission waren frühere Formen davon. Nach dem Ende des Kalten Kriegs erreichte sie eine neue Stufe: weltweite Lieferketten nahezu in Echtzeit. Auch die KI ist ihr Kind, mit global gesammelten Daten, Chips aus Taiwan, Rechenzentren überall und weltweit geteilten Antworten.",
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
            Der Teppich des Wandels hat die Verunsicherungs-Stopps markiert.
            Hier folgt, wie die Philosophie jeweils geantwortet hat. Denn gerade
            in Zeiten der Verunsicherung braucht es neue Deutungen und
            Orientierungsmuster. Und genau die liefert, oder erdenkt zumindest,
            die Philosophie. Sie arbeitet langsam und{" "}
            <strong className="text-on-surface">reflexiv</strong>, an
            Grundlagen, die sich nicht ständig ändern. Genau das macht sie
            wertvoll. Manchmal bringt schon eine{" "}
            <strong className="text-on-surface">neue Gewichtung grundlegender
            Lebenselemente</strong> mehr Klarheit als jede neue Technik.
          </p>
        </AbschnittKopf>
        <Ausklapptext
          className="mt-md max-w-4xl"
          titel="Mehr dazu: die wiederkehrenden Züge der Verunsicherung"
        >
          <p>
            Auffällig ist, dass in der westlichen Geschichte dieselben Züge der
            Verunsicherung immer wiederkehren, nur anders gewichtet. Dazu gehören
            die <strong className="text-on-surface">Beschleunigung</strong> durch
            Technik, die <strong className="text-on-surface">Verstädterung</strong>,
            die <strong className="text-on-surface">Automatisierung</strong> der
            Arbeit und die{" "}
            <strong className="text-on-surface">Kapitalisierung</strong> des
            Lebens (was bezahlbar ist, wird aneigenbar). Dazu kommen die{" "}
            <strong className="text-on-surface">Individualisierung</strong>, die{" "}
            <strong className="text-on-surface">Naturzerstörung</strong>, die
            verschobene <strong className="text-on-surface">Deutungsmacht</strong>{" "}
            durch neue Medien und die{" "}
            <strong className="text-on-surface">Entwertung von Wissen und
            Können</strong>. Je nach Epoche trifft es andere Menschen besonders
            hart.
          </p>
        </Ausklapptext>
        <Aufgabe className="mt-md max-w-4xl">
          Klappe in jeder Epoche die drei Bausteine auf, also Technologie,
          Verunsicherung und Philosophie. Lies sie in der einfachen Erklärung,
          und bewerte, was dich noch heute betrifft.
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

      <NeustartButton
        className="mt-xl max-w-3xl"
        teile={["philosophische-perspektive", "video:philosophie"]}
        seitenName="Philosophische Perspektive"
      />
    </AppLayout>
  );
}
