/* Lingua exam bank: English — vocab pairs + grammar MCQ + fill-in + original passages + essay prompts.
   Exams are assembled by v93.js as fixed seeded samples from these pools. */
window.LINGUA_EXAMS = window.LINGUA_EXAMS || {};
window.LINGUA_EXAMS.en = {
easy: {
  vocab: [
    ['apple','تفاحة'],['water','ماء'],['bread','عيش'],['milk','لبن'],['rice','أرز'],['egg','بيضة'],['fish','سمك'],['meat','لحمة'],
    ['house','بيت'],['school','مدرسة'],['book','كتاب'],['pen','قلم'],['table','ترابيزة'],['chair','كرسي'],['door','باب'],['window','شباك'],
    ['sun','شمس'],['moon','قمر'],['star','نجمة'],['rain','مطر'],['cat','قطة'],['dog','كلب'],['bird','عصفورة'],['horse','حصان'],
    ['mother','أم'],['father','أب'],['brother','أخ'],['sister','أخت'],['friend','صديق'],['teacher','مدرس'],['doctor','دكتور'],['student','طالب'],
    ['red','أحمر'],['blue','أزرق'],['green','أخضر'],['big','كبير'],['small','صغير'],['happy','سعيد'],['sad','حزين'],['hot','سخن']
  ],
  grammar: [
    {q:'She ___ a student.', opts:['am','is','are','be'], a:1},
    {q:'They ___ playing football.', opts:['is','am','are','be'], a:2},
    {q:'I ___ from Egypt.', opts:['is','am','are','be'], a:1},
    {q:'This is ___ apple.', opts:['a','an','the','no word'], a:1},
    {q:'___ you like tea?', opts:['Does','Do','Is','Are'], a:1},
    {q:'He ___ not like coffee.', opts:['do','does','is','are'], a:1},
    {q:'There ___ three books on the table.', opts:['is','am','are','be'], a:2},
    {q:'My name ___ Karma.', opts:['am','is','are','be'], a:1},
    {q:'We ___ happy today.', opts:['is','am','are','be'], a:2},
    {q:'Cats ___ milk.', opts:['likes','like','liking','liked'], a:1},
    {q:'She ___ to school every day.', opts:['go','goes','going','gone'], a:1},
    {q:'I have ___ sisters.', opts:['two','too','to','tow'], a:0}
  ],
  fill: [
    {s:'Good ___, teacher! (الصبح)', opts:['night','morning','evening','bye'], a:1},
    {s:'How ___ you? — I am fine.', opts:['is','am','are','be'], a:2},
    {s:'I ___ a student at the faculty of engineering.', opts:['am','is','are','be'], a:0},
    {s:'The cat is ___ the table. (تحت)', opts:['on','under','in','next'], a:1},
    {s:'___ is your name? — My name is Sara.', opts:['Where','What','When','Who'], a:1},
    {s:'I drink ___ every morning. (ماء)', opts:['bread','water','rice','meat'], a:1},
    {s:'She has two ___: a boy and a girl.', opts:['child','childs','children','childrens'], a:2},
    {s:'We go to school ___ Saturday to Thursday.', opts:['at','on','from','in'], a:2},
    {s:'Thank you ___ much!', opts:['very','many','lot','so much'], a:0},
    {s:'The sun is ___. (ساطعة/سخنة)', opts:['cold','hot','green','sad'], a:1}
  ],
  passages: [
    {t:'My Family', x:'My name is Mona. I live in Cairo with my family. My father is a doctor and my mother is a teacher. I have one brother. His name is Omar. He is ten years old. We have a small cat. Her name is Lulu.',
     qs:[['Where does Mona live?',['In Alexandria','In Cairo','In London','In Assiut'],1],
         ['What is her mother\'s job?',['Doctor','Engineer','Teacher','Nurse'],2],
         ['What is the cat\'s name?',['Omar','Mona','Lulu','Cairo'],2]]},
    {t:'A School Day', x:'Ali wakes up at seven o\'clock. He eats breakfast with his sister. Then he goes to school by bus. He has five lessons every day. His favorite lesson is English. After school, he plays football with his friends.',
     qs:[['When does Ali wake up?',['At six','At seven','At eight','At nine'],1],
         ['How does he go to school?',['By car','By train','By bus','On foot'],2],
         ['What is his favorite lesson?',['Math','Arabic','Science','English'],3]]},
    {t:'The Weather', x:'Today is Friday. The sun is hot and the sky is blue. Sara and her friend Huda go to the park. They sit under a big tree. They eat apples and drink cold water. They are very happy.',
     qs:[['What day is it?',['Sunday','Friday','Monday','Thursday'],1],
         ['Where do the girls go?',['To school','To the park','To the beach','To the shop'],1],
         ['What do they drink?',['Tea','Juice','Milk','Cold water'],3]]},
    {t:'My Room', x:'This is my room. It is small but beautiful. There is a bed, a desk and a chair. My books are on the desk. There is a big window. I can see the moon from my window at night. I love my room.',
     qs:[['How is the room?',['Big','Small and beautiful','Cold','Dark'],1],
         ['Where are the books?',['On the bed','Under the chair','On the desk','In the window'],2],
         ['What can she see at night?',['The sun','The moon','Birds','Cars'],1]]}
  ],
  essays: [
    {p:'اكتبي ٣-٤ جمل عن نفسك بالإنجليزية (اسمك، سنك، بلدك، حاجة بتحبيها).', m:'My name is Karma. I am twenty years old. I am from Egypt. I love learning languages.', k:['name','old','egypt','love']},
    {p:'اكتبي جملتين أو تلاتة عن عيلتك بالإنجليزية.', m:'My family is small. My father is an engineer and my mother is a teacher. I have one sister.', k:['family','father','mother']},
    {p:'اكتبي عن يومك في الجامعة أو المدرسة بالإنجليزية (٣ جمل).', m:'I go to university every day. I have many lectures. I study English after my lectures.', k:['go','university','study']},
    {p:'اكتبي ٣ جمل عن أكلك المفضل بالإنجليزية.', m:'My favorite food is koshari. It is rice, pasta and lentils. I eat it every Friday with my family.', k:['food','favorite','eat']},
    {p:'اكتبي ٣ جمل عن صاحبتك المقربة بالإنجليزية.', m:'My best friend is Maya. She is kind and funny. We study together every week.', k:['friend','she','together']}
  ]
},
medium: {
  vocab: [
    ['journey','رحلة'],['airport','مطار'],['ticket','تذكرة'],['luggage','شنط سفر'],['passport','جواز سفر'],['hotel','فندق'],['beach','شاطئ'],['museum','متحف'],
    ['engineer','مهندس'],['lecture','محاضرة'],['degree','شهادة جامعية'],['research','بحث علمي'],['project','مشروع'],['deadline','موعد نهائي'],['meeting','اجتماع'],['salary','مرتب'],
    ['nervous','متوتر'],['proud','فخور'],['lonely','وحيد'],['grateful','ممتن'],['curious','فضولي'],['calm','هادئ'],['angry','غاضب'],['shy','خجول'],
    ['weather','طقس'],['cloudy','غائم'],['storm','عاصفة'],['temperature','درجة حرارة'],['season','فصل'],['spring','ربيع'],['autumn','خريف'],['winter','شتاء'],
    ['habit','عادة'],['improve','يحسّن'],['practice','تدريب'],['mistake','غلطة'],['fluent','طليق'],['accent','لهجة'],['dictionary','قاموس'],['sentence','جملة']
  ],
  grammar: [
    {q:'I have lived in Cairo ___ 2015.', opts:['for','since','from','at'], a:1},
    {q:'She is ___ than her sister.', opts:['tall','taller','tallest','more tall'], a:1},
    {q:'If it rains, we ___ at home.', opts:['stay','will stay','stayed','staying'], a:1},
    {q:'I ___ this movie yesterday.', opts:['watch','watches','watched','watching'], a:2},
    {q:'English ___ all over the world.', opts:['speaks','is spoken','spoke','speaking'], a:1},
    {q:'You ___ study hard before the exam.', opts:['should','would','could','might'], a:0},
    {q:'I have ___ finished my homework.', opts:['yet','already','since','for'], a:1},
    {q:'She ___ TV when I called her.', opts:['watches','watched','was watching','is watching'], a:2},
    {q:'This is the ___ book I have ever read.', opts:['good','better','best','most good'], a:2},
    {q:'Neither Sara ___ Huda came to class.', opts:['or','nor','and','but'], a:1},
    {q:'I am looking forward ___ you.', opts:['see','to see','to seeing','seeing'], a:2},
    {q:'He asked me where ___.', opts:['do I live','I live','I lived','did I live'], a:1}
  ],
  fill: [
    {s:'I have been learning English ___ two years.', opts:['since','for','from','at'], a:1},
    {s:'She is interested ___ learning French.', opts:['on','at','in','for'], a:2},
    {s:'The lecture starts ___ 10 AM.', opts:['in','on','at','from'], a:2},
    {s:'I am good ___ drawing.', opts:['in','at','on','for'], a:1},
    {s:'We arrived ___ the airport early.', opts:['in','on','at','to'], a:2},
    {s:'She apologized ___ being late.', opts:['about','for','from','of'], a:1},
    {s:'I look ___ my little brother on Fridays. (بعتني بـ/أرعى)', opts:['after','for','at','up'], a:0},
    {s:'Please turn ___ the lights when you leave.', opts:['on','off','up','down'], a:1},
    {s:'He gave ___ smoking last year. (قلع عن)', opts:['up','off','in','away'], a:0},
    {s:'I am afraid ___ spiders.', opts:['from','of','about','with'], a:1}
  ],
  passages: [
    {t:'Studying Abroad', x:'Laila dreams of studying engineering in Germany. She studies German every evening for two hours. It is not easy, but she never gives up. Her family supports her dream. Next year, she will take the language exam. If she passes, she will apply to three universities in Berlin.',
     qs:[['What does Laila want to study?',['Medicine','Engineering','Law','Art'],1],
         ['How often does she study German?',['Every morning','Every evening','Once a week','Only on Fridays'],1],
         ['What will happen if she passes the exam?',['She will travel to France','She will apply to universities','She will stop learning','She will work in Cairo'],1]]},
    {t:'A Healthy Habit', x:'Omar used to sleep late every night. He was always tired in the morning. His doctor told him to sleep eight hours and drink more water. After one month, Omar felt much better. Now he wakes up early, studies before work, and even has time for breakfast.',
     qs:[['What was Omar\'s problem?',['He ate too much','He slept late and felt tired','He worked too hard','He drank too much coffee'],1],
         ['What did the doctor advise?',['More coffee','Less water','Eight hours of sleep and more water','New medicine'],2],
         ['What changed after a month?',['He felt worse','Nothing changed','He felt much better','He stopped studying'],2]]},
    {t:'The New Café', x:'A new café opened last week near the university. It is small but cozy, with books everywhere. Students go there to study because it is quiet. The coffee is cheap and the staff are friendly. On Thursdays, they host a free English conversation hour.',
     qs:[['Where is the café?',['Inside the university','Near the university','In another city','Next to the beach'],1],
         ['Why do students like it?',['It is loud','It is quiet and cozy','It is expensive','It has no books'],1],
         ['What happens on Thursdays?',['Free English conversation hour','The café closes','Music night','Exams'],0]]},
    {t:'Learning Online', x:'During the summer, Nour decided to improve her English online. She watched one video lesson every day and wrote down ten new words. At first, speaking was scary for her. Then she joined a free speaking group. After two months, she could introduce herself confidently.',
     qs:[['What did Nour do every day?',['Read a book','Watched a video lesson','Wrote an essay','Called a friend'],1],
         ['What was scary for her at first?',['Writing','Listening','Speaking','Reading'],2],
         ['What helped her improve?',['A private teacher','A free speaking group','A new phone','Traveling abroad'],1]]}
  ],
  essays: [
    {p:'اكتبي فقرة قصيرة (٤-٥ جمل) عن أهمية تعلم الإنجليزية بالنسبالك.', m:'Learning English is very important for me. It helps me in my engineering studies because most books are in English. It also lets me talk to people from other countries. In the future, it will help me find a better job.', k:['english','important','study','work']},
    {p:'اكتبي عن خططك للصيف الجاي بالإنجليزية (٤ جمل).', m:'Next summer, I will travel to Alexandria with my family. We will swim in the sea and visit the library. I will also take an online English course. I want to read two books in English.', k:['summer','will','travel']},
    {p:'اكتبي عن موقف صعب عدّيتيه وإيه اللي اتعلمتيه منه (٤-٥ جمل).', m:'Last year, I failed my first physics exam. I was very sad, but I decided to change my study plan. I studied a little every day and asked my friends for help. In the end, I got a very good grade. I learned that failure is a teacher.', k:['exam','sad','learned']},
    {p:'اكتبي عن مدينة بتحلمي تزوريها وليه (٤ جمل).', m:'I dream of visiting Paris. It is the city of light and art. I want to see the Eiffel Tower and try French food. I am learning French now so I can talk to people there.', k:['paris','want','french']},
    {p:'اكتبي نصيحة لحد بيبدأ يتعلم لغة جديدة (٣-٤ جمل).', m:'My advice is to practice a little every day. Do not be afraid of mistakes, because mistakes teach you. Listen to songs and watch videos in the new language. Most importantly, speak from day one.', k:['practice','mistakes','speak']}
  ]
},
hard: {
  vocab: [
    ['inevitable','حتمي'],['ambiguous','غامض'],['resilient','مرن/قادر على التعافي'],['scrutinize','يفحص بدقة'],['profound','عميق'],['obsolete','قديم لم يعد مستخدمًا'],['meticulous','دقيق جدًا'],['feasible','ممكن التنفيذ'],
    ['controversial','مثير للجدل'],['inevitable outcome','نتيجة حتمية'],['plausible','معقول الاحتمال'],['reluctant','متردد'],['exaggerate','يبالغ'],['compromise','حل وسط'],['phenomenon','ظاهرة'],['hypothesis','فرضية'],
    ['sustainable','مستدام'],['infrastructure','بنية تحتية'],['innovation','ابتكار'],['entrepreneur','رائد أعمال'],['curriculum','منهج دراسي'],['scholarship','منحة دراسية'],['bureaucracy','بيروقراطية'],['diplomacy','دبلوماسية'],
    ['procrastinate','يؤجل عمل اليوم إلى الغد'],['perseverance','مثابرة'],['integrity','نزاهة'],['empathy','تعاطف'],['nostalgia','حنين للماضي'],['skeptical','متشكك'],['versatile','متعدد الاستخدامات'],['dilemma','معضلة'],
    ['analyze','يحلل'],['synthesize','يركّب/يدمج'],['evaluate','يقيّم'],['imply','يلمّح'],['infer','يستنتج'],['contradict','يناقض'],['emphasize','يؤكد على'],['underestimate','يقلل من تقدير']
  ],
  grammar: [
    {q:'___ the rain, the match continued.', opts:['Although','Despite','Because','Unless'], a:1},
    {q:'Hardly ___ the station when the train left.', opts:['I had reached','had I reached','I reached','did I reach'], a:1},
    {q:'I would rather you ___ the truth.', opts:['tell','told','telling','to tell'], a:1},
    {q:'By this time next year, I ___ my degree.', opts:['will finish','will have finished','finish','have finished'], a:1},
    {q:'The report ___ by the committee yesterday.', opts:['was approved','is approved','has approved','approved'], a:0},
    {q:'___ I known about the meeting, I would have come.', opts:['If','Had','Should','Would'], a:1},
    {q:'She suggested that he ___ a doctor.', opts:['sees','see','saw','seeing'], a:1},
    {q:'No sooner had she arrived ___ it started raining.', opts:['when','then','than','that'], a:2},
    {q:'The project, ___ was delayed, finally succeeded.', opts:['that','which','who','what'], a:1},
    {q:'I wish I ___ harder when I was at school.', opts:['study','studied','had studied','would study'], a:2},
    {q:'It is high time we ___ action.', opts:['take','took','taken','taking'], a:1},
    {q:'Seldom ___ such a talented student.', opts:['I have seen','have I seen','I saw','did I saw'], a:1}
  ],
  fill: [
    {s:'The results were ___ different from what we expected.', opts:['utterly','utter','uttered','uttering'], a:0},
    {s:'She is not only intelligent ___ hardworking.', opts:['and','but','but also','also'], a:2},
    {s:'___ the circumstances, the event was cancelled.', opts:['Because','Due to','Despite','Although'], a:1},
    {s:'He spoke ___ softly that nobody could hear him.', opts:['too','so','such','very'], a:1},
    {s:'It was ___ an interesting lecture that everyone stayed.', opts:['so','very','such','too'], a:2},
    {s:'You had better ___ your essay before Friday.', opts:['to finish','finishing','finish','finished'], a:2},
    {s:'I would sooner quit ___ work for that company.', opts:['than','then','that','as'], a:0},
    {s:'The data ___ analyzed by the research team.', opts:['was','were been','is been','be'], a:0},
    {s:'___ the fact that it was late, she kept working.', opts:['Although','Despite','Because','Unless'], a:1},
    {s:'Neither of the answers ___ correct.', opts:['are','were','is','be'], a:2}
  ],
  passages: [
    {t:'The Cost of Convenience', x:'Modern technology promises to save time, yet many people feel busier than ever. Messages arrive at all hours, and the boundary between work and rest has blurred. Psychologists suggest that the problem is not technology itself, but the way we allow it to interrupt our attention. Setting fixed times to check messages, they argue, can restore a sense of control that convenience quietly took away.',
     qs:[['What is the main idea of the passage?',['Technology saves time for everyone','People feel busier despite time-saving technology','Work hours are shorter now','Messages are always harmful'],1],
         ['According to psychologists, what is the real problem?',['Technology itself','The cost of phones','How technology interrupts attention','Slow internet'],2],
         ['What solution is suggested?',['Deleting all apps','Fixed times for checking messages','Working longer hours','Buying new devices'],1]]},
    {t:'Why We Forget', x:'Forgetting is often seen as a failure of memory, but researchers now believe it plays an essential role. The brain constantly decides which memories to keep and which to discard. Without this filtering, important information would be buried under mountains of trivial detail. In this sense, a certain amount of forgetting is not a defect but a feature of a healthy mind.',
     qs:[['What do researchers now believe about forgetting?',['It is a disease','It has an essential role','It should be stopped','It only affects older people'],1],
         ['What would happen without filtering?',['Memory would improve','Important information would be buried','Nothing would change','The brain would grow'],1],
         ['The word "defect" is closest in meaning to:',['feature','advantage','flaw','habit'],2]]},
    {t:'A Village Transformed', x:'Twenty years ago, the village of Deir el-Barsha had no paved roads and one small school. Today, it has a library, a health center, and an internet hub built by its own graduates. The change began when a group of teachers convinced families that educating girls was an investment, not a luxury. Enrollment doubled within five years, and the first generation of graduates returned to build what they had once missed.',
     qs:[['What started the transformation?',['A government project','Foreign investment','Convincing families to educate girls','Building roads first'],2],
         ['What happened within five years?',['The village got electricity','Enrollment doubled','A university opened','Teachers left'],1],
         ['Who built the internet hub?',['Foreign companies','The government','The village\'s own graduates','A charity'],2]]},
    {t:'The Quiet Power of Reading', x:'In an age of short videos, reading long texts might seem outdated. Yet studies repeatedly show that deep reading strengthens focus and builds empathy in ways that quick content cannot. When we follow a character through hundreds of pages, we practice seeing the world through someone else\'s eyes. That practice, researchers argue, carries into real life: frequent readers tend to understand others\' feelings more accurately.',
     qs:[['What does deep reading strengthen?',['Memory only','Focus and empathy','Typing speed','Vocabulary only'],1],
         ['How does fiction build empathy?',['By teaching grammar','By practicing other perspectives','By memorizing facts','By watching characters on screen'],1],
         ['What do frequent readers tend to do better?',['Write faster','Understand others\' feelings','Speak more languages','Remember numbers'],1]]}
  ],
  essays: [
    {p:'اكتبي فقرة (٥-٦ جمل) عن رأيك: هل التكنولوجيا بتقرّب الناس ولا بتبعدهم؟ مع أمثلة.', m:'In my opinion, technology brings people closer when it is used wisely. For example, video calls let me see my cousin in Germany every week. However, when people scroll their phones during family dinners, technology pushes them apart. The tool itself is neutral; our habits decide its effect. We should use technology to serve relationships, not replace them.', k:['technology','people','however','example']},
    {p:'اكتبي مقال قصير عن أهمية الفشل في النجاح (٥ جمل).', m:'Failure is not the opposite of success; it is part of it. Every successful person has failed many times. When I failed my first exam, I discovered my weak points and fixed them. Failure teaches lessons that success never can. Therefore, we should not fear failure but learn from it.', k:['failure','success','learn']},
    {p:'اكتبي عن تحدي بيواجه جيلك في مصر واقترحي حل (٥-٦ جمل).', m:'My generation in Egypt faces the challenge of finding good jobs after graduation. Universities teach theory, but companies want practical skills. I believe students should build projects and learn online alongside their studies. Universities should also partner with companies for real training. With these steps, graduation can become a beginning, not a worry.', k:['challenge','jobs','students']},
    {p:'اكتبي عن كتاب أو فيلم أثّر فيكي وإزاي غيّر تفكيرك (٥ جمل).', m:'A book that changed my thinking is Atomic Habits. It taught me that small daily actions matter more than big promises. After reading it, I started reading ten pages every day. Months later, I had finished five books without feeling tired. It showed me that identity is built by habits.', k:['book','habits','learned']},
    {p:'اكتبي رأيك في التعلم عن بُعد: مميزاته وعيوبه (٥-٦ جمل).', m:'Online learning has clear advantages: it is flexible, cheap, and open to everyone. A student in a village can learn from the best teachers in the world. However, it requires strong self-discipline, and many students feel isolated. In my view, the best model mixes online lessons with real human contact. Balance is the key.', k:['online','learning','however']}
  ]
}
};
