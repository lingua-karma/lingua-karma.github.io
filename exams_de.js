/* Lingua exam bank: German — same shape as exams_en.js, assembled by v93.js */
window.LINGUA_EXAMS = window.LINGUA_EXAMS || {};
window.LINGUA_EXAMS.de = {
easy: {
  vocab: [
    ['Apfel','تفاحة'],['Wasser','ماء'],['Brot','عيش'],['Milch','لبن'],['Reis','أرز'],['Ei','بيضة'],['Fisch','سمك'],['Fleisch','لحمة'],
    ['Haus','بيت'],['Schule','مدرسة'],['Buch','كتاب'],['Stift','قلم'],['Tisch','ترابيزة'],['Stuhl','كرسي'],['Tür','باب'],['Fenster','شباك'],
    ['Sonne','شمس'],['Mond','قمر'],['Stern','نجمة'],['Regen','مطر'],['Katze','قطة'],['Hund','كلب'],['Vogel','عصفورة'],['Pferd','حصان'],
    ['Mutter','أم'],['Vater','أب'],['Bruder','أخ'],['Schwester','أخت'],['Freund','صديق'],['Lehrer','مدرس'],['Arzt','دكتور'],['Student','طالب'],
    ['rot','أحمر'],['blau','أزرق'],['grün','أخضر'],['groß','كبير'],['klein','صغير'],['glücklich','سعيد'],['traurig','حزين'],['heiß','سخن']
  ],
  grammar: [
    {q:'Ich ___ Studentin.', opts:['bin','bist','ist','sind'], a:0},
    {q:'Du ___ aus Ägypten?', opts:['komme','kommst','kommt','kommen'], a:1},
    {q:'Sie ___ in Berlin.', opts:['wohne','wohnst','wohnt','wohnen'], a:2},
    {q:'Wir ___ glücklich.', opts:['bin','bist','ist','sind'], a:3},
    {q:'Sie (pl.) ___ Fußball.', opts:['spiele','spielst','spielt','spielen'], a:3},
    {q:'Das ist ___ Apfel.', opts:['ein','eine','einen','einem'], a:0},
    {q:'Ich trinke gern ___ Kaffee.', opts:['der','die','das','den'], a:3},
    {q:'Er ___ zwei Schwestern.', opts:['habe','hast','hat','haben'], a:2},
    {q:'___ du Deutsch?', opts:['Sprichst','Spricht','Spreche','Sprechen'], a:0},
    {q:'Meine Katze ___ weiß.', opts:['bin','bist','ist','sind'], a:2},
    {q:'Das Wetter ___ heute schön.', opts:['bin','bist','ist','sind'], a:2},
    {q:'___ heißt du? — Ich heiße Sara.', opts:['Wo','Wie','Wann','Wer'], a:1}
  ],
  fill: [
    {s:'___ ! (صباح الخير)', opts:['Gute Nacht','Guten Morgen','Guten Abend','Tschüss'], a:1},
    {s:'Wie ___ es dir? — Gut, danke.', opts:['geht','gehst','gehe','gehen'], a:0},
    {s:'Ich ___ an der Universität. (بدرس)', opts:['studiere','studierst','studiert','studieren'], a:0},
    {s:'Die Katze ist ___ dem Tisch. (تحت)', opts:['auf','unter','in','neben'], a:1},
    {s:'___ wohnst du? — In Assiut.', opts:['Wie','Wo','Wann','Wer'], a:1},
    {s:'Ich trinke jeden Morgen ___. (ماء)', opts:['Brot','Wasser','Reis','Fleisch'], a:1},
    {s:'Es gibt ___ Bücher auf dem Tisch. (تلاتة)', opts:['zwei','drei','vier','fünf'], a:1},
    {s:'___ Dank! (شكرًا كتير)', opts:['Vielen','Sehr','Viel','Ganz'], a:0},
    {s:'Wir gehen ___ Samstag zur Schule. (يوم)', opts:['am','im','um','zu'], a:0},
    {s:'Die Sonne ist ___. (سخنة)', opts:['kalt','heiß','grün','traurig'], a:1}
  ],
  passages: [
    {t:'Meine Familie', x:'Ich heiße Mona. Ich wohne in Kairo mit meiner Familie. Mein Vater ist Arzt und meine Mutter ist Lehrerin. Ich habe einen Bruder. Er heißt Omar. Er ist zehn Jahre alt. Wir haben eine kleine Katze. Sie heißt Lulu.',
     qs:[['Wo wohnt Mona?',['In Alexandria','In Kairo','In London','In Assiut'],1],
         ['Was ist ihre Mutter von Beruf?',['Ärztin','Ingenieurin','Lehrerin','Krankenschwester'],2],
         ['Wie heißt die Katze?',['Omar','Mona','Lulu','Kairo'],2]]},
    {t:'Ein Schultag', x:'Ali wacht um sieben Uhr auf. Er frühstückt mit seiner Schwester. Dann fährt er mit dem Bus zur Schule. Er hat jeden Tag fünf Stunden. Sein Lieblingsfach ist Englisch. Nach der Schule spielt er Fußball mit seinen Freunden.',
     qs:[['Wann wacht Ali auf?',['Um sechs','Um sieben','Um acht','Um neun'],1],
         ['Wie kommt er zur Schule?',['Mit dem Auto','Mit dem Zug','Mit dem Bus','Zu Fuß'],2],
         ['Was ist sein Lieblingsfach?',['Mathe','Arabisch','Naturkunde','Englisch'],3]]},
    {t:'Das Wetter', x:'Heute ist Freitag. Die Sonne ist heiß und der Himmel ist blau. Sara und ihre Freundin Huda gehen in den Park. Sie sitzen unter einem großen Baum. Sie essen Äpfel und trinken kaltes Wasser. Sie sind sehr glücklich.',
     qs:[['Welcher Tag ist heute?',['Sonntag','Freitag','Montag','Donnerstag'],1],
         ['Wohin gehen die Mädchen?',['Zur Schule','In den Park','An den Strand','In den Laden'],1],
         ['Was trinken sie?',['Tee','Saft','Milch','Kaltes Wasser'],3]]},
    {t:'Mein Zimmer', x:'Das ist mein Zimmer. Es ist klein, aber schön. Es gibt ein Bett, einen Schreibtisch und einen Stuhl. Meine Bücher sind auf dem Schreibtisch. Es gibt ein großes Fenster. Nachts kann ich den Mond von meinem Fenster sehen. Ich liebe mein Zimmer.',
     qs:[['Wie ist das Zimmer?',['Groß','Klein, aber schön','Kalt','Dunkel'],1],
         ['Wo sind die Bücher?',['Auf dem Bett','Unter dem Stuhl','Auf dem Schreibtisch','Im Fenster'],2],
         ['Was kann sie nachts sehen?',['Die Sonne','Den Mond','Vögel','Autos'],1]]}
  ],
  essays: [
    {p:'اكتبي ٣-٤ جمل عن نفسك بالألمانية (اسمك، سنك، بلدك، حاجة بتحبيها).', m:'Ich heiße Karma. Ich bin zwanzig Jahre alt. Ich komme aus Ägypten. Ich lerne gern Sprachen.', k:['heiße','Jahre','Ägypten','lerne']},
    {p:'اكتبي جملتين أو تلاتة عن عيلتك بالألمانية.', m:'Meine Familie ist klein. Mein Vater ist Ingenieur und meine Mutter ist Lehrerin. Ich habe eine Schwester.', k:['Familie','Vater','Mutter']},
    {p:'اكتبي عن يومك في الجامعة أو المدرسة بالألمانية (٣ جمل).', m:'Ich gehe jeden Tag zur Universität. Ich habe viele Vorlesungen. Ich lerne Deutsch nach den Vorlesungen.', k:['gehe','Universität','lerne']},
    {p:'اكتبي ٣ جمل عن أكلك المفضل بالألمانية.', m:'Mein Lieblingsessen ist Koschari. Das ist Reis, Nudeln und Linsen. Ich esse es jeden Freitag mit meiner Familie.', k:['Essen','Lieblingsessen','esse']},
    {p:'اكتبي ٣ جمل عن صاحبتك المقربة بالألمانية.', m:'Meine beste Freundin ist Maya. Sie ist nett und lustig. Wir lernen jede Woche zusammen.', k:['Freundin','sie','zusammen']}
  ]
},
medium: {
  vocab: [
    ['Reise','رحلة'],['Flughafen','مطار'],['Fahrkarte','تذكرة'],['Gepäck','شنط سفر'],['Reisepass','جواز سفر'],['Hotel','فندق'],['Strand','شاطئ'],['Museum','متحف'],
    ['Ingenieur','مهندس'],['Vorlesung','محاضرة'],['Abschluss','شهادة جامعية'],['Forschung','بحث علمي'],['Projekt','مشروع'],['Frist','موعد نهائي'],['Besprechung','اجتماع'],['Gehalt','مرتب'],
    ['nervös','متوتر'],['stolz','فخور'],['einsam','وحيد'],['dankbar','ممتن'],['neugierig','فضولي'],['ruhig','هادئ'],['wütend','غاضب'],['schüchtern','خجول'],
    ['Wetter','طقس'],['bewölkt','غائم'],['Sturm','عاصفة'],['Temperatur','درجة حرارة'],['Jahreszeit','فصل'],['Frühling','ربيع'],['Herbst','خريف'],['Winter','شتاء'],
    ['Gewohnheit','عادة'],['verbessern','يحسّن'],['Übung','تدريب'],['Fehler','غلطة'],['fließend','طليق'],['Akzent','لهجة'],['Wörterbuch','قاموس'],['Satz','جملة']
  ],
  grammar: [
    {q:'Ich wohne ___ 2015 in Kairo.', opts:['für','seit','von','bei'], a:1},
    {q:'Sie ist ___ als ihre Schwester.', opts:['groß','größer','am größten','mehr groß'], a:1},
    {q:'Wenn es regnet, ___ wir zu Hause.', opts:['bleiben','bleibten','geblieben','bleibst'], a:0},
    {q:'Ich ___ gestern diesen Film ___.', opts:['habe...gesehen','sehe','sah...sehen','habe...sehen'], a:0},
    {q:'Deutsch ___ in vielen Ländern gesprochen.', opts:['spricht','wird','sprach','sprechend'], a:1},
    {q:'Du ___ vor der Prüfung lernen.', opts:['solltest','wolltest','könntest','möchtest'], a:0},
    {q:'Ich habe meine Hausaufgaben ___ gemacht.', opts:['noch','schon','seit','für'], a:1},
    {q:'Sie ___ fern, als ich sie anrief.', opts:['sieht','sah','hat gesehen','sehend'], a:1},
    {q:'Das ist das ___ Buch, das ich je gelesen habe.', opts:['gut','besser','beste','am gut'], a:2},
    {q:'Er fragte mich, wo ich ___.', opts:['wohne','wohnt','wohnen','gewohnt'], a:0},
    {q:'Ich freue mich ___ dich.', opts:['über','auf','mit','von'], a:1},
    {q:'___ du Zeit hast, besuche mich.', opts:['Wenn','Als','Ob','Dass'], a:0}
  ],
  fill: [
    {s:'Ich lerne ___ zwei Jahren Deutsch.', opts:['seit','für','von','bei'], a:0},
    {s:'Sie interessiert sich ___ Musik.', opts:['an','für','auf','mit'], a:1},
    {s:'Die Vorlesung beginnt ___ zehn Uhr.', opts:['in','an','um','von'], a:2},
    {s:'Ich bin gut ___ Zeichnen.', opts:['in','im','am','für'], a:1},
    {s:'Wir sind früh ___ Flughafen angekommen.', opts:['im','am','zum','beim'], a:1},
    {s:'Sie hat sich ___ die Verspätung entschuldigt.', opts:['über','für','auf','von'], a:1},
    {s:'Ich kümmere mich freitags ___ meinen kleinen Bruder.', opts:['um','für','auf','über'], a:0},
    {s:'Mach bitte das Licht ___, wenn du gehst. (اطفي)', opts:['an','aus','auf','ab'], a:1},
    {s:'Er hat letztes Jahr mit dem Rauchen ___. (بطل)', opts:['angefangen','aufgehört','weitergemacht','begonnen'], a:1},
    {s:'Ich habe Angst ___ Spinnen.', opts:['von','vor','über','mit'], a:1}
  ],
  passages: [
    {t:'Im Ausland studieren', x:'Laila träumt davon, Ingenieurwesen in Deutschland zu studieren. Sie lernt jeden Abend zwei Stunden Deutsch. Es ist nicht leicht, aber sie gibt nie auf. Ihre Familie unterstützt ihren Traum. Nächstes Jahr macht sie die Sprachprüfung. Wenn sie besteht, bewirbt sie sich an drei Universitäten in Berlin.',
     qs:[['Was will Laila studieren?',['Medizin','Ingenieurwesen','Jura','Kunst'],1],
         ['Wie lange lernt sie jeden Abend?',['Eine Stunde','Zwei Stunden','Drei Stunden','Dreißig Minuten'],1],
         ['An wie vielen Universitäten bewirbt sie sich?',['Zwei','Drei','Vier','Fünf'],1]]},
    {t:'Ein neuer Job', x:'Omar hat einen neuen Job in einer großen Firma gefunden. Am ersten Tag ist er früh gekommen. Seine Kollegen sind nett und haben ihm geholfen. Sein Büro ist im dritten Stock. Er arbeitet von neun bis fünf Uhr. Abends kommt er müde, aber zufrieden nach Hause.',
     qs:[['Wann ist Omar am ersten Tag gekommen?',['Zu spät','Früh','Am Mittag','Am Abend'],1],
         ['Wie sind seine Kollegen?',['Gemein','Nett','Traurig','Wütend'],1],
         ['Wann hat er Feierabend?',['Um drei','Um vier','Um fünf','Um sechs'],2]]},
    {t:'Das Wochenende', x:'Am Samstagmorgen steht Nour spät auf. Sie macht Frühstück für ihre Familie. Am Nachmittag geht sie mit ihren Freundinnen ins Einkaufszentrum. Sie kaufen Kleidung und essen ein Eis. Am Abend schaut die ganze Familie zusammen einen Film zu Hause.',
     qs:[['Wann steht Nour auf?',['Früh','Spät','Um sechs','Um fünf'],1],
         ['Wohin geht sie am Nachmittag?',['In den Park','An den Strand','Ins Einkaufszentrum','Zur Universität'],2],
         ['Was macht die Familie am Abend?',['Sie schläft','Sie geht aus','Sie schaut einen Film','Sie kocht'],2]]},
    {t:'Der Markt', x:'Am Sonntag geht die Großmutter früh morgens zum Markt. Sie kauft frisches Gemüse, Obst und Fisch. Die Preise sind gut und die Verkäufer sind nett. Sie kommt mit zwei großen Taschen zurück. Mittags kocht sie ein großes Essen für die ganze Familie.',
     qs:[['Wann geht sie zum Markt?',['Am Abend','Am Morgen','Am Nachmittag','In der Nacht'],1],
         ['Was kauft sie nicht?',['Gemüse','Obst','Fisch','Kleidung'],3],
         ['Wie viele Taschen?',['Eine','Zwei','Drei','Vier'],1]]}
  ],
  essays: [
    {p:'اكتبي ٤ جمل عن حلمك للمستقبل بالألمانية.', m:'Mein Traum ist es, Ingenieurin zu werden. Ich will in einer großen Firma arbeiten. Ich werde viel lernen. Ich hoffe, ich schaffe es.', k:['Traum','Ingenieurin','lernen']},
    {p:'اكتبي عن رحلة عملتيها أو عايزة تعمليها بالألمانية (٤ جمل).', m:'Letzten Sommer habe ich Alexandria mit meiner Familie besucht. Wir sind im Meer geschwommen. Wir haben Fisch gegessen. Es war wunderschön.', k:['besucht','Meer','Familie']},
    {p:'اكتبي ٤ جمل عن يومك المعتاد بالألمانية (المضارع).', m:'Ich wache um sieben Uhr auf. Ich frühstücke. Ich fahre mit dem Bus zur Universität. Abends lerne ich und schlafe früh.', k:['wache','fahre','lerne']},
    {p:'اكتبي عن الفرق بين القاهرة وبلدك بالألمانية (٣-٤ جمل).', m:'Kairo ist eine große Stadt. Assiut ist kleiner und ruhiger. Ich mag Kairo wegen seiner Museen. Aber meine Stadt ist besser für die Familie.', k:['Stadt','ruhiger','mag']},
    {p:'اكتبي رسالة قصيرة لصاحبتك تدعيها على الغدا بالألمانية.', m:'Liebe Maya, ich lade dich am Samstag zum Mittagessen ein. Meine Mutter kocht Koschari. Komm um ein Uhr. Ich freue mich auf dich!', k:['lade','Mittagessen','Samstag']}
  ]
},
hard: {
  vocab: [
    ['Errungenschaft','إنجاز'],['Ehrgeiz','طموح'],['Ausdauer','مثابرة'],['Scheitern','فشل'],['Erfolg','نجاح'],['Herausforderung','تحدي'],['Gelegenheit','فرصة'],['Erfahrung','خبرة'],
    ['nachhaltige Entwicklung','تنمية مستدامة'],['Umwelt','بيئة'],['Verschmutzung','تلوث'],['Recycling','إعادة تدوير'],['Klima','مناخ'],['erneuerbare Energie','طاقة متجددة'],['Konsum','استهلاك'],['Verschwendung','هدر'],
    ['künstliche Intelligenz','ذكاء اصطناعي'],['Algorithmus','خوارزمية'],['Daten','بيانات'],['Netzwerk','شبكة'],['Cybersicherheit','أمن سيبراني'],['Innovation','ابتكار'],['Telearbeit','عمل عن بعد'],['digital','رقمي'],
    ['trotz','رغم'],['jedoch','ومع ذلك'],['dennoch','مع ذلك'],['folglich','وبالتالي'],['hingegen','على النقيض'],['während','بينما'],['fortan','من الآن فصاعدًا'],['einst','في الماضي'],
    ['vertiefen','يتعمق في'],['unterstützen','يدعم'],['in Frage stellen','يشكك في'],['hinauslaufen auf','يؤدي إلى'],['beitragen','يساهم'],['sich engagieren','يلتزم'],['beherrschen','يتقن'],['in Betracht ziehen','يفكر في']
  ],
  grammar: [
    {q:'Ich glaube nicht, dass er Recht ___.', opts:['hat','habe','hatte','haben wird'], a:1},
    {q:'Wenn ich Zeit hätte, ___ ich mehr.', opts:['würde lernen','werde lernen','lernte','lerne'], a:0},
    {q:'Es ist wichtig, dass du deine Hausaufgaben ___.', opts:['machst','machst du','machst nicht','machen'], a:0},
    {q:'Obwohl sie müde ___, lernt sie weiter.', opts:['ist','sei','war','sein wird'], a:0},
    {q:'Hier ist das Buch, ___ ich dir erzählt habe.', opts:['das','von dem','der','wo'], a:1},
    {q:'Sie sagte, sie ___ am nächsten Tag kommen.', opts:['wird','würde','kommt','kam'], a:1},
    {q:'Ich frage mich, ___ er kommt.', opts:['ob','dass','wann','warum'], a:0},
    {q:'Wenn ich ___ , rufe ich dich an.', opts:['ankommen werde','angekommen bin','ankomme','ankam'], a:1},
    {q:'Das ist die Stadt, in ___ ich geboren bin.', opts:['die','der','den','das'], a:1},
    {q:'Er arbeitet, ___ erfolgreich zu sein.', opts:['um','damit','ohne','statt'], a:0},
    {q:'Ich suche jemanden, ___ mir helfen kann.', opts:['der','die','dem','den'], a:0},
    {q:'Sie bereut, früh ___.', opts:['gegangen zu sein','gehen','geht','ging'], a:0}
  ],
  fill: [
    {s:'___ ihrer Mühe hat sie es nicht geschafft. (رغم)', opts:['Trotz','Dank','Wegen','Laut'], a:0},
    {s:'Es ist spät; ___ arbeite ich weiter. (ومع ذلك)', opts:['deshalb','dennoch','also','somit'], a:1},
    {s:'Je mehr du übst, ___ besser wirst du.', opts:['desto','weniger','sehr','zu'], a:0},
    {s:'___ ich weiß, ist sie nicht gekommen. (على حد علمي)', opts:['Soweit','Sobald','Solange','Seitdem'], a:0},
    {s:'Ich habe dir das Dokument geschickt, ___ du es prüfst. (عشان)', opts:['damit','um','ohne dass','bevor'], a:0},
    {s:'___ es regnet, findet das Spiel statt. (حتى لو)', opts:['Auch wenn','Obwohl','Es sei denn','Fernab davon'], a:0},
    {s:'Sie tat so, ___ nichts passiert wäre. (وكأن)', opts:['weil','als ob','sodass','sodass nicht'], a:1},
    {s:'Er hat ___ seiner Ausdauer Erfolg gehabt. (بفضل)', opts:['wegen','dank','mangels','trotz'], a:1},
    {s:'Ich wusste nicht, ___ ich vorgehen sollte. (إزاي أتصرف)', opts:['wie','warum','wann','wie viel'], a:0},
    {s:'___ das Ergebnis auch sei, ich bin stolz auf dich. (أيًا كان)', opts:['Was für','Was auch immer','Obwohl','Irgendein'], a:1}
  ],
  passages: [
    {t:'Mädchenbildung', x:'In vielen Ländern hat die Bildung von Mädchen die Gesellschaft verändert. Wenn Mädchen zur Schule gehen, verdienen sie später besser und ihre Kinder sind gesünder. Dennoch haben Millionen von Mädchen immer noch keinen Zugang zur Schule. Regierungen und Organisationen arbeiten zusammen, um das zu ändern. Bildung ist kein Luxus; sie ist ein Recht für alle.',
     qs:[['Was verändert die Bildung von Mädchen?',['Das Wetter','Die Gesellschaft','Das Essen','Die Mode'],1],
         ['Was verdienen gebildete Mädchen später?',['Besser','Weniger Geld','Mehr Kinder','Nichts'],0],
         ['Bildung wird beschrieben als...',['Ein Luxus','Ein Recht','Ein Problem','Ein Spiel'],1]]},
    {t:'Telearbeit', x:'Seit einigen Jahren hat die Telearbeit das Leben von Millionen Angestellten verändert. Von zu Hause zu arbeiten spart Zeit und ermöglicht mehr Momente mit der Familie. Dennoch fühlen sich manche isoliert und können Arbeit und Privatleben schwer trennen. Firmen suchen jetzt nach einer Balance: zum Beispiel zwei Tage im Büro und drei Tage zu Hause.',
     qs:[['Was ermöglicht Telearbeit?',['Zeitverlust','Zeitersparnis','Mehr Reisen','Im Büro schlafen'],1],
         ['Was ist ein Problem der Telearbeit?',['Der Lärm im Büro','Das Gefühl der Isolation','Das Gehalt','Die Besprechungen'],1],
         ['Welche Lösung suchen Firmen?',['Alles im Büro','Alles zu Hause','Eine Balance','Mehr Stunden'],2]]},
    {t:'Künstliche Intelligenz', x:'Künstliche Intelligenz gehört inzwischen zu unserem Alltag: Sie übersetzt Texte, empfiehlt Filme und hilft Ärzten bei der Diagnose von Krankheiten. Allerdings wirft sie auch wichtige Fragen auf. Wer ist verantwortlich, wenn eine Maschine einen Fehler macht? Und was wird aus den Jobs, die Roboter ersetzen? Experten sind sich in einem Punkt einig: Es braucht klare Regeln, damit die Technologie dem Menschen dient.',
     qs:[['Wie hilft die KI Ärzten?',['Beim Allein-Operieren','Bei der Diagnose von Krankheiten','Beim Sprechen mit Patienten','Beim Verkauf von Medikamenten'],1],
         ['Welche Frage wird aufgeworfen?',['Der Preis von Computern','Die Verantwortung für Fehler','Die Internetgeschwindigkeit','Die Bildschirmgröße'],1],
         ['Worüber sind sich Experten einig?',['KI stoppen','Klare Regeln','Mehr Roboter','Weniger Ärzte'],1]]},
    {t:'Minimalismus', x:'Müde davon, zu viele Dinge zu besitzen, hat Inès beschlossen, ihr Leben zu ändern. Sie hat die Hälfte ihrer Kleidung verschenkt und ihre alten Möbel verkauft. Heute ist ihre Wohnung fast leer, aber sie fühlt sich freier. «Ich kaufe nichts mehr ohne nachzudenken», sagt sie. Ihrer Meinung nach kommt Glück nicht von den Dingen, die man besitzt, sondern von den Erlebnissen, die man erlebt, und den Menschen, die man liebt.',
     qs:[['Was hat Inès mit ihrer Kleidung gemacht?',['Weggeworfen','Die Hälfte verschenkt','Versteckt','Gezählt'],1],
         ['Wie fühlt sie sich jetzt?',['Trauriger','Freier','Reicher','Müder'],1],
         ['Woher kommt Glück ihrer Meinung nach?',['Von Dingen','Vom Geld','Von Erlebnissen und Menschen','Von Möbeln'],2]]}
  ],
  essays: [
    {p:'اكتبي فقرة قصيرة بالألمانية عن أهمية تعلم اللغات، باستخدام جملة شرطية واحدة على الأقل.', m:'Sprachen zu lernen ist sehr wichtig. Wenn ich mehrere Sprachen spreche, kann ich überall reisen und arbeiten. Sprachen öffnen den Geist und das Herz. Deshalb lerne ich jeden Tag.', k:['Sprachen','wenn','kann']},
    {p:'اكتبي رأيك بالألمانية: هل التكنولوجيا بتقرّب الناس ولا بتبعّدهم؟ (٤-٥ جمل).', m:'Meiner Meinung nach bringt die Technologie die Menschen näher. Dank des Internets spreche ich jeden Tag mit meiner Familie. Allerdings muss man sie mit Maß nutzen. Die echten Momente bleiben die wichtigsten.', k:['Technologie','Menschen','allerdings']},
    {p:'اكتبي عن تحدي واجهتي في حياتك وإزاي عدّيتيه بالألمانية (الماضي).', m:'Letztes Jahr hatte ich eine sehr schwere Prüfung. Ich habe jeden Abend einen Monat lang gelernt. Meine Familie hat mich sehr unterstützt. Schließlich habe ich mit einer guten Note bestanden.', k:['hatte','Prüfung','bestanden']},
    {p:'اكتبي مقارنة بالألمانية بين الدراسة أونلاين والحضوري (٤ جمل).', m:'Online-Kurse sind praktisch und günstig. Präsenzkurse hingegen bieten mehr Interaktion. Persönlich bevorzuge ich eine Mischung aus beiden. Jede Methode hat ihre Vorteile.', k:['Kurse','hingegen','bevorzuge']},
    {p:'اكتبي نصيحة لطالبة جديدة عايزة تتعلم الألمانية بسرعة (٤ جمل بالألمانية).', m:'Hier sind meine Tipps: Höre jeden Tag deutsche Lieder. Lies jeden Abend ein bisschen. Sprich mit Freunden ohne Angst vor Fehlern. Sei geduldig und regelmäßig, du wirst es schaffen!', k:['Tipps','höre','Fehler']}
  ]
}
};
