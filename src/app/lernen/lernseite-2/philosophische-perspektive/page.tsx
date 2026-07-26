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
import Denkwege from "./_components/Denkwege";
import DenkerHover from "../_components/DenkerHover";
import Abschnitt from "../_components/Abschnitt";
import AkkordeonGruppe from "../_components/AkkordeonGruppe";
import AktivitaetsKopf from "../_components/AktivitaetsKopf";

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
        <div className="mt-sm flex flex-wrap items-center gap-md">
          <h1 className="text-headline-xl text-on-surface">
            Philosophische Perspektive
          </h1>
          <AktivitaetsKopf />
        </div>
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
            Philosophie, die Halt gab. Öffne, was dich interessiert.
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
          { id: "denkwege", label: "Wege der Orientierung", prefixe: ["philosophische-perspektive:denkwege"] },
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
              Weisheit». Sie ist ein eigenes wissenschaftliches Fach, aber{" "}
              <strong className="text-on-surface">keine erfahrungswissenschaftliche
              Disziplin</strong> wie Physik oder Statistik, die mit Messdaten
              beweisen, wie etwas zusammenhängt. Philosophie prüft{" "}
              <strong className="text-on-surface">Grundbegriffe und Argumente</strong>{" "}
              und arbeitet dabei überwiegend nicht experimentell. Sie hilft uns,
              neu zu ordnen und zu verstehen, was der Wandel durcheinanderbringt.
            </p>
            <p>
              Darum geht es in diesem Modul vor allem um eine Frage, die mit der
              KI neu aufbricht.{" "}
              <strong className="text-on-surface">Was ist der Mensch?</strong>{" "}
              Lange galt er als der, der Wissen schafft, weitergibt und Neues
              erdenkt. Wenn nun eine Maschine schreibt, erklärt und gestaltet,
              gerät genau das ins Wanken, unser Denken und unsere Kreativität.
              Neu ist die Frage aber nicht. Sie wird in der Philosophie seit jeher
              gestellt.{" "}
              <DenkerHover
                name="Immanuel Kant"
                richtung="oben"
                bio="Immanuel Kant (1724 bis 1804), zentraler Denker der Aufklärung in Königsberg. Hauptwerk «Kritik der reinen Vernunft». Er ordnete die Philosophie um die Frage «Was ist der Mensch?»."
              />{" "}
              hat das prominent ausgesprochen und sie ins Zentrum gerückt.
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
      <AkkordeonGruppe>
      <Abschnitt
        id="teppich"
        className="mt-xl max-w-5xl"
        bild="/art/philosophie-teppich.webp"
        titel="Der Teppich des Wandels"
        prefixe={["philosophische-perspektive:teppich"]}
        vorschau={
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
        }
      >
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
              mehr: "Athen hatte gerade den langen Krieg gegen Sparta verloren, die Stadt war voller Misstrauen, als der siebzigjährige Sokrates vor gut fünfhundert Geschworene treten musste. Vorgeworfen wurde ihm, die Götter zu missachten und die Jugend zu verderben, dabei hatte er nur getan, was er immer tat, nämlich auf dem Marktplatz Feldherren, Handwerker und Politiker zu fragen, was Gerechtigkeit oder Tapferkeit eigentlich sei. Wer antwortete, verstrickte sich meist in Widersprüche, und genau das machte ihn gefährlich unbeliebt. Ein Fluchtplan seiner Freunde lag bereit, doch Sokrates blieb und trank den Giftbecher, weil er die Gesetze seiner Stadt nicht brechen wollte. Sein Schüler Platon schrieb die Verteidigungsrede nieder, und aus dem Skandalurteil wurde der Gründungsmoment der abendländischen Philosophie. Seither gehören beide zusammen, das beharrliche Fragen und der Mut, den es kostet.",
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
              mehr: "Rom galt als die ewige Stadt, seit rund achthundert Jahren hatte kein Feind sie eingenommen, dann standen 410 die Westgoten unter Alarich drei Tage lang plündernd in ihren Strassen. Die Nachricht lief durch das ganze Reich, der Gelehrte Hieronymus schrieb aus Bethlehem, mit dieser einen Stadt scheine der ganze Erdkreis unterzugehen. Der eigentliche Schlusspunkt kam leise, 476 setzte der Heerführer Odoaker den letzten weströmischen Kaiser ab, einen Jungen namens Romulus Augustulus, und schickte die Kaiserinsignien nach Konstantinopel. Viele Menschen merkten zunächst kaum einen Unterschied, doch über Jahrzehnte zerfielen Strassen, Wasserleitungen und Verwaltung, Städte schrumpften, Wissen ging verloren. Der Fall Roms zeigt, dass grosse Ordnungen selten mit einem Knall enden, sondern in einem langen Ausfransen, das die Menschen erst im Rückblick als Epochenbruch erkennen.",
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
              mehr: "Schon 1494 zogen Spanien und Portugal im Vertrag von Tordesillas eine Linie über den Atlantik und teilten die aussereuropäische Welt unter sich auf, gefragt wurde dort niemand. Eroberer wie Cortés und Pizarro stürzten die Reiche der Azteken und Inka, und das gelang nicht mit wenigen hundert Soldaten allein: Entscheidend waren zehntausende indigene Verbündete, die mit den Herrschern ihre eigenen Rechnungen offen hatten, Vermittlerinnen wie La Malinche, innere Machtkämpfe und die eingeschleppten Pocken, die mehr Menschen töteten als jede Waffe. Auf den Plantagen der Kolonien arbeiteten bald Millionen verschleppte Afrikanerinnen und Afrikaner, der transatlantische Sklavenhandel wurde zu einem Fundament des europäischen Reichtums. Es gab auch Widerspruch, der Mönch Bartolomé de Las Casas beschrieb die Gräuel und stritt vor dem spanischen Hof für die Rechte der Ureinwohner, durchgesetzt hat er sich nicht. So entstand eine Weltordnung, in der Europa jahrhundertelang bestimmte, wessen Sprache, Religion und Wissen zählt. Viele Länder tragen bis heute Grenzen, Sprachen und Ungleichheiten aus dieser Zeit.",
            },
            {
              faden: "ereignisse",
              x: 362,
              y: 215,
              titel: "Reformation",
              kurz: "Reformation",
              jahr: "1517",
              text: "Luthers Thesen spalten die Kirche. Der Buchdruck verbreitet sie in Windeseile. Eine neue Technologie und ein gesellschaftlicher Umbruch greifen ineinander.",
              mehr: "Auslöser war ein Geschäftsmodell, die Kirche verkaufte Ablassbriefe und finanzierte damit unter anderem den Petersdom in Rom. Nach kirchlicher Lehre erliessen sie nicht die Schuld, dafür blieb die Beichte zuständig, sondern die zeitliche Strafe für bereits vergebene Sünden. In der Verkaufspraxis verschwamm dieser Unterschied, und viele verstanden es schlicht als gekaufte Vergebung. Der Mönch und Professor Martin Luther wollte 1517 mit seinen 95 Thesen zunächst eine Gelehrtendebatte anstossen, doch Drucker vervielfältigten sie ohne sein Zutun, und innert Wochen kannte man sie im ganzen Reich. Als er 1521 vor Kaiser und Reichstag den Widerruf verweigerte, war aus dem Streit eine Bewegung geworden, die Fürsten, Städte und Bauern erfasste. In Zürich predigte fast gleichzeitig Huldrych Zwingli gegen die alten Bräuche, die Schweiz wurde zu einem Zentrum der Reformation und zugleich konfessionell gespalten. Aus der Frage, wer die Heilige Schrift auslegen darf, wurden Kriege, aber auch Schulen, Bibelübersetzungen und das Lesen in der Volkssprache. Wer heute fragt, wem man beim Deuten der Welt trauen soll, steht in einer sehr alten Debatte.",
            },
            {
              faden: "ereignisse",
              x: 425,
              y: 250,
              titel: "Das Erdbeben von Lissabon",
              kurz: "Lissabon",
              jahr: "1755",
              text: "Am Allerheiligentag zerstören Beben, Feuer und Flutwelle die fromme Stadt. Ganz Europa fragt: Wie kann ein gütiger Gott das zulassen?",
              mehr: "Am Morgen des 1. November 1755 sassen die Menschen in Lissabons vollen Kirchen, als die Erde mehrfach bebte, umstürzende Kerzen die Stadt entzündeten und eine Flutwelle die Fliehenden am Hafen traf. Zehntausende starben in einer der reichsten Städte Europas, die vom Kolonialhandel und vom Gold aus Brasilien lebte. Der Minister Pombal handelte nüchtern, liess die Toten bestatten, die Stadt erdbebensicher neu aufbauen und verschickte Fragebögen über den Ablauf des Bebens, ein Anfang der modernen Erdbebenforschung. Zugleich stritten die berühmtesten Köpfe der Zeit öffentlich über den Sinn der Katastrophe, Voltaire verspottete in «Candide» die Lehre, wir lebten in der besten aller möglichen Welten, Rousseau hielt dagegen, nicht Gott, sondern die eng und hoch gebaute Stadt habe so viele Opfer verursacht. Damit war eine neue Denkweise geboren, Katastrophen galten nicht mehr nur als Strafe, sondern als Ereignisse mit Ursachen, die man erforschen und deren Folgen man mindern kann.",
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
              mehr: "Der Staat war bankrott, das Brot teuer, und als König Ludwig XVI. 1789 erstmals seit 175 Jahren die Stände einberief, erklärten sich die Vertreter des dritten Standes kurzerhand zur Nationalversammlung. Der Sturm auf die Bastille am 14. Juli befreite zwar nur sieben Gefangene, wurde aber zum Zeichen, dass die alte Macht fallen kann. Wenige Wochen später verkündete die Versammlung die Menschen- und Bürgerrechte, Adelsprivilegien fielen, Frankreich probte eine Ordnung, in der Gesetze für alle gelten. Die Schriftstellerin Olympe de Gouges forderte 1791 dieselben Rechte auch für Frauen; 1793 wurde sie während des Terrors wegen ihrer politischen Schriften guillotiniert, wie der König und wie später Robespierre, der den Terror organisiert hatte. Die Revolution frass ihre eigenen Kinder und mündete in Napoleons Kaiserreich, doch ihre Ideen liessen sich nicht mehr einfangen. Fast jede heutige Verfassung, auch die schweizerische, trägt Spuren dieses Umbruchs.",
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
              mehr: "Dieser Krieg unterschied sich von allen früheren, er wurde mit Fabriken, Fahrplänen und Formularen geführt, und die Mehrheit seiner weit über fünfzig Millionen Toten waren Zivilistinnen und Zivilisten. Die Schoah, der organisierte Mord an sechs Millionen europäischen Jüdinnen und Juden, geschah nicht in einem Rückfall in wilde Vorzeiten, sondern mitten im Land der Dichter, Ingenieure und Beamten, mit Aktenzeichen und Zugfahrplänen. Genau das machte die Erschütterung so tief, Bildung und Technik hatten die Barbarei nicht verhindert, sie hatten sie effizienter gemacht. Nach 1945 versuchte die Welt, Lehren zu ziehen, in Nürnberg stand erstmals die Führungsriege eines Staates für «Verbrechen gegen die Menschlichkeit» vor einem internationalen Gericht, und die neu gegründete UNO beschloss 1948 die Allgemeine Erklärung der Menschenrechte. Die Philosophin Hannah Arendt, selbst vor den Nazis geflohen, beschrieb später, wie gewöhnlich und pflichtbewusst viele Täter wirkten, und prägte dafür das Wort von der «Banalität des Bösen». Seither weiss man, dass Fortschritt keine Richtung kennt und Verantwortung sich nicht an Systeme delegieren lässt.",
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
              mehr: "Der Wettlauf begann mit Schrecken für Amerika, 1957 zog der sowjetische Sputnik piepsend über den Nachthimmel, 1961 umkreiste Juri Gagarin als erster Mensch die Erde. Präsident Kennedy antwortete mit einem Versprechen, das damals vermessen klang, noch vor Ende des Jahrzehnts sollten Amerikaner den Mond betreten. Rund vierhunderttausend Menschen arbeiteten daraufhin am Apollo-Programm, von den Näherinnen der Raumanzüge bis zu Programmiererinnen wie Margaret Hamilton, deren Bordsoftware beim Landeanflug trotz Alarmmeldungen das Wichtigste zuerst rechnete. Am 20. Juli 1969 sahen rund 600 Millionen Menschen am Fernseher zu, wie Neil Armstrong die Leiter hinabstieg, eine grössere Live-Übertragung hatte es bis dahin nie gegeben. Der Bordcomputer der Mondfähre besass dabei weniger Rechenleistung als heute ein einfaches Mobiltelefon. Die Mondfahrt zeigt, was Gesellschaften technisch erreichen, wenn politischer Wille, Geld und die Angst vor dem Rivalen zusammenkommen.",
            },
            {
              faden: "ereignisse",
              x: 680,
              y: 150,
              titel: "Zusammenbruch der Sowjetunion",
              kurz: "Ende der UdSSR",
              jahr: "1991",
              text: "Der Ostblock zerfällt, der Kalte Krieg endet. Im selben Jahr geht die erste Website der Welt online. Die vernetzte, globalisierte Welt beginnt.",
              mehr: "Jahrzehntelang war die Welt in zwei bewaffnete Lager geteilt, mit Zehntausenden Atomsprengköpfen, geteilten Städten und Stellvertreterkriegen. Dann reformierte Michail Gorbatschow die Sowjetunion mit «Glasnost» und «Perestroika», also Offenheit und Umbau, und löste damit mehr aus, als er wollte. Im November 1989 genügte eine missverständliche Pressekonferenz in Ost-Berlin, und noch in derselben Nacht tanzten Menschen auf der Mauer, die 28 Jahre lang tödliche Grenze gewesen war. Zwei Jahre später scheiterte in Moskau ein Putsch der alten Garde, die Teilrepubliken erklärten sich unabhängig, und am 25. Dezember 1991 wurde die rote Fahne über dem Kreml eingeholt. Eine Supermacht verschwand ohne Krieg, einfach durch Auflösung, das hatte kaum jemand für möglich gehalten. Wer damals jung war, erlebte, wie schnell eine scheinbar ewige Weltordnung enden kann.",
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
              mehr: "Wer mit dem Grabstock arbeitete, lockerte den Boden Loch für Loch, ein Gespann mit Pflug zog dagegen in derselben Zeit ganze Furchenreihen durchs Feld. Erst diese Kraftverstärkung durch Ochsen machte Felder gross genug, um deutlich mehr zu ernten, als die eigene Familie ass. Von diesem Überschuss lebten die ersten Menschen, die selbst nicht mehr säten, Priester, Schreiber, Händler und Soldaten in den frühen Städten Mesopotamiens. Zugleich begann eine neue Ungleichheit, denn wer Zugtiere und gutes Land besass, wurde reicher als die anderen, und Besitz liess sich vererben. Jahrtausende später erschloss der schwere Räderpflug mit eiserner Schar die nassen Böden Nordeuropas und liess dort Dörfer und Städte wachsen. Am Pflug lässt sich darum ablesen, dass ein Werkzeug nie nur Arbeit erspart, sondern auch mitbestimmt, wem die Erträge gehören.",
            },
            {
              faden: "technologie",
              x: 78,
              y: 235,
              titel: "Das Rad",
              kurz: "Rad",
              jahr: "~3500 v. Chr.",
              text: "Töpferscheibe und Wagenrad entstehen in Mesopotamien und dem Schwarzmeerraum. Das Rad macht Lasten beweglich. Transport, Handel und Krieg verändern sich.",
              mehr: "Die eigentliche Erfindung war nicht die runde Scheibe, sondern das Zusammenspiel von Rad und Achse, das Reibung in Rollen verwandelt. Die ältesten Funde stammen aus dem 4. Jahrtausend vor Christus, das älteste erhaltene Exemplar wurde in einem Moor bei Ljubljana entdeckt, eine massive Holzscheibe, über fünftausend Jahre alt. Solche schweren Vollräder trugen Ochsenkarren mit Getreide, erst das leichte Speichenrad machte um 2000 vor Christus schnelle Streitwagen möglich, mit denen ganze Reiche erobert wurden. Ein Rad nützt allerdings wenig ohne Wege, deshalb wuchsen mit den Wagen auch Strassen, Brücken und Raststationen, ein frühes Beispiel dafür, dass Technik immer Infrastruktur nach sich zieht. So veränderte eine drehende Scheibe, wie weit Waren, Armeen und Nachrichten reisen konnten.",
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
              mehr: "Am Anfang standen Zählsteine und Ritzzeichen, mit denen Tempelverwalter in Uruk festhielten, wer wie viel Gerste oder wie viele Schafe abgeliefert hatte. Aus den Bildzeichen wurde die Keilschrift, in feuchten Ton gedrückt, und mit ihr entstand ein neuer Beruf, der Schreiber, der seine Kunst in jahrelanger Schule lernte und damit zu einer kleinen Elite gehörte. Bald speicherte die Schrift nicht mehr nur Vorräte, sondern Verträge, Gesetze wie die Stele des Hammurabi und Geschichten wie das Gilgamesch-Epos, das älteste grosse Erzählwerk der Menschheit. Interessant ist, dass schon damals gewarnt wurde, Platon überliefert die Sorge, wer schreibe, verlasse sich auf tote Zeichen und übe sein Gedächtnis nicht mehr. Die Klage klingt vertraut, sie begleitet seither jede Technik, die dem Kopf Arbeit abnimmt, vom Taschenrechner bis zur KI.",
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
              mehr: "Der Beamte Cai Lun am chinesischen Kaiserhof soll Rinde, Hanf, Lumpen und alte Fischernetze zerstampft und daraus einen glatten, billigen Beschreibstoff geschöpft haben. China hütete das Verfahren lange, der Überlieferung nach gelangte es nach einer verlorenen Schlacht im Jahr 751 mit gefangenen Papiermachern nach Samarkand und von dort in die islamische Welt. In Europa schrieb man derweil auf Pergament aus Tierhaut, für eine einzige grosse Bibel brauchte es die Häute einer ganzen Herde, Bücher waren entsprechend Schätze. Erst ab dem Spätmittelalter klapperten auch hier Papiermühlen, in Basel etwa ab dem 15. Jahrhundert, und der Preis des geschriebenen Worts sank Stufe um Stufe. Jede dieser Stufen entschied mit, wer sich Wissen leisten konnte. Billiges Speichermaterial war die stille Voraussetzung jeder Medienrevolution, vom Papier bis zu den Datenspeichern der Gegenwart.",
            },
            {
              faden: "technologie",
              x: 262,
              y: 130,
              titel: "Kompass und Schiesspulver",
              kurz: "Kompass",
              jahr: "China, ~1000",
              text: "Chinesische Seefahrer navigieren mit der Magnetnadel. Über arabische und indische Händler erreicht sie Europa. Ohne Kompass keine Ozeanfahrt.",
              mehr: "Die Magnetnadel diente in China zuerst gar nicht der Seefahrt, mit magnetischen Löffeln richteten Wahrsager Häuser und Gräber günstig aus, bevor Kapitäne der Song-Zeit die Nadel mit aufs Meer nahmen. Auch das Schiesspulver entstand als Nebenprodukt, daoistische Alchemisten suchten ein Mittel für langes Leben und fanden ein Gemisch, das brannte und knallte, zuerst für Feuerwerk, bald für Waffen. Über Händler und die Feldzüge der Mongolen wanderten beide Erfindungen westwärts, wo Kanonen die Burgmauern der Ritter entwerteten und die Macht zu Königen mit grossen Heeren verschoben. Der englische Philosoph Francis Bacon schrieb um 1620, drei Erfindungen hätten das Gesicht der Welt verändert, Buchdruck, Schiesspulver und Kompass, und ahnte nicht, dass alle drei Wurzeln in China hatten. Was eine Erfindung bewirkt, entscheidet sich eben erst dort, wo sie ankommt und wozu man sie einsetzt.",
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
              mehr: "Johannes Gutenberg war ein Geschäftsmann in Mainz, der um 1450 Stempel, Presse und Metallguss zu einem System verband, mit dem sich Seiten beliebig oft setzen und drucken liessen. Seine erste grosse Bibel war noch so teuer wie ein Bauernhof, und weil ihn das Projekt fast ruinierte, verlor er die Werkstatt im Streit mit seinem Geldgeber. Die Idee aber war nicht mehr aufzuhalten, innert fünfzig Jahren standen Druckereien in über zweihundert Städten Europas, auch in Basel, das zu einer berühmten Druckerstadt wurde. Plötzlich konnte eine einzelne Streitschrift ein ganzes Land erreichen, Luther nutzte das siebzig Jahre später. Wer vorher wissen wollte, was wahr ist, fragte einen Priester; jetzt lasen die Leute selbst, verglichen selbst und stritten selbst.",
            },
            {
              faden: "technologie",
              x: 292,
              y: 185,
              titel: "Ozeantaugliche Schiffe",
              kurz: "Seefahrt",
              jahr: "15. Jh.",
              text: "Karavelle, Kompass und Kanonen machen die Ozeane befahrbar. Der Beginn der europäischen Schifffahrt öffnet die Welt und ebnet der Kolonialisierung den Weg.",
              mehr: "Der portugiesische Prinz Heinrich der Seefahrer liess im 15. Jahrhundert systematisch Küsten erkunden, Karten sammeln und Schiffe verbessern, so entstand die Karavelle, die mit ihren dreieckigen Segeln auch gegen den Wind kreuzen konnte. Damit wagten sich Seeleute erstmals planmässig auf offene Ozeanrouten, auf denen man wochenlang kein Land sah und nach Sternen und Kompass steuerte. Dabei war Europa spät dran, die chinesischen Flotten des Admirals Zheng He waren schon Jahrzehnte zuvor mit Schiffen bis Ostafrika gesegelt, gegen die eine Karavelle winzig wirkte, doch der Kaiserhof brach die teuren Fahrten ab und verbot die Hochseefahrt. In Europa dagegen konkurrierten viele Königreiche, wer eine neue Route fand, wurde reich, also rüsteten alle weiter. So entschied nicht das beste Schiff über den Lauf der Geschichte, sondern die Frage, welche Gesellschaft ihre Schiffe wohin schickte und wozu.",
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
              mehr: "James Watt war Instrumentenmacher in Glasgow und sollte 1764 ein Modell der alten Newcomen-Pumpe reparieren, dabei erkannte er, wie viel Energie sie verschwendete, und fand mit dem separaten Kondensator den entscheidenden Verbesserungstrick. Mit dem Unternehmer Matthew Boulton machte er daraus ein Geschäft, Boulton soll einem Besucher gesagt haben, er verkaufe hier, was alle Welt begehre, nämlich Kraft. Um Kunden zu überzeugen, rechnete Watt die Leistung seiner Maschinen in ersetzte Pferde um, daher stammt die Pferdestärke. Fabriken mussten nun nicht mehr an Bächen liegen, sie rückten in die Städte, und ab 1830 zogen Dampflokomotiven Menschen und Waren in einem Tempo übers Land, das kein Pferdegespann durchhielt. Kraft war damit zur Ware geworden, messbar, kaufbar und beliebig vermehrbar. Hier beginnt die Geschichte, in der Maschinen Schritt für Schritt Arbeit übernehmen, deren jüngstes Kapitel die KI schreibt.",
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
              mehr: "Konrad Zuse begann im Wohnzimmer seiner Eltern in Berlin, Rechenmaschinen zu bauen, und vollendete 1941 mit der Z3 aus gebrauchten Telefonrelais den ersten frei programmierbaren Rechner, der wenige Jahre später bei einem Luftangriff zerstört wurde. In Grossbritannien half der geheime Röhrenrechner Colossus, verschlüsselte deutsche Funksprüche zu knacken, seine Existenz blieb noch Jahrzehnte nach dem Krieg Staatsgeheimnis. Der amerikanische ENIAC wog rund dreissig Tonnen, füllte einen Saal und rechnete Flugbahnen für die Artillerie. Dabei war «Computer» damals noch eine Berufsbezeichnung für Menschen, meist Frauen, die im Akkord von Hand rechneten, und es waren sechs von ihnen, die den ENIAC programmierten. Die gedankliche Grundlage hatte Alan Turing schon 1936 gelegt, mit der Idee einer einzigen Maschine, die jede berechenbare Aufgabe ausführen kann, wenn man ihr Programm wechselt. Genau diese Universalität steckt heute in jedem Handy, jedem Auto und jedem KI-Modell.",
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
              mehr: "Die V2 war die erste Rakete, die den Rand des Weltraums erreichte, und zugleich eine Terrorwaffe, die auf London und Antwerpen fiel. In der unterirdischen Fabrik Mittelbau-Dora mussten KZ-Häftlinge sie zusammenbauen, bei der Produktion starben mehr Menschen als durch die Einschläge der Raketen. Nach 1945 sicherten sich die Siegermächte die Ingenieure und Baupläne, Wernher von Braun ging mit seinem Team in die USA, die Sowjetunion setzte auf Sergei Koroljow, der Stalins Lager überlebt hatte. Die Rakete, die 1957 den Sputnik in die Umlaufbahn trug, war eigentlich als Interkontinentalrakete für Atomsprengköpfe entwickelt worden. Dass dieselben Triebwerke Zerstörung oder Forschung tragen können, machte die Rakete zum Lehrstück über Technik und Verantwortung.",
            },
            {
              faden: "technologie",
              x: 650,
              y: 200,
              titel: "Internet & World Wide Web",
              kurz: "Internet",
              jahr: "1969–93",
              text: "Aus dem militärischen ARPANET (1969) wird das World Wide Web: 1989 als Vorschlag, 1991 als erste Website, 1993 vom CERN zur freien Nutzung freigegeben. Information fliesst plötzlich weltweit, sofort und für alle. Das ist das grösste Medienereignis seit dem Buchdruck.",
              mehr: "Die erste Nachricht im ARPANET wurde am 29. Oktober 1969 von Los Angeles nach Stanford geschickt, geplant war das Wort «LOGIN», nach zwei Buchstaben stürzte die Verbindung ab, übertragen war nur «LO». Aus dem Forschungsnetz weniger Universitäten wuchs über zwei Jahrzehnte ein weltweiter Verbund, doch er blieb ein Werkzeug für Fachleute. Den entscheidenden Schritt machte Tim Berners-Lee am CERN, sein Vorschlag von 1989 für ein Netz aus verknüpften Seiten trug den Vermerk seines Vorgesetzten, das sei vage, aber aufregend. So lief die erste Website der Welt auf einem Rechner bei Genf. Entscheidend war schliesslich, dass das CERN 1993 den Web-Standard zur freien Nutzung freigab, niemand musste Lizenzgebühren zahlen, und genau deshalb konnte das Netz explodieren. Offenheit war hier keine Nebensache, sondern der Bauplan des Erfolgs.",
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
              mehr: "Im Sommer 1956 lud der junge Mathematiker John McCarthy eine Handvoll Forscher ans Dartmouth College ein und gab dem Feld seinen Namen, künstliche Intelligenz; der Antrag versprach kühn, ein Sommer mit zehn Leuten werde entscheidende Fortschritte bringen. Es dauerte dann Jahrzehnte länger, mit Durchbrüchen und Enttäuschungen im Wechsel. Sichtbar wurde der Fortschritt zuerst in Spielen, 1997 schlug der Rechner Deep Blue den Schachweltmeister Garri Kasparow, 2016 besiegte AlphaGo den Go-Meister Lee Sedol mit einem Zug, den Fachleute zuerst für einen Fehler hielten. Der eigentliche Bruch kam am 30. November 2022, als ChatGPT freigeschaltet wurde, innert fünf Tagen meldeten sich eine Million Menschen an, nach zwei Monaten waren es rund hundert Millionen, schneller als je bei einer Anwendung zuvor. Erstmals konnte jede und jeder mit einer KI einfach reden. Damit wanderte eine Laborfrage mitten in Schulzimmer, Büros und Werkstätten.",
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
              mehr: "Eratosthenes leitete die berühmte Bibliothek von Alexandria und trug den Spitznamen «Beta», weil er in vielen Fächern der Zweitbeste war, in keinem der Erste. Er wusste aus Berichten, dass die Mittagssonne im südlichen Syene zur Sommersonnenwende senkrecht steht, während sie in Alexandria zur selben Stunde um ein Fünfzigstel eines Vollkreises schräg einfällt. Also brauchte er nur noch die Distanz zwischen beiden Städten, die geschulte Schrittzähler abgemessen hatten, und multiplizierte sie mit fünfzig. Je nach angenommener Länge des antiken Längenmasses lag sein Ergebnis nur wenige Prozent neben dem heutigen Wert. Ausgerechnet Kolumbus rechnete anderthalb Jahrtausende später mit einem viel zu kleinen Erdumfang, sonst hätte er die Fahrt nach Westen wohl nie gewagt. Gute Messungen können Weltbilder tragen, und falsche können Weltgeschichte machen.",
            },
            {
              faden: "entdeckungen",
              x: 205,
              y: 90,
              titel: "Die Null und das Stellenwertsystem",
              kurz: "Die Null",
              jahr: "Indien, ~500–700",
              text: "Indische Gelehrte machen die Null zur Zahl und schaffen das Stellenwertsystem, unsere heutigen Ziffern. Rechnen wird einfach genug für alle.",
              mehr: "Der indische Gelehrte Brahmagupta beschrieb im Jahr 628 Regeln, wie man mit der Null rechnet, damit war das Nichts zur vollwertigen Zahl geworden, eine Idee, auf die weder Griechen noch Römer gekommen waren. Wie stark sie ist, zeigt ein Vergleich, die Jahreszahl 1888 braucht in römischer Schreibweise dreizehn Zeichen, im Stellenwertsystem vier. Mit römischen Zahlen konnte kaum jemand schriftlich multiplizieren, man schob Steinchen auf Rechenbrettern; mit den neuen Ziffern genügten Feder und Papier. Der Kaufmannssohn Leonardo Fibonacci lernte das System im Mittelmeerhandel kennen und warb 1202 in seinem «Liber Abaci» dafür. Es dauerte trotzdem Jahrhunderte, Florenz etwa verbot die neuen Ziffern zeitweise in Kontobüchern, weil man Fälschungen fürchtete. Am Ende setzte sich die Schreibweise durch, mit der heute alle Welt rechnet und ohne die kein Computer Daten in Nullen und Einsen speichern würde.",
            },
            {
              faden: "entdeckungen",
              x: 315,
              y: 255,
              titel: "Amerika, die Welt wird grösser",
              kurz: "Amerika",
              jahr: "1492",
              text: "Kolumbus erreicht Amerika. Für Europa ist es die Entdeckung einer neuen Welt, für deren Bewohner der Beginn der Eroberung. Das europäische Weltbild dehnt sich schlagartig.",
              mehr: "Kolumbus suchte gar keinen neuen Kontinent, er wollte den Seeweg nach Indien und zu dessen Gewürzen finden und hielt die Erde für deutlich kleiner, als sie ist. Bis zu seinem Tod bestand er darauf, in Asien gewesen zu sein, weshalb die Bewohner der Karibik «Indios» genannt wurden. Dass es sich um eine für Europa neue Weltgegend handelte, sprach der Seefahrer Amerigo Vespucci aus, nach ihm beschriftete ein Kartenmacher 1507 den Kontinent mit «America». Folgenreich war vor allem der Austausch der Lebenswelten, Mais, Kartoffel, Tomate und Kakao kamen nach Europa, Pferde, Weizen, Zuckerrohr und Krankheiten gelangten nach Amerika. Die bescheidene Kartoffel wurde später zum Grundnahrungsmittel in weiten Teilen Europas und veränderte auch die Schweizer Landwirtschaft. So steckt in jedem Teller Rösti ein Stück von 1492.",
            },
            {
              faden: "entdeckungen",
              x: 385,
              y: 150,
              titel: "Die Erde verliert die Mitte",
              kurz: "Heliozentrik",
              jahr: "1543",
              text: "Kopernikus setzt die Sonne ins Zentrum. Die Erde ist nur noch ein Planet unter Planeten. Eine Kränkung des menschlichen Selbstbilds, die tief sitzt.",
              mehr: "Nikolaus Kopernikus war Domherr in Frauenburg an der Ostsee und rechnete jahrzehntelang an seinem Sonnensystem, veröffentlicht wurde das Werk «De revolutionibus» erst 1543, in seinem Todesjahr. Ein vorsichtiger Herausgeber schob ungefragt ein Vorwort ein, das alles zur blossen Rechenhilfe erklärte, so blieb das Buch zunächst fast unbeachtet. Ernst wurde es, als Galileo Galilei ab 1609 mit dem Fernrohr Jupitermonde und die Phasen der Venus sah, also Dinge, die sich nicht um die Erde drehten; 1633 zwang ihn die Inquisition, seiner Überzeugung abzuschwören. Das Merkwürdige an dieser Revolution ist, dass sich im Alltag nichts änderte, die Sonne ging weiter auf und unter wie immer. Verschoben hat sich etwas im Kopf, der Mensch schaute nun von einem gewöhnlichen Planeten aus ins All statt aus dessen Mitte. Grosse Umbrüche beginnen manchmal unsichtbar, als neue Beschreibung derselben Welt.",
            },
            {
              faden: "entdeckungen",
              x: 498,
              y: 170,
              titel: "Die Evolution",
              kurz: "Evolution",
              jahr: "1859",
              text: "Darwins «Entstehung der Arten» reiht den Menschen in die Naturgeschichte ein. Nicht Krone der Schöpfung, sondern Ergebnis von Variation und Auslese.",
              mehr: "Als junger Mann segelte Charles Darwin fünf Jahre lang auf der «Beagle» um die Welt und sammelte Käfer, Fossilien und Finken, deren Schnäbel sich von Insel zu Insel unterschieden. Die Erklärung dafür trug er danach über zwanzig Jahre mit sich herum, ohne sie zu veröffentlichen, denn er wusste, wie sehr sie das fromme England treffen würde. Erst als der jüngere Forscher Alfred Russel Wallace ihm 1858 dieselbe Idee in einem Brief schickte, ging Darwin an die Öffentlichkeit, und die Erstauflage der «Entstehung der Arten» war am ersten Tag vergriffen. Im Buch selbst kam der Mensch fast nicht vor, nur ein einziger Satz deutete an, dass auch auf seine Herkunft Licht fallen werde. Gestritten wurde trotzdem sofort über den Affen im Stammbaum, berühmt wurde die Spottfrage an Darwins Verteidiger, ob er denn väterlicherseits oder mütterlicherseits vom Affen abstamme. Eine Idee ohne jede Maschine hatte genügt, um das Selbstbild einer Epoche zu erschüttern.",
            },
            {
              faden: "entdeckungen",
              x: 528,
              y: 240,
              labelOben: true,
              titel: "Die Kernspaltung",
              kurz: "Kernspaltung",
              jahr: "1938",
              text: "Otto Hahn und Fritz Strassmann finden im bestrahlten Uran ein Element, das dort nicht sein dürfte. Lise Meitner und Otto Frisch erklären den Befund: Der Atomkern ist gespalten. Wenige Jahre später wird daraus die Bombe. Wissenschaft und Weltpolitik sind untrennbar verknotet.",
              mehr: "Lise Meitner hatte drei Jahrzehnte in Berlin geforscht, als sie 1938 als Jüdin aus Deutschland fliehen musste, ihre Arbeit lief brieflich weiter. Im Dezember fand ihr Kollege Otto Hahn im bestrahlten Uran zu seiner Ratlosigkeit das viel leichtere Element Barium und schrieb ihr, vielleicht wisse sie eine Erklärung. Auf einem Winterspaziergang im schwedischen Exil rechnete Meitner mit ihrem Neffen Otto Frisch nach, der Kern war tatsächlich zerplatzt, und die frei werdende Energie passte genau zu Einsteins Formel. Den Nobelpreis dafür erhielt 1944 Hahn allein. Als man Meitner später für den Bau der Bombe gewinnen wollte, lehnte sie ab, sie wolle mit einer Bombe nichts zu tun haben. In ihrer Geschichte steckt beides, der Ruhm der Erkenntnis und die Frage, wem er zugerechnet wird und was daraus gemacht werden darf.",
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
              mehr: "Die ältesten Bauerndörfer entstanden im sogenannten Fruchtbaren Halbmond im Nahen Osten, wo Wildgetreide wuchsen, die sich zähmen liessen. In Siedlungen wie Çatalhöyük lebten Tausende Menschen Wand an Wand, man stieg über die Dächer in die Häuser. Bemerkenswert ist, was Skelettfunde zeigen, die ersten Bauern waren oft kleiner und kränker als die Jäger und Sammlerinnen vor ihnen, sesshaftes Leben bedeutete zunächst mehr Arbeit, einseitigere Nahrung und ansteckende Krankheiten in der Enge. Geblieben sind die Menschen trotzdem, denn wer ein volles Kornlager hatte, konnte schlechte Jahre überstehen, und musste zugleich bleiben, um es zu verteidigen. Auch in der Schweiz lässt sich diese Wende besichtigen, die Pfahlbaudörfer an Zürichsee und Bodensee gehören heute zum UNESCO-Welterbe. Mit dem Vorrat kam das Planen, und mit dem Planen eine neue Art, an morgen zu denken.",
            },
            {
              faden: "praxen",
              x: 160,
              y: 250,
              titel: "Gewürz- und Seidenhandel",
              kurz: "Gewürzhandel",
              jahr: "ab ~100 v. Chr.",
              text: "Karawanen und Schiffe verbinden China, Indien, Arabien und Europa: Seide, Pfeffer, Zimt. Und mit den Waren reisen Ideen, Techniken und Krankheiten.",
              mehr: "Kaum ein Händler reiste je die ganze Strecke von China ans Mittelmeer, die Waren wanderten in Etappen und wechselten in Oasenstädten wie Samarkand von Karawane zu Karawane. Unterwegs vervielfachte sich der Preis, in Rom klagte der Gelehrte Plinius, wie viel Gold das Reich Jahr für Jahr für Seide, Pfeffer und Weihrauch nach Osten abfliessen lasse. Wie kostbar Gewürze waren, zeigt das Jahr 410, als die Westgoten von Rom neben Gold und Silber auch dreitausend Pfund Pfeffer als Tribut verlangten. China hütete das Geheimnis der Seide über Jahrhunderte, der Legende nach schmuggelten schliesslich Mönche Seidenraupeneier in hohlen Wanderstäben nach Byzanz. Doch die Routen transportierten nicht nur Kostbares, 1347 erreichte über die Handelswege auch die Pest Europa und tötete binnen weniger Jahre einen grossen Teil der Bevölkerung. Vernetzung bringt Reichtum und Risiko in einem, diese Erfahrung ist viel älter als unsere Zeit.",
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
              mehr: "Bagdad war um das Jahr 800 eine der grössten und reichsten Städte der Welt, und seine Kalifen sammelten Bücher mit demselben Ehrgeiz wie Gold. Gesandte reisten bis nach Byzanz, um griechische Handschriften zu holen, und berühmte Übersetzer sollen für ihre Arbeit mit dem Gewicht der Bücher in Gold entlohnt worden sein. Hier arbeitete al-Chwarizmi, dessen Lehrbuch über das «al-dschabr» genannte Umformen von Gleichungen der Algebra den Namen gab, und aus seinem eigenen Namen wurde später das Wort «Algorithmus». Möglich machte den Betrieb auch das Papier, das über Samarkand in die Stadt gekommen war und Bücher erschwinglich machte. Als die Mongolen Bagdad 1258 eroberten, sollen die hineingeworfenen Bücher den Tigris dunkel gefärbt haben, so erzählten es die Chronisten. Wissenszentren sind kostbar und verletzlich zugleich, beides gehört zu ihrer Geschichte.",
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
              mehr: "Das Wort «universitas» bezeichnete ursprünglich keine Gebäude, sondern eine Genossenschaft, Lehrende und Lernende schlossen sich zusammen wie Handwerker in einer Zunft. Die Parallele war ernst gemeint, wer fertig war, wurde «Magister», also Meister, so wie in der Werkstatt auf den Lehrling der Geselle und der Meister folgte. In Bologna hatten sogar die Studenten das Sagen, sie stellten die Professoren an und belegten sie mit Bussen, wenn eine Vorlesung zu spät begann oder der Stoff nicht durchgenommen war. Kaiser und Päpste gewährten den Universitäten eigene Rechte, und weil überall auf Latein gelehrt wurde, zogen Studenten quer durch Europa von Schule zu Schule. Die Schweiz bekam ihre erste Universität 1460 in Basel. Dass Wissen dort entsteht, wo man fragt, streitet und geprüft wird, ist seither die Grundidee geblieben, egal wie sehr sich die Werkzeuge ändern.",
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
              mehr: "In London nannte man die Kaffeehäuser «Penny Universities», für einen Penny Eintritt bekam man ein Getränk, die neuesten Zeitungen und Gespräche mit Fremden über Handel, Politik und Wissenschaft. Jedes Haus hatte sein Stammpublikum, bei Lloyd's trafen sich Reeder und Kaufleute, aus ihren Geschäften rund um Schiffsladungen wurde eine der grössten Versicherungsbörsen der Welt. Die Obrigkeit erkannte die Sprengkraft sofort, König Karl II. wollte die Häuser 1675 als Orte der Gerüchte und des Aufruhrs schliessen lassen und musste den Erlass nach heftigem Widerstand zurücknehmen. Ganz offen war diese Öffentlichkeit allerdings nicht, Frauen blieben als Gäste meist ausgeschlossen, und wer arm war, hatte weder Zeit noch Penny. Neu war trotzdem das Prinzip, dass am Tisch das Argument zählen sollte und nicht der Stand. Jede Debatte darüber, wer heute in digitalen Räumen mitreden kann, verhandelt im Kern dasselbe.",
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
              mehr: "Den Anstoss gab ein amerikanischer Spediteur, Malcom McLean liess 1956 erstmals genormte Stahlkisten auf ein umgebautes Schiff heben, weil ihn das ewige Umladen von Hand ärgerte. Der Container senkte die Verladekosten auf einen Bruchteil, ganze Berufe am Hafen verschwanden, dafür wurde es plötzlich rentabel, auch billige Waren um die halbe Welt zu schicken. Nach dem Ende des Kalten Kriegs kam die Politik dazu, die Welthandelsorganisation entstand 1995, China trat 2001 bei und wurde zur «Fabrik der Welt». Seither steckt in einem einzigen Smartphone Arbeit aus Dutzenden Ländern, vom Kobalt aus dem Kongo über Chips aus Taiwan bis zur Software aus Amerika und Europa. Wie verletzlich das fein getaktete System ist, zeigte sich 2021, als ein einziges quer stehendes Containerschiff im Suezkanal tagelang einen Teil des Welthandels aufhielt. Grenzenlos heisst eben auch, dass eine Störung an einem Ort überall spürbar wird.",
            },
          ]}
        />
      </Abschnitt>

      {/* Philosophie in Zeiten der Verunsicherung — acht Epochen, je 2 Bilder
          und 3 bewertbare Bausteine (Technologie, Verunsicherung, Philosophie) */}
      <Abschnitt
        id="epochen"
        className="mt-xl max-w-5xl"
        bild="/art/philosophie-epochen.webp"
        titel="Philosophie in Zeiten der Verunsicherung"
        prefixe={["philosophische-perspektive:epochen"]}
        vorschau={
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
        }
      >
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
      </Abschnitt>

      {/* Wege der Orientierung — vier Bereiche der philosophischen Orientierung
          zur KI-Verunsicherung, als durchklickbare Slides (nach den Epochen) */}
      <Abschnitt
        id="denkwege"
        className="mt-xl max-w-5xl"
        bild="/art/philosophie-denkwege.webp"
        titel="Wege der Orientierung"
        prefixe={["philosophische-perspektive:denkwege"]}
        vorschau={
          <p className="mt-sm max-w-3xl text-body-lg text-on-surface-variant">
            Die Epochen haben gezeigt, dass die Philosophie in unsicheren Zeiten
            Orientierung gab. Sie liefert keine schnellen, bunten Antworten,
            sondern eine nüchterne Klärung. Peter Sloterdijk nennt sie eine
            Orientierungsdisziplin, die Verwirrung auf sichere Grundlagen
            zurückführt, und er spricht von der Farbe Grau, der Farbe des ruhigen,
            abwägenden Denkens. Genau das brauchen wir bei der KI, also Reflexion
            statt Aufregung und Zwischentöne statt Schwarz-Weiss.
          </p>
        }
      >
        <div className="mt-md space-y-sm text-body-lg text-on-surface-variant">
          <p>
            Zum Schluss kommen wir in die Gegenwart. Die Philosophie hilft hier
            nicht mit fertigen Rezepten, sondern mit Einordnung. Wir bündeln sie
            in <strong className="text-on-surface">vier Bereiche</strong>, und bei
            jedem steht am Ende dieselbe Frage: Was hilft mir diese Einordnung
            jetzt?
          </p>
          <p>
            Der erste Bereich fragt, was den Menschen im Kern ausmacht, unabhängig
            davon, ob eine KI es auch könnte, mit Aristoteles, Kant, Hegel, Arendt,
            Heidegger, Sloterdijk und Hustvedt. Der zweite erklärt, wie wir in
            komplexen Gesellschaften Orientierung finden, obwohl niemand mehr das
            Ganze überblickt, mit Latour und Nassehi. Der dritte zeigt, dass sich
            Mensch und Maschine nicht trennen lassen, und fragt nach Wegen der
            Zusammenarbeit oder der bewussten Abgrenzung, mit Latour, Haraway,
            Harari, Gabriel und dem japanischen «We-Turn» von Yasuo Deguchi. Der
            vierte fragt nach der Lebenskunst, wie man sein Leben tatsächlich
            ändern kann, mit den Stoikern, Foucault, Wilhelm Schmid, Nussbaum,
            Merleau-Ponty und Rosa.
          </p>
          <p>
            Wichtig bleibt der Blick auf das Wesentliche. Es geht nicht darum, was
            die Maschine dem Menschen abnimmt, sondern was Mensch und was Maschine
            im Kern ausmacht. Der Mensch kann anfangen und er urteilt. Die Maschine
            kann das nicht, dafür erkennt sie Muster in Daten, ob riesig oder
            klein. Du musst nicht jedem Bereich zustimmen. Geh sie durch,
            vergleiche und bewerte, welcher Zugang dir hilft.
          </p>
        </div>
        <Aufgabe className="mt-md">
          Geh die vier Bereiche der Reihe nach durch. Jeder fasst mehrere
          Denkerinnen und Denker zusammen und schliesst mit der Frage, was dir
          diese Einordnung jetzt hilft. Bewerte bei jedem, wie sehr dir der Zugang
          hilft, dich zu orientieren.
        </Aufgabe>
        <Denkwege className="mt-lg" spurKey="philosophische-perspektive:denkwege" />
        <p className="mt-lg max-w-3xl text-body-md text-on-surface-variant">
          Keine dieser Sichtweisen gibt ein fertiges Rezept. Aber jede öffnet einen
          begründeten Weg, sich neu zu orientieren. Genau dazu lädt dieses Lernset
          ein, sich wieder mehr mit Philosophie zu beschäftigen.
        </p>
      </Abschnitt>
      </AkkordeonGruppe>

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
