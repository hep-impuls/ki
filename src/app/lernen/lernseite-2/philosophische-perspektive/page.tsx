import Link from "next/link";
import ActivityTracker from "@/components/ActivityTracker";
import AppLayout from "@/components/layout/AppLayout";
import { Signatur } from "../_components/Gewebe";
import VideoImpuls from "../_components/VideoImpuls";
import AkkordeonPosten from "../_components/AkkordeonPosten";
import HistorienTeppich from "../_components/HistorienTeppich";
import SchablonenZeitstrahl from "./_components/SchablonenZeitstrahl";

/**
 * Thema 02 — «Philosophische Perspektive».
 *
 * Kernstück: der Schablonen-Zeitstrahl (fünf Epochen — Bilder der Zeit,
 * Technische Errungenschaft, Verunsicherung, Philosophische
 * Orientierungshilfe), portiert aus der Sandbox-Werkstatt
 * (/sandbox/philosophie-schablonen, dort jetzt Redirect hierhin).
 */

export default function Lernseite2PhilosophischePerspektive() {
  return (
    <AppLayout>
      <ActivityTracker
        type="lesson_open"
        page="lernseite-2/philosophische-perspektive"
        lessonId="lernseite-2-philosophische-perspektive"
      />

      <Link
        href="/lernen/lernseite-2"
        className="inline-flex items-center gap-xs text-label-md text-on-surface-variant hover:text-on-surface transition-colors"
      >
        <span className="material-symbols-outlined text-[18px]">arrow_back</span>
        Zurück zu Lernseite 2
      </Link>

      <header className="mt-lg border-b border-outline-variant pb-lg">
        <div className="flex items-end justify-between gap-md">
          <div className="min-w-0">
            <p className="text-label-md uppercase tracking-wider text-tertiary">
              Thema 02 · Orientierung
            </p>
            <h1 className="mt-sm text-headline-xl text-on-surface">
              Philosophische Perspektive
            </h1>
            <p className="mt-sm max-w-3xl text-body-lg text-on-surface-variant">
              Technische Umbrüche verunsichern — das ist nicht neu. Der
              Zeitstrahl zeigt fünf Epochen, jede als eigenes Panel: zuerst die
              Bilder der Zeit, dann drei Bausteine zum Aufklappen —{" "}
              <strong>Technische Errungenschaft</strong>,{" "}
              <strong>Verunsicherung</strong> und{" "}
              <strong>Philosophische Orientierungshilfe</strong>. Sie sind
              aufeinander bezogen, lassen sich aber auch einzeln lesen. Öffne,
              was dich interessiert. Und heute, mit KI?
            </p>
          </div>
          <Signatur variante="epochen" className="hidden flex-shrink-0 sm:block" />
        </div>
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
      </header>

      {/* 0 — Einstieg: Was ist Philosophie? (erster Aktivitätsposten) */}
      <section className="mt-xl max-w-4xl" aria-label="Was ist Philosophie?">
        <h2 className="text-headline-lg text-on-surface">
          Was ist Philosophie — und warum jetzt?
        </h2>
        <p className="mt-sm text-body-lg text-on-surface-variant">
          Bevor wir in die Geschichte eintauchen: Was ist Philosophie überhaupt?
          Wörtlich heisst sie «Liebe zur Weisheit». Sie gibt keine fertigen
          Antworten wie eine Einzelwissenschaft, sondern stellt die
          grundlegenden Fragen — nach Wissen, Wahrheit, Recht, dem guten Leben
          und dem Menschen selbst — und prüft, wie wir sie begründen. Gerade
          heute, wo Maschinen sprechen, entscheiden und gestalten, brechen diese
          Fragen neu auf: Was ist der Mensch, wenn eine Maschine vieles ebenso
          gut kann? Philosophie hilft, im Umbruch Orientierung zu finden, statt
          der Technik nur hinterherzulaufen.{" "}
          <strong>Deine Aufgabe:</strong> Klappe die Punkte auf, die dich
          neugierig machen.
        </p>
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

      {/* Interaktives Muster der Seite: der historische Teppich — drei Fäden
          (Technologie, Entdeckungen, gesellschaftliche Ereignisse), die sich
          erst durchs Anklicken der Punkte einweben */}
      <section className="mt-xl max-w-5xl" aria-label="Der historische Teppich">
        <h2 className="text-headline-lg text-on-surface">
          Der historische Teppich
        </h2>
        <p className="mt-sm max-w-4xl text-body-lg text-on-surface-variant">
          Geschichte verläuft nicht als eine Linie von Epoche zu Epoche. Drei
          Fäden laufen nebeneinander durch die Zeit: <strong>Technologien</strong>,
          die eingeführt werden, <strong>Entdeckungen</strong>, die das Weltbild
          verschieben, und <strong>gesellschaftliche Ereignisse</strong>, die
          alles umwälzen — vom Fall Roms über die Kolonialisierung bis zur
          Mondfahrt. Manchmal kreuzen sich die Fäden, manchmal laufen sie
          allein. <strong>Deine Aufgabe:</strong> Tippe die Punkte an — jeder
          erzählt seine Geschichte, und Stück für Stück webt sich der Teppich.
        </p>
        <HistorienTeppich
          className="mt-lg"
          spurKey="philosophische-perspektive:teppich"
          punkte={[
            /* ── Faden: gesellschaftliche Ereignisse ── */
            {
              faden: "ereignisse",
              x: 50,
              y: 185,
              titel: "Der Fall Roms",
              kurz: "Fall Roms",
              jahr: "410/476",
              text: "Rom wird 410 geplündert, 476 endet das weströmische Reich. Für die Zeitgenossen wankt die Weltordnung selbst — eine Verunsicherung, auf die Augustinus mit der Wende nach innen antwortet.",
              mehr: "Der Zusammenbruch war ein langer Prozess aus Völkerwanderung, Wirtschaftskrise und innerem Zerfall. Wichtig für diese Seite: Aus der Erschütterung entstand eine neue Orientierung — Augustinus' «Gottesstaat» verlegte den Halt vom äusseren Reich in den inneren Menschen und prägte tausend Jahre Denken.",
            },
            {
              faden: "ereignisse",
              x: 170,
              y: 215,
              titel: "Kolonialisierung",
              kurz: "Kolonialisierung",
              jahr: "ab 1492",
              text: "Mit den neuen Schiffen greifen europäische Mächte über die Ozeane aus: Eroberung, Handel, Sklaverei. Der Reichtum Europas und das Leid ganzer Kontinente hängen am selben Faden.",
              mehr: "Die Kolonialisierung verband Technologie (Schiffe, Waffen, Kompass), Entdeckung (neue Kontinente aus europäischer Sicht) und Gewaltgeschichte. Ihre Folgen — globale Handelswege, Ausbeutung, kulturelle Dominanz — wirken bis in heutige Debatten über Wissensmacht und kulturellen Bias der KI nach.",
            },
            {
              faden: "ereignisse",
              x: 222,
              y: 115,
              titel: "Reformation",
              kurz: "Reformation",
              jahr: "1517",
              text: "Luthers Thesen spalten die Kirche — verbreitet in Windeseile durch den Buchdruck. Eine neue Technologie und ein gesellschaftlicher Umbruch greifen ineinander.",
              mehr: "Ohne Buchdruck keine Reformation in dieser Wucht: Flugschriften machten aus einer Gelehrtendebatte eine Massenbewegung. Ein frühes Beispiel dafür, wie ein neues Medium bestimmt, welche Ideen sich durchsetzen — eine Frage, die sich bei Social-Media-Algorithmen und KI neu stellt.",
            },
            {
              faden: "ereignisse",
              x: 335,
              y: 190,
              titel: "Französische Revolution",
              kurz: "Revolution 1789",
              jahr: "1789",
              text: "Das Volk stürzt die alte Ordnung: Freiheit, Gleichheit, Brüderlichkeit. Die Ideen der Aufklärung werden politisch — mit Hoffnung und Terror zugleich.",
              mehr: "Die Revolution zeigt, wie Denken die Welt verändert: Kants «Habe Mut, dich deines eigenen Verstandes zu bedienen» wird zur politischen Sprengkraft. Zugleich mahnt ihr Umschlag in den Terror, dass Umbrüche Orientierung brauchen — genau das Thema dieser Seite.",
            },
            {
              faden: "ereignisse",
              x: 462,
              y: 225,
              titel: "Zweiter Weltkrieg",
              kurz: "Zweiter Weltkrieg",
              jahr: "1939–1945",
              text: "Der industrialisierte Krieg und die Schoah erschüttern den Glauben an den Fortschritt im Kern. Zugleich treibt der Krieg Technologien voran — Radar, Rakete, Computer.",
              mehr: "Turings Bombe entschlüsselt Enigma, in Deutschland rechnet Zuses Z3, in den USA entsteht ENIAC: Der Computer wird im Krieg geboren. Nach 1945 fragt die Philosophie neu, wie Zivilisation und Barbarei zusammengehen konnten — und was Technik ohne Verantwortung anrichtet.",
            },
            {
              faden: "ereignisse",
              x: 555,
              y: 55,
              titel: "Mondfahrt im Kalten Krieg",
              kurz: "Mondfahrt",
              jahr: "1969",
              text: "Im Wettlauf der Supermächte betreten Menschen den Mond. Die Mondfahrt ist Triumph der Technik — und zugleich Machtdemonstration im Kalten Krieg.",
              mehr: "Sputnik (1957) löste den «Sputnik-Schock» aus, die Mondlandung (1969) antwortete darauf. Nebenprodukte des Wettlaufs — Miniaturisierung, Satelliten, das ARPANET als militärisches Forschungsnetz — wurden zu Grundlagen unserer digitalen Welt. Und das Foto der Erde aus dem All veränderte den Blick auf den Planeten.",
            },
            {
              faden: "ereignisse",
              x: 622,
              y: 185,
              titel: "Zusammenbruch der Sowjetunion",
              kurz: "Ende der UdSSR",
              jahr: "1991",
              text: "Der Ostblock zerfällt, der Kalte Krieg endet. Im selben Jahr wird das World Wide Web freigegeben — die vernetzte, globalisierte Welt beginnt.",
              mehr: "1989 fällt die Mauer, 1991 löst sich die Sowjetunion auf. Manche riefen das «Ende der Geschichte» aus — die endgültige Weltordnung. Rückblickend begann stattdessen ein neuer Umbruch: Globalisierung und Digitalisierung, deren Verunsicherungen wir heute mit der KI erleben.",
            },
            /* ── Faden: Technologie ── */
            {
              faden: "technologie",
              x: 120,
              y: 80,
              titel: "Der Buchdruck",
              kurz: "Buchdruck",
              jahr: "um 1450",
              text: "Gutenbergs bewegliche Lettern machen Wissen massenhaft kopierbar. Was bisher Klöstern und Höfen gehörte, kann sich nun verbreiten — Kontrolle über Wissen geht verloren und wird neu verteilt.",
              mehr: "Der Buchdruck gilt als Medienrevolution schlechthin: Er ermöglichte Reformation, Wissenschaft und Aufklärung. Jede spätere Medientechnik — Zeitung, Radio, Internet, KI — wiederholt seine Grundfrage: Wer darf sprechen, wer wird gehört, wer prüft die Wahrheit?",
            },
            {
              faden: "technologie",
              x: 160,
              y: 150,
              titel: "Ozeantaugliche Schiffe",
              kurz: "Seefahrt",
              jahr: "15. Jh.",
              text: "Karavelle, Kompass und Kanonen machen die Ozeane befahrbar. Der Beginn der europäischen Schifffahrt öffnet die Welt — und ebnet der Kolonialisierung den Weg.",
              mehr: "Technik ist nie neutral: Dieselben Schiffe, die Entdeckungen ermöglichten, transportierten Eroberer und versklavte Menschen. Die Verflechtung von technischem Können und Machtinteresse, die hier beginnt, ist bei Rechenzentren und KI-Chips heute nicht anders.",
            },
            {
              faden: "technologie",
              x: 310,
              y: 90,
              titel: "Die Dampfmaschine",
              kurz: "Dampfmaschine",
              jahr: "1769",
              text: "Watts Dampfmaschine setzt erstmals Kraft frei, die nicht von Muskel, Wind oder Wasser stammt. Fabriken, Eisenbahnen und Städte wachsen — die Industrialisierung pflügt die Gesellschaft um.",
              mehr: "Mit der Dampfmaschine beginnt die Automatisierung: Maschinen übernehmen körperliche Arbeit, Menschen wandern in neue Rollen. Die KI setzt diese Linie bei der Kopf- und Sprachaufgabe fort — deshalb lohnt der Vergleich mit den Umbrüchen und Ängsten von damals.",
            },
            {
              faden: "technologie",
              x: 475,
              y: 150,
              titel: "Der Computer",
              kurz: "Computer",
              jahr: "1941–1945",
              text: "Im Schatten des Kriegs entstehen die ersten programmierbaren Rechner — Zuses Z3, Colossus, ENIAC. Turings Idee der universellen Maschine wird Wirklichkeit.",
              mehr: "Der Computer kreuzt hier den Ereignis-Faden: Er wird für Ballistik und Code-Knacken gebaut, nicht für den Alltag. Erst Jahrzehnte später wandert er auf Schreibtische und in Hosentaschen — und wird zur Grundlage von Internet und KI.",
            },
            {
              faden: "technologie",
              x: 530,
              y: 80,
              titel: "Die Rakete",
              kurz: "Rakete",
              jahr: "1942–1957",
              text: "Von der V2 des Kriegs zur Sputnik-Rakete des Kalten Kriegs: Dieselbe Technik trägt Sprengköpfe oder Satelliten. Die Rakete macht den Weltraum erreichbar.",
              mehr: "Kaum eine Technologie zeigt die Doppelgesichtigkeit deutlicher: Wernher von Brauns V2 tötete in London, seine Saturn V brachte Menschen zum Mond. Ob eine Technik Fluch oder Segen ist, entscheidet nicht die Technik — sondern der gesellschaftliche Faden, mit dem sie verwoben ist.",
            },
            {
              faden: "technologie",
              x: 640,
              y: 150,
              titel: "Internet & World Wide Web",
              kurz: "Internet",
              jahr: "1969–1991",
              text: "Aus dem militärischen ARPANET (1969) wird das offene World Wide Web (1991). Information fliesst plötzlich weltweit, sofort und für alle — das grösste Medienereignis seit dem Buchdruck.",
              mehr: "Das Netz begann im Kalten Krieg und wurde durch Tim Berners-Lees WWW zur Alltagstechnik. Es lieferte die Daten, auf denen heutige KI trainiert — ohne Internet keine Sprachmodelle. Zugleich begann hier die algorithmische Sortierung der Aufmerksamkeit.",
            },
            {
              faden: "technologie",
              x: 698,
              y: 100,
              titel: "KI-Sprachmodelle",
              kurz: "KI",
              jahr: "2022",
              text: "Mit ChatGPT wird KI alltäglich: Eine Maschine schreibt, erklärt und gestaltet. Der jüngste Knoten im Teppich — und der Anlass dieser ganzen Lernumgebung.",
              mehr: "Alle drei Fäden laufen hier zusammen: die Technologielinie der Automatisierung, die Entdeckungslinie des Weltverstehens und die gesellschaftliche Frage, wer wir neben der Maschine sind. Welche Orientierung diese Zeit trägt, wird gerade erst geschrieben.",
            },
            /* ── Faden: Entdeckungen ── */
            {
              faden: "entdeckungen",
              x: 185,
              y: 195,
              titel: "Amerika — die Welt wird grösser",
              kurz: "Amerika",
              jahr: "1492",
              text: "Kolumbus erreicht Amerika — für Europa die Entdeckung einer neuen Welt, für deren Bewohner der Beginn der Eroberung. Das europäische Weltbild dehnt sich schlagartig.",
              mehr: "«Entdeckung» ist eine Perspektive: Aus Sicht der Anden- und Mittelamerika-Kulturen war es eine Invasion. Der Punkt liegt bewusst an der Kreuzung von Seefahrt (Technologie) und Kolonialisierung (Ereignis) — Entdeckungen kommen selten allein.",
            },
            {
              faden: "entdeckungen",
              x: 250,
              y: 60,
              titel: "Die Erde verliert die Mitte",
              kurz: "Heliozentrik",
              jahr: "1543",
              text: "Kopernikus setzt die Sonne ins Zentrum — die Erde ist nur noch ein Planet unter Planeten. Eine Kränkung des menschlichen Selbstbilds, die tief sitzt.",
              mehr: "Freud sprach später von drei Kränkungen des Menschen: Kopernikus (nicht Mittelpunkt des Alls), Darwin (nicht Krone der Schöpfung), Psychoanalyse (nicht Herr im eigenen Haus). Manche sehen in der KI eine vierte: nicht mehr allein im Denken.",
            },
            {
              faden: "entdeckungen",
              x: 385,
              y: 140,
              titel: "Die Evolution",
              kurz: "Evolution",
              jahr: "1859",
              text: "Darwins «Entstehung der Arten» reiht den Menschen in die Naturgeschichte ein. Nicht Krone der Schöpfung, sondern Ergebnis von Variation und Auslese.",
              mehr: "Die Evolutionstheorie verschob die Frage «Was ist der Mensch?» fundamental — mitten in die Industriemoderne hinein. Sie zeigt, wie eine wissenschaftliche Entdeckung gesellschaftliche und religiöse Gewissheiten erschüttern kann, lange bevor Technik daraus wird.",
            },
            {
              faden: "entdeckungen",
              x: 445,
              y: 195,
              titel: "Die Kernspaltung",
              kurz: "Kernspaltung",
              jahr: "1938",
              text: "Hahn, Strassmann und Meitner spalten den Atomkern. Wenige Jahre später wird aus der Entdeckung die Bombe — Wissenschaft und Weltpolitik sind untrennbar verknotet.",
              mehr: "Kaum eine Entdeckung kreuzte den Ereignis-Faden so schnell und so folgenreich: 1938 Laborbefund, 1945 Hiroshima. Seither diskutiert die Wissenschaft ihre Verantwortung für das, was aus Erkenntnis gemacht wird — eine Debatte, die bei der KI in neuer Form geführt wird.",
            },
          ]}
        />
      </section>

      {/* Video-Impuls nach dem Einstiegsmuster — YouTube-ID folgt (Prop videoId) */}
      <VideoImpuls
        className="mt-xl"
        spurId="video:philosophie"
        titel="Philosophie als Orientierung — fünf Epochen, vier Schablonen"
        beschreibung="Ein kurzer Input, bevor du in den Zeitstrahl eintauchst: Wie hat Philosophie schon viermal Orientierung gestiftet, wenn Technik die Welt verunsicherte?"
      />

      <section className="mt-xl max-w-3xl">
        <SchablonenZeitstrahl />
      </section>
    </AppLayout>
  );
}
