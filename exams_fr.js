/* Lingua exam bank: French — same shape as exams_en.js, assembled by v93.js */
window.LINGUA_EXAMS = window.LINGUA_EXAMS || {};
window.LINGUA_EXAMS.fr = {
easy: {
  vocab: [
    ['pomme','تفاحة'],['eau','ماء'],['pain','عيش'],['lait','لبن'],['riz','أرز'],['œuf','بيضة'],['poisson','سمك'],['viande','لحمة'],
    ['maison','بيت'],['école','مدرسة'],['livre','كتاب'],['stylo','قلم'],['table','ترابيزة'],['chaise','كرسي'],['porte','باب'],['fenêtre','شباك'],
    ['soleil','شمس'],['lune','قمر'],['étoile','نجمة'],['pluie','مطر'],['chat','قطة'],['chien','كلب'],['oiseau','عصفورة'],['cheval','حصان'],
    ['mère','أم'],['père','أب'],['frère','أخ'],['sœur','أخت'],['ami','صديق'],['professeur','مدرس'],['médecin','دكتور'],['étudiant','طالب'],
    ['rouge','أحمر'],['bleu','أزرق'],['vert','أخضر'],['grand','كبير'],['petit','صغير'],['heureux','سعيد'],['triste','حزين'],['chaud','سخن']
  ],
  grammar: [
    {q:'Je ___ étudiante.', opts:['suis','es','est','sommes'], a:0},
    {q:'Tu ___ française?', opts:['suis','es','est','êtes'], a:1},
    {q:'Elle ___ à Paris.', opts:['habite','habites','habitent','habiter'], a:0},
    {q:'Nous ___ contents.', opts:['es','est','sommes','sont'], a:2},
    {q:'Ils ___ au parc.', opts:['va','vont','allons','allez'], a:1},
    {q:'C\'est ___ pomme.', opts:['un','une','des','le'], a:1},
    {q:'J\'aime ___ chocolat.', opts:['le','un','une','des'], a:0},
    {q:'Il ___ deux sœurs.', opts:['a','as','ai','ont'], a:0},
    {q:'Vous ___ bien français.', opts:['parle','parles','parlez','parlent'], a:2},
    {q:'Mon chat ___ blanc.', opts:['suis','es','est','sont'], a:2},
    {q:'Elles ___ étudiantes.', opts:['est','sont','sommes','êtes'], a:1},
    {q:'Comment ___ -tu?', opts:['t\'appelles','t\'appelle','t\'appellent','t\'appelons'], a:0}
  ],
  fill: [
    {s:'___, monsieur! (الصبح)', opts:['Bonsoir','Bonjour','Salut','Merci'], a:1},
    {s:'Comment ___ -tu? — Ça va bien.', opts:['vas','va','vais','vont'], a:1},
    {s:'Je ___ à l\'université. (بدرس)', opts:['étudie','étudies','étudions','étudient'], a:0},
    {s:'Le chat est ___ la table. (تحت)', opts:['sur','sous','dans','à côté'], a:1},
    {s:'___ t\'appelles-tu? — Je m\'appelle Sara.', opts:['Où','Comment','Quand','Qui'], a:1},
    {s:'Je bois ___ tous les matins. (ماء)', opts:['du pain','de l\'eau','du riz','de la viande'], a:1},
    {s:'Il y a ___ livres sur la table. (تلاتة)', opts:['deux','trois','quatre','cinq'], a:1},
    {s:'Merci ___ ! (كتير)', opts:['très','beaucoup','peu','assez'], a:1},
    {s:'Nous allons à l\'école ___ samedi. (يوم)', opts:['le','la','les','un'], a:0},
    {s:'Le soleil est ___. (سخن)', opts:['froid','chaud','vert','triste'], a:1}
  ],
  passages: [
    {t:'Ma famille', x:'Je m\'appelle Mona. J\'habite au Caire avec ma famille. Mon père est médecin et ma mère est professeur. J\'ai un frère. Il s\'appelle Omar. Il a dix ans. Nous avons un petit chat. Elle s\'appelle Lulu.',
     qs:[['Où habite Mona?',['À Alexandrie','Au Caire','À Londres','À Assiout'],1],
         ['Quel est le travail de sa mère?',['Médecin','Ingénieur','Professeur','Infirmière'],2],
         ['Comment s\'appelle le chat?',['Omar','Mona','Lulu','Caire'],2]]},
    {t:'Une journée à l\'école', x:'Ali se réveille à sept heures. Il prend le petit déjeuner avec sa sœur. Puis il va à l\'école en bus. Il a cinq cours tous les jours. Son cours préféré est l\'anglais. Après l\'école, il joue au football avec ses amis.',
     qs:[['Quand Ali se réveille-t-il?',['À six heures','À sept heures','À huit heures','À neuf heures'],1],
         ['Comment va-t-il à l\'école?',['En voiture','En train','En bus','À pied'],2],
         ['Quel est son cours préféré?',['Les maths','L\'arabe','Les sciences','L\'anglais'],3]]},
    {t:'Le temps', x:'Aujourd\'hui c\'est vendredi. Le soleil est chaud et le ciel est bleu. Sara et son amie Huda vont au parc. Elles s\'assoient sous un grand arbre. Elles mangent des pommes et boivent de l\'eau froide. Elles sont très heureuses.',
     qs:[['Quel jour est-ce?',['Dimanche','Vendredi','Lundi','Jeudi'],1],
         ['Où vont les filles?',['À l\'école','Au parc','À la plage','Au magasin'],1],
         ['Qu\'est-ce qu\'elles boivent?',['Du thé','Du jus','Du lait','De l\'eau froide'],3]]},
    {t:'Ma chambre', x:'Voici ma chambre. Elle est petite mais belle. Il y a un lit, un bureau et une chaise. Mes livres sont sur le bureau. Il y a une grande fenêtre. Le soir, je peux voir la lune de ma fenêtre. J\'aime ma chambre.',
     qs:[['Comment est la chambre?',['Grande','Petite et belle','Froide','Sombre'],1],
         ['Où sont les livres?',['Sur le lit','Sous la chaise','Sur le bureau','Dans la fenêtre'],2],
         ['Que peut-elle voir le soir?',['Le soleil','La lune','Les oiseaux','Les voitures'],1]]}
  ],
  essays: [
    {p:'اكتبي ٣-٤ جمل عن نفسك بالفرنسية (اسمك، سنك، بلدك، حاجة بتحبيها).', m:'Je m\'appelle Karma. J\'ai vingt ans. Je suis égyptienne. J\'aime apprendre les langues.', k:['appelle','ans','égyptienne','aime']},
    {p:'اكتبي جملتين أو تلاتة عن عيلتك بالفرنسية.', m:'Ma famille est petite. Mon père est ingénieur et ma mère est professeur. J\'ai une sœur.', k:['famille','père','mère']},
    {p:'اكتبي عن يومك في الجامعة أو المدرسة بالفرنسية (٣ جمل).', m:'Je vais à l\'université tous les jours. J\'ai beaucoup de cours. J\'étudie le français après les cours.', k:['vais','université','étudie']},
    {p:'اكتبي ٣ جمل عن أكلك المفضل بالفرنسية.', m:'Mon plat préféré est le koshari. C\'est du riz, des pâtes et des lentilles. Je le mange chaque vendredi avec ma famille.', k:['plat','préféré','mange']},
    {p:'اكتبي ٣ جمل عن صاحبتك المقربة بالفرنسية.', m:'Ma meilleure amie est Maya. Elle est gentille et drôle. Nous étudions ensemble chaque semaine.', k:['amie','elle','ensemble']}
  ]
},
medium: {
  vocab: [
    ['voyage','رحلة'],['aéroport','مطار'],['billet','تذكرة'],['bagages','شنط سفر'],['passeport','جواز سفر'],['hôtel','فندق'],['plage','شاطئ'],['musée','متحف'],
    ['ingénieur','مهندس'],['cours','محاضرة'],['diplôme','شهادة جامعية'],['recherche','بحث علمي'],['projet','مشروع'],['date limite','موعد نهائي'],['réunion','اجتماع'],['salaire','مرتب'],
    ['nerveux','متوتر'],['fier','فخور'],['seul','وحيد'],['reconnaissant','ممتن'],['curieux','فضولي'],['calme','هادئ'],['en colère','غاضب'],['timide','خجول'],
    ['temps','طقس'],['nuageux','غائم'],['tempête','عاصفة'],['température','درجة حرارة'],['saison','فصل'],['printemps','ربيع'],['automne','خريف'],['hiver','شتاء'],
    ['habitude','عادة'],['améliorer','يحسّن'],['entraînement','تدريب'],['erreur','غلطة'],['courant','طليق'],['accent','لهجة'],['dictionnaire','قاموس'],['phrase','جملة']
  ],
  grammar: [
    {q:'J\'habite au Caire ___ 2015.', opts:['pendant','depuis','de','à'], a:1},
    {q:'Elle est ___ que sa sœur.', opts:['grande','plus grande','la plus grande','plus grand'], a:1},
    {q:'S\'il pleut, nous ___ à la maison.', opts:['restons','resterons','restions','restant'], a:1},
    {q:'J\'___ ce film hier.', opts:['regarde','regardes','ai regardé','regardant'], a:2},
    {q:'Le français ___ parlé dans beaucoup de pays.', opts:['parle','est','a parlé','parlant'], a:1},
    {q:'Tu ___ étudier avant l\'examen.', opts:['devrais','voudrais','pourrais','aimerais'], a:0},
    {q:'J\'ai ___ fini mes devoirs.', opts:['encore','déjà','depuis','pendant'], a:1},
    {q:'Elle ___ la télé quand je l\'ai appelée.', opts:['regarde','regardait','a regardé','regarder'], a:1},
    {q:'C\'est le ___ livre que j\'ai lu.', opts:['bon','meilleur','mieux','plus bon'], a:1},
    {q:'Il m\'a demandé où j\'___.', opts:['habite','habitais','habiter','habitant'], a:1},
    {q:'Je pense ___ toi.', opts:['de','à','pour','avec'], a:1},
    {q:'Il faut ___ tes devoirs.', opts:['faire','fait','faisant','fais'], a:0}
  ],
  fill: [
    {s:'J\'apprends le français ___ deux ans.', opts:['depuis','pendant','de','à'], a:0},
    {s:'Elle s\'intéresse ___ la musique.', opts:['de','à','pour','avec'], a:1},
    {s:'Le cours commence ___ dix heures.', opts:['en','dans','à','de'], a:2},
    {s:'Je suis bon ___ dessin.', opts:['de','en','à','pour'], a:1},
    {s:'Nous sommes arrivés ___ l\'aéroport tôt.', opts:['en','dans','à','de'], a:2},
    {s:'Elle s\'est excusée ___ son retard.', opts:['de','pour','à','avec'], a:1},
    {s:'Je m\'occupe ___ mon petit frère le vendredi.', opts:['à','de','pour','avec'], a:1},
    {s:'Éteins ___ lumières en partant. (الـ)', opts:['les','des','de','un'], a:0},
    {s:'Il a arrêté ___ fumer l\'année dernière.', opts:['de','à','pour','en'], a:0},
    {s:'J\'ai peur ___ araignées.', opts:['de','des','à','avec'], a:1}
  ],
  passages: [
    {t:'Étudier à l\'étranger', x:'Laila rêve d\'étudier l\'ingénierie en Allemagne. Elle étudie l\'allemand chaque soir pendant deux heures. Ce n\'est pas facile, mais elle n\'abandonne jamais. Sa famille soutient son rêve. L\'année prochaine, elle passera l\'examen de langue. Si elle réussit, elle postulera à trois universités à Berlin.',
     qs:[['Que rêve Laila d\'étudier?',['La médecine','L\'ingénierie','Le droit','L\'art'],1],
         ['Combien de temps étudie-t-elle chaque soir?',['Une heure','Deux heures','Trois heures','Trente minutes'],1],
         ['Combien d\'universités à Berlin?',['Deux','Trois','Quatre','Cinq'],1]]},
    {t:'Un nouveau travail', x:'Omar a trouvé un nouveau travail dans une grande entreprise. Le premier jour, il est arrivé tôt. Ses collègues sont gentils et l\'ont aidé. Son bureau est au troisième étage. Il travaille de neuf heures à cinq heures. Le soir, il rentre à la maison fatigué mais content.',
     qs:[['Quand Omar est-il arrivé le premier jour?',['En retard','Tôt','À midi','Le soir'],1],
         ['Comment sont ses collègues?',['Méchants','Gentils','Tristes','Fâchés'],1],
         ['À quelle heure finit-il?',['À trois heures','À quatre heures','À cinq heures','À six heures'],2]]},
    {t:'Le week-end', x:'Samedi matin, Nour se lève tard. Elle prépare le petit déjeuner pour sa famille. L\'après-midi, elle sort avec ses amies au centre commercial. Elles achètent des vêtements et mangent une glace. Le soir, toute la famille regarde un film ensemble à la maison.',
     qs:[['Quand Nour se lève-t-elle?',['Tôt','Tard','À six heures','À cinq heures'],1],
         ['Où va-t-elle l\'après-midi?',['Au parc','À la plage','Au centre commercial','À l\'université'],2],
         ['Que fait la famille le soir?',['Elle dort','Elle sort','Elle regarde un film','Elle cuisine'],2]]},
    {t:'Le marché', x:'Dimanche, grand-mère va au marché tôt le matin. Elle achète des légumes frais, des fruits et du poisson. Les prix sont bons et les vendeurs sont sympas. Elle rentre avec deux grands sacs. Le midi, elle prépare un grand déjeuner pour toute la famille.',
     qs:[['Quand va-t-elle au marché?',['Le soir','Le matin','L\'après-midi','La nuit'],1],
         ['Qu\'est-ce qu\'elle n\'achète pas?',['Des légumes','Des fruits','Du poisson','Des vêtements'],3],
         ['Combien de sacs?',['Un','Deux','Trois','Quatre'],1]]}
  ],
  essays: [
    {p:'اكتبي ٤ جمل عن حلمك للمستقبل بالفرنسية.', m:'Mon rêve est de devenir ingénieure. Je veux travailler dans une grande entreprise. Je vais étudier beaucoup. J\'espère réussir.', k:['rêve','ingénieur','étudier']},
    {p:'اكتبي عن رحلة عملتيها أو عايزة تعمليها بالفرنسية (٤ جمل).', m:'L\'été dernier, j\'ai visité Alexandrie avec ma famille. Nous avons nagé dans la mer. Nous avons mangé du poisson. C\'était magnifique.', k:['visité','mer','famille']},
    {p:'اكتبي ٤ جمل عن يومك المعتاد بالفرنسية (المفروض تستخدمي المضارع).', m:'Je me réveille à sept heures. Je prends le petit déjeuner. Je vais à l\'université en bus. Le soir, j\'étudie et je dors tôt.', k:['réveille','vais','étudie']},
    {p:'اكتبي عن الفرق بين القاهرة وبلدك بالفرنسية (٣-٤ جمل).', m:'Le Caire est une grande ville. Assiout est plus petite et plus calme. J\'aime le Caire pour ses musées. Mais ma ville est meilleure pour la famille.', k:['ville','calme','aime']},
    {p:'اكتبي رسالة قصيرة لصاحبتك تدعيها على الغدا بالفرنسية.', m:'Chère Maya, je t\'invite à déjeuner chez moi samedi. Ma mère prépare le koshari. Viens à une heure. Je t\'attends avec plaisir!', k:['invite','déjeuner','samedi']}
  ]
},
hard: {
  vocab: [
    ['réalisation','إنجاز'],['ambition','طموح'],['persévérance','مثابرة'],['échec','فشل'],['réussite','نجاح'],['défi','تحدي'],['opportunité','فرصة'],['expérience','خبرة'],
    ['développement durable','تنمية مستدامة'],['environnement','بيئة'],['pollution','تلوث'],['recyclage','إعادة تدوير'],['climat','مناخ'],['énergie renouvelable','طاقة متجددة'],['consommation','استهلاك'],['gaspillage','هدر'],
    ['intelligence artificielle','ذكاء اصطناعي'],['algorithme','خوارزمية'],['données','بيانات'],['réseau','شبكة'],['cybersécurité','أمن سيبراني'],['innovation','ابتكار'],['télétravail','عمل عن بعد'],['numérique','رقمي'],
    ['malgré','رغم'],['cependant','ومع ذلك'],['néanmoins','مع ذلك'],['par conséquent','وبالتالي'],['en revanche','على النقيض'],['tandis que','بينما'],['désormais','من الآن فصاعدًا'],['autrefois','في الماضي'],
    ['approfondir','يتعمق في'],['soutenir','يدعم'],['remettre en question','يشكك في'],['aboutir','يؤدي إلى'],['contribuer','يساهم'],['s\'engager','يلتزم'],['maîtriser','يتقن'],['envisager','يفكر في']
  ],
  grammar: [
    {q:'Je ne pense pas qu\'il ___ raison.', opts:['a','ait','avait','aura'], a:1},
    {q:'Si j\'avais le temps, je ___ plus.', opts:['étudierais','étudierai','étudiais','étudie'], a:0},
    {q:'Il faut que tu ___ tes devoirs.', opts:['fais','fasses','feras','faisais'], a:1},
    {q:'Bien qu\'elle ___ fatiguée, elle continue.', opts:['est','soit','était','sera'], a:1},
    {q:'Voici le livre ___ je t\'ai parlé.', opts:['que','dont','qui','où'], a:1},
    {q:'Elle a dit qu\'elle ___ le lendemain.', opts:['viendra','viendrait','vient','venait'], a:1},
    {q:'Je me demande ___ il viendra.', opts:['si','que','quand','pourquoi'], a:0},
    {q:'Quand j\'___, je te téléphonerai.', opts:['arriverai','serai arrivé','arrive','arrivais'], a:1},
    {q:'C\'est la ville ___ je suis née.', opts:['que','où','dont','laquelle'], a:1},
    {q:'Il travaille ___ réussir.', opts:['pour','afin de','afin qu\'','de'], a:1},
    {q:'Je cherche quelqu\'un qui ___ m\'aider.', opts:['peut','puisse','pouvait','pourra'], a:1},
    {q:'Elle regrette ___ parti tôt.', opts:['être','d\'être','d\'avoir','avoir'], a:1}
  ],
  fill: [
    {s:'___ ses efforts, elle n\'a pas réussi. (رغم)', opts:['Malgré','Grâce','À cause','Selon'], a:0},
    {s:'Il est tard; ___, je continue à travailler. (ومع ذلك)', opts:['donc','cependant','alors','ainsi'], a:1},
    {s:'Plus tu pratiques, ___ tu deviens fort.', opts:['plus','moins','très','trop'], a:0},
    {s:'___ que je sache, elle n\'est pas venue. (على حد علمي)', opts:['Autant','Pour autant','Aussitôt','Depuis'], a:0},
    {s:'Je t\'ai envoyé le document ___ tu le relises. (عشان)', opts:['pour que','afin de','sans que','avant de'], a:0},
    {s:'___ il pleuve, le match aura lieu. (حتى لو)', opts:['Même s\'','Bien qu\'','À moins qu\'','Loin d\''], a:0},
    {s:'Elle a agi ___ rien ne s\'était passé. (وكأن)', opts:['parce que','comme si','si bien que','de sorte que'], a:1},
    {s:'Il a réussi ___ de sa persévérance. (بفضل)', opts:['à cause','grâce','faute','en dépit'], a:1},
    {s:'Je ne savais pas ___ m\'y prendre. (إزاي أتصرف)', opts:['comment','pourquoi','quand','combien'], a:0},
    {s:'___ soit le résultat, je suis fière de toi. (أيًا كان)', opts:['Quelque','Quel que','Quoique','Quelconque'], a:1}
  ],
  passages: [
    {t:'L\'éducation des filles', x:'Dans beaucoup de pays, l\'éducation des filles a transformé la société. Quand les filles vont à l\'école, elles gagnent mieux leur vie plus tard et leurs enfants sont en meilleure santé. Cependant, des millions de filles n\'ont toujours pas accès à l\'école. Les gouvernements et les associations travaillent ensemble pour changer cette situation. L\'éducation n\'est pas un luxe; c\'est un droit pour tous.',
     qs:[['Que transforme l\'éducation des filles?',['La météo','La société','La nourriture','La mode'],1],
         ['Que gagnent les filles éduquées?',['Mieux leur vie','Moins d\'argent','Plus d\'enfants','Rien'],0],
         ['L\'éducation est décrite comme...',['Un luxe','Un droit','Un problème','Un jeu'],1]]},
    {t:'Le télétravail', x:'Depuis quelques années, le télétravail a changé la vie de millions d\'employés. Travailler de la maison permet de gagner du temps et de passer plus de moments avec la famille. Néanmoins, certains se sentent isolés et ont du mal à séparer le travail de la vie privée. Les entreprises cherchent maintenant un équilibre: deux jours au bureau, trois jours à la maison, par exemple.',
     qs:[['Qu\'est-ce que le télétravail permet?',['De perdre du temps','De gagner du temps','De voyager plus','De dormir au bureau'],1],
         ['Quel est un problème du télétravail?',['Le bruit du bureau','Le sentiment d\'isolement','Le salaire','Les réunions'],1],
         ['Quelle solution les entreprises cherchent-elles?',['Tout au bureau','Tout à la maison','Un équilibre','Plus d\'heures'],2]]},
    {t:'L\'intelligence artificielle', x:'L\'intelligence artificielle fait maintenant partie de notre quotidien: elle traduit des textes, recommande des films et aide les médecins à diagnostiquer des maladies. Toutefois, elle soulève aussi des questions importantes. Qui est responsable quand une machine se trompe? Et que deviendront les emplois remplacés par des robots? Les experts s\'accordent sur un point: il faut des règles claires pour que la technologie serve l\'humain.',
     qs:[['Comment l\'IA aide-t-elle les médecins?',['À opérer seule','À diagnostiquer des maladies','À parler aux patients','À vendre des médicaments'],1],
         ['Quelle question est soulevée?',['Le prix des ordinateurs','La responsabilité des erreurs','La vitesse d\'internet','La taille des écrans'],1],
         ['Sur quoi les experts s\'accordent-ils?',['Arrêter l\'IA','Des règles claires','Plus de robots','Moins de médecins'],1]]},
    {t:'Le minimalisme', x:'Fatiguée de posséder trop d\'objets, Inès a décidé de changer de vie. Elle a donné la moitié de ses vêtements et vendu ses vieux meubles. Aujourd\'hui, sa maison est presque vide, mais elle se sent plus libre. «Je n\'achète plus rien sans réfléchir», dit-elle. Selon elle, le bonheur ne vient pas des choses qu\'on possède, mais des expériences qu\'on vit et des gens qu\'on aime.',
     qs:[['Qu\'a fait Inès de ses vêtements?',['Elle les a jetés','Elle en a donné la moitié','Elle les a cachés','Elle les a comptés'],1],
         ['Comment se sent-elle maintenant?',['Plus triste','Plus libre','Plus riche','Plus fatiguée'],1],
         ['D\'où vient le bonheur selon elle?',['Des objets','De l\'argent','Des expériences et des gens','Des meubles'],2]]}
  ],
  essays: [
    {p:'اكتبي فقرة قصيرة بالفرنسية عن أهمية تعلم اللغات، باستخدام جملة شرطية واحدة على الأقل.', m:'Apprendre des langues est très important. Si je parle plusieurs langues, je peux voyager et travailler partout. Les langues ouvrent l\'esprit et le cœur. C\'est pourquoi j\'étudie chaque jour.', k:['langues','si','peux']},
    {p:'اكتبي رأيك بالفرنسية: هل التكنولوجيا بتقرّب الناس ولا بتبعّدهم؟ (٤-٥ جمل).', m:'À mon avis, la technologie rapproche les gens. Grâce à internet, je parle à ma famille tous les jours. Cependant, il faut l\'utiliser avec modération. Les vrais moments restent les plus importants.', k:['technologie','gens','cependant']},
    {p:'اكتبي عن تحدي واجهتي في حياتك وإزاي عدّيتيه بالفرنسية (الماضي المركب).', m:'L\'année dernière, j\'ai eu un examen très difficile. J\'ai étudié chaque soir pendant un mois. Ma famille m\'a beaucoup soutenue. Finalement, j\'ai réussi avec une bonne note.', k:['ai','examen','réussi']},
    {p:'اكتبي مقارنة بالفرنسية بين الدراسة أونلاين والحضوري (٤ جمل).', m:'Les cours en ligne sont pratiques et économiques. En revanche, les cours en présentiel offrent plus d\'interaction. Personnellement, je préfère un mélange des deux. Chaque méthode a ses avantages.', k:['cours','revanche','préfère']},
    {p:'اكتبي نصيحة لطالبة جديدة عايزة تتعلم الفرنسية بسرعة (٤ جمل بالفرنسية).', m:'Voici mes conseils: écoute des chansons françaises tous les jours. Lis un peu chaque soir. Parle avec des amis sans avoir peur des erreurs. Sois patiente et régulière, tu vas réussir!', k:['conseils','écoute','erreurs']}
  ]
}
};
