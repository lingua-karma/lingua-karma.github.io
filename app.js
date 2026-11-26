
function ytLite(id){return '<div class="yt-lite" data-vid="'+id+'"><img loading="lazy" src="https://i.ytimg.com/vi/'+id+'/hqdefault.jpg" alt=""><span class="yt-play">&#9654;</span></div>';}
document.addEventListener('click',function(e){
  const l = e.target.closest ? e.target.closest('.yt-lite') : null;
  if(l && !l.classList.contains('playing')){
    l.classList.add('playing');
    l.innerHTML = '<iframe style="position:absolute;inset:0;width:100%;height:100%;border:0" src="https://www.youtube-nocookie.com/embed/'+l.dataset.vid+'?autoplay=1" title="video" allow="autoplay; encrypted-media" allowfullscreen></iframe>';
  }
});

;

/* ================= Tabs ================= */
function bindTabs(tabsId, panelsSelector){
  const tabs = document.querySelectorAll('#'+tabsId+' .tab');
  tabs.forEach(function(t){
    t.addEventListener('click', function(){
      tabs.forEach(function(x){x.classList.remove('active')});
      t.classList.add('active');
      const lang = t.dataset.lang;
      if(panelsSelector === 'lessons'){
        document.querySelectorAll('.lang-panel').forEach(function(p){
          p.classList.toggle('active', p.dataset.lang === lang);
        });
      } else {
        startQuiz(lang, cur.level);
      }
    });
  });
}
bindTabs('lessonTabs','lessons');
bindTabs('quizTabs','quiz');

/* Course cards jump to the lessons section with that language selected */
document.querySelectorAll('.course').forEach(function(c){
  c.addEventListener('click', function(){
    const lang = c.dataset.lang;
    document.querySelectorAll('#lessonTabs .tab').forEach(function(t){
      t.classList.toggle('active', t.dataset.lang === lang);
    });
    document.querySelectorAll('.lang-panel').forEach(function(p){
      p.classList.toggle('active', p.dataset.lang === lang);
    });
    document.getElementById('lessons').scrollIntoView({behavior:'smooth'});
  });
});

/* ================= Quiz data ================= */
const QUIZZES = {
  en: {
    pro: [
      {q:'ما هو الماضي من "go"؟', opts:['goed','went','gone','going'], a:1},
      {q:'اختاري الجملة الصحيحة:', opts:["She don\u2019t like coffee","She doesn\u2019t likes coffee","She doesn\u2019t like coffee",'She not like coffee'], a:2},
      {q:'ما معنى "achievement"؟', opts:['إنجاز','خسارة','عطلة','صديق'], a:0},
      {q:'عكس كلمة "ancient":', opts:['modern','old','antique','historic'], a:0},
      {q:'أكملي: I have lived here ___ 2010', opts:['since','for','from','at'], a:0}
    ],
    beg: [
      {q:'ما معنى كلمة <span class="q-foreign">Hello</span>؟', opts:['وداعًا','مرحبًا','شكرًا','من فضلك'], a:1},
      {q:'كيف تقول «صباح الخير» بالإنجليزية؟', opts:['<span class="q-foreign">Good night</span>','<span class="q-foreign">Good evening</span>','<span class="q-foreign">Good morning</span>','<span class="q-foreign">Goodbye</span>'], a:2},
      {q:'ما معنى <span class="q-foreign">Thank you</span>؟', opts:['شكرًا','عذرًا','نعم','مرحبًا'], a:0},
      {q:'كلمة <span class="q-foreign">Mother</span> تعني:', opts:['أخت','جدة','أم','ابنة'], a:2},
      {q:'الرقم <span class="q-foreign">Seven</span> هو:', opts:['٦','٧','٨','٩'], a:1}
    ],
    mid: [
      {q:'ما معنى <span class="q-foreign">Where are you from?</span>', opts:['كم عمرك؟','من أين أنتِ؟','أين تسكنين؟','ما اسمك؟'], a:1},
      {q:'<span class="q-foreign">I am a student</span> تعني:', opts:['أنا معلمة','أنا طبيبة','أنا طالبة','أنا مهندسة'], a:2},
      {q:'ما معنى <span class="q-foreign">Never mind</span>؟', opts:['لا يهم','بالتأكيد','أراك لاحقًا','مبروك'], a:0},
      {q:'كيف تقول «أنا من مصر» بالإنجليزية؟', opts:['<span class="q-foreign">I live in Egypt</span>','<span class="q-foreign">I am from Egypt</span>','<span class="q-foreign">I love Egypt</span>','<span class="q-foreign">I go to Egypt</span>'], a:1},
      {q:'<span class="q-foreign">Sounds good</span> تعني:', opts:['صوت عالٍ','اسمع جيدًا','يبدو جيدًا','كلام جميل'], a:2}
    ],
    adv: [
      {q:'ما معنى <span class="q-foreign">It\'s up to you</span>؟', opts:['الأمر يرجع إليكِ','أنا موافقة','لا أعرف','ممنوع'], a:0},
      {q:'<span class="q-foreign">Long time no see</span> تعني:', opts:['أراك كل يوم','لم أرك منذ زمن','وقت طويل جدًا','إلى اللقاء'], a:1},
      {q:'كيف تقول «لا مشكلة» بالإنجليزية؟', opts:['<span class="q-foreign">No way</span>','<span class="q-foreign">Not now</span>','<span class="q-foreign">No worries</span>','<span class="q-foreign">Never again</span>'], a:2},
      {q:'<span class="q-foreign">I\'m looking forward to it</span> تعني:', opts:['أنا أنتظر الحافلة','أنا متعبة جدًا','لا أريد ذلك','أتطلع لذلك بفارغ الصبر'], a:3},
      {q:'ما معنى <span class="q-foreign">What do you do?</span>', opts:['أين تعيشين؟','ماذا تعملين؟','كم عمرك؟','ماذا تأكلين؟'], a:1}
    ]
  },
  fr: {
    pro: [
      {q:'ما الماضي المركّب من "aller" مع "je"؟', opts:["j\u2019ai allé","je suis allé","j\u2019allais",'je vais'], a:1},
      {q:'ما معنى "bibliothèque"؟', opts:['مكتبة','مكتب','كتاب','مدرسة'], a:0},
      {q:'اختاري الصحيح: Nous ___ contents', opts:['sommes','êtes','sont','avons'], a:0},
      {q:'عكس "tôt" (مبكرًا):', opts:['tard','vite','lentement','hier'], a:0},
      {q:'ما معنى "Il pleut"؟', opts:['الجو ممطر','الجو مشمس','الجو بارد','الجو حار'], a:0}
    ],
    beg: [
      {q:'ما معنى <span class="q-foreign">Bonjour</span>؟', opts:['مساء الخير','وداعًا','مرحبًا','شكرًا'], a:2},
      {q:'كيف تقول «شكرًا» بالفرنسية؟', opts:['<span class="q-foreign">Pardon</span>','<span class="q-foreign">Merci</span>','<span class="q-foreign">Oui</span>','<span class="q-foreign">Bonsoir</span>'], a:1},
      {q:'<span class="q-foreign">Oui</span> تعني:', opts:['لا','ربما','نعم','أبدًا'], a:2},
      {q:'الرقم <span class="q-foreign">Trois</span> هو:', opts:['٢','٣','٤','٥'], a:1},
      {q:'ما معنى <span class="q-foreign">L\'eau</span>؟', opts:['الخبز','الحليب','العصير','الماء'], a:3}
    ],
    mid: [
      {q:'ما معنى <span class="q-foreign">D\'où viens-tu?</span>', opts:['كم عمرك؟','من أين أنتِ؟','ماذا تعملين؟','أين تسكنين؟'], a:1},
      {q:'<span class="q-foreign">J\'ai vingt ans</span> تعني:', opts:['عمري عشرون سنة','أنا من مصر','أنا طالبة','أنا بخير'], a:0},
      {q:'ما معنى <span class="q-foreign">D\'accord</span>؟', opts:['وداعًا','عذرًا','حسنًا / موافقة','شكرًا'], a:2},
      {q:'<span class="q-foreign">À tout à l\'heure</span> تعني:', opts:['أراك لاحقًا','صباح الخير','تصبح على خير','أهلاً بك'], a:0},
      {q:'كيف تقول «أنا طالبة» بالفرنسية؟', opts:['<span class="q-foreign">Je suis étudiante</span>','<span class="q-foreign">Je suis professeur</span>','<span class="q-foreign">Je suis médecin</span>','<span class="q-foreign">Je suis ingénieure</span>'], a:0}
    ],
    adv: [
      {q:'ما معنى <span class="q-foreign">Pas de problème</span>؟', opts:['مشكلة كبيرة','لا مشكلة','عذرًا','مع السلامة'], a:1},
      {q:'<span class="q-foreign">Bien sûr</span> تعني:', opts:['بالتأكيد','ربما','أبدًا','أحيانًا'], a:0},
      {q:'ما معنى <span class="q-foreign">Je t\'en prie</span>؟', opts:['أرجوك','عفوًا / على الرحب','شكرًا جزيلًا','أنا آسفة'], a:1},
      {q:'<span class="q-foreign">Ça m\'est égal</span> تعني:', opts:['هذا ممتاز','أنا متعبة','لا يفرق معي','معي مال'], a:2},
      {q:'ما معنى <span class="q-foreign">Quel âge as-tu?</span>', opts:['ما اسمك؟','أين تسكنين؟','ماذا تعملين؟','كم عمرك؟'], a:3}
    ]
  },
  de: {
    pro: [
      {q:'أكملي: Ich ___ gestern ins Kino gegangen', opts:['habe','bin','war','hatte'], a:1},
      {q:'ما معنى "Krankenhaus"؟', opts:['مستشفى','مدرسة','سوق','فندق'], a:0},
      {q:'ما أداة التعريف الصحيحة: ___ Wasser', opts:['der','die','das','dem'], a:2},
      {q:'عكس "schnell" (سريع):', opts:['langsam','laut','leicht','stark'], a:0},
      {q:'ما معنى "Es schneit"؟', opts:['الجو مثلج','الجو ممطر','الجو حار','الجو عاصف'], a:0}
    ],
    beg: [
      {q:'ما معنى <span class="q-foreign">Hallo</span>؟', opts:['مرحبًا','وداعًا','شكرًا','عذرًا'], a:0},
      {q:'كيف تقول «شكرًا» بالألمانية؟', opts:['<span class="q-foreign">Bitte</span>','<span class="q-foreign">Ja</span>','<span class="q-foreign">Danke</span>','<span class="q-foreign">Nein</span>'], a:2},
      {q:'<span class="q-foreign">Ja</span> تعني:', opts:['لا','نعم','ربما','أمس'], a:1},
      {q:'الرقم <span class="q-foreign">Fünf</span> هو:', opts:['٤','٥','٦','٧'], a:1},
      {q:'ما معنى <span class="q-foreign">Brot</span>؟', opts:['الماء','الجبن','الخبز','التفاح'], a:2}
    ],
    mid: [
      {q:'ما معنى <span class="q-foreign">Woher kommst du?</span>', opts:['كم عمرك؟','من أين أنتِ؟','ما اسمك؟','أين تسكنين؟'], a:1},
      {q:'<span class="q-foreign">Ich komme aus Ägypten</span> تعني:', opts:['أنا أسكن في مصر','أنا أحب مصر','أنا من مصر','أنا أسافر إلى مصر'], a:2},
      {q:'ما معنى <span class="q-foreign">Kein Problem</span>؟', opts:['مشكلة كبيرة','لا مشكلة','عذرًا','مع السلامة'], a:1},
      {q:'<span class="q-foreign">Bis später</span> تعني:', opts:['صباح الخير','تصبح على خير','إلى اللقاء لاحقًا','أهلاً وسهلاً'], a:2},
      {q:'كيف تقول «أنا طالبة» بالألمانية؟', opts:['<span class="q-foreign">Ich bin Lehrerin</span>','<span class="q-foreign">Ich bin Studentin</span>','<span class="q-foreign">Ich bin Ärztin</span>','<span class="q-foreign">Ich bin Schülerin</span>'], a:1}
    ],
    adv: [
      {q:'ما معنى <span class="q-foreign">Na klar</span>؟', opts:['بالتأكيد / طبعًا','لا أبدًا','عذرًا','مع السلامة'], a:0},
      {q:'<span class="q-foreign">Alles Gute</span> تعني:', opts:['كل شيء بخير','كل التوفيق','صباح الخير','شكرًا جزيلًا'], a:1},
      {q:'ما معنى <span class="q-foreign">Mach\'s gut</span>؟', opts:['افعلها الآن','أحسنت','اعتنِ بنفسك','أسرع'], a:2},
      {q:'<span class="q-foreign">Schön, dich kennenzulernen</span> تعني:', opts:['سعيد بالتعرف عليكِ','أراك غدًا','أنا مشغولة','تفضلي بالجلوس'], a:0},
      {q:'ما معنى <span class="q-foreign">Wie alt bist du?</span>', opts:['من أين أنتِ؟','ما اسمك؟','كم عمرك؟','أين تسكنين؟'], a:2}
    ]
  },
  zh: {
    pro: [
      {q:'ما معنى "医生"؟', opts:['طبيب','مدرس','طالب','مهندس'], a:0},
      {q:'ما معنى "明天"؟', opts:['غدًا','أمس','اليوم','الآن'], a:0},
      {q:'ما معنى "我爱中国"؟', opts:['أحب الصين','أنا من الصين','الصين كبيرة','أعيش في الصين'], a:0},
      {q:'ما معنى "喝水"؟', opts:['يشرب ماء','يأكل خبز','ينام','يجري'], a:0},
      {q:'كيف تقولين "شكرًا جزيلًا"؟', opts:['非常感谢','你好','再见','没关系'], a:0}
    ],
    beg: [
      {q:'ما معنى <span class="q-foreign">你好 Nǐ hǎo</span>؟', opts:['وداعًا','مرحبًا','شكرًا','عذرًا'], a:1},
      {q:'كيف تقول «شكرًا» بالصينية؟', opts:['<span class="q-foreign">请 Qǐng</span>','<span class="q-foreign">对不起 Duìbuqǐ</span>','<span class="q-foreign">谢谢 Xièxie</span>','<span class="q-foreign">是 Shì</span>'], a:2},
      {q:'الرقم <span class="q-foreign">三 sān</span> هو:', opts:['٢','٣','٤','٥'], a:1},
      {q:'ما معنى <span class="q-foreign">水 Shuǐ</span>؟', opts:['الأرز','الشاي','الحليب','الماء'], a:3},
      {q:'<span class="q-foreign">是 Shì</span> تعني:', opts:['لا','نعم','ربما','أبدًا'], a:1}
    ],
    mid: [
      {q:'ما معنى <span class="q-foreign">你从哪里来？</span>', opts:['كم عمرك؟','من أين أنتِ؟','ما اسمك؟','أين تسكنين؟'], a:1},
      {q:'<span class="q-foreign">我是学生</span> تعني:', opts:['أنا معلمة','أنا طبيبة','أنا طالبة','أنا سائحة'], a:2},
      {q:'<span class="q-foreign">我二十岁</span> تعني:', opts:['عمري عشرون سنة','أنا من مصر','أنا بخير','أنا طالبة'], a:0},
      {q:'ما معنى <span class="q-foreign">请 Qǐng</span>؟', opts:['شكرًا','عذرًا','من فضلك','نعم'], a:2},
      {q:'كيف تقول «عذرًا» بالصينية؟', opts:['<span class="q-foreign">谢谢 Xièxie</span>','<span class="q-foreign">对不起 Duìbuqǐ</span>','<span class="q-foreign">不是 Bú shì</span>','<span class="q-foreign">你好 Nǐ hǎo</span>'], a:1}
    ],
    adv: [
      {q:'ما معنى <span class="q-foreign">没问题 Méi wèntí</span>؟', opts:['مشكلة كبيرة','لا مشكلة','انتظر قليلاً','أنا لا أفهم'], a:1},
      {q:'<span class="q-foreign">当然 Dāngrán</span> تعني:', opts:['بالتأكيد / طبعًا','ربما','أبدًا','أحيانًا'], a:0},
      {q:'ما معنى <span class="q-foreign">一会儿见 Yīhuìr jiàn</span>؟', opts:['أراك غدًا','صباح الخير','أراك لاحقًا','تصبح على خير'], a:2},
      {q:'<span class="q-foreign">加油 Jiāyóu</span> تعني:', opts:['وداعًا','هيا! / بالتوفيق','آسف','ببطء'], a:1},
      {q:'<span class="q-foreign">祝你好运 Zhù nǐ hǎoyùn</span> تعني:', opts:['حظًا سعيدًا','عيد ميلاد سعيد','صحة وعافية','مرحبًا بك'], a:0}
    ]
  },
  ko: {
    beg: [
      {q:'ما معنى <span class="q-foreign">안녕하세요 Annyeonghaseyo</span>؟', opts:['شكرًا','مرحبًا','مع السلامة','عذرًا'], a:1},
      {q:'<span class="q-foreign">감사합니다 Gamsahamnida</span> تعني:', opts:['مرحبًا','عذرًا','شكرًا','نعم'], a:2},
      {q:'<span class="q-foreign">사랑해 Saranghae</span> تعني:', opts:['بحبك','صباح الخير','تصبحي على خير','شكرًا'], a:0},
      {q:'<span class="q-foreign">네 Ne</span> تعني:', opts:['لا','ربما','نعم','لماذا'], a:2},
      {q:'<span class="q-foreign">하나 Hana</span> تعني:', opts:['اثنان','واحد','ثلاثة','عشرة'], a:1}
    ],
    mid: [
      {q:'<span class="q-foreign">화이팅 Hwaiting</span> تعني:', opts:['وداعًا','شدي حيلك / يلا بينا','آسفة','مرحبًا'], a:1},
      {q:'<span class="q-foreign">잘자 Jalja</span> تعني:', opts:['صباح الخير','كيف حالك؟','تصبحي على خير','أنا جائعة'], a:2},
      {q:'<span class="q-foreign">미안해 Mianhae</span> تعني:', opts:['شكرًا','بحبك','تمام','آسفة'], a:3},
      {q:'<span class="q-foreign">맛있어 Masisseo</span> تعني:', opts:['لذيذ','جميل','سريع','بعيد'], a:0},
      {q:'<span class="q-foreign">친구 Chingu</span> تعني:', opts:['عائلة','مدرسة','صديق','بيت'], a:2}
    ],
    adv: [
      {q:'<span class="q-foreign">천천히 말해 주세요</span> تعني:', opts:['اتكلمي بسرعة','اتكلمي ببطء من فضلك','اسمعيني','اكتبيها'], a:1},
      {q:'<span class="q-foreign">어디에 가요? Eodie gayo?</span> تعني:', opts:['كيف حالك؟','ما اسمك؟','رايحة فين؟','كم الساعة؟'], a:2},
      {q:'<span class="q-foreign">얼마예요? Eolmayeyo?</span> تعني:', opts:['بكام؟','فين؟','إمتى؟','ليه؟'], a:0},
      {q:'<span class="q-foreign">도와주세요 Dowajuseyo</span> تعني:', opts:['مع السلامة','ساعديني','تفضلي','مبروك'], a:1},
      {q:'<span class="q-foreign">알겠습니다 Algesseumnida</span> تعني:', opts:['لا أفهم','فهمت','مش متأكدة','مستحيل'], a:1}
    ],
    pro: [
      {q:'<span class="q-foreign">한국어를 배우고 있어요</span> تعني:', opts:['أنا بتعلم الكورية','أنا بدرّس الكورية','الكورية صعبة','الكورية سهلة'], a:0},
      {q:'<span class="q-foreign">저는 학생입니다</span> تعني:', opts:['أنا معلمة','أنا طالبة','أنا طبيبة','أنا سائحة'], a:1},
      {q:'<span class="q-foreign">만나서 반갑습니다</span> تعني:', opts:['إلى اللقاء','سعيدة بلقائك','تصبح على خير','أراك غدًا'], a:1},
      {q:'<span class="q-foreign">걱정하지 마세요</span> تعني:', opts:['انتبهي!','استعجلي','متقلقيش','اسمعيني'], a:2},
      {q:'<span class="q-foreign">다음에 또 만나요</span> تعني:', opts:['نشوفك المرة الجاية','أهلًا بعودتك','مع السلامة للأبد','أنا مشيت'], a:0}
    ]
  }
};
const LANG_NAMES = {en:'الإنجليزية', fr:'الفرنسية', de:'الألمانية', zh:'الصينية', ko:'الكورية'};

let cur = {lang:'en', level:'beg', i:0, score:0, locked:false};
const LEVEL_NAMES = {beg:'المبتدئ', mid:'المتوسط', adv:'المتقدم', pro:'المحترف 💎', weekly:'تحدي الأسبوع 🏆'};

function bestKey(lang, level){ return 'lingua_best_'+lang+'_'+level; }
function showBest(lang, level){
  const b = localStorage.getItem(bestKey(lang, level));
  document.getElementById('bestScore').textContent =
    b !== null ? ('🏆 أفضل نتيجة لك في '+LANG_NAMES[lang]+' — '+LEVEL_NAMES[level]+': '+b+' من '+QUIZZES[lang][level].length) : '';
}

function startQuiz(lang, level){
  cur = {lang:lang, level:(level || cur.level || 'beg'), i:0, score:0, locked:false};
  showBest(cur.lang, cur.level);
  renderQ();
}

function renderQ(){
  const box = document.getElementById('quizBox');
  const qs = QUIZZES[cur.lang][cur.level];
  if(cur.i >= qs.length){ return renderResult(); }
  const q = qs[cur.i];
  cur.locked = false;
  let html = '<div class="q-text">'+(cur.i+1)+'. '+q.q+'</div>';
  q.opts.forEach(function(o, idx){
    html += '<button class="opt" data-i="'+idx+'">'+o+'</button>';
  });
  html += '<div class="quiz-foot"><span>سؤال '+(cur.i+1)+' من '+qs.length+'</span><span>النقاط: '+cur.score+'</span></div>';
  box.innerHTML = html;
  if(getHints() > 0){
    const hb = document.createElement('button');
    hb.className = 'btn hint-btn';
    hb.textContent = '💡 استخدمي تلميح (عندك ' + getHints() + ')';
    hb.addEventListener('click', function(){
      if(!spendHint()) return;
      const q2 = QUIZZES[cur.lang][cur.level][cur.i];
      box.querySelectorAll('.opt')[q2.a].classList.add('correct');
      hb.remove();
    });
    box.appendChild(hb);
  }
  box.querySelectorAll('.opt').forEach(function(btn){
    btn.addEventListener('click', function(){ answer(parseInt(btn.dataset.i,10)); });
  });
}

function answer(idx){
  if(cur.locked) return;
  cur.locked = true;
  const q = QUIZZES[cur.lang][cur.level][cur.i];
  const opts = document.querySelectorAll('#quizBox .opt');
  opts.forEach(function(o, i){
    if(i === q.a) o.classList.add('correct');
    else if(i === idx) o.classList.add('wrong');
  });
  if(idx === q.a){ cur.score++; sndGood(); } else { sndBad(); }
  setTimeout(function(){
    cur.i++;
    renderQ();
  }, 900);
}

function renderResult(){
  const box = document.getElementById('quizBox');
  const total = QUIZZES[cur.lang][cur.level].length;
  const mult = (cur.level === 'weekly') ? 2 : 1;
  awardPoints((cur.score*10 + (cur.score===total ? 50 : 0)) * mult, cur.level==='weekly' ? 'تحدي الأسبوع ×2' : 'من الاختبار');
  if(window.__chal && window.__chal.lang === cur.lang && window.__chal.level === cur.level){
    logChal('ضد ' + window.__chal.name + ': جبتِ ' + cur.score + ' وهي ' + window.__chal.score + (cur.score > window.__chal.score ? ' — كسّرتيها! 🔥' : (cur.score === window.__chal.score ? ' — تعادل 🤝' : ' — الجاية عليكي 💪')));
    window.__chal = null;
  }
  const prev = parseInt(localStorage.getItem(bestKey(cur.lang, cur.level)) || '-1', 10);
  if(cur.score > prev) localStorage.setItem(bestKey(cur.lang, cur.level), String(cur.score));
  let msg;
  if(cur.score === total){ msg = 'مذهل! علامة كاملة 🌟'; sndWin(); confetti(); }
  else if(cur.score >= total-1) msg = 'ممتاز! أنتِ قريبة جدًا من العلامة الكاملة';
  else if(cur.score >= total/2) msg = 'جيد جدًا! راجعي الدروس وحاولي من جديد';
  else msg = 'بداية شجاعة! اقرئي الدروس ثم أعيدي المحاولة';
  box.innerHTML =
    '<div class="result"><div class="score">'+cur.score+' / '+total+'</div>'+
    '<p>'+msg+'</p>'+
    (cur.score === total ? '<button class="btn" id="certBtn" style="margin-inline-end:8px">🎓 احصلي على شهادتك</button>' : '')+
    '<button class="btn" id="challengeBtn" style="margin-inline-end:8px;background:linear-gradient(120deg,#b79bf0,#7c5cd6);color:#fff">⚔️ تحدي صاحبك</button>'+
    '<button class="btn" id="retryBtn">إعادة الاختبار ↺</button></div>';
  document.getElementById('retryBtn').addEventListener('click', function(){ startQuiz(cur.lang, cur.level); });
  if(cur.score === total){
    document.getElementById('certBtn').addEventListener('click', function(){ showCert(cur.lang, cur.level); });
  }
  document.getElementById('challengeBtn').addEventListener('click', function(){
    shareChallenge('c', [cur.lang, cur.level, cur.score, total]);
  });
  showBest(cur.lang, cur.level);
  if(window.refreshDash) window.refreshDash();
}

/* ================= Certificate ================= */
function showCert(lang, level){
  document.getElementById('certLang').textContent = LANG_NAMES[lang];
  document.getElementById('certLevel').textContent = LEVEL_NAMES[level];
  const d = new Date();
  document.getElementById('certDate').textContent =
    'بتاريخ ' + d.toLocaleDateString('ar-EG', {year:'numeric', month:'long', day:'numeric'});
  const saved = localStorage.getItem('lingua_cert_name');
  if(saved){
    document.getElementById('certName').textContent = saved;
    document.getElementById('certNameInput').value = saved;
  }
  document.getElementById('certOverlay').classList.add('show');
}
document.getElementById('certNameInput').addEventListener('input', function(e){
  const v = e.target.value.trim();
  document.getElementById('certName').textContent = v || 'متعلّمة لينجوا';
  localStorage.setItem('lingua_cert_name', v);
});
document.getElementById('certPrint').addEventListener('click', function(){ window.print(); });
document.getElementById('certClose').addEventListener('click', function(){
  document.getElementById('certOverlay').classList.remove('show');
});
document.getElementById('certOverlay').addEventListener('click', function(e){
  if(e.target === this) this.classList.remove('show');
});

/* ---- v14: downloadable PDF certificate ---- */
function loadJsPDF(){
  return new Promise(function(res, rej){
    if(window.jspdf) return res(window.jspdf.jsPDF);
    var sc = document.createElement('script');
    sc.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
    sc.onload = function(){ res(window.jspdf.jsPDF); };
    sc.onerror = rej;
    document.head.appendChild(sc);
  });
}
function drawCertCanvas(){
  var W = 1600, H = 1131;
  var cv = document.createElement('canvas'); cv.width = W; cv.height = H;
  var x = cv.getContext('2d');
  x.fillStyle = '#0c0914'; x.fillRect(0,0,W,H);
  var g = x.createRadialGradient(W/2,H/2,80,W/2,H/2,900);
  g.addColorStop(0,'rgba(90,60,184,.28)'); g.addColorStop(1,'rgba(12,9,20,0)');
  x.fillStyle = g; x.fillRect(0,0,W,H);
  x.strokeStyle = '#d4af37'; x.lineWidth = 10; x.strokeRect(46,46,W-92,H-92);
  x.strokeStyle = 'rgba(212,175,55,.45)'; x.lineWidth = 3; x.strokeRect(66,66,W-132,H-132);
  x.textAlign = 'center'; x.direction = 'rtl';
  x.fillStyle = '#f5d76e'; x.font = '700 64px "Readex Pro", "IBM Plex Sans Arabic", sans-serif';
  x.fillText('LINGUA ✦ لينجوا', W/2, 180);
  x.fillStyle = '#fff'; x.font = '800 88px "Readex Pro", "IBM Plex Sans Arabic", sans-serif';
  x.fillText('شهادة إتمام مستوى', W/2, 330);
  x.fillStyle = '#b9b2cc'; x.font = '500 44px "IBM Plex Sans Arabic", sans-serif';
  x.fillText('تشهد منصة لينجوا بأن', W/2, 440);
  x.fillStyle = '#f5d76e'; x.font = '900 96px "Readex Pro", "IBM Plex Sans Arabic", sans-serif';
  x.fillText(document.getElementById('certName').textContent, W/2, 590);
  x.strokeStyle = '#d4af37'; x.lineWidth = 2;
  x.beginPath(); x.moveTo(W/2-380, 640); x.lineTo(W/2+380, 640); x.stroke();
  x.fillStyle = '#fff'; x.font = '600 46px "IBM Plex Sans Arabic", sans-serif';
  x.fillText('أتمّت بنجاح اختبار ' + document.getElementById('certLang').textContent + ' — المستوى ' + document.getElementById('certLevel').textContent + ' بعلامة كاملة', W/2, 740);
  x.font = '110px serif'; x.fillText('🏅', W/2, 900);
  x.fillStyle = '#b9b2cc'; x.font = '500 38px "IBM Plex Sans Arabic", sans-serif';
  x.fillText(document.getElementById('certDate').textContent, W/2, 1000);
  return cv;
}
document.getElementById('certPDF').addEventListener('click', function(){
  var btn = this; btn.textContent = '⏳ بنجهزها...';
  loadJsPDF().then(function(jsPDF){
    var cv = drawCertCanvas();
    var pdf = new jsPDF({orientation:'landscape', unit:'mm', format:'a4'});
    pdf.addImage(cv.toDataURL('image/jpeg', 0.92), 'JPEG', 0, 0, 297, 210);
    pdf.save('lingua-certificate.pdf');
    btn.textContent = '📥 حمليها PDF';
  }).catch(function(){
    var cv = drawCertCanvas();
    var a = document.createElement('a');
    a.download = 'lingua-certificate.png'; a.href = cv.toDataURL('image/png'); a.click();
    btn.textContent = '📥 حمليها PDF';
  });
});

/* ================= Memory game ================= */
const GAME_WORDS = {
  en: [['Hello','مرحبًا'],['Book','كتاب'],['Water','ماء'],['Friend','صديق'],['Sun','شمس'],['House','بيت'],['Moon','قمر'],['Love','حب'],['Cat','قطة'],['Dog','كلب'],['Bread','خبز'],['Milk','حليب']],
  fr: [['Bonjour','مرحبًا'],['Livre','كتاب'],['Eau','ماء'],['Ami','صديق'],['Soleil','شمس'],['Maison','بيت'],['Lune','قمر'],['Amour','حب'],['Chat','قطة'],['Chien','كلب'],['Pain','خبز'],['Lait','حليب']],
  de: [['Hallo','مرحبًا'],['Buch','كتاب'],['Wasser','ماء'],['Freund','صديق'],['Sonne','شمس'],['Haus','بيت'],['Mond','قمر'],['Liebe','حب'],['Katze','قطة'],['Hund','كلب'],['Brot','خبز'],['Milch','حليب']],
  zh: [['你好','مرحبًا'],['书','كتاب'],['水','ماء'],['朋友','صديق'],['太阳','شمس'],['房子','بيت'],['月亮','قمر'],['爱','حب'],['猫','قطة'],['狗','كلب'],['面包','خبز'],['牛奶','حليب']],
  ko: [['안녕하세요','مرحبًا'],['책','كتاب'],['물','ماء'],['친구','صديق'],['태양','شمس'],['집','بيت'],['달','قمر'],['사랑','حب'],['고양이','قطة'],['개','كلب'],['빵','خبز'],['우유','حليب']]
};
let game = {lang:'en', first:null, lock:false, moves:0, matched:0};

function gameBestKey(lang){ return 'lingua_game_best_' + lang; }
function showGameBest(){
  const b = localStorage.getItem(gameBestKey(game.lang));
  document.getElementById('gameBest').innerHTML =
    b !== null ? '⭐ أقل عدد حركات في '+LANG_NAMES[game.lang]+': <b>'+b+'</b>' : '';
}
function newGame(lang){
  game = {lang:lang, first:null, lock:false, moves:0, matched:0};
  document.getElementById('gameMoves').textContent = '0';
  document.getElementById('gameWin').textContent = '';
  showGameBest();
  const all = GAME_WORDS[lang].slice();
  for(let i=all.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));const t=all[i];all[i]=all[j];all[j]=t;}
  const pairs = all.slice(0,6);
  const cards = [];
  pairs.forEach(function(p, i){
    cards.push({pair:i, text:p[0], ar:false});
    cards.push({pair:i, text:p[1], ar:true});
  });
  for(let i = cards.length-1; i > 0; i--){
    const j = Math.floor(Math.random()*(i+1));
    const t = cards[i]; cards[i] = cards[j]; cards[j] = t;
  }
  const grid = document.getElementById('gameGrid');
  grid.innerHTML = '';
  cards.forEach(function(c){
    const btn = document.createElement('button');
    btn.className = 'gcard';
    btn.setAttribute('aria-label','بطاقة ذاكرة');
    btn.innerHTML =
      '<div class="inner">'+
        '<div class="gface back">✦</div>'+
        '<div class="gface front'+(c.ar?' ar':'')+'">'+c.text+'</div>'+
      '</div>';
    btn.addEventListener('click', function(){ flipCard(btn, c); });
    grid.appendChild(btn);
  });
}
function flipCard(btn, card){
  if(game.lock || btn.classList.contains('flipped') || btn.classList.contains('matched')) return;
  btn.classList.add('flipped');
  if(!game.first){
    game.first = {btn:btn, card:card};
    return;
  }
  game.moves++;
  document.getElementById('gameMoves').textContent = game.moves;
  const a = game.first, b = {btn:btn, card:card};
  game.first = null;
  if(a.card.pair === b.card.pair){
    game.lock = true;
    setTimeout(function(){
      a.btn.classList.add('matched');
      b.btn.classList.add('matched');
      game.matched++;
      game.lock = false;
      if(game.matched === GAME_WORDS[game.lang].length) winGame();
    }, 350);
  } else {
    game.lock = true;
    setTimeout(function(){
      a.btn.classList.remove('flipped');
      b.btn.classList.remove('flipped');
      game.lock = false;
    }, 850);
  }
}
function winGame(){
  const key = gameBestKey(game.lang);
  const prev = parseInt(localStorage.getItem(key) || '9999', 10);
  let extra = '';
  if(game.moves < prev){
    localStorage.setItem(key, String(game.moves));
    extra = ' — رقم قياسي جديد! 🏆';
  }
  document.getElementById('gameWin').innerHTML =
    '🎉 أحسنتِ! أكملتِ كل الأزواج في '+game.moves+' حركة'+extra+
    ' <button class="btn" id="gameChallenge" style="padding:8px 18px;font-size:.85rem;margin-inline-start:10px;background:linear-gradient(120deg,#b79bf0,#7c5cd6);color:#fff">⚔️ تحدي صاحبك</button>';
  document.getElementById('gameChallenge').addEventListener('click', function(){
    shareChallenge('g', [game.lang, game.moves]);
  });
  showGameBest();
}
document.querySelectorAll('#gameTabs .tab').forEach(function(t){
  t.addEventListener('click', function(){
    document.querySelectorAll('#gameTabs .tab').forEach(function(x){x.classList.remove('active')});
    t.classList.add('active');
    startGameType(t.dataset.lang);
  });
});
document.getElementById('gameRestart').addEventListener('click', function(){ newGame(game.lang); });
newGame('en');

/* ================= v3: scroll reveal ================= */
(function(){
  const els = document.querySelectorAll('.feature,.course,.lesson,.video-card,.dash-card,.testi,.wotd,.quiz-box,.speak-card,.sec-title,.sec-sub,.vgroup-title');
  els.forEach(function(e){ e.classList.add('reveal'); });
  const io = new IntersectionObserver(function(entries){
    entries.forEach(function(en){
      if(en.isIntersecting){ en.target.classList.add('in'); io.unobserve(en.target); }
    });
  }, {threshold:.12});
  els.forEach(function(e){ io.observe(e); });
})();

/* ================= v3: sound feedback (WebAudio, no files) ================= */
let AC = null;
function tone(freq, dur, type, vol, when){
  try{
    AC = AC || new (window.AudioContext || window.webkitAudioContext)();
    const o = AC.createOscillator(), g = AC.createGain();
    o.type = type || 'sine'; o.frequency.value = freq;
    g.gain.setValueAtTime(0.0001, AC.currentTime + (when||0));
    g.gain.exponentialRampToValueAtTime(vol || .12, AC.currentTime + (when||0) + .02);
    g.gain.exponentialRampToValueAtTime(0.0001, AC.currentTime + (when||0) + (dur||.15));
    o.connect(g); g.connect(AC.destination);
    o.start(AC.currentTime + (when||0)); o.stop(AC.currentTime + (when||0) + (dur||.15) + .05);
  }catch(e){}
}
function sndGood(){ tone(660,.12,'sine',.12); tone(880,.18,'sine',.12,.1); }
function sndBad(){ tone(220,.25,'sawtooth',.06); }
function sndWin(){ [523,659,784,1047].forEach(function(f,i){ tone(f,.22,'sine',.12,i*.12); }); }

/* ================= v3: confetti ================= */
function confetti(){
  const cv = document.getElementById('confetti');
  const ctx = cv.getContext('2d');
  cv.width = innerWidth; cv.height = innerHeight;
  const colors = ['#d4af37','#f5e08c','#7c5cd6','#ffffff','#4ade80'];
  const parts = [];
  for(let i=0;i<140;i++){
    parts.push({
      x: Math.random()*cv.width, y: -20 - Math.random()*cv.height*.5,
      w: 5+Math.random()*7, h: 8+Math.random()*10,
      c: colors[Math.floor(Math.random()*colors.length)],
      vy: 2+Math.random()*3.5, vx: -1.5+Math.random()*3,
      r: Math.random()*Math.PI, vr: -.1+Math.random()*.2
    });
  }
  let frames = 0;
  (function tick(){
    ctx.clearRect(0,0,cv.width,cv.height);
    parts.forEach(function(p){
      p.y += p.vy; p.x += p.vx; p.r += p.vr;
      ctx.save(); ctx.translate(p.x,p.y); ctx.rotate(p.r);
      ctx.fillStyle = p.c; ctx.fillRect(-p.w/2,-p.h/2,p.w,p.h);
      ctx.restore();
    });
    if(++frames < 260) requestAnimationFrame(tick);
    else ctx.clearRect(0,0,cv.width,cv.height);
  })();
}

/* ================= v3: word of the day ================= */
const WOTD = {
  en: ['Serendipity|مصادفة سعيدة','Brave|شجاع','Journey|رحلة','Shine|تألّق','Dream|حلم','Wisdom|حكمة','Freedom|حرية','Hope|أمل','Peace|سلام','Smile|ابتسامة','Bloom|تفتّح','Wonder|دهشة'],
  fr: ['Amour|حب','Étoile|نجمة','Bonheur|سعادة','Rêve|حلم','Lumière|ضوء','Espoir|أمل','Paix|سلام','Courage|شجاعة','Sourire|ابتسامة','Liberté|حرية','Soleil|شمس','Mer|بحر'],
  de: ['Glück|سعادة','Herz|قلب','Stern|نجمة','Traum|حلم','Licht|ضوء','Hoffnung|أمل','Frieden|سلام','Mut|شجاعة','Liebe|حب','Freiheit|حرية','Sonne|شمس','Welt|عالم'],
  zh: ['爱|حب','星星|نجمة','幸福|سعادة','梦|حلم','光|ضوء','希望|أمل','和平|سلام','勇气|شجاعة','微笑|ابتسامة','自由|حرية','太阳|شمس','月亮|قمر'],
  ko: ['사랑|حب','별|نجمة','행복|سعادة','꿈|حلم','빛|ضوء','희망|أمل','평화|سلام','용기|شجاعة','미소|ابتسامة','자유|حرية','태양|شمس','달|قمر']
};
(function(){
  const day = Math.floor((Date.now() - new Date(new Date().getFullYear(),0,0).getTime())/86400000);
  const flags = {en:'🇬🇧 الإنجليزية', fr:'🇫🇷 الفرنسية', de:'🇩🇪 الألمانية', zh:'🇨🇳 الصينية', ko:'🇰🇷 الكورية'};
  const grid = document.getElementById('wotdGrid');
  let html = '';
  Object.keys(WOTD).forEach(function(lang){
    const w = WOTD[lang][day % WOTD[lang].length].split('|');
    html += '<div class="wotd">' +
      '<div class="w-lang">'+flags[lang]+'</div>' +
      '<div class="w-word"><span class="foreign">'+w[0]+'</span></div>' +
      '<div class="w-ar">'+w[1]+'</div>' +
      '<button class="row-listen" data-l="'+lang+'" data-w="'+w[0]+'" title="استمعي">🔊</button>' +
      '</div>';
  });
  grid.innerHTML = html;
  grid.querySelectorAll('.row-listen').forEach(function(b){
    b.addEventListener('click', function(){ speakText(b.dataset.w, b.dataset.l); tone(520,.08,'sine',.06); });
  });
})();

/* ================= v3: dashboard ================= */
window.refreshDash = function(){
  /* streak */
  const today = new Date().toDateString();
  let st = {last:'', count:0};
  try{ st = JSON.parse(localStorage.getItem('lingua_streak')) || st; }catch(e){}
  if(st.last !== today){
    const y = new Date(Date.now()-86400e3).toDateString();
    const y2 = new Date(Date.now()-2*86400e3).toDateString();
    if(st.last !== y && st.last === y2 && st.count > 0 && parseInt(localStorage.getItem('lingua_streak_freeze')||'0',10) > 0){
      /* streak freeze: one missed day, consume a freeze and keep the streak */
      localStorage.setItem('lingua_streak_freeze', String(parseInt(localStorage.getItem('lingua_streak_freeze')||'0',10)-1));
      st.count = st.count + 1;
      st.last = today;
      localStorage.setItem('lingua_streak', JSON.stringify(st));
      setTimeout(function(){ if(window.toast) toast('\u{1F9CA} \u0627\u0644\u062a\u062c\u0645\u064a\u062f \u062d\u0645\u0627\u0643\u064a \u0648\u0633\u0644\u0633\u0644\u062a\u0643 \u0643\u0645\u0644\u062a \u{1F525}'); }, 700);
    } else {
      st.count = (st.last === y) ? st.count + 1 : 1;
      st.last = today;
      localStorage.setItem('lingua_streak', JSON.stringify(st));
    }
    if(st.count > 0 && st.count % 7 === 0 && localStorage.getItem('lingua_freeze_grant') !== String(st.count)){
      localStorage.setItem('lingua_freeze_grant', String(st.count));
      localStorage.setItem('lingua_streak_freeze', String(parseInt(localStorage.getItem('lingua_streak_freeze')||'0',10)+1));
    }
  }
  document.getElementById('dStreak').textContent = st.count;
  /* quiz stats */
  let quizzes = 0, perfect = 0, games = 0;
  const levelsDone = {en:0, fr:0, de:0, zh:0, ko:0};
  ['en','fr','de','zh','ko'].forEach(function(l){
    ['beg','mid','adv'].forEach(function(v){
      const b = localStorage.getItem('lingua_best_'+l+'_'+v);
      if(b !== null){ quizzes++; levelsDone[l]++; if(parseInt(b,10) === QUIZZES[l][v].length) perfect++; }
    });
    if(localStorage.getItem('lingua_game_best_'+l) !== null) games++;
  });
  document.getElementById('dQuizzes').textContent = quizzes;
  document.getElementById('dPerfect').textContent = perfect;
  document.getElementById('dGames').textContent = games;
  const pts = parseInt(localStorage.getItem('lingua_points')||'0',10);
  document.getElementById('dPoints').textContent = pts;
  try {
    const lvl = levelOf(getLifetime());
    let customTitle = '';
    try { customTitle = localStorage.getItem('lingua_title') || ''; } catch(e){}
    document.getElementById('dashBadge').textContent = 'لقبك الحالي: ' + (customTitle || lvl.name);
    if(document.getElementById('lvlName')){
      document.getElementById('lvlName').textContent = lvl.name;
      document.getElementById('lvlFill').style.width = lvl.pct + '%';
      document.getElementById('lvlText').textContent = lvl.next
        ? ('فاضل ' + (lvl.next - getLifetime()) + ' نقطة على مستوى ' + lvl.nextName + ' — مجموع نقاطك الكلي ' + getLifetime())
        : ('وصلتي لأعلى مستوى! مجموع نقاطك الكلي ' + getLifetime() + ' 👑');
    }
    if(window.renderShop) window.renderShop();
    if(window.renderBadges) window.renderBadges();
  } catch(e){}
  /* per-language progress bars */
  const flags = {en:'🇬🇧 الإنجليزية', fr:'🇫🇷 الفرنسية', de:'🇩🇪 الألمانية', zh:'🇨🇳 الصينية', ko:'🇰🇷 الكورية'};
  let html = '';
  ['en','fr','de','zh','ko'].forEach(function(l){
    const pct = Math.round(100*levelsDone[l]/3);
    html += '<div class="prog-row"><div class="p-head"><span>'+flags[l]+'</span><span>'+pct+'%</span></div>' +
      '<div class="p-track"><div class="p-fill" data-w="'+pct+'"></div></div></div>';
  });
  document.getElementById('dashBars').innerHTML = html;
  setTimeout(function(){
    document.querySelectorAll('.p-fill').forEach(function(f){ f.style.width = f.dataset.w + '%'; });
  }, 400);
};
window.refreshDash();

/* ================= Text-to-speech helper ================= */
const TTS_LANGS = {en:'en-US', fr:'fr-FR', de:'de-DE', zh:'zh-CN', ko:'ko-KR'};
function speakText(text, lang){
  if(!('speechSynthesis' in window)) return;
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = TTS_LANGS[lang] || 'en-US';
  u.rate = 0.85;
  speechSynthesis.speak(u);
}

/* ================= Interactive lessons ================= */
/* listen button on every vocabulary row + tap-to-reveal meanings */
document.querySelectorAll('.lang-panel').forEach(function(panel){
  const lang = panel.dataset.lang;
  panel.querySelectorAll('table').forEach(function(tbl){
    tbl.querySelectorAll('tbody tr').forEach(function(tr){
      const tds = tr.querySelectorAll('td');
      if(tds.length < 2) return;
      /* pick the cell holding the foreign text */
      let foreignIdx = 0;
      if(/^[\d\u0660-\u0669\s.,:;\-؟?!]*$/.test(tds[0].textContent.trim())) foreignIdx = 1;
      const foreign = tds[foreignIdx].textContent.trim();
      const btn = document.createElement('button');
      btn.className = 'row-listen';
      btn.type = 'button';
      btn.title = 'استمعي للنطق';
      btn.textContent = '🔊';
      btn.addEventListener('click', function(ev){
        ev.stopPropagation();
        speakText(foreign, lang);
      });
      tds[foreignIdx].appendChild(btn);
    });
  });
  /* tap-to-reveal toggle for each lesson */
  panel.querySelectorAll('.lesson').forEach(function(lesson){
    const tbl = lesson.querySelector('table');
    if(!tbl) return;
    const t = document.createElement('button');
    t.className = 'reveal-toggle';
    t.type = 'button';
    t.textContent = '🙈 اختبري نفسك: إخفاء المعاني';
    let hidden = false;
    t.addEventListener('click', function(){
      hidden = !hidden;
      tbl.classList.toggle('blur-mean', hidden);
      t.textContent = hidden ? '👁️ إظهار المعاني' : '🙈 اختبري نفسك: إخفاء المعاني';
    });
    lesson.insertBefore(t, tbl);
    tbl.querySelectorAll('tbody tr').forEach(function(tr){
      const tds = tr.querySelectorAll('td');
      if(tds.length < 2) return;
      const meanTd = tds[1];
      meanTd.classList.add('mean-cell');
      meanTd.addEventListener('click', function(){
        if(tbl.classList.contains('blur-mean')) meanTd.classList.add('peek');
      });
    });
  });
});

/* ================= Pronunciation trainer ================= */
const SPEAK_PHRASES = {
  en: [['Hello','مرحبًا'],['Good morning','صباح الخير'],['How are you?','كيف حالك؟'],['Thank you very much','شكرًا جزيلًا'],["What's your name?",'ما اسمك؟'],['I love learning English','أنا أحب تعلّم الإنجليزية'],['See you later','أراكِ لاحقًا'],['Excuse me','لو سمحتِ']],
  fr: [['Bonjour','مرحبًا'],['Merci beaucoup','شكرًا جزيلًا'],["Comment ça va?",'كيف حالك؟'],["S'il vous plaît",'من فضلك'],['Bonne nuit','تصبحين على خير'],['Enchanté','تشرّفت بمعرفتك'],['Au revoir','إلى اللقاء'],['Je suis contente','أنا سعيدة']],
  de: [['Hallo','مرحبًا'],['Guten Morgen','صباح الخير'],["Wie geht's?",'كيف حالك؟'],['Danke schön','شكرًا جزيلًا'],['Auf Wiedersehen','إلى اللقاء'],['Entschuldigung','عذرًا'],['Gute Nacht','تصبحين على خير'],['Ich lerne Deutsch','أنا أتعلّم الألمانية']],
  zh: [['你好','مرحبًا'],['谢谢','شكرًا'],['早上好','صباح الخير'],['你好吗','كيف حالك؟'],['再见','إلى اللقاء'],['对不起','عذرًا'],['没关系','لا بأس'],['我爱学中文','أنا أحب تعلّم الصينية']],
  ko: [['안녕하세요','مرحبًا'],['감사합니다','شكرًا'],['좋은 아침이에요','صباح الخير'],['어떻게 지내세요?','كيف حالك؟'],['안녕히 가세요','إلى اللقاء'],['미안해요','عذرًا'],['괜찮아요','لا بأس'],['한국어를 배우고 있어요','أنا بتعلم الكورية']]
};
const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
let sp = {lang:'en', i:0, listening:false};

function renderSpeak(){
  const p = SPEAK_PHRASES[sp.lang][sp.i];
  document.getElementById('speakPhrase').innerHTML = '<span class="foreign">'+p[0]+'</span>';
  document.getElementById('speakMean').textContent = p[1];
  document.getElementById('speakCount').textContent = (sp.i+1)+' / '+SPEAK_PHRASES[sp.lang].length;
}
function norm(s){
  return s.toLowerCase()
    .replace(/[\u064B-\u0652\u0640]/g,'')
    .replace(/[.,!?؟،;:'"«»()\-]/g,'')
    .replace(/\s+/g,' ').trim();
}
function scorePron(target, heard){
  const t = norm(target), h = norm(heard);
  if(!h) return 0;
  if(t === h) return 100;
  if(sp.lang === 'zh'){
    const tc = t.replace(/\s/g,'').split('');
    const hc = h.replace(/\s/g,'');
    let hit = 0;
    tc.forEach(function(c){ if(hc.includes(c)) hit++; });
    return Math.round(100*hit/Math.max(tc.length,1));
  }
  const tw = t.split(' '), hw = h.split(' ');
  let hit = 0;
  tw.forEach(function(w){ if(hw.some(function(x){return x===w || (w.length>3 && x.startsWith(w.slice(0,3)))})) hit++; });
  return Math.round(100*hit/Math.max(tw.length,1));
}
function bindSpeak(){
  document.getElementById('speakListen').addEventListener('click', function(){
    speakText(SPEAK_PHRASES[sp.lang][sp.i][0], sp.lang);
  });
  document.getElementById('speakPrev').addEventListener('click', function(){
    sp.i = (sp.i - 1 + SPEAK_PHRASES[sp.lang].length) % SPEAK_PHRASES[sp.lang].length;
    renderSpeak();
  });
  document.getElementById('speakNext').addEventListener('click', function(){
    sp.i = (sp.i + 1) % SPEAK_PHRASES[sp.lang].length;
    renderSpeak();
  });
  document.querySelectorAll('#speakTabs .tab').forEach(function(t){
    t.addEventListener('click', function(){
      document.querySelectorAll('#speakTabs .tab').forEach(function(x){x.classList.remove('active')});
      t.classList.add('active');
      sp.lang = t.dataset.lang; sp.i = 0;
      renderSpeak();
    });
  });
  if(!SR){
    document.getElementById('speakUnsupported').style.display = 'block';
    document.getElementById('speakRec').style.display = 'none';
    return;
  }
  const recBtn = document.getElementById('speakRec');
  const result = document.getElementById('speakResult');
  recBtn.addEventListener('click', function(){
    if(sp.listening) return;
    const rec = new SR();
    rec.lang = TTS_LANGS[sp.lang];
    rec.interimResults = false;
    rec.maxAlternatives = 1;
    sp.listening = true;
    recBtn.classList.add('listening');
    recBtn.textContent = '🎙️ أسمعك... قولي الجملة';
    result.textContent = 'استمعي لنفسك...';
    rec.onresult = function(ev){
      const heard = ev.results[0][0].transcript;
      const target = SPEAK_PHRASES[sp.lang][sp.i][0];
      const s = scorePron(target, heard);
      let cls = 'low', verdict = 'حاولي مرة أخرى — استمعي ثم أعيدي ببطء 💪';
      if(s >= 80){ cls = 'good'; verdict = 'ممتاز! نطق رائع 🌟'; }
      else if(s >= 50){ cls = 'mid'; verdict = 'قريب! ركّزي على المخارج أكثر 👍'; }
      result.innerHTML =
        '<span class="heard">سمعتك تقولين: «'+heard+'»</span>'+
        'دقة النطق: <span class="speak-score '+cls+'">'+s+'%</span><br>'+verdict;
    };
    rec.onerror = function(){
      result.textContent = 'لم أسمعك جيدًا — تأكدي من السماح بالميكروفون وحاولي مجددًا 🎤';
    };
    rec.onend = function(){
      sp.listening = false;
      recBtn.classList.remove('listening');
      recBtn.textContent = '🎙️ سجّلي صوتك';
    };
    rec.start();
  });
}
bindSpeak();
renderSpeak();

/* quiz level tabs */
document.querySelectorAll('#quizLevelTabs .tab').forEach(function(t){
  t.addEventListener('click', function(){
    document.querySelectorAll('#quizLevelTabs .tab').forEach(function(x){x.classList.remove('active')});
    t.classList.add('active');
    startQuiz(cur.lang, t.dataset.level);
  });
});

startQuiz('en','beg');

/* ================= v3: points & toast ================= */
function getPoints(){ return parseInt(localStorage.getItem('lingua_points')||'0',10); }
function awardPoints(n, label){
  if(!n || n <= 0) return;
  localStorage.setItem('lingua_points', String(getPoints()+n));
  localStorage.setItem('lingua_lifetime', String(getLifetime()+n));
  checkBadges();
  toast('+'+n+' نقطة 🎉'+(label?' — '+label:''));
  if(window.refreshDash) window.refreshDash();
}
let toastTimer = null;
function toast(msg){
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(function(){ t.classList.remove('show'); }, 2200);
}

/* ================= v3: dictionary ================= */
const DICT = {
  en: [['Hello','مرحبًا'],['Thank you','شكرًا'],['Good morning','صباح الخير'],['Water','ماء'],['Book','كتاب'],['Friend','صديق'],['House','بيت'],['Sun','شمس'],['Moon','قمر'],['Love','حب'],['Family','عائلة'],['Food','طعام'],['Time','وقت'],['Day','يوم'],['Night','ليل'],['Happy','سعيد'],['Beautiful','جميل'],['Big','كبير'],['Small','صغير'],['School','مدرسة'],['Cat','قطة'],['Dog','كلب'],['Bread','خبز'],['Milk','حليب'],['Red','أحمر'],['Blue','أزرق'],['Green','أخضر'],['One','واحد'],['Two','اثنان'],['Three','ثلاثة'],['Mother','أم'],['Father','أب'],['Eat','يأكل'],['Drink','يشرب'],['Sleep','ينام'],['Read','يقرأ'],['Write','يكتب'],['Run','يجري'],['Money','مال'],['Car','سيارة'],['Apple','تفاحة'],['Heart','قلب']],
  fr: [['Bonjour','مرحبًا'],['Merci','شكرًا'],['Eau','ماء'],['Livre','كتاب'],['Ami','صديق'],['Maison','بيت'],['Soleil','شمس'],['Lune','قمر'],['Amour','حب'],['Famille','عائلة'],['Nourriture','طعام'],['Temps','وقت'],['Jour','يوم'],['Nuit','ليل'],['Heureux','سعيد'],['Beau','جميل'],['Grand','كبير'],['Petit','صغير'],['École','مدرسة'],['Chat','قطة'],['Chien','كلب'],['Pain','خبز'],['Lait','حليب'],['Au revoir','إلى اللقاء'],['Rouge','أحمر'],['Bleu','أزرق'],['Vert','أخضر'],['Un','واحد'],['Deux','اثنان'],['Trois','ثلاثة'],['Mère','أم'],['Père','أب'],['Manger','يأكل'],['Boire','يشرب'],['Dormir','ينام'],['Lire','يقرأ'],['Écrire','يكتب'],['Courir','يجري'],['Argent','مال'],['Voiture','سيارة'],['Pomme','تفاحة'],['Cœur','قلب']],
  de: [['Hallo','مرحبًا'],['Danke','شكرًا'],['Wasser','ماء'],['Buch','كتاب'],['Freund','صديق'],['Haus','بيت'],['Sonne','شمس'],['Mond','قمر'],['Liebe','حب'],['Familie','عائلة'],['Essen','طعام'],['Zeit','وقت'],['Tag','يوم'],['Nacht','ليل'],['Glücklich','سعيد'],['Schön','جميل'],['Groß','كبير'],['Klein','صغير'],['Schule','مدرسة'],['Katze','قطة'],['Hund','كلب'],['Brot','خبز'],['Milch','حليب'],['Tschüss','إلى اللقاء'],['Rot','أحمر'],['Blau','أزرق'],['Grün','أخضر'],['Eins','واحد'],['Zwei','اثنان'],['Drei','ثلاثة'],['Mutter','أم'],['Vater','أب'],['Trinken','يشرب'],['Schlafen','ينام'],['Lesen','يقرأ'],['Schreiben','يكتب'],['Laufen','يجري'],['Geld','مال'],['Auto','سيارة'],['Apfel','تفاحة'],['Herz','قلب']],
  zh: [['你好','مرحبًا'],['谢谢','شكرًا'],['水','ماء'],['书','كتاب'],['朋友','صديق'],['房子','بيت'],['太阳','شمس'],['月亮','قمر'],['爱','حب'],['家庭','عائلة'],['食物','طعام'],['时间','وقت'],['天','يوم'],['夜','ليل'],['快乐','سعيد'],['美丽','جميل'],['大','كبير'],['小','صغير'],['学校','مدرسة'],['猫','قطة'],['狗','كلب'],['面包','خبز'],['牛奶','حليب'],['再见','إلى اللقاء'],['红色','أحمر'],['蓝色','أزرق'],['绿色','أخضر'],['一','واحد'],['二','اثنان'],['三','ثلاثة'],['妈妈','أم'],['爸爸','أب'],['吃','يأكل'],['喝','يشرب'],['睡觉','ينام'],['读','يقرأ'],['写','يكتب'],['跑','يجري'],['钱','مال'],['车','سيارة'],['苹果','تفاحة'],['心','قلب']],
  ko: [['안녕하세요','مرحبًا'],['감사합니다','شكرًا'],['물','ماء'],['책','كتاب'],['친구','صديق'],['집','بيت'],['태양','شمس'],['달','قمر'],['사랑','حب'],['가족','عائلة'],['음식','طعام'],['시간','وقت'],['낮','نهار'],['밤','ليل'],['행복','سعيد'],['아름다운','جميل'],['크다','كبير'],['작다','صغير'],['학교','مدرسة'],['고양이','قطة'],['개','كلب'],['빵','خبز'],['우유','حليب'],['안녕히 가세요','إلى اللقاء'],['빨간색','أحمر'],['파란색','أزرق'],['초록색','أخضر'],['하나','واحد'],['둘','اثنان'],['셋','ثلاثة'],['엄마','أم'],['아빠','أب'],['먹다','يأكل'],['마시다','يشرب'],['자다','ينام'],['읽다','يقرأ'],['쓰다','يكتب'],['달리다','يجري'],['돈','مال'],['차','سيارة'],['사과','تفاحة'],['마음','قلب']]
};
let dictLang = 'en';
function renderDict(){
  const q = norm(document.getElementById('dictSearch').value);
  const list = DICT[dictLang].filter(function(w){
    return !q || norm(w[0]).indexOf(q) !== -1 || norm(w[1]).indexOf(q) !== -1;
  });
  const box = document.getElementById('dictList');
  if(!list.length){
    box.innerHTML = '<div class="dict-empty">لا توجد نتائج — جرّبي كلمة أخرى 🔍</div>';
    return;
  }
  box.innerHTML = list.map(function(w, i){
    return '<div class="dict-row"><span class="dw"><span class="foreign">'+w[0]+'</span></span>' +
      '<span class="dm">'+w[1]+'</span>' +
      '<button class="row-listen" data-i="'+i+'" title="استمعي">🔊</button></div>';
  }).join('');
  box.querySelectorAll('.row-listen').forEach(function(b){
    b.addEventListener('click', function(){
      speakText(list[parseInt(b.dataset.i,10)][0], dictLang);
      tone(520,.08,'sine',.06);
    });
  });
}
document.querySelectorAll('#dictTabs .tab').forEach(function(t){
  t.addEventListener('click', function(){
    document.querySelectorAll('#dictTabs .tab').forEach(function(x){x.classList.remove('active')});
    t.classList.add('active');
    dictLang = t.dataset.lang;
    renderDict();
  });
});
document.getElementById('dictSearch').addEventListener('input', renderDict);
renderDict();

/* ================= v3: game type router ================= */
let gType = 'memory';
const G_DIVS = ['memory','scramble','race','hangman','match','tf','type','listen'];
const LATIN_ONLY = ['hangman','type'];
function startGameType(lang){
  if(lang) game.lang = lang;
  document.querySelectorAll('#gameTypeTabs .tab').forEach(function(t){
    t.style.display = (LATIN_ONLY.indexOf(t.dataset.type)!==-1 && game.lang==='zh') ? 'none' : '';
  });
  if(LATIN_ONLY.indexOf(gType)!==-1 && game.lang==='zh'){
    gType = 'memory';
    document.querySelectorAll('#gameTypeTabs .tab').forEach(function(x){x.classList.toggle('active', x.dataset.type==='memory')});
  }
  G_DIVS.forEach(function(k){
    const el = document.getElementById('game' + k.charAt(0).toUpperCase() + k.slice(1));
    if(el) el.style.display = (k===gType) ? 'block' : 'none';
  });
  if(gType==='memory') newGame(game.lang);
  else if(gType==='scramble') startScramble();
  else if(gType==='race') resetRace();
  else if(gType==='hangman') startHangman();
  else if(gType==='match') startMatch();
  else if(gType==='tf') resetTF();
  else if(gType==='type') startType();
  else if(gType==='listen') startListen();
}
document.querySelectorAll('#gameTypeTabs .tab').forEach(function(t){
  t.addEventListener('click', function(){
    document.querySelectorAll('#gameTypeTabs .tab').forEach(function(x){x.classList.remove('active')});
    t.classList.add('active');
    gType = t.dataset.type;
    startGameType();
  });
});

/* ================= v3: word scramble ================= */
let scr = {words:[], i:0, score:0};
function shuffled(s){
  const a = s.split('');
  if(a.length < 2) return s;
  for(let tries=0; tries<10; tries++){
    for(let i=a.length-1;i>0;i--){
      const j = Math.floor(Math.random()*(i+1));
      const t = a[i]; a[i] = a[j]; a[j] = t;
    }
    if(a.join('') !== s) return a.join('');
  }
  return a.reverse().join('');
}
function startScramble(){
  const pool = DICT[game.lang].filter(function(w){ return w[0].replace(/\s/g,'').length > 1; });
  const picks = pool.slice();
  for(let i=picks.length-1;i>0;i--){
    const j = Math.floor(Math.random()*(i+1));
    const t = picks[i]; picks[i] = picks[j]; picks[j] = t;
  }
  scr = {words:picks.slice(0,6), i:0, score:0};
  renderScr();
}
function renderScr(){
  if(scr.i >= scr.words.length){
    document.getElementById('scrWord').textContent = '🏁';
    document.getElementById('scrHint').textContent = 'خلصت الجولة!';
    document.getElementById('scrResult').innerHTML = '🎉 جبتِ '+scr.score+' من '+scr.words.length+' كلمة صح!';
    document.getElementById('scrCount').textContent = '';
    if(scr.score === scr.words.length && scr.words.length){ sndWin(); confetti(); }
    return;
  }
  const w = scr.words[scr.i];
  document.getElementById('scrWord').textContent = shuffled(w[0].replace(/\s/g,''));
  document.getElementById('scrHint').textContent = 'المعنى: '+w[1];
  document.getElementById('scrCount').textContent = 'كلمة '+(scr.i+1)+' من '+scr.words.length;
  document.getElementById('scrInput').value = '';
  document.getElementById('scrResult').textContent = '';
}
function scrNext(){ scr.i++; renderScr(); }
document.getElementById('scrCheck').addEventListener('click', function(){
  if(scr.i >= scr.words.length){ startScramble(); return; }
  const w = scr.words[scr.i];
  const val = norm(document.getElementById('scrInput').value);
  if(val === norm(w[0].replace(/\s/g,''))){
    scr.score++;
    sndGood();
    awardPoints(15, 'حروف مبعثرة');
    document.getElementById('scrResult').innerHTML = '<span style="color:var(--ok)">صح! الكلمة هي «'+w[0]+'» ✓</span>';
    setTimeout(scrNext, 1000);
  } else {
    sndBad();
    document.getElementById('scrResult').innerHTML = '<span style="color:var(--bad)">ليس بعد — ركّزي في الحروف وحاولي تاني 💪</span>';
  }
});
document.getElementById('scrInput').addEventListener('keydown', function(e){
  if(e.key === 'Enter') document.getElementById('scrCheck').click();
});
document.getElementById('scrSkip').addEventListener('click', scrNext);
document.getElementById('scrListen').addEventListener('click', function(){
  if(scr.i < scr.words.length){ speakText(scr.words[scr.i][0], game.lang); }
});

/* ================= v3: timed race ================= */
let race = {on:false, t:60, score:0, qs:[], qi:0, timer:null};
function resetRace(){
  clearInterval(race.timer);
  race = {on:false, t:60, score:0, qs:[], qi:0, timer:null};
  document.getElementById('raceTime').textContent = '60';
  document.getElementById('raceScore').textContent = '0';
  document.getElementById('raceBox').innerHTML = '';
  document.getElementById('raceResult').textContent = 'أجيبي صح على أكبر عدد من الأسئلة قبل انتهاء الوقت! كل إجابة صح = ١٥ نقطة 🏁';
  const rs = document.getElementById('raceStart');
  rs.style.display = '';
  rs.textContent = 'ابدئي السباق 🏁';
}
function renderRaceQ(){
  if(race.qi >= race.qs.length){
    race.qs.sort(function(){ return Math.random()-.5; });
    race.qi = 0;
  }
  const item = race.qs[race.qi];
  let html = '<div class="q-text" style="font-size:1.1rem">'+item.q+'</div>';
  item.opts.forEach(function(o, idx){
    html += '<button class="race-opt" data-i="'+idx+'">'+o+'</button>';
  });
  document.getElementById('raceBox').innerHTML = html;
  document.querySelectorAll('#raceBox .race-opt').forEach(function(btn){
    btn.addEventListener('click', function(){
      if(!race.on) return;
      if(parseInt(btn.dataset.i,10) === item.a){
        race.score += 15;
        document.getElementById('raceScore').textContent = race.score;
        sndGood();
      } else {
        sndBad();
      }
      race.qi++;
      setTimeout(renderRaceQ, 150);
    });
  });
}
document.getElementById('raceStart').addEventListener('click', function(){
  race.qs = [];
  ['beg','mid','adv'].forEach(function(v){ race.qs = race.qs.concat(QUIZZES[game.lang][v]); });
  race.qs.sort(function(){ return Math.random()-.5; });
  race.on = true; race.t = 60; race.score = 0; race.qi = 0;
  document.getElementById('raceStart').style.display = 'none';
  document.getElementById('raceResult').textContent = 'يلااا 🔥';
  renderRaceQ();
  race.timer = setInterval(function(){
    race.t--;
    document.getElementById('raceTime').textContent = race.t;
    if(race.t <= 0){
      clearInterval(race.timer);
      race.on = false;
      const n = race.score/15;
      document.getElementById('raceBox').innerHTML = '';
      document.getElementById('raceResult').innerHTML =
        '⏱️ انتهى الوقت! جبتِ <b style="color:var(--gold2)">'+race.score+' نقطة</b> ('+n+' إجابة صح) 🏁';
      const rs = document.getElementById('raceStart');
      rs.style.display = '';
      rs.textContent = 'العبي تاني ↺';
      awardPoints(race.score, 'سباق الوقت');
      if(n >= 8){ sndWin(); confetti(); }
    }
  }, 1000);
});

/* ================= v4: hangman ================= */
const HM_ALPHA = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
let hm = {word:'', ar:'', guessed:[], lives:6};
function startHangman(){
  const pool = GAME_WORDS[game.lang].filter(function(w){ return /^[A-Za-z]+$/.test(w[0]); });
  const pick = pool[Math.floor(Math.random()*pool.length)];
  hm = {word:pick[0].toUpperCase(), ar:pick[1], guessed:[], lives:6};
  document.getElementById('hmResult').textContent = '';
  renderHangman();
}
function renderHangman(){
  document.getElementById('hmWord').textContent = hm.word.split('').map(function(ch){
    return hm.guessed.indexOf(ch)!==-1 ? ch : '_';
  }).join(' ');
  document.getElementById('hmHint').textContent = 'المعنى: ' + hm.ar;
  document.getElementById('hmLives').textContent = '❤️'.repeat(hm.lives) + '🖤'.repeat(Math.max(0, 6-hm.lives));
  const box = document.getElementById('hmLetters');
  box.innerHTML = '';
  HM_ALPHA.split('').forEach(function(L){
    const b = document.createElement('button');
    b.className = 'hm-letter';
    b.textContent = L;
    if(hm.guessed.indexOf(L)!==-1){
      b.disabled = true;
      b.classList.add(hm.word.indexOf(L)!==-1 ? 'hit' : 'miss');
    }
    b.addEventListener('click', function(){ guessLetter(L); });
    box.appendChild(b);
  });
}
function guessLetter(L){
  if(hm.lives<=0 || hm.guessed.indexOf(L)!==-1) return;
  hm.guessed.push(L);
  const hit = hm.word.indexOf(L)!==-1;
  if(hit) sndGood(); else { hm.lives--; sndBad(); }
  renderHangman();
  const win = hm.word.split('').every(function(ch){ return hm.guessed.indexOf(ch)!==-1; });
  const res = document.getElementById('hmResult');
  if(win){
    awardPoints(25, 'مشنقة الكلمات');
    sndWin(); confetti();
    res.innerHTML = '<span style="color:var(--ok)">🎉 نجوتي! «'+hm.word+'» = '+hm.ar+' — +٢٥ نقطة</span>';
    setTimeout(startHangman, 2000);
  } else if(hm.lives<=0){
    res.innerHTML = '<span style="color:var(--bad)">💀 الكلمة كانت «'+hm.word+'» = '+hm.ar+' — حظ أحسن المرة الجاية!</span>';
    setTimeout(startHangman, 2400);
  }
}
document.getElementById('hmListen').addEventListener('click', function(){ speakText(hm.word, game.lang); });
document.getElementById('hmNew').addEventListener('click', startHangman);

/* ================= v4: match pairs ================= */
let mt = {sel:null, done:0, moves:0, total:5};
function startMatch(){
  const all = GAME_WORDS[game.lang].slice();
  for(let i=all.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));const t=all[i];all[i]=all[j];all[j]=t;}
  const picks = all.slice(0,5);
  const cards = [];
  picks.forEach(function(p, i){
    cards.push({pair:i, text:p[0], side:'f'});
    cards.push({pair:i, text:p[1], side:'a'});
  });
  for(let i=cards.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));const t=cards[i];cards[i]=cards[j];cards[j]=t;}
  mt = {sel:null, done:0, moves:0, total:5};
  const grid = document.getElementById('matchGrid');
  grid.innerHTML = '';
  cards.forEach(function(c){
    const btn = document.createElement('button');
    btn.className = 'mcard' + (c.side==='a' ? ' ar' : '');
    btn.textContent = c.text;
    btn.addEventListener('click', function(){ matchClick(btn, c); });
    grid.appendChild(btn);
  });
  document.getElementById('matchMoves').textContent = '0';
  document.getElementById('matchLeft').textContent = '';
  document.getElementById('matchResult').textContent = '';
}
function matchClick(btn, c){
  if(btn.classList.contains('done') || btn.classList.contains('sel')) return;
  if(!mt.sel){
    mt.sel = {btn:btn, c:c};
    btn.classList.add('sel');
    return;
  }
  mt.moves++;
  document.getElementById('matchMoves').textContent = mt.moves;
  const prev = mt.sel;
  mt.sel = null;
  if(prev.c.pair === c.pair && prev.c.side !== c.side){
    prev.btn.classList.remove('sel');
    prev.btn.classList.add('done');
    btn.classList.add('done');
    sndGood();
    mt.done++;
    document.getElementById('matchLeft').textContent = 'باقي ' + (mt.total - mt.done);
    if(mt.done === mt.total){
      awardPoints(30, 'وصّل الأزواج');
      sndWin(); confetti();
      document.getElementById('matchResult').innerHTML = '🎉 وصّلتي الكل في '+mt.moves+' حركة — +٣٠ نقطة!';
    }
  } else {
    sndBad();
    prev.btn.classList.remove('sel');
    prev.btn.classList.add('wrong');
    btn.classList.add('wrong');
    setTimeout(function(){
      prev.btn.classList.remove('wrong');
      btn.classList.remove('wrong');
    }, 450);
  }
}
document.getElementById('matchRestart').addEventListener('click', startMatch);

/* ================= v4: true/false lightning ================= */
let tf = {on:false, t:45, score:0, timer:null, cur:null};
function resetTF(){
  clearInterval(tf.timer);
  tf = {on:false, t:45, score:0, timer:null, cur:null};
  document.getElementById('tfTime').textContent = '45';
  document.getElementById('tfScore').textContent = '0';
  document.getElementById('tfPlay').style.display = 'none';
  const rs = document.getElementById('tfStart');
  rs.style.display = '';
  rs.textContent = 'ابدئي التحدي ⚡';
  document.getElementById('tfResult').textContent = 'صح ولا غلط بأسرع ما تقدري! كل إجابة صح = ١٠ نقاط ⚡';
}
function nextTF(){
  const pool = GAME_WORDS[game.lang];
  const w = pool[Math.floor(Math.random()*pool.length)];
  let meaning = w[1];
  const truth = Math.random() < 0.5;
  if(!truth){
    let other = w[1];
    let guard = 0;
    while(other === w[1] && guard++ < 30){ other = pool[Math.floor(Math.random()*pool.length)][1]; }
    meaning = other;
  }
  tf.cur = {ok:truth};
  document.getElementById('tfQ').innerHTML = '«'+w[0]+'» يعني «'+meaning+'»؟';
}
function tfAnswer(v){
  if(!tf.on || !tf.cur) return;
  if(v === tf.cur.ok){
    tf.score += 10;
    document.getElementById('tfScore').textContent = tf.score;
    sndGood();
  } else sndBad();
  nextTF();
}
document.getElementById('tfYes').addEventListener('click', function(){ tfAnswer(true); });
document.getElementById('tfNo').addEventListener('click', function(){ tfAnswer(false); });
document.getElementById('tfStart').addEventListener('click', function(){
  tf.on = true; tf.t = 45; tf.score = 0;
  document.getElementById('tfTime').textContent = '45';
  document.getElementById('tfScore').textContent = '0';
  document.getElementById('tfStart').style.display = 'none';
  document.getElementById('tfPlay').style.display = '';
  document.getElementById('tfResult').textContent = 'يلااا ⚡';
  nextTF();
  tf.timer = setInterval(function(){
    tf.t--;
    document.getElementById('tfTime').textContent = tf.t;
    if(tf.t <= 0){
      clearInterval(tf.timer);
      tf.on = false;
      document.getElementById('tfPlay').style.display = 'none';
      const rs = document.getElementById('tfStart');
      rs.style.display = '';
      rs.textContent = 'العبي تاني ↺';
      document.getElementById('tfResult').innerHTML = '⚡ انتهى الوقت! جبتِ <b style="color:var(--gold2)">'+tf.score+' نقطة</b> ('+(tf.score/10)+' إجابة صح)';
      awardPoints(tf.score, 'صح ولا غلط');
      if(tf.score >= 80){ sndWin(); confetti(); }
    }
  }, 1000);
});

/* ================= v4: type the translation ================= */
let typ = {words:[], i:0, score:0};
function startType(){
  const pool = GAME_WORDS[game.lang].filter(function(w){ return /^[A-Za-z ]+$/.test(w[0]); });
  const picks = pool.slice();
  for(let i=picks.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));const t=picks[i];picks[i]=picks[j];picks[j]=t;}
  typ = {words:picks.slice(0,8), i:0, score:0};
  renderType();
}
function renderType(){
  const res = document.getElementById('typResult');
  if(typ.i >= typ.words.length){
    document.getElementById('typQ').textContent = '🏁 خلصت الجولة!';
    document.getElementById('typCount').textContent = '';
    document.getElementById('typInput').value = '';
    res.innerHTML = '🎉 جبتِ '+typ.score+' من '+typ.words.length+' كلمة صح!';
    if(typ.score === typ.words.length && typ.words.length){ sndWin(); confetti(); }
    return;
  }
  const w = typ.words[typ.i];
  document.getElementById('typQ').textContent = '«'+w[1]+'»';
  document.getElementById('typCount').textContent = 'كلمة '+(typ.i+1)+' من '+typ.words.length;
  document.getElementById('typInput').value = '';
  res.textContent = '';
}
document.getElementById('typCheck').addEventListener('click', function(){
  if(typ.i >= typ.words.length){ startType(); return; }
  const w = typ.words[typ.i];
  const val = norm(document.getElementById('typInput').value);
  const res = document.getElementById('typResult');
  if(val === norm(w[0])){
    typ.score++;
    sndGood();
    awardPoints(15, 'اكتبي الترجمة');
    res.innerHTML = '<span style="color:var(--ok)">ممتاز! «'+w[0]+'» صح ✓</span>';
    typ.i++;
    setTimeout(renderType, 900);
  } else {
    sndBad();
    res.innerHTML = '<span style="color:var(--bad)">ليس بالظبط — الكلمة «'+w[0]+'»، جرّبي تاني أو كمّلي</span>';
    typ.i++;
    setTimeout(renderType, 1600);
  }
});
document.getElementById('typInput').addEventListener('keydown', function(e){
  if(e.key === 'Enter') document.getElementById('typCheck').click();
});
document.getElementById('typListen').addEventListener('click', function(){
  if(typ.i < typ.words.length) speakText(typ.words[typ.i][0], game.lang);
});

/* ================= v4: listen & choose ================= */
let lst = {qs:[], i:0, score:0};
function startListen(){
  const pool = GAME_WORDS[game.lang].slice();
  for(let i=pool.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));const t=pool[i];pool[i]=pool[j];pool[j]=t;}
  lst = {qs:pool.slice(0,8), i:0, score:0};
  document.getElementById('lstResult').textContent = '';
  renderListen();
}
function renderListen(){
  const box = document.getElementById('lstBox');
  if(lst.i >= lst.qs.length){
    box.innerHTML = '';
    document.getElementById('lstCount').textContent = '';
    document.getElementById('lstResult').innerHTML = '🎉 جبتِ '+lst.score+' من '+lst.qs.length+' صح بالسمع بس!';
    if(lst.score === lst.qs.length && lst.qs.length){ sndWin(); confetti(); }
    return;
  }
  const w = lst.qs[lst.i];
  const pool = GAME_WORDS[game.lang];
  const opts = [w[1]];
  let guard = 0;
  while(opts.length < 4 && guard++ < 60){
    const m = pool[Math.floor(Math.random()*pool.length)][1];
    if(opts.indexOf(m) === -1) opts.push(m);
  }
  for(let i=opts.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));const t=opts[i];opts[i]=opts[j];opts[j]=t;}
  document.getElementById('lstCount').textContent = 'سؤال '+(lst.i+1)+' من '+lst.qs.length;
  box.innerHTML = '';
  opts.forEach(function(m){
    const b = document.createElement('button');
    b.className = 'lst-opt';
    b.textContent = m;
    b.addEventListener('click', function(){
      const ok = (m === w[1]);
      document.querySelectorAll('#lstBox .lst-opt').forEach(function(x){ x.disabled = true; });
      b.classList.add(ok ? 'right' : 'wrong');
      if(ok){
        lst.score++;
        sndGood();
        awardPoints(15, 'اسمعي واختاري');
        document.getElementById('lstResult').innerHTML = '<span style="color:var(--ok)">صح! «'+w[0]+'» = '+w[1]+' ✓</span>';
      } else {
        sndBad();
        document.getElementById('lstResult').innerHTML = '<span style="color:var(--bad)">الصح: «'+w[0]+'» = '+w[1]+'</span>';
      }
      lst.i++;
      setTimeout(renderListen, 1300);
    });
    box.appendChild(b);
  });
  speakText(w[0], game.lang);
}
document.getElementById('lstPlay').addEventListener('click', function(){
  if(lst.i < lst.qs.length) speakText(lst.qs[lst.i][0], game.lang);
});

/* ================= v4: wow (particles, marquee, counters, tilt) ================= */
(function(){
  try {
    const c = document.createElement('canvas');
    c.id = 'bgfx';
    document.body.insertBefore(c, document.body.firstChild);
    const ctx = c.getContext('2d');
    let W, H;
    const ps = [];
    function resize(){ W = c.width = window.innerWidth; H = c.height = window.innerHeight; }
    resize();
    window.addEventListener('resize', resize);
    for(let i=0;i<40;i++){
      ps.push({x:Math.random()*window.innerWidth, y:Math.random()*window.innerHeight, r:Math.random()*1.8+0.5, s:Math.random()*0.3+0.06, o:Math.random()*0.4+0.12});
    }
    (function loop(){
      ctx.clearRect(0,0,W,H);
      for(let i=0;i<ps.length;i++){
        const p = ps[i];
        p.y -= p.s;
        if(p.y < -5){ p.y = H + 5; p.x = Math.random()*W; }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, 7);
        ctx.fillStyle = 'rgba(230,190,80,' + p.o + ')';
        ctx.fill();
      }
      requestAnimationFrame(loop);
    })();
  } catch(e){}

  try {
    const words = ['Hello','Bonjour','Hallo','你好','Merci','Danke','谢谢','Amour','Liebe','爱','Friend','Soleil','Sonne','月亮','Book','Pain','Brot','水','School','École','Schule','学校'];
    const track = document.getElementById('marqTrack');
    if(track){
      const all = words.concat(words);
      track.innerHTML = all.map(function(w){ return '<span>'+w+' ✦</span>'; }).join('');
    }
  } catch(e){}

  try {
    document.querySelectorAll('.stat b').forEach(function(b){
      const map = {'٠':'0','١':'1','٢':'2','٣':'3','٤':'4','٥':'5','٦':'6','٧':'7','٨':'8','٩':'9'};
      const target = parseInt(b.textContent.replace(/[٠-٩]/g, function(d){ return map[d]; }), 10);
      if(isNaN(target)) return;
      let n = 0;
      const step = function(){
        n += Math.max(1, Math.ceil((target - n) / 8));
        if(n >= target) n = target;
        b.textContent = String(n).replace(/[0-9]/g, function(d){ return '٠١٢٣٤٥٦٧٨٩'[parseInt(d,10)]; });
        if(n < target) setTimeout(step, 70);
      };
      setTimeout(step, 700);
    });
  } catch(e){}

  try {
    if(window.matchMedia('(hover:hover)').matches){
      document.querySelectorAll('.dash-card, .kcard, .tcard, .lesson-card, .video-card').forEach(function(el){
        el.style.transition = 'transform .15s ease';
        el.addEventListener('mousemove', function(e){
          const r = el.getBoundingClientRect();
          const rx = ((e.clientY - r.top) / r.height - 0.5) * -7;
          const ry = ((e.clientX - r.left) / r.width - 0.5) * 7;
          el.style.transform = 'perspective(700px) rotateX(' + rx + 'deg) rotateY(' + ry + 'deg)';
        });
        el.addEventListener('mouseleave', function(){ el.style.transform = ''; });
      });
    }
  } catch(e){}
})();

/* ================= v4: themes ================= */
const THEMES = {gold:'👑 ذهبي', rose:'🌸 فوشيا', ocean:'🌊 محيط', emerald:'💚 زمرد', violet:'💜 بنفسجي', white:'🤍 أبيض', mint:'🌿 نعناعي', sky:'🩵 سماوي', royal:'🏰 ملكي', sunset:'🌅 غروب', midnight:'🌌 منتصف الليل'};
const THEME_COLORS = {gold:'#d4af37', rose:'#e85d9e', ocean:'#22b8cf', emerald:'#34d399', violet:'#9d7bff', white:'#f7f4ee', mint:'#4ade80', sky:'#7dd3fc', royal:'#f7c948', sunset:'#ff7a3d', midnight:'#60a5fa'};
const PREMIUM_THEMES = {royal:150, sunset:300, midnight:500};
const BASE_THEMES = ['gold','rose','ocean','emerald','violet','white','mint','sky'];
function getOwnedThemes(){ try{ return JSON.parse(localStorage.getItem('lingua_owned_themes')||'[]'); }catch(e){ return []; } }
function applyTheme(name){
  document.documentElement.setAttribute('data-theme', name === 'gold' ? '' : name);
  try { localStorage.setItem('lingua_theme', name); } catch(e){}
  document.querySelectorAll('.theme-dot').forEach(function(d){ d.classList.toggle('on', d.dataset.t === name); });
}
(function(){
  window.buildThemeDots = function(){
    const pop = document.getElementById('themePop');
    pop.innerHTML = '';
    const owned = getOwnedThemes();
    Object.keys(THEMES).forEach(function(k){
      if(PREMIUM_THEMES[k] && owned.indexOf(k) < 0) return;
      const d = document.createElement('button');
      d.className = 'theme-dot';
      d.dataset.t = k;
      d.title = THEMES[k];
      d.style.background = THEME_COLORS[k];
      d.addEventListener('click', function(){ applyTheme(k); sndGood(); });
      pop.appendChild(d);
    });
    applyTheme(document.documentElement.getAttribute('data-theme') || 'gold');
  };
  buildThemeDots();
  document.getElementById('themeFab').addEventListener('click', function(){
    document.getElementById('themePop').classList.toggle('open');
  });
  let saved = 'rose';
  try { saved = localStorage.getItem('lingua_theme') || 'rose'; } catch(e){}
  applyTheme(saved);
})();

/* ================= v4: photo gallery ================= */
const GALLERY = [
  {img:'Cat_August_2010-4.jpg', w:{en:'Cat', fr:'Chat', de:'Katze', zh:'猫', ko:'고양이'}, ar:'قطة'},
  {img:'YellowLabradorLooking_new.jpg', w:{en:'Dog', fr:'Chien', de:'Hund', zh:'狗', ko:'개'}, ar:'كلب'},
  {img:'Water_drop_001.jpg', w:{en:'Water', fr:'Eau', de:'Wasser', zh:'水', ko:'물'}, ar:'ماء'},
  {img:'FullMoon2010.jpg', w:{en:'Moon', fr:'Lune', de:'Mond', zh:'月亮', ko:'달'}, ar:'قمر'},
  {img:'Gingerbread_House_Essex_CT.jpg', w:{en:'House', fr:'Maison', de:'Haus', zh:'房子', ko:'집'}, ar:'بيت'},
  {img:'White_bread.jpg', w:{en:'Bread', fr:'Pain', de:'Brot', zh:'面包', ko:'빵'}, ar:'خبز'},
  {img:'Red_Apple.jpg', w:{en:'Apple', fr:'Pomme', de:'Apfel', zh:'苹果', ko:'사과'}, ar:'تفاحة'},
  {img:'Books-aj.svg_aj_ashton_01.svg', w:{en:'Book', fr:'Livre', de:'Buch', zh:'书', ko:'책'}, ar:'كتاب'},
  {img:'The_Sun_in_white_light.jpg', w:{en:'Sun', fr:'Soleil', de:'Sonne', zh:'太阳', ko:'태양'}, ar:'شمس'},
  {img:'Heart_corazón.svg', w:{en:'Love', fr:'Amour', de:'Liebe', zh:'爱', ko:'사랑'}, ar:'حب'}
];
let galLang = 'en';
function renderGallery(){
  document.getElementById('galGrid').innerHTML = GALLERY.map(function(g){
    const url = 'https://commons.wikimedia.org/wiki/Special:FilePath/' + encodeURIComponent(g.img) + '?width=320';
    return '<div class="gal-card"><img loading="lazy" src="' + url + '" alt="' + g.ar + '">' +
      '<div class="gal-body"><div class="gal-word">' + g.w[galLang] + '</div>' +
      '<div class="gal-ar">' + g.ar + '</div>' +
      '<button class="gal-listen" data-w="' + g.w[galLang] + '">🔊 اسمعيها</button></div></div>';
  }).join('');
  document.querySelectorAll('.gal-listen').forEach(function(b){
    b.addEventListener('click', function(){ speakText(b.dataset.w, galLang); });
  });
}
document.querySelectorAll('#galTabs .tab').forEach(function(t){
  t.addEventListener('click', function(){
    document.querySelectorAll('#galTabs .tab').forEach(function(x){x.classList.remove('active')});
    t.classList.add('active');
    galLang = t.dataset.lang;
    renderGallery();
  });
});
renderGallery();

/* ================= v4: weekly challenge ================= */
document.getElementById('weeklyBtn').addEventListener('click', function(){
  const lang = cur.lang || 'en';
  let qs = [];
  ['beg','mid','adv','pro'].forEach(function(lv){ qs = qs.concat(QUIZZES[lang][lv]); });
  for(let i=qs.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));const t=qs[i];qs[i]=qs[j];qs[j]=t;}
  QUIZZES[lang].weekly = qs.slice(0,10);
  document.getElementById('quiz').scrollIntoView({behavior:'smooth'});
  document.querySelectorAll('#quizLevelTabs .tab').forEach(function(x){x.classList.remove('active')});
  startQuiz(lang, 'weekly');
});

/* ================= v4: profile + friends log ================= */
function loadProfile(){
  let name = '', av = '🦋';
  try {
    name = localStorage.getItem('lingua_profile_name') || localStorage.getItem('lingua_cert_name') || '';
    av = localStorage.getItem('lingua_profile_avatar') || '🦋';
  } catch(e){}
  document.getElementById('pfName').textContent = name || 'ضيفتنا الغالية';
  document.getElementById('pfAvatar').textContent = av;
  document.getElementById('pfSub').textContent = name
    ? 'أهلًا بيكي يا ' + name + ' 👑 نقاطك وشهادتك محفوظة بحسابك على جهازك'
    : 'سجّلي اسمك عشان يظهر في الشهادات والتحديات 👑';
}
const PF_AVATARS = ['🦋','🌸','🐱','🦊','🐼','🦄','🌙','⭐','💎','🎀','🍓','🐝'];
document.getElementById('pfEdit').addEventListener('click', function(){
  const cur = document.getElementById('pfName').textContent;
  const name = prompt('اكتبي اسمك (هيظهر في الشهادات والتحديات):', cur === 'ضيفتنا الغالية' ? '' : cur);
  if(name !== null){
    const n = name.trim().slice(0,20);
    try {
      localStorage.setItem('lingua_profile_name', n);
      localStorage.setItem('lingua_cert_name', n);
    } catch(e){}
  }
  const av = prompt('اختاري أفتار: ' + PF_AVATARS.join(' '), document.getElementById('pfAvatar').textContent);
  if(av && av.trim()){
    try { localStorage.setItem('lingua_profile_avatar', av.trim().slice(0,2)); } catch(e){}
  }
  loadProfile();
});
document.getElementById('pfAvatar').addEventListener('click', function(){
  document.getElementById('pfEdit').click();
});
loadProfile();

function logChal(text){
  let arr = [];
  try { arr = JSON.parse(localStorage.getItem('lingua_chals') || '[]'); } catch(e){}
  arr.unshift({text:text, t:Date.now()});
  arr = arr.slice(0,8);
  try { localStorage.setItem('lingua_chals', JSON.stringify(arr)); } catch(e){}
  renderChals();
}
function renderChals(){
  let arr = [];
  try { arr = JSON.parse(localStorage.getItem('lingua_chals') || '[]'); } catch(e){}
  const box = document.getElementById('chalList');
  if(!arr.length){
    box.innerHTML = '<div class="chal-empty">لسه مفيش تحديات — العبي لعبة أو اختبار واضغطي "⚔️ تحدي صاحبك" وابعتي اللينك لصحابك!</div>';
    return;
  }
  box.innerHTML = arr.map(function(c){
    const d = new Date(c.t);
    return '<div class="chal-item"><span>' + c.text + '</span><span style="color:var(--muted);font-size:.8rem;white-space:nowrap">' + d.toLocaleDateString('ar-EG') + '</span></div>';
  }).join('');
}
renderChals();

/* ================= v4: math sprint ================= */
let mq = {on:false, t:45, score:0, timer:null, ans:0};
document.getElementById('mathStart').addEventListener('click', function(){
  mq = {on:true, t:45, score:0, timer:null, ans:0};
  document.getElementById('mathScore').textContent = '0';
  document.getElementById('mathTime').textContent = '45';
  document.getElementById('mathStart').style.display = 'none';
  nextMath();
  mq.timer = setInterval(function(){
    mq.t--;
    document.getElementById('mathTime').textContent = mq.t;
    if(mq.t <= 0){
      clearInterval(mq.timer);
      mq.on = false;
      document.getElementById('mathQ').textContent = '🏁';
      document.getElementById('mathStart').style.display = '';
      document.getElementById('mathStart').textContent = 'العبي تاني ↺';
      document.getElementById('mathRes').innerHTML = 'انتهى الوقت! جبتِ <b style="color:var(--gold2)">' + mq.score + ' نقطة</b> 🧮';
      awardPoints(mq.score, 'رياضيات خاطفة');
      if(mq.score >= 80){ sndWin(); confetti(); }
    }
  }, 1000);
});
function nextMath(){
  const a = Math.floor(Math.random()*12)+2, b = Math.floor(Math.random()*12)+2;
  const ops = ['+','-','×'];
  const op = ops[Math.floor(Math.random()*3)];
  mq.ans = op==='+' ? a+b : op==='-' ? a-b : a*b;
  document.getElementById('mathQ').textContent = a + ' ' + op + ' ' + b + ' = ؟';
  document.getElementById('mathIn').value = '';
  document.getElementById('mathIn').focus();
}
document.getElementById('mathGo').addEventListener('click', function(){
  if(!mq.on) return;
  const v = parseInt(document.getElementById('mathIn').value, 10);
  if(v === mq.ans){ mq.score += 10; document.getElementById('mathScore').textContent = mq.score; sndGood(); }
  else sndBad();
  nextMath();
});
document.getElementById('mathIn').addEventListener('keydown', function(e){
  if(e.key === 'Enter') document.getElementById('mathGo').click();
});

/* ================= v4: number memory ================= */
let nm = {lvl:0, num:''};
document.getElementById('memStart').addEventListener('click', function(){
  nm = {lvl:1, num:''};
  nextMem();
});
function nextMem(){
  nm.num = '';
  for(let i=0;i<nm.lvl+2;i++) nm.num += Math.floor(Math.random()*10);
  document.getElementById('memSeq').textContent = nm.num;
  document.getElementById('memIn').style.display = 'none';
  document.getElementById('memGo').style.display = 'none';
  document.getElementById('memStart').style.display = 'none';
  document.getElementById('memRes').innerHTML = 'احفظي الرقم… 👀';
  setTimeout(function(){
    document.getElementById('memSeq').textContent = '؟';
    document.getElementById('memIn').style.display = '';
    document.getElementById('memGo').style.display = '';
    document.getElementById('memIn').value = '';
    document.getElementById('memIn').focus();
    document.getElementById('memRes').innerHTML = 'اكتبي الرقم اللي شفتيه ✍️';
  }, 1200 + nm.lvl*500);
}
document.getElementById('memGo').addEventListener('click', function(){
  const v = document.getElementById('memIn').value.trim();
  if(v === nm.num){
    sndGood();
    awardPoints(10 * nm.lvl, 'ذاكرة الأرقام');
    document.getElementById('memLvl').textContent = nm.lvl;
    document.getElementById('memRes').innerHTML = 'صح! جولة ' + nm.lvl + ' ✅ — <b style="color:var(--gold2)">+' + (10*nm.lvl) + ' نقطة</b>';
    nm.lvl++;
    setTimeout(nextMem, 1200);
  } else {
    sndBad();
    document.getElementById('memRes').innerHTML = 'الرقم كان <b style="color:var(--bad)">' + nm.num + '</b> — وصلتي لجولة ' + nm.lvl + ' 🧠';
    document.getElementById('memSeq').textContent = 'حظ أحسن!';
    document.getElementById('memIn').style.display = 'none';
    document.getElementById('memGo').style.display = 'none';
    document.getElementById('memStart').style.display = '';
    document.getElementById('memStart').textContent = 'العبي تاني ↺';
    if(nm.lvl >= 4){ sndWin(); confetti(); }
  }
});
document.getElementById('memIn').addEventListener('keydown', function(e){
  if(e.key === 'Enter') document.getElementById('memGo').click();
});

/* ================= v4: pixel art studio ================= */
const PIX_COLORS = ['#d4af37','#e85d9e','#22b8cf','#34d399','#9d7bff','#f87171','#f6f1e3','#1a1405'];
let pixColor = PIX_COLORS[0];
(function(){
  const pal = document.getElementById('pixPal');
  PIX_COLORS.forEach(function(c, i){
    const b = document.createElement('button');
    b.className = 'pix-c' + (i===0 ? ' on' : '');
    b.style.background = c;
    b.addEventListener('click', function(){
      pixColor = c;
      document.querySelectorAll('.pix-c').forEach(function(x){x.classList.remove('on')});
      b.classList.add('on');
    });
    pal.appendChild(b);
  });
  const grid = document.getElementById('pixGrid');
  for(let i=0;i<12*12;i++){
    const px = document.createElement('div');
    px.className = 'pix';
    px.addEventListener('click', function(){
      px.style.background = pixColor;
      px.dataset.c = pixColor;
    });
    grid.appendChild(px);
  }
  document.getElementById('pixClear').addEventListener('click', function(){
    document.querySelectorAll('.pix').forEach(function(px){ px.style.background = ''; px.dataset.c = ''; });
    document.getElementById('pixRes').textContent = '';
  });
  document.getElementById('pixSave').addEventListener('click', function(){
    try {
      const cv = document.createElement('canvas');
      cv.width = 12; cv.height = 12;
      const cx = cv.getContext('2d');
      cx.fillStyle = '#0e0a1a'; cx.fillRect(0,0,12,12);
      document.querySelectorAll('.pix').forEach(function(px, i){
        if(px.dataset.c){
          cx.fillStyle = px.dataset.c;
          cx.fillRect(i%12, Math.floor(i/12), 1, 1);
        }
      });
      const a = document.createElement('a');
      a.download = 'lingua-design.png';
      a.href = cv.toDataURL('image/png');
      a.click();
      awardPoints(20, 'ستوديو التصميم');
      sndWin();
      document.getElementById('pixRes').innerHTML = '<span style="color:var(--ok)">اتحمّل تصميمك! 🎨 +٢٠ نقطة</span>';
    } catch(e){
      document.getElementById('pixRes').textContent = 'التنزيل مش متاح على المتصفح ده';
    }
  });
})();

/* ================= v4: community wall ================= */
function renderWall(){
  let msgs = [];
  try { msgs = JSON.parse(localStorage.getItem('lingua_wall') || '[]'); } catch(e){}
  if(!msgs.length){
    msgs = [
      {n:'كارما 👑', b:'أهلًا بيكم في لينجوا! اتعلموا، العبوا، واكسبوا نقاط — وبصوا على ركني 💜', t:Date.now()-86400000},
      {n:'كارما 👑', b:'جربوا تحدي الأسبوع وقولولي جبتُوا كام! 🏆', t:Date.now()-3600000}
    ];
  }
  document.getElementById('wallList').innerHTML = msgs.slice(-30).map(function(m){
    const d = new Date(m.t);
    return '<div class="wall-msg"><span class="wn">' + m.n + '</span><span class="wt">' + d.toLocaleDateString('ar-EG') + ' ' + d.toLocaleTimeString('ar-EG', {hour:'2-digit', minute:'2-digit'}) + '</span><div class="wb"></div></div>';
  }).join('');
  const bodies = document.querySelectorAll('#wallList .wb');
  msgs.slice(-30).forEach(function(m, i){ bodies[i].textContent = m.b; });
  const list = document.getElementById('wallList');
  list.scrollTop = list.scrollHeight;
}
document.getElementById('wallSend').addEventListener('click', function(){
  const v = document.getElementById('wallIn').value.trim();
  if(!v) return;
  let name = 'ضيفة';
  try { name = localStorage.getItem('lingua_profile_name') || 'ضيفة'; } catch(e){}
  let msgs = [];
  try { msgs = JSON.parse(localStorage.getItem('lingua_wall') || '[]'); } catch(e){}
  msgs.push({n:name, b:v, t:Date.now()});
  msgs = msgs.slice(-50);
  try { localStorage.setItem('lingua_wall', JSON.stringify(msgs)); } catch(e){}
  document.getElementById('wallIn').value = '';
  awardPoints(5, 'رسالة في ركن الكلام');
  renderWall();
});
document.getElementById('wallIn').addEventListener('keydown', function(e){
  if(e.key === 'Enter') document.getElementById('wallSend').click();
});
renderWall();

/* ================= v4.2: deen corner ================= */
const DHIKR = ['سبحان الله','الحمد لله','الله أكبر','لا إله إلا الله','أستغفر الله','اللهم صلِّ على محمد'];
let tas = {i:0, c:0};
document.getElementById('tasBtn').addEventListener('click', function(){
  tas.c++;
  document.getElementById('tasCount').textContent = tas.c;
  sndGood();
  if(tas.c >= 33){
    awardPoints(10, 'الأذكار');
    confetti();
    document.getElementById('tasRes').innerHTML = '<span style="color:var(--ok)">ما شاء الله! خلّصتي «'+DHIKR[tas.i]+'» ٣٣ مرة — +١٠ نقاط ✨</span>';
    tas.i = (tas.i + 1) % DHIKR.length;
    tas.c = 0;
    setTimeout(function(){
      document.getElementById('tasDhikr').textContent = DHIKR[tas.i];
      document.getElementById('tasCount').textContent = '0';
    }, 1200);
  }
});
document.getElementById('tasNext').addEventListener('click', function(){
  tas.i = (tas.i + 1) % DHIKR.length;
  tas.c = 0;
  document.getElementById('tasDhikr').textContent = DHIKR[tas.i];
  document.getElementById('tasCount').textContent = '0';
});
const DUAS = [
  {t:'قبل المذاكرة 📚', b:'رَبِّ زِدْنِي عِلْمًا'},
  {t:'في كل وقت 💜', b:'اللهم أعنّي على ذكرك وشكرك وحُسن عبادتك'},
  {t:'قبل النوم 🌙', b:'باسمك اللهم أموت وأحيا'},
  {t:'دعاء جامع 🤲', b:'ربنا آتنا في الدنيا حسنة وفي الآخرة حسنة وقِنا عذاب النار'},
  {t:'للعافية 🌿', b:'اللهم إني أسألك العفو والعافية في الدنيا والآخرة'},
  {t:'عند الهم 🕊️', b:'لا إله إلا أنت سبحانك إني كنت من الظالمين'}
];
document.getElementById('deenDuas').innerHTML = DUAS.map(function(d){
  return '<div class="dua-card"><div class="dt">'+d.t+'</div><div class="db">'+d.b+'</div></div>';
}).join('');
const SURAHS = [
  {t:'الفاتحة', b:'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ ﴿١﴾ الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ ﴿٢﴾ الرَّحْمَٰنِ الرَّحِيمِ ﴿٣﴾ مَالِكِ يَوْمِ الدِّينِ ﴿٤﴾ إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ ﴿٥﴾ اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ ﴿٦﴾ صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ ﴿٧﴾'},
  {t:'الإخلاص', b:'قُلْ هُوَ اللَّهُ أَحَدٌ ﴿١﴾ اللَّهُ الصَّمَدُ ﴿٢﴾ لَمْ يَلِدْ وَلَمْ يُولَدْ ﴿٣﴾ وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ ﴿٤﴾'},
  {t:'الفلق', b:'قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ ﴿١﴾ مِن شَرِّ مَا خَلَقَ ﴿٢﴾ وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ ﴿٣﴾ وَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ ﴿٤﴾ وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ ﴿٥﴾'},
  {t:'الناس', b:'قُلْ أَعُوذُ بِرَبِّ النَّاسِ ﴿١﴾ مَلِكِ النَّاسِ ﴿٢﴾ إِلَٰهِ النَّاسِ ﴿٣﴾ مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ ﴿٤﴾ الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ ﴿٥﴾ مِنَ الْجِنَّةِ وَالنَّاسِ ﴿٦﴾'},
  {t:'الكوثر', b:'إِنَّا أَعْطَيْنَاكَ الْكَوْثَرَ ﴿١﴾ فَصَلِّ لِرَبِّكَ وَانْحَرْ ﴿٢﴾ إِنَّ شَانِئَكَ هُوَ الْأَبْتَرُ ﴿٣﴾'},
  {t:'العصر', b:'وَالْعَصْرِ ﴿١﴾ إِنَّ الْإِنسَانَ لَفِي خُسْرٍ ﴿٢﴾ إِلَّا الَّذِينَ آمَنُوا وَعَمِلُوا الصَّالِحَاتِ وَتَوَاصَوْا بِالْحَقِّ وَتَوَاصَوْا بِالصَّبْرِ ﴿٣﴾'}
];
document.getElementById('deenQuran').innerHTML = SURAHS.map(function(x){
  return '<div class="surah-card"><div class="st">سورة '+x.t+'</div><div class="db">'+x.b+'</div></div>';
}).join('');
document.querySelectorAll('#deenTabs .tab').forEach(function(t){
  t.addEventListener('click', function(){
    document.querySelectorAll('#deenTabs .tab').forEach(function(x){x.classList.remove('active')});
    t.classList.add('active');
    document.getElementById('deenAdhkar').style.display = t.dataset.deen==='adhkar' ? 'block' : 'none';
    document.getElementById('deenDuas').style.display = t.dataset.deen==='duas' ? 'block' : 'none';
    document.getElementById('deenQuran').style.display = t.dataset.deen==='quran' ? 'block' : 'none';
  });
});

/* ================= v4.2: reaction + number race ================= */
let react = {state:'idle', t0:0, timer:null};
document.getElementById('reactStart').addEventListener('click', function(){
  const pad = document.getElementById('reactPad');
  react.state = 'wait';
  pad.className = 'react-pad wait';
  pad.textContent = 'استني الدهبي… 👀';
  document.getElementById('reactRes').textContent = '';
  document.getElementById('reactStart').style.display = 'none';
  clearTimeout(react.timer);
  react.timer = setTimeout(function(){
    react.state = 'go';
    pad.className = 'react-pad go';
    pad.textContent = 'دوسي!! ⚡';
    react.t0 = performance.now();
  }, 1200 + Math.random()*2500);
});
document.getElementById('reactPad').addEventListener('click', function(){
  const pad = document.getElementById('reactPad');
  if(react.state === 'wait'){
    clearTimeout(react.timer);
    react.state = 'idle';
    pad.className = 'react-pad';
    pad.textContent = 'بدري أوي! 😅 جربي تاني';
    sndBad();
    document.getElementById('reactStart').style.display = '';
  } else if(react.state === 'go'){
    const ms = Math.round(performance.now() - react.t0);
    react.state = 'idle';
    pad.className = 'react-pad';
    pad.textContent = ms + ' مللي ثانية ⚡';
    let pts = ms < 250 ? 30 : ms < 350 ? 20 : ms < 500 ? 10 : 5;
    awardPoints(pts, 'سرعة البرق');
    sndGood();
    if(ms < 250){ sndWin(); confetti(); }
    document.getElementById('reactRes').innerHTML = 'رد فعلك ' + ms + 'ms — <b style="color:var(--gold2)">+' + pts + ' نقطة</b>';
    document.getElementById('reactStart').style.display = '';
    document.getElementById('reactStart').textContent = 'العبي تاني ↺';
  }
});
let nrace = {n:1, t0:0, timer:null};
document.getElementById('numStart').addEventListener('click', function(){
  const grid = document.getElementById('numGrid');
  const nums = [];
  for(let i=1;i<=16;i++) nums.push(i);
  for(let i=nums.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));const t=nums[i];nums[i]=nums[j];nums[j]=t;}
  grid.innerHTML = '';
  nums.forEach(function(n){
    const b = document.createElement('button');
    b.className = 'num-cell';
    b.textContent = n;
    b.addEventListener('click', function(){
      if(n === nrace.n){
        b.classList.add('hit');
        sndGood();
        nrace.n++;
        if(nrace.n > 16){
          clearInterval(nrace.timer);
          const sec = ((performance.now() - nrace.t0)/1000).toFixed(1);
          const pts = sec < 15 ? 40 : sec < 25 ? 25 : 15;
          awardPoints(pts, 'سباق الأرقام');
          sndWin(); confetti();
          document.getElementById('numRes').innerHTML = 'خلصتي في ' + sec + ' ثانية! <b style="color:var(--gold2)">+' + pts + ' نقطة</b> 🏁';
          document.getElementById('numStart').style.display = '';
          document.getElementById('numStart').textContent = 'العبي تاني ↺';
        }
      } else sndBad();
    });
    grid.appendChild(b);
  });
  nrace = {n:1, t0:performance.now(), timer:setInterval(function(){
    document.getElementById('numTime').textContent = ((performance.now() - nrace.t0)/1000).toFixed(1);
  }, 100)};
  document.getElementById('numStart').style.display = 'none';
});

/* ================= v4.3: songs + cinema ================= */
const SONGS = {
  en: [
    {t:'Adele — Hello', id:'YQHsXMglC9A'},
    {t:'The Beatles — Let It Be', id:'QDYfEBY9NM4'},
    {t:'Katy Perry — Roar', id:'CevxZvSJLk8'},
    {t:'Taylor Swift — Shake It Off', id:'nfWlot6h_JM'},
    {t:'Taylor Swift — Blank Space', id:'e-ORhEE9VVg'},
    {t:'Frozen — Let It Go', id:'moSFlvxnbgk'},
    {t:'Ed Sheeran — Perfect', id:'2Vv-BfVoq4g'},
    {t:'Ed Sheeran — Shape of You', id:'JGwWNGJdvx8'},
    {t:'Dua Lipa — Levitating', id:'TUVcZfQe-Kw'},
    {t:'Coldplay — Yellow', id:'yKNxeF4KMsY'},
    {t:'Maroon 5 — Sugar', id:'09R8_2nJtjg'},
    {t:'Luis Fonsi — Despacito', id:'kJQP7kiw5Fk'}
  ],
  fr: [
    {t:'Édith Piaf — La Vie en rose', id:'Q3Kvu6Kgp88'},
    {t:'Indila — Dernière danse', id:'K5KAc5CoCuk'},
    {t:'Stromae — Papaoutai', id:'oiKj0Z_Xnjc'}
  ],
  de: [
    {t:'Rammstein — Deutschland', id:'NeQM1c-XCDc'},
    {t:'Rammstein — Sonne', id:'StZcUAPRRac'}
  ],
  zh: [
    {t:'Jay Chou — 晴天', id:'DYptgVvkVLQ'},
    {t:'Jay Chou — 告白氣球', id:'bu7nU9Mhpyo'},
    {t:'G.E.M. — 光年之外', id:'T4SimnaiktU'}
  ],
  ko: [
    {t:'BTS — Dynamite', id:'gdZLi9oWNZg'},
    {t:'BTS — Butter', id:'WMweEpGlu_U'},
    {t:'BTS — Boy With Luv (feat. Halsey)', id:'XsX3ATc3FbA'},
    {t:'BLACKPINK — DDU-DU DDU-DU', id:'IHNzOHi8sJs'},
    {t:'BLACKPINK — Kill This Love', id:'2S24-y0Ij3Y'},
    {t:'NewJeans — Super Shy', id:'ArmDp-zijuc'},
    {t:'TWICE — What is Love?', id:'i0p1bmr0EmE'},
    {t:'PSY — Gangnam Style', id:'9bZkp7q19f0'}
  ]
};
let songLang = 'en';
function renderSongs(){
  document.getElementById('songGrid').innerHTML = SONGS[songLang].map(function(v){
    return '<div class="video-card">' + ytLite(v.id) + '<div class="vbody"><h3>' + v.t + '</h3></div></div>';
  }).join('');
}
document.querySelectorAll('#songTabs .tab').forEach(function(t){
  t.addEventListener('click', function(){
    document.querySelectorAll('#songTabs .tab').forEach(function(x){x.classList.remove('active')});
    t.classList.add('active');
    songLang = t.dataset.lang;
    renderSongs();
  });
});
renderSongs();
const CINEMA = {
  en: [
    {t:'تايتانيك — الإعلان الرسمي', id:'2e-eXJ6HgkQ'},
    {t:'الأسد الملك — الإعلان الرسمي', id:'7TavVZMewpY'},
    {t:'ملكة الثلج — الإعلان الرسمي', id:'TbQm5doF_Uc'},
    {t:'ملكة الثلج ٢ — الإعلان الرسمي', id:'Zi4LMpSDccc'},
    {t:'حكاية لعبة ٤ — الإعلان الرسمي', id:'wmiIUN-7qhE'},
    {t:'هاري بوتر وحجر الفيلسوف — الإعلان', id:'VyHV0BRtdxo'},
    {t:'شريك — الإعلان الرسمي', id:'CwXOrWvPBPk'},
    {t:'وحدي بالبيت — الإعلان الرسمي', id:'jEDaVHmw7r4'},
    {t:'البحث عن نيمو — الإعلان الرسمي', id:'2zLkasScy7A'},
    {t:'موانا — الإعلان الرسمي', id:'LKFuXETZUsI'},
    {t:'زوتوبيا — الإعلان الرسمي', id:'g9lmhBYB11U'},
    {t:'إنكانتو — الإعلان الرسمي', id:'CaimKeDcudo'},
    {t:'الطفل الزعيم — الإعلان الرسمي', id:'k397HRbTtWI'},
    {t:'المينيونز — الإعلان الرسمي', id:'eisKxhjBnZ0'},
    {t:'سيارات ٣ — الإعلان الرسمي', id:'2LeOH9AGJQM'},
    {t:'قلبًا وقالبًا — الإعلان الرسمي', id:'seMwpP0yeu4'},
    {t:'كوكو — الإعلان الرسمي', id:'Rvr68u6k5sI'},
    {t:'المنتقمون: حرب اللانهاية — الإعلان', id:'6ZfuNTqbHE8'}
  ],
  fr: [
    {t:'أميلي — الإعلان الرسمي', id:'HUECWi5pX7o'},
    {t:'تروترو — ٣٠ حلقة كرتون كاملة', id:'l03x_-pom5s'},
    {t:'الدب الصغير براون — ساعة حلقات', id:'sA3iRyFuuwE'},
    {t:'الدب الصغير براون — ساعتين حلقات', id:'sXm3-Eg0_ng'}
  ],
  de: [
    {t:'النحلة مايا — حلقة أجواء الميلاد ٣', id:'wVKPZDqIv2I'},
    {t:'النحلة مايا — حلقة أجواء الميلاد ٢', id:'XOJIZL0Ee38'},
    {t:'النحلة مايا — مغامرة العسل الكبيرة', id:'8YER_1_r2wU'},
    {t:'النحلة مايا — ويللي يصبح بطلًا', id:'ITAm-fc1cno'},
    {t:'النحلة مايا — حبوب اللقاح المفقودة', id:'Do4jw7SvPv8'}
  ],
  zh: [
    {t:'الدببة بوني: فانتاستيكا — فيلم كامل', id:'iO0Ze5PBmCU'},
    {t:'الدببة بوني: روبو رامبل — فيلم كامل', id:'KYtOGYeNkbI'},
    {t:'الدببة بوني — حلقة ٣٣', id:'4uCaErG0YLQ'},
    {t:'الدببة بوني: شيفرة الحماية — فيلم كامل', id:'oIkLFRD65a8'},
    {t:'الدببة بوني: الانكماش الكبير — فيلم كامل', id:'xnW5V35H9sU'},
    {t:'الدببة بوني: إلى الإنقاذ — فيلم كامل', id:'U2ipRvgCjnc'}
  ],
  anime: [
    {t:'المخطوفة (سبيريتد أواي) — الإعلان', id:'ByXuk9QqQkk'},
    {t:'قلعة هاول المتحركة — الإعلان', id:'iwROgK94zcM'}
  ],
  cartoon: [
    {t:'توم وجيري — ماراثون الحلقات القصيرة', id:'U91AHkvkh-8'},
    {t:'توم وجيري — أفضل الأصدقاء', id:'cqyziA30whE'},
    {t:'توم وجيري — كل الحلقات (الجزء ١)', id:'UUuxhuI4Ofw'},
    {t:'توم وجيري — معركة الأكل', id:'OjIXzZ25tjA'},
    {t:'تروترو — ٣٠ حلقة كاملة (فرنسي)', id:'l03x_-pom5s'},
    {t:'الدب الصغير براون — ساعة حلقات (فرنسي)', id:'sA3iRyFuuwE'},
    {t:'الدب الصغير براون — ساعتين حلقات (فرنسي)', id:'sXm3-Eg0_ng'},
    {t:'النحلة مايا — مغامرة العسل الكبيرة (ألماني)', id:'8YER_1_r2wU'},
    {t:'النحلة مايا — ويللي يصبح بطلًا (ألماني)', id:'ITAm-fc1cno'},
    {t:'النحلة مايا — حبوب اللقاح المفقودة (ألماني)', id:'Do4jw7SvPv8'},
    {t:'الدببة بوني: فانتاستيكا — فيلم كامل (صيني)', id:'iO0Ze5PBmCU'},
    {t:'الدببة بوني: روبو رامبل — فيلم كامل (صيني)', id:'KYtOGYeNkbI'},
    {t:'الدببة بوني: شيفرة الحماية — فيلم كامل (صيني)', id:'oIkLFRD65a8'},
    {t:'الدببة بوني: الانكماش الكبير — فيلم كامل (صيني)', id:'xnW5V35H9sU'},
    {t:'الدببة بوني: إلى الإنقاذ — فيلم كامل (صيني)', id:'U2ipRvgCjnc'}
  ],
  series: [
    {t:'Extra English — الحلقة ١: وصول هيكتور (الجزء ١)', id:'k89GF-i_Eyg'},
    {t:'Extra English — الحلقة ١ كاملة', id:'DjufuMDV9D8'},
    {t:'Extra English — الحلقة ١ بترجمة إنجليزية', id:'uG3XVajkQ_4'},
    {t:'Extra French — الحلقة ١ بترجمة فرنسية', id:'EaNqp4FXh-s'},
    {t:'Extra French — الحلقة ١: وصول سام', id:'YGE6ymTCHAQ'},
    {t:'Extra German — الحلقة ١: وصول سام بترجمة', id:'MbI21f7z02I'},
    {t:'Extra German — الحلقة ١ بترجمة ألمانية', id:'F6khA8eZaD4'}
  ],
  ko: [
    {t:'باراسايت (Parasite) — الإعلان الرسمي', id:'5xH0HfJHsaY'},
    {t:'لعبة الحبار (Squid Game) — الإعلان الرسمي', id:'oqxAJKy0ii4'},
    {t:'قطار بوسان (Train to Busan) — الإعلان الرسمي', id:'pyWuHv2-Abk'}
  ]
};
let cinTab = 'en';
function renderCinema(){
  document.getElementById('movieGrid').innerHTML = CINEMA[cinTab].map(function(v){
    return '<div class="video-card">' + ytLite(v.id) + '<div class="vbody"><h3>' + v.t + '</h3></div></div>';
  }).join('');
}
document.querySelectorAll('#cinemaTabs .tab').forEach(function(t){
  t.addEventListener('click', function(){
    document.querySelectorAll('#cinemaTabs .tab').forEach(function(x){x.classList.remove('active')});
    t.classList.add('active');
    cinTab = t.dataset.cinema;
    renderCinema();
  });
});
renderCinema();

/* ================= v4.3: daily gift + goal + quote ================= */
(function(){
  try {
    const today = new Date().toDateString();
    const last = localStorage.getItem('lingua_gift_day');
    if(last !== today){
      localStorage.setItem('lingua_gift_day', today);
      awardPoints(25, 'هدية اليوم 🎁');
      setTimeout(function(){
        confetti();
        toast('🎁 هدية اليوم: +٢٥ نقطة! تعالي كل يوم تكسبي');
      }, 1500);
    }
  } catch(e){}
})();
(function(){
  try {
    const QUOTES = [
      'كل كلمة جديدة بتقرّبك من حلمك 🌟',
      'مفيش حاجة اسمها صعب، في بس لسه ما اتعلمتوش 💪',
      'اللغة مفتاح العالم — وإنتي معاكي ٤ مفاتيح 🗝️',
      'خطوة صغيرة كل يوم = إنجاز كبير آخر السنة 📈',
      'الغلط أول خطوة في التعلّم، كمّلي غلط واتعلمي 😄',
      'إنتي أقوى من أي كلمة صعبة 💜'
    ];
    const day = Math.floor(Date.now() / 86400000);
    const q = QUOTES[day % QUOTES.length];
    const badge = document.getElementById('dashBadge');
    if(badge){
      const d = document.createElement('div');
      d.style.cssText = 'margin-top:10px;color:var(--muted);font-size:1rem;font-style:italic';
      d.textContent = '✨ ' + q;
      badge.parentNode.insertBefore(d, badge.nextSibling);
    }
  } catch(e){}
})();
function renderGoal(){
  try {
    const today = new Date().toDateString();
    const key = 'lingua_goal_' + today;
    const pts = parseInt(localStorage.getItem(key) || '0', 10);
    const target = 100;
    const pct = Math.min(100, Math.round(pts / target * 100));
    const fill = document.getElementById('goalFill');
    const txt = document.getElementById('goalText');
    if(!fill) return;
    fill.style.width = pct + '%';
    txt.textContent = pts + ' / ' + target;
    if(pts >= target && !localStorage.getItem('lingua_goal_done_' + today)){
      localStorage.setItem('lingua_goal_done_' + today, '1');
      sndWin(); confetti();
      toast('🎯 حقّقتي هدف اليوم! بطلة 🏆');
    }
  } catch(e){}
}
const __origAward = awardPoints;
awardPoints = function(n, label){
  __origAward(n, label);
  try {
    if(n > 0){
      const today = new Date().toDateString();
      const key = 'lingua_goal_' + today;
      localStorage.setItem(key, String(parseInt(localStorage.getItem(key) || '0', 10) + n));
      renderGoal();
    }
  } catch(e){}
};
renderGoal();

/* ================= v5: language corners ================= */
const CORNERS = {
  en: {flag:'🇬🇧', name:'الإنجليزية', motto:'لغة العالم كله 🌍', greet:'Hello!',
    facts:['١.٥ مليار متحدث حول العالم 🌍','اللغة الرسمية في ٦٧ دولة','لغة العلم والتكنولوجيا الأولى 💻']},
  fr: {flag:'🇫🇷', name:'الفرنسية', motto:'لغة الأناقة والحب 🇫🇷', greet:'Bonjour!',
    facts:['٣٢٠ مليون متحدث 🗣️','لغة الأزياء والدبلوماسية','رسمية في ٢٩ دولة']},
  de: {flag:'🇩🇪', name:'الألمانية', motto:'لغة الدقة والهندسة ⚙️', greet:'Hallo!',
    facts:['١٣٠ مليون متحدث 🇩🇪','أكبر لغة أم في أوروبا','لغة الفلسفة والاختراعات']},
  zh: {flag:'🇨🇳', name:'الصينية', motto:'لغة الحضارة العريقة 🐉', greet:'你好!',
    facts:['١.٣ مليار متحدث — الأكبر عالميًا 🏮','حروفها عمرها ٣٠٠٠+ سنة','لغة المستقبل الاقتصادية']},
  ko: {flag:'🇰🇷', name:'الكورية', motto:'لغة الكيدراما والكيبوب 💜', greet:'안녕하세요!',
    facts:['٨٠ مليون متحدث 🇰🇷','الهانغل أبجدية علمية اخترعها ملك عام ١٤٤٣','ممكن تتعلمي قراءتها في يوم واحد!']}
};
let cornerLang = 'en';
function goLang(lang, target){
  ['quizTabs','gameTabs','dictTabs','galTabs','songTabs'].forEach(function(id){
    const t = document.querySelector('#' + id + ' .tab[data-lang="' + lang + '"]');
    if(t) t.click();
  });
  const el = document.getElementById(target);
  if(el) el.scrollIntoView({behavior:'smooth'});
}
function renderCorner(){
  const c = CORNERS[cornerLang];
  const words = DICT[cornerLang].slice(0, 8);
  const songs = SONGS[cornerLang] || [];
  let html = '<div class="corner-hero"><div class="cflag">' + c.flag + '</div>' +
    '<div><div class="cname">ركن ' + c.name + '</div><div class="cmotto">' + c.motto + '</div></div>' +
    '<div class="corner-greet"><div class="gw">' + c.greet + '</div>' +
    '<button class="gal-listen corner-greet-btn">🔊 اسمعي التحية</button></div></div>' +
    '<div class="corner-facts">' + c.facts.map(function(f){ return '<div class="corner-fact">' + f + '</div>'; }).join('') + '</div>' +
    '<h3 style="color:var(--gold2);margin-bottom:10px">📖 كلمات أساسية</h3>' +
    '<div class="corner-words">' + words.map(function(w){
      return '<div class="corner-word"><b>' + w[0] + '</b><span>' + w[1] + '</span></div>';
    }).join('') + '</div>';
  if(songs.length){
    html += '<h3 style="color:var(--gold2);margin-bottom:10px">🎵 أغاني اللغة</h3><div class="video-grid">' +
      songs.map(function(v){
        return '<div class="video-card">' + ytLite(v.id) + '<div class="vbody"><h3>' + v.t + '</h3></div></div>';
      }).join('') + '</div>';
  }
  html += '<div class="corner-cta">' +
    '<button class="btn corner-go" data-target="lessons">📚 دروس ' + c.name + '</button>' +
    '<button class="btn corner-go" style="background:linear-gradient(120deg,#b79bf0,#7c5cd6);color:#fff" data-target="quiz">📝 اختباري نفسك</button>' +
    '<button class="btn corner-go" style="background:rgba(255,255,255,.12);color:var(--gold2)" data-target="games">🎮 ألعاب ' + c.name + '</button></div>';
  document.getElementById('cornerCard').innerHTML = html;
  document.querySelectorAll('.corner-go').forEach(function(b){
    b.addEventListener('click', function(){ goLang(cornerLang, b.dataset.target); });
  });
  const gb = document.querySelector('.corner-greet-btn');
  if(gb) gb.addEventListener('click', function(){ speakText(c.greet.replace('!',''), cornerLang); });
}
document.querySelectorAll('.corner-flag').forEach(function(b){
  b.addEventListener('click', function(){
    document.querySelectorAll('.corner-flag').forEach(function(x){x.classList.remove('active')});
    b.classList.add('active');
    cornerLang = b.dataset.lang;
    renderCorner();
  });
});
renderCorner();

/* ================= v3: challenge a friend ================= */
function shareChallenge(kind, parts){
  const name = (localStorage.getItem('lingua_cert_name') || '').trim() || 'صديقتك';
  const url = location.origin + location.pathname + '#' + kind + '=' + parts.join('-') + '-' + encodeURIComponent(name);
  const done = function(){ toast('لينك التحدي اتنسخ — ابعتيه لصاحبك ⚔️'); logChal('تحدّيتِ صاحبك: ' + (kind === 'c' ? 'اختبار ' + parts[0] + ' بنتيجة ' + parts[2] : 'لعبة ذاكرة في ' + parts[1] + ' حركة')); };
  if(navigator.clipboard && navigator.clipboard.writeText){
    navigator.clipboard.writeText(url).then(done, function(){ prompt('انسخي لينك التحدي:', url); });
  } else {
    prompt('انسخي لينك التحدي:', url);
  }
}
(function(){
  const h = location.hash || '';
  if(h.indexOf('#c=') !== 0 && h.indexOf('#g=') !== 0) return;
  const parts = h.slice(3).split('-');
  let msg = '', go = null;
  const name = decodeURIComponent(parts[parts.length-1] || 'صديقتك');
  if(h.indexOf('#c=') === 0 && parts.length >= 5){
    const lang = parts[0], level = parts[1], score = parts[2], total = parts[3];
    if(!QUIZZES[lang] || !QUIZZES[lang][level]) return;
    window.__chal = {name:name, lang:lang, level:level, score:parseInt(score,10)};
    msg = '⚔️ '+name+' جابت '+score+' من '+total+' في اختبار '+LANG_NAMES[lang]+' — المستوى '+LEVEL_NAMES[level]+'. تقدري تكسريها؟';
    go = function(){
      document.getElementById('quiz').scrollIntoView({behavior:'smooth'});
      document.querySelectorAll('#quizTabs .tab').forEach(function(x){ x.classList.toggle('active', x.dataset.lang === lang); });
      document.querySelectorAll('#quizLevelTabs .tab').forEach(function(x){ x.classList.toggle('active', x.dataset.level === level); });
      startQuiz(lang, level);
    };
  } else if(h.indexOf('#g=') === 0 && parts.length >= 3){
    const lang = parts[0], moves = parts[1];
    if(!GAME_WORDS[lang]) return;
    msg = '⚔️ '+name+' خلّصت لعبة الذاكرة ('+LANG_NAMES[lang]+') في '+moves+' حركة بس. تقدري تكسريها؟';
    go = function(){
      document.getElementById('games').scrollIntoView({behavior:'smooth'});
      document.querySelectorAll('#gameTabs .tab').forEach(function(x){ x.classList.toggle('active', x.dataset.lang === lang); });
      newGame(lang);
    };
  }
  if(!msg) return;
  const bar = document.getElementById('challengeBar');
  document.getElementById('challengeText').textContent = msg;
  bar.classList.add('show');
  document.getElementById('challengeGo').addEventListener('click', function(){
    bar.classList.remove('show');
    if(go) go();
  });
  document.getElementById('challengeX').addEventListener('click', function(){ bar.classList.remove('show'); });
})();

/* ================= v3 surprises: karma word, easter egg, listen mode ================= */
document.getElementById('karmaWord').addEventListener('click', function(){ speakText('Serendipity', 'en'); });
(function(){
  let buf = '';
  document.addEventListener('keydown', function(e){
    if(e.key && e.key.length === 1){
      buf = (buf + e.key).slice(-10);
      if(buf.endsWith('كارما') || buf.toLowerCase().endsWith('karma')){
        confetti(); sndWin();
        toast('✨ Lingua بتحب كارما ✨');
        buf = '';
      }
    }
  });
})();
/* listen mode: play a whole lesson aloud */
document.querySelectorAll('.lang-panel .lesson').forEach(function(lesson){
  const panel = lesson.closest('.lang-panel');
  const lang = panel ? panel.dataset.lang : 'en';
  const rows = [];
  lesson.querySelectorAll('tbody tr').forEach(function(tr){
    const tds = tr.querySelectorAll('td');
    if(tds.length < 2) return;
    let idx = 0;
    if(/^[\d\u0660-\u0669\s.,:;\-؟?!]*$/.test(tds[0].textContent.trim())) idx = 1;
    rows.push(tds[idx].textContent.trim());
  });
  if(!rows.length) return;
  const b = document.createElement('button');
  b.className = 'reveal-toggle';
  b.type = 'button';
  b.textContent = '▶️ استمعي للدرس كله';
  let playing = false;
  b.addEventListener('click', function(){
    if(playing){ speechSynthesis.cancel(); playing = false; b.textContent = '▶️ استمعي للدرس كله'; return; }
    if(!('speechSynthesis' in window)) return;
    playing = true;
    b.textContent = '⏸️ إيقاف الاستماع';
    let i = 0;
    (function next(){
      if(!playing || i >= rows.length){
        playing = false; b.textContent = '▶️ استمعي للدرس كله';
        return;
      }
      const u = new SpeechSynthesisUtterance(rows[i++]);
      u.lang = TTS_LANGS[lang] || 'en-US';
      u.rate = 0.8;
      u.onend = function(){ setTimeout(next, 350); };
      speechSynthesis.speak(u);
    })();
  });
  const toggle = lesson.querySelector('.reveal-toggle');
  if(toggle) toggle.parentNode.insertBefore(b, toggle.nextSibling);
  else lesson.insertBefore(b, lesson.firstChild);
});


/* ================= v6: points economy core ================= */
function getLifetime(){
  const l = parseInt(localStorage.getItem('lingua_lifetime')||'0',10);
  return Math.max(l, getPoints());
}
function spendPoints(n){
  const cur = getPoints();
  if(cur < n){ toast('نقاطك مش كفاية — العبي واكسبي أكتر 💪'); sndBad(); return false; }
  localStorage.setItem('lingua_points', String(cur-n));
  toast('-'+n+' نقطة 🛍️');
  if(window.refreshDash) window.refreshDash();
  return true;
}
function getHints(){ return parseInt(localStorage.getItem('lingua_hints')||'0',10); }
function spendHint(){
  const h = getHints();
  if(h <= 0) return false;
  localStorage.setItem('lingua_hints', String(h-1));
  if(window.renderShop) window.renderShop();
  return true;
}
const LEVELS = [[0,'🌱 بداية الرحلة'],[100,'⭐ صاعدة'],[250,'🌿 مثابرة'],[450,'🔥 مجتهدة'],[700,'💪 قوية'],[1000,'💫 نجمة لينجوا'],[1500,'🎯 عبقرية'],[2200,'🚀 خارقة'],[3000,'👑 أسطورة اللغات']];
function levelOf(life){
  let cur = LEVELS[0], next = null, nextName = '';
  for(let i = 0; i < LEVELS.length; i++){
    if(life >= LEVELS[i][0]){ cur = LEVELS[i]; next = i < LEVELS.length-1 ? LEVELS[i+1][0] : null; nextName = i < LEVELS.length-1 ? LEVELS[i+1][1] : ''; }
  }
  const pct = next ? Math.min(100, Math.round(100*(life-cur[0])/(next-cur[0]))) : 100;
  return {name:cur[1], next:next, nextName:nextName, pct:pct};
}

/* ================= v6: shop ================= */
const SHOP = [
  {kind:'theme', id:'royal', ico:'🏰', name:'ثيم ملكي', desc:'ثيم ذهبي ملكي يليق بيكي', price:150},
  {kind:'theme', id:'sunset', ico:'🌅', name:'ثيم الغروب', desc:'ألوان الغروب الدافية', price:300},
  {kind:'theme', id:'midnight', ico:'🌌', name:'ثيم منتصف الليل', desc:'أزرق ليلي هادي وفخم', price:500},
  {kind:'hint', id:'hint', ico:'💡', name:'تلميح للاختبار', desc:'يكشف الإجابة الصح في سؤال واحد', price:20},
  {kind:'avatar', id:'a1', av:'🦄', ico:'🦄', name:'أفتار يونيكورن', desc:'أفتار مميز لحسابك', price:30},
  {kind:'avatar', id:'a2', av:'🐉', ico:'🐉', name:'أفتار تنين', desc:'أفتار قوي وجريء', price:30},
  {kind:'avatar', id:'a3', av:'🦢', ico:'🦢', name:'أفتار بجعة', desc:'أفتار راقٍ وناعم', price:30},
  {kind:'avatar', id:'a4', av:'🐆', ico:'🐆', name:'أفتار فهد', desc:'أفتار سريع وشيك', price:30},
  {kind:'avatar', id:'a5', av:'🌺', ico:'🌺', name:'أفتار وردة', desc:'أفتار أنيق وملون', price:30},
  {kind:'title', id:'t1', title:'ملكة اللغات 👑', ico:'👑', name:'لقب: ملكة اللغات', desc:'أفخم لقب — يظهر في لوحتك', price:800},
  {kind:'title', id:'t2', title:'عبقرية لينجوا 🧠', ico:'🧠', name:'لقب: عبقرية لينجوا', desc:'لقب للمتميزات', price:400},
  {kind:'title', id:'t3', title:'فراشة الكلمات 🦋', ico:'🦋', name:'لقب: فراشة الكلمات', desc:'لقب لطيف وناعم', price:150}
];
function getOwnedItems(){ try{ return JSON.parse(localStorage.getItem('lingua_owned')||'[]'); }catch(e){ return []; } }
function ownItem(id){ const o = getOwnedItems(); if(o.indexOf(id)<0){ o.push(id); localStorage.setItem('lingua_owned', JSON.stringify(o)); } }
window.renderShop = function(){
  const grid = document.getElementById('shopGrid');
  if(!grid) return;
  const owned = getOwnedItems();
  const pts = getPoints();
  grid.innerHTML = SHOP.map(function(it){
    const isOwned = it.kind !== 'hint' && owned.indexOf(it.id) >= 0;
    const can = pts >= it.price;
    const btn = isOwned
      ? '<button class="btn" style="width:100%;background:rgba(255,255,255,.1);color:var(--gold2)" data-use="'+it.id+'">✅ عندك — استخدميه</button>'
      : '<button class="btn" style="width:100%'+(can?'':';opacity:.5')+'" data-buy="'+it.id+'">'+(can?'اشتريه':'محتاجة')+' — '+it.price+' 💎</button>';
    return '<div class="shop-card'+(isOwned?' owned':'')+'"><div class="s-ico">'+it.ico+'</div><div class="s-name">'+it.name+'</div><div class="s-desc">'+it.desc+'</div><div class="s-price">'+(it.kind==='hint'?'عندك '+getHints()+' تلميح • ':'')+it.price+' نقطة</div>'+btn+'</div>';
  }).join('');
  grid.querySelectorAll('[data-buy]').forEach(function(b){
    b.addEventListener('click', function(){ buyItem(b.dataset.buy); });
  });
  grid.querySelectorAll('[data-use]').forEach(function(b){
    b.addEventListener('click', function(){ useItem(b.dataset.use); });
  });
};
function buyItem(id){
  const it = SHOP.find(function(x){ return x.id === id; });
  if(!it) return;
  if(!spendPoints(it.price)) return;
  if(it.kind === 'hint'){
    localStorage.setItem('lingua_hints', String(getHints()+1));
    toast('💡 تلميح جديد في جيبك! استخدميه جوه أي اختبار');
  } else {
    ownItem(it.id);
    if(it.kind === 'theme'){
      const o = getOwnedThemes();
      if(o.indexOf(it.id) < 0){ o.push(it.id); localStorage.setItem('lingua_owned_themes', JSON.stringify(o)); }
      if(window.buildThemeDots) window.buildThemeDots();
      toast('🎨 ثيم جديد اتفتح! دوّري عليه في زرار الثيمات');
    }
    if(it.kind === 'avatar'){ useItem(it.id); }
    if(it.kind === 'title'){ useItem(it.id); }
  }
  sndGood(); confetti();
  window.renderShop();
  if(window.refreshDash) window.refreshDash();
}
function useItem(id){
  const it = SHOP.find(function(x){ return x.id === id; });
  if(!it) return;
  if(it.kind === 'theme'){ applyTheme(it.id); toast('🎨 الثيم اتطبق!'); }
  if(it.kind === 'avatar'){
    try { localStorage.setItem('lingua_profile_avatar', it.av); } catch(e){}
    if(window.loadProfile) window.loadProfile();
    document.getElementById('pfAvatar').textContent = it.av;
    toast('أفتارك الجديد '+it.av+' ✨');
  }
  if(it.kind === 'title'){
    try { localStorage.setItem('lingua_title', it.title); } catch(e){}
    if(window.refreshDash) window.refreshDash();
    toast('لقبك بقى: '+it.title);
  }
  sndGood();
}

/* ================= v6: badges ================= */
const BADGES = [
  {id:'b10', ico:'🌟', name:'أول ١٠ نقاط', test:function(s){ return s.life >= 10; }},
  {id:'b100', ico:'⭐', name:'مية نقطة', test:function(s){ return s.life >= 100; }},
  {id:'b300', ico:'💫', name:'٣٠٠ نقطة', test:function(s){ return s.life >= 300; }},
  {id:'b600', ico:'🔥', name:'٦٠٠ نقطة', test:function(s){ return s.life >= 600; }},
  {id:'b1000', ico:'👑', name:'١٠٠٠ نقطة', test:function(s){ return s.life >= 1000; }},
  {id:'bpoly', ico:'🌍', name:'رباعية اللغات', test:function(s){ return s.langs >= 4; }},
  {id:'bperf', ico:'💯', name:'علامة كاملة', test:function(s){ return s.perfect >= 1; }},
  {id:'bgame', ico:'🎮', name:'ملكة الألعاب', test:function(s){ return s.games >= 1; }},
  {id:'bweek', ico:'📅', name:'أسبوع متواصل', test:function(s){ return s.streak >= 7; }}
];
function collectStats(){
  let quizzes = 0, perfect = 0, games = 0;
  const levelsDone = {en:0, fr:0, de:0, zh:0, ko:0};
  ['en','fr','de','zh','ko'].forEach(function(l){
    ['beg','mid','adv'].forEach(function(v){
      const b = localStorage.getItem('lingua_best_'+l+'_'+v);
      if(b !== null){ quizzes++; levelsDone[l]++; if(parseInt(b,10) === QUIZZES[l][v].length) perfect++; }
    });
    if(localStorage.getItem('lingua_game_best_'+l) !== null) games++;
  });
  let streak = 0;
  try { streak = (JSON.parse(localStorage.getItem('lingua_streak'))||{}).count || 0; } catch(e){}
  let langs = 0;
  ['en','fr','de','zh'].forEach(function(l){ if(levelsDone[l] > 0) langs++; });
  return {life:getLifetime(), quizzes:quizzes, perfect:perfect, games:games, streak:streak, langs:langs};
}
function checkBadges(){
  const st = collectStats();
  let earned = [];
  try { earned = JSON.parse(localStorage.getItem('lingua_badges')||'[]'); } catch(e){}
  let fresh = false;
  BADGES.forEach(function(b){
    if(earned.indexOf(b.id) < 0 && b.test(st)){
      earned.push(b.id); fresh = true;
      toast('🏅 وسام جديد: ' + b.name);
      confetti();
    }
  });
  if(fresh) localStorage.setItem('lingua_badges', JSON.stringify(earned));
}
window.renderBadges = function(){
  const grid = document.getElementById('badgeGrid');
  if(!grid) return;
  const st = collectStats();
  let earned = [];
  try { earned = JSON.parse(localStorage.getItem('lingua_badges')||'[]'); } catch(e){}
  grid.innerHTML = BADGES.map(function(b){
    const has = earned.indexOf(b.id) >= 0 || b.test(st);
    return '<div class="badge-card'+(has?'':' locked')+'"><div class="b-ico">'+b.ico+'</div><div class="b-name">'+b.name+'</div></div>';
  }).join('');
};

/* ================= v6: router — كل قسم صفحة لوحده ================= */
const MENU = [
  ['dash','💎','لوحة إنجازك'],['corners','🌍','أقسام اللغات'],['courses','🎓','الكورسات'],
  ['lessons','📚','الدروس'],['quiz','📝','الاختبارات'],['games','🎯','ألعاب اللغات'],
  ['brain','🧠','ألعاب ذكاء'],['fun','🎮','العاب'],['dressup','👗','ستوديو التلبيس'],['dict','📖','القاموس'],
  ['gallery','📸','بالصور'],['speak','🎤','تدريب النطق'],['videos','🎥','فيديوهات'],
  ['songs','🎵','أغاني'],['music','🎧','استمع'],['cinema','🎬','سينما'],['shop','🛍️','متجر النقاط'],
  ['friends','👯','أصحابي'],['outfit','👚','منسقة اللبس'],['eng','⚙️','كورسات هندسة'],['scholar','🏆','منح دراسية'],
  ['map','🚀','مسار التعلم'],['placement','🎯','مستواي'],['quests','📋','مهام اليوم'],['listen','🎧','استماع'],['mistakes','🩹','أخطائي'],['pquiz','🔮','شخصيتك'],['wheel','🎡','عجلة الحظ'],['qotd','❓','سؤال اليوم'],['flash','🃏','كروت سحرية'],['snake','🐍','الثعبان'],['xo','⭕','إكس أو'],['korean','🇰🇷','كوري'],['library','📕','مكتبة'],['food','🍳','المطبخ'],['stories','📚','قصص'],['color','🎨','تلوين'],['capitals','🌍','عواصم'],['ch30','📅','تحدي ٣٠ يوم'],['piano','🎹','بيانو'],['diary','📔','يومياتي'],['khatma','📿','ختمتي'],['weather','🌤️','الجو'],['shooter','🔫','صيد الكلمات'],['runner','🏃‍♀️','الجري'],['fashion','👠','موضة'],['trip','✈️','رحلة'],['places','🏛️','أماكن'],['premium','💎','بريميوم'],['quotes','🎬','اقتباسات'],['ai','🤖','لمى'],['puzzle','🧩','بازل الكلمات'],['hobbies','🎨','هوايات'],['themes','🗂️','كلمات بالموضوع'],['jokes','😂','ضحك'],['mood','🎭','مزاجك'],['wall','💬','حائط الكلام'],['deen','🕌','ركن الروح'],['mushaf','📖','المصحف'],['karma','👑','ركن كارما'],['gbk','💌','كلمة لكارما'],['vent','💭','فضفضة'],['tips','💡','نصايح اللغات'],['settings','🌐','لغة التطبيق'],['pet','🥚','رفيقتي']
];

/* ================= v16: free books library ================= */
(function(){
  var LIB = {
    en: {name:'إنجليزي 🇬🇧', more:'https://www.gutenberg.org/browse/languages/en', books:[
      ['Pride and Prejudice','Jane Austen','https://www.gutenberg.org/ebooks/1342','#7c5cff'],
      ['Frankenstein','Mary Shelley','https://www.gutenberg.org/ebooks/84','#2dd4bf'],
      ['Sherlock Holmes','Arthur Conan Doyle','https://www.gutenberg.org/ebooks/1661','#f5a623'],
      ['Alice in Wonderland','Lewis Carroll','https://www.gutenberg.org/ebooks/11','#ff5c8a'],
      ['A Tale of Two Cities','Charles Dickens','https://www.gutenberg.org/ebooks/98','#4cc9f0'],
      ['Moby Dick','Herman Melville','https://www.gutenberg.org/ebooks/2701','#9b5cff']]},
    fr: {name:'فرنسي 🇫🇷', more:'https://www.gutenberg.org/browse/languages/fr', books:[
      ['Les Misérables','Victor Hugo','https://fr.wikisource.org/wiki/Les_Mis%C3%A9rables','#7c5cff'],
      ['Le Comte de Monte-Cristo','Alexandre Dumas','https://fr.wikisource.org/wiki/Le_Comte_de_Monte-Cristo','#2dd4bf'],
      ['Les Trois Mousquetaires','Alexandre Dumas','https://fr.wikisource.org/wiki/Les_Trois_Mousquetaires','#f5a623'],
      ['Vingt mille lieues sous les mers','Jules Verne','https://fr.wikisource.org/wiki/Vingt_mille_lieues_sous_les_mers','#ff5c8a'],
      ['Candide','Voltaire','https://fr.wikisource.org/wiki/Candide','#4cc9f0'],
      ['Le Tour du monde en 80 jours','Jules Verne','https://fr.wikisource.org/wiki/Le_Tour_du_monde_en_quatre-vingts_jours','#9b5cff']]},
    de: {name:'ألماني 🇩🇪', more:'https://www.gutenberg.org/browse/languages/de', books:[
      ['Faust I','Goethe','https://de.wikisource.org/wiki/Faust_-_Der_Trag%C3%B6die_erster_Teil','#7c5cff'],
      ['Die Verwandlung','Franz Kafka','https://de.wikisource.org/wiki/Die_Verwandlung','#2dd4bf'],
      ['Der Process','Franz Kafka','https://de.wikisource.org/wiki/Der_Process','#f5a623'],
      ['Siddhartha','Hermann Hesse','https://de.wikisource.org/wiki/Siddhartha','#ff5c8a'],
      ['Kinder- und Hausmärchen','Brüder Grimm','https://de.wikisource.org/wiki/Kinder-_und_Hausm%C3%A4rchen','#4cc9f0'],
      ['Die Leiden des jungen Werther','Goethe','https://de.wikisource.org/wiki/Die_Leiden_des_jungen_Werthers','#9b5cff']]},
    zh: {name:'صيني 🇨🇳', more:'https://zh.wikisource.org', books:[
      ['紅樓夢 — حلم الغرفة الحمراء','曹雪芹','https://zh.wikisource.org/wiki/%E7%B4%85%E6%A8%93%E5%A4%A2','#7c5cff'],
      ['三國演義 — ملحمة الممالك الثلاث','羅貫中','https://zh.wikisource.org/wiki/%E4%B8%89%E5%9C%8B%E6%BC%94%E7%BE%A9','#2dd4bf'],
      ['西遊記 — رحلة إلى الغرب','吳承恩','https://zh.wikisource.org/wiki/%E8%A5%BF%E9%81%8A%E8%A8%98','#f5a623'],
      ['水滸傳 — على ضفاف النهر','施耐庵','https://zh.wikisource.org/wiki/%E6%B0%B4%E6%BB%B8%E5%82%B3','#ff5c8a'],
      ['論語 — محاورات كونفوشيوس','孔子','https://zh.wikisource.org/wiki/%E8%AB%96%E8%AA%9E','#4cc9f0'],
      ['唐詩三百首 — ٣٠٠ قصيدة تانغ','شعراء تانغ','https://zh.wikisource.org/wiki/%E5%94%90%E8%A9%A9%E4%B8%89%E7%99%BE%E9%A6%96','#9b5cff']]},
    ko: {name:'كوري 🇰🇷', more:'https://ko.wikisource.org', books:[
      ['홍길동전 — حكاية هونغ غيل-دونغ','허균','https://ko.wikisource.org/wiki/%ED%99%8D%EA%B8%B8%EB%8F%99%EC%A0%84','#7c5cff'],
      ['춘향전 — حكاية تشونهيانغ','فولكلور كوري','https://ko.wikisource.org/wiki/%EC%B6%98%ED%96%A5%EC%A0%84','#2dd4bf'],
      ['흥부전 — حكاية هونغبو','فولكلور كوري','https://ko.wikisource.org/wiki/%ED%9D%A5%EB%B6%80%EC%A0%84','#f5a623'],
      ['심청전 — حكاية شيم تشونغ','فولكلور كوري','https://ko.wikisource.org/wiki/%EC%8B%AC%EC%B2%AD%EC%A0%84','#ff5c8a'],
      ['토끼전 — حكاية الأرنب','فولكلور كوري','https://ko.wikisource.org/wiki/%ED%86%A0%EB%81%BC%EC%A0%84','#4cc9f0']]}
  };
  var cur = 'en';
  var tabs = document.getElementById('libTabs');
  var grid = document.getElementById('libBooks');
  var more = document.getElementById('libMore');
  if(!tabs || !grid) return;
  tabs.innerHTML = Object.keys(LIB).map(function(k){
    return '<button class="tab lang-tab'+(k===cur?' active':'')+'" data-lib="'+k+'"><span class="ln">'+LIB[k].name+'</span></button>';
  }).join('');
  function esc(t){ return t.replace(/&/g,'&amp;').replace(/</g,'&lt;'); }
  function renderLib(){
    var L = LIB[cur];
    grid.innerHTML = L.books.map(function(b){
      var ch = esc(b[0].trim().charAt(0));
      return '<a class="book-card" href="'+b[2]+'" target="_blank" rel="noopener">'
        + '<div class="book-cover" style="background:linear-gradient(135deg,'+b[3]+',#1a1225)">'+ch+'</div>'
        + '<div class="book-info"><div class="book-title">'+esc(b[0])+'</div><div class="book-author">'+esc(b[1])+'</div>'
        + '<div class="book-read">اقرئي مجانًا ↗</div></div></a>';
    }).join('');
    more.href = L.more;
  }
  tabs.addEventListener('click', function(e){
    var b = e.target.closest('[data-lib]');
    if(!b) return;
    cur = b.dataset.lib;
    tabs.querySelectorAll('.lang-tab').forEach(function(t){ t.classList.toggle('active', t===b); });
    renderLib();
  });
  renderLib();
})();


/* ================= v17: food corner ================= */
(function(){
  function svgWrap(inner){ return '<svg viewBox="0 0 60 60" width="44" height="44">'+inner+'</svg>'; }
  var ING = {
    dough:{n:'عجينة', svg:'<ellipse cx="30" cy="34" rx="26" ry="20" fill="#f0d9a8" stroke="#d9b878" stroke-width="2"/>'},
    sauce:{n:'صلصة', svg:'<ellipse cx="30" cy="34" rx="21" ry="15" fill="#e74c3c"/>'},
    cheese:{n:'جبنة', svg:'<ellipse cx="30" cy="34" rx="18" ry="12" fill="#f7c948"/><circle cx="22" cy="31" r="3" fill="#e8a91c"/><circle cx="36" cy="37" r="2.5" fill="#e8a91c"/><circle cx="30" cy="30" r="2" fill="#e8a91c"/>'},
    tomato:{n:'طماطم', svg:'<circle cx="30" cy="34" r="10" fill="#e74c3c" stroke="#c0392b" stroke-width="2"/><circle cx="30" cy="34" r="4" fill="#ff8a75"/><path d="M26 24 q4 -4 8 0" stroke="#27ae60" stroke-width="3" fill="none"/>'},
    pepperoni:{n:'بيبروني', svg:'<circle cx="24" cy="30" r="7" fill="#a93226"/><circle cx="38" cy="38" r="7" fill="#a93226"/><circle cx="24" cy="30" r="2" fill="#e5988e"/><circle cx="38" cy="38" r="2" fill="#e5988e"/>'},
    mushroom:{n:'مشروم', svg:'<rect x="26" y="32" width="8" height="12" rx="3" fill="#f5f0e1"/><path d="M16 32 a14 12 0 0 1 28 0 z" fill="#b5651d"/><circle cx="24" cy="27" r="2" fill="#f5f0e1"/><circle cx="34" cy="25" r="2.5" fill="#f5f0e1"/>'},
    bun_b:{n:'عيش تحت', svg:'<rect x="10" y="36" width="40" height="10" rx="5" fill="#e8b04b" stroke="#c98a2b" stroke-width="2"/>'},
    patty:{n:'لحمة', svg:'<rect x="11" y="29" width="38" height="9" rx="4" fill="#6e3b1f" stroke="#54290f" stroke-width="2"/>'},
    lettuce:{n:'خس', svg:'<path d="M10 30 q6 -8 12 0 q6 -8 12 0 q6 -8 12 0 q4 -6 8 -2 l-2 6 h-40 z" fill="#7bc950" stroke="#5aa83a" stroke-width="2"/>'},
    cheese_slice:{n:'شريحة جبنة', svg:'<rect x="14" y="26" width="32" height="6" rx="2" fill="#f7c948" transform="rotate(4 30 29)"/>'},
    bun_t:{n:'عيش فوق', svg:'<path d="M10 30 a20 16 0 0 1 40 0 z" fill="#e8b04b" stroke="#c98a2b" stroke-width="2"/><circle cx="22" cy="20" r="1.5" fill="#fff2cf"/><circle cx="32" cy="16" r="1.5" fill="#fff2cf"/><circle cx="40" cy="21" r="1.5" fill="#fff2cf"/>'},
    rice:{n:'رز', svg:'<path d="M12 40 q18 -10 36 0 l-4 8 h-28 z" fill="#fdf6e3"/><circle cx="24" cy="34" r="2" fill="#fff"/><circle cx="32" cy="32" r="2" fill="#fff"/><circle cx="38" cy="35" r="2" fill="#fff"/>'},
    fish:{n:'سمك', svg:'<path d="M14 34 q12 -12 24 0 q-12 12 -24 0 z" fill="#ff8c69" stroke="#e06a45" stroke-width="2"/><path d="M38 34 l8 -6 v12 z" fill="#e06a45"/><circle cx="20" cy="32" r="1.6" fill="#333"/>'},
    avo:{n:'أفوكادو', svg:'<ellipse cx="24" cy="34" rx="9" ry="11" fill="#568203"/><ellipse cx="24" cy="34" rx="6" ry="8" fill="#a8c256"/><circle cx="24" cy="36" r="3.4" fill="#7a4a21"/>'},
    cucum:{n:'خيار', svg:'<ellipse cx="40" cy="34" rx="6" ry="10" fill="#2e7d32"/><ellipse cx="40" cy="34" rx="4" ry="8" fill="#a5d6a7"/>'}
  };
  function stageSvg(layers){
    var order = {dough:1,sauce:2,cheese:3,tomato:4,pepperoni:4,mushroom:4,bun_b:1,patty:2,cheese_slice:3,lettuce:4,tomato2:4,bun_t:5,rice:1,fish:2,avo:3,cucum:3};
    var parts = layers.map(function(k){ return ING[k].svg; }).join('');
    return '<svg viewBox="0 0 60 60" width="220" height="220">'
      + '<ellipse cx="30" cy="46" rx="27" ry="8" fill="#e8e8f0" stroke="#c9c9d8" stroke-width="2"/>'
      + parts + '</svg>';
  }
  var DISHES = {
    pizza:{n:'🍕 بيتزا', need:['dough','sauce','cheese','tomato','pepperoni','mushroom'], word:{en:'Pizza',fr:'Pizza',de:'Pizza',zh:'披萨',ko:'피자'}},
    burger:{n:'🍔 برجر', need:['bun_b','patty','cheese_slice','lettuce','tomato','bun_t'], word:{en:'Burger',fr:'Burger',de:'Burger',zh:'汉堡',ko:'버거'}},
    sushi:{n:'🍣 سوشي', need:['rice','fish','avo','cucum'], word:{en:'Sushi',fr:'Sushi',de:'Sushi',zh:'寿司',ko:'초밥'}}
  };
  var curDish='pizza', added=[];
  var bar=document.getElementById('kDishBar'), stage=document.getElementById('kStage'), side=document.getElementById('kSide');
  if(!bar) return;
  bar.innerHTML = Object.keys(DISHES).map(function(k){
    return '<button class="k-dish'+(k===curDish?' active':'')+'" data-dish="'+k+'">'+DISHES[k].n+'</button>';
  }).join('');
  function esc(t){ return t.replace(/&/g,'&amp;').replace(/</g,'&lt;'); }
  function renderKitchen(done){
    var D = DISHES[curDish];
    stage.innerHTML = stageSvg(added)
      + '<div class="k-progress">'+added.length+' / '+D.need.length+' مكونات</div>'
      + (done ? '<div class="k-done">🎉 '+D.n+' جاهزة! +10 نقاط</div><div style="font-size:.78rem;color:var(--muted);margin-top:4px">'+Object.keys(D.word).map(function(l){return esc(D.word[l]);}).join(' · ')+'</div>' : '');
    side.innerHTML = D.need.map(function(k){
      var used = added.indexOf(k)>=0;
      return '<div class="k-ing'+(used?' used':'')+'" data-ing="'+k+'">'+svgWrap(ING[k].svg)+'<span class="k-name">'+ING[k].n+'</span></div>';
    }).join('');
  }
  side.addEventListener('click', function(e){
    var el = e.target.closest('.k-ing'); if(!el || el.classList.contains('used')) return;
    added.push(el.dataset.ing);
    var done = added.length >= DISHES[curDish].need.length;
    renderKitchen(done);
    if(done){ try{ addPoints(10); }catch(e){} try{ confettiBurst(); }catch(e){} }
  });
  bar.addEventListener('click', function(e){
    var b = e.target.closest('[data-dish]'); if(!b) return;
    curDish = b.dataset.dish; added=[];
    bar.querySelectorAll('.k-dish').forEach(function(x){ x.classList.toggle('active', x===b); });
    renderKitchen(false);
  });
  renderKitchen(false);

  /* food words */
  var FW = {
    en:[['Apple','تفاحة','🍎'],['Bread','عيش','🍞'],['Water','مية','💧'],['Rice','رز','🍚'],['Chicken','فراخ','🍗'],['Milk','لبن','🥛'],['Egg','بيضة','🥚'],['Fish','سمك','🐟']],
    fr:[['Pomme','تفاحة','🍎'],['Pain','عيش','🍞'],['Eau','مية','💧'],['Riz','رز','🍚'],['Poulet','فراخ','🍗'],['Lait','لبن','🥛'],['Œuf','بيضة','🥚'],['Poisson','سمك','🐟']],
    de:[['Apfel','تفاحة','🍎'],['Brot','عيش','🍞'],['Wasser','مية','💧'],['Reis','رز','🍚'],['Hähnchen','فراخ','🍗'],['Milch','لبن','🥛'],['Ei','بيضة','🥚'],['Fisch','سمك','🐟']],
    zh:[['苹果 (píngguǒ)','تفاحة','🍎'],['面包 (miànbāo)','عيش','🍞'],['水 (shuǐ)','مية','💧'],['米饭 (mǐfàn)','رز','🍚'],['鸡肉 (jīròu)','فراخ','🍗'],['牛奶 (niúnǎi)','لبن','🥛'],['鸡蛋 (jīdàn)','بيضة','🥚'],['鱼 (yú)','سمك','🐟']],
    ko:[['사과 (sagwa)','تفاحة','🍎'],['빵 (ppang)','عيش','🍞'],['물 (mul)','مية','💧'],['밥 (bap)','رز','🍚'],['닭고기 (dakgogi)','فراخ','🍗'],['우유 (uyu)','لبن','🥛'],['계란 (gyeran)','بيضة','🥚'],['물고기 (mulgogi)','سمك','🐟']]
  };
  var FWNAME = {en:'إنجليزي 🇬🇧',fr:'فرنسي 🇫🇷',de:'ألماني 🇩🇪',zh:'صيني 🇨🇳',ko:'كوري 🇰🇷'};
  var fwLang='en';
  var fwTabs=document.getElementById('fwLangs'), fwGrid=document.getElementById('fwGrid');
  fwTabs.innerHTML = Object.keys(FW).map(function(k){
    return '<button class="tab lang-tab'+(k===fwLang?' active':'')+'" data-fw="'+k+'"><span class="ln">'+FWNAME[k]+'</span></button>';
  }).join('');
  function renderFW(){
    fwGrid.innerHTML = FW[fwLang].map(function(w){
      return '<div class="fw-card"><span style="font-size:1.6rem">'+w[2]+'</span><div class="fw-t"><b>'+esc(w[0])+'</b><span>'+esc(w[1])+'</span></div><button class="fw-say" data-say="'+esc(w[0].replace(/ *\(.*?\)/,''))+'">🔊</button></div>';
    }).join('');
  }
  fwTabs.addEventListener('click', function(e){
    var b=e.target.closest('[data-fw]'); if(!b) return;
    fwLang=b.dataset.fw;
    fwTabs.querySelectorAll('.lang-tab').forEach(function(t){ t.classList.toggle('active', t===b); });
    renderFW();
  });
  fwGrid.addEventListener('click', function(e){
    var b=e.target.closest('.fw-say'); if(!b) return;
    try{ var u=new SpeechSynthesisUtterance(b.dataset.say); u.lang={en:'en-US',fr:'fr-FR',de:'de-DE',zh:'zh-CN',ko:'ko-KR'}[fwLang]; speechSynthesis.cancel(); speechSynthesis.speak(u); }catch(e){}
  });
  renderFW();

  document.getElementById('foodTabs').addEventListener('click', function(e){
    var b=e.target.closest('[data-food]'); if(!b) return;
    document.querySelectorAll('#foodTabs .lang-tab').forEach(function(t){ t.classList.toggle('active', t===b); });
    document.getElementById('foodCook').style.display = b.dataset.food==='cook' ? '' : 'none';
    document.getElementById('foodWords').style.display = b.dataset.food==='words' ? '' : 'none';
  });
})();


/* ================= v19: stories, coloring, capitals ================= */
(function(){
  /* ---- stories ---- */
  var STORIES = {
    en: {name:'إنجليزي 🇬🇧', list:[
      {t:'The Lost Cat', lvl:'مبتدئ', lines:[['Lina has a small cat.','لينا عندها قطة صغيرة.'],['The cat is white and fluffy.','القطة بيضاء وناعمة.'],['One day, the cat runs away.','في يوم، القطة هربت.'],['Lina looks everywhere: under the bed, in the garden.','لينا دوّرت في كل حتة: تحت السرير، في الجنينة.'],['She hears a sound from the kitchen.','سمعت صوت جاي من المطبخ.'],['The cat is sleeping in a box!','القطة نايمة في كرتونة!'],['Lina is happy again.','لينا فرحت تاني.']]},
      {t:'A Rainy Day', lvl:'مبتدئ', lines:[['It is raining today.','النهاردة الجو بيمطر.'],['Sam cannot play outside.','سام مش قادر يلعب بره.'],['He reads a book and drinks hot chocolate.','قعد يقرا كتاب ويشرب هوت شوكليت.'],['The rain stops in the evening.','المطر وقف بالليل.'],['A rainbow appears in the sky.','قوس قزح ظهر في السما.'],['Sam smiles and takes a photo.','سام ابتسم وصوّرها.']]},
      {t:'The First Day', lvl:'مبتدئ', lines:[['Today is Nada\'s first day at school.','النهاردة أول يوم لندى في المدرسة.'],['She wakes up early and wears her new uniform.','صحيت بدري ولبست الزي الجديد.'],['Her teacher smiles and says good morning.','المدرسة ابتسمت وقالت صباح الخير.'],['Nada sits next to a kind girl.','ندى قعدت جنب بنت لطيفة.'],['They draw pictures together at break time.','رسموا صور سوا في وقت الفسحة.'],['Nada goes home with a big smile.','ندى رجعت البيت بابتسامة كبيرة.'],['She loves her new school.','هي بتحب مدرستها الجديدة.']]}
    ]},
    fr: {name:'فرنسي 🇫🇷', list:[
      {t:'Le Petit Marché', lvl:'مبتدئ', lines:[["Marie va au marché le samedi.",'ماري بتروح السوق يوم السبت.'],['Elle achète des pommes rouges.','بتشتري تفاح أحمر.'],['Le fromage sent très bon.','ريحة الجبنة جميلة جدًا.'],['Elle parle avec le vendeur.','بتتكلم مع البائع.'],['Il lui donne une orange en cadeau.','ادهالها برتقالة هدية.'],['Marie rentre à la maison contente.','ماري رجعت البيت مبسوطة.']]},
      {t:'La Lettre', lvl:'مبتدئ', lines:[["Sophie reçoit une lettre de son amie Claire.",'صوفي استلمت جواب من صاحبتها كلير.'],['Claire habite à Paris maintenant.','كلير عايشة في باريس دلوقتي.'],['Elle écrit: la ville est grande et belle.','كتبت: المدينة كبيرة وجميلة.'],['Sophie lit la lettre deux fois.','صوفي قرت الجواب مرتين.'],['Elle répond le soir même.','ردت عليه في نفس الليلة.'],['Les deux amies sont très contentes.','الصاحبتين مبسوطين جدًا.']]}
    ]},
    de: {name:'ألماني 🇩🇪', list:[
      {t:'Der Hund Max', lvl:'مبتدئ', lines:[['Max ist ein großer Hund.','ماكس كلب كبير.'],['Er wohnt bei Familie Braun.','عايش مع عيلة براون.'],['Jeden Morgen geht er spazieren.','كل صباح بيتمشى.'],['Er liebt den Park und den See.','بيحب الحديقة والبحيرة.'],['Am Sonntag spielt er mit den Kindern.','يوم الحد بيلعب مع العيال.'],['Max ist sehr glücklich.','ماكس مبسوط جدًا.']]},
      {t:'Der Geburtstag', lvl:'مبتدئ', lines:[['Heute ist Annas Geburtstag.','النهاردة عيد ميلاد آنا.'],['Sie wird zehn Jahre alt.','هتكمل عشر سنين.'],['Ihre Freunde kommen um vier Uhr.','صحابها جايين الساعة أربعة.'],['Es gibt Kuchen und Saft.','في تورتة وعصير.'],['Anna bekommt ein rotes Buch als Geschenk.','آنا خدت كتاب أحمر هدية.'],['Alle singen und lachen.','كلهم بيغنوا وبيضحكوا.'],['Es ist ein schöner Tag.','ده يوم جميل.']]}
    ]},
    zh: {name:'صيني 🇨🇳', list:[
      {t:'我的朋友 (صاحبتي)', lvl:'مبتدئ', lines:[['我有一个好朋友。','عندي صاحبة كويسة.'],['她叫小梅。','اسمها شياو مي.'],['她很高，也很友好。','هي طويلة ولطيفة.'],['我们一起喝茶。','بنشرب شاي سوا.'],['今天天气很好。','النهاردة الجو حلو.'],['我们很开心。','إحنا مبسوطين.']]},
      {t:'在公园 (في الحديقة)', lvl:'مبتدئ', lines:[['星期天，我们去公园。','يوم الحد، بنروح الحديقة.'],['公园里有很多花。','الحديقة فيها ورد كتير.'],['弟弟喜欢跑步。','أخويا الصغير بيحب يجري.'],['妈妈喝茶，爸爸看书。','ماما بتشرب شاي، بابا بيقرا كتاب.'],['我们一起吃午饭。','بناكل الغدا سوا.'],['今天真高兴！','النهاردة فرحة حقيقية!']]}
    ]},
    ko: {name:'كوري 🇰🇷', list:[
      {t:'나의 하루 (يومي)', lvl:'مبتدئ', lines:[['아침에 일어나요.','بصحى الصبح.'],['밥을 먹어요.','باكل الأكل.'],['학교에 가요.','بروح المدرسة.'],['친구를 만나요.','بقابل صاحبتي.'],['집에 와요.','برجع البيت.'],['일찍 자요.','بنام بدري.']]},
      {t:'주말 (الويكند)', lvl:'مبتدئ', lines:[['토요일 아침이에요.','صبح يوم السبت.'],['늦게 일어나요.','بصحى متأخر.'],['친구와 카페에 가요.','بروح القهوة مع صاحبتي.'],['맛있는 케이크를 먹어요.','بناكل تورتة حلوة.'],['영화도 봐요.','وبنتفرج على فيلم كمان.'],['주말은 정말 좋아요.','الويكند جميل جدًا.']]}
    ]}
  };
  var sLang='en';
  var st=document.getElementById('storyLangs'), sl=document.getElementById('storyList');
  if(st){
    st.innerHTML = Object.keys(STORIES).map(function(k){
      return '<button class="tab lang-tab'+(k===sLang?' active':'')+'" data-sl="'+k+'"><span class="ln">'+STORIES[k].name+'</span></button>';
    }).join('');
    function esc(t){ var d=document.createElement('div'); d.textContent=t; return d.innerHTML; }
    function renderStories(){
      sl.innerHTML = STORIES[sLang].list.map(function(story){
        return '<div class="story-card"><h3>'+esc(story.t)+'</h3><div class="story-meta">'+story.lvl+' · '+story.lines.length+' جمل</div>'
          + story.lines.map(function(l){ return '<div class="story-line"><div class="sl-orig">'+esc(l[0])+'</div><div class="sl-tr">'+esc(l[1])+'</div></div>'; }).join('') + '</div>';
      }).join('');
    }
    st.addEventListener('click', function(e){
      var b=e.target.closest('[data-sl]'); if(!b) return;
      sLang=b.dataset.sl;
      st.querySelectorAll('.lang-tab').forEach(function(t){ t.classList.toggle('active', t===b); });
      renderStories();
    });
    sl.addEventListener('click', function(e){
      var l=e.target.closest('.story-line'); if(l) l.classList.toggle('open');
    });
    renderStories();
  }

  /* ---- coloring ---- */
  var PALS = ['#ff5c8a','#f5a623','#f7e76a','#7bc950','#2dd4bf','#4cc9f0','#7c5cff','#c86bfa','#ffffff','#8d6e63'];
  var curColor = PALS[0];
  var pal=document.getElementById('palette'), cst=document.getElementById('colorStage');
  if(pal){
    pal.innerHTML = PALS.map(function(c,i){ return '<div class="pal'+(i===0?' active':'')+'" data-c="'+c+'" style="background:'+c+'"></div>'; }).join('');
    var CSVG = '<svg viewBox="0 0 200 200" width="100%" style="max-width:340px;display:block;margin:0 auto">'
      + '<circle class="czone" cx="100" cy="60" r="34" fill="#fff" stroke="#8a7fb5" stroke-width="2.5"/>'
      + '<circle cx="88" cy="54" r="4" fill="#1a1225"/><circle cx="112" cy="54" r="4" fill="#1a1225"/>'
      + '<path d="M88 68 q12 10 24 0" stroke="#1a1225" stroke-width="3" fill="none" stroke-linecap="round"/>'
      + '<path class="czone" d="M66 94 q34 -18 68 0 l10 60 q-44 16 -88 0 z" fill="#fff" stroke="#8a7fb5" stroke-width="2.5"/>'
      + '<path class="czone" d="M66 94 q-24 4 -30 26 l18 8 q6 -18 12 -34z" fill="#fff" stroke="#8a7fb5" stroke-width="2.5"/>'
      + '<path class="czone" d="M134 94 q24 4 30 26 l-18 8 q-6 -18 -12 -34z" fill="#fff" stroke="#8a7fb5" stroke-width="2.5"/>'
      + '<path class="czone" d="M76 156 q-4 22 -8 30 h22 q4 -14 6 -30z" fill="#fff" stroke="#8a7fb5" stroke-width="2.5"/>'
      + '<path class="czone" d="M124 156 q4 22 8 30 h-22 q-4 -14 -6 -30z" fill="#fff" stroke="#8a7fb5" stroke-width="2.5"/>'
      + '<ellipse class="czone" cx="100" cy="176" rx="26" ry="8" fill="#fff" stroke="#8a7fb5" stroke-width="2.5"/>'
      + '<circle class="czone" cx="46" cy="30" r="12" fill="#fff" stroke="#8a7fb5" stroke-width="2.5"/>'
      + '<circle class="czone" cx="158" cy="26" r="9" fill="#fff" stroke="#8a7fb5" stroke-width="2.5"/>'
      + '</svg>';
    cst.innerHTML = CSVG;
    pal.addEventListener('click', function(e){
      var p=e.target.closest('.pal'); if(!p) return;
      curColor=p.dataset.c;
      pal.querySelectorAll('.pal').forEach(function(x){ x.classList.toggle('active', x===p); });
    });
    cst.addEventListener('click', function(e){
      var z=e.target.closest('.czone'); if(!z) return;
      z.setAttribute('fill', curColor);
    });
    document.getElementById('colorReset').addEventListener('click', function(){
      cst.querySelectorAll('.czone').forEach(function(z){ z.setAttribute('fill','#fff'); });
    });
  }

  /* ---- capitals & GK quiz ---- */
  var CQ = {
    cap: [
      ['ما عاصمة فرنسا؟ 🇫🇷',['باريس','ليون','مارسيليا','نيس'],0],
      ['ما عاصمة ألمانيا؟ 🇩🇪',['ميونخ','برلين','هامبورج','كولن'],1],
      ['ما عاصمة الصين؟ 🇨🇳',['شنغهاي','هونج كونج','بكين','جوانزو'],2],
      ['ما عاصمة كوريا الجنوبية؟ 🇰🇷',['بوسان','إنتشون','دايجو','سول'],3],
      ['ما عاصمة بريطانيا؟ 🇬🇧',['لندن','مانشستر','ليفربول','برمنغهام'],0],
      ['ما عاصمة اليابان؟ 🇯🇵',['أوساكا','طوكيو','كيوتو','ناجويا'],1],
      ['ما عاصمة إيطاليا؟ 🇮🇹',['ميلان','فينيسيا','روما','نابولي'],2],
      ['ما عاصمة إسبانيا؟ 🇪🇸',['برشلونة','إشبيلية','فالنسيا','مدريد'],3],
      ['ما عاصمة أمريكا؟ 🇺🇸',['نيويورك','واشنطن','لوس أنجلوس','شيكاجو'],1],
      ['ما عاصمة تركيا؟ 🇹🇷',['إسطنبول','أنطاليا','أنقرة','إزمير'],2],
      ['ما عاصمة هولندا؟ 🇳🇱',['روتردام','أمستردام','لاهاي','أوتريخت'],1],
      ['ما عاصمة اليونان؟ 🇬🇷',['سالونيك','أثينا','كريت','رودس'],1],
      ['ما عاصمة البرازيل؟ 🇧🇷',['ريو دي جانيرو','ساو باولو','برازيليا','سلفادور'],2],
      ['ما عاصمة كندا؟ 🇨🇦',['تورونتو','فانكوفر','مونتريال','أوتاوا'],3],
      ['ما عاصمة سويسرا؟ 🇨🇭',['جنيف','زيورخ','برن','لوزيرن'],2],
      ['ما عاصمة النمسا؟ 🇦🇹',['فيينا','سالزبورج','جراتس','إنسبروك'],0]
    ],
    gk: [
      ['كام دولة بتتكلم الإنجليزي كلغة رسمية تقريبًا؟',['حوالي ٦٠','حوالي ١٠','حوالي ٢٥','حوالي ١٠٠'],0],
      ['إيه أكتر لغة متكلمة في العالم بعدد الناطقين الأصليين؟',['الإنجليزي','الصيني (ماندرين)','الهندي','الإسباني'],1],
      ['الأبجدية الكورية (الهانغل) اتعملت امتى؟',['القرن ١٥','القرن ٥','القرن ١٩','القرن ١'],0],
      ['كام حرف في الأبجدية الألمانية؟',['٢٦','٢٨','٣٠','٣٢'],2],
      ['إيه اللغة الرسمية للأمم المتحدة من دول؟',['الألماني','الياباني','الصيني','الكوري'],2],
      ['كلمة "Bonjour" معناها إيه؟',['مساء الخير','صباح الخير','تصبح على خير','مع السلامة'],1],
      ['الأرقام الصينية ١ ٢ ٣ بتتكتب:',['一二三','天地人','日月星','大小中'],0],
      ['أشهر برج في باريس اسمه إيه؟',['برج بيزا','برج إيفل','برج لندن','برج خليفة'],1],
      ['كلمة "Danke" الألمانية معناها إيه؟',['من فضلك','شكرًا','صباح الخير','آسف'],1],
      ['كلمة "사랑해" (سارانجيه) الكورية معناها إيه؟',['صباح الخير','مع السلامة','بحبك','شكرًا'],2],
      ['اللغة الصينية بيكتبوها بإيه؟',['حروف أبجدية','رموز (هانزي)','حروف سيريلية','أرقام'],1],
      ['أكتر دولة فيها ناس بتتكلم فرنسي؟',['بلجيكا','كندا','فرنسا','سويسرا'],2],
      ['"Guten Morgen" يعني إيه بالألماني؟',['تصبح على خير','صباح الخير','أهلًا','مع السلامة'],1],
      ['إيه العملة الرسمية في كوريا الجنوبية؟',['ين','يوان','وون','دولار'],2],
      ['حرف الـ "ñ" بيميز لغة إيه؟',['الفرنسي','الألماني','الإسباني','الإيطالي'],2]
    ]
  };
  var cqMode='cap', cqIdx=0, cqScore=0;
  var cqt=document.getElementById('cqTabs'), cqb=document.getElementById('cqBox');
  function renderCQ(feedback){
    var Q = CQ[cqMode][cqIdx];
    cqb.innerHTML = '<div class="cq-q">'+Q[0]+'</div>'
      + '<div class="cq-opts">'+Q[1].map(function(o,i){
          var cls='cq-opt';
          if(feedback!=null){ if(i===Q[2]) cls+=' right'; else if(i===feedback) cls+=' wrong'; }
          return '<button class="'+cls+'" data-opt="'+i+'">'+o+'</button>';
        }).join('')+'</div>'
      + '<div class="cq-score">سؤال '+(cqIdx+1)+' / '+CQ[cqMode].length+' · نقطتك: '+cqScore+' ⭐</div>';
  }
  cqb.addEventListener('click', function(e){
    var b=e.target.closest('[data-opt]'); if(!b) return;
    var pick=+b.dataset.opt, Q=CQ[cqMode][cqIdx];
    if(pick===Q[2]){ cqScore++; try{ addPoints(3); }catch(e){} }
    renderCQ(pick===Q[2]?null:pick);
    setTimeout(function(){
      cqIdx=(cqIdx+1)%CQ[cqMode].length;
      renderCQ(null);
    }, 900);
  });
  cqt.addEventListener('click', function(e){
    var b=e.target.closest('[data-cq]'); if(!b) return;
    cqMode=b.dataset.cq; cqIdx=0; cqScore=0;
    cqt.querySelectorAll('.lang-tab').forEach(function(t){ t.classList.toggle('active', t===b); });
    renderCQ(null);
  });
  renderCQ(null);
})();


/* ================= v20: 30-day challenge + piano ================= */
(function(){
  /* ---- 30-day challenge ---- */
  var TASKS = ['اتعلمي ٥ كلمات','حلّي اختبار','اسمعي أغنية','اكتبي ٣ جمل','شوفي فيديو','راجعي كروت','العبي لعبة','اقرئي قصة','انطقي بصوت عالي','علمي حد كلمة'];
  var KEY='ch30_done';
  var done=[];
  try{ done=JSON.parse(localStorage.getItem(KEY)||'[]'); }catch(e){}
  var grid=document.getElementById('ch30Grid');
  if(grid){
    function render30(){
      grid.innerHTML='';
      for(var i=0;i<30;i++){
        var d=document.createElement('div');
        var isDone=done.indexOf(i)>=0;
        d.className='ch30-day'+(isDone?' done':'');
        d.innerHTML='<div class="d-num">'+(isDone?'✓':(i+1))+'</div><div class="d-task">'+TASKS[i%TASKS.length]+'</div>';
        (function(day,el){
          el.addEventListener('click', function(){
            var ix=done.indexOf(day);
            if(ix>=0){ done.splice(ix,1); } else { done.push(day); try{ addPoints(5); }catch(e){} }
            localStorage.setItem(KEY, JSON.stringify(done));
            render30();
          });
        })(i,d);
        grid.appendChild(d);
      }
      var pct=Math.round(done.length/30*100);
      document.getElementById('ch30Fill').style.width=pct+'%';
      document.getElementById('ch30Stats').innerHTML='كمّلتي <b style="color:var(--gold2)">'+done.length+'</b> من ٣٠ يوم ('+pct+'%)'+(done.length>=30?' — 🏆 بطلة التحدي!':'');
    }
    render30();
  }

  /* ---- piano ---- */
  var NOTES=[['C',261.63,'دو'],['D',293.66,'ري'],['E',329.63,'مي'],['F',349.23,'فا'],['G',392.00,'صول'],['A',440.00,'لا'],['B',493.88,'سي'],['C2',523.25,'دو²']];
  var BLACKS=[['C#',277.18,0],['D#',311.13,1],['F#',369.99,3],['G#',415.30,4],['A#',466.16,5]];
  var pk=document.getElementById('pianoKeys');
  if(pk){
    var actx=null;
    function play(f, dur){
      try{
        if(!actx) actx=new (window.AudioContext||window.webkitAudioContext)();
        var o=actx.createOscillator(), g=actx.createGain();
        o.type='triangle'; o.frequency.value=f;
        g.gain.setValueAtTime(.35, actx.currentTime);
        g.gain.exponentialRampToValueAtTime(.001, actx.currentTime+(dur||.5));
        o.connect(g); g.connect(actx.destination);
        o.start(); o.stop(actx.currentTime+(dur||.5));
      }catch(e){}
    }
    pk.innerHTML = NOTES.map(function(n){
      return '<div class="pk-w" data-f="'+n[1]+'"><span class="pk-label">'+n[2]+'</span></div>';
    }).join('') + BLACKS.map(function(b){
      var left=((b[2]+1)*(100/8))-3.5;
      return '<div class="pk-b" data-f="'+b[1]+'" style="left:'+left+'%"></div>';
    }).join('');
    pk.addEventListener('pointerdown', function(e){
      var k=e.target.closest('[data-f]'); if(!k) return;
      play(+k.dataset.f);
    });
    /* Happy Birthday */
    var HB=[[261.63,.35],[261.63,.25],[293.66,.6],[261.63,.6],[349.23,.6],[329.63,.9],[261.63,.35],[261.63,.25],[293.66,.6],[261.63,.6],[392,.6],[349.23,.9],[261.63,.35],[261.63,.25],[523.25,.6],[440,.6],[349.23,.6],[329.63,.6],[293.66,.9],[466.16,.35],[466.16,.25],[440,.6],[349.23,.6],[392,.6],[349.23,.9]];
    var playing=false;
    document.getElementById('pianoSong').addEventListener('click', function(){
      if(playing) return; playing=true;
      var t=0;
      HB.forEach(function(n){ setTimeout(function(){ play(n[0], n[1]*.95); }, t*1000); t+=n[1]*.55; });
      setTimeout(function(){ playing=false; }, t*1000+300);
    });
  }
})();


/* ================= v21: diary, khatma, weather ================= */
(function(){
  function esc(t){ var d=document.createElement('div'); d.textContent=t; return d.innerHTML; }
  /* ---- diary ---- */
  var DKEY='lingua_diary';
  var entries=[];
  try{ entries=JSON.parse(localStorage.getItem(DKEY)||'[]'); }catch(e){}
  var dList=document.getElementById('diaryList');
  if(dList){
    function renderDiary(){
      dList.innerHTML = entries.length ? entries.map(function(en,i){
        return '<div class="diary-entry"><div class="de-date">'+en.d+'</div><div class="de-txt">'+esc(en.t)+'</div><button class="de-del" data-di="'+i+'">🗑️ امسحي</button></div>';
      }).join('') : '<div style="text-align:center;color:var(--muted);font-size:.82rem;margin-top:12px">لسه مفيش يوميات — اكتبي أول واحدة 🌸</div>';
    }
    document.getElementById('diarySave').addEventListener('click', function(){
      var t=document.getElementById('diaryTa').value.trim();
      if(!t) return;
      entries.unshift({d:new Date().toLocaleString('ar-EG',{dateStyle:'full',timeStyle:'short'}), t:t});
      localStorage.setItem(DKEY, JSON.stringify(entries.slice(0,60)));
      document.getElementById('diaryTa').value='';
      try{ addPoints(3); }catch(e){}
      renderDiary();
    });
    dList.addEventListener('click', function(e){
      var b=e.target.closest('.de-del'); if(!b) return;
      entries.splice(+b.dataset.di,1);
      localStorage.setItem(DKEY, JSON.stringify(entries));
      renderDiary();
    });
    renderDiary();
  }
  /* ---- khatma ---- */
  var KKEY='lingua_khatma';
  var kj=[];
  try{ kj=JSON.parse(localStorage.getItem(KKEY)||'[]'); }catch(e){}
  var kg=document.getElementById('khatmaGrid');
  if(kg){
    function renderKhatma(){
      kg.innerHTML='';
      for(var i=1;i<=30;i++){
        var d=document.createElement('div');
        var isDone=kj.indexOf(i)>=0;
        d.className='juz'+(isDone?' done':'');
        d.textContent=isDone?'✓':i;
        (function(n,el){
          el.addEventListener('click', function(){
            var ix=kj.indexOf(n);
            if(ix>=0) kj.splice(ix,1); else { kj.push(n); try{ addPoints(5); }catch(e){} }
            localStorage.setItem(KKEY, JSON.stringify(kj));
            renderKhatma();
          });
        })(i,d);
        kg.appendChild(d);
      }
      var pct=Math.round(kj.length/30*100);
      document.getElementById('khatmaFill').style.width=pct+'%';
      document.getElementById('khatmaStats').innerHTML='خلصتي <b style="color:var(--gold2)">'+kj.length+'</b> جزء من ٣٠'+(kj.length>=30?' — 🤲 ختمة كاملة، تقبل الله!':'');
    }
    renderKhatma();
  }
  /* ---- weather (wttr.in) ---- */
  var WMAP = {sunny:'مشمس ☀️', clear:'صافي 🌙', 'partly cloudy':'غيوم خفيفة ⛅', cloudy:'غيوم ☁️', overcast:'ملبد بالغيوم ☁️', mist:'شبورة 🌫️', fog:'ضباب 🌫️', rain:'مطر 🌧️', 'light rain':'مطر خفيف 🌦️', 'moderate rain':'مطر 🌧️', 'heavy rain':'مطر غزير 🌧️', 'patchy rain possible':'احتمال مطر 🌦️', thunderstorm:'عاصفة رعدية ⛈️', snow:'ثلج ❄️', sandstorm:'عاصفة ترابية 🌪️', 'severe sandstorm':'عاصفة ترابية 🌪️', haze:'أتربة 🌫️', dust:'أتربة 🌫️'};
  var wc=document.getElementById('wCity');
  if(wc){
    function loadWeather(){
      document.getElementById('wBody').innerHTML='<div style="color:var(--muted);font-size:.85rem">بنجيب الجو...</div>';
      fetch('https://wttr.in/'+encodeURIComponent(wc.value)+'?format=j1')
      .then(function(r){return r.json();}).then(function(d){
        var c=d.current_condition[0];
        var desc=(c.weatherDesc&&c.weatherDesc[0]?c.weatherDesc[0].value:'').toLowerCase().trim();
        var ar=WMAP[desc];
        if(!ar){ for(var k in WMAP){ if(desc.indexOf(k)>=0){ ar=WMAP[k]; break; } } }
        if(!ar) ar=desc+' 🌡️';
        document.getElementById('wBody').innerHTML='<div class="w-main">'+c.temp_C+'°</div>'
          +'<div class="w-desc">'+ar+'</div>'
          +'<div class="w-details"><span>💧 رطوبة '+c.humidity+'%</span><span>🌬️ رياح '+c.windspeedKmph+' كم/س</span></div>';
      }).catch(function(){
        document.getElementById('wBody').innerHTML='<div style="color:var(--muted);font-size:.85rem">النت مش متاح دلوقتي 🥺</div>';
      });
    }
    wc.addEventListener('change', loadWeather);
    loadWeather();
  }
})();


/* ================= v22: word shooter + runner ================= */
(function(){
  /* ---- word shooter ---- */
  var WORDS=[
    ['apple','تفاحة',['برتقالة','موزة']],['water','مية',['عصير','لبن']],['book','كتاب',['قلم','ورقة']],
    ['house','بيت',['شارع','شباك']],['sun','شمس',['قمر','نجمة']],['cat','قطة',['كلب','أرنب']],
    ['friend','صاحبة',['عدو','جار']],['happy','مبسوطة',['زعلانة','عيّانة']],['school','مدرسة',['مستشفى','سوق']],
    ['love','حب',['كره','خوف']],['food','أكل',['شرب','نوم']],['time','وقت',['مكان','يوم']],
    ['beautiful','جميلة',['وحشة','عادية']],['family','عيلة',['عمل','سفر']],['money','فلوس',['ذهب','فضة']],
    ['morning','صباح',['ليل','ظهر']],['rain','مطر',['ثلج','رياح']],['music','موسيقى',['سينما','رقص']]
  ];
  var cvs=document.getElementById('wsCanvas');
  if(cvs){
    var ctx=cvs.getContext('2d');
    var W=0, bubbles=[], score=0, lives=3, lvl=1, running=false, curWord=null, raf=null, spawnT=0;
    function fit(){ W=cvs.width=cvs.clientWidth; }
    function newWord(){
      curWord = WORDS[Math.floor(Math.random()*WORDS.length)];
      var opts = [curWord[1]].concat(curWord[2]).sort(function(){return Math.random()-.5;});
      bubbles = opts.map(function(t,i){
        return {t:t, x:(i+1)*(W/4), y:440, r:44, correct:t===curWord[1], popped:false};
      });
      spawnT=0;
    }
    function loop(){
      if(!running) return;
      ctx.clearRect(0,0,W,420);
      ctx.fillStyle='#14101f'; ctx.fillRect(0,0,W,420);
      /* word card */
      ctx.fillStyle='#241d3a';
      ctx.beginPath(); ctx.roundRect(W/2-90, 14, 180, 56, 14); ctx.fill();
      ctx.fillStyle='#f5d76e'; ctx.font='bold 22px Readex Pro, sans-serif'; ctx.textAlign='center';
      ctx.fillText(curWord[0], W/2, 50);
      var speed = .55 + lvl*.18;
      bubbles.forEach(function(b){
        if(b.popped) return;
        b.y -= speed;
        ctx.beginPath(); ctx.arc(b.x, b.y, b.r, 0, 7);
        ctx.fillStyle = b.popAnim ? '#27ae60' : '#2b2350';
        ctx.fill();
        ctx.strokeStyle='#7c5cff'; ctx.lineWidth=2; ctx.stroke();
        ctx.fillStyle='#fff'; ctx.font='bold 14px Readex Pro, sans-serif';
        ctx.fillText(b.t, b.x, b.y+5);
        if(b.y < -50){
          b.popped=true;
          if(b.correct){ lives--; updHud(); if(lives<=0) return gameOver(); newWord(); }
        }
      });
      if(bubbles.every(function(b){return b.popped;})) newWord();
      raf=requestAnimationFrame(loop);
    }
    function updHud(){
      document.getElementById('wsScore').textContent=score;
      document.getElementById('wsLvl').textContent=lvl;
      document.getElementById('wsLives').textContent=lives;
    }
    function gameOver(){
      running=false; cancelAnimationFrame(raf);
      ctx.fillStyle='rgba(10,8,18,.85)'; ctx.fillRect(0,0,W,420);
      ctx.fillStyle='#f5d76e'; ctx.font='bold 26px Readex Pro, sans-serif'; ctx.textAlign='center';
      ctx.fillText('انتهت اللعبة! 🎯', W/2, 190);
      ctx.font='18px Readex Pro, sans-serif'; ctx.fillStyle='#fff';
      ctx.fillText('نقاطك: '+score, W/2, 224);
      document.getElementById('wsStart').textContent='🔄 العبي تاني';
    }
    cvs.addEventListener('pointerdown', function(e){
      if(!running) return;
      var r=cvs.getBoundingClientRect();
      var mx=(e.clientX-r.left)*(W/r.width), my=(e.clientY-r.top)*(420/r.height);
      bubbles.forEach(function(b){
        if(b.popped) return;
        if(Math.hypot(mx-b.x,my-b.y)<b.r){
          b.popped=true;
          if(b.correct){ score+=10; lvl=1+Math.floor(score/50); try{ addPoints(2); }catch(e){} newWord(); }
          else { lives--; if(lives<=0) return gameOver(); }
          updHud();
        }
      });
    });
    document.getElementById('wsStart').addEventListener('click', function(){
      fit(); score=0; lives=3; lvl=1; running=true; updHud(); newWord();
      cancelAnimationFrame(raf); loop();
    });
    fit();
  }

  /* ---- runner ---- */
  var rc=document.getElementById('rnCanvas');
  if(rc){
    var rctx=rc.getContext('2d');
    var RW=0, ry=0, rv=0, obstacles=[], dist=0, rRunning=false, rraf=null, frame=0, best=0;
    try{ best=+(localStorage.getItem('rn_best')||0); }catch(e){}
    document.getElementById('rnBest').textContent=best;
    var GROUND=250, PY=30;
    function rfit(){ RW=rc.width=rc.clientWidth; }
    function rloop(){
      if(!rRunning) return;
      frame++;
      dist+=.25;
      /* physics */
      rv+=.9; ry+=rv;
      if(ry>GROUND-PY*2){ ry=GROUND-PY*2; rv=0; }
      /* spawn */
      if(frame%Math.max(50,110-Math.floor(dist/60))===0){
        obstacles.push({x:RW+30, w:16+Math.random()*14, h:26+Math.random()*26});
      }
      obstacles.forEach(function(o){ o.x-=4.5+dist/300; });
      obstacles=obstacles.filter(function(o){return o.x>-40;});
      /* draw */
      rctx.clearRect(0,0,RW,300);
      rctx.fillStyle='#14101f'; rctx.fillRect(0,0,RW,300);
      rctx.strokeStyle='#3a3348'; rctx.lineWidth=2;
      rctx.beginPath(); rctx.moveTo(0,GROUND+14); rctx.lineTo(RW,GROUND+14); rctx.stroke();
      /* stars */
      rctx.fillStyle='rgba(245,215,110,.35)';
      for(var i=0;i<6;i++){ rctx.fillRect((i*137-frame*.4)%RW, 30+(i*53)%90, 2, 2); }
      /* girl runner */
      var px=60;
      rctx.fillStyle='#ff9ecb';
      rctx.beginPath(); rctx.arc(px+15, ry+10, 11, 0, 7); rctx.fill(); /* head */
      rctx.fillStyle='#7c5cff';
      rctx.beginPath(); rctx.roundRect(px+4, ry+22, 22, 26, 7); rctx.fill(); /* body */
      var legSwing = Math.sin(frame*.3)*9;
      rctx.strokeStyle='#ff9ecb'; rctx.lineWidth=5; rctx.lineCap='round';
      rctx.beginPath(); rctx.moveTo(px+10, ry+46); rctx.lineTo(px+10+legSwing, ry+60); rctx.stroke();
      rctx.beginPath(); rctx.moveTo(px+20, ry+46); rctx.lineTo(px+20-legSwing, ry+60); rctx.stroke();
      /* obstacles (crystals) */
      obstacles.forEach(function(o){
        rctx.fillStyle='#e74c3c';
        rctx.beginPath();
        rctx.moveTo(o.x, GROUND+14); rctx.lineTo(o.x+o.w/2, GROUND+14-o.h); rctx.lineTo(o.x+o.w, GROUND+14);
        rctx.closePath(); rctx.fill();
        /* collision */
        if(o.x < px+26 && o.x+o.w > px && ry+48 > GROUND+14-o.h){
          rGameOver();
        }
      });
      document.getElementById('rnScore').textContent=Math.floor(dist);
      rraf=requestAnimationFrame(rloop);
    }
    function rGameOver(){
      rRunning=false; cancelAnimationFrame(rraf);
      var d=Math.floor(dist);
      if(d>best){ best=d; try{ localStorage.setItem('rn_best', best); }catch(e){} document.getElementById('rnBest').textContent=best; }
      try{ addPoints(Math.min(15, Math.floor(d/100))); }catch(e){}
      rctx.fillStyle='rgba(10,8,18,.85)'; rctx.fillRect(0,0,RW,300);
      rctx.fillStyle='#f5d76e'; rctx.font='bold 24px Readex Pro, sans-serif'; rctx.textAlign='center';
      rctx.fillText('خبطتي! 😅', RW/2, 130);
      rctx.font='17px Readex Pro, sans-serif'; rctx.fillStyle='#fff';
      rctx.fillText('جريتي '+d+' متر', RW/2, 162);
      document.getElementById('rnStart').textContent='🔄 العبي تاني';
    }
    rc.addEventListener('pointerdown', function(){
      if(!rRunning) return;
      if(ry>=GROUND-PY*2-1) rv=-14;
    });
    document.getElementById('rnStart').addEventListener('click', function(){
      rfit(); dist=0; ry=GROUND-PY*2; rv=0; obstacles=[]; frame=0; rRunning=true;
      cancelAnimationFrame(rraf); rloop();
    });
    rfit();
  }
})();


/* ================= v23: fashion, virtual trip, movie quotes ================= */
(function(){
  function esc(t){ var d=document.createElement('div'); d.textContent=t; return d.innerHTML; }
  /* ---- fashion tips ---- */
  var TIPS=[
    ['قاعدة التلات ألوان 🎨','متلبسيش أكتر من ٣ ألوان في نفس اللوك — اللوك البسيط هو الفخم.'],
    ['الأسود صديقك 🖤','قطعة سوداء أساسية (بليزر أو فستان) بتشيك أي لبس في ثانية.'],
    ['المقاس قبل المودة 📏','هدوم مظبوطة على مقاسك أحسن من أغلى براند مقاسه غلط.'],
    ['إكسسوار واحد مميز ✨','سلسلة أو شنطة أو ساعة مميزة — واحدة بس تكفي.'],
    ['الأبيض والبيج 🤍','الألوان المحايدة بتداري وبتديكي شكل غني وهادي.'],
    ['راحتك أولاً 👟','لو مش مرتاحة في اللبس مش هتبقي واثقة — والثقة هي الستايل الحقيقي.']
  ];
  var fg=document.getElementById('fashGrid');
  if(fg){
    fg.innerHTML = TIPS.map(function(t){ return '<div class="fash-card"><h4>'+t[0]+'</h4><p>'+t[1]+'</p></div>'; }).join('');
  }
  /* ---- fashion words ---- */
  var FASHW = {
    en:[['Dress','فستان','👗'],['Shoes','جزمة','👟'],['Bag','شنطة','👜'],['Hat','برنيطة','👒'],['Jacket','جاكيت','🧥'],['Ring','خاتم','💍']],
    fr:[['Robe','فستان','👗'],['Chaussures','جزمة','👟'],['Sac','شنطة','👜'],['Chapeau','برنيطة','👒'],['Veste','جاكيت','🧥'],['Bague','خاتم','💍']],
    de:[['Kleid','فستان','👗'],['Schuhe','جزمة','👟'],['Tasche','شنطة','👜'],['Hut','برنيطة','👒'],['Jacke','جاكيت','🧥'],['Ring','خاتم','💍']],
    zh:[['连衣裙 (liányīqún)','فستان','👗'],['鞋 (xié)','جزمة','👟'],['包 (bāo)','شنطة','👜'],['帽子 (màozi)','برنيطة','👒'],['夹克 (jiákè)','جاكيت','🧥'],['戒指 (jièzhi)','خاتم','💍']],
    ko:[['드레스 (deureseu)','فستان','👗'],['신발 (sinbal)','جزمة','👟'],['가방 (gabang)','شنطة','👜'],['모자 (moja)','برنيطة','👒'],['재킷 (jaekit)','جاكيت','🧥'],['반지 (banji)','خاتم','💍']]
  };
  var FWNAME = {en:'إنجليزي 🇬🇧',fr:'فرنسي 🇫🇷',de:'ألماني 🇩🇪',zh:'صيني 🇨🇳',ko:'كوري 🇰🇷'};
  var fLang='en';
  var fl=document.getElementById('fashLangs'), fw=document.getElementById('fashWords');
  if(fl){
    fl.innerHTML = Object.keys(FASHW).map(function(k){
      return '<button class="tab lang-tab'+(k===fLang?' active':'')+'" data-fl="'+k+'"><span class="ln">'+FWNAME[k]+'</span></button>';
    }).join('');
    function renderFashW(){
      fw.innerHTML = FASHW[fLang].map(function(w){
        return '<div class="fw-card"><span style="font-size:1.5rem">'+w[2]+'</span><div class="fw-t"><b>'+esc(w[0])+'</b><span>'+esc(w[1])+'</span></div><button class="fw-say" data-say="'+esc(w[0].replace(/ *\(.*?\)/,''))+'">🔊</button></div>';
      }).join('');
    }
    fl.addEventListener('click', function(e){
      var b=e.target.closest('[data-fl]'); if(!b) return;
      fLang=b.dataset.fl;
      fl.querySelectorAll('.lang-tab').forEach(function(t){ t.classList.toggle('active', t===b); });
      renderFashW();
    });
    fw.addEventListener('click', function(e){
      var b=e.target.closest('.fw-say'); if(!b) return;
      try{ var u=new SpeechSynthesisUtterance(b.dataset.say); u.lang={en:'en-US',fr:'fr-FR',de:'de-DE',zh:'zh-CN',ko:'ko-KR'}[fLang]; speechSynthesis.cancel(); speechSynthesis.speak(u); }catch(e){}
    });
    renderFashW();
  }
  /* ---- virtual trip ---- */
  var TRIPS = {
    uk: {name:'بريطانيا 🇬🇧', spots:[
      ['بيغ بن 🕰️','أشهر ساعة في العالم — برج إليزابيث في قلب لندن جنب البرلمان.'],
      ['العجلة London Eye 🎡','عجلة عملاقة على نهر التايمز — منظر لندن كله من فوق.'],
      ['برج لندن 🏰','قلعة عمرها ٩٠٠ سنة فيها جواهر التاج البريطاني.'],
      ['ستونهنج 🪨','حجارة غامضة عمرها ٥٠٠٠ سنة — محدش عارف اتبنت إزاي!']]},
    fr: {name:'فرنسا 🇫🇷', spots:[
      ['برج إيفل 🗼','٣٣٠ متر حديد — رمز باريس وأكتر معلم بيتزار في العالم.'],
      ['متحف اللوفر 🖼️','أكبر متحف في العالم — بيت الموناليزا.'],
      ['قصر فرساي 👑','قصر ملوك فرنسا — قاعة المرايا الأسطورية.'],
      ['مون سان ميشيل 🏝️','جزيرة عليها دير من العصور الوسطى — زي القصص الخيالية.']]},
    de: {name:'ألمانيا 🇩🇪', spots:[
      ['بوابة براندنبورج 🏛️','رمز برلين ووحدة ألمانيا.'],
      ['قلعة نويشفانشتاين 🏰','القلعة اللي ألهمت قلعة ديزني — في جبال بافاريا.'],
      ['كاتدرائية كولونيا ⛪','أطول كاتدرائية جوثيك — اتبنت على ٦٠٠ سنة.'],
      ['الغابة السوداء 🌲','غابات أسطورية — موطن ساعات الكوكو وقصص جريم.']]},
    zh: {name:'الصين 🇨🇳', spots:[
      ['سور الصين العظيم 🧱','٢١ ألف كيلومتر — أعظم بناء في تاريخ البشرية.'],
      ['المدينة المحرمة 🏯','قصر ٢٤ إمبراطور في قلب بكين — ٩٩٩٩ أوضة.'],
      ['جيش التيراكوتا ⚔️','٨٠٠٠ جندي طيني مدفونين من ٢٢٠٠ سنة.'],
      ['برج اللؤلؤة الشرقي 🌆','رمز شنغهاي الحديثة على نهر هوانجبو.']]},
    kr: {name:'كوريا 🇰🇷', spots:[
      ['قصر جيونج بوك 🏯','أجمل قصور أسرة جوسون — الحراس بيغيروا بزي تقليدي.'],
      ['برج نامسان (N Seoul) 🗼','برج الحب — الأزواج بيعلقوا أقفال عليه.'],
      ['جزيرة جيجو 🌋','جزيرة بركانية — هاواي كوريا.'],
      ['قرية بوكشون هانوك 🏘️','بيوت كورية تقليدية عمرها ٦٠٠ سنة في وسط سول.']]}
  };
  var tLang='uk';
  var tl=document.getElementById('tripLangs'), tg=document.getElementById('tripGrid');
  if(tl){
    tl.innerHTML = Object.keys(TRIPS).map(function(k){
      return '<button class="tab lang-tab'+(k===tLang?' active':'')+'" data-tl="'+k+'"><span class="ln">'+TRIPS[k].name+'</span></button>';
    }).join('');
    function renderTrip(){
      tg.innerHTML = TRIPS[tLang].spots.map(function(sp){
        return '<div class="trip-card"><div class="trip-flag">'+sp[0].split(' ').pop()+'</div><div><h4>'+esc(sp[0])+'</h4><p>'+esc(sp[1])+'</p></div></div>';
      }).join('');
    }
    tl.addEventListener('click', function(e){
      var b=e.target.closest('[data-tl]'); if(!b) return;
      tLang=b.dataset.tl;
      tl.querySelectorAll('.lang-tab').forEach(function(t){ t.classList.toggle('active', t===b); });
      renderTrip();
    });
    renderTrip();
  }
  /* ---- movie quotes ---- */
  var QUOTES=[
    ['"May the Force be with you."','القوة تكون معاكي.','Star Wars ⭐'],
    ['"I\'ll be back."','هرجع تاني.','The Terminator 🤖'],
    ['"To infinity and beyond!"','للمالانهاية وأبعد!','Toy Story 🚀'],
    ['"Just keep swimming."','خلّيكي عاومة على طول (كمّلي ومتستسلميش).','Finding Nemo 🐠'],
    ['"Hakuna Matata!"','لاش على بال (مفيش هموم).','The Lion King 🦁'],
    ['"Why so serious?"','ليه الجدية دي كلها؟','The Dark Knight 🃏'],
    ['"I\'m the king of the world!"','أنا ملك الدنيا!','Titanic 🚢'],
    ['"Elementary, my dear Watson."','بديهي يا صديقي واطسون (واضحة أوي).','Sherlock Holmes 🔍'],
    ['"There\'s no place like home."','مفيش زي البيت.','The Wizard of Oz 🌈'],
    ['"Carpe diem. Seize the day."','عيشي يومك واقتنصي اللحظة.','Dead Poets Society 📜'],
    ['"After all, tomorrow is another day."','مهما حصل، بكرة يوم جديد.','Gone with the Wind 🌅'],
    ['"Keep your friends close, but your enemies closer."','قريّب من أصحابك، وأقرب من أعدائك.','The Godfather II 🌹'],
    ['"Life finds a way."','الحياة دايمًا بتلاقي طريق.','Jurassic Park 🦕'],
    ['"With great power comes great responsibility."','مع القوة الكبيرة بتيجي مسؤولية كبيرة.','Spider-Man 🕷️'],
    ['"The flower that blooms in adversity is the most rare and beautiful of all."','الوردة اللي بتتفتح وسط الصعاب هي الأجمل على الإطلاق.','Mulan 🌸'],
    ['"Oh yes, the past can hurt. But you can either run from it, or learn from it."','الماضي ممكن يوجع، بس يا تهربي منه يا تتعلمي منه.','The Lion King 🦁'],
    ['"Even the smallest person can change the course of the future."','حتى أصغر شخص ممكن يغيّر مجرى المستقبل.','The Lord of the Rings 💍'],
    ['"It is not our abilities that show what we truly are. It is our choices."','مش قدراتنا اللي بتورينا إحنا مين، اختياراتنا هي.','Harry Potter ⚡'],
    ['"You have a dream, you got to protect it."','عندك حلم؟ يبقى لازم تحميه.','The Pursuit of Happyness 🌟'],
    ['"Hope. It is the only thing stronger than fear."','الأمل هو الحاجة الوحيدة اللي أقوى من الخوف.','The Hunger Games 🏹']
  ];
  var ql=document.getElementById('quotesList');
  if(ql){
    ql.innerHTML = QUOTES.map(function(q){
      return '<div class="quote-card"><div class="quote-text">'+esc(q[0])+'</div><div class="quote-tr">'+esc(q[1])+'</div><div class="quote-src">'+esc(q[2])+'</div></div>';
    }).join('');
  }
})();


/* ================= v24: lama floating assistant ================= */
(function(){
  var ENDPOINT = 'https://yzzlgalxjaaevmytdazf.supabase.co/functions/v1/lingua-ai';
  var ANON = 'sb_publishable_EmbKVWREHSs3sZ_nBKFyqg_zxv3Z38-';
  var overlay = document.getElementById('lamaOverlay');
  var fab = document.getElementById('lamaFab');
  var msgsEl = document.getElementById('lamaMsgs');
  var form = document.getElementById('lamaForm');
  var input = document.getElementById('lamaInput');
  if(!overlay || !fab) return;
  /* place next to حسابي FAB */
  function place(){
    var acc = document.getElementById('accFab');
    if(acc){ fab.style.left = (acc.offsetLeft + acc.offsetWidth + 10) + 'px'; }
  }
  place(); window.addEventListener('resize', place);
  function openLama(){ overlay.classList.add('open'); render(); setTimeout(function(){ input.focus(); }, 150); }
  function closeLama(){ overlay.classList.remove('open'); }
  fab.addEventListener('click', openLama);
  document.getElementById('lamaOpenBtn').addEventListener('click', openLama);
  document.getElementById('lamaClose').addEventListener('click', closeLama);
  overlay.addEventListener('click', function(e){ if(e.target===overlay) closeLama(); });
  var hist = [];
  try{ hist = JSON.parse(localStorage.getItem('lama_hist')||'[]'); }catch(e){}
  if(!hist.length) hist = [{role:'assistant', content:(window.LG==='m' ? 'أهلاً يا صاحبي! 👋 أنا لمى، صاحبك في لينجوا. اسألني أي حاجة عن الإنجليزي أو الفرنسي أو الألماني أو الصيني أو الكوري — ترجمة، نطق، قواعد، أي حاجة! 💜' : 'أهلاً يا قمر! 👋 أنا لمى، صاحبتك في لينجوا. اسأليني أي حاجة عن الإنجليزي أو الفرنسي أو الألماني أو الصيني أو الكوري — ترجمة، نطق، قواعد، أي حاجة! 💜')}];
  function esc(t){ var d=document.createElement('div'); d.textContent=t; return d.innerHTML; }
  function render(){
    msgsEl.innerHTML = hist.map(function(m){
      return '<div class="lm '+(m.role==='user'?'me':'bot')+'">'+esc(m.content)+'</div>';
    }).join('');
    msgsEl.scrollTop = msgsEl.scrollHeight;
  }
  var SUGS = ['يعني إيه breakfast؟ 🍳','علميني تحيات بالكوري 🇰🇷','إزاي أقول بحبك بالفرنسي؟ 💕','عايزة ٣ كلمات صيني سهلة 🇨🇳'];
  document.getElementById('lamaSugs').innerHTML = SUGS.map(function(q){ return '<span class="lama-sug">'+q+'</span>'; }).join('');
  document.getElementById('lamaSugs').addEventListener('click', function(e){
    var sg = e.target.closest('.lama-sug'); if(!sg) return;
    input.value = sg.textContent.replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/gu,'').trim();
    form.requestSubmit();
  });
  var busy = false;
  form.addEventListener('submit', function(e){
    e.preventDefault();
    var t = input.value.trim();
    if(!t || busy) return;
    busy = true; input.value='';
    hist.push({role:'user', content:t});
    render();
    var ty = document.createElement('div');
    ty.className='lm bot typing'; ty.textContent='لمى بتكتب...';
    msgsEl.appendChild(ty); msgsEl.scrollTop = msgsEl.scrollHeight;
    fetch(ENDPOINT, {method:'POST', headers:{'Content-Type':'application/json','apikey':ANON,'Authorization':'Bearer '+ANON},
      body: JSON.stringify({messages: ((window.LG==='m')?[{role:'user',content:'(تعليمات: كلميني دايمًا بصيغة المذكر المصري — أنا ولد)'},{role:'assistant',content:'حاضر يا صاحبي! 😄'}]:[]).concat(hist.slice(-9).map(function(m){return {role:m.role, content:m.content};}))})})
    .then(function(r){ return r.json(); })
    .then(function(d){
      ty.remove();
      hist.push({role:'assistant', content: d.reply || 'معلش، حصلت مشكلة — جربي تاني 🥺'});
      localStorage.setItem('lama_hist', JSON.stringify(hist.slice(-20)));
      render(); busy=false;
      try{ addPoints(2); }catch(e){}
    })
    .catch(function(){
      ty.remove();
      hist.push({role:'assistant', content:'النت قطع مني ثانية — جربي تاني 🥺'});
      render(); busy=false;
    });
  });
  render();
})();


/* ================= v25: word puzzle + hobbies ================= */
(function(){
  function esc(t){ var d=document.createElement('div'); d.textContent=t; return d.innerHTML; }
  var LNAME = {en:'إنجليزي 🇬🇧',fr:'فرنسي 🇫🇷',de:'ألماني 🇩🇪',zh:'صيني 🇨🇳',ko:'كوري 🇰🇷'};
  var LLANG = {en:'en-US',fr:'fr-FR',de:'de-DE',zh:'zh-CN',ko:'ko-KR'};
  /* ---- word puzzle ---- */
  var PZW = {
    en:[['CAT','قطة'],['DOG','كلب'],['SUN','شمس'],['BOOK','كتاب'],['FISH','سمك'],['BIRD','عصفورة'],['MILK','لبن'],['CAKE','تورطة'],['MOON','قمر'],['STAR','نجمة']],
    fr:[['CHAT','قطة'],['PAIN','عيش'],['SOLEIL','شمس'],['LIVRE','كتاب'],['LUNE','قمر'],['FLEUR','وردة'],['AMI','صاحب'],['ECOLE','مدرسة']],
    de:[['KATZE','قطة'],['HUND','كلب'],['SONNE','شمس'],['BUCH','كتاب'],['WASSER','مية'],['BROT','عيش'],['FREUND','صاحب'],['SCHULE','مدرسة']],
    zh:[['MAO','قطة (猫 māo)'],['GOU','كلب (狗 gǒu)'],['SHUI','مية (水 shuǐ)'],['SHU','كتاب (书 shū)'],['AI','حب (爱 ài)'],['HAO','كويس (好 hǎo)']],
    ko:[['BAP','رز (밥)'],['MUL','مية (물)'],['SALAM','إنسان (사람)'],['CHINGU','صاحب (친구)'],['HAKGYO','مدرسة (학교)'],['SAGWA','تفاحة (사과)']]
  };
  var pLang='en', pzIdx=0, pzScoreN=0, picked=[];
  var pl=document.getElementById('pzLangs');
  if(pl){
    pl.innerHTML = Object.keys(PZW).map(function(k){
      return '<button class="tab lang-tab'+(k===pLang?' active':'')+'" data-pz="'+k+'"><span class="ln">'+LNAME[k]+'</span></button>';
    }).join('');
    function renderPz(){
      var w = PZW[pLang][pzIdx % PZW[pLang].length];
      document.getElementById('pzMean').textContent = w[1];
      document.getElementById('pzHint').textContent = 'كوّني الكلمة من الحروف ('+w[0].length+' حروف)';
      picked = [];
      var ans = document.getElementById('pzAnswer');
      ans.innerHTML = w[0].split('').map(function(){ return '<div class="pz-slot"></div>'; }).join('');
      var tiles = w[0].split('').map(function(ch,i){ return {ch:ch, id:i}; }).sort(function(){return Math.random()-.5;});
      document.getElementById('pzTiles').innerHTML = tiles.map(function(t){
        return '<button class="pz-tile" data-tid="'+t.id+'">'+t.ch+'</button>';
      }).join('');
      document.getElementById('pzScore').textContent = 'نقطتك في البازل: '+pzScoreN+' 🧩';
    }
    document.getElementById('pzTiles').addEventListener('click', function(e){
      var t=e.target.closest('.pz-tile'); if(!t||t.classList.contains('used')) return;
      t.classList.add('used');
      picked.push({id:t.dataset.tid, ch:t.textContent});
      var slots=document.querySelectorAll('#pzAnswer .pz-slot');
      slots[picked.length-1].textContent=t.textContent;
      slots[picked.length-1].classList.add('filled');
      var w = PZW[pLang][pzIdx % PZW[pLang].length];
      if(picked.length===w[0].length){
        var guess=picked.map(function(x){return x.ch;}).join('');
        if(guess===w[0]){
          pzScoreN+=10; try{ addPoints(3); }catch(e){}
          try{ var u=new SpeechSynthesisUtterance(w[0]); u.lang=LLANG[pLang]; speechSynthesis.speak(u); }catch(e){}
          setTimeout(function(){ pzIdx++; renderPz(); }, 800);
        } else {
          setTimeout(function(){ renderPz(); }, 700);
        }
      }
    });
    document.getElementById('pzClear').addEventListener('click', renderPz);
    document.getElementById('pzSkip').addEventListener('click', function(){ pzIdx++; renderPz(); });
    pl.addEventListener('click', function(e){
      var b=e.target.closest('[data-pz]'); if(!b) return;
      pLang=b.dataset.pz; pzIdx=0;
      pl.querySelectorAll('.lang-tab').forEach(function(t){ t.classList.toggle('active', t===b); });
      renderPz();
    });
    renderPz();
  }
  /* ---- hobbies ---- */
  var HB = {
    en:[['Drawing','رسم','🎨'],['Singing','غنا','🎤'],['Reading','قراية','📚'],['Cooking','طبخ','🍳'],['Dancing','رقص','💃'],['Swimming','عوم','🏊‍♀️'],['Photography','تصوير','📸'],['Gaming','جيمينج','🎮']],
    fr:[['Dessin','رسم','🎨'],['Chanter','غنا','🎤'],['Lecture','قراية','📚'],['Cuisine','طبخ','🍳'],['Danse','رقص','💃'],['Natation','عوم','🏊‍♀️'],['Photo','تصوير','📸'],['Jeux','جيمينج','🎮']],
    de:[['Zeichnen','رسم','🎨'],['Singen','غنا','🎤'],['Lesen','قراية','📚'],['Kochen','طبخ','🍳'],['Tanzen','رقص','💃'],['Schwimmen','عوم','🏊‍♀️'],['Fotografie','تصوير','📸'],['Spielen','جيمينج','🎮']],
    zh:[['画画 (huàhuà)','رسم','🎨'],['唱歌 (chànggē)','غنا','🎤'],['阅读 (yuèdú)','قراية','📚'],['做饭 (zuòfàn)','طبخ','🍳'],['跳舞 (tiàowǔ)','رقص','💃'],['游泳 (yóuyǒng)','عوم','🏊‍♀️'],['摄影 (shèyǐng)','تصوير','📸'],['游戏 (yóuxì)','جيمينج','🎮']],
    ko:[['그림 (geurim)','رسم','🎨'],['노래 (norae)','غنا','🎤'],['독서 (dokseo)','قراية','📚'],['요리 (yori)','طبخ','🍳'],['춤 (chum)','رقص','💃'],['수영 (suyeong)','عوم','🏊‍♀️'],['사진 (sajin)','تصوير','📸'],['게임 (geim)','جيمينج','🎮']]
  };
  var hLang='en';
  var hl=document.getElementById('hbLangs'), hw=document.getElementById('hbWords');
  if(hl){
    hl.innerHTML = Object.keys(HB).map(function(k){
      return '<button class="tab lang-tab'+(k===hLang?' active':'')+'" data-hb="'+k+'"><span class="ln">'+LNAME[k]+'</span></button>';
    }).join('');
    function renderHb(){
      hw.innerHTML = HB[hLang].map(function(w){
        return '<div class="fw-card"><span style="font-size:1.5rem">'+w[2]+'</span><div class="fw-t"><b>'+esc(w[0])+'</b><span>'+esc(w[1])+'</span></div><button class="fw-say" data-say="'+esc(w[0].replace(/ *\(.*?\)/,''))+'">🔊</button></div>';
      }).join('');
    }
    hl.addEventListener('click', function(e){
      var b=e.target.closest('[data-hb]'); if(!b) return;
      hLang=b.dataset.hb;
      hl.querySelectorAll('.lang-tab').forEach(function(t){ t.classList.toggle('active', t===b); });
      renderHb();
    });
    hw.addEventListener('click', function(e){
      var b=e.target.closest('.fw-say'); if(!b) return;
      try{ var u=new SpeechSynthesisUtterance(b.dataset.say); u.lang=LLANG[hLang]; speechSynthesis.cancel(); speechSynthesis.speak(u); }catch(e){}
    });
    renderHb();
  }
})();


/* ================= v26: themed vocabulary ================= */
(function(){
  function esc(t){ var d=document.createElement('div'); d.textContent=t; return d.innerHTML; }
  var LNAME = {en:'إنجليزي 🇬🇧',fr:'فرنسي 🇫🇷',de:'ألماني 🇩🇪',zh:'صيني 🇨🇳',ko:'كوري 🇰🇷'};
  var LLANG = {en:'en-US',fr:'fr-FR',de:'de-DE',zh:'zh-CN',ko:'ko-KR'};
  /* [en, fr, de, zh, ko, arabic, emoji] */
  var THEMES = {
    family: {name:'العيلة 👨‍👩‍👧', rows:[
      ['Mother','Mère','Mutter','妈妈 (māma)','엄마 (eomma)','ماما','👩'],
      ['Father','Père','Vater','爸爸 (bàba)','아빠 (appa)','بابا','👨'],
      ['Sister','Sœur','Schwester','姐姐 (jiějie)','언니 (eonni)','أخت','👧'],
      ['Brother','Frère','Bruder','哥哥 (gēge)','오빠 (oppa)','أخ','👦'],
      ['Grandma','Grand-mère','Oma','奶奶 (nǎinai)','할머니 (halmeoni)','تيتة','👵'],
      ['Baby','Bébé','Baby','宝宝 (bǎobǎo)','아기 (agi)','بيبي','👶']]},
    colors: {name:'الألوان 🌈', rows:[
      ['Red','Rouge','Rot','红色 (hóngsè)','빨간색 (ppalgansaek)','أحمر','🔴'],
      ['Blue','Bleu','Blau','蓝色 (lánsè)','파란색 (paransaek)','أزرق','🔵'],
      ['Green','Vert','Grün','绿色 (lǜsè)','초록색 (choroksaek)','أخضر','🟢'],
      ['Yellow','Jaune','Gelb','黄色 (huángsè)','노란색 (noransaek)','أصفر','🟡'],
      ['Pink','Rose','Rosa','粉色 (fěnsè)','분홍색 (bunhongsaek)','بينك','🩷'],
      ['Purple','Violet','Lila','紫色 (zǐsè)','보라색 (borasaek)','بنفسجي','🟣']]},
    animals: {name:'حيوانات 🐾', rows:[
      ['Cat','Chat','Katze','猫 (māo)','고양이 (goyangi)','قطة','🐱'],
      ['Dog','Chien','Hund','狗 (gǒu)','강아지 (gangaji)','كلب','🐶'],
      ['Rabbit','Lapin','Hase','兔子 (tùzi)','토끼 (tokki)','أرنب','🐰'],
      ['Bird','Oiseau','Vogel','鸟 (niǎo)','새 (sae)','عصفورة','🐦'],
      ['Horse','Cheval','Pferd','马 (mǎ)','말 (mal)','حصان','🐴'],
      ['Lion','Lion','Löwe','狮子 (shīzi)','사자 (saja)','أسد','🦁']]},
    time: {name:'الوقت والأيام ⏰', rows:[
      ['Today','Aujourd\'hui','Heute','今天 (jīntiān)','오늘 (oneul)','النهاردة','📅'],
      ['Tomorrow','Demain','Morgen','明天 (míngtiān)','내일 (naeil)','بكرة','🌅'],
      ['Yesterday','Hier','Gestern','昨天 (zuótiān)','어제 (eoje)','إمبارح','⏪'],
      ['Morning','Matin','Morgen','早上 (zǎoshang)','아침 (achim)','الصبح','🌄'],
      ['Night','Nuit','Nacht','晚上 (wǎnshang)','밤 (bam)','الليل','🌙'],
      ['Week','Semaine','Woche','星期 (xīngqī)','일주일 (iljuil)','أسبوع','🗓️']]},
    school: {name:'المدرسة 🎒', rows:[
      ['Teacher','Professeur','Lehrerin','老师 (lǎoshī)','선생님 (seonsaengnim)','مدرسة','👩‍🏫'],
      ['Student','Étudiante','Schülerin','学生 (xuésheng)','학생 (haksaeng)','طالبة','👩‍🎓'],
      ['Pen','Stylo','Stift','笔 (bǐ)','펜 (pen)','قلم','🖊️'],
      ['Notebook','Cahier','Heft','笔记本 (bǐjìběn)','공책 (gongchaek)','كشكول','📓'],
      ['Exam','Examen','Prüfung','考试 (kǎoshì)','시험 (siheom)','امتحان','📝'],
      ['Friend','Amie','Freundin','朋友 (péngyou)','친구 (chingu)','صاحبة','👯']]},
    feelings: {name:'مشاعر 💗', rows:[
      ['Happy','Heureuse','Glücklich','开心 (kāixīn)','행복해 (haengbokhae)','مبسوطة','😊'],
      ['Sad','Triste','Traurig','难过 (nánguò)','슬퍼 (seulpeo)','زعلانة','😢'],
      ['Tired','Fatiguée','Müde','累 (lèi)','피곤해 (pigonhae)','تعبانة','😴'],
      ['Excited','Excitée','Aufgeregt','兴奋 (xīngfèn)','신나 (sinna)','متحمسة','🤩'],
      ['Angry','En colère','Wütend','生气 (shēngqì)','화나 (hwana)','متنرفزة','😤'],
      ['Proud','Fière','Stolz','骄傲 (jiāo\'ào)','자랑스러워 (jarangseureowo)','فخورة','💪']]},
    food2: {name:'الأكل 🍎', rows:[
      ['Bread','Pain','Brot','面包 (miànbāo)','빵 (ppang)','عيش','🍞'],
      ['Rice','Riz','Reis','米饭 (mǐfàn)','밥 (bap)','رز','🍚'],
      ['Chicken','Poulet','Hähnchen','鸡肉 (jīròu)','닭고기 (dakgogi)','فراخ','🍗'],
      ['Fruit','Fruit','Obst','水果 (shuǐguǒ)','과일 (gwail)','فاكهة','🍎'],
      ['Tea','Thé','Tee','茶 (chá)','차 (cha)','شاي','🍵'],
      ['Coffee','Café','Kaffee','咖啡 (kāfēi)','커피 (keopi)','قهوة','☕']]},
    places2: {name:'أماكن 🏙️', rows:[
      ['House','Maison','Haus','房子 (fángzi)','집 (jip)','بيت','🏠'],
      ['School','École','Schule','学校 (xuéxiào)','학교 (hakgyo)','مدرسة','🏫'],
      ['Hospital','Hôpital','Krankenhaus','医院 (yīyuàn)','병원 (byeongwon)','مستشفى','🏥'],
      ['Market','Marché','Markt','市场 (shìchǎng)','시장 (sijang)','سوق','🛒'],
      ['Beach','Plage','Strand','海滩 (hǎitān)','해변 (haebyeon)','شاطئ','🏖️'],
      ['Mosque','Mosquée','Moschee','清真寺 (qīngzhēnsì)','모스크 (moseukeu)','مسجد','🕌']]},
    transport: {name:'مواصلات 🚗', rows:[
      ['Car','Voiture','Auto','汽车 (qìchē)','차 (cha)','عربية','🚗'],
      ['Bus','Bus','Bus','公交车 (gōngjiāochē)','버스 (beoseu)','أوتوبيس','🚌'],
      ['Train','Train','Zug','火车 (huǒchē)','기차 (gicha)','قطار','🚆'],
      ['Plane','Avion','Flugzeug','飞机 (fēijī)','비행기 (bihaenggi)','طيارة','✈️'],
      ['Bicycle','Vélo','Fahrrad','自行车 (zìxíngchē)','자전거 (jajeongeo)','عجلة','🚲'],
      ['Metro','Métro','U-Bahn','地铁 (dìtiě)','지하철 (jihacheol)','مترو','🚇']]},
    sports: {name:'رياضة ⚽', rows:[
      ['Football','Football','Fußball','足球 (zúqiú)','축구 (chukgu)','كورة','⚽'],
      ['Swimming','Natation','Schwimmen','游泳 (yóuyǒng)','수영 (suyeong)','سباحة','🏊'],
      ['Running','Course','Laufen','跑步 (pǎobù)','달리기 (dalligi)','جري','🏃‍♀️'],
      ['Gym','Sport','Fitnessstudio','健身房 (jiànshēnfáng)','헬스장 (helseujang)','جيم','🏋️'],
      ['Tennis','Tennis','Tennis','网球 (wǎngqiú)','테니스 (teniseu)','تنس','🎾'],
      ['Dance','Danse','Tanzen','跳舞 (tiàowǔ)','춤 (chum)','رقص','💃']]},
    work: {name:'الشغل 💼', rows:[
      ['Doctor','Médecin','Ärztin','医生 (yīshēng)','의사 (uisa)','دكتورة','👩‍⚕️'],
      ['Engineer','Ingénieure','Ingenieurin','工程师 (gōngchéngshī)','엔지니어 (enjinieo)','مهندسة','👩‍💻'],
      ['Work','Travail','Arbeit','工作 (gōngzuò)','일 (il)','شغل','💼'],
      ['Meeting','Réunion','Besprechung','会议 (huìyì)','회의 (hoeui)','اجتماع','🤝'],
      ['Money','Argent','Geld','钱 (qián)','돈 (don)','فلوس','💰'],
      ['Dream','Rêve','Traum','梦想 (mèngxiǎng)','꿈 (kkum)','حلم','✨']]},
    weather2: {name:'الطقس ⛅', rows:[
      ['Sun','Soleil','Sonne','太阳 (tàiyáng)','해 (hae)','شمس','☀️'],
      ['Rain','Pluie','Regen','雨 (yǔ)','비 (bi)','مطر','🌧️'],
      ['Snow','Neige','Schnee','雪 (xuě)','눈 (nun)','تلج','❄️'],
      ['Wind','Vent','Wind','风 (fēng)','바람 (baram)','رياح','💨'],
      ['Hot','Chaud','Heiß','热 (rè)','더워 (deowo)','حر','🔥'],
      ['Cold','Froid','Kalt','冷 (lěng)','추워 (chuwo)','برد','🥶']]},
    health: {name:'الصحة 🏥', rows:[
      ['Medicine','Médicament','Medikament','药 (yào)','약 (yak)','دوا','💊'],
      ['Headache','Mal de tête','Kopfschmerzen','头痛 (tóutòng)','두통 (dutong)','صداع','🤕'],
      ['Water','Eau','Wasser','水 (shuǐ)','물 (mul)','مياه','💧'],
      ['Sleep','Sommeil','Schlaf','睡觉 (shuìjiào)','잠 (jam)','نوم','😴'],
      ['Doctor','Docteur','Arzt','医生 (yīshēng)','의사 (uisa)','دكتور','🩺'],
      ['Vitamins','Vitamines','Vitamine','维生素 (wéishēngsù)','비타민 (bitamin)','فيتامينات','🍊']]},
    tech: {name:'تكنولوجيا 📱', rows:[
      ['Phone','Téléphone','Handy','手机 (shǒujī)','폰 (pon)','موبايل','📱'],
      ['Computer','Ordinateur','Computer','电脑 (diànnǎo)','컴퓨터 (keompyuteo)','كمبيوتر','💻'],
      ['Internet','Internet','Internet','网络 (wǎngluò)','인터넷 (inteonet)','نت','🌐'],
      ['Password','Mot de passe','Passwort','密码 (mìmǎ)','비밀번호 (bimilbeonho)','باسورد','🔑'],
      ['Photo','Photo','Foto','照片 (zhàopiàn)','사진 (sajin)','صورة','📸'],
      ['Message','Message','Nachricht','消息 (xiāoxi)','메시지 (mesiji)','رسالة','💬']]},
    nature: {name:'الطبيعة 🌿', rows:[
      ['Tree','Arbre','Baum','树 (shù)','나무 (namu)','شجرة','🌳'],
      ['Flower','Fleur','Blume','花 (huā)','꽃 (kkot)','وردة','🌸'],
      ['Sea','Mer','Meer','海 (hǎi)','바다 (bada)','بحر','🌊'],
      ['Mountain','Montagne','Berg','山 (shān)','산 (san)','جبل','⛰️'],
      ['Moon','Lune','Mond','月亮 (yuèliang)','달 (dal)','قمر','🌙'],
      ['Star','Étoile','Stern','星星 (xīngxing)','별 (byeol)','نجمة','⭐']]},
    travel: {name:'السفر 🧳', rows:[
      ['Passport','Passeport','Reisepass','护照 (hùzhào)','여권 (yeogwon)','باسبور','🛂'],
      ['Suitcase','Valise','Koffer','行李箱 (xínglixiāng)','캐리어 (kaerieo)','شنطة سفر','🧳'],
      ['Ticket','Billet','Ticket','票 (piào)','표 (pyo)','تذكرة','🎫'],
      ['Hotel','Hôtel','Hotel','酒店 (jiǔdiàn)','호텔 (hotel)','فندق','🏨'],
      ['Airport','Aéroport','Flughafen','机场 (jīchǎng)','공항 (gonghang)','مطار','🛫'],
      ['Map','Carte','Karte','地图 (dìtú)','지도 (jido)','خريطة','🗺️']]}
  };
  var thTheme='family', thLang='en';
  var tt=document.getElementById('thThemes'), tl2=document.getElementById('thLangs'), tw=document.getElementById('thWords');
  if(!tt) return;
  tt.innerHTML = Object.keys(THEMES).map(function(k){
    return '<button class="tab lang-tab'+(k===thTheme?' active':'')+'" data-th="'+k+'"><span class="ln">'+THEMES[k].name+'</span></button>';
  }).join('');
  tl2.innerHTML = Object.keys(LNAME).map(function(k){
    return '<button class="tab lang-tab'+(k===thLang?' active':'')+'" data-thl="'+k+'"><span class="ln">'+LNAME[k]+'</span></button>';
  }).join('');
  var LIDX = {en:0, fr:1, de:2, zh:3, ko:4};
  function renderTh(){
    var i = LIDX[thLang];
    tw.innerHTML = THEMES[thTheme].rows.map(function(r){
      return '<div class="fw-card"><span style="font-size:1.5rem">'+r[6]+'</span><div class="fw-t"><b>'+esc(r[i])+'</b><span>'+esc(r[5])+'</span></div><button class="fw-say" data-say="'+esc(r[i].replace(/ *\(.*?\)/,''))+'">🔊</button></div>';
    }).join('');
  }
  tt.addEventListener('click', function(e){
    var b=e.target.closest('[data-th]'); if(!b) return;
    thTheme=b.dataset.th;
    tt.querySelectorAll('.lang-tab').forEach(function(t){ t.classList.toggle('active', t===b); });
    renderTh();
  });
  tl2.addEventListener('click', function(e){
    var b=e.target.closest('[data-thl]'); if(!b) return;
    thLang=b.dataset.thl;
    tl2.querySelectorAll('.lang-tab').forEach(function(t){ t.classList.toggle('active', t===b); });
    renderTh();
  });
  tw.addEventListener('click', function(e){
    var b=e.target.closest('.fw-say'); if(!b) return;
    try{ var u=new SpeechSynthesisUtterance(b.dataset.say); u.lang=LLANG[thLang]; speechSynthesis.cancel(); speechSynthesis.speak(u); }catch(e){}
  });
  renderTh();
  try{ window.VOCAB_THEMES = THEMES; }catch(e){}
})();

document.getElementById('menuGrid').innerHTML = MENU.map(function(m){
  return '<a class="menu-card" href="#'+m[0]+'"><span class="m-ico">'+m[1]+'</span><span class="m-name">'+m[2]+'</span></a>';
}).join('');
const VIEWIDS = MENU.map(function(m){ return m[0]; }).concat(['today','features','menu']);
(function(){
  const nav = document.getElementById('topNav');
  const items = [['home','🏠','الرئيسية']].concat(MENU);
  nav.innerHTML = items.map(function(m){
    return '<a href="#'+(m[0]==='home'?'':m[0])+'" data-id="'+m[0]+'"><span class="ti">'+m[1]+'</span><span class="tl">'+m[2]+'</span></a>';
  }).join('');
  window.markNavActive = function(){
    const id = location.hash.slice(1) || 'home';
    nav.querySelectorAll('a').forEach(function(a){ a.classList.toggle('active', a.dataset.id===id); });
    const cur = nav.querySelector('a.active');
    if(cur) try{ cur.scrollIntoView({inline:'center',block:'nearest'}); }catch(e){}
  };
  window.addEventListener('hashchange', window.markNavActive);
  window.markNavActive();
})();
function showView(id){
  document.body.classList.add('routed');
  const home = !id;
  document.body.classList.toggle('home', home);
  document.querySelectorAll('section').forEach(function(sec){
    const on = home ? (sec.id==='menu'||sec.id==='today'||sec.id==='features') : (sec.id===id);
    sec.classList.toggle('view', on);
  });
  window.scrollTo(0,0);
}
function routeFromHash(){
  const id = location.hash.slice(1);
  showView((id && document.getElementById(id) && document.getElementById(id).tagName === 'SECTION') ? id : null);
}
window.addEventListener('hashchange', routeFromHash);
document.addEventListener('click', function(e){
  const g = e.target.closest ? e.target.closest('.corner-go') : null;
  if(g && g.dataset && g.dataset.target){ location.hash = g.dataset.target.replace('#',''); }
});
routeFromHash();

/* v6 manual friends removed in v11 - invite-only real friends now (see account hub) */

/* ================= v6: fun games (تلبيس/طبخ/بيوت/كورة) ================= */
const FUN_ITEMS = {
  dress: [
    ['👗','Dress','Robe','Kleid','连衣裙'],['👒','Hat','Chapeau','Hut','帽子'],
    ['👟','Shoes','Chaussures','Schuhe','鞋子'],['👕','Shirt','Chemise','Hemd','衬衫'],
    ['👖','Pants','Pantalon','Hose','裤子'],['🧣','Scarf','Écharpe','Schal','围巾'],
    ['👜','Bag','Sac','Tasche','包'],['🧤','Gloves','Gants','Handschuhe','手套']
  ],
  cook: [
    ['🍎','Apple','Pomme','Apfel','苹果'],['🍌','Banana','Banane','Banane','香蕉'],
    ['🥛','Milk','Lait','Milch','牛奶'],['🧀','Cheese','Fromage','Käse','奶酪'],
    ['🥚','Egg','Œuf','Ei','鸡蛋'],['🍚','Rice','Riz','Reis','米饭'],
    ['🐟','Fish','Poisson','Fisch','鱼'],['🍞','Bread','Pain','Brot','面包']
  ],
  house: [
    ['🛏️','Bed','Lit','Bett','床'],['🛋️','Sofa','Canapé','Sofa','沙发'],
    ['📺','TV','Télévision','Fernseher','电视'],['💡','Lamp','Lampe','Lampe','灯'],
    ['🚪','Door','Porte','Tür','门'],['🪟','Window','Fenêtre','Fenster','窗户'],
    ['🪴','Plant','Plante','Pflanze','植物'],['🕰️','Clock','Horloge','Uhr','钟']
  ],
  football: [
    ['⚽','Ball','Ballon','Ball','球'],['🥅','Goal','But','Tor','球门'],
    ['👟','Boots','Crampons','Schuhe','球鞋'],['🧤','Gloves','Gants','Handschuhe','手套'],
    ['🏆','Trophy','Trophée','Pokal','奖杯'],['🟨','Yellow card','Carton jaune','Gelbe Karte','黄牌'],
    ['🎽','Jersey','Maillot','Trikot','球衣'],['📣','Fans','Supporters','Fans','球迷']
  ]
};
const FUN_STAGE0 = {dress:'👧', cook:'🥣', house:'🏠', football:'🥅'};
const FUN_DONE = {dress:'👸', cook:'🍲', house:'🏡', football:'🏆'};
const FUN_LANGI = {en:1, fr:2, de:3, zh:4};
let funGame = 'cook', funLang = 'en', funIdx = 0, funGot = [];
function funStageDrawOrig(){
  document.getElementById('funStage').textContent = FUN_STAGE0[funGame] + ' ' + funGot.join(' ');
}
function funNext(){
  const items = FUN_ITEMS[funGame];
  const w = document.getElementById('funWord');
  const o = document.getElementById('funOpts');
  if(funIdx >= items.length){
    document.getElementById('funStage').textContent = FUN_DONE[funGame] + ' ' + funGot.join(' ');
    w.innerHTML = 'برافو عليكي! خلصتي الجولة 🎉 +٢٠ نقطة';
    awardPoints(20, 'لعبة حلوة');
    confetti(); sndWin();
    o.innerHTML = '<button class="btn" id="funAgain" style="grid-column:1/-1">العبي تاني 🔁</button>';
    document.getElementById('funAgain').addEventListener('click', funStart);
    return;
  }
  const item = items[funIdx];
  const word = item[FUN_LANGI[funLang]];
  w.innerHTML = 'اختاري: <span style="color:#fff">'+word+'</span> <button class="speak-btn" id="funSpeak" style="padding:4px 10px;font-size:.9rem">🔊</button>';
  const others = items.map(function(x){ return x[0]; }).filter(function(e){ return e !== item[0]; });
  others.sort(function(){ return Math.random() - 0.5; });
  const opts = [item[0]].concat(others.slice(0,3)).sort(function(){ return Math.random() - 0.5; });
  o.innerHTML = opts.map(function(e){ return '<button class="fun-opt" data-e="'+e+'">'+e+'</button>'; }).join('');
  document.getElementById('funSpeak').addEventListener('click', function(){ speakText(word, funLang); });
  o.querySelectorAll('.fun-opt').forEach(function(b){
    b.addEventListener('click', function(){
      if(b.dataset.e === item[0]){
        b.classList.add('right');
        funGot.push(item[0]);
        awardPoints(5, 'إجابة صح');
        sndGood();
        setTimeout(function(){ funIdx++; funStageDraw(); funNext(); }, 550);
      } else {
        b.classList.add('wrong');
        sndBad();
      }
    });
  });
}
function funStart(){ funIdx = 0; funGot = []; funStageDraw(); funNext(); }
document.querySelectorAll('#funTabs .tab[data-fun]').forEach(function(t){
  t.addEventListener('click', function(){
    document.querySelectorAll('#funTabs .tab[data-fun]').forEach(function(x){ x.classList.remove('active'); });
    t.classList.add('active');
    funGame = t.dataset.fun;
    funStart();
  });
});
document.querySelectorAll('#funLangTabs .tab').forEach(function(t){
  t.addEventListener('click', function(){
    document.querySelectorAll('#funLangTabs .tab').forEach(function(x){ x.classList.remove('active'); });
    t.classList.add('active');
    funLang = t.dataset.lang;
    funStart();
  });
});
funStart();

/* ================= v6: outfit styler ================= */
(function(){
  const drop = document.getElementById('outfitDrop');
  const file = document.getElementById('outfitFile');
  const res = document.getElementById('outfitRes');
  drop.addEventListener('click', function(){ file.click(); });
  function colorName(r, g, b){
    const mx = Math.max(r,g,b), mn = Math.min(r,g,b), l = (mx+mn)/510;
    if(mx - mn < 24){
      if(l > 0.85) return 'أبيض'; if(l < 0.15) return 'أسود'; return 'رمادي';
    }
    let h = 0;
    const d = mx - mn;
    if(mx === r) h = ((g-b)/d) % 6; else if(mx === g) h = (b-r)/d + 2; else h = (r-g)/d + 4;
    h = Math.round(h*60); if(h < 0) h += 360;
    let name = 'أحمر';
    if(h >= 345 || h < 15) name = 'أحمر'; else if(h < 40) name = 'برتقالي'; else if(h < 70) name = 'أصفر';
    else if(h < 160) name = 'أخضر'; else if(h < 190) name = 'تركواز'; else if(h < 250) name = 'أزرق';
    else if(h < 290) name = 'بنفسجي'; else name = 'وردي';
    if(l > 0.75) name += ' فاتح'; else if(l < 0.3) name += ' غامق';
    return name;
  }
  function matchTips(name){
    const tips = {
      'أحمر': 'ينفع معاه: أسود، أبيض، كحلي، دهبي ✨', 'برتقالي': 'ينفع معاه: كحلي، بيج، أبيض، بني 🤎',
      'أصفر': 'ينفع معاه: كحلي، رمادي، أبيض، جينز أزرق 💛', 'أخضر': 'ينفع معاه: بيج، أبيض، دهبي، بني 💚',
      'تركواز': 'ينفع معاه: أبيض، فضي، كحلي، كورال 🩵', 'أزرق': 'ينفع معاه: أبيض، رمادي، بيج، سيلفر 💙',
      'بنفسجي': 'ينفع معاه: أبيض، رمادي، وردي فاتح، فضي 💜', 'وردي': 'ينفع معاه: أبيض، رمادي، كحلي، نيود 🩷',
      'أبيض': 'بيمشي مع أي لون! جربي ألوان صريحة معاه 🤍', 'أسود': 'بيمشي مع أي لون! زوّدي لون صارخ أو دهبي 🖤',
      'رمادي': 'ينفع معاه: وردي، أصفر، كحلي، أبيض 🩶'
    };
    for(const k in tips){ if(name.indexOf(k) >= 0) return tips[k]; }
    return 'جربيه مع ألوان هادية زي الأبيض والبيج ✨';
  }
  file.addEventListener('change', function(){
    if(!file.files.length) return;
    const img = new Image();
    img.onload = function(){
      const c = document.createElement('canvas');
      c.width = 48; c.height = 48;
      const ctx = c.getContext('2d');
      ctx.drawImage(img, 0, 0, 48, 48);
      const data = ctx.getImageData(0, 0, 48, 48).data;
      const buckets = {};
      for(let i = 0; i < data.length; i += 4){
        const key = ((data[i]>>6)*4) + '-' + ((data[i+1]>>6)*4) + '-' + ((data[i+2]>>6)*4);
        if(!buckets[key]) buckets[key] = {r:0, g:0, b:0, n:0};
        buckets[key].r += data[i]; buckets[key].g += data[i+1]; buckets[key].b += data[i+2]; buckets[key].n++;
      }
      const top = Object.values(buckets).sort(function(a,b){ return b.n - a.n; }).slice(0,3);
      const cols = top.map(function(t){
        return {r:Math.round(t.r/t.n), g:Math.round(t.g/t.n), b:Math.round(t.b/t.n)};
      });
      URL.revokeObjectURL(img.src);
      res.innerHTML = '<div style="text-align:center;font-weight:900;margin-top:10px">🎨 ألوان القطعة:</div>' +
        '<div class="pal-row">' + cols.map(function(cl){
          const hex = 'rgb('+cl.r+','+cl.g+','+cl.b+')';
          return '<div><div class="pal-sw" style="background:'+hex+'"></div><div class="pal-name">'+colorName(cl.r,cl.g,cl.b)+'</div></div>';
        }).join('') + '</div>' +
        cols.map(function(cl){
          const nm = colorName(cl.r,cl.g,cl.b);
          return '<div style="background:var(--card);border:1px solid rgba(var(--goldA),.25);border-radius:16px;padding:14px;margin:10px 0;text-align:center">لون <b style="color:var(--gold2)">'+nm+'</b> — '+matchTips(nm)+'</div>';
        }).join('') +
        outfitCombos(cols) +
        '<div style="text-align:center;color:var(--muted);font-size:.8rem;margin-top:12px">💡 نصيحة: كونسي لون واحد صريح في اللوك والباقي هادي</div>';
      toast('طلّعنا ألوان القطعة! 🎨');
      awardPoints(10, 'تنسيق لبس');
    };
    img.src = URL.createObjectURL(file.files[0]);
  });
})();

/* ================= v6: engineering courses ================= */
const ENG = [
  {dept:'🏗️ هندسة مدنية', vids:[
    {t:'استاتيكا: أسس وضع الأعمدة — هشام طارق', id:'AsuAq1vxxL4'},
    {t:'الجمالون (Truss) — طريقة المقاطع', id:'Mor4WzWFJZc'}]},
  {dept:'⚡ هندسة كهربائية', vids:[
    {t:'تحليل الدوائر الكهربائية — المقدمة', id:'OLsuvugJR9I'},
    {t:'الدوائر الكهربائية ١ — د. زينب الزاوي', id:'xocYwOYzvhY'}]},
  {dept:'⚙️ هندسة ميكانيكا', vids:[
    {t:'الميكانيك الهندسي — مقدمة وأنواع القوى', id:'XbCdh7h-Nx0'},
    {t:'Engineering Mechanics I — Lecture 01', id:'nGfVTNfNwnk'}]},
  {dept:'📐 هندسة معمارية', vids:[
    {t:'تاريخ ونظريات العمارة — محاضرة', id:'7kA6ytlaGl0'},
    {t:'تدريب Revit Architecture بالعربي', id:'XsDIr8Tr7WE'}]},
  {dept:'📡 اتصالات وحاسبات', vids:[
    {t:'بنية الحواسيب وتنظيمها — محاضرة', id:'55ld_GN7nQs'},
    {t:'أساسيات الشبكات', id:'DG--5d3U88A'},
    {t:'أساسيات شبكات الحاسب — توجيه الرسائل', id:'mMfP0IXYJp8'}]},
  {dept:'🖊️ رسم هندسي', vids:[
    {t:'شرح مبادئ الرسم الهندسي — المحاضرة ٨', id:'A1OYfW5asmo'},
    {t:'عرض منهج رسم هندسي — جامعة أم القرى', id:'Uol6XQIA16w'},
    {t:'دورة الرسم الهندسي الصناعي بـ SolidWorks — المحاضرة ٧', id:'MTthZU1p2l8'},
    {t:'أساسيات الرسم الهندسي — SolidWorks بالعربي', id:'erXDKdvv9sM'}]},
  {dept:'➗ رياضيات تحضيري', vids:[
    {t:'حساب التفاضل والتكامل — المحاضرة الأولى', id:'pUAaasolcVk'},
    {t:'التفاضل والتكامل MATH 201 — الاشتقاق (جامعة طيبة)', id:'ulr2sbrcJTQ'}]},
  {dept:'💻 برمجة', vids:[
    {t:'البرمجة بلغة C — الدرس الأول', id:'2GllO9oo2b4'},
    {t:'خارطة طريق تعلم البرمجة من واقع سوق العمل', id:'sWCQMMfP8p8'}]},
  {dept:'🧭 اختاري تخصصك', vids:[
    {t:'الفرق بين الهندسة المعمارية والعمران', id:'wfp0Exd9Sio'},
    {t:'هندسة الاتصالات والإلكترونيات', id:'G2WdqnZ-4tw'}]}
];
document.getElementById('engWrap').innerHTML = ENG.map(function(g){
  return '<h3 class="level-head"><span class="pill">'+g.dept+'</span><span class="line"></span></h3>' +
    '<div class="video-grid">' + g.vids.map(function(v){
      return '<div class="video-card">' + ytLite(v.id) + '<div class="vbody"><h3>' + v.t + '</h3></div></div>';
    }).join('') + '</div>';
}).join('');

/* ================= v6: seerah ================= */
const SEERAH = [
  {t:'🕯️ المولد النبوي', d:'وُلد النبي محمد ﷺ في مكة المكارما عام الفيل، يتيم الأب، وتكفّله جده ثم عمه أبو طالب.'},
  {t:'📖 البعثة', d:'في غار حراء نزل عليه الوحي وهو في الأربعين من عمره: «اقرأ باسم ربك الذي خلق».'},
  {t:'🐪 الهجرة النبوية', d:'هاجر ﷺ إلى المدينة المنورة، فأسست الهجرة لأول مجتمع إسلامي، ومنها بدأ التاريخ الهجري.'},
  {t:'⚔️ غزوة بدر الكبرى', d:'أول معركة فاصلة في الإسلام؛ نصر الله فيها المؤمنين رغم قلة العدد والعُدد.'},
  {t:'🕊️ فتح مكة', d:'دخل ﷺ مكة عافيًا صافحًا وقال كلمته الخالدة: «اذهبوا فأنتم الطلقاء».'},
  {t:'🌄 حجة الوداع', d:'خطب ﷺ في الناس خطبة الوداع: بلّغ الرسالة، وأدّى الأمانة، وتركهم على المحجة البيضاء.'},
  {t:'🌙 الوفاة', d:'توفي ﷺ في المدينة المنورة عن ثلاثة وستين عامًا، بعدما تمّ الدين واكتملت النعمة.'}
];
document.getElementById('deenSeerah').innerHTML = SEERAH.map(function(x){
  return '<div class="dua-card" style="margin-bottom:14px"><div style="font-weight:900;color:var(--gold2);margin-bottom:6px">'+x.t+'</div><div style="font-size:.92rem;line-height:1.9">'+x.d+'</div></div>';
}).join('');
document.querySelectorAll('#deenTabs .tab').forEach(function(t){
  t.addEventListener('click', function(){
    document.querySelectorAll('#deenTabs .tab').forEach(function(x){ x.classList.remove('active'); });
    t.classList.add('active');
    const m = {adhkar:'deenAdhkar', duas:'deenDuas', quran:'deenQuran', seerah:'deenSeerah'};
    Object.keys(m).forEach(function(k){
      document.getElementById(m[k]).style.display = (k === t.dataset.deen) ? '' : 'none';
    });
  });
});

/* ================= v6: lesson levels as tabs (مفيش حاجة تحت بعض) ================= */
document.querySelectorAll('#lessons .lang-panel').forEach(function(panel){
  const groups = [];
  let curG = null;
  Array.from(panel.children).forEach(function(el){
    if(el.classList && el.classList.contains('level-head')){
      curG = {label: el.querySelector('.pill') ? el.querySelector('.pill').textContent.trim() : 'مستوى', holder: document.createElement('div')};
      groups.push(curG);
    } else if(curG){
      curG.holder.appendChild(el);
    }
  });
  if(groups.length < 2) return;
  const tabs = document.createElement('div');
  tabs.className = 'tabs lvl-tabs';
  groups.forEach(function(g, i){
    g.holder.style.display = i === 0 ? '' : 'none';
    const b = document.createElement('button');
    b.className = 'tab' + (i === 0 ? ' active' : '');
    const LVL_COST = [0, 150, 400];
    const lvlKey = 'lingua_lvl_' + (panel.id || 'p') + '_' + i;
    const lvlOpen = function(){ if(i === 0) return true; try { return localStorage.getItem(lvlKey) === '1'; } catch(e){ return true; } };
    const paint = function(){ b.textContent = g.label + (lvlOpen() ? '' : ' 🔒 ' + LVL_COST[i]); };
    paint();
    b.addEventListener('click', function(){
      if(!lvlOpen()){
        const cost = LVL_COST[i] || 0;
        if(spendPoints(cost)){
          try { localStorage.setItem(lvlKey, '1'); } catch(e){}
          paint();
          confetti();
          toast('اتفتح ' + g.label + '! 🔓✨');
        } else {
          toast('محتاجة ' + cost + ' نقطة عشان تفتحي ' + g.label + ' — العبي واكسبي نقاط 🔒');
          return;
        }
      }
      tabs.querySelectorAll('.tab').forEach(function(x){ x.classList.remove('active'); });
      b.classList.add('active');
      groups.forEach(function(gg, j){ gg.holder.style.display = j === i ? '' : 'none'; });
    });
    tabs.appendChild(b);
  });
  panel.innerHTML = '';
  panel.appendChild(tabs);
  groups.forEach(function(g){ panel.appendChild(g.holder); });
});

/* ================= v6: UI language ================= */
const UI_PAIRS = [
  ['👑 حسابي','👑 My Account'],['الدروس','Lessons'],['الاختبارات','Quizzes'],['الألعاب','Games'],
  ['تدريب النطق','Speaking'],['القاموس','Dictionary'],['📸 بالصور','📸 Photos'],['🧠 ذكاء','🧠 Brain'],
  ['💬 الكلام','💬 Wall'],['🕌 روحانيات','🕌 Spirit'],['🎵 أغاني','🎵 Songs'],['🎬 سينما','🎬 Cinema'],
  ['ركن كارما 👑','Karma 👑'],['الفيديوهات','Videos'],['🛍️ المتجر','🛍️ Shop'],['👯 أصحابي','👯 Friends'],
  ['🎮 العاب','🎮 Games'],['👚 تنسيق لبس','👚 Stylist'],['⚙️ هندسة','⚙️ Engineering'],['🌐 اللغة','🌐 Language'],
  ['✦ كلمات اليوم ✦','✦ Words of the Day ✦'],['لماذا Lingua؟','Why Lingua?'],['✦ لوحة إنجازك ✦','✦ Your Dashboard ✦'],
  ['✦ أقسام اللغات ✦','✦ Language Corners ✦'],['اختاري لغتك','Choose Your Language'],['✦ الدروس ✦','✦ Lessons ✦'],
  ['✦ الاختبارات ✦','✦ Quizzes ✦'],['✦ الألعاب ✦','✦ Games ✦'],['✦ القاموس ✦','✦ Dictionary ✦'],
  ['✦ تعلّمي بالصور ✦','✦ Learn with Photos ✦'],['✦ سينما لينجوا ✦','✦ Lingua Cinema ✦'],['✦ ركن الروح ✦','✦ Soul Corner ✦'],
  ['✦ كل حاجة في مكانها ✦','✦ Everything in Its Place ✦'],['✦ متجر النقاط ✦','✦ Points Shop ✦'],
  ['✦ أصحابي ✦','✦ My Friends ✦'],['✦ ألعاب حلوة ✦','✦ Fun Games ✦'],['✦ منسّقة اللبس ✦','✦ Outfit Stylist ✦'],
  ['✦ كورسات كلية الهندسة ✦','✦ Engineering Courses ✦'],['✦ لغة التطبيق ✦','✦ App Language ✦']
];
function uiSwap(txt, toEn){
  for(const pr of UI_PAIRS){
    if(txt === (toEn ? pr[0] : pr[1])) return toEn ? pr[1] : pr[0];
  }
  return null;
}
function applyUILang(l){
  try { localStorage.setItem('lingua_uilang', l); } catch(e){}
  const toEn = l === 'en';
  document.querySelectorAll('#uiTabs .tab').forEach(function(x){ x.classList.toggle('active', x.dataset.ui === l); });
  document.querySelectorAll('#topNav a .tl').forEach(function(a){
    const r = uiSwap(a.textContent.trim(), toEn);
    if(r !== null) a.textContent = r;
  });
  document.querySelectorAll('h2.sec-title').forEach(function(h){
    const r = uiSwap(h.textContent.trim(), toEn);
    if(r !== null) h.textContent = r;
  });
  document.querySelectorAll('#menuGrid .m-name').forEach(function(m){
    MENU.forEach(function(mm){
      if(m.textContent.trim() === mm[2]) m.textContent = toEn ? mm[0] : mm[2];
    });
  });
  document.documentElement.dir = toEn ? 'ltr' : 'rtl';
}
document.querySelectorAll('#uiTabs .tab').forEach(function(t){
  t.addEventListener('click', function(){ applyUILang(t.dataset.ui); });
});
try {
  const savedUi = localStorage.getItem('lingua_uilang');
  if(savedUi === 'en') applyUILang('en');
} catch(e){}

window.renderShop();
window.renderBadges();
checkBadges();
try { window.refreshDash(); } catch(e){}


/* ================= v7: dress-up studio ================= */
(function(){
const DU_BODY =
  '<ellipse cx="110" cy="54" rx="23" ry="26" fill="#f0c090"/>' +
  '<rect x="103" y="76" width="14" height="14" fill="#f0c090"/>' +
  '<path d="M90,92 Q110,84 130,92 L134,152 Q134,160 126,160 L94,160 Q86,160 86,152 Z" fill="#f0c090"/>' +
  '<line x1="90" y1="96" x2="74" y2="168" stroke="#f0c090" stroke-width="12" stroke-linecap="round"/>' +
  '<line x1="130" y1="96" x2="146" y2="168" stroke="#f0c090" stroke-width="12" stroke-linecap="round"/>' +
  '<circle cx="74" cy="170" r="7" fill="#f0c090"/><circle cx="146" cy="170" r="7" fill="#f0c090"/>' +
  '<line x1="100" y1="160" x2="97" y2="298" stroke="#f0c090" stroke-width="15" stroke-linecap="round"/>' +
  '<line x1="120" y1="160" x2="123" y2="298" stroke="#f0c090" stroke-width="15" stroke-linecap="round"/>';
const DU_FACE =
  '<circle cx="101" cy="52" r="2.6" fill="#3a2a22"/><circle cx="119" cy="52" r="2.6" fill="#3a2a22"/>' +
  '<path d="M96,45 Q101,42 106,45" stroke="#3a2a22" fill="none" stroke-width="1.6" stroke-linecap="round"/>' +
  '<path d="M114,45 Q119,42 124,45" stroke="#3a2a22" fill="none" stroke-width="1.6" stroke-linecap="round"/>' +
  '<path d="M104,64 Q110,69 116,64" stroke="#c2447a" fill="none" stroke-width="2.2" stroke-linecap="round"/>' +
  '<circle cx="94" cy="60" r="3.4" fill="#ff5d9e" opacity=".25"/><circle cx="126" cy="60" r="3.4" fill="#ff5d9e" opacity=".25"/>';
function fringe(c){
  return '<path d="M87,54 C88,32 132,32 133,54 C126,42 120,50 110,44 C100,50 94,42 87,54 Z" fill="'+c+'"/>';
}
const DU = {
  hair: [
    {n:{ar:'شعر طويل',en:'Long hair',fr:'Cheveux longs',de:'Lange Haare',zh:'长发'}, back:function(c){ return '<path d="M110,26 C82,26 76,52 78,84 C80,112 72,146 76,182 L144,182 C148,146 140,112 142,84 C144,52 138,26 110,26 Z" fill="'+c+'"/>'; }, front:fringe},
    {n:{ar:'ذيل حصان',en:'Ponytail',fr:'Queue de cheval',de:'Pferdeschwanz',zh:'马尾'}, back:function(c){ return '<path d="M110,26 C86,26 78,48 80,76 C82,96 78,116 82,132 L138,132 C142,116 138,96 140,76 C142,48 134,26 110,26 Z" fill="'+c+'"/><path d="M138,58 C160,68 164,112 152,146 C166,124 170,76 148,52 Z" fill="'+c+'"/>'; }, front:fringe},
    {n:{ar:'كعكة',en:'Bun',fr:'Chignon',de:'Dutt',zh:'发髻'}, back:function(c){ return '<path d="M110,26 C86,26 78,48 80,74 C82,94 80,104 84,110 L136,110 C140,104 138,94 140,74 C142,48 134,26 110,26 Z" fill="'+c+'"/><circle cx="110" cy="20" r="14" fill="'+c+'"/>'; }, front:fringe},
    {n:{ar:'قصير',en:'Bob cut',fr:'Carré',de:'Bob',zh:'短发'}, back:function(c){ return '<path d="M110,26 C84,26 76,50 78,76 C80,96 78,104 82,110 L138,110 C142,104 140,96 142,76 C144,50 136,26 110,26 Z" fill="'+c+'"/>'; }, front:fringe}
  ],
  top: [
    {n:{ar:'تيشيرت',en:'T-shirt',fr:'T-shirt',de:'T-Shirt',zh:'T恤'}, ico:'👕', svg:function(c){ return '<path d="M90,92 L72,102 L78,122 L88,116 L86,152 Q86,160 94,160 L126,160 Q134,160 134,152 L132,116 L142,122 L148,102 L130,92 Q110,86 90,92 Z" fill="'+c+'"/><path d="M100,90 Q110,96 120,90 L118,96 Q110,101 102,96 Z" fill="#ffffff" opacity=".85"/>'; }},
    {n:{ar:'بلوزة',en:'Blouse',fr:'Chemisier',de:'Bluse',zh:'女衬衫'}, ico:'👚', svg:function(c){ return '<path d="M90,92 Q110,86 130,92 L134,152 Q134,160 126,160 L94,160 Q86,160 86,152 Z" fill="'+c+'"/><path d="M104,88 L110,98 L116,88 L110,92 Z" fill="#ffffff"/><circle cx="110" cy="110" r="2" fill="#ffffff"/><circle cx="110" cy="124" r="2" fill="#ffffff"/><circle cx="110" cy="138" r="2" fill="#ffffff"/>'; }},
    {n:{ar:'كروب توب',en:'Crop top',fr:'Crop top',de:'Crop-Top',zh:'露脐上衣'}, ico:'🎽', svg:function(c){ return '<path d="M88,92 L74,104 L80,120 L88,116 L87,132 L133,132 L132,116 L140,120 L146,104 L132,92 Q110,86 88,92 Z" fill="'+c+'"/>'; }},
    {n:{ar:'هودي',en:'Hoodie',fr:'Sweat à capuche',de:'Hoodie',zh:'连帽衫'}, ico:'🧥', svg:function(c){ return '<path d="M88,92 L72,104 L78,124 L87,118 L85,152 Q85,162 94,162 L126,162 Q135,162 135,152 L133,118 L142,124 L148,104 L132,92 Q110,84 88,92 Z" fill="'+c+'"/><path d="M96,90 Q110,80 124,90 Q118,98 110,98 Q102,98 96,90 Z" fill="'+c+'" stroke="#00000033" stroke-width="1.5"/><rect x="98" y="136" width="24" height="16" rx="6" fill="#00000022"/>'; }}
  ],
  bottom: [
    {n:{ar:'جيبة',en:'Skirt',fr:'Jupe',de:'Rock',zh:'短裙'}, ico:'👗', svg:function(c){ return '<path d="M86,152 L134,152 L152,226 Q110,238 68,226 Z" fill="'+c+'"/><path d="M98,160 L96,222 M110,160 L110,226 M122,160 L124,222" stroke="#00000022" stroke-width="2"/>'; }},
    {n:{ar:'بنطلون',en:'Pants',fr:'Pantalon',de:'Hose',zh:'裤子'}, ico:'👖', svg:function(c){ return '<path d="M88,152 L132,152 L130,296 L114,296 L112,192 L108,192 L106,296 L90,296 Z" fill="'+c+'"/>'; }},
    {n:{ar:'شورت',en:'Shorts',fr:'Short',de:'Shorts',zh:'短裤'}, ico:'🩳', svg:function(c){ return '<path d="M88,152 L132,152 L130,198 L112,198 L110,180 L108,180 L106,198 L90,198 Z" fill="'+c+'"/>'; }},
    {n:{ar:'جيبة طويلة',en:'Maxi skirt',fr:'Jupe longue',de:'Maxirock',zh:'长裙'}, ico:'💃', svg:function(c){ return '<path d="M86,152 L134,152 L146,292 Q110,302 74,292 Z" fill="'+c+'"/><path d="M98,160 L92,288 M110,160 L110,292 M122,160 L128,288" stroke="#00000022" stroke-width="2"/>'; }}
  ],
  dress: [
    {n:{ar:'فستان كاجوال',en:'Casual dress',fr:'Robe casual',de:'Kleid',zh:'连衣裙'}, ico:'👗', svg:function(c){ return '<path d="M90,92 L74,104 L80,120 L88,116 L84,150 L74,238 Q110,252 146,238 L136,150 L132,116 L140,120 L146,104 L130,92 Q110,86 90,92 Z" fill="'+c+'"/><rect x="88" y="146" width="44" height="8" rx="4" fill="#d4af37"/>'; }},
    {n:{ar:'فستان سواريه',en:'Gown',fr:'Robe de soirée',de:'Abendkleid',zh:'晚礼服'}, ico:'✨', svg:function(c){ return '<path d="M92,92 Q110,86 128,92 L132,150 L148,296 Q110,310 72,296 L88,150 Z" fill="'+c+'"/><path d="M100,180 l3,7 7,1 -5,5 1,7 -6,-3 -6,3 1,-7 -5,-5 7,-1 Z" fill="#ffe9a3"/><path d="M122,220 l2.4,5.5 5.5,0.8 -4,4 0.8,5.5 -4.7,-2.4 -4.7,2.4 0.8,-5.5 -4,-4 5.5,-0.8 Z" fill="#ffe9a3"/><path d="M104,256 l2,4.5 4.5,0.7 -3.3,3.2 0.7,4.5 -3.9,-2 -3.9,2 0.7,-4.5 -3.3,-3.2 4.5,-0.7 Z" fill="#ffe9a3"/><path d="M92,92 Q110,86 128,92 L126,104 Q110,98 94,104 Z" fill="#ffffff" opacity=".3"/>'; }},
    {n:{ar:'فستان صيفي',en:'Sundress',fr:'Robe d\u2019été',de:'Sommerkleid',zh:'夏装裙'}, ico:'🌸', svg:function(c){ return '<path d="M96,92 L124,92 L134,150 L146,236 Q110,250 74,236 L86,150 Z" fill="'+c+'"/><line x1="98" y1="92" x2="98" y2="84" stroke="'+c+'" stroke-width="4"/><line x1="122" y1="92" x2="122" y2="84" stroke="'+c+'" stroke-width="4"/><circle cx="100" cy="190" r="4" fill="#ffffff66"/><circle cx="122" cy="205" r="4" fill="#ffffff66"/><circle cx="106" cy="222" r="4" fill="#ffffff66"/>'; }}
  ],
  shoes: [
    {n:{ar:'كوتشي',en:'Sneakers',fr:'Baskets',de:'Sneaker',zh:'运动鞋'}, ico:'👟', svg:function(c){ return '<rect x="84" y="290" width="28" height="16" rx="8" fill="'+c+'"/><rect x="84" y="300" width="28" height="8" rx="4" fill="#ffffff"/><rect x="108" y="290" width="28" height="16" rx="8" fill="'+c+'"/><rect x="108" y="300" width="28" height="8" rx="4" fill="#ffffff"/>'; }},
    {n:{ar:'كعب عالي',en:'Heels',fr:'Talons',de:'Absatz',zh:'高跟鞋'}, ico:'👠', svg:function(c){ return '<path d="M86,292 L110,292 L110,304 L100,304 L98,314 L93,314 L94,304 L86,304 Z" fill="'+c+'"/><path d="M110,292 L134,292 L134,304 L124,304 L122,314 L117,314 L118,304 L110,304 Z" fill="'+c+'"/>'; }},
    {n:{ar:'بوت',en:'Boots',fr:'Bottes',de:'Stiefel',zh:'靴子'}, ico:'🥾', svg:function(c){ return '<rect x="86" y="260" width="26" height="46" rx="8" fill="'+c+'"/><rect x="108" y="260" width="26" height="46" rx="8" fill="'+c+'"/><rect x="86" y="260" width="26" height="10" rx="5" fill="#00000033"/><rect x="108" y="260" width="26" height="10" rx="5" fill="#00000033"/>'; }}
  ],
  bag: [
    {n:{ar:'شنطة يد',en:'Handbag',fr:'Sac à main',de:'Handtasche',zh:'手提包'}, ico:'👜', svg:function(c){ return '<rect x="132" y="168" width="34" height="26" rx="8" fill="'+c+'"/><path d="M140,170 Q149,152 158,170" stroke="'+c+'" fill="none" stroke-width="4"/><rect x="145" y="178" width="8" height="6" rx="2" fill="#d4af37"/>'; }},
    {n:{ar:'شنطة ظهر',en:'Backpack',fr:'Sac à dos',de:'Rucksack',zh:'背包'}, ico:'🎒', svg:function(c){ return '<rect x="52" y="104" width="32" height="44" rx="10" fill="'+c+'"/><rect x="60" y="122" width="16" height="14" rx="5" fill="#00000022"/>'; }},
    {n:{ar:'كلاتش',en:'Clutch',fr:'Pochette',de:'Clutch',zh:'手拿包'}, ico:'👛', svg:function(c){ return '<rect x="56" y="168" width="30" height="16" rx="7" fill="'+c+'"/><circle cx="71" cy="176" r="3" fill="#d4af37"/>'; }}
  ],
  acc: [
    {n:{ar:'نضارة',en:'Glasses',fr:'Lunettes',de:'Brille',zh:'眼镜'}, ico:'👓', svg:function(c){ return '<circle cx="100" cy="52" r="8.5" fill="none" stroke="'+c+'" stroke-width="2.6"/><circle cx="120" cy="52" r="8.5" fill="none" stroke="'+c+'" stroke-width="2.6"/><line x1="108.5" y1="52" x2="111.5" y2="52" stroke="'+c+'" stroke-width="2.6"/>'; }},
    {n:{ar:'فيونكة',en:'Bow',fr:'Nœud',de:'Schleife',zh:'蝴蝶结'}, ico:'🎀', svg:function(c){ return '<polygon points="132,26 146,18 146,34" fill="'+c+'"/><polygon points="132,26 118,18 118,34" fill="'+c+'"/><circle cx="132" cy="26" r="4.5" fill="'+c+'"/>'; }},
    {n:{ar:'كاب',en:'Cap',fr:'Casquette',de:'Kappe',zh:'帽子'}, ico:'🧢', svg:function(c){ return '<path d="M86,42 Q110,14 134,42 Z" fill="'+c+'"/><ellipse cx="110" cy="42" rx="34" ry="6" fill="'+c+'"/>'; }}
  ]
};
const DU_CATS = [
  {id:'hair', ico:'💇‍♀️', ar:'الشعر'}, {id:'top', ico:'👚', ar:'التوب'}, {id:'bottom', ico:'👖', ar:'البنطلون'},
  {id:'dress', ico:'👗', ar:'الفستان'}, {id:'shoes', ico:'👟', ar:'الجزمة'}, {id:'bag', ico:'👜', ar:'الشنطة'}, {id:'acc', ico:'🎀', ar:'إكسسوار'}
];
const DU_COLORS = ['#e85d9e','#d4af37','#22b8cf','#34d399','#9d7bff','#ff7a3d','#e11d48','#ffffff','#3b2a20','#111111','#8b5a2b','#f5e0c8'];
const DU_HAIRCOLORS = ['#3b2a20','#8b5a2b','#d9a066','#f5e0c8','#e11d48','#111111','#9d7bff','#e85d9e'];
let duLook = {hair:0, hairC:'#3b2a20', top:0, topC:'#e85d9e', bottom:0, bottomC:'#1e2a5a', dress:-1, dressC:'#d4af37', shoes:0, shoesC:'#ffffff', bag:-1, bagC:'#8b5a2b', acc:-1, accC:'#e11d48'};
let duCat = 'top', duLang = 'en';
const duTried = new Set();
try {
  const sv = JSON.parse(localStorage.getItem('lingua_dress_saved') || 'null');
  if(sv && typeof sv === 'object') duLook = Object.assign(duLook, sv);
} catch(e){}
function duItemName(cat, i){ return DU[cat][i].n[duLang] || DU[cat][i].n.en; }
window.duDollSvg = function(look, maxw){
  let x = '<svg viewBox="0 0 220 330" style="width:100%;max-width:'+(maxw||290)+'px;display:block;margin:0 auto">';
  x += DU.hair[look.hair].back(look.hairC);
  x += DU_BODY;
  x += DU.shoes[look.shoes].svg(look.shoesC);
  if(look.dress >= 0){ x += DU.dress[look.dress].svg(look.dressC); }
  else { x += DU.bottom[look.bottom].svg(look.bottomC); x += DU.top[look.top].svg(look.topC); }
  if(look.bag >= 0) x += DU.bag[look.bag].svg(look.bagC);
  x += DU_FACE;
  x += DU.hair[look.hair].front(look.hairC);
  if(look.acc >= 0) x += DU.acc[look.acc].svg(look.accC);
  x += '</svg>';
  return x;
};
function duRender(){
  document.getElementById('duDoll').innerHTML = window.duDollSvg(duLook, 290);
}
function duRenderCats(){
  document.getElementById('duCats').innerHTML = DU_CATS.map(function(c){
    return '<button class="du-cat'+(c.id===duCat?' active':'')+'" data-cat="'+c.id+'" title="'+c.ar+'">'+c.ico+'</button>';
  }).join('');
  document.querySelectorAll('#duCats .du-cat').forEach(function(b){
    b.addEventListener('click', function(){ duCat = b.dataset.cat; duRenderCats(); duRenderItems(); duRenderColors(); });
  });
}
function duRenderItems(){
  const items = DU[duCat];
  const curKey = duCat;
  document.getElementById('duItems').innerHTML =
    '<button class="du-item'+(duLook[curKey] < 0 ? ' active':'')+'" data-i="-1"><span class="di-ico">🚫</span><span class="di-n">من غير</span></button>' +
    items.map(function(it, i){
      return '<button class="du-item'+(duLook[curKey]===i?' active':'')+'" data-i="'+i+'"><span class="di-ico">'+(it.ico||'✨')+'</span><span class="di-n">'+it.n.ar+'</span></button>';
    }).join('');
  document.querySelectorAll('#duItems .du-item').forEach(function(b){
    b.addEventListener('click', function(){
      const i = parseInt(b.dataset.i, 10);
      if(duCat === 'dress' && i >= 0){ duLook.dress = i; }
      else {
        duLook[duCat] = i;
        if((duCat === 'top' || duCat === 'bottom') && i >= 0) duLook.dress = -1;
      }
      const key = duCat + ':' + i;
      if(i >= 0 && !duTried.has(key)){ duTried.add(key); awardPoints(3, 'قطعة جديدة 👗'); }
      sndGood();
      duRenderItems(); duRender();
    });
  });
}
function duRenderColors(){
  const cols = duCat === 'hair' ? DU_HAIRCOLORS : DU_COLORS;
  document.getElementById('duColors').innerHTML = cols.map(function(c){
    return '<button class="du-col" data-c="'+c+'" style="background:'+c+'" title="'+c+'"></button>';
  }).join('');
  document.querySelectorAll('#duColors .du-col').forEach(function(b){
    b.addEventListener('click', function(){
      duLook[duCat === 'hair' ? 'hairC' : duCat + 'C'] = b.dataset.c;
      sndGood();
      duRender();
    });
  });
}
document.getElementById('duRandom').addEventListener('click', function(){
  const r = function(n){ return Math.floor(Math.random()*n); };
  const rc = function(a){ return a[r(a.length)]; };
  duLook.hair = r(DU.hair.length); duLook.hairC = rc(DU_HAIRCOLORS);
  duLook.shoes = r(DU.shoes.length); duLook.shoesC = rc(DU_COLORS);
  if(Math.random() < 0.5){ duLook.dress = r(DU.dress.length); duLook.dressC = rc(DU_COLORS); }
  else { duLook.dress = -1; duLook.top = r(DU.top.length); duLook.topC = rc(DU_COLORS); duLook.bottom = r(DU.bottom.length); duLook.bottomC = rc(DU_COLORS); }
  duLook.bag = Math.random() < 0.6 ? r(DU.bag.length) : -1; duLook.bagC = rc(DU_COLORS);
  duLook.acc = Math.random() < 0.5 ? r(DU.acc.length) : -1; duLook.accC = rc(DU_COLORS);
  duRenderItems(); duRender(); confetti(); sndGood();
});
document.getElementById('duSave').addEventListener('click', function(){
  try { localStorage.setItem('lingua_dress_saved', JSON.stringify(duLook)); } catch(e){}
  awardPoints(25, 'لوك محفوظ 💾');
  confetti();
  toast('اللوك اتحفظ! هرجعلك ياه تاني ما تفتحي الستوديو 💾✨');
});
document.getElementById('duSpeak').addEventListener('click', function(){
  const i = duLook[duCat];
  if(i < 0){ toast('اختاري قطعة الأول 👗'); return; }
  speakText(duItemName(duCat, i), duLang);
});
document.querySelectorAll('#dressLangTabs .tab').forEach(function(t){
  t.addEventListener('click', function(){
    document.querySelectorAll('#dressLangTabs .tab').forEach(function(x){ x.classList.remove('active'); });
    t.classList.add('active');
    duLang = t.dataset.lang;
  });
});
duRenderCats(); duRenderItems(); duRenderColors(); duRender();
})();

/* ================= v7: illustrated scenes for fun games ================= */
window.FUN_SCENES = {
  cook: {
    bg: '<rect width="400" height="230" rx="18" fill="#241428"/>' +
      '<rect x="18" y="26" width="66" height="48" rx="8" fill="#5a3a4a"/><rect x="96" y="26" width="66" height="48" rx="8" fill="#5a3a4a"/>' +
      '<rect x="286" y="24" width="88" height="64" rx="8" fill="#0e2238" stroke="#6b4a5a" stroke-width="4"/><circle cx="346" cy="42" r="8" fill="#ffe9a3" opacity=".9"/>' +
      '<rect y="150" width="400" height="80" fill="#4a2c3a"/><rect y="146" width="400" height="8" fill="#6b4a5a"/>' +
      '<rect x="150" y="118" width="100" height="52" rx="12" fill="#8a8f98"/><rect x="142" y="112" width="116" height="10" rx="5" fill="#aab0ba"/>' +
      '<circle cx="140" cy="144" r="6" fill="#aab0ba"/><circle cx="260" cy="144" r="6" fill="#aab0ba"/>' +
      '<path d="M185,104 q4,-10 0,-18 M205,104 q-4,-10 0,-18 M225,104 q4,-10 0,-18" stroke="#ffffff" stroke-width="3" fill="none" opacity=".35"/>',
    slots: [[168,150],[196,150],[224,150],[252,150],[168,166],[196,166],[224,166],[252,166]]
  },
  house: {
    bg: '<rect width="400" height="230" rx="18" fill="#2c2140"/>' +
      '<rect y="150" width="400" height="80" fill="#54403a"/>' +
      '<rect x="30" y="30" width="90" height="80" rx="8" fill="#0e2238" stroke="#7a5a4a" stroke-width="5"/><line x1="75" y1="30" x2="75" y2="110" stroke="#7a5a4a" stroke-width="4"/><line x1="30" y1="70" x2="120" y2="70" stroke="#7a5a4a" stroke-width="4"/>' +
      '<rect x="24" y="22" width="102" height="10" rx="5" fill="#8b5a6b"/><rect x="24" y="22" width="14" height="96" rx="6" fill="#8b5a6b"/><rect x="112" y="22" width="14" height="96" rx="6" fill="#8b5a6b"/>' +
      '<circle cx="330" cy="50" r="16" fill="#ffe9a3" opacity=".85"/><rect x="328" y="66" width="4" height="24" fill="#8a8f98"/>',
    slots: [[80,195],[160,195],[240,195],[320,195],[80,220],[160,220],[240,220],[320,220]]
  },
  football: {
    bg: '<rect width="400" height="230" rx="18" fill="#17703a"/>' +
      '<rect x="0" y="20" width="400" height="38" fill="#1c8044"/><rect x="0" y="96" width="400" height="38" fill="#1c8044"/><rect x="0" y="172" width="400" height="38" fill="#1c8044"/>' +
      '<line x1="200" y1="0" x2="200" y2="230" stroke="#ffffff" stroke-width="3" opacity=".8"/><circle cx="200" cy="115" r="34" fill="none" stroke="#ffffff" stroke-width="3" opacity=".8"/>' +
      '<rect x="150" y="6" width="100" height="36" fill="none" stroke="#ffffff" stroke-width="4"/>' +
      '<text x="200" y="34" font-size="24" text-anchor="middle">🧤</text>',
    slots: [[50,210],[95,210],[140,210],[185,210],[230,210],[275,210],[320,210],[362,210]]
  }
};
function funStageDraw(){
  const SC = window.FUN_SCENES;
  if(!SC){ funStageDrawOrig(); return; }
  const sc = SC[funGame] || SC.cook;
  let x = '<svg viewBox="0 0 400 230" style="width:100%;display:block">' + sc.bg;
  funGot.forEach(function(e, i){
    const sl = sc.slots[i];
    if(sl) x += '<text x="'+sl[0]+'" y="'+sl[1]+'" font-size="26" text-anchor="middle">'+e+'</text>';
  });
  x += '</svg>';
  document.getElementById('funStage').innerHTML = x;
}

/* ================= v7: visual outfit combos ================= */
function duShift(c, dh, dl){
  let r=c.r/255, g=c.g/255, b=c.b/255;
  const mx=Math.max(r,g,b), mn=Math.min(r,g,b); let h=0;
  const d=mx-mn, l=(mx+mn)/2;
  if(d>0){
    if(mx===r) h=((g-b)/d)%6; else if(mx===g) h=(b-r)/d+2; else h=(r-g)/d+4;
    h*=60; if(h<0) h+=360;
  }
  const s = d===0 ? 0 : d/(1-Math.abs(2*l-1));
  h = (h+dh+360)%360;
  const l2 = Math.min(0.9, Math.max(0.12, l+(dl||0)));
  const c2 = (1-Math.abs(2*l2-1))*s, x2 = c2*(1-Math.abs(((h/60)%2)-1)), m = l2-c2/2;
  let rr=0, gg=0, bb=0;
  if(h<60){rr=c2;gg=x2;} else if(h<120){rr=x2;gg=c2;} else if(h<180){gg=c2;bb=x2;}
  else if(h<240){gg=x2;bb=c2;} else if(h<300){rr=x2;bb=c2;} else {rr=c2;bb=x2;}
  return 'rgb('+Math.round((rr+m)*255)+','+Math.round((gg+m)*255)+','+Math.round((bb+m)*255)+')';
}
function outfitCombos(cols){
  if(!window.duDollSvg || !cols || !cols.length) return '';
  const main = cols[0], mainRgb = 'rgb('+main.r+','+main.g+','+main.b+')';
  const light = (main.r+main.g+main.b)/3 > 140;
  const neutral = light ? '#1e2a5a' : '#f5f0e6';
  const accent = duShift(main, 150, 0.05);
  const look1 = {hair:1, hairC:'#3b2a20', top:0, topC:mainRgb, bottom:1, bottomC:neutral, dress:-1, shoes:0, shoesC:accent, bag:-1, bagC:'#8b5a2b', acc:-1, accC:'#e11d48'};
  const look2 = {hair:0, hairC:'#8b5a2b', top:0, topC:'#fff', bottom:0, bottomC:'#000', dress:0, dressC:mainRgb, shoes:1, shoesC:neutral, bag:0, bagC:accent, acc:-1, accC:'#e11d48'};
  return '<div style="text-align:center;font-weight:900;margin-top:16px">👗 لوكات مقترحة بنفس ألوانك:</div>' +
    '<div style="display:flex;gap:14px;justify-content:center;flex-wrap:wrap;margin-top:10px">' +
    '<div style="background:var(--card2);border:1px solid rgba(var(--goldA),.3);border-radius:20px;padding:12px;width:170px">' + window.duDollSvg(look1, 150) + '<div style="text-align:center;font-size:.8rem;font-weight:800;margin-top:6px">لوك كاجوال 👕</div></div>' +
    '<div style="background:var(--card2);border:1px solid rgba(var(--goldA),.3);border-radius:20px;padding:12px;width:170px">' + window.duDollSvg(look2, 150) + '<div style="text-align:center;font-size:.8rem;font-weight:800;margin-top:6px">لوك فستان 👗</div></div>' +
    '</div>';
}

/* ================= v7: quran audio + whatsapp invite ================= */
(function(){
  const Q = document.getElementById('deenQuran');
  if(!Q) return;
  Q.querySelectorAll('.surah-card, .dua-card').forEach(function(card, i){
    const QN = [1,112,113,114,108,103];
    const n = QN[i] || 1;
    const a = document.createElement('audio');
    a.controls = true; a.preload = 'none';
    a.style.cssText = 'width:100%;margin-top:10px;height:36px';
    a.src = 'https://download.quranicaudio.com/quran/mishaari_raashid_al_3afaasee/' + ('00' + n).slice(-3) + '.mp3';
    card.appendChild(a);
  });
})();
(function(){
  const btn = document.getElementById('friendAdd');
  if(!btn) return;
  const w = document.createElement('button');
  w.className = 'btn';
  w.style.cssText = 'background:linear-gradient(120deg,#25D366,#128C7E);color:#fff;margin-inline-start:10px';
  w.textContent = '💌 دعوة واتساب';
  w.addEventListener('click', function(){
    const msg = 'تعالي العبي واتعلمي معايا على Lingua 🌍✨ ألعاب ودروس ونقاط وهدايا — ادخلي من هنا: https://lingua-karma.github.io';
    window.open('https://wa.me/?text=' + encodeURIComponent(msg), '_blank');
  });
  btn.parentNode.appendChild(w);
})();
(function(){
  const st = document.getElementById('funStudioBtn');
  if(st) st.addEventListener('click', function(){ location.hash = 'dressup'; });
})();


/* ================= v7b: direct-audio music player ================= */
const MUSIC = {
  ar: [
    {t:'Tamly Maak', a:'عمرو دياب — Amr Diab', u:'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/5e/df/09/5edf0981-ce52-4740-f0b2-f6ad0760afcb/mzaf_17144740537777531434.plus.aac.p.m4a'},
    {t:'Noor Al Ain', a:'عمرو دياب — Amr Diab', u:'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/ae/19/51/ae1951e7-fb94-f734-d68f-8a5955c8c6d9/mzaf_14930287996363580653.plus.aac.p.m4a'},
    {t:'Qusad Einy', a:'عمرو دياب — Amr Diab', u:'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/fc/5e/58/fc5e5864-62e5-caac-5c58-42a8ec1ad5a6/mzaf_2189674438371045214.plus.aac.p.m4a'},
    {t:'Ya Bent El Eh', a:'تامر حسني — Tamer Hosny', u:'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/bb/a9/4b/bba94bd9-020a-8eb9-c67e-1930dce68986/mzaf_11579290530808350749.plus.aac.p.m4a'},
    {t:'Ana Wala 3aref', a:'تامر حسني — Tamer Hosny', u:'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/2f/3b/76/2f3b7652-e838-313e-6060-10c54b88792b/mzaf_3866792037020058066.plus.aac.p.m4a'},
    {t:'Omry Ebtada', a:'تامر حسني — Tamer Hosny', u:'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview116/v4/b6/42/e6/b642e662-623d-8506-946a-5c09ff299128/mzaf_839726446197364456.plus.aac.p.m4a'},
    {t:'Inta Eyh', a:'نانسي عجرم — Nancy Ajram', u:'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/3c/c3/fd/3cc3fdbb-5dd2-19d4-517a-d427315872d5/mzaf_15059795685168259069.plus.aac.p.m4a'},
    {t:'Badna Nwalee El Jaw', a:'نانسي عجرم — Nancy Ajram', u:'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/fb/cc/18/fbcc1862-f862-cece-b3f4-210018770a93/mzaf_2451396044207308743.plus.aac.p.m4a'},
    {t:'Sah Sah', a:'نانسي عجرم ومارشميلو — Nancy Ajram & Marshmello', u:'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/86/14/67/86146728-11b4-31f4-c933-3cf023fcf8be/mzaf_16855856943488765109.plus.aac.p.m4a'},
    {t:'Wahdon', a:'فيروز — Fairouz', u:'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/8b/e5/02/8be502ea-7294-b1cf-df37-b2c65f64566e/mzaf_13229560357091027869.plus.aac.p.m4a'},
    {t:'Konna Netlaka', a:'فيروز — Fairouz', u:'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/bc/bc/6f/bcbc6f55-6554-5da8-d4cb-d22805e81533/mzaf_5046128595056838713.plus.aac.p.m4a'}
  ],
  en: [
    {t:'Someone Like You', a:'أديل — Adele', u:'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/08/22/2e/08222e25-43f5-20e6-a442-b8127ac83368/mzaf_1689070223363740216.plus.aac.p.m4a'},
    {t:'Set Fire to the Rain', a:'أديل — Adele', u:'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/96/8b/3f/968b3f92-f082-c8c2-47ba-ab7add22dfdc/mzaf_7388168289354543091.plus.aac.p.m4a'},
    {t:'Perfect', a:'إد شيران — Ed Sheeran', u:'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/c7/ba/bc/c7babc66-f598-aaa6-bcf6-307281795817/mzaf_16337361235117168274.plus.aac.p.m4a'},
    {t:'Thinking Out Loud', a:'إد شيران — Ed Sheeran', u:'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/78/a5/f2/78a5f25e-ad1b-718d-82ad-b82e676c1855/mzaf_6133970271589343093.plus.aac.p.m4a'},
    {t:'Yellow', a:'كولدبلاي — Coldplay', u:'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/66/f3/1a/66f31a76-a6ed-cb4c-f353-23310a7ae9a8/mzaf_10593596652344378873.plus.aac.p.m4a'},
    {t:'Viva La Vida', a:'كولدبلاي — Coldplay', u:'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/a3/30/8e/a3308eed-d8b7-e0b3-f09d-5e1b0f4d660a/mzaf_8517946447501075134.plus.aac.p.m4a'},
    {t:'Love Story (Taylor’s Version)', a:'تايلور سويفت — Taylor Swift', u:'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/8b/4c/b3/8b4cb3a5-b1d1-c82c-e6ab-48cc3969d4ff/mzaf_858711921713575608.plus.aac.p.m4a'},
    {t:'Love Story', a:'تايلور سويفت — Taylor Swift', u:'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/44/8a/a4/448aa432-42ae-8075-fe00-5f2deffe9896/mzaf_13232029737890307916.plus.aac.p.m4a'},
    {t:'WILDFLOWER', a:'بيلي آيلش — Billie Eilish', u:'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/de/c3/e8/dec3e884-7237-9622-718a-12c5f48c5ca2/mzaf_3134455671785145822.plus.aac.p.m4a'},
    {t:'ocean eyes', a:'بيلي آيلش — Billie Eilish', u:'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/d6/59/2b/d6592b0b-1e7e-4743-b2e4-f2af038fd783/mzaf_7697277787797935735.plus.aac.p.m4a'}
  ],
  zh: [
    {t:'屋頂', a:'لاندي وين وجاي تشو — Landy Wen & Jay Chou', u:'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/ed/9b/f9/ed9bf9bd-7475-bc6c-6be0-e02531097bd1/mzaf_4950304544004788100.plus.aac.p.m4a'},
    {t:'Only One', a:'جيم — G.E.M.', u:'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/80/c2/89/80c289dd-9bf6-3694-04f5-f68471a01cad/mzaf_3663263374343293987.plus.aac.p.m4a'},
    {t:'Light Years Away (Theme from Movie "Passengers")', a:'جيم — G.E.M.', u:'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/97/4f/e7/974fe739-8319-f45d-a4fa-34d77b1bec25/mzaf_2902864200094899486.plus.aac.p.m4a'},
    {t:'江南', a:'جي جي لين — JJ Lin', u:'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/0d/0a/1f/0d0a1f64-1faa-01a3-6b82-3f71c7f1ad53/mzaf_6171234305789252058.plus.aac.p.m4a'},
    {t:'她說', a:'جي جي لين — JJ Lin', u:'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/5a/d9/b5/5ad9b59a-d760-afb6-71d4-6e9614dbd18b/mzaf_2961581987529700790.plus.aac.p.m4a'},
    {t:'Qing Hua', a:'Steve Chou', u:'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/4f/5d/57/4f5d5792-b6c0-c3b9-25ce-c64a00d2204f/mzaf_8970370017745441566.plus.aac.p.m4a'},
    {t:'屋頂', a:'لاندي وين وجاي تشو — Landy Wen & Jay Chou', u:'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/ed/9b/f9/ed9bf9bd-7475-bc6c-6be0-e02531097bd1/mzaf_4950304544004788100.plus.aac.p.m4a'}
  ],
  de: [
    {t:'WAS HAST DU MIT MIR GEMACHT', a:'هيلين فيشر — Helene Fischer', u:'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/10/d8/a6/10d8a673-2caa-5f04-174b-763883ce7a97/mzaf_2650793103827232347.plus.aac.p.m4a'},
    {t:'Du hast', a:'رامشتاين — Rammstein', u:'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/5a/75/08/5a7508ee-f167-37aa-3b1a-7c63db8cb450/mzaf_11938743806268466326.plus.aac.p.m4a'},
    {t:'Sonne', a:'رامشتاين — Rammstein', u:'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/58/89/be/5889beee-3248-8e1f-bb77-98fb0dd7998b/mzaf_18321568262675482928.plus.aac.p.m4a'},
    {t:'194 Länder', a:'مارك فورستر — Mark Forster', u:'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/0e/51/c9/0e51c9e5-ef40-b9c7-9c00-71f0950225cd/mzaf_3181097715465972151.plus.aac.p.m4a'},
    {t:'Wir Sind Groß', a:'مارك فورستر — Mark Forster', u:'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/2c/7f/87/2c7f8782-dac5-64e7-d2c1-b2978da37d7b/mzaf_11501689619099005064.plus.aac.p.m4a'}
  ],
  ko: [
    {t:'Golden', a:'هانتر/إكس — KPop Demon Hunters', u:'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/4a/9d/a1/4a9da1c4-096f-8f45-4a3b-c883c45ca451/mzaf_3059921854949935161.plus.aac.p.m4a'},
    {t:'Soda Pop', a:'ساجا بويز — Saja Boys', u:'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/9c/77/47/9c77475f-bbd8-a691-d45e-b759a8a52912/mzaf_7746732510469093884.plus.aac.p.m4a'},
    {t:'Takedown', a:'هانتر/إكس — KPop Demon Hunters', u:'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/a5/d9/34/a5d934a9-289c-98e5-52be-53b5b517ffe7/mzaf_13830787768028450653.plus.aac.p.m4a'},
    {t:'Your Idol', a:'ساجا بويز — Saja Boys', u:'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/d8/e7/5e/d8e75ee4-b429-2425-f1b3-e8a5c2d4b204/mzaf_2625132553354081486.plus.aac.p.m4a'},
    {t:'Free', a:'رومي وجينو — Rumi & JINU', u:'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/b1/81/f7/b181f733-01ce-32ce-4844-a89be963c758/mzaf_1213739716850540710.plus.aac.p.m4a'},
    {t:'Strategy', a:'توايس — TWICE', u:'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/aa/cd/bb/aacdbbf5-894c-a547-1642-c6805422d877/mzaf_3671953991573159804.plus.aac.p.m4a'}
  ]
};
let musicLang = 'ar';
const musicAudio = new Audio();
let musicKey = '';
function renderMusic(){
  document.getElementById('musicList').innerHTML = MUSIC[musicLang].map(function(v, i){
    return '<div class="music-row" data-mi="' + i + '"><button class="m-play">▶</button><div class="m-info"><div class="m-t">' + v.t + '</div><div class="m-a">' + v.a + '</div></div><div class="m-eq"><span></span><span></span><span></span></div></div>';
  }).join('');
}
function musicStopAll(){
  document.querySelectorAll('.music-row.playing').forEach(function(r){
    r.classList.remove('playing');
    r.querySelector('.m-play').textContent = '▶';
  });
}
musicAudio.addEventListener('ended', function(){ musicStopAll(); musicKey = ''; });
document.querySelectorAll('#musicTabs .tab').forEach(function(t){
  t.addEventListener('click', function(){
    document.querySelectorAll('#musicTabs .tab').forEach(function(x){ x.classList.remove('active'); });
    t.classList.add('active');
    musicLang = t.dataset.music;
    musicAudio.pause(); musicStopAll(); musicKey = '';
    renderMusic();
  });
});
document.getElementById('musicList').addEventListener('click', function(e){
  const row = e.target.closest('.music-row');
  if(!row) return;
  const i = +row.dataset.mi;
  const key = musicLang + ':' + i;
  if(key === musicKey && !musicAudio.paused){
    musicAudio.pause();
    row.classList.remove('playing');
    row.querySelector('.m-play').textContent = '▶';
    return;
  }
  musicStopAll();
  musicAudio.src = MUSIC[musicLang][i].u;
  musicAudio.play().catch(function(){});
  row.classList.add('playing');
  row.querySelector('.m-play').textContent = '⏸';
  musicKey = key;
});
renderMusic();


/* ================= v7c: scholarships ================= */
const SCHOLARS = [
  {f:'🇩🇪', n:'DAAD — ألمانيا', fund:'تمويل كامل', r:'ماجستير ودكتوراه. الشروط: بكالوريوس بجدارة، إثبات لغة (IELTS/TOEFL أو ألماني)، وخطاب دوافع. التقديم أونلاين على موقع DAAD.', u:'https://www.daad.de/en/'},
  {f:'🇬🇧', n:'Chevening — بريطانيا', fund:'تمويل كامل', r:'ماجستير سنة واحدة في أي جامعة بريطانية. الشروط: بكالوريوس + خبرة عمل سنتين على الأقل + قيادة وطموح. بيفتح التقديم أغسطس من كل سنة.', u:'https://www.chevening.org/'},
  {f:'🇪🇺', n:'Erasmus Mundus — أوروبا', fund:'تمويل كامل', r:'ماجستير مشترك بتدريس في ٢-٣ دول أوروبية، وبيغطي المصاريف والسكن والطيران. الشروط: بكالوريوس + لغة إنجليزية قوية. اختاري البرنامج من الكتالوج وقدمي عليه مباشرة.', u:'https://erasmus-plus.ec.europa.eu/opportunities/opportunities-for-individuals/students/erasmus-mundus-joint-masters'},
  {f:'🇯🇵', n:'MEXT — اليابان', fund:'تمويل كامل', r:'بكالوريوس وماجستير ودكتوراه، مع مرتب شهري وتذاكر طيران. التقديم عن طريق السفارة اليابانية في القاهرة، وبيكون فيه امتحان ومقابلة.', u:'https://www.studyinjapan.go.jp/en/planning/scholarships/'},
  {f:'🇹🇷', n:'Türkiye Bursları — تركيا', fund:'تمويل كامل', r:'كل الدرجات (بكالوريوس/ماجستير/دكتوراه). تمويل كامل + سكن + مرتب + سنة لغة تركية. التقديم أونلاين مجانًا وبيفتح عادة أول السنة.', u:'https://www.turkiyeburslari.gov.tr/'},
  {f:'🇨🇳', n:'CSC — الصين', fund:'تمويل كامل', r:'منحة الحكومة الصينية لكل الدرجات. تمويل كامل + سكن + مرتب. التقديم على بوابة campuschina ومعاهد كونفوشيوس.', u:'https://www.campuschina.org/'},
  {f:'🇭🇺', n:'Stipendium Hungaricum — المجر', fund:'تمويل كامل', r:'كل الدرجات، ومصر من الدول المشاركة بعدد كبير من المقاعد. تمويل كامل + سكن + مرتب. التقديم أونلاين وبيفتح نوفمبر من كل سنة.', u:'https://stipendiumhungaricum.hu/'},
  {f:'🇺🇸', n:'Fulbright — أمريكا (لمصر)', fund:'تمويل كامل', r:'ماجستير ودكتوراه وأبحاث في أمريكا عن طريق الهيئة في القاهرة. الشروط: تفوق أكاديمي ولغة إنجليزية قوية.', u:'https://www.fulbright-egypt.org/'},
  {f:'🇮🇹', n:'منحة الحكومة الإيطالية — إيطاليا', fund:'تمويل كامل/جزئي', r:'ماجستير ودكتوراه وكورسات لغة. التقديم على بوابة Study in Italy، والشروط بتختلف حسب الجامعة.', u:'https://studyinitaly.esteri.it/'},
  {f:'🇪🇬', n:'AUC — الجامعة الأمريكية بالقاهرة', fund:'جزئي', r:'منح تفوق واحتياج مالي للبكالوريوس والدراسات العليا داخل مصر. قدمي من بوابة القبول وطلب المنحة.', u:'https://www.aucegypt.edu/admissions/scholarships'}
];
document.getElementById('schGrid').innerHTML = SCHOLARS.map(function(x){
  return '<a class="sch-card" href="' + x.u + '" target="_blank" rel="noopener">' +
    '<div class="sch-flag">' + x.f + '</div><div class="sch-name">' + x.n + '</div>' +
    '<span class="sch-fund' + (x.fund.indexOf('جزئي') > -1 ? ' partial' : '') + '">' + x.fund + '</span>' +
    '<div class="sch-req">' + x.r + '</div><span class="sch-go">الموقع الرسمي ↗</span></a>';
}).join('');


/* ================= v8: tips + guestbook ================= */
const TIPS = [
  {t:'١٥ دقيقة كل يوم أحسن من ٥ ساعات في الأسبوع', d:'المخ بيحفظ بالتكرار اليومي مش بالحشو. خلي اللغة عادة يومية زي غسل وشك — حتى لو ربع ساعة بس.'},
  {t:'اتعلمي بجمل مش كلمات', d:'بدل ما تحفظي "apple = تفاحة"، احفظي "I want an apple". الجملة بتعلمك الكلمة والقاعدة والنطق في نفس الوقت.'},
  {t:'غيري لغة موبايلك', d:'أقوى حيلة مجانية: خلي تليفونك باللغة اللي بتتعلميها. هتتعلمي مئات الكلمات من غير ما تحسي.'},
  {t:'اتفرجي على اللي بتحبيه باللغة دي', d:'كرتون الطفولة بترجمة، أغاني، فيديوهات طبخ — المتعة هي اللي بتخلي المعلومة تثبت. سينما لينجوا معمولة للسبب ده 🎬'},
  {t:'اتكلمي من أول يوم (حتى لو غلط)', d:'الغلط هو الطريق. اقرأي بصوت عالي، قلدي النطق، وكلمي نفسك في المراية. اللي بيستنى "يبقى جاهز" مش بيتكلم أبدًا.'},
  {t:'قاعدة الظل (Shadowing)', d:'شغلي جملة من فيديو أو أغنية، وقوليها وراها بنفس النبرة والسرعة زي الببغاء. دي أسرع طريقة للنطق الصح.'},
  {t:'الكلمات الألف الأهم أولًا', d:'أي لغة فيها ١٠٠٠ كلمة بيغطوا ٨٥٪ من الكلام اليومي. ابدئي بيهم (هتلاقيهم في دروس لينجوا 📚) وبعدها التفاصيل سهلة.'},
  {t:'راجعي قبل ما تنامي', d:'النوم بيثبت الذاكرة. ٥ دقايق مراجعة على كلمات النهاردة قبل السرير بتساوي ساعة مذاكرة الصبح.'},
  {t:'صاحبة لغة أحسن من مدرس', d:'كلمي حد بيتعلم زيك أو بيتكلم اللغة. ضيفي أصحابك في Lingua واتنافسوا على النقاط 👯'}
];
document.getElementById('tipsGrid').innerHTML = TIPS.map(function(x, i){
  return '<div class="tip-card"><span class="tip-num">' + (i + 1) + '</span><div class="tip-t">' + x.t + '</div><div class="tip-d">' + x.d + '</div></div>';
}).join('');
function gbkLoad(){ try { return JSON.parse(localStorage.getItem('lingua_gbk') || '[]'); } catch(e){ return []; } }
function gbkRender(){
  const items = gbkLoad();
  document.getElementById('gbkList').innerHTML = items.length ? items.map(function(x){
    return '<div class="gbk-card"><div class="gbk-msg">' + x.m + '</div><div class="gbk-who">— ' + (x.n || 'زائرة') + ' 💌</div></div>';
  }).join('') : '<div class="gbk-empty">لسه مفيش كلمات — كوني أول واحدة تسيب كلمة حلوة لكارما 💌</div>';
}
document.getElementById('gbkForm').addEventListener('submit', function(e){
  e.preventDefault();
  const m = document.getElementById('gbkMsg').value.trim();
  if(!m) return;
  const esc = function(x){ return x.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); };
  const items = gbkLoad();
  items.unshift({n: esc(document.getElementById('gbkName').value.trim()), m: esc(m)});
  try { localStorage.setItem('lingua_gbk', JSON.stringify(items.slice(0, 60))); } catch(e){}
  document.getElementById('gbkMsg').value = '';
  gbkRender();
  if(typeof toast === 'function') toast('وصلت كلمتك لكارما 💌 شكرًا!');
  if(typeof confetti === 'function') confetti();
});
gbkRender();


/* ================= v9: full mushaf ================= */
(function(){
  const API = 'https://api.alquran.cloud/v1';
  const grid = document.getElementById('mushafGrid');
  const home = document.getElementById('mushafHome');
  const read = document.getElementById('mushafRead');
  const txt = document.getElementById('mushafText');
  const title = document.getElementById('mushafTitle');
  const player = document.getElementById('mushafPlayer');
  let surahs = null;
  function esc(x){ return String(x).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
  function loadList(){
    fetch(API + '/surah').then(function(r){ return r.json(); }).then(function(d){
      surahs = d.data;
      grid.innerHTML = surahs.map(function(x){
        return '<div class="mushaf-cell" data-n="' + x.number + '"><div class="num">' + x.number + '</div><div class="sn">' + esc(x.name.replace('سُورَةُ ', '')) + '</div><div class="sa">' + x.numberOfAyahs + ' آية • ' + (x.revelationType === 'Meccan' ? 'مكية' : 'مدنية') + '</div></div>';
      }).join('');
    }).catch(function(){
      grid.innerHTML = '<div class="gbk-empty">مفيش اتصال بالإنترنت دلوقتي — جربي تاني لما النت يرجع 📡</div>';
    });
  }
  function openSurah(n){
    const meta = (surahs || []).find(function(x){ return x.number === n; });
    title.textContent = meta ? ('سورة ' + meta.name.replace('سُورَةُ ', '')) : ('سورة ' + n);
    txt.innerHTML = '<div class="gbk-empty">بيتم التحميل... 📖</div>';
    home.style.display = 'none';
    read.style.display = 'block';
    player.style.display = 'none';
    player.pause();
    const cacheKey = 'lingua_surah_' + n;
    let cached = null;
    try { cached = localStorage.getItem(cacheKey); } catch(e){}
    if(cached){ renderSurah(JSON.parse(cached), n); return; }
    fetch(API + '/surah/' + n + '/quran-uthmani').then(function(r){ return r.json(); }).then(function(d){
      try { localStorage.setItem(cacheKey, JSON.stringify(d.data)); } catch(e){}
      renderSurah(d.data, n);
    }).catch(function(){
      txt.innerHTML = '<div class="gbk-empty">حصلت مشكلة في التحميل — جربي تاني 📡</div>';
    });
  }
  function renderSurah(data, n){
    const bism = 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ';
    let out = (n !== 1 && n !== 9) ? '<div style="text-align:center;color:var(--gold);margin-bottom:14px">' + bism + '</div>' : '';
    out += data.ayahs.map(function(a){
      let t = a.text;
      if(n !== 1 && a.numberInSurah === 1 && t.indexOf(bism) === 0) t = t.slice(bism.length).trim();
      return '<span class="aya">' + esc(t) + '</span><span class="an">﴿' + a.numberInSurah + '﴾</span>';
    }).join(' ');
    txt.innerHTML = out;
    document.getElementById('mushafAudio').onclick = function(){
      player.src = 'https://download.quranicaudio.com/quran/mishaari_raashid_al_3afaasee/' + ('00' + n).slice(-3) + '.mp3';
      player.style.display = 'block';
      player.play().catch(function(){});
    };
  }
  grid.addEventListener('click', function(e){
    const c = e.target.closest('.mushaf-cell');
    if(c) openSurah(+c.dataset.n);
  });
  document.getElementById('mushafBack').addEventListener('click', function(){
    read.style.display = 'none';
    home.style.display = 'block';
    player.pause();
  });
  loadList();
})();


/* ================= v10: vent corner ================= */
(function(){
  const PROMPTS = [
    'إيه اللي شاغل بالك النهاردة؟ 🌙',
    'لو يومك كان لون... كان هيبقى إيه وليه؟ 🎨',
    'إيه أصعب حاجة عديتي بيها الفترة دي؟ 💪',
    'إيه الحاجة الصغيرة اللي فرحتك مبارح؟ 🌸',
    'لو هتقولي لنفسك من سنة نصيحة واحدة... هتقولي إيه؟ ✨',
    'إيه الحلم اللي لسه شايلاه من زمان؟ 🌟'
  ];
  document.getElementById('ventPrompt').textContent = PROMPTS[Math.floor(Math.random() * PROMPTS.length)];
  const KEY = 'lingua_vent';
  const esc = function(x){ return String(x).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); };
  const load = function(){ try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch(e){ return []; } };
  const render = function(){
    const items = load();
    document.getElementById('ventList').innerHTML = items.length ? items.map(function(x, i){
      return '<div class="vent-item"><div class="v-date">' + x.d + '</div><div class="v-text">' + x.t + '</div><button class="v-del" data-i="' + i + '">🗑️ امسحيها</button></div>';
    }).join('') : '<div class="vent-empty">دفترك فاضي — أول فضفضة هتلاقيها هنا 📔</div>';
  };
  document.getElementById('ventKeep').addEventListener('click', function(){
    const t = document.getElementById('ventText').value.trim();
    if(!t){ toast('اكتبي حاجة الأول 💭'); return; }
    const items = load();
    const now = new Date();
    items.unshift({d: now.toLocaleDateString('ar-EG', {weekday:'long', day:'numeric', month:'long'}) + ' • ' + now.toLocaleTimeString('ar-EG', {hour:'numeric', minute:'2-digit'}), t: esc(t)});
    try { localStorage.setItem(KEY, JSON.stringify(items.slice(0, 100))); } catch(e){}
    document.getElementById('ventText').value = '';
    render();
    toast('اتحفظت في دفترك 📔💛');
    awardPoints(2, 'فضفضة بتريّح 💭');
  });
  document.getElementById('ventThrow').addEventListener('click', function(){
    const t = document.getElementById('ventText').value.trim();
    if(!t){ toast('اكتبي حاجة الأول 💭'); return; }
    document.getElementById('ventText').value = '';
    confetti();
    toast('اترميت في السما... خدي نفس عميق، انتي أقوى 🕊️💛');
    awardPoints(1, 'رميتي الهم 🕊️');
  });
  document.getElementById('ventList').addEventListener('click', function(e){
    const b = e.target.closest('.v-del');
    if(!b) return;
    const items = load();
    items.splice(+b.dataset.i, 1);
    try { localStorage.setItem(KEY, JSON.stringify(items)); } catch(e){}
    render();
  });
  render();
})();


/* ================= v11: Supabase backend (accounts/friends/chat/top/feed) ================= */
(function(){
  var SUPA_URL = 'https://yzzlgalxjaaevmytdazf.supabase.co';
  var SUPA_KEY = 'sb_publishable_EmbKVWREHSs3sZ_nBKFyqg_zxv3Z38-';
  var sb = null, me = null, myProfile = null, myFriends = [], chatWith = null, msgChan = null, syncTimer = null;

  function esc(x){ return String(x == null ? '' : x).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
  function needLogin(el){ el.innerHTML = '<div class="gbk-empty">الجزء ده بيشتغل بحساب — سجلي من تاب «👑 حسابي» الأول 💜</div>'; }

  /* ---- menu entry ---- */
  try {
    MENU.push(['account','💜','حسابي']); VIEWIDS.push('account');
    document.getElementById('menuGrid').insertAdjacentHTML('beforeend', '<a class="menu-card" href="#account"><span class="m-ico">💜</span><span class="m-name">حسابي</span></a>');
  } catch(e){}

  /* ---- tabs ---- */
  document.getElementById('accTabs').addEventListener('click', function(e){
    var b = e.target.closest('.tab'); if(!b) return;
    document.querySelectorAll('#accTabs .tab').forEach(function(t){ t.classList.toggle('active', t === b); });
    var map = {me:'accMe', friends:'accFriends', chat:'accChat', top:'accTop', feed:'accFeed', discover:'accDiscover', rooms:'accRooms'};
    Object.keys(map).forEach(function(k){ document.getElementById(map[k]).style.display = (k === b.dataset.at) ? 'block' : 'none'; });
    if(b.dataset.at === 'top') loadTop();
    if(b.dataset.at === 'feed') loadFeed();
    if(b.dataset.at === 'friends') renderFriendsReal();
    if(b.dataset.at === 'discover') renderDiscover();
    if(b.dataset.at === 'rooms') renderRooms();
  });

  /* ---- pending referral from invite link ---- */
  try {
    var q = new URLSearchParams(location.search);
    var ref = q.get('ref');
    if(ref && /^[0-9a-f-]{36}$/i.test(ref)){
      localStorage.setItem('lingua_pending_ref', ref);
      history.replaceState(null, '', location.pathname + location.hash);
    }
  } catch(e){}

  function consumeRef(){
    var ref = null;
    try { ref = localStorage.getItem('lingua_pending_ref'); } catch(e){}
    if(!ref || !me || ref === me.id) return;
    localStorage.removeItem('lingua_pending_ref');
    sb.from('friendships').insert([{user_id: ref, friend_id: me.id}, {user_id: me.id, friend_id: ref}]).then(function(r){
      if(!r.error){ toast('صديقتك اللي دعتك بقت في صحابك 👯‍♀️💜'); confetti(); loadFriends(); }
    });
  }

  /* ---- points sync ---- */
  function queueSync(){
    if(!me) return;
    clearTimeout(syncTimer);
    syncTimer = setTimeout(function(){
      sb.from('profiles').update({points: getPoints(), lifetime: getLifetime()}).eq('id', me.id).then(function(){});
    }, 2500);
  }
  try {
    var _award = window.awardPoints;
    window.awardPoints = function(n, label){ _award(n, label); queueSync(); };
  } catch(e){}

  /* ---- auth UI ---- */
  function renderMe(){
    var el = document.getElementById('accMe');
    if(!me){
      el.innerHTML =
        '<div class="acc-row">' +
        '<div class="acc-card"><h3>✨ حساب جديد</h3>' +
        '<input class="acc-in" id="suName" maxlength="30" placeholder="اسمك (هيظهر لصحابك)">' +
        '<input class="acc-in" id="suEmail" type="email" dir="ltr" placeholder="إيميلك">' +
        '<input class="acc-in" id="suPass" type="password" dir="ltr" placeholder="باسورد (٦ حروف على الأقل)">' +
        '<button class="btn" id="suBtn" style="width:100%">اعملي حسابي 💜</button></div>' +
        '<div class="acc-card"><h3>🔑 عندي حساب</h3>' +
        '<input class="acc-in" id="liEmail" type="email" dir="ltr" placeholder="إيميلك">' +
        '<input class="acc-in" id="liPass" type="password" dir="ltr" placeholder="الباسورد">' +
        '<button class="btn" id="liBtn" style="width:100%">ادخلي 🔑</button></div>' +
        '</div>' +
        '<p style="text-align:center;color:var(--muted);font-size:.85rem">حسابك بيحفظ نقاطك وتقدمك على أي موبايل، وبيخليكي تضيفي صحابك وتكلمهم 💬</p>';
      document.getElementById('suBtn').onclick = doSignup;
      document.getElementById('liBtn').onclick = doLogin;
      return;
    }
    var nm = (myProfile && myProfile.display_name) || 'صديقتنا';
    el.innerHTML =
      '<div class="acc-card" style="max-width:480px">' +
      '<div class="acc-me"><div class="acc-av">' + esc(nm.charAt(0)) + '</div>' +
      '<div><div class="acc-name">' + esc(nm) + '</div><div class="acc-pts">💎 ' + getPoints() + ' نقطة • المجموع الكلي ' + getLifetime() + '</div></div></div>' +
      '<div class="acc-row">' +
      '<button class="btn" id="inviteBtn">💌 دعوة صاحبة بالواتساب</button>' +
      '<button class="btn" id="signOut" style="background:rgba(255,255,255,.08);color:var(--muted)">خروج</button>' +
      '</div></div>';
    document.getElementById('signOut').onclick = function(){
      sb.auth.signOut().then(function(){ me = null; myProfile = null; renderAll(); toast('باي باي... استنيناكي ترجعي 👋💜'); });
    };
    document.getElementById('inviteBtn').onclick = function(){
      var link = 'https://lingua-karma.github.io/?ref=' + me.id;
      var txt = 'يلا بينا نتعلم لغات سوا على Lingua! 💜 اعملي حساب من اللينك ده وهنبقى صحاب على طول ونتنافس في النقاط: ' + link;
      window.open('https://wa.me/?text=' + encodeURIComponent(txt), '_blank');
    };
  }

  function doSignup(){
    var name = document.getElementById('suName').value.trim();
    var email = document.getElementById('suEmail').value.trim();
    var pass = document.getElementById('suPass').value;
    if(!name){ toast('اكتبي اسمك الأول 💜'); return; }
    if(!email || pass.length < 6){ toast('إيميل صح وباسورد ٦ حروف على الأقل 🔑'); return; }
    sb.auth.signUp({email: email, password: pass}).then(function(r){
      if(r.error){ toast(r.error.message.indexOf('already') >= 0 ? 'الإيميل ده متسجل — جربي تدخلي بيه 🔑' : 'حصلت مشكلة: ' + r.error.message); return; }
      if(!r.data.session){ toast('اتسجل! جربي تدخلي دلوقتي 🔑'); return; }
      me = r.data.session.user;
      sb.from('profiles').upsert({id: me.id, display_name: name, points: getPoints(), lifetime: getLifetime()}).then(function(){
        myProfile = {id: me.id, display_name: name};
        afterAuth('أهلًا بيكي في Lingua يا ' + name + '! 🎉💜');
      });
    });
  }

  function doLogin(){
    var email = document.getElementById('liEmail').value.trim();
    var pass = document.getElementById('liPass').value;
    if(!email || !pass){ toast('اكتبي الإيميل والباسورد 🔑'); return; }
    sb.auth.signInWithPassword({email: email, password: pass}).then(function(r){
      if(r.error){ toast('الإيميل أو الباسورد مش صح 🔑'); return; }
      me = r.data.session.user;
      sb.from('profiles').select('*').eq('id', me.id).maybeSingle().then(function(pr){
        var local = getPoints(), life = getLifetime();
        if(pr.data){
          myProfile = pr.data;
          var best = Math.max(pr.data.points || 0, local);
          var bestL = Math.max(pr.data.lifetime || 0, life);
          localStorage.setItem('lingua_points', String(best));
          localStorage.setItem('lingua_lifetime', String(bestL));
          if(best !== pr.data.points || bestL !== pr.data.lifetime){
            sb.from('profiles').update({points: best, lifetime: bestL}).eq('id', me.id).then(function(){});
          }
        } else {
          var nm = (me.email || 'صديقة').split('@')[0];
          sb.from('profiles').insert({id: me.id, display_name: nm, points: local, lifetime: life}).then(function(){});
          myProfile = {id: me.id, display_name: nm, points: local};
        }
        if(window.refreshDash) window.refreshDash();
        afterAuth('رجعتي! نقاطك كلها موجودة 💎💜');
      });
    });
  }

  function afterAuth(msg){
    toast(msg);
    confetti();
    renderAll();
    consumeRef();
    subscribeMsgs();
  }

  function renderAll(){ renderMe(); renderFriendsReal(); }

  /* ---- friends ---- */
  function loadFriends(){
    if(!me) return;
    sb.from('friendships').select('user_id,friend_id').or('user_id.eq.' + me.id + ',friend_id.eq.' + me.id).then(function(r){
      if(r.error) return;
      var ids = {};
      (r.data || []).forEach(function(f){ if(f.user_id !== me.id) ids[f.user_id] = 1; if(f.friend_id !== me.id) ids[f.friend_id] = 1; });
      var arr = Object.keys(ids);
      if(!arr.length){ myFriends = []; renderFriendsReal(); return; }
      sb.from('profiles').select('id,display_name,points').in('id', arr).then(function(pr){
        myFriends = pr.data || [];
        renderFriendsReal();
      });
    });
  }

  function renderFriendsReal(){
    var el = document.getElementById('accFriends');
    var fr = document.getElementById('friendsReal');
    if(!me){ needLogin(el); return; }
    var html = '<div style="text-align:center;margin-bottom:16px"><button class="btn" id="inviteBtn2">💌 دعوة صاحبة جديدة بالواتساب</button></div>';
    if(!myFriends.length){
      html += '<div class="gbk-empty">لسه مفيش صحاب — ابعتي الدعوة لصاحبتك، أول ما تعمل حساب من اللينك هتظهر هنا فورًا 👯‍♀️</div>';
    } else {
      html += myFriends.map(function(f){
        return '<div class="fr-item"><div class="fr-av">' + esc((f.display_name || '؟').charAt(0)) + '</div>' +
          '<div class="fr-name">' + esc(f.display_name) + '</div><div class="fr-pts">💎 ' + (f.points || 0) + '</div>' +
          '<button class="btn" style="padding:7px 14px;font-size:.8rem" data-gift="' + f.id + '" data-nm="' + esc(f.display_name) + '">🎁 نقاط</button>' +
          '<button class="btn" style="padding:7px 14px;font-size:.8rem" data-chat="' + f.id + '" data-nm="' + esc(f.display_name) + '">💬 كلميها</button></div>';
      }).join('');
    }
    el.innerHTML = html;
    if(fr) fr.innerHTML = me ? html : '<div class="gbk-empty">سجلي حسابك من قسم «حسابي» الأول 💜</div>';
    document.querySelectorAll('[data-chat]').forEach(function(b){
      b.onclick = function(){ openChat(b.dataset.chat, b.dataset.nm); location.hash = 'account'; };
    });
    document.querySelectorAll('[data-gift]').forEach(function(b){
      b.onclick = function(){ sendGiftUI(b.dataset.gift, b.dataset.nm); };
    });
    var ib = document.getElementById('inviteBtn2');
    if(ib) ib.onclick = function(){
      var link = 'https://lingua-karma.github.io/?ref=' + me.id;
      var txt = 'يلا بينا نتعلم لغات سوا على Lingua! 💜 اعملي حساب من اللينك ده وهنبقى صحاب على طول ونتنافس في النقاط: ' + link;
      window.open('https://wa.me/?text=' + encodeURIComponent(txt), '_blank');
    };
  }

  /* ---- study rooms ---- */
  var roomChan = null, curRoom = null;
  var ROOM_LANGS = [['any','🌍 كل اللغات'],['en','🇬🇧 إنجليزي'],['fr','🇫🇷 فرنسي'],['de','🇩🇪 ألماني'],['zh','🇨🇳 صيني'],['ko','🇰🇷 كوري']];
  function renderRooms(){
    var el = document.getElementById('accRooms');
    if(!me){ needLogin(el); return; }
    el.innerHTML =
      '<div class="acc-card" style="max-width:520px"><h3>📚 اعملي غرفة مذاكرة</h3>' +
      '<input class="acc-in" id="roomName" maxlength="40" placeholder="اسم الغرفة — مثال: مراجعة إنجليزي قبل الامتحان 📖">' +
      '<div class="acc-row" style="margin-bottom:10px">' + ROOM_LANGS.map(function(l,i){ return '<button class="tab room-lang' + (i===0?' active':'') + '" data-rl="' + l[0] + '">' + l[1] + '</button>'; }).join('') + '</div>' +
      '<button class="btn" id="roomCreate" style="width:100%">✨ افتحي الغرفة</button></div>' +
      '<div id="roomList"><div class="gbk-empty">بيتم التحميل... 📚</div></div>' +
      '<div id="roomOpen"></div>';
    var selLang = 'any';
    el.querySelectorAll('.room-lang').forEach(function(b){
      b.onclick = function(){ el.querySelectorAll('.room-lang').forEach(function(x){x.classList.remove('active');}); b.classList.add('active'); selLang = b.dataset.rl; };
    });
    document.getElementById('roomCreate').onclick = function(){
      var nm = document.getElementById('roomName').value.trim();
      if(!nm){ toast('اكتبي اسم الغرفة الأول 😊'); return; }
      sb.from('rooms').insert({name: nm, lang: selLang, created_by: me.id}).select().single().then(function(r){
        if(r.error){ toast('حاجة غلط — جربي تاني'); return; }
        sb.from('room_members').insert({room_id: r.data.id, user_id: me.id}).then(function(){
          toast('غرفتك اتفتحت 🎉'); renderRooms();
        });
      });
    };
    Promise.all([
      sb.from('rooms').select('*').order('created_at', {ascending:false}).limit(30),
      sb.from('room_members').select('room_id,user_id'),
      sb.from('profiles').select('id,display_name')
    ]).then(function(rs){
      var rooms = rs[0].data || [], members = rs[1].data || [], profs = {};
      (rs[2].data || []).forEach(function(u){ profs[u.id] = u.display_name; });
      var list = document.getElementById('roomList');
      if(!rooms.length){ list.innerHTML = '<div class="gbk-empty">لسه مفيش غرف — كوني أول واحدة تفتح غرفة 📚✨</div>'; return; }
      list.innerHTML = rooms.map(function(r){
        var cnt = members.filter(function(m){ return m.room_id === r.id; }).length;
        var mine = members.some(function(m){ return m.room_id === r.id && m.user_id === me.id; });
        var langName = (ROOM_LANGS.find(function(l){return l[0]===r.lang;})||ROOM_LANGS[0])[1];
        return '<div class="fr-item"><div class="fr-av">📚</div><div class="fr-name">' + esc(r.name) +
          '<div style="color:var(--muted);font-size:.72rem">' + langName + ' • ' + cnt + ' عضوة • فتحتها ' + esc(profs[r.created_by]||'؟') + '</div></div>' +
          (mine
            ? '<button class="btn" style="padding:7px 14px;font-size:.8rem" data-openroom="' + r.id + '" data-nm="' + esc(r.name) + '">💬 ادخلي</button>'
            : '<button class="btn" style="padding:7px 14px;font-size:.8rem" data-joinroom="' + r.id + '">➕ انضمي</button>') +
          '</div>';
      }).join('');
      list.querySelectorAll('[data-joinroom]').forEach(function(b){
        b.onclick = function(){
          b.disabled = true;
          sb.from('room_members').insert({room_id: b.dataset.joinroom, user_id: me.id}).then(function(){ toast('انضميتي! 🎉'); renderRooms(); });
        };
      });
      list.querySelectorAll('[data-openroom]').forEach(function(b){
        b.onclick = function(){ openRoom(b.dataset.openroom, b.dataset.nm); };
      });
    });
  }
  function openRoom(rid, name){
    curRoom = rid;
    var box = document.getElementById('roomOpen');
    box.innerHTML =
      '<div class="acc-card" style="max-width:560px;margin-top:14px"><h3>📚 ' + esc(name) + '</h3>' +
      '<div class="chat-msgs" id="roomMsgs" style="max-height:300px;overflow-y:auto;margin-bottom:12px"><div class="gbk-empty">بيتم التحميل...</div></div>' +
      '<div class="chat-send"><input class="acc-in" id="roomIn" maxlength="500" placeholder="اكتبي للمجموعة..." style="margin-bottom:0"><button class="btn" id="roomGo">ابعتي 💌</button></div></div>';
    box.scrollIntoView({behavior:'smooth'});
    function draw(list){
      var el2 = document.getElementById('roomMsgs');
      if(!el2) return;
      el2.innerHTML = list.length ? list.map(function(m){
        return '<div class="cm ' + (m.sender === me.id ? 'me' : 'them') + '"><div class="cm-b"><div style="font-size:.66rem;opacity:.75">' + esc(m._nm||'') + '</div>' + esc(m.body) + '</div></div>';
      }).join('') : '<div class="gbk-empty">أول رسالة في الغرفة بتفتح المذاكرة 📚✨</div>';
      el2.scrollTop = el2.scrollHeight;
    }
    function loadRoomMsgs(){
      sb.from('room_messages').select('*').eq('room_id', rid).order('created_at', {ascending:true}).limit(200).then(function(r){
        var list = r.data || [];
        var senders = []; list.forEach(function(m){ if(senders.indexOf(m.sender)<0) senders.push(m.sender); });
        if(!senders.length){ draw(list); return; }
        sb.from('profiles').select('id,display_name').in('id', senders).then(function(pr){
          var nm = {}; (pr.data||[]).forEach(function(u){ nm[u.id]=u.display_name; });
          list.forEach(function(m){ m._nm = nm[m.sender]||''; });
          draw(list);
        });
      });
    }
    document.getElementById('roomGo').onclick = sendRoom;
    document.getElementById('roomIn').addEventListener('keydown', function(e){ if(e.key === 'Enter') sendRoom(); });
    function sendRoom(){
      var v = document.getElementById('roomIn').value.trim();
      if(!v) return;
      document.getElementById('roomIn').value = '';
      sb.from('room_messages').insert({room_id: rid, sender: me.id, body: v}).then(function(){});
    }
    if(roomChan) sb.removeChannel(roomChan);
    roomChan = sb.channel('room-' + rid).on('postgres_changes', {event:'INSERT', schema:'public', table:'room_messages', filter:'room_id=eq.' + rid}, function(){ loadRoomMsgs(); }).subscribe();
    loadRoomMsgs();
  }

  /* ---- discover new friends (opt-in) ---- */
  function renderDiscover(){
    var el = document.getElementById('accDiscover');
    if(!me){ needLogin(el); return; }
    sb.from('profiles').select('discoverable').eq('id', me.id).single().then(function(pr){
      var on = pr.data && pr.data.discoverable;
      var html = '<div class="acc-card" style="max-width:520px;text-align:center">' +
        '<h3>💫 اكتشفي صديقات جداد</h3>' +
        '<p style="color:var(--muted);font-size:.82rem;line-height:1.8">شوفي بنات بتتعلم لغات زيك وصاحبيهم. اسمك ونقطاك بس اللي بيظهروا — مفيش إيميلات ولا بيانات شخصية أبد.</p>' +
        '<button class="btn" id="discToggle" style="margin-top:6px">' + (on ? '🟢 ظاهرة في الاكتشاف — دوسي للإخفاء' : '⚪ اظهري في الاكتشاف') + '</button></div>' +
        '<div id="discList"><div class="gbk-empty">بيتم التحميل... 💫</div></div>';
      el.innerHTML = html;
      document.getElementById('discToggle').onclick = function(){
        sb.from('profiles').update({discoverable: !on}).eq('id', me.id).then(function(){
          toast(!on ? 'بقيتي ظاهرة في الاكتشاف 💫' : 'اتخفيتي من الاكتشاف');
          renderDiscover();
        });
      };
      var ids = myFriends.map(function(f){ return f.id; });
      sb.from('profiles').select('id,display_name,points').eq('discoverable', true).neq('id', me.id).order('points', {ascending:false}).limit(50).then(function(r){
        var list = (r.data || []).filter(function(u){ return ids.indexOf(u.id) < 0; });
        var dl = document.getElementById('discList');
        if(!dl) return;
        if(!list.length){ dl.innerHTML = '<div class="gbk-empty">لسه مفيش بنات جداد في الاكتشاف — شجعي صحابك يظهروا 💜</div>'; return; }
        dl.innerHTML = list.map(function(u){
          return '<div class="fr-item"><div class="fr-av">' + esc((u.display_name || '؟').charAt(0)) + '</div>' +
            '<div class="fr-name">' + esc(u.display_name) + '</div><div class="fr-pts">💎 ' + (u.points || 0) + '</div>' +
            '<button class="btn" style="padding:7px 14px;font-size:.8rem" data-addfr="' + u.id + '" data-nm="' + esc(u.display_name) + '">➕ صاحبيها</button></div>';
        }).join('');
        dl.querySelectorAll('[data-addfr]').forEach(function(b){
          b.onclick = function(){
            b.disabled = true;
            sb.from('friendships').insert([{user_id: me.id, friend_id: b.dataset.addfr}, {user_id: b.dataset.addfr, friend_id: me.id}]).then(function(r){
              if(r.error){ b.disabled = false; toast('حاجة غلط — جربي تاني'); return; }
              toast(b.dataset.nm + ' بقت في صحابك 👯‍♀️💜');
              loadFriends(); renderDiscover();
            });
          };
        });
      });
    });
  }

  /* ---- send points gift ---- */
  function sendGiftUI(uid, name){
    var box = document.getElementById('chatBox');
    box.innerHTML =
      '<div style="text-align:center;color:var(--gold);font-weight:700;margin-bottom:12px">🎁 ابعتي نقاط لـ ' + esc(name) + '</div>' +
      '<div style="text-align:center;color:var(--muted);font-size:.82rem;margin-bottom:12px">رصيدك: 💎 ' + getPoints() + ' — أقصى حاجة ٥٠٠ في المرة</div>' +
      '<div style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap;margin-bottom:12px">' +
        [10,25,50,100,200].map(function(n){ return '<button class="btn gift-amt" data-n="' + n + '" style="padding:9px 18px">' + n + ' 💎</button>'; }).join('') +
      '</div><div id="giftMsg" style="text-align:center;min-height:22px;color:var(--muted);font-size:.86rem"></div>';
    document.querySelector('#accTabs .tab[data-at="chat"]').click();
    box.querySelectorAll('.gift-amt').forEach(function(b){
      b.onclick = function(){
        b.disabled = true;
        sb.rpc('send_points', {to_user: uid, amount: parseInt(b.dataset.n, 10)}).then(function(r){
          var m = document.getElementById('giftMsg');
          if(r.error || r.data !== 'ok'){
            var why = r.data === 'no-points' ? 'نقاطك مش كفاية 😅' : (r.data === 'not-friends' ? 'لازم تكونوا صحاب الأول' : 'حاجة غلط — جربي تاني');
            m.textContent = why; b.disabled = false;
          } else {
            m.textContent = 'وصلت! 🎉 بعتِ ' + b.dataset.n + ' نقطة لـ ' + name;
            m.style.color = '#4ade80';
            localStorage.setItem('lingua_points', String(getPoints() - parseInt(b.dataset.n, 10)));
            if(window.refreshDash) window.refreshDash();
            loadFriends();
          }
        });
      };
    });
  }

  /* ---- chat ---- */
  function openChat(uid, name){
    chatWith = {id: uid, name: name};
    var box = document.getElementById('chatBox');
    box.innerHTML =
      '<div style="text-align:center;color:var(--gold);font-weight:700;margin-bottom:10px">💬 شات مع ' + esc(name) + '</div>' +
      '<div class="chat-msgs" id="chatMsgs"><div class="gbk-empty">بيتم التحميل...</div></div>' +
      '<div class="chat-send"><input class="acc-in" id="chatIn" maxlength="500" placeholder="اكتبي رسالتك..." style="margin-bottom:0"><button class="btn" id="chatGo">ابعتي 💌</button></div>';
    document.getElementById('chatGo').onclick = sendChat;
    document.getElementById('chatIn').addEventListener('keydown', function(e){ if(e.key === 'Enter') sendChat(); });
    document.querySelector('#accTabs .tab[data-at="chat"]').click();
    sb.from('messages').select('*').or('and(sender.eq.' + me.id + ',recipient.eq.' + uid + '),and(sender.eq.' + uid + ',recipient.eq.' + me.id + ')').order('created_at', {ascending: true}).limit(200).then(function(r){
      renderMsgs(r.data || []);
    });
  }

  function renderMsgs(list){
    var el = document.getElementById('chatMsgs');
    if(!el) return;
    el.innerHTML = list.length ? list.map(function(m){
      return '<div class="cm ' + (m.sender === me.id ? 'me' : 'them') + '"><div class="cm-b">' + esc(m.body) + '</div></div>';
    }).join('') : '<div class="gbk-empty">ابدئوا الكلام... أول رسالة بتفتح الدنيا 💬✨</div>';
    el.scrollTop = el.scrollHeight;
  }

  function sendChat(){
    var inp = document.getElementById('chatIn');
    var t = inp.value.trim();
    if(!t || !chatWith || !me) return;
    inp.value = '';
    sb.from('messages').insert({sender: me.id, recipient: chatWith.id, body: t}).then(function(r){
      if(r.error){ toast('الرسالة مرسلتش — جربي تاني 📡'); return; }
      sb.from('messages').select('*').or('and(sender.eq.' + me.id + ',recipient.eq.' + chatWith.id + '),and(sender.eq.' + chatWith.id + ',recipient.eq.' + me.id + ')').order('created_at', {ascending: true}).limit(200).then(function(rr){ renderMsgs(rr.data || []); });
    });
  }

  function subscribeMsgs(){
    if(!me || msgChan) return;
    msgChan = sb.channel('lingua-msgs').on('postgres_changes', {event: 'INSERT', schema: 'public', table: 'messages', filter: 'recipient=eq.' + me.id}, function(p){
      if(chatWith && p.new.sender === chatWith.id && document.getElementById('chatMsgs')){
        sb.from('messages').select('*').or('and(sender.eq.' + me.id + ',recipient.eq.' + chatWith.id + '),and(sender.eq.' + chatWith.id + ',recipient.eq.' + me.id + ')').order('created_at', {ascending: true}).limit(200).then(function(rr){ renderMsgs(rr.data || []); });
      } else {
        toast('رسالة جديدة من صاحبتك 💬💜');
      }
    }).subscribe();
  }

  /* ---- leaderboard ---- */
  function loadTop(){
    var el = document.getElementById('topList');
    if(!sb){ el.innerHTML = '<div class="gbk-empty">لوحة الشرف محتاجة نت 📡</div>'; return; }
    sb.from('profiles').select('id,display_name,points').order('points', {ascending: false}).limit(50).then(function(r){
      if(r.error || !(r.data || []).length){ el.innerHTML = '<div class="gbk-empty">لسه مفيش نقط متسجلة — كوني الأولى! 🏆</div>'; return; }
      el.innerHTML = r.data.map(function(p, i){
        var medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : (i + 1);
        var isMe = me && p.id === me.id;
        return '<div class="top-row' + (isMe ? ' me' : '') + '"><div class="top-rank">' + medal + '</div>' +
          '<div class="fr-name">' + esc(p.display_name) + (isMe ? ' (إنتي! 💜)' : '') + '</div><div class="fr-pts">💎 ' + (p.points || 0) + '</div></div>';
      }).join('');
    });
  }

  /* ---- posts feed ---- */
  function loadFeed(){
    var el = document.getElementById('feedList');
    if(!sb){ el.innerHTML = '<div class="gbk-empty">المنشورات محتاجة نت 📡</div>'; return; }
    sb.from('posts').select('*').order('created_at', {ascending: false}).limit(50).then(function(r){
      renderFeed(r.data || []);
    });
  }
  function renderFeed(list){
    var el = document.getElementById('feedList');
    el.innerHTML = list.length ? list.map(function(p){
      var d = '';
      try { d = new Date(p.created_at).toLocaleDateString('ar-EG', {day: 'numeric', month: 'long'}); } catch(e){}
      return '<div class="feed-card"><div class="feed-who">' + esc(p.author_name) + ' ✨</div><div>' + esc(p.body) + '</div><div class="feed-when">' + d + '</div></div>';
    }).join('') : '<div class="gbk-empty">لسه مفيش منشورات — كوني أول واحدة تكتب! 📣✨</div>';
  }
  document.getElementById('feedSend').addEventListener('click', function(){
    if(!me){ toast('سجلي حسابك الأول عشان تنشري 💜'); return; }
    var t = document.getElementById('feedText').value.trim();
    if(!t){ toast('اكتبي حاجة الأول ✨'); return; }
    document.getElementById('feedText').value = '';
    sb.from('posts').insert({author: me.id, author_name: (myProfile && myProfile.display_name) || 'صديقة', body: t}).then(function(r){
      if(r.error){ toast('المنشور متنشرش — جربي تاني 📡'); return; }
      toast('اتنشر! 📣✨');
      loadFeed();
    });
  });

  /* ---- guestbook goes live ---- */
  function gbkRemoteRender(){
    if(!sb) return;
    sb.from('guestbook').select('*').order('created_at', {ascending: false}).limit(60).then(function(r){
      if(r.error) return;
      var el = document.getElementById('gbkList');
      if(!el) return;
      var list = r.data || [];
      el.innerHTML = list.length ? list.map(function(x){
        return '<div class="gbk-card"><div class="gbk-msg">' + esc(x.body) + '</div><div class="gbk-who">— ' + esc(x.author_name || 'زائرة') + ' 💌</div></div>';
      }).join('') : '<div class="gbk-empty">لسه مفيش كلمات — كوني أول واحدة تسيب كلمة حلوة لكارما 💌</div>';
    });
  }
  try {
    var gbkForm = document.getElementById('gbkForm');
    var clone = gbkForm.cloneNode(true);
    gbkForm.parentNode.replaceChild(clone, gbkForm);
    clone.addEventListener('submit', function(e){
      e.preventDefault();
      var m = document.getElementById('gbkMsg').value.trim();
      if(!m) return;
      var n = document.getElementById('gbkName').value.trim() || 'زائرة';
      document.getElementById('gbkMsg').value = '';
      if(sb){
        sb.from('guestbook').insert({author_name: n.slice(0, 40), body: m.slice(0, 500)}).then(function(r){
          if(r.error){ toast('مفيش نت — كلمتك اتحفظت على جهازك 💌'); }
          gbkRemoteRender();
        });
      } else {
        toast('مفيش نت — جربي لما النت يرجع 💌');
      }
      toast('وصلت كلمتك لكارما 💌 شكرًا!');
      confetti();
    });
    gbkRemoteRender();
  } catch(e){}

  /* ---- boot ---- */
  function initSb(){
    sb = window.supabase.createClient(SUPA_URL, SUPA_KEY);
    sb.auth.getSession().then(function(r){
      if(r.data && r.data.session){
        me = r.data.session.user;
        sb.from('profiles').select('*').eq('id', me.id).maybeSingle().then(function(pr){
          if(pr.data){
            myProfile = pr.data;
            var best = Math.max(pr.data.points || 0, getPoints());
            var bestL = Math.max(pr.data.lifetime || 0, getLifetime());
            localStorage.setItem('lingua_points', String(best));
            localStorage.setItem('lingua_lifetime', String(bestL));
            if(best !== pr.data.points || bestL !== pr.data.lifetime) sb.from('profiles').update({points: best, lifetime: bestL}).eq('id', me.id).then(function(){});
            if(window.refreshDash) window.refreshDash();
          }
          renderAll();
          consumeRef();
          subscribeMsgs();
        });
      } else {
        renderAll();
      }
    });
    sb.channel('lingua-feed').on('postgres_changes', {event: 'INSERT', schema: 'public', table: 'posts'}, function(){ loadFeed(); }).subscribe();
    sb.channel('lingua-gbk').on('postgres_changes', {event: 'INSERT', schema: 'public', table: 'guestbook'}, function(){ gbkRemoteRender(); }).subscribe();
    loadTop();
    loadFeed();
  }

  renderMe();
  if(window.supabase && window.supabase.createClient){
    initSb();
  } else {
    var sc = document.createElement('script');
    sc.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js';
    sc.onload = initSb;
    sc.onerror = function(){
      document.getElementById('accMe').innerHTML = '<div class="gbk-empty">الحسابات محتاجة نت — جربي لما النت يرجع 📡💜</div>';
    };
    document.head.appendChild(sc);
  }
})();


/* ================= v12: feature batch 1 ================= */
(function(){


  /* ---- prayer times in deen corner ---- */
  try {
    var deenSec = document.getElementById('deen');
    var pt = document.createElement('div');
    pt.innerHTML = '<h3 style="color:var(--gold);text-align:center;margin:26px 0 12px">🕌 مواقيت الصلاة</h3><div id="ptGrid" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(100px,1fr));gap:10px;max-width:640px;margin:0 auto"><div class="gbk-empty" style="grid-column:1/-1">بيتم التحميل... 🕌</div></div><div id="ptCity" style="text-align:center;color:var(--muted);font-size:.78rem;margin-top:8px"></div>';
    deenSec.appendChild(pt);
    var PT_NAMES = {Fajr: 'الفجر', Sunrise: 'الشروق', Dhuhr: 'الظهر', Asr: 'العصر', Maghrib: 'المغرب', Isha: 'العشاء'};
    function ptRender(timings, where){
      document.getElementById('ptGrid').innerHTML = Object.keys(PT_NAMES).map(function(k){
        return '<div style="background:rgba(255,255,255,.05);border:1px solid rgba(212,175,55,.25);border-radius:14px;padding:12px 6px;text-align:center"><div style="color:var(--gold);font-weight:800;font-size:.85rem">' + PT_NAMES[k] + '</div><div style="font-weight:900;font-size:1.05rem;margin-top:4px" dir="ltr">' + timings[k] + '</div></div>';
      }).join('');
      document.getElementById('ptCity').textContent = where;
    }
    function ptFetch(url, where){
      return fetch(url).then(function(r){ return r.json(); }).then(function(d){
        var t = {};
        Object.keys(PT_NAMES).forEach(function(k){ t[k] = d.data.timings[k].slice(0, 5); });
        ptRender(t, where);
      });
    }
    var ptByCity = function(){ return ptFetch('https://api.aladhan.com/v1/timingsByCity?city=Cairo&country=Egypt&method=5', 'القاهرة، مصر 📍').catch(function(){ document.getElementById('ptGrid').innerHTML = '<div class="gbk-empty" style="grid-column:1/-1">مفيش نت — المواقيت هتظهر أول ما الاتصال يرجع 📡</div>'; }); };
    if(navigator.geolocation){
      navigator.geolocation.getCurrentPosition(function(pos){
        ptFetch('https://api.aladhan.com/v1/timings/' + Math.floor(Date.now() / 1000) + '?latitude=' + pos.coords.latitude.toFixed(3) + '&longitude=' + pos.coords.longitude.toFixed(3) + '&method=5', 'حسب مكانك 📍').catch(ptByCity);
      }, ptByCity, {timeout: 6000});
    } else { ptByCity(); }
  } catch(e){}

  /* ---- prize wheel ---- */
  (function(){
    var cv = document.getElementById('wheelCv');
    var ctx = cv.getContext('2d');
    var SEG = [['10', '#3b2f16'], ['25', '#241d0e'], ['5', '#3b2f16'], ['50', '#241d0e'], ['15', '#3b2f16'], ['100', '#4a3a12'], ['5', '#241d0e'], ['30', '#3b2f16']];
    var ang0 = -Math.PI / 2;
    function draw(rot){
      ctx.clearRect(0, 0, 320, 320);
      var n = SEG.length, r = 150, cx = 160, cy = 160;
      for(var i = 0; i < n; i++){
        var a0 = ang0 + rot + i * 2 * Math.PI / n, a1 = a0 + 2 * Math.PI / n;
        ctx.beginPath(); ctx.moveTo(cx, cy); ctx.arc(cx, cy, r, a0, a1); ctx.closePath();
        ctx.fillStyle = SEG[i][1]; ctx.fill();
        ctx.strokeStyle = 'rgba(212,175,55,.55)'; ctx.lineWidth = 2; ctx.stroke();
        ctx.save(); ctx.translate(cx, cy); ctx.rotate((a0 + a1) / 2);
        ctx.textAlign = 'right'; ctx.fillStyle = '#e8c96a'; ctx.font = '900 22px Cairo, sans-serif';
        ctx.fillText(SEG[i][0], r - 18, 8); ctx.restore();
      }
      ctx.beginPath(); ctx.arc(cx, cy, 26, 0, 7); ctx.fillStyle = '#d4af37'; ctx.fill();
      ctx.beginPath(); ctx.moveTo(cx - 10, cy - r - 4); ctx.lineTo(cx + 10, cy - r - 4); ctx.lineTo(cx, cy - r + 18); ctx.closePath(); ctx.fillStyle = '#fff'; ctx.fill();
    }
    draw(0);
    var KEY = 'lingua_wheel_day';
    function spunToday(){ try { return localStorage.getItem(KEY) === new Date().toDateString(); } catch(e){ return false; } }
    function note(t){ document.getElementById('wheelNote').textContent = t; }
    if(spunToday()) note('لفيتي النهارده ✅ — ارجعي بكرة للفة جديدة 🎡');
    document.getElementById('wheelSpin').addEventListener('click', function(){
      if(spunToday()){ note('لفة واحدة بس في اليوم يا قمر 🌙 — بكرة أحسن'); return; }
      var btn = this; btn.disabled = true;
      var idx = Math.floor(Math.random() * SEG.length);
      var target = (Math.PI * 2 * 6) + (Math.PI * 2 - (idx + 0.5) * 2 * Math.PI / SEG.length);
      var start = null;
      function frame(ts){
        if(!start) start = ts;
        var p = Math.min((ts - start) / 3800, 1);
        var ease = 1 - Math.pow(1 - p, 3);
        draw(target * ease);
        if(p < 1) requestAnimationFrame(frame);
        else {
          var pts = parseInt(SEG[idx][0], 10);
          try { localStorage.setItem(KEY, new Date().toDateString()); } catch(e){}
          awardPoints(pts, 'عجلة الحظ 🎡');
          confetti();
          note('مبروووك! كسبتي ' + pts + ' نقطة 🎉 — ارجعي بكرة 🎡');
          btn.disabled = false;
        }
      }
      requestAnimationFrame(frame);
    });
  })();

  /* ---- question of the day ---- */
  (function(){
    var Q = [
      ['عاصمة اليابان إيه؟', ['طوكيو', 'بكين', 'سول', 'بانكوك'], 0],
      ['أكبر محيط في العالم؟', ['الأطلسي', 'الهندي', 'الهادي', 'المتجمد'], 2],
      ['كم عدد كواكب المجموعة الشمسية؟', ['٧', '٨', '٩', '١٠'], 1],
      ['لغة البرازيل الرسمية؟', ['الإسبانية', 'البرتغالية', 'الفرنسية', 'الإنجليزية'], 1],
      ['أطول نهر في العالم؟', ['الأمازون', 'الدانوب', 'النيل', 'اليانجتسي'], 2],
      ['رمز الذهب الكيميائي؟', ['Ag', 'Fe', 'Au', 'Gd'], 2],
      ['أكبر صحراء حارة في العالم؟', ['الكالاهاري', 'الصحراء الكبرى', 'جوبي', 'الربع الخالي'], 1],
      ['كم لاعب في فريق الكورة الأساسي؟', ['٩', '١٠', '١١', '١٢'], 2],
      ['عاصمة أستراليا؟', ['سيدني', 'ملبورن', 'كانبرا', 'بيرث'], 2],
      ['أصغر دولة في العالم؟', ['موناكو', 'الفاتيكان', 'مالطا', 'البحرين'], 1],
      ['اللغة الأكثر تحدثًا في العالم كلغة أم؟', ['الإنجليزية', 'الهندية', 'الإسبانية', 'الصينية'], 3],
      ['سنة وصول الإنسان للقمر؟', ['١٩٥٩', '١٩٦٥', '١٩٦٩', '١٩٧٢'], 2],
      ['أكبر جزيرة في العالم؟', ['مدغشقر', 'جرينلاند', 'بورنيو', 'سومطرة'], 1],
      ['مخترع المصباح الكهربائي؟', ['تسلا', 'إديسون', 'بيل', 'نيوتن'], 1]
    ];
    var KEY = 'lingua_qotd_day';
    var dayIdx = Math.floor(Date.now() / 86400000) % Q.length;
    var q = Q[dayIdx];
    var card = document.getElementById('qotdCard');
    function answered(){ try { return localStorage.getItem(KEY) === new Date().toDateString(); } catch(e){ return false; } }
    function render(){
      if(answered()){
        card.innerHTML = '<h3>💡 جاوبتي سؤال النهارده ✅</h3><p style="color:var(--muted)">ارجعي بكرة لسؤال جديد ومكافأة جديدة 🎁</p>';
        return;
      }
      card.innerHTML = '<h3 style="line-height:1.7">' + q[0] + '</h3>' + q[1].map(function(o, i){
        return '<button class="btn" style="width:100%;margin-bottom:8px;background:rgba(255,255,255,.06)" data-qo="' + i + '">' + o + '</button>';
      }).join('');
      card.querySelectorAll('[data-qo]').forEach(function(b){
        b.addEventListener('click', function(){
          try { localStorage.setItem(KEY, new Date().toDateString()); } catch(e){}
          if(+b.dataset.qo === q[2]){
            b.style.background = 'rgba(46,160,67,.4)';
            awardPoints(15, 'سؤال اليوم 💡');
            confetti();
            setTimeout(render, 1200);
          } else {
            b.style.background = 'rgba(220,60,60,.35)';
            toast('غلط — الإجابة الصح: ' + q[1][q[2]] + ' 💛');
            setTimeout(render, 1500);
          }
        });
      });
    }
    render();
  })();

  /* ---- jokes corner ---- */
  (function(){
    var J = {
      en: [
        ['Why did the student eat his homework? Because the teacher said it was a piece of cake!', 'ليه الطالب كل واجبه؟ عشان المدرّسة قالت إنه "قطعة كيك" — يعني سهل جدًا 😂'],
        ['What do you call a fish without eyes? A fsh!', 'سمكة من غير عيون (eyes) تتقال إيه؟ "فش" — شيلنا حرف الـ i من fish 😂'],
        ['Why is the computer cold? It left its Windows open!', 'ليه الكمبيوتر عيان من البرد؟ ساب "الويندوز" مفتوح — نوافذ ونظام تشغيل في نفس الوقت 😂'],
        ['What did one wall say to the other? I will meet you at the corner!', 'الحيطة قالت لصاحبتها: هقابلك عند "الركن" — corner يعني ركن وزاوية 😂']
      ],
      fr: [
        ['Pourquoi les plongeurs plongent-ils toujours en arrière? Parce que sinon ils tombent dans le bateau!', 'ليه الغطاسين بينزلوا دايمًا ضهرهم للمية؟ عشان لو نزلوا قدام هيقعوا جوه المركب 😂'],
        ['Que dit une imprimante dans l\'eau? J\'ai papier!', 'الطابعة بتقول إيه في المية؟ "J\'ai papier" — عندي ورق، وصوتها زي "je ne sais pas" مش عارف 😂'],
        ['Quel est le comble pour un électricien? Ne pas être au courant!', 'قمة ما يحصل لكهربائي؟ إنه "مش واخد باله" — au courant يعني مطّلع ويعني فيه تيار كهربي 😂']
      ],
      de: [
        ['Warum können Geister so schlecht lügen? Weil man durch sie hindurchsehen kann!', 'ليه الأشباح وحشين في الكدب؟ عشان تقدر "تشوف من خلالهم" — شفافين حرفيًا 😂'],
        ['Was ist schwarz-weiß und sitzt auf der Schaukel? Ein Schwinguin!', 'إيه الأبيض-في-أسود اللي قاعد على الأرجوحة؟ "شفينجوين" — دمج Schaukel (أرجوحة) مع Pinguin (بطريق) 😂'],
        ['Was macht ein Mathematiker im Garten? Wurzeln ziehen!', 'الرياضي بيعمل إيه في الجنينة؟ "بيجدّر" — Wurzeln ziehen يعني يقلع الجذور ويعني يحسب الجذر التربيعي 😂']
      ],
      zh: [
        ['有一天，面条遇到了肉包，它们打了一架。因为肉包"有馅"！', 'النودلز اتخانقت مع الباوزي المحشي... عشان "عنده حشوة" — 有馅 (عنده حشوة) صوتها زي 有闲 (فاضي) 😂'],
        ['老师：为什么你的作业上有牛奶？学生：因为你说要"喝"书！', 'المدرس: ليه واجبك عليه لبن؟ الطالب: عشان قلتيلي "اشربي" الكتاب — لعب على كلمتي 喝 (يشرب) وقراءة الكتب 😂']
      ]
    };
    var cur = 'en', idx = 0;
    function render(){
      var j = J[cur][idx % J[cur].length];
      document.getElementById('jokeCard').innerHTML =
        '<div dir="ltr" style="font-size:1.05rem;line-height:1.8;font-weight:700;margin-bottom:12px">' + j[0] + '</div>' +
        '<div style="color:var(--gold);border-top:1px dashed rgba(212,175,55,.4);padding-top:12px;line-height:1.8">' + j[1] + '</div>';
    }
    document.getElementById('jokeLangs').addEventListener('click', function(e){
      var b = e.target.closest('[data-jl]'); if(!b) return;
      document.querySelectorAll('#jokeLangs .corner-flag').forEach(function(x){ x.classList.toggle('active', x === b); });
      cur = b.dataset.jl; idx = 0; render();
    });
    document.getElementById('jokeNext').addEventListener('click', function(){ idx++; render(); });
    render();
  })();

  /* ---- mood suggester ---- */
  (function(){
    var MOODS = [
      ['😊', 'مبسوطة', [['corners', '🌍 جربي ركن لغة جديدة'], ['wheel', '🎡 لفّي عجلة الحظ'], ['songs', '🎵 اسمعي أغاني']]],
      ['😴', 'كسلانة', [['today', '💎 كلمات اليوم بس — خفيف'], ['jokes', '😂 نكتة تفرفشك'], ['music', '🎧 استمعي لحاجة هادية']]],
      ['💪', 'نشيطة', [['quiz', '📝 ادخلي اختبار وكسريه'], ['snake', '🐍 العبي الثعبان'], ['brain', '🧠 ألعاب ذكاء']]],
      ['😢', 'زعلانة', [['vent', '💭 فضفضي — هتحسي بتحسن'], ['mushaf', '📖 المصحف يريّح القلب'], ['deen', '🕌 ركن الروح']]],
      ['🤩', 'حماس', [['courses', '🎓 ابدئي كورس جديد'], ['scholar', '🏆 بصي على المنح'], ['games', '🎯 ألعاب اللغات']]],
      ['😌', 'هادية', [['gbk', '💌 سيبي كلمة لكارما'], ['tips', '💡 نصايح اللغات'], ['gallery', '📸 اتفرجي بالصور']]]
    ];
    document.getElementById('moodGrid').innerHTML = MOODS.map(function(m, i){
      return '<a class="menu-card" data-mood="' + i + '" style="cursor:pointer"><span class="m-ico">' + m[0] + '</span><span class="m-name">' + m[1] + '</span></a>';
    }).join('');
    document.getElementById('moodGrid').addEventListener('click', function(e){
      var c = e.target.closest('[data-mood]'); if(!c) return;
      var m = MOODS[+c.dataset.mood];
      document.getElementById('moodSugg').innerHTML =
        '<div class="acc-card" style="max-width:440px"><h3>' + m[0] + ' طالما إنتي ' + m[1] + '... جربي:</h3>' +
        m[2].map(function(x){ return '<a class="btn" href="#' + x[0] + '" style="display:block;margin-bottom:8px;text-decoration:none">' + x[1] + '</a>'; }).join('') +
        '</div>';
      awardPoints(1, 'عرفتينا مودك 🧘‍♀️');
    });
  })();

  /* ---- snake ---- */
  (function(){
    var cv = document.getElementById('snakeCv'), ctx = cv.getContext('2d');
    var N = 20, S = 16, snake, dir, next, food, alive = false, speed, lastT, score;
    function reset(){
      snake = [[10, 10], [9, 10], [8, 10]]; dir = [1, 0]; next = [1, 0]; score = 0; speed = 170;
      placeFood(); draw();
      document.getElementById('snakeScore').textContent = '0 🍎';
    }
    function placeFood(){
      while(true){
        food = [Math.floor(Math.random() * N), Math.floor(Math.random() * N)];
        if(!snake.some(function(s){ return s[0] === food[0] && s[1] === food[1]; })) break;
      }
    }
    function draw(){
      ctx.fillStyle = 'rgba(8,6,14,.9)'; ctx.fillRect(0, 0, 320, 320);
      ctx.fillStyle = '#e0483e';
      ctx.beginPath(); ctx.arc(food[0] * S + 8, food[1] * S + 8, 7, 0, 7); ctx.fill();
      snake.forEach(function(s, i){
        ctx.fillStyle = i === 0 ? '#d4af37' : 'rgba(212,175,55,' + (0.85 - i / snake.length * 0.5) + ')';
        ctx.beginPath(); ctx.roundRect(s[0] * S + 1, s[1] * S + 1, S - 2, S - 2, 4); ctx.fill();
      });
    }
    function step(){
      dir = next;
      var h = [snake[0][0] + dir[0], snake[0][1] + dir[1]];
      if(h[0] < 0 || h[0] >= N || h[1] < 0 || h[1] >= N || snake.some(function(s){ return s[0] === h[0] && s[1] === h[1]; })){
        alive = false;
        toast('خسرتي! نتيجتك: ' + score + ' 🍎 — جربي تاني 🐍');
        if(score >= 5) confetti();
        return;
      }
      snake.unshift(h);
      if(h[0] === food[0] && h[1] === food[1]){
        score++;
        document.getElementById('snakeScore').textContent = score + ' 🍎';
        awardPoints(2, 'تفاحة ثعبان 🍎');
        if(speed > 80) speed -= 5;
        placeFood();
      } else snake.pop();
      draw();
    }
    function loop(ts){
      if(!alive) return;
      requestAnimationFrame(loop);
      if(ts - lastT < speed) return;
      lastT = ts; step();
    }
    function setDir(d){
      var m = {up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0]}[d];
      if(m && (m[0] !== -dir[0] || m[1] !== -dir[1])) next = m;
    }
    document.getElementById('snakeStart').addEventListener('click', function(){
      reset(); alive = true; lastT = performance.now(); requestAnimationFrame(loop);
    });
    document.getElementById('snakePad').addEventListener('click', function(e){
      var b = e.target.closest('[data-sd]'); if(b) setDir(b.dataset.sd);
    });
    document.addEventListener('keydown', function(e){
      var m = {ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right'}[e.key];
      if(m && document.getElementById('snake').classList.contains('view')) setDir(m);
    });
    var tx0 = 0, ty0 = 0;
    cv.addEventListener('touchstart', function(e){ tx0 = e.touches[0].clientX; ty0 = e.touches[0].clientY; }, {passive: true});
    cv.addEventListener('touchend', function(e){
      var dx = e.changedTouches[0].clientX - tx0, dy = e.changedTouches[0].clientY - ty0;
      if(Math.abs(dx) < 24 && Math.abs(dy) < 24) return;
      setDir(Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'right' : 'left') : (dy > 0 ? 'down' : 'up'));
    }, {passive: true});
    reset();
  })();

  /* ---- flashcards ---- */
  (function(){
    var LANGS = {en: 1, fr: 2, de: 3, zh: 4};
    var cur = 'en';
    function render(){
      var words = DICT[cur].slice().sort(function(){ return Math.random() - 0.5; }).slice(0, 8);
      document.getElementById('flashGrid').innerHTML = words.map(function(w){
        return '<div class="fcard" style="perspective:600px;cursor:pointer;height:110px">' +
          '<div class="fcard-in" style="position:relative;width:100%;height:100%;transition:transform .5s;transform-style:preserve-3d">' +
          '<div style="position:absolute;inset:0;backface-visibility:hidden;background:linear-gradient(135deg,rgba(212,175,55,.22),rgba(212,175,55,.07));border:1px solid rgba(212,175,55,.45);border-radius:14px;display:flex;align-items:center;justify-content:center;font-weight:900;font-size:1.05rem;padding:8px;text-align:center" dir="ltr">' + w[0] + '</div>' +
          '<div style="position:absolute;inset:0;backface-visibility:hidden;transform:rotateY(180deg);background:rgba(255,255,255,.07);border:1px solid rgba(212,175,55,.3);border-radius:14px;display:flex;align-items:center;justify-content:center;font-weight:800;color:var(--gold);padding:8px;text-align:center">' + w[1] + '</div>' +
          '</div></div>';
      }).join('');
      document.querySelectorAll('#flashGrid .fcard').forEach(function(c){
        c.addEventListener('click', function(){
          var inn = c.firstElementChild;
          inn.style.transform = inn.style.transform === 'rotateY(180deg)' ? '' : 'rotateY(180deg)';
        });
      });
    }
    document.getElementById('flashLangs').addEventListener('click', function(e){
      var b = e.target.closest('[data-fl]'); if(!b) return;
      document.querySelectorAll('#flashLangs .corner-flag').forEach(function(x){ x.classList.toggle('active', x === b); });
      cur = b.dataset.fl; render();
    });
    document.getElementById('flashShuffle').addEventListener('click', function(){ render(); awardPoints(1, 'كروت جديدة 🃏'); });
    render();
  })();
})();


;


/* ================= v13: learning map, personality quiz, XO, korean ================= */
(function(){
  /* ---- learning map ---- */
  var MAP_LVLS = [['beg','🌱','مبتدئ','أساسيات وكلمات يومية'],['mid','🌿','متوسط','جمل ومحادثات'],['adv','🔥','متقدم','قواعد وتعبيرات'],['pro','💎','محترف','طلاقة حقيقية']];
  var mapLang = 'en';
  function mapPassed(lang, lvl){
    var best = parseInt(localStorage.getItem('lingua_best_'+lang+'_'+lvl)||'0',10);
    var total = (typeof QUIZZES!=='undefined' && QUIZZES[lang] && QUIZZES[lang][lvl]) ? QUIZZES[lang][lvl].length : 10;
    return best >= Math.ceil(total*0.7);
  }
  function renderMap(){
    var done = MAP_LVLS.filter(function(l){return mapPassed(mapLang,l[0]);}).length;
    var html = '<div class="map-bar"><i style="width:'+(done/4*100)+'%"></i></div>';
    var unlocked = true;
    MAP_LVLS.forEach(function(l){
      var passed = mapPassed(mapLang, l[0]);
      var state = passed ? 'done' : (unlocked ? '' : 'locked');
      var ico = passed ? '✅' : (unlocked ? l[1] : '🔒');
      html += '<div class="map-node '+state+'"><div class="mn-ico">'+ico+'</div><div class="mn-t"><b>'+l[2]+'</b><span>'+l[3]+'</span></div>'+
        (state==='locked' ? '' : '<a class="mn-go" href="#quiz">'+(passed?'أعيدي':'ابدئي')+'</a>')+'</div><div class="map-link"></div>';
      unlocked = passed;
    });
    document.getElementById('mapPath').innerHTML = html;
  }
  document.querySelectorAll('#mapTabs .tab').forEach(function(t){
    t.addEventListener('click', function(){
      document.querySelectorAll('#mapTabs .tab').forEach(function(x){x.classList.remove('active');});
      t.classList.add('active'); mapLang = t.dataset.mlang; renderMap();
    });
  });
  renderMap();

  /* ---- personality quiz ---- */
  var PQ = [
    {q:'مثالية ولا عفوية؟ 😌', a:[['منظمة ودقيقة 📐','de'],['عفوية وحرة 🦋','fr']]},
    {q:'قهوتك إزاي؟ ☕', a:[['إسبريسو سريع ☕','en'],['قهوة رايقة مع حلويات 🥐','fr']]},
    {q:'اختاري أجواء سفر ✈️', a:[['مدن عملاقة وطاقة 🌆','zh'],['طبيعة وهدوء وتقليد 🏯','ko']]},
    {q:'موسيقاك المفضلة 🎵', a:[['بوب عالمي 🎤','en'],['كيبوب وكيدراما 💜','ko']]},
    {q:'أسلوبك في الشغل 💼', a:[['هندسة ونظام ⚙️','de'],['إبداع وفن 🎨','zh']]},
    {q:'كلمة توصفك ✨', a:[['أنيقة وراقية 👗','fr'],['عملية ومباشرة 💪','en']]},
    {q:'فيلمك المفضل 🎬', a:[['رومانسي حالم 💕','ko'],['أكشن ومغامرة 🎥','en']]},
    {q:'أكلة تجربيها 🍜', a:[['نودلز وسوشي 🍜','zh'],['مخبوزات وجبن 🧀','de']]}
  ];
  var PQ_RES = {
    en:['🇬🇧','الإنجليزية','شخصيتك عملية وطموحة — الإنجليزية مفتاحك للعالم كله 🌍'],
    fr:['🇫🇷','الفرنسية','روحك رومانسية وأنيقة — الفرنسية لغة تليق بذوقك 🥐'],
    de:['🇩🇪','الألمانية','عقلك منظم ودقيق — الألمانية تحدي هتعشقيه ⚙️'],
    zh:['🇨🇳','الصينية','فضولك بيكبر — الصينية مغامرة مختلفة تمامًا 🐉'],
    ko:['🇰🇷','الكورية','قلبك مع الكيدراما — الكورية أقرب لروحك مما تتخيلي 💜']
  };
  var pqI = 0, pqScore = {};
  function pqRender(){
    var c = document.getElementById('pqCard');
    if(pqI >= PQ.length){
      var win = 'en', mx = -1;
      Object.keys(pqScore).forEach(function(k){ if(pqScore[k]>mx){mx=pqScore[k];win=k;} });
      var r = PQ_RES[win];
      c.innerHTML = '<div style="text-align:center"><div style="font-size:3.4rem">'+r[0]+'</div><h3 style="color:var(--gold);margin:10px 0 6px">لغتك: '+r[1]+'</h3><p style="color:var(--muted);font-size:.9rem;line-height:1.8">'+r[2]+'</p><div style="display:flex;gap:10px;justify-content:center;margin-top:14px;flex-wrap:wrap"><a class="btn" href="#corners" style="text-decoration:none">🌍 ابدئي رحلتها</a><button class="btn" id="pqRetry" style="background:rgba(255,255,255,.08)">🔮 جربي تاني</button></div></div>';
      if(!localStorage.getItem('lingua_pq_done')){
        try{ localStorage.setItem('lingua_pq_done','1'); if(window.awardPoints) awardPoints(10,'اختبار الشخصية 🔮'); }catch(e){}
      }
      var rb = document.getElementById('pqRetry');
      if(rb) rb.addEventListener('click', function(){ pqI=0; pqScore={}; pqRender(); });
      return;
    }
    var q = PQ[pqI];
    c.innerHTML = '<div style="text-align:center;margin-bottom:14px;color:var(--muted);font-size:.8rem">سؤال '+(pqI+1)+' من '+PQ.length+'</div><h3 style="text-align:center;color:#fff;margin:0 0 18px;font-size:1.1rem">'+q.q+'</h3>'+
      q.a.map(function(a,i){ return '<button class="btn pq-opt" data-k="'+a[1]+'" style="display:block;width:100%;margin-bottom:10px;background:rgba(255,255,255,.07)">'+a[0]+'</button>'; }).join('');
    c.querySelectorAll('.pq-opt').forEach(function(b){
      b.addEventListener('click', function(){
        pqScore[b.dataset.k] = (pqScore[b.dataset.k]||0)+1;
        pqI++; pqRender();
      });
    });
  }
  pqRender();

  /* ---- XO vs computer ---- */
  var xoB, xoOver;
  function xoNew(){
    xoB = ['','','','','','','','','']; xoOver = false;
    document.getElementById('xoMsg').textContent = 'دورك يا بطلة — انتي ❌';
    xoDraw();
  }
  function xoDraw(){
    var bd = document.getElementById('xoBoard');
    bd.innerHTML = xoB.map(function(v,i){ return '<button class="xo-cell" data-i="'+i+'">'+(v==='X'?'❌':(v==='O'?'⭕':''))+'</button>'; }).join('');
    bd.querySelectorAll('.xo-cell').forEach(function(c){
      c.addEventListener('click', function(){ xoPlay(parseInt(c.dataset.i,10)); });
    });
  }
  function xoWinner(b){
    var L=[[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
    for(var i=0;i<L.length;i++){ var a=L[i][0],c=L[i][1],d=L[i][2]; if(b[a]&&b[a]===b[c]&&b[a]===b[d]) return [b[a],L[i]]; }
    return b.indexOf('')<0 ? ['draw',null] : null;
  }
  function xoAI(){
    var free = xoB.map(function(v,i){return v?null:i;}).filter(function(v){return v!==null;});
    function tryWin(me){
      for(var i=0;i<free.length;i++){ var b=xoB.slice(); b[free[i]]=me; var w=xoWinner(b); if(w&&w[0]===me) return free[i]; }
      return null;
    }
    return tryWin('O') ?? tryWin('X') ?? (xoB[4]===''?4:null) ?? free[Math.floor(Math.random()*free.length)];
  }
  function xoPlay(i){
    if(xoOver || xoB[i]) return;
    xoB[i]='X';
    var w = xoWinner(xoB);
    if(!w){ xoB[xoAI()]='O'; w = xoWinner(xoB); }
    xoDraw();
    if(w){
      xoOver = true;
      if(w[1]) w[1].forEach(function(j){ document.querySelectorAll('.xo-cell')[j].classList.add('win'); });
      var msg = document.getElementById('xoMsg');
      if(w[0]==='X'){ msg.textContent = 'برافو! كسبتي 🎉'; if(window.awardPoints) awardPoints(15,'إكس أو ⭕'); }
      else if(w[0]==='O'){ msg.textContent = 'الكمبيوتر كسب 😅 حظ أوفر المرة الجاية'; }
      else { msg.textContent = 'تعادل! 🤝'; if(window.awardPoints) awardPoints(5,'تعادل إكس أو'); }
    }
  }
  var xa = document.getElementById('xoAgain');
  if(xa) xa.addEventListener('click', xoNew);
  xoNew();

  /* ---- korean corner ---- */
  var KR = {
    greet: [['안녕하세요','annyeonghaseyo','أهلاً (رسمي) 👋'],['안녕','annyeong','أهلاً (كاجوال) 😊'],['감사합니다','gamsahamnida','شكرًا 🙏'],['사랑해','saranghae','بحبك 💜'],['잘자','jalja','تصبحي على خير 🌙'],['화이팅','hwaiting','يلا بينا / شدي حيلك 💪'],['미안해','mianhae','آسفة 🥺'],['맛있어','masisseo','جميل/لذيذ 😋']],
    hangul: [['ㅏ','a','حرف A'],['ㅓ','eo','حرف O مقلوب'],['ㅗ','o','حرف O'],['ㅜ','u','حرف U'],['ㅡ','eu','صوت وسطي'],['ㅣ','i','حرف I'],['ㄱ','g/k','جيم كورية'],['ㄴ','n','نون'],['ㄷ','d/t','دال'],['ㄹ','r/l','راء/لام'],['ㅁ','m','ميم'],['ㅂ','b/p','باء'],['ㅅ','s','سين'],['ㅇ','ng/silent','صامت أو نج'],['ㅈ','j','جيم'],['ㅎ','h','هاء']],
    num: [['하나','hana','١'],['둘','dul','٢'],['셋','set','٣'],['넷','net','٤'],['다섯','daseot','٥'],['여섯','yeoseot','٦'],['일곱','ilgop','٧'],['여덟','yeodeol','٨'],['아홉','ahop','٩'],['열','yeol','١٠']]
  };
  function krSay(t){ try{ var u=new SpeechSynthesisUtterance(t); u.lang='ko-KR'; u.rate=.85; speechSynthesis.cancel(); speechSynthesis.speak(u); }catch(e){} }
  function renderKR(tab){
    var w = document.getElementById('krWrap');
    if(tab==='kpop'){
      w.innerHTML = '<div class="gbk-empty" style="text-align:center;padding:20px;color:var(--muted)">بنجيب أحدث الكيبوب... 🎧</div>';
      fetch('https://itunes.apple.com/search?term=kpop&media=music&limit=8&entity=song').then(function(r){return r.json();}).then(function(d){
        if(!d.results || !d.results.length) throw 0;
        w.innerHTML = d.results.map(function(t){
          return '<div class="kr-card"><img src="'+t.artworkUrl60+'" style="width:48px;height:48px;border-radius:12px" alt=""><div><b style="font-size:.92rem">'+t.trackName+'</b><div class="kr-sub">'+t.artistName+'</div></div><button class="kr-say kr-play" data-u="'+t.previewUrl+'">▶️</button></div>';
        }).join('');
        w.querySelectorAll('.kr-play').forEach(function(b){ b.addEventListener('click', function(){ new Audio(b.dataset.u).play().catch(function(){}); }); });
      }).catch(function(){ w.innerHTML = '<div class="gbk-empty" style="text-align:center;padding:20px;color:var(--muted)">النت مش متاح دلوقتي — جربي تاني بعدين 🎧</div>'; });
      return;
    }
    w.innerHTML = KR[tab].map(function(x){
      return '<div class="kr-card"><div class="kr-word">'+x[0]+'</div><div><b style="font-size:.9rem">'+x[2]+'</b><div class="kr-sub" dir="ltr">'+x[1]+'</div></div><button class="kr-say" data-w="'+x[0]+'">🔊</button></div>';
    }).join('');
    w.querySelectorAll('.kr-say').forEach(function(b){ b.addEventListener('click', function(){ krSay(b.dataset.w); }); });
  }
  document.querySelectorAll('#krTabs .tab').forEach(function(t){
    t.addEventListener('click', function(){
      document.querySelectorAll('#krTabs .tab').forEach(function(x){x.classList.remove('active');});
      t.classList.add('active'); renderKR(t.dataset.kr);
    });
  });
  renderKR('greet');
})();

;

/* v14: PWA install + offline */
(function(){
  if('serviceWorker' in navigator){
    navigator.serviceWorker.register('sw.js').then(function(reg){
      reg.addEventListener('updatefound', function(){
        var nw = reg.installing;
        if(!nw) return;
        nw.addEventListener('statechange', function(){
          if(nw.state === 'activated' && navigator.serviceWorker.controller){
            try{ if(window.toast) toast('نسخة جديدة اتثبتت — حدثي الصفحة ✨'); }catch(e){}
          }
        });
      });
    }).catch(function(){});
    var reloaded = false;
    navigator.serviceWorker.addEventListener('controllerchange', function(){
      if(reloaded) return; reloaded = true;
      try{ location.reload(); }catch(e){}
    });
  }
  var deferredPrompt = null;
  window.addEventListener('beforeinstallprompt', function(e){
    e.preventDefault(); deferredPrompt = e;
    if(document.getElementById('pwaBanner') || localStorage.getItem('lingua_pwa_dismiss')) return;
    var b = document.createElement('div');
    b.id = 'pwaBanner';
    b.style.cssText = 'position:fixed;bottom:86px;left:50%;transform:translateX(-50%);z-index:70;background:linear-gradient(135deg,#1c1530,#14101c);border:1px solid rgba(212,175,55,.55);border-radius:18px;padding:12px 18px;display:flex;gap:10px;align-items:center;box-shadow:0 10px 40px rgba(0,0,0,.6);max-width:92vw';
    b.innerHTML = '<span style="font-size:.85rem;font-weight:700">نزلي Lingua كتطبيق على موبايلك 📲</span><button class="btn" id="pwaGo" style="padding:8px 16px;font-size:.8rem">تثبيت ✨</button><button id="pwaNo" style="background:none;border:none;color:var(--muted);font-size:1.1rem;cursor:pointer;padding:4px">✕</button>';
    document.body.appendChild(b);
    document.getElementById('pwaGo').onclick = function(){ b.remove(); if(deferredPrompt){ deferredPrompt.prompt(); deferredPrompt = null; } };
    document.getElementById('pwaNo').onclick = function(){ b.remove(); try{ localStorage.setItem('lingua_pwa_dismiss','1'); }catch(e){} };
  });
})();

;

/* v15: certificates list in dash */
(function(){
  function renderCerts(){
    var el = document.getElementById('dashCerts');
    if(!el) return;
    var LN = {en:'🇬🇧 الإنجليزية', fr:'🇫🇷 الفرنسية', de:'🇩🇪 الألمانية', zh:'🇨🇳 الصينية', ko:'🇰🇷 الكورية'};
    var LV = {beg:'المبتدئ', mid:'المتوسط', adv:'المتقدم', pro:'المحترف 💎'};
    var out = [];
    Object.keys(LN).forEach(function(l){
      Object.keys(LV).forEach(function(v){
        var best = parseInt(localStorage.getItem('lingua_best_'+l+'_'+v)||'-1',10);
        var total = (typeof QUIZZES!=='undefined' && QUIZZES[l] && QUIZZES[l][v]) ? QUIZZES[l][v].length : 5;
        if(best >= total) out.push([l, v]);
      });
    });
    if(!out.length){
      el.innerHTML = '<div class="gbk-empty" style="text-align:center;color:var(--muted);padding:16px">جيبي علامة كاملة في أي اختبار وهتلاقي شهادتك الجاهزة للتحميل PDF هنا 🎓✨</div>';
      return;
    }
    el.innerHTML = out.map(function(c){
      return '<div class="fr-item" style="max-width:520px;margin:0 auto 10px"><div class="fr-av">🎓</div><div class="fr-name">' + LN[c[0]] + '<div style="color:var(--muted);font-size:.72rem">المستوى ' + LV[c[1]] + '</div></div><button class="btn" style="padding:7px 14px;font-size:.8rem" data-cert-l="' + c[0] + '" data-cert-v="' + c[1] + '">📥 الشهادة</button></div>';
    }).join('');
    el.querySelectorAll('[data-cert-l]').forEach(function(b){
      b.onclick = function(){ showCert(b.dataset.certL, b.dataset.certV); };
    });
  }
  var oldRefresh = window.refreshDash;
  window.refreshDash = function(){ if(oldRefresh) oldRefresh(); renderCerts(); };
  renderCerts();
})();

// ================= v28: places + premium =================
(function(){
  var PLACES = {
    en:{name:'إنجلترا 🇬🇧',spots:[
      {f:'Clock_Tower_-_Palace_of_Westminster,_London_-_September_2006.jpg',n:'Big Ben',a:'بيج بن',c:'لندن'},
      {f:'Tower_Bridge_London_Feb_2006.jpg',n:'Tower Bridge',a:'برج لندن المتحرك',c:'لندن'},
      {f:'London_Eye_Twilight_April_2006.jpg',n:'London Eye',a:'عين لندن',c:'لندن'},
      {f:'Buckingham_Palace_from_gardens,_London,_UK_-_Diliff.jpg',n:'Buckingham Palace',a:'قصر باكنجهام',c:'لندن'}]},
    fr:{name:'فرنسا 🇫🇷',spots:[
      {f:'Tour_Eiffel_Wikimedia_Commons.jpg',n:'Tour Eiffel',a:'برج إيفل',c:'باريس'},
      {f:'Louvre_Museum_Wikimedia_Commons.jpg',n:'Musée du Louvre',a:'متحف اللوفر',c:'باريس'},
      {f:'Arc_de_Triomphe,_Paris_21_October_2010.jpg',n:"Arc de Triomphe",a:'قوس النصر',c:'باريس'},
      {f:'Mont-Saint-Michel_vu_du_ciel.jpg',n:'Mont Saint-Michel',a:'مون سان ميشيل',c:'نورماندي'}]},
    de:{name:'ألمانيا 🇩🇪',spots:[
      {f:'Brandenburger_Tor_abends.jpg',n:'Brandenburger Tor',a:'بوابة براندنبورج',c:'برلين'},
      {f:'Schloss_Neuschwanstein_2013.jpg',n:'Schloss Neuschwanstein',a:'قلعة نويشفانشتاين',c:'بافاريا'},
      {f:'Koelner_Dom_bei_Nacht.jpg',n:'Kölner Dom',a:'كاتدرائية كولونيا',c:'كولونيا'},
      {f:'Reichstag_building_Berlin_view_from_west_before_sunset.jpg',n:'Reichstag',a:'مبنى الرايخستاج',c:'برلين'}]},
    zh:{name:'الصين 🇨🇳',spots:[
      {f:'Great_Wall_of_China_July_2006.JPG',n:'长城 (Chángchéng)',a:'سور الصين العظيم',c:'بكين'},
      {f:'Forbidden_City_Beijing_Shenwumen_Gate.JPG',n:'故宫 (Gùgōng)',a:'المدينة المحرمة',c:'بكين'},
      {f:'Terracotta_Army,_View_of_Pit_1.jpg',n:'兵马俑 (Bīngmǎyǒng)',a:'جيش التيراكوتا',c:'شيان'},
      {f:'Shanghai_-_Nanjing_Road.jpeg',n:'南京路 (Nánjīng Lù)',a:'شارع نانجينج',c:'شنغهاي'}]},
    ko:{name:'كوريا 🇰🇷',spots:[
      {f:'Gyeongbokgung_Geunjeongjeon.jpg',n:'경복궁 (Gyeongbokgung)',a:'قصر جيونجبوك',c:'سيول'},
      {f:'N_Seoul_Tower_Panorama_Night_(cropped).jpg',n:'N서울타워 (N Seoul Tower)',a:'برج إن سيول',c:'سيول'},
      {f:'Jeju_Island.jpg',n:'제주도 (Jeju-do)',a:'جزيرة جيجو',c:'جيجو'},
      {f:'Seongsan_Ilchulbong.jpg',n:'성산일출봉 (Seongsan Ilchulbong)',a:'قمة شروق الشمس',c:'جيجو'}]}
  };
  var pl=document.getElementById('placeLangs'), pg=document.getElementById('placeGrid');
  if(pl&&pg){
    var cur='en';
    function renderP(){
      pl.innerHTML=Object.keys(PLACES).map(function(k){
        return '<button class="tab lang-tab'+(k===cur?' active':'')+'" data-pl="'+k+'"><span class="ln">'+PLACES[k].name+'</span></button>';
      }).join('');
      pg.innerHTML=PLACES[cur].spots.map(function(sp){
        var u='https://commons.wikimedia.org/wiki/Special:FilePath/'+sp.f+'?width=400';
        return '<div class="place-card"><img loading="lazy" src="'+u+'" alt="'+sp.a+'"><h4>'+sp.n+'</h4><p class="par">'+sp.a+' — '+sp.c+'</p></div>';
      }).join('');
      pl.querySelectorAll('[data-pl]').forEach(function(b){ b.onclick=function(){ cur=b.getAttribute('data-pl'); renderP(); }; });
    }
    renderP();
  }
  document.querySelectorAll('[data-prem]').forEach(function(b){
    b.onclick=function(){ if(window.toast) toast('الاشتراك جاي قريب جدًا 👑💛'); };
  });
})();


/* ================= v36: daily reminder opt-in (web push) ================= */
(function(){
  var VAPID_PUBLIC="BIoJA8cl-2Rx9ewmvgRwwBx7otSdTIaZO6IITCfCFRRtKjTdZ6XxsQn4rpxoMoE_aQjnNgo3Pf1ewukgkY_01pk";
  var SUPA='https://yzzlgalxjaaevmytdazf.supabase.co';
  var ANON='sb_publishable_EmbKVWREHSs3sZ_nBKFyqg_zxv3Z38-';
  var btn=document.getElementById('remToggle'); if(!btn) return;
  var KEY='lingua_push_on';
  function isOn(){ return localStorage.getItem(KEY)==='1'; }
  function render(){ btn.textContent=isOn()?'إيقاف التذكير 🔕':'فعّلي التذكير 🔔'; btn.classList.toggle('on',isOn()); }
  function b64ToU8(b){ var p='='.repeat((4-b.length%4)%4); var raw=atob((b+p).replace(/-/g,'+').replace(/_/g,'/')); var a=new Uint8Array(raw.length); for(var i=0;i<raw.length;i++)a[i]=raw.charCodeAt(i); return a; }
  async function enable(){
    if(!('serviceWorker' in navigator)||!('PushManager' in window)||!('Notification' in window)){ toast('المتصفح ده مش بيدعم الإشعارات 🥺'); return; }
    var perm=await Notification.requestPermission();
    if(perm!=='granted'){ toast('الإشعارات متقفولة من المتصفح — فعّليها من إعدادات المتصفح الأول'); return; }
    try{
      var reg=await navigator.serviceWorker.ready;
      var sub=await reg.pushManager.subscribe({userVisibleOnly:true, applicationServerKey:b64ToU8(VAPID_PUBLIC)});
      var j=sub.toJSON();
      var r=await fetch(SUPA+'/rest/v1/push_subscriptions',{method:'POST',headers:{'apikey':ANON,'Authorization':'Bearer '+ANON,'Content-Type':'application/json','Prefer':'resolution=merge-duplicates'},body:JSON.stringify({endpoint:j.endpoint,p256dh:j.keys.p256dh,auth:j.keys.auth})});
      if(!r.ok) throw 0;
      localStorage.setItem(KEY,'1'); render(); toast('تمام! هنفتكرك كل يوم ٦ مساءً 💜');
    }catch(e){ toast('حصلت مشكلة — جربي تاني 🥺'); }
  }
  async function disable(){
    try{
      var reg=await navigator.serviceWorker.ready;
      var sub=await reg.pushManager.getSubscription();
      if(sub){
        await fetch(SUPA+'/rest/v1/push_subscriptions?endpoint=eq.'+encodeURIComponent(sub.endpoint),{method:'DELETE',headers:{'apikey':ANON,'Authorization':'Bearer '+ANON}});
        await sub.unsubscribe();
      }
    }catch(e){}
    localStorage.setItem(KEY,'0'); render(); toast('وقّفنا التذكير — تقدري ترجّعيه أي وقت');
  }
  btn.addEventListener('click',function(){ isOn()?disable():enable(); });
  render();
})();

/* ================= v37: Duolingo-style learning path ================= */
(function(){
  var PATH_UNITS = ['family','colors','animals','time','school','feelings','food2','places2','transport','sports','work','weather2','health','tech','nature','travel'];
  var LIDX = {en:0, fr:1, de:2, zh:3, ko:4};
  var TTS = {en:'en-US', fr:'fr-FR', de:'de-DE', zh:'zh-CN', ko:'ko-KR'};
  var SENTS = {
    en: [['I','love','learning','languages'],['How','are','you','today'],['Thank','you','very','much'],['Good','morning','my','friend'],['Where','is','the','library'],['What','time','is','it'],['I','want','a','coffee'],['See','you','tomorrow'],['This','is','my','family'],['Where','do','you','live']],
    fr: [['Je','suis','très','content'],['Comment','ça','va'],['Merci','beaucoup','mon','ami'],['Bonjour','tout','le','monde'],['Où','est','la','gare'],['Il','fait','beau'],['Je','veux','un','café'],['À','demain','matin'],['Voici','ma','famille'],['Tu','habites','où']],
    de: [['Ich','lerne','gern','Deutsch'],['Wie','geht','es','dir'],['Danke','sehr','mein','Freund'],['Guten','Morgen','alle','zusammen'],['Wo','ist','der','Bahnhof'],['Es','ist','schönes','Wetter'],['Ich','möchte','einen','Kaffee'],['Bis','morgen','früh'],['Das','ist','meine','Familie'],['Wo','wohnst','du']],
    zh: [['我','爱','学习','语言'],['你','好','吗'],['非常','谢谢','你'],['早上好','朋友'],['图书馆','在','哪里'],['今天','天气','很好'],['我','想','喝','咖啡'],['明天','早上','见'],['这','是','我的','家人'],['你','住在','哪里']],
    ko: [['저는','언어를','배워요'],['잘','지내요'],['정말','고마워요'],['좋은','아침이에요'],['도서관이','어디예요'],['오늘','날씨가','좋아요'],['커피를','마시고','싶어요'],['내일','아침에','만나요'],['이건','제','가족이에요'],['어디에','살아요']]
  };
  var lang = 'en';
  function escH(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
  function shuf(a){ a=a.slice(); for(var i=a.length-1;i>0;i--){ var j=Math.floor(Math.random()*(i+1)); var t=a[i]; a[i]=a[j]; a[j]=t; } return a; }
  var NLESS = 5; /* lessons per unit; boss flag at index NLESS */
  function store(){
    try{
      var cur = JSON.parse(localStorage.getItem('lingua_path2_'+lang));
      if(cur) return cur;
      var old = JSON.parse(localStorage.getItem('lingua_path_'+lang));
      if(old){
        var mig = {};
        Object.keys(old).forEach(function(k){ var a=old[k]||[]; mig[k]=[a[0]||false,a[1]||false,a[2]||false,false,false,a[3]||false]; });
        localStorage.setItem('lingua_path2_'+lang, JSON.stringify(mig));
        localStorage.removeItem('lingua_path_'+lang);
        return mig;
      }
    }catch(e){}
    return {};
  }
  function saveS(s){ try{ localStorage.setItem('lingua_path2_'+lang, JSON.stringify(s)); }catch(e){} }
  function unitDone(s,key){ var a=s[key]||[]; for(var i=0;i<=NLESS;i++){ if(!a[i]) return false; } return true; }
  function unitOpen(s,u){ return u===0 || unitDone(s, PATH_UNITS[u-1]); }
  function say(t){ try{ var u=new SpeechSynthesisUtterance(t.replace(/ *\(.*?\)/g,'')); u.lang=TTS[lang]; u.rate=.85; speechSynthesis.cancel(); speechSynthesis.speak(u); }catch(e){} }
  function norm(s){ return String(s).toLowerCase().trim().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/ß/g,'ss').replace(/[.!?,؛،'’]/g,'').replace(/\s+/g,' '); }
  var HMAX=5, HREFILL_MS=30*60*1000, HK='lingua_hearts_v1';
  function getH(){
    var hh; try{ hh=JSON.parse(localStorage.getItem(HK))||null; }catch(e){ hh=null; }
    if(!hh || typeof hh.count!=='number') hh={count:HMAX, ts:Date.now()};
    var add=Math.floor((Date.now()-hh.ts)/HREFILL_MS);
    if(add>0){ hh.count=Math.min(HMAX, hh.count+add); hh.ts = hh.count>=HMAX ? Date.now() : hh.ts+add*HREFILL_MS; saveH(hh); }
    return hh;
  }
  function saveH(hh){ try{ localStorage.setItem(HK, JSON.stringify(hh)); }catch(e){} }
  function loseHeartGlobal(){ var hh=getH(); if(hh.count>=HMAX) hh.ts=Date.now(); hh.count=Math.max(0,hh.count-1); saveH(hh); return hh.count; }
  function nextHeartMin(){ var hh=getH(); if(hh.count>=HMAX) return 0; return Math.max(1, Math.ceil((hh.ts+HREFILL_MS-Date.now())/60000)); }
  function heartsLine(){
    var hh=getH();
    return '❤️ '+hh.count+'/'+HMAX+(hh.count<HMAX ? ' · قلب جديد بعد '+nextHeartMin()+' دقيقة ⏳' : ' · قلوبك كاملة ✨');
  }
  function badge(name){
    try{ var b=JSON.parse(localStorage.getItem('lingua_badges'))||[]; if(b.indexOf(name)<0){ b.push(name); localStorage.setItem('lingua_badges', JSON.stringify(b)); } }catch(e){}
  }

  function renderPath(){
    var VOC=window.VOCAB_THEMES||{}; var s = store();
    var doneCount = PATH_UNITS.filter(function(k){ return unitDone(s,k); }).length;
    var html = '<div class="map-bar"><i style="width:'+(doneCount/PATH_UNITS.length*100)+'%"></i></div>'
      + '<div class="path-count">🏅 '+doneCount+' / '+PATH_UNITS.length+' وحدة</div>'
      + '<div class="path-hearts" id="pathHearts">'+heartsLine()+'</div>';
    PATH_UNITS.forEach(function(key,u){
      var th = VOC[key]; if(!th) return;
      var st = s[key]||[false,false,false];
      var done = unitDone(s,key), open = unitOpen(s,u);
      var dots = []; for(var di=0;di<=NLESS;di++) dots.push('<i class="'+(st[di]?'on':'')+(di===NLESS?' boss':'')+'"></i>'); dots=dots.join('');
      html += '<div class="pu-row '+(u%2?'r':'l')+'">'
        + '<button class="pu-node '+(done?'done':open?'open':'locked')+'" data-punit="'+u+'"'+(open?'':' disabled')+'>'
        + '<span>'+(done?'🏅':(open?th.rows[0][6]:'🔒'))+'</span></button>'
        + '<div class="pu-info"><b>'+escH(th.name)+'</b><span class="pu-dots">'+dots+'</span></div></div>';
      if(open && !done){
        var bossOpen = true; for(var bi=0;bi<NLESS;bi++){ if(!st[bi]) bossOpen=false; }
        var lrow='';
        for(var l=0;l<NLESS;l++){
          var lopen = l===0 || st[l-1];
          lrow += '<button class="pl-btn '+(st[l]?'done':lopen?'open':'locked')+'" data-ulesson="'+u+':'+l+'"'+(lopen?'':' disabled')+'>'
            +(st[l]?'⭐':(lopen?'▶':'🔒'))+' '+(l+1)+'</button>';
        }
        html += '<div class="pu-lessons">'+lrow
        + '<button class="pl-btn boss '+(st[NLESS]?'done':bossOpen?'open':'locked')+'" data-uboss="'+u+'"'+(bossOpen?'':' disabled')+'>'
        + '👑</button></div>';
      }
    });
    document.getElementById('mapPath').innerHTML = html;
  }

  /* ---- lesson engine ---- */
  var LS = null;
  var overlay, plBody, plBar, plHearts;
  function distractors(w, pool, n){
    var others = shuf(pool.filter(function(x){ return x.f!==w.f; })).slice(0,n||3);
    while(others.length<(n||3)) others.push(others[others.length%(n||3)]||w);
    return others;
  }
  function mkMcq(w, pool, dir){
    return {type:'mcq', dir:dir, w:w, opts:shuf([w].concat(distractors(w, pool)))};
  }
  function mkListen(w, pool){
    return {type:'listen', w:w, opts:shuf([w].concat(distractors(w, pool)))};
  }
  function mkType(w){ return {type:'type', w:w}; }
  function mkOrder(ui){ var s = SENTS[lang][ui % SENTS[lang].length]; return {type:'order', tiles:shuf(s), ans:s, picked:[]}; }
  function mkMatch(ws){ return {type:'match', pairs:ws, f:shuf(ws), a:shuf(ws), sel:null, got:0}; }

  function row2w(r){ return {f:r[LIDX[lang]], a:r[5], e:r[6]}; }
  function themePool(key){ return ((window.VOCAB_THEMES||{})[key].rows||[]).map(row2w); }
  function pickWords(key, n, offset){
    var pool = themePool(key); var out = [];
    if(!pool.length) return out;
    for(var i=0;i<n;i++) out.push(pool[(offset+i)%pool.length]);
    return out;
  }
  function startBoss(ui){
    var key = PATH_UNITS[ui];
    var words = shuf(pickWords(key, 12, ui*3));
    var pool = themePool(key);
    var exs = [];
    for(var i=0;i<4;i++) exs.push(mkMcq(words[i], pool, 'f2a'));
    exs.push(mkMcq(words[4], pool, 'a2f')); exs.push(mkMcq(words[5], pool, 'a2f'));
    exs.push(mkListen(words[6], pool)); exs.push(mkListen(words[7], pool));
    exs.push((lang==='zh'||lang==='ko') ? mkListen(words[8], pool) : mkType(words[8]));
    exs.push(mkOrder(ui));
    LS = {ui:ui, li:NLESS, key:key, exs:exs, i:0, hearts:5, xp:0, boss:true, score:0};
    overlay.classList.add('show');
    document.body.style.overflow='hidden';
    renderEx();
  }
  function startLesson(ui, li){
    var hh=getH();
    if(hh.count<=0){ toast('قلوبك خلصت 💔 قلب جديد بعد '+nextHeartMin()+' دقيقة — أو جربي الاختبار 👑'); return; }
    var key = PATH_UNITS[ui];
    var words = pickWords(key, 8, li*6);
    var pool = themePool(key);
    var exs = [mkMcq(words[0],pool,'f2a'), mkMcq(words[1],pool,'a2f'), mkListen(words[2],pool)];
    exs.push((lang==='zh'||lang==='ko') ? mkListen(words[3],pool) : mkType(words[3]));
    exs.push(mkOrder(ui));
    exs.push(mkMatch(shuf(pool).slice(0,4)));
    LS = {ui:ui, li:li, key:key, exs:exs, i:0, hearts:hh.count, xp:0};
    overlay.classList.add('show');
    document.body.style.overflow='hidden';
    renderEx();
  }
  function drawTop(){
    plBar.style.width = (LS.i/LS.exs.length*100)+'%';
    plHearts.textContent = LS.boss ? ('👑 '+LS.score+' / '+LS.i) : ('❤️'.repeat(LS.hearts)+'🖤'.repeat(5-LS.hearts));
  }
  function correct(){ LS.xp+=10; if(LS.boss) LS.score++; if(window.awardPoints) awardPoints(10,'تمرين المسار 🚀'); }
  function advance(delay){
    setTimeout(function(){
      LS.i++;
      if(LS.i>=LS.exs.length) return LS.boss ? endBoss() : endLesson(true);
      renderEx();
    }, delay||900);
  }
  function renderEx(){
    drawTop();
    var ex = LS.exs[LS.i];
    if(ex.type==='mcq' && ex.dir==='f2a'){
      plBody.innerHTML = '<div class="pl-q">إيه معنى <b class="pl-w">'+escH(ex.w.e)+' '+escH(ex.w.f)+'</b>؟</div><button class="pl-say" id="plSay">🔊 اسمعيها</button>'
        + '<div class="pl-opts">'+ex.opts.map(function(o,i){ return '<button class="pl-opt" data-o="'+i+'">'+escH(o.a)+'</button>'; }).join('')+'</div>';
      document.getElementById('plSay').addEventListener('click', function(){ say(ex.w.f); });
      bindOpts(ex.opts.indexOf(ex.w));
    } else if(ex.type==='mcq'){
      plBody.innerHTML = '<div class="pl-q">اختاري ترجمة <b class="pl-w">'+escH(ex.w.a)+'</b></div>'
        + '<div class="pl-opts">'+ex.opts.map(function(o,i){ return '<button class="pl-opt" data-o="'+i+'">'+escH(o.e)+' '+escH(o.f)+'</button>'; }).join('')+'</div>';
      bindOpts(ex.opts.indexOf(ex.w));
    } else if(ex.type==='listen'){
      plBody.innerHTML = '<div class="pl-q">اسمعي واختاري الكلمة الصح 🎧</div><button class="pl-say big" id="plSay">🔊</button>'
        + '<div class="pl-opts">'+ex.opts.map(function(o,i){ return '<button class="pl-opt" data-o="'+i+'">'+escH(o.f)+'</button>'; }).join('')+'</div>';
      document.getElementById('plSay').addEventListener('click', function(){ say(ex.w.f); });
      setTimeout(function(){ say(ex.w.f); }, 300);
      bindOpts(ex.opts.indexOf(ex.w));
    } else if(ex.type==='type'){
      plBody.innerHTML = '<div class="pl-q">اكتبي ترجمة <b class="pl-w">'+escH(ex.w.a)+'</b> بالحروف اللاتينية ✍️</div>'
        + '<input id="plIn" class="pl-in" type="text" autocomplete="off" autocapitalize="none" placeholder="اكتبي هنا..." style="text-align:center">'
        + '<button class="btn pl-check" id="plCheck">تحققي ✓</button><div class="pl-fb" id="plFb"></div>';
      var inp=document.getElementById('plIn'); inp.focus();
      document.getElementById('plCheck').addEventListener('click', check);
      inp.addEventListener('keydown', function(e){ if(e.key==='Enter') check(); });
      function check(){
        if(norm(inp.value)===norm(ex.w.f.replace(/ *\(.*?\)/g,''))){ correct(); document.getElementById('plFb').innerHTML='<span class="ok">صح! 🎉</span>'; advance(700); }
        else { loseHeart(); document.getElementById('plFb').innerHTML='<span class="no">الصح: '+escH(ex.w.f)+'</span>'; if(LS.hearts>0) advance(1400); }
      }
    } else if(ex.type==='order'){
      plBody.innerHTML = '<div class="pl-q">رتّبي الجملة 🧩</div><div class="pl-ans" id="plAns"></div>'
        + '<div class="pl-tiles" id="plTiles">'+ex.tiles.map(function(t,i){ return '<button class="pl-tile" data-t="'+i+'">'+escH(t)+'</button>'; }).join('')+'</div>'
        + '<button class="btn pl-check" id="plCheck">تحققي ✓</button><div class="pl-fb" id="plFb"></div>';
      var ans=document.getElementById('plAns'), tiles=document.getElementById('plTiles');
      tiles.addEventListener('click', function(e){
        var b=e.target.closest('.pl-tile'); if(!b) return;
        ex.picked.push(ex.tiles[+b.dataset.t]); b.remove();
        ans.innerHTML=ex.picked.map(function(t,i){ return '<button class="pl-tile in" data-p="'+i+'">'+escH(t)+'</button>'; }).join('');
      });
      ans.addEventListener('click', function(e){
        var b=e.target.closest('.pl-tile'); if(!b) return;
        var t=ex.picked.splice(+b.dataset.p,1)[0];
        b.remove();
        tiles.innerHTML += '<button class="pl-tile" data-t="'+ex.tiles.indexOf(t)+'">'+escH(t)+'</button>';
      });
      document.getElementById('plCheck').addEventListener('click', function(){
        if(ex.picked.join('|')===ex.ans.join('|')){ correct(); document.getElementById('plFb').innerHTML='<span class="ok">صح! 🎉</span>'; advance(700); }
        else { loseHeart(); document.getElementById('plFb').innerHTML='<span class="no">الترتيب الصح: '+escH(ex.ans.join(' '))+'</span>'; if(LS.hearts>0) advance(1600); }
      });
    } else if(ex.type==='match'){
      plBody.innerHTML = '<div class="pl-q">وصّلي كل كلمة بمعناها 🔗</div><div class="pl-match"><div class="pm-col">'
        + ex.f.map(function(w,i){ return '<button class="pl-opt pm-f" data-f="'+i+'">'+escH(w.f)+'</button>'; }).join('')
        + '</div><div class="pm-col">'
        + ex.a.map(function(w,i){ return '<button class="pl-opt pm-a" data-a="'+i+'">'+escH(w.a)+'</button>'; }).join('')
        + '</div></div><div class="pl-fb" id="plFb"></div>';
      plBody.querySelector('.pl-match').addEventListener('click', function(e){
        var b=e.target.closest('.pl-opt'); if(!b||b.classList.contains('got')) return;
        if(b.dataset.f!==undefined){
          plBody.querySelectorAll('.pm-f').forEach(function(x){x.classList.remove('sel');});
          b.classList.add('sel'); ex.sel=ex.f[+b.dataset.f];
        } else {
          if(!ex.sel) return;
          var w=ex.a[+b.dataset.a];
          if(w===ex.sel){
            b.classList.add('got'); plBody.querySelectorAll('.pm-f').forEach(function(x){ if(ex.f[+x.dataset.f]===w){ x.classList.add('got'); x.classList.remove('sel'); } });
            ex.sel=null; ex.got++;
            if(ex.got===ex.pairs.length){ correct(); advance(700); }
          } else {
            loseHeart(); b.classList.add('no1'); setTimeout(function(){ b.classList.remove('no1'); },500);
            if(LS.hearts<=0) return;
          }
        }
      });
    }
  }
  function bindOpts(correctIdx){
    plBody.querySelectorAll('.pl-opt').forEach(function(b){
      b.addEventListener('click', function(){
        if(b.classList.contains('got')||b.classList.contains('no1')) return;
        if(+b.dataset.o===correctIdx){ b.classList.add('got'); correct(); advance(700); }
        else {
          b.classList.add('no1'); loseHeart();
          plBody.querySelectorAll('.pl-opt')[correctIdx].classList.add('got');
          if(LS.hearts>0) advance(1300);
        }
      });
    });
  }
  function loseHeart(){
    if(LS.boss){ drawTop(); return; }
    LS.hearts = loseHeartGlobal(); drawTop();
    if(LS.hearts<=0){ setTimeout(function(){ endLesson(false); }, 700); }
  }
  function endBoss(){
    plBar.style.width='100%';
    var passed = LS.score>=7;
    if(passed){
      var s=store(); var st=s[LS.key]||[]; st[NLESS]=true; s[LS.key]=st; saveS(s);
      var nm=(window.VOCAB_THEMES||{})[LS.key].name;
      badge(nm);
      if(window.awardPoints) awardPoints(50,'اختبار الوحدة 👑');
      plBody.innerHTML='<div class="pl-end"><div class="pl-star">👑</div><h3>عدّيت الاختبار!</h3><p>'+LS.score+' / 10 صح · +50 نقطة</p>'
        +'<div class="pl-badge">🏅<div>وسام الوحدة!<br><b>'+escH(nm)+'</b></div></div>'
        +'<button class="btn pl-check" id="plDone">الوحدة اللي بعدها 🚀</button></div>';
      if(window.refreshDash) refreshDash();
      document.getElementById('plDone').addEventListener('click', closeLesson);
    } else {
      plBody.innerHTML='<div class="pl-end"><div class="pl-star">😤</div><h3>'+LS.score+' / 10 — محتاجة 7 عشان تعدّي</h3><p>راجعي الدروس وجربي تاني، إنتي قريبة!</p>'
        +'<button class="btn pl-check" id="plRetry">🔁 أعيدي الاختبار</button> <button class="btn pl-check ghost" id="plDone">خروج</button></div>';
      document.getElementById('plRetry').addEventListener('click', function(){ startBoss(LS.ui); });
      document.getElementById('plDone').addEventListener('click', closeLesson);
    }
  }
  function endLesson(won){
    plBar.style.width='100%';
    if(won){
      var s=store(); var st=s[LS.key]||[]; st[LS.li]=true; s[LS.key]=st; saveS(s);
      if(window.awardPoints) awardPoints(20,'إكمال درس 🚀');
      var unitComplete = true; for(var ci=0;ci<NLESS;ci++){ if(!st[ci]) unitComplete=false; }
      var bHtml='';
      if(unitComplete){
        var nm=(window.VOCAB_THEMES||{})[LS.key].name;
        badge(nm);
        if(window.awardPoints) awardPoints(30,'وسام وحدة 🏅');
        bHtml='<div class="pl-badge">🏅<div>وسام جديد!<br><b>'+escH(nm)+'</b></div></div>';
      }
      plBody.innerHTML='<div class="pl-end"><div class="pl-star">🌟</div><h3>درس كامل!</h3><p>+'+(LS.xp+20)+' نقطة</p>'+bHtml
        +'<button class="btn pl-check" id="plDone">كمّلي 💪</button></div>';
      if(window.refreshDash) refreshDash();
      document.getElementById('plDone').addEventListener('click', closeLesson);
    } else {
      plBody.innerHTML='<div class="pl-end"><div class="pl-star">💔</div><h3>القلوب خلصت</h3><p>معلش، المحاولة أهم من النتيجة 💜<br>قلب جديد بعد '+nextHeartMin()+' دقيقة</p>'
        +'<button class="btn pl-check" id="plRetry">🔁 أعيدي الدرس</button> <button class="btn pl-check ghost" id="plDone">خروج</button></div>';
      document.getElementById('plRetry').addEventListener('click', function(){ startLesson(LS.ui, LS.li); });
      document.getElementById('plDone').addEventListener('click', closeLesson);
    }
  }
  function closeLesson(){
    overlay.classList.remove('show');
    document.body.style.overflow='';
    renderPath();
  }

  /* ---- wire up (override old map) ---- */
  overlay=document.getElementById('plOverlay'); plBody=document.getElementById('plBody');
  plBar=document.getElementById('plBar'); plHearts=document.getElementById('plHearts');
  if(!overlay) return;
  document.getElementById('plClose').addEventListener('click', closeLesson);
  var tabs=document.getElementById('mapTabs');
  tabs.querySelectorAll('.tab').forEach(function(t){
    var c=t.cloneNode(true); t.replaceWith(c);
    if(c.dataset.mlang===lang) c.classList.add('active'); else c.classList.remove('active');
    c.addEventListener('click', function(){
      tabs.querySelectorAll('.tab').forEach(function(x){x.classList.remove('active');});
      c.classList.add('active'); lang=c.dataset.mlang; renderPath();
    });
  });
  document.getElementById('mapPath').addEventListener('click', function(e){
    var lb=e.target.closest('[data-ulesson]');
    if(lb && !lb.disabled){ var p=lb.dataset.ulesson.split(':'); startLesson(+p[0], +p[1]); return; }
    var bb=e.target.closest('[data-uboss]');
    if(bb && !bb.disabled){ startBoss(+bb.dataset.uboss); return; }
    var nb=e.target.closest('[data-punit]');
    if(nb && !nb.disabled){ /* scroll lessons into view */ var row=nb.closest('.pu-row'); var ls=row&&row.nextElementSibling; if(ls&&ls.classList.contains('pu-lessons')) ls.scrollIntoView({behavior:'smooth', block:'center'}); }
  });
  renderPath();
})();


/* ================= v41: Weekly friends leaderboard (ترتيب الأسبوع) ================= */
(function(){
  var SUPA_URL = 'https://yzzlgalxjaaevmytdazf.supabase.co';
  var SUPA_KEY = 'sb_publishable_EmbKVWREHSs3sZ_nBKFyqg_zxv3Z38-';
  var wsb = null, wme = null, wTimer = null;
  function wEsc(x){ return String(x == null ? '' : x).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

  /* Monday (UTC) of the current week, 'YYYY-MM-DD' */
  function wkStart(){
    var d = new Date();
    var day = (d.getUTCDay() + 6) % 7; /* 0 = Monday */
    d.setUTCDate(d.getUTCDate() - day);
    return d.toISOString().slice(0, 10);
  }
  function wkLoad(){
    try { var w = JSON.parse(localStorage.getItem('lingua_weekxp') || 'null'); if(w && w.week === wkStart()) return w; } catch(e){}
    return {week: wkStart(), xp: 0};
  }
  function wkSave(w){ try { localStorage.setItem('lingua_weekxp', JSON.stringify(w)); } catch(e){} }

  function queueWeekSync(){
    if(!wme) return;
    clearTimeout(wTimer);
    wTimer = setTimeout(function(){
      var w = wkLoad();
      wsb.from('profiles').update({week_xp: w.xp, week_start: w.week}).eq('id', wme.id).then(function(){});
    }, 2500);
  }
  /* wrap awardPoints (chained after the accounts wrapper) */
  try {
    var _wAward = window.awardPoints;
    window.awardPoints = function(n, label){
      if(typeof _wAward === 'function') _wAward(n, label);
      var w = wkLoad(); w.xp += Math.max(0, n | 0); wkSave(w);
      queueWeekSync();
    };
  } catch(e){}

  var MEDALS = ['🥇','🥈','🥉'];
  function renderWeekBoard(){
    var el = document.getElementById('weekBoard');
    if(!el) return;
    if(!wme){
      el.innerHTML = '<div class="gbk-empty">سجلي حسابك من «👑 حسابي» وشوفي ترتيب الأسبوع بينك وبين صحابك 🏆</div>';
      return;
    }
    el.innerHTML = '<div class="gbk-empty">بيتم التحميل... 🏆</div>';
    wsb.from('friendships').select('user_id,friend_id').or('user_id.eq.' + wme.id + ',friend_id.eq.' + wme.id).then(function(r){
      if(r.error){ el.innerHTML = '<div class="gbk-empty">حصلت مشكلة — جربي تاني 💛</div>'; return; }
      var ids = {}; ids[wme.id] = 1;
      (r.data || []).forEach(function(f){ ids[f.user_id] = 1; ids[f.friend_id] = 1; });
      wsb.from('profiles').select('id,display_name,week_xp,week_start').in('id', Object.keys(ids)).then(function(pr){
        if(pr.error){ el.innerHTML = '<div class="gbk-empty">حصلت مشكلة — جربي تاني 💛</div>'; return; }
        var cur = wkStart(), mine = wkLoad();
        var rows = (pr.data || []).map(function(p){
          var xp = (p.week_start === cur) ? (p.week_xp || 0) : 0;
          if(p.id === wme.id) xp = Math.max(xp, mine.xp);
          return {id: p.id, name: p.display_name || 'صديقة', xp: xp, me: p.id === wme.id};
        }).sort(function(a, b){ return b.xp - a.xp; });
        var html = '';
        if(rows.length < 2){
          html = '<div class="gbk-empty">لسه مفيش صحاب — ابعتي دعوة واتساب من تاب «👯 صحابي» وهتتنافسوا على ترتيب الأسبوع 🏆👯‍♀️</div>';
        } else {
          html = rows.map(function(p, i){
            var medal = MEDALS[i] || ('<span style="color:var(--muted)">' + (i + 1) + '</span>');
            return '<div class="wk-row' + (p.me ? ' me' : '') + '"><div class="wk-rank">' + medal + '</div>' +
              '<div class="wk-name">' + wEsc(p.name) + (p.me ? ' <span style="color:var(--gold);font-size:.75rem">(انتي)</span>' : '') + '</div>' +
              '<div class="wk-xp">💎 ' + p.xp + '</div></div>';
          }).join('');
        }
        html += '<div class="wk-foot">🏆 بيتجدد كل يوم اثنين — اللي تجمع نقاط أكتر الأسبوع ده تتصدر!</div>';
        el.innerHTML = html;
      });
    });
  }

  function boot(){
    if(!window.supabase){ setTimeout(boot, 400); return; }
    wsb = window.supabase.createClient(SUPA_URL, SUPA_KEY);
    wsb.auth.getSession().then(function(r){
      if(r.data && r.data.session){
        wme = r.data.session.user;
        /* adopt the server's weekly total if it is ahead (other device), or push our reset after rollover */
        wsb.from('profiles').select('week_xp,week_start').eq('id', wme.id).maybeSingle().then(function(pr){
          var w = wkLoad();
          if(pr.data && pr.data.week_start === w.week && (pr.data.week_xp || 0) > w.xp){
            w.xp = pr.data.week_xp; wkSave(w);
          } else {
            queueWeekSync();
          }
          renderWeekBoard();
        });
      } else {
        renderWeekBoard();
      }
    });
  }
  document.getElementById('accTabs').addEventListener('click', function(e){
    var b = e.target.closest('.tab');
    if(b && b.dataset.at === 'friends') renderWeekBoard();
  });
  window.addEventListener('hashchange', function(){
    if(location.hash === '#friends' || location.hash === '#account') renderWeekBoard();
  });
  var rb = document.getElementById('weekRefresh');
  if(rb) rb.onclick = function(){ renderWeekBoard(); };
  boot();
})();

/* hard general-knowledge pool (Arabic) for live games */
window.GK_POOL = [
{q:'أي دولة فيها أكبر عدد من الأهرامات في العالم؟',a:'السودان',o:['مصر','المكسيك','السودان','الصين']},
{q:'إيه هو العنصر الكيميائي اللي رمزه W؟',a:'التنجستن',o:['التنجستن','الحديد','الفضة','اليورانيوم']},
{q:'مين أول من وصف الدورة الدموية الصغرى؟',a:'ابن النفيس',o:['ابن سينا','ابن النفيس','الرازي','هارفي']},
{q:'أعمق نقطة في المحيطات اسمها إيه؟',a:'خندق ماريانا',o:['خندق تونجا','خندق ماريانا','خندق بورتوريكو','خندق جاوة']},
{q:'في أي سنة وقعت معركة عين جالوت؟',a:'1260م',o:['1187م','1260م','1517م','1099م']},
{q:'إيه هي أطول سلسلة جبال تحت الماء؟',a:'الحد وسط الأطلسي',o:['الأنديز','الهيمالايا','الحد وسط الأطلسي','الروكي']},
{q:'مين رسام لوحة "الليلة المرصعة بالنجوم"؟',a:'فان جوخ',o:['بيكاسو','مونيه','فان جوخ','دافينشي']},
{q:'كم عدد عظام جسم الإنسان البالغ؟',a:'206',o:['186','206','226','250']},
{q:'عاصمة كازاخستان الحالية هي؟',a:'أستانا',o:['ألماتي','أستانا','تاشكент','بشكيك']},
{q:'إيه هو أثقل غاز من الغازات النبيلة الطبيعية؟',a:'الرادون',o:['الأرجون','الزينون','الرادون','الكريبتون']},
{q:'مين أول امرأة تاخد نوبل مرتين؟',a:'ماري كوري',o:['ماري كوري','روزاليند فرانكلين','دوروثي هودجكين','إيرين جوليو']},
{q:'نهر النيل بيصب في إيه؟',a:'البحر المتوسط',o:['البحر الأحمر','البحر المتوسط','المحيط الهندي','الخليج العربي']},
{q:'إيه اسم أول قمر صناعي في التاريخ؟',a:'سبوتنيك 1',o:['فوستوك 1','سبوتنيك 1','إكسبلورر 1','لونا 1']},
{q:'أي حضارة بنت مدينة البتراء؟',a:'الأنباط',o:['الرومان','الأنباط','الفرس','الآشوريين']},
{q:'كم لاعب في فريق الكرة الطائرة على الملعب؟',a:'6',o:['5','6','7','8']},
{q:'إيه هو المعدن السائل في درجة حرارة الغرفة؟',a:'الزئبق',o:['الألومنيوم','الزئبق','الصوديوم','الجاليوم بس']},
{q:'مين كتب "مقدمة" علم الاجتماع؟',a:'ابن خلدون',o:['ابن رشد','ابن خلدون','الفارابي','الجاحظ']},
{q:'أكبر صحراء حارة في العالم؟',a:'الصحراء الكبرى',o:['جوبي','الصحراء الكبرى','كالاهاري','أتاكاما']},
{q:'الضوء بيقطع المسافة من الشمس للأرض في قد إيه تقريبًا؟',a:'8 دقائق',o:['8 ثواني','8 دقائق','ساعة','يوم']},
{q:'إيه هي لغة التشيك الرسمية؟',a:'التشيكية',o:['السلوفاكية','البولندية','التشيكية','الألمانية']},
{q:'مين مخترع الديناميت؟',a:'ألفريد نوبل',o:['توماس إديسون','ألفريد نوبل','نيكولا تسلا','جراهام بيل']},
{q:'أي كوكب عنده أكبر عدد أقمار مكتشفة (حاليًا)؟',a:'زحل',o:['المشترى','زحل','أورانوس','نبتون']},
{q:'أول دولة اكتشفت شجر البن وصدرته للعالم؟',a:'إثيوبيا',o:['اليمن','إثيوبيا','البرازيل','كولومبيا']},
{q:'إيه هي أصغر دولة في العالم مساحة؟',a:'الفاتيكان',o:['موناكو','الفاتيكان','سان مارينو','ناورو']},
{q:'مين قائد حملة فتح الأندلس سنة 711م؟',a:'طارق بن زياد',o:['موسى بن نصير','طارق بن زياد','عقبة بن نافع','عبد الرحمن الداخل']},
{q:'الحديد بيصدأ بسبب تفاعله مع إيه؟',a:'الأكسجين والمية',o:['الأكسجين بس','الأكسجين والمية','ثاني أكسيد الكربون','النيتروجين']},
{q:'أي بحر يفصل بين أفريقيا وأوروبا؟',a:'البحر المتوسط',o:['البحر الأحمر','بحر العرب','البحر المتوسط','البحر الأسود']},
{q:'مين واضع أسس الجبر في كتابه "الكتاب المختصر في حساب الجبر والمقابلة"؟',a:'الخوارزمي',o:['عمر الخيام','الخوارزمي','البيروني','ابن الهيثم']},
{q:'كم عدد أبواب جهنم كما ورد في القرآن؟',a:'7',o:['7','8','9','10']},
{q:'إيه هي عملة اليابان؟',a:'الين',o:['اليوان','الوون','الين','الرينمينبي']},
{q:'مين أول رئيس للولايات المتحدة؟',a:'جورج واشنطن',o:['لينكولن','جيفرسون','جورج واشنطن','آدمز']},
{q:'الحوت الأزرق هو أكبر؟',a:'حيوان عاش على الأرض',o:['سمكة في التاريخ','حيوان عاش على الأرض','ديناصور معروف','ثديي مائي بس']},
{q:'في أي مدينة اتبنت أول جامعة في العالم (القرويين)؟',a:'فاس',o:['القاهرة','فاس','بغداد','قرطبة']},
{q:'مين العالم اللي حط قوانين حركة الكواكب؟',a:'كبلر',o:['نيوتن','كبلر','جاليليو','كوبرنيكوس']},
{q:'إيه هو أصلب مادة طبيعية؟',a:'الألماس',o:['الكوارتز','الألماس','البلاتين','الجرافيت']},
{q:'عاصمة أستراليا هي؟',a:'كانبرا',o:['سيدني','ملبورن','كانبرا','بيرث']},
{q:'كم عدد ألوان قوس قزح الأساسية؟',a:'7',o:['5','6','7','8']},
{q:'مين مؤلف رواية "البؤساء"؟',a:'فيكتور هوجو',o:['بلزاك','فيكتور هوجو','زولا','ديكنز']},
{q:'أي عضو في جسم الإنسان بيقدر يجدد نفسه بالكامل؟',a:'الكبد',o:['القلب','الكبد','الكلى','الرئة']},
{q:'إيه اسم أكبر جزيرة في العالم؟',a:'جرينلاند',o:['مدغشقر','بورنيو','جرينلاند','نيو جيني']},
{q:'الحرب العالمية الأولى بدأت سنة؟',a:'1914',o:['1914','1918','1939','1905']},
{q:'مين النبي اللي اتلقب بكليم الله؟',a:'موسى عليه السلام',o:['عيسى','موسى عليه السلام','إبراهيم','نوح']},
{q:'إيه هي أطول سورة في القرآن؟',a:'البقرة',o:['آل عمران','البقرة','النساء','المائدة']},
{q:'أي دولة عندها أكبر عدد براكين نشطة؟',a:'إندونيسيا',o:['اليابان','إيطاليا','إندونيسيا','أيسلندا']},
{q:'مين اكتشف البنسلين؟',a:'ألكسندر فلمنج',o:['باستير','ألكسندر فلمنج','كوخ','جينر']},
{q:'إيه هي أسرع حشرة طائرة؟',a:'اليعسوب',o:['النحلة','اليعسوب','الفراشة','الذبابة']},
{q:'برج إيفل اتبنى بمناسبة إيه؟',a:'معرض باريس العالمي 1889',o:['الثورة الفرنسية','معرض باريس العالمي 1889','انتصار نابليون','أولمبياد 1900']},
{q:'إيه هي أكبر دولة عربية من حيث المساحة؟',a:'الجزائر',o:['السعودية','ليبيا','الجزائر','السودان']},
{q:'مين أول من مشي على سطح القمر؟',a:'نيل أرمسترونج',o:['باز ألدرين','نيل أرمسترونج','يوري جاجارين','مايكل كولينز']},
{q:'النسبة الذهبية بتساوي تقريبًا؟',a:'1.618',o:['3.14','1.618','2.71','1.414']},
{q:'أي حيوان بيطلع لبن وبيض وعنده منقار؟',a:'خلد الماء',o:['الكنغر','خلد الماء','الكسلان','النمس']},
{q:'مين مؤسس الدولة الأيوبية؟',a:'صلاح الدين الأيوبي',o:['نور الدين زنكي','صلاح الدين الأيوبي','عماد الدين','الظاهر بيبرس']},
{q:'إيه هو الكوكب الملقب بالكوكب الأحمر؟',a:'المريخ',o:['الزهرة','المريخ','عطارد','المشترى']},
{q:'كم سنة استمرت حرب المائة عام بين إنجلترا وفرنسا تقريبًا؟',a:'116 سنة',o:['100 سنة بالظبط','116 سنة','99 سنة','130 سنة']},
{q:'إيه هو الرقم الذري لعنصر الذهب؟',a:'79',o:['79','47','82','64']},
{q:'مين العالم اللي وضع قوانين حركة الكواكب؟',a:'كيبلر',o:['نيوتن','كيبلر','جاليليو','كوبرنيكوس']},
{q:'إيه هي أصغر عظمة في جسم الإنسان؟',a:'الركاب في الأذن',o:['الركاب في الأذن','الزند','الترقوة','عظمة الأنف']},
{q:'في أي سنة اتأسست جامعة الدول العربية؟',a:'1945',o:['1945','1952','1938','1958']},
{q:'إيه هي عاصمة سورينام؟',a:'باراماريبو',o:['باراماريبو','جورج تاون','كايين','بيلموبان']},
{q:'مين اللي اخترع النظام الثنائي (0 و 1)؟',a:'لايبنيز',o:['لايبنيز','باسكال','تورينج','بول']},
{q:'أي دولة عربية عدد سكانها أصغر؟',a:'جزر القمر',o:['جيبوتي','جزر القمر','البحرين','قطر']},
{q:'إيه اسم أعمق بحيرة في العالم؟',a:'بايكال',o:['بايكال','فيكتوريا','تيتيكاكا','كاسبيان']},
{q:'مين أول مصري يوصل لقمة إفرست؟',a:'عمر سمرة',o:['عمر سمرة','فاروق الباز','مجدي يعقوب','أحمد زويل']},
{q:'إيه هي أقوى عضلة في جسم الإنسان بالنسبة لحجمها؟',a:'عضلة الفك',o:['عضلة الفك','عضلة الفخذ','القلب','اللسان']},
{q:'مضيق باب المندب بيفصل بين اليمن وأي دولة؟',a:'جيبوتي',o:['الصومال','جيبوتي','إريتريا','عمان']},
{q:'مين مؤلف رواية "عزازيل"؟',a:'يوسف زيدان',o:['يوسف زيدان','بهاء طاهر','صنع الله إبراهيم','جمال الغيطاني']},
{q:'إيه هي أسرع سمكة في العالم؟',a:'أبو شراع',o:['أبو شراع','التونة','القرش الأبيض','الهامور']},
{q:'مين أول امرأة حكمت مصر في العصر الإسلامي؟',a:'شجرة الدر',o:['شجرة الدر','حتشبسوت','كليوباترا','نفرتيتي']},
{q:'إيه هو أعلى بركان نشط في العالم؟',a:'أوخوس ديل سالادو',o:['أوخوس ديل سالادو','إتنا','كيليمانجارو','فيزوف']},
{q:'مين العالم المسلم الملقب بـ"أبو البصريات والكاميرا"؟',a:'ابن الهيثم',o:['ابن الهيثم','الجزري','الخوارزمي','ابن النفيس']},
{q:'إيه هي عملة كوريا الجنوبية؟',a:'الوون',o:['الوون','الين','اليوان','الرينجيت']},
{q:'كم عدد الدول العربية الموجودة في قارة آسيا؟',a:'12',o:['10','12','14','8']},
{q:'مين اللي اكتشف البنسلين؟',a:'ألكسندر فليمنج',o:['ألكسندر فليمنج','لوي باستور','جوزيف ليستر','روبرت كوخ']},
{q:'إيه هي أكبر جزيرة في البحر المتوسط؟',a:'صقلية',o:['صقلية','كريت','قبرص','سردينيا']},
{q:'في أي سنة سقطت غرناطة وانتهى حكم الأندلس؟',a:'1492م',o:['1492م','1348م','1517م','1258م']},
{q:'إيه هي أطول كلمة في القرآن الكريم؟',a:'فأسقيناكموه',o:['فأسقيناكموه','المستضعفين','استكباروا','يتطهرون']},
{q:'أي حيوان عنده ٣ قلوب؟',a:'الأخطبوط',o:['الأخطبوط','الحبار','الدولفين','الضفدع']},
{q:'إيه هي الدولة اللي عندها أكبر عدد جزر في العالم؟',a:'السويد',o:['إندونيسيا','السويد','الفلبين','النرويج']},
{q:'إيه هو أكثر عنصر كثافة في الجدول الدوري؟',a:'الأوسميوم',o:['الأوسميوم','الرصاص','الذهب','اليورانيوم']},
{q:'في أي سنة اتأسست الدولة الأموية؟',a:'661م',o:['661م','632م','750م','686م']},
{q:'إيه اسم أول عاصمة للدولة الإسلامية بعد المدينة المنورة؟',a:'الكوفة',o:['الكوفة','دمشق','بغداد','مكة']},
{q:'كم عدد صمامات القلب؟',a:'4',o:['4','2','6','3']},
{q:'إيه هي أقرب مجرة كبيرة لمجرتنا درب التبانة؟',a:'أندروميدا',o:['أندروميدا','ماجلان','المثلث','القنطورس']},
{q:'أي نهر بيمر بأكبر عدد من الدول في العالم؟',a:'الدانوب',o:['الدانوب','النيل','الأمازون','الراين']},
{q:'كم لاعب في فريق الكرلنج على الجليد؟',a:'4',o:['4','6','5','7']}
];

/* truth + know-me pools (fun + safe-embarrassing, no sexual/hurtful/private content) */
window.TRUTH_POOL = [
{q:'إيه أغبى حاجة عملتيها وانتي صغيرة؟ 😄', c:'fun'},
{q:'إيه الأكل اللي بتاكليه في السر ومحسش حد؟ 🍫', c:'fun'},
{q:'لو يوم كامل تبدلي حياتك مع أي حد — مين؟ ✨', c:'fun'},
{q:'إيه عادة غريبة عندك محدش يعرفها؟ 🤫', c:'fun'},
{q:'أغرب حلم حلمتيه كان عن إيه؟ 💭', c:'fun'},
{q:'إيه الحاجة اللي بتخافي منها ومضحكة؟ 😂', c:'fun'},
{q:'لو لسه بتتفرجي على كرتون — إيه هو؟ 📺', c:'fun'},
{q:'إيه أول حاجة بتعمليها أول ما تصحي؟ ☀️', c:'fun'},
{q:'مين آخر واحدة بعتيها رسالة وقولتي فيها إيه؟ 📱', c:'fun'},
{q:'إيه الأغنية اللي بتغنيها وانتي لوحدك بصوت عالي؟ 🎤', c:'fun'},
{q:'أطرف موقف حصلك في المواصلات؟ 🚌', c:'embar'},
{q:'إيه الكدبة الصغيرة اللي قولتيها المرة الأخيرة؟ 🙊', c:'embar'},
{q:'اتكسفتي قدام ناس إمتى آخر مرة؟ 😳', c:'embar'},
{q:'ندمتي على رسالة بعتيها؟ كانت عن إيه؟ 💌', c:'embar'},
{q:'وقعتي أو تعثرتي قدام ناس قبل كده؟ احكي! 🤭', c:'embar'},
{q:'إيه الحاجة اللي لسه بتعمليها زي الأطفال؟ 🧸', c:'embar'},
{q:'اتصورتي صورة محرجة؟ إيه كانت؟ 📸', c:'embar'},
{q:'قولتي على حد "بحبك" بالغلط؟ 😅', c:'embar'},
{q:'إيه أطرف لقب اتناديتي بيه؟ 🏷️', c:'embar'},
{q:'نسيتي اسم حد وانتي بتكلميه؟ عملتي إيه؟ 🫣', c:'embar'},
{q:'لو تقدري تعيشي جوه فيلم أو مسلسل — يكون إيه؟ 🎬', c:'fun'},
{q:'إيه أكتر أكل ممكن تاكليه كل يوم من غير ما تزهقي؟ 🍝', c:'fun'},
{q:'لو صوتك يتسمع في مكبرات المدينة دقيقة واحدة — هتقولي إيه؟ 📢', c:'fun'},
{q:'إيه أغرب هدية وصلتك في حياتك؟ 🎁', c:'fun'},
{q:'لو حياتك اسمها كتاب — يبقى عنوانه إيه؟ 📖', c:'fun'},
{q:'إيه أكتر موقف كسوفة حصلك في مكان عام؟ 🙈', c:'embar'},
{q:'هل رديتي على حد بالغلط في الشات وكان محرج؟ احكي! 📱', c:'embar'},
{q:'إيه أطول مدة قعدتيها من غير ما تسرحي شعرك؟ 😅', c:'embar'},
{q:'هل غنيتي بصوت عالي وانتي فاكرة محدش سامعك؟ 🎤', c:'embar'},
{q:'إيه أغبى كلمة بتلاقي نفسك بتقوليها كتير؟ 🤭', c:'embar'},
];

window.KM_POOL = [
{q:'قهوة ولا شاي؟', o:['قهوة ☕','شاي 🍵','اللي اتنين','ولا واحد']},
{q:'البحر ولا السفر للجبال؟', o:['البحر 🌊','الجبال 🏔️','الاتنين','أي مكان جديد']},
{q:'بتصحي بدري ولا بتسهري؟', o:['أصحى بدري 🌅','أسهر بالليل 🌙','على مزاجي','نوم طول اليوم 😴']},
{q:'الأكل المفضل؟', o:['محشي 🍇','مكرونة بشاميل 🍝','كشري 🍛','بيتزا 🍕']},
{q:'لو كسبتي مليون جنيه — أول حاجة تعمليها؟', o:['أسافر ✈️','أشتري حاجة غالية 💎','أدخرها 🏦','أساعد أهلي 💜']},
{q:'الفيلم المفضل: رومانسي ولا أكشن ولا كوميدي؟', o:['رومانسي 💕','أكشن 💥','كوميدي 😂','رعب 👻']},
{q:'الشتاء ولا الصيف؟', o:['الشتا ☔','الصيف ☀️','الخريف 🍂','الربيع 🌸']},
{q:'لو حيوان أليف: قطة ولا كلب؟', o:['قطة 🐱','كلب 🐶','عصفورة 🐦','مفيش حيوانات 🙅‍♀️']},
{q:'الصيف في الساحل ولا الشتا في البيت؟', o:['الساحل 🏖️','البيت والبطانية 🛋️','الاتنين','ولا واحد']},
{q:'لما تزعلي: بتتكلمي ولا بتسكتي؟', o:['أتكلم على طول 🗣️','أسكت وروح لوحدي 🚪','أكتب اللي جوايا 📝','أضحك وعدّيها 😂']},
{q:'أكتر وجبة بتحبيها؟', o:['فطار 🍳','غدا 🍗','عشا 🍕','سناكس طول اليوم 🍫']},
{q:'لو بتسافري بكرة: فين؟', o:['أوروبا 🗼','الخليج 🏙️','تركيا 🎈','أسيا 🏯']},
{q:'موبايلك أكتر حاجة عليه إيه؟', o:['سوشيال ميديا 📱','ألعاب 🎮','صور 📸','مذاكرة وكورسات 📚']},
{q:'الفلوس ولا الوقت؟', o:['الفلوس 💸','الوقت ⏳','الاتنين سوا 😌','ولا واحد يكفي']}
];


/* ================= v47: luxury grouped navigation ================= */
(function(){
  /* drawn SVG icons (stroke, 24x24) */
  var IC = {
    home: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/><path d="M9 21v-6h6v6"/></svg>',
    flag: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 21V4"/><path d="M5 4c4-2 7 2 11 0v9c-4 2-7-2-11 0"/></svg>',
    swords: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4l9.5 9.5M4 4v4M4 4h4"/><path d="M20 4l-9.5 9.5M20 4v4M20 4h-4"/><path d="M13.5 13.5 17 21l-1.5-1.5L14 21l-.5-3.5zM10.5 13.5 7 21l1.5-1.5L10 21l.5-3.5z" opacity=".0"/><path d="M14.5 14.5 19 21h-3l-2-2.5M9.5 14.5 5 21h3l2-2.5"/></svg>',
    hearts: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M8 5.5C5.5 5.5 3.5 7.4 3.5 9.9c0 3.2 4.5 6.1 6 7.1 1.5-1 6-3.9 6-7.1 0-2.5-2-4.4-4.5-4.4-1 0-2 .4-3 1.4-.7-1-1.6-1.4-2-1.4z" transform="translate(-1.5 0)"/><path d="M17.5 9c-1.7 0-3 1.3-3 2.9 0 2.1 3 4 4 4.7 1-.7 4-2.6 4-4.7 0-1.6-1.3-2.9-3-2.9-.6 0-1.3.3-2 .9-.4-.6-.7-.9-1-.9z" opacity=".65"/></svg>',
    grid: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3.5" y="3.5" width="7" height="7" rx="2"/><rect x="13.5" y="3.5" width="7" height="7" rx="2"/><rect x="3.5" y="13.5" width="7" height="7" rx="2"/><rect x="13.5" y="13.5" width="7" height="7" rx="2"/></svg>',
    book: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5.5C6 4 9 4 12 6c3-2 6-2 8-.5V18c-2-1.5-5-1.5-8 .5-3-2-6-2-8-.5z"/><path d="M12 6v12.5"/></svg>',
    gamepad: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M7 8h10a5 5 0 0 1 5 5c0 2.8-2.2 5-5 5-1.4 0-2.6-.6-3.4-1.5h-3.2C9.6 17.4 8.4 18 7 18c-2.8 0-5-2.2-5-5a5 5 0 0 1 5-5z"/><path d="M7.5 11v4M5.5 13h4"/><circle cx="16" cy="12" r=".6" fill="currentColor"/><circle cx="18.5" cy="14" r=".6" fill="currentColor"/></svg>',
    chat: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a8 8 0 0 1-8 8c-1.2 0-2.4-.2-3.4-.7L4 20l1-4.4A8 8 0 1 1 21 12z"/><path d="M8.5 11h7M8.5 14h4"/></svg>',
    sparkle: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/><path d="M18.5 15.5l.9 2.6 2.6.9-2.6.9-.9 2.6-.9-2.6-2.6-.9 2.6-.9z"/></svg>',
    search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5 21 21"/></svg>',
    close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M5 5l14 14M19 5 5 19"/></svg>'
  };

  var GROUPS = [
    {id:'learn', icon:'book', title:'تعلّم 📚', items:['dash','quests','placement','listen','mistakes','corners','courses','lessons','quiz','map','dict','gallery','speak','videos','songs','music','cinema','korean','library','stories','capitals','food','fashion','trip','places','quotes','hobbies','themes','tips','eng','scholar','ch30','flash','puzzle','qotd']},
    {id:'play', icon:'gamepad', title:'العب 🎮', items:['games','brain','fun','dressup','outfit','wheel','snake','xo','shooter','runner','piano','color','duel']},
    {id:'social', icon:'chat', title:'صحابي 💜', items:['friends','wall','mood','jokes','vent','diary','gbk','karma','pquiz','pet']},
    {id:'life', icon:'sparkle', title:'حياتي ✨', items:['deen','mushaf','khatma','weather','shop','premium','settings','ai']}
  ];

  /* name lookup from MENU */
  var NAMES = {};
  try { MENU.forEach(function(m){ NAMES[m[0]] = m[2]; }); } catch(e){}
  NAMES.duel = 'تحدي لايف'; NAMES.account = 'حسابي';

  /* ---- build the 5-tab bar ---- */
  var nav = document.getElementById('topNav');
  if(!nav) return;
  nav.classList.add('lx');
  nav.innerHTML =
    '<a href="#" data-id="home" class="lx-t"><span class="lx-i">' + IC.home + '</span><span class="tl">الرئيسية</span></a>' +
    '<a href="#map" data-id="map" class="lx-t"><span class="lx-i">' + IC.flag + '</span><span class="tl">مسار التعلم</span></a>' +
    '<a href="#duel" data-id="duel" class="lx-t"><span class="lx-i">' + IC.swords + '</span><span class="tl">تحدي لايف</span></a>' +
    '<a href="#friends" data-id="friends" class="lx-t"><span class="lx-i">' + IC.hearts + '</span><span class="tl">أصحابي</span></a>' +
    '<button type="button" class="lx-t lx-all" id="lxAll"><span class="lx-i">' + IC.grid + '</span><span class="tl">الأقسام</span><span class="lx-glow"></span></button>' +
    '<span class="lx-pill" id="lxPill"></span>';

  function movePill(){
    var cur = nav.querySelector('.lx-t.active');
    var pill = document.getElementById('lxPill');
    if(!pill) return;
    if(!cur){ pill.style.opacity = '0'; return; }
    pill.style.opacity = '1';
    pill.style.width = cur.offsetWidth + 'px';
    pill.style.transform = 'translateX(' + (cur.offsetLeft) + 'px)';
  }
  window.markNavActive = function(){
    var id = location.hash.slice(1) || 'home';
    /* map deep sections to the overlay tab */
    var known = ['home','map','duel','friends'];
    var on = known.indexOf(id) >= 0 ? id : 'all';
    nav.querySelectorAll('.lx-t').forEach(function(a){ a.classList.toggle('active', (a.dataset.id || 'all') === on); });
    movePill();
  };
  window.addEventListener('resize', movePill);

  /* ---- overlay directory ---- */
  var ov = null, built = false;
  function buildOverlay(){
    if(built) return; built = true;
    ov = document.createElement('div');
    ov.id = 'lxOv';
    ov.innerHTML =
      '<div class="lx-back" id="lxBack"></div>' +
      '<div class="lx-sheet" role="dialog" aria-label="الأقسام">' +
      '<div class="lx-grab"></div>' +
      '<div class="lx-head"><span class="lx-ht">✦ كل الأقسام</span><button class="lx-x" id="lxX">' + IC.close + '</button></div>' +
      '<div class="lx-search"><span class="lx-si">' + IC.search + '</span><input id="lxQ" placeholder="دوّري على قسم... 🔍"></div>' +
      '<div class="lx-groups" id="lxGroups">' +
      GROUPS.map(function(g){
        return '<div class="lx-g" data-g="' + g.id + '"><div class="lx-gh"><span class="lx-gi">' + IC[g.icon] + '</span>' + g.title + '</div>' +
          '<div class="lx-gitems">' +
          g.items.filter(function(id){ return NAMES[id]; }).map(function(id){
            return '<a class="lx-item" href="#' + id + '" data-nm="' + NAMES[id] + '"><span>' + NAMES[id] + '</span></a>';
          }).join('') + '</div></div>';
      }).join('') + '</div></div>';
    document.body.appendChild(ov);
    document.getElementById('lxBack').onclick = closeOv;
    document.getElementById('lxX').onclick = closeOv;
    ov.addEventListener('click', function(e){
      var a = e.target.closest('.lx-item');
      if(a) closeOv();
    });
    document.getElementById('lxQ').addEventListener('input', function(){
      var q = this.value.trim();
      document.querySelectorAll('#lxGroups .lx-item').forEach(function(it){
        it.style.display = (!q || it.dataset.nm.indexOf(q) >= 0) ? '' : 'none';
      });
      document.querySelectorAll('#lxGroups .lx-g').forEach(function(g){
        var any = Array.prototype.some.call(g.querySelectorAll('.lx-item'), function(it){ return it.style.display !== 'none'; });
        g.style.display = any ? '' : 'none';
      });
    });
  }
  function openOv(){
    buildOverlay();
    ov.classList.add('on');
    document.body.style.overflow = 'hidden';
    setTimeout(function(){ var q = document.getElementById('lxQ'); if(q) q.focus(); }, 350);
  }
  function closeOv(){
    if(!ov) return;
    ov.classList.remove('on');
    document.body.style.overflow = '';
  }
  document.getElementById('lxAll').onclick = openOv;

  markNavActive();
})();


/* ================= v48: live-games lobby (قاعة الألعاب اللايف) ================= */
/* one realtime room + WhatsApp invite system, 4 game types:
   quiz (word duel), race (60s speed), memory (pair race), gk (hard GK duel) */
(function(){
  var SUPA_URL = 'https://yzzlgalxjaaevmytdazf.supabase.co';
  var SUPA_KEY = 'sb_publishable_EmbKVWREHSs3sZ_nBKFyqg_zxv3Z38-';
  var LIDX = {en:0, fr:1, de:2, zh:3, ko:4};
  var LANGS = {en:'🇬🇧 إنجليزي', fr:'🇫🇷 فرنسي', de:'🇩🇪 ألماني', zh:'🇨🇳 صيني', ko:'🇰🇷 كوري'};
  var CODE_ABC = 'ABDEFGHJKMNPQRSTWXYZ23456789';
  var GAMES = {
    quiz:   {n:'سباق الكلمات', i:'⚔️', d:'١٢ كلمة — صح + سرعة', vocab:true},
    race:   {n:'سباق الستين', i:'⚡', d:'٦٠ ثانية — أكتر عدد إجابات', vocab:true},
    memory: {n:'ميموري سوا', i:'🃏', d:'مين يلاقي التطابقات الأول', vocab:true},
    gk:     {n:'معلومات صعبة', i:'🧠', d:'١٥ سؤال معلومات عامة تقيلة 🔥', vocab:false},
    truth:  {n:'الحقيقة', i:'👑', d:'أسئلة ضحك ومفاجآت — جاوبي بصراحة أو تخطّي', vocab:false},
    knowme: {n:'قد إيه تعرفيني', i:'💜', d:'خمّني إجابات صاحبتك', vocab:false}
  };
  var dsb = null, chan = null;
  var S = {st:'home', game:'quiz', code:null, lang:'en', host:false, uid:null, myName:'', opp:null, players:[],
           qs:[], qi:0, startT:0, myAns:[], oppAns:[], myScore:0, oppDone:false, oppForfeit:false,
           raceN:0, raceMs:0, oppN:0, mem:{}, timers:[]};

  function esc(x){ return String(x == null ? '' : x).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
  function el(id){ return document.getElementById(id); }
  function clearTimers(){ S.timers.forEach(clearTimeout); S.timers = []; }
  function later(fn, ms){ S.timers.push(setTimeout(fn, ms)); }

  var AC = null;
  function beep(f, dur, type){
    try {
      if(!AC) AC = new (window.AudioContext || window.webkitAudioContext)();
      var o = AC.createOscillator(), g = AC.createGain();
      o.type = type || 'sine'; o.frequency.value = f;
      g.gain.setValueAtTime(0.08, AC.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, AC.currentTime + (dur || 0.15));
      o.connect(g); g.connect(AC.destination);
      o.start(); o.stop(AC.currentTime + (dur || 0.15));
    } catch(e){}
  }
  function sndOk(){ beep(660, 0.12); later(function(){ beep(880, 0.15); }, 90); }
  function sndNo(){ beep(220, 0.25, 'square'); }
  function sndTick(){ beep(520, 0.07); }
  function sndWin(){ [523, 659, 784, 1047].forEach(function(f, i){ later(function(){ beep(f, 0.18); }, i * 120); }); }

  function hash(s){ var h = 2166136261; for(var i = 0; i < s.length; i++){ h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
  function rng(seed){ var a = seed; return function(){ a |= 0; a = a + 0x6D2B79F5 | 0; var t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  function mkCode(){ var c = ''; for(var i = 0; i < 6; i++) c += CODE_ABC[Math.floor(Math.random() * CODE_ABC.length)]; return c; }

  function vocabPool(){
    var pool = [];
    Object.keys(window.VOCAB_THEMES).forEach(function(k){
      window.VOCAB_THEMES[k].rows.forEach(function(row){ pool.push(row); });
    });
    return pool;
  }
  function buildMcq(code, salt, lang, count){
    var r = rng(hash(code + ':' + salt + ':' + lang));
    var pool = vocabPool(), li = LIDX[lang], qs = [], used = {};
    while(qs.length < count && pool.length > 4){
      var i = Math.floor(r() * pool.length);
      if(used[i]) continue; used[i] = 1;
      var row = pool[i], opts = [row[5]], tries = 0;
      while(opts.length < 4 && tries < 80){ var o = pool[Math.floor(r() * pool.length)][5]; if(opts.indexOf(o) < 0) opts.push(o); tries++; }
      for(var k = opts.length - 1; k > 0; k--){ var m = Math.floor(r() * (k + 1)), tmp = opts[k]; opts[k] = opts[m]; opts[m] = tmp; }
      qs.push({w: row[li], e: row[6], a: row[5], opts: opts});
    }
    return qs;
  }
  function buildGk(code){
    var r = rng(hash(code + ':gk'));
    var idx = window.GK_POOL.map(function(_, i){ return i; });
    for(var k = idx.length - 1; k > 0; k--){ var m = Math.floor(r() * (k + 1)), t = idx[k]; idx[k] = idx[m]; idx[m] = t; }
    return idx.slice(0, 15).map(function(i){
      var q = window.GK_POOL[i];
      var opts = q.o.slice();
      for(var k = opts.length - 1; k > 0; k--){ var m = Math.floor(r() * (k + 1)), t = opts[k]; opts[k] = opts[m]; opts[m] = t; }
      return {w: q.q, e: '🧠', a: q.a, opts: opts};
    });
  }

  /* ---------- per-match random + per-player seen tracking ---------- */
  function poolLenFor(game){
    if(game === 'gk') return window.GK_POOL.length;
    if(game === 'truth') return window.TRUTH_POOL.length;
    if(game === 'knowme') return window.KM_POOL.length;
    return vocabPool().length;
  }
  function needFor(game){
    if(game === 'quiz') return 12;
    if(game === 'race') return 60;
    if(game === 'memory') return 8;
    if(game === 'gk') return 15;
    if(game === 'truth') return 12;
    if(game === 'knowme') return 10;
    return 10;
  }
  function pickIds(game){
    var poolLen = poolLenFor(game), need = Math.min(needFor(game), poolLen);
    var key = 'lingua_seen_' + game, seen = [];
    try { seen = JSON.parse(localStorage.getItem(key) || '[]'); } catch(e){}
    var avail = [], i;
    for(i = 0; i < poolLen; i++) if(seen.indexOf(i) < 0) avail.push(i);
    if(avail.length < need){ avail = []; for(i = 0; i < poolLen; i++) avail.push(i); }
    for(var k = avail.length - 1; k > 0; k--){ var m = Math.floor(Math.random() * (k + 1)), t = avail[k]; avail[k] = avail[m]; avail[m] = t; }
    return avail.slice(0, need);
  }
  function recordSeen(game, ids){
    if(!ids || !ids.length) return;
    var poolLen = poolLenFor(game), key = 'lingua_seen_' + game, seen = [];
    try { seen = JSON.parse(localStorage.getItem(key) || '[]'); } catch(e){}
    ids.forEach(function(i){ if(seen.indexOf(i) < 0) seen.push(i); });
    if(seen.length >= poolLen) seen = [];
    try { localStorage.setItem(key, JSON.stringify(seen)); } catch(e){}
  }
  function buildMcqIds(lang, ids){
    var pool = vocabPool(), li = LIDX[lang];
    var r = rng(hash(ids.join(',') + ':' + lang));
    return ids.map(function(i){
      var row = pool[i]; if(!row) return null;
      var opts = [row[5]], tries = 0;
      while(opts.length < 4 && tries < 80){ var o = pool[Math.floor(r() * pool.length)][5]; if(opts.indexOf(o) < 0) opts.push(o); tries++; }
      for(var k = opts.length - 1; k > 0; k--){ var m = Math.floor(r() * (k + 1)), tmp = opts[k]; opts[k] = opts[m]; opts[m] = tmp; }
      return {w: row[li], e: row[6], a: row[5], opts: opts};
    }).filter(Boolean);
  }
  function buildGkIds(ids){
    var r = rng(hash(ids.join(',') + ':gk'));
    return ids.map(function(i){
      var q = window.GK_POOL[i]; if(!q) return null;
      var opts = q.o.slice();
      for(var k = opts.length - 1; k > 0; k--){ var m = Math.floor(r() * (k + 1)), t = opts[k]; opts[k] = opts[m]; opts[m] = t; }
      return {w: q.q, e: '🧠', a: q.a, opts: opts};
    }).filter(Boolean);
  }

  /* ---------- home / lobby ---------- */
  function render(){
    var box = el('duelBox');
    if(!box) return;
    if(S.st === 'home') renderHome(box);
    else if(S.st === 'lobby') renderLobby(box);
  }

  function renderHome(box){
    box.innerHTML =
      '<div class="du-card">' +
      '<h3>🎮 قاعة الألعاب اللايف</h3>' +
      '<p class="du-sub">اختاري اللعبة، اعملي الأوضة، وابعتي اللينك لصاحبتك — تلعبوا في نفس اللحظة 💜</p>' +
      '<div class="gl-grid" id="glGrid">' + Object.keys(GAMES).map(function(g){
        return '<button class="gl-card' + (g === S.game ? ' on' : '') + '" data-game="' + g + '"><span class="gl-i">' + GAMES[g].i + '</span><b>' + GAMES[g].n + '</b><small>' + GAMES[g].d + '</small></button>';
      }).join('') + '</div>' +
      '<div id="glLangWrap"' + (GAMES[S.game].vocab ? '' : ' style="display:none"') + '><div class="du-langs" id="duLangs">' + Object.keys(LANGS).map(function(k){
        return '<button class="tab lang-tab' + (k === S.lang ? ' active' : '') + '" data-dlang="' + k + '"><span class="ln">' + LANGS[k] + '</span></button>';
      }).join('') + '</div></div>' +
      '<input class="acc-in" id="duName" maxlength="20" placeholder="اسمك في اللعبة" value="' + esc(S.myName) + '">' +
      '<button class="btn du-big" id="duCreate">🎮 اعملي أوضة جديدة</button>' +
      '<div class="du-or">— أو عندك كود من صاحبتك؟ —</div>' +
      '<div class="du-join"><input class="acc-in" id="duCode" maxlength="6" placeholder="الكود (٦ حروف)" style="text-transform:uppercase;text-align:center;letter-spacing:4px">' +
      '<button class="btn" id="duJoin">دخول ⚡</button></div>' +
      '</div>';
    el('glGrid').addEventListener('click', function(e){
      var b = e.target.closest('[data-game]'); if(!b) return;
      S.game = b.dataset.game;
      el('glGrid').querySelectorAll('.gl-card').forEach(function(c){ c.classList.toggle('on', c === b); });
      el('glLangWrap').style.display = GAMES[S.game].vocab ? '' : 'none';
    });
    el('duLangs').addEventListener('click', function(e){
      var b = e.target.closest('[data-dlang]'); if(!b) return;
      S.lang = b.dataset.dlang;
      el('duLangs').querySelectorAll('.lang-tab').forEach(function(t){ t.classList.toggle('active', t === b); });
    });
    el('duName').addEventListener('input', function(){
      S.myName = el('duName').value.trim();
      try { localStorage.setItem('lingua_duel_name', S.myName); } catch(e){}
    });
    el('duCreate').onclick = function(){ if(!ensureName()) return; connect(mkCode(), true); };
    el('duJoin').onclick = function(){
      if(!ensureName()) return;
      var c = el('duCode').value.trim().toUpperCase();
      if(c.length !== 6){ toast('الكود ٦ حروف 🔤'); return; }
      connect(c, false);
    };
  }

  function ensureName(){
    if(S.myName) return true;
    var n = el('duName') && el('duName').value.trim();
    if(n){ S.myName = n; try { localStorage.setItem('lingua_duel_name', n); } catch(e){} return true; }
    toast('اكتبي اسمك الأول ✍️'); el('duName').focus(); return false;
  }

  function renderLobby(box){
    var link = 'https://lingua-karma.github.io/?duel=' + S.code + '&lang=' + S.lang + '&game=' + S.game;
    var share = 'https://wa.me/?text=' + encodeURIComponent('تعالي نلعب ' + GAMES[S.game].n + ' على Lingua! ' + GAMES[S.game].i + '💜\n' + link);
    box.innerHTML =
      '<div class="du-card">' +
      '<h3>' + GAMES[S.game].i + ' ' + GAMES[S.game].n + '</h3>' +
      '<div class="du-code">' + S.code + '</div>' +
      '<div class="du-sub">' + (GAMES[S.game].vocab ? LANGS[S.lang] + ' • ' : '') + GAMES[S.game].d + '</div>' +
      '<div class="du-conn" id="duConn" style="font-size:.82rem;margin-top:6px;cursor:pointer;color:' + (S._joined ? '#7dd6a0' : '#b9a878') + '">' + (S._joined ? '🟢 متصلين — جاهزين للعب' : '⏳ جاري الاتصال...') + '</div>' +
      '<a class="btn du-big" href="' + share + '" target="_blank" rel="noopener">💌 ابعتي الدعوة واتساب</a>' +
      '<div class="du-players" id="duPlayers"></div>' +
      '<button class="btn du-big" id="duReady" style="background:linear-gradient(135deg,#34d399,#0e9f6e)">✋ أنا جاهزة!</button>' +
      '<button class="du-leave" id="duLeave">← خروج</button>' +
      '</div>';
    el('duLeave').onclick = leave;
    el('duConn').onclick = function(){ if(!S._joined && window.duelRetry) window.duelRetry(); };
    el('duReady').onclick = function(){
      el('duReady').disabled = true; el('duReady').textContent = '✅ جاهزة — مستنيين ' + (S.opp ? esc(S.opp.name) : 'صاحبتك');
      S._iReady = true;
      duelLog('ready pressed (joined=' + !!S._joined + ')');
      trackState();
      send('ready', {});
      maybeStart();
    };
    renderPlayers();
  }

  function renderPlayers(){
    var p = el('duPlayers');
    if(!p) return;
    p.innerHTML = S.players.map(function(pl){
      return '<div class="du-p' + (pl.ready ? ' rdy' : '') + '"><div class="du-pav">' + esc(pl.name.charAt(0) || '؟') + '</div><div class="du-pn">' + esc(pl.name) + (pl.uid === S.uid ? ' (انتي)' : '') + '</div><div class="du-pr">' + (pl.ready ? '✅' : '⏳') + '</div></div>';
    }).join('') || '<div class="du-sub">مستنية صاحبتك تدخل... 💜</div>';
  }

  /* ---------- channel ---------- */
  function send(type, payload){
    if(!chan) return;
    chan.send({type: 'broadcast', event: 'du', payload: Object.assign({t: type, by: S.uid, name: S.myName}, payload)});
  }
  /* ---------- v59: reliability (slow networks, reconnects, dropped ready) ---------- */
  var _sid = null;
  try { _sid = sessionStorage.getItem('lingua_duel_sid'); if(!_sid){ _sid = Math.random().toString(36).slice(2,5); sessionStorage.setItem('lingua_duel_sid', _sid); } } catch(e){ _sid = '??'; }
  function duelLog(m){
    try{
      var log = JSON.parse(localStorage.getItem('lingua_duel_log')||'[]');
      log.push(new Date().toISOString().slice(11,19) + ' [' + _sid + '] ' + m);
      if(log.length > 60) log = log.slice(-60);
      localStorage.setItem('lingua_duel_log', JSON.stringify(log));
    }catch(e){}
  }
  function trackState(){
    if(!chan || !S._joined) return;
    var pl = {name: S.myName, ready: !!S._iReady, game: S.game};
    if(S.st !== 'lobby' && S.st !== 'home'){
      pl.started = true; pl.at = S.startT || (Date.now() + 1500); pl.lang = S.lang;
      if(S.qids && S.qids.length) pl.qi = S.qids;
    }
    try { chan.track(pl); } catch(e){ duelLog('track err'); }
  }
  function duelConnUI(ok, st){
    var c = el('duConn');
    if(!c) return;
    if(ok){
      c.textContent = '🟢 متصلين — جاهزين للعب';
      c.style.color = '#7dd6a0';
    } else {
      c.textContent = '🔴 الاتصال ضعيف (' + (st || 'انقطع') + ') — دوسي هنا نحاول تاني';
      c.style.color = '#e8a0a0';
    }
  }
  function startHeartbeat(){
    if(S._hb) return;
    S._hb = setInterval(function(){
      if(!chan){ clearInterval(S._hb); S._hb = null; return; }
      trackState();
      maybeStart();
    }, 4000);
  }
  function scheduleReconnect(why){
    if(S._rc) return;
    S._fails = (S._fails || 0) + 1;
    var delay = Math.min(15000, 2500 * S._fails);
    S._rc = setTimeout(function(){
      S._rc = null;
      if(!S.code || S.st === 'home') return;
      duelLog('auto-reconnect (' + why + ')');
      if(chan){ try { dsb.removeChannel(chan); } catch(e){} chan = null; }
      /* full socket reset: clears any server-side ghost channel so the re-join is clean */
      try { if(dsb && dsb.realtime){ dsb.realtime.disconnect(); } } catch(e){}
      setTimeout(function(){
        try { if(dsb && dsb.realtime){ dsb.realtime.connect(); } } catch(e){}
        setTimeout(function(){ if(S.code && S.st !== 'home') connect(S.code, S.host, true); }, 1200);
      }, 800);
    }, delay);
  }
  function connect(code, isHost, preserve){
    var freshRoom = !preserve && (S.code !== code);
    if(freshRoom){ S._iReady = false; S._oppReady = false; }
    if(!preserve){ S.st = 'lobby'; }
    S.code = code; S.host = isHost;
    S._joined = false; if(!preserve) S._subOnce = false;
    duelLog('connect ' + code + (isHost ? ' host' : ' guest') + (preserve ? ' (re)' : ''));
    S._attempt = (S._attempt || 0) + 1;
    S.pkey = S.uid + '-' + S._attempt + '-' + Math.random().toString(36).slice(2,6);
    chan = dsb.channel('duel-' + code, {config: {presence: {key: S.pkey}}});
    var myChan = chan;
    function isMine(k){ return k === S.uid || k.indexOf(S.uid + '-') === 0; }
    chan.on('presence', {event: 'sync'}, function(){
      if(chan !== myChan) return;
      var st = chan.presenceState(), arr = [];
      Object.keys(st).forEach(function(k){
        var pr = st[k][0];
        arr.push({uid: k, name: (pr && pr.name) || 'صديقة', ready: !!(pr && pr.ready)});
      });
      S.players = arr;
      var opp = arr.find(function(x){ return !isMine(x.uid); });
      if(opp){
        var pr2 = st[opp.uid] && st[opp.uid][0];
        if(pr2){
          if(pr2.ready) S._oppReady = true;
          if(!S.host){
            if(pr2.game && GAMES[pr2.game] && S.game !== pr2.game){ S.game = pr2.game; if(S.st === 'lobby') render(); }
            if(pr2.started && S.st === 'lobby'){
              if(pr2.lang && LANGS[pr2.lang]) S.lang = pr2.lang;
              if(pr2.qi) S.qids = pr2.qi;
              beginGame(pr2.at || (Date.now() + 1500));
              return;
            }
          }
        }
      }
      maybeStart();
      if(opp && !S.opp){ S.opp = {uid: opp.uid, name: opp.name}; sndTick(); }
      if(opp) S.opp.name = opp.name;
      if(S.st === 'lobby') renderPlayers();
      if(opp){ S._oppGoneT = false; }
      if(!opp && (S.st === 'game' || S.st === 'ending') && !S.oppDone && !S._oppGoneT){
        S._oppGoneT = true;
        later(function(){
          var st2 = chan ? chan.presenceState() : {};
          var still = Object.keys(st2).some(function(k){ return !isMine(k); });
          S._oppGoneT = false;
          if(!still && (S.st === 'game' || S.st === 'ending') && !S.oppDone){
            toast('صاحبتك خرجت — كملي لوحدك وهتكسبي بالانسحاب 👑');
            S.oppDone = true; S.oppForfeit = true; maybeFinish();
          }
        }, 8000);
      }
    });
    chan.on('broadcast', {event: 'du'}, function(ev){
      if(chan !== myChan) return;
      var p = ev.payload;
      if(!p || p.by === S.uid) return;
      if(p.t === 'ready'){ S.opp = S.opp || {uid: p.by, name: p.name}; S._oppReady = true; maybeStart(); }
      if(p.t === 'start'){ S.game = p.game || S.game; S.lang = p.lang || S.lang; if(p.qi) S.qids = p.qi; if(!S.host) beginGame(p.at); }
      if(p.t === 'ans'){ S.oppAns[p.q] = {ok: p.ok, ms: p.ms}; if(S.st === 'game') updOppTick(); }
      if(p.t === 'prog'){ S.oppN = p.n; updRaceOpp(); }
      if(p.t === 'claim'){ onOppClaim(p.pair); }
      if(p.t === 'done'){ S.oppDone = true; S.oppAns = p.ans || S.oppAns; S.oppN = p.n || S.oppN; S.oppMs = p.ms || 0; S.oppPairs = p.pairs; maybeFinish(); }
      if(p.t === 'tans'){ S.tAns[p.by] = {name: p.name, txt: p.txt, skip: p.skip}; truthMaybeReveal(); }
      if(p.t === 'tnext'){ if(!S.host) truthRound(p.r); }
      if(p.t === 'kready'){ S._oppKReady = true; knowMaybePhase2(); }
      if(p.t === 'kans'){ S.oppK = p.ans; knowMaybeReveal(); }
    });
    chan.subscribe(function(status){
      if(chan !== myChan) return;
      duelLog('chan ' + status);
      if(status === 'SUBSCRIBED'){
        S._joined = true;
        S._fails = 0;
        if(S._wdog){ clearTimeout(S._wdog); S._wdog = null; }
        trackState();
        if(S.st === 'lobby'){
          if(!S._subOnce){ S._subOnce = true; render(); } else { renderPlayers(); }
        }
        duelConnUI(true);
        startHeartbeat();
      } else if(status === 'CHANNEL_ERROR' || status === 'TIMED_OUT' || status === 'CLOSED'){
        S._joined = false;
        duelConnUI(false, status);
        scheduleReconnect(status);
      }
    });
    if(S._wdog){ clearTimeout(S._wdog); S._wdog = null; }
    S._wdog = setTimeout(function(){
      if(chan && !S._joined && S.st !== 'home'){
        duelLog('watchdog retry ' + code);
        try { dsb.removeChannel(chan); } catch(e){}
        chan = null;
        connect(code, isHost, true);
      }
    }, 12000);
  }
  window.duelRetry = function(){
    if(S.code && S.st !== 'home'){
      duelLog('manual retry');
      if(chan){ try { dsb.removeChannel(chan); } catch(e){} chan = null; }
      var c = el('duConn'); if(c){ c.textContent = '⏳ جاري الاتصال...'; c.style.color = '#b9a878'; }
      connect(S.code, S.host, true);
    }
  };
  /* coming back from WhatsApp / another app: heal a dead channel immediately */
  document.addEventListener('visibilitychange', function(){
    if(!document.hidden && S.code && S.st !== 'home' && !S._joined){
      duelLog('visible+not joined -> reconnect');
      scheduleReconnect('visible');
    }
  });
  /* test/debug hook: simulate a background-killed channel */
  window._duelClose = function(){ if(chan){ try { chan.unsubscribe(); } catch(e){} } };
  function maybeStart(){
    if(!S.host || S.st !== 'lobby') return;
    if(S._iReady && S._oppReady){
      S.st = 'starting';
      var at = Date.now() + 2500;
      S.startT = at;
      S.qids = pickIds(S.game);
      duelLog('start fired');
      send('start', {at: at, game: S.game, lang: S.lang, qi: S.qids});
      trackState();
      beginGame(at);
    }
  }
  function leave(){
    clearTimers();
    if(S._hb){ clearInterval(S._hb); S._hb = null; }
    if(S._wdog){ clearTimeout(S._wdog); S._wdog = null; }
    if(S._rc){ clearTimeout(S._rc); S._rc = null; }
    if(chan){ try { dsb.removeChannel(chan); } catch(e){} chan = null; }
    var keep = {game: S.game, lang: S.lang, uid: S.uid, myName: S.myName};
    S = {st:'home', game:keep.game, code:null, lang:keep.lang, host:false, uid:keep.uid, myName:keep.myName, opp:null, players:[],
         qs:[], qi:0, startT:0, myAns:[], oppAns:[], myScore:0, oppDone:false, oppForfeit:false,
         raceN:0, raceMs:0, oppN:0, mem:{}, timers:[]};
    render();
  }

  /* ---------- game start dispatch ---------- */
  var QTIME = 12000, GAP = 2000;
  function beginGame(at){
    clearTimers();
    duelLog('beginGame');
    S.st = 'game'; S.qi = 0; S.startT = at; S.myAns = []; S.oppAns = []; S.myScore = 0;
    S.oppDone = false; S.oppForfeit = false; S.raceN = 0; S.raceMs = 0; S.oppN = 0; S.oppMs = 0; S.mem = {flip:[], mine:[], opp:[], done:false};
    if(S.game === 'race'){
      S.qs = S.qids ? buildMcqIds(S.lang, S.qids) : buildMcq(S.code, 'race', S.lang, 60);
      raceShell(at);
    } else if(S.game === 'memory'){
      memShell(at);
    } else if(S.game === 'truth'){
      truthShell(at);
    } else if(S.game === 'knowme'){
      knowShell(at);
    } else {
      S.qs = (S.game === 'gk') ? (S.qids ? buildGkIds(S.qids) : buildGk(S.code)) : (S.qids ? buildMcqIds(S.lang, S.qids) : buildMcq(S.code, 'quiz', S.lang, 12));
      quizShell(at);
    }
    recordSeen(S.game, S.qids);
  }

  /* ---------- shared quiz shell (quiz + gk) ---------- */
  function gameHead(sub){
    return '<div class="du-card du-game">' +
      '<div class="du-top"><div class="du-me" id="duMeScore">💎 0</div>' +
      '<div class="du-prog" id="duProg">' + sub + '</div>' +
      '<div class="du-opp" id="duOppScore">' + esc(S.opp ? S.opp.name : 'صاحبتك') + ': 💎 0</div></div>' +
      '<div class="du-timer"><div class="du-tbar" id="duTbar"></div></div>' +
      '<div class="du-q" id="duQ"></div>' +
      '<div class="du-opts" id="duOpts"></div>' +
      '<div class="du-fb" id="duFb"></div></div>';
  }
  function quizShell(at){
    el('duelBox').innerHTML = gameHead('١ / ' + S.qs.length);
    var wait = at - Date.now();
    el('duQ').innerHTML = '<div class="du-count">استعدي... ⚡</div>';
    if(wait > 0) el('duFb').textContent = 'البداية بعد ' + Math.ceil(wait / 1000) + '...';
    later(function(){ runQ(0); }, Math.max(50, wait));
  }
  function runQ(i){
    if(i >= S.qs.length || S.st !== 'game') return endMyGame();
    S.qi = i;
    var q = S.qs[i];
    el('duProg').textContent = (i + 1) + ' / ' + S.qs.length;
    el('duQ').innerHTML = '<div class="du-we">' + q.e + '</div><div class="du-word"' + (S.game === 'gk' ? ' style="direction:rtl;font-size:1.15rem;line-height:1.8"' : '') + '>' + esc(q.w) + '</div>';
    el('duFb').textContent = '';
    el('duOpts').innerHTML = q.opts.map(function(o, k){
      return '<button class="du-opt" data-k="' + k + '">' + esc(o) + '</button>';
    }).join('');
    var t0 = Date.now(), answered = false;
    var tbar = el('duTbar');
    tbar.style.transition = 'none'; tbar.style.width = '100%';
    requestAnimationFrame(function(){
      tbar.style.transition = 'width ' + (QTIME / 1000) + 's linear';
      tbar.style.width = '0%';
    });
    el('duOpts').onclick = function(e){
      var b = e.target.closest('.du-opt');
      if(!b || answered) return;
      answered = true;
      var pick = q.opts[+b.dataset.k], ok = (pick === q.a), ms = Date.now() - t0;
      S.myAns[i] = {ok: ok, ms: ms};
      el('duOpts').querySelectorAll('.du-opt').forEach(function(o){
        o.disabled = true;
        if(o.textContent === q.a) o.classList.add('right');
      });
      if(!ok) b.classList.add('wrong');
      if(ok){ sndOk(); } else { sndNo(); }
      el('duFb').textContent = ok ? 'صح! +10 💎' : 'غلط — الصح: ' + q.a;
      send('ans', {q: i, ok: ok, ms: ms});
      updateMyScore();
    };
    later(function(){
      if(!answered){
        S.myAns[i] = {ok: false, ms: QTIME};
        el('duOpts').querySelectorAll('.du-opt').forEach(function(o){
          o.disabled = true;
          if(o.textContent === q.a) o.classList.add('right');
        });
        el('duFb').textContent = 'الوقت خلص ⏰ الصح: ' + q.a;
        send('ans', {q: i, ok: false, ms: QTIME});
        updateMyScore();
      }
    }, QTIME);
    later(function(){ runQ(i + 1); }, QTIME + GAP);
  }
  function calcScore(ans){ var s = 0; for(var i = 0; i < 10; i++){ if(ans[i] && ans[i].ok) s += 10; } return s; }
  function calcBonus(my, opp){ var b = 0; for(var i = 0; i < 10; i++){ if(my[i] && my[i].ok && (!opp[i] || !opp[i].ok || my[i].ms < opp[i].ms)) b += 3; } return b; }
  function updateMyScore(){
    S.myScore = calcScore(S.myAns);
    var e1 = el('duMeScore');
    if(e1) e1.textContent = '💎 ' + S.myScore;
  }
  function updOppTick(){
    var e2 = el('duOppScore');
    if(e2 && S.opp && S.game !== 'race') e2.textContent = S.opp.name + ': ✓ ' + Object.keys(S.oppAns).length + '/' + S.qs.length;
  }

  /* ---------- race (60 seconds) ---------- */
  function raceShell(at){
    el('duelBox').innerHTML = gameHead('⏱️ ٦٠');
    var wait = at - Date.now();
    el('duQ').innerHTML = '<div class="du-count">استعدي... ⚡</div>';
    later(function(){ raceQ(0); }, Math.max(50, wait));
    later(endMyGame, Math.max(100, wait + 60000));
    raceTick(wait);
  }
  function raceTick(wait){
    var end = at0() + 60000;
    function at0(){ return S.startT; }
    var iv = setInterval(function(){
      var left = Math.max(0, Math.round((end - Date.now()) / 1000));
      var p = el('duProg');
      if(p) p.textContent = '⏱️ ' + left;
      var tb = el('duTbar');
      if(tb){ tb.style.transition = 'none'; tb.style.width = (left / 60 * 100) + '%'; }
      if(left <= 0) clearInterval(iv);
    }, 500);
    S.timers.push(iv);
  }
  function raceQ(i){
    if(S.st !== 'game') return;
    if(i >= S.qs.length) return;
    S.qi = i;
    var q = S.qs[i];
    el('duQ').innerHTML = '<div class="du-we">' + q.e + '</div><div class="du-word">' + esc(q.w) + '</div>';
    el('duOpts').innerHTML = q.opts.map(function(o, k){
      return '<button class="du-opt" data-k="' + k + '">' + esc(o) + '</button>';
    }).join('');
    var t0 = Date.now();
    el('duOpts').onclick = function(e){
      var b = e.target.closest('.du-opt');
      if(!b) return;
      var pick = q.opts[+b.dataset.k], ok = (pick === q.a);
      if(ok){ sndOk(); S.raceN++; S.raceMs += (Date.now() - t0); } else { sndNo(); }
      var ms = el('duMeScore');
      if(ms) ms.textContent = '💎 ' + S.raceN;
      send('prog', {n: S.raceN});
      raceQ(i + 1);
    };
  }
  function updRaceOpp(){
    var e2 = el('duOppScore');
    if(e2 && S.opp && S.game === 'race') e2.textContent = S.opp.name + ': 💎 ' + S.oppN;
  }

  /* ---------- memory (shared claims) ---------- */
  function memShell(at){
    var r = S.qids ? rng(hash(S.qids.join(',') + ':mem')) : rng(hash(S.code + ':mem:' + S.lang));
    var pool = vocabPool(), used = {}, pairs = [];
    if(S.qids){
      S.qids.forEach(function(i){ if(pool[i]) pairs.push({f: pool[i][LIDX[S.lang]], a: pool[i][5], e: pool[i][6]}); });
    }
    while(pairs.length < 8){
      var i = Math.floor(r() * pool.length);
      if(used[i]) continue; used[i] = 1;
      pairs.push({f: pool[i][LIDX[S.lang]], a: pool[i][5], e: pool[i][6]});
    }
    var cards = [];
    pairs.forEach(function(p, k){
      cards.push({pair: k, txt: p.f, e: p.e, kind: 'f'});
      cards.push({pair: k, txt: p.a, e: p.e, kind: 'a'});
    });
    for(var k = cards.length - 1; k > 0; k--){ var m = Math.floor(r() * (k + 1)), t = cards[k]; cards[k] = cards[m]; cards[m] = t; }
    S.memPairs = pairs;
    el('duelBox').innerHTML =
      '<div class="du-card du-game">' +
      '<div class="du-top"><div class="du-me" id="duMeScore">🃏 0</div>' +
      '<div class="du-prog" id="duProg">⏱️ ١٢٠</div>' +
      '<div class="du-opp" id="duOppScore">' + esc(S.opp ? S.opp.name : 'صاحبتك') + ': 🃏 0</div></div>' +
      '<div class="mem-grid" id="memGrid">' +
      cards.map(function(c, i){
        return '<button class="mem-c" data-i="' + i + '" data-pair="' + c.pair + '"><span class="mem-b">؟</span><span class="mem-f">' + (c.kind === 'f' ? c.e + ' ' : '') + esc(c.txt) + '</span></button>';
      }).join('') + '</div>' +
      '<div class="du-fb" id="duFb">لاقي الكلمة ومعناها! 🃏</div></div>';
    var wait = at - Date.now();
    var grid = el('memGrid');
    grid.style.pointerEvents = 'none';
    el('duFb').textContent = 'البداية بعد ' + Math.ceil(Math.max(0, wait) / 1000) + '... استعدي!';
    later(function(){
      grid.style.pointerEvents = '';
      el('duFb').textContent = 'لاقي الكلمة ومعناها! 🃏';
    }, Math.max(50, wait));
    var end = at + 120000;
    var iv = setInterval(function(){
      var left = Math.max(0, Math.round((end - Date.now()) / 1000));
      var p = el('duProg'); if(p) p.textContent = '⏱️ ' + left;
      if(left <= 0) clearInterval(iv);
    }, 500);
    S.timers.push(iv);
    later(endMyGame, Math.max(100, wait + 120000));
    var flipped = [];
    grid.onclick = function(e){
      var b = e.target.closest('.mem-c');
      if(!b || b.disabled || b.classList.contains('open')) return;
      b.classList.add('open');
      flipped.push(b);
      sndTick();
      if(flipped.length === 2){
        var a = flipped[0], c = flipped[1];
        if(a.dataset.pair === c.dataset.pair){
          sndOk();
          a.disabled = c.disabled = true;
          a.classList.add('mine'); c.classList.add('mine');
          S.mem.mine.push(+a.dataset.pair);
          var ms = el('duMeScore'); if(ms) ms.textContent = '🃏 ' + S.mem.mine.length;
          send('claim', {pair: +a.dataset.pair});
          el('duFb').textContent = 'تطابق! دي ليكي 💛';
          if(S.mem.mine.length + S.mem.opp.length >= 8) endMyGame();
        } else {
          sndNo();
          var g = grid;
          g.style.pointerEvents = 'none';
          later(function(){
            a.classList.remove('open'); c.classList.remove('open');
            g.style.pointerEvents = '';
          }, 700);
        }
        flipped = [];
      }
    };
  }
  function onOppClaim(pair){
    if(S.st !== 'game' || S.game !== 'memory') return;
    S.mem.opp.push(pair);
    document.querySelectorAll('.mem-c[data-pair="' + pair + '"]').forEach(function(b){
      b.disabled = true; b.classList.add('open', 'theirs');
    });
    var e2 = el('duOppScore');
    if(e2 && S.opp) e2.textContent = S.opp.name + ': 🃏 ' + S.mem.opp.length;
    el('duFb').textContent = (S.opp ? S.opp.name : 'صاحبتك') + ' لقت تطابق! 👀';
    if(S.mem.mine.length + S.mem.opp.length >= 8) endMyGame();
  }

  /* ---------- truth (group) ---------- */
  function truthShell(at){
    var r = rng(hash(S.code + ':truth'));
    var fun, emb;
    if(S.qids){
      fun = []; emb = [];
      S.qids.forEach(function(i){ var q = window.TRUTH_POOL[i]; if(q) (q.c === 'embar' ? emb : fun).push(q); });
    } else {
      fun = window.TRUTH_POOL.filter(function(q){ return q.c === 'fun'; });
      emb = window.TRUTH_POOL.filter(function(q){ return q.c === 'embar'; });
      function shuf(a){ a = a.slice(); for(var k = a.length - 1; k > 0; k--){ var m = Math.floor(r() * (k + 1)), t = a[k]; a[k] = a[m]; a[m] = t; } return a; }
      fun = shuf(fun); emb = shuf(emb);
    }
    S.tQs = [];
    var nR = Math.min(6, fun.length, emb.length);
    for(var i = 0; i < nR; i++){ S.tQs.push(fun[i]); S.tQs.push(emb[i]); }
    S.tR = 0; S.tAns = {}; S.tMine = false;
    el('duelBox').innerHTML = '<div class="du-card"><div id="duQ"></div><div id="duOpts"></div><div class="du-fb" id="duFb"></div></div>';
    var wait = at - Date.now();
    el('duQ').innerHTML = '<div class="du-count">استعدي... 👑</div>';
    later(function(){ truthRound(0); }, Math.max(50, wait));
  }
  function truthRound(r){
    if(r >= S.tQs.length){ return truthEnd(); }
    S.st = 'game'; S.tR = r; S.tAns = {}; S.tMine = false;
    var q = S.tQs[r];
    el('duQ').innerHTML =
      '<div class="du-we">' + (q.c === 'embar' ? '🙈' : '😄') + '</div>' +
      '<div class="du-word" style="direction:rtl;font-size:1.2rem;line-height:1.9">' + esc(q.q) + '</div>' +
      '<div class="du-sub" style="margin-top:6px">' + (q.c === 'embar' ? 'سؤال محرج شوية 😳' : 'سؤال حلو') + ' • ' + (r + 1) + ' / ' + S.tQs.length + '</div>';
    el('duOpts').innerHTML =
      '<textarea class="acc-in" id="tIn" rows="2" maxlength="200" placeholder="جاوبي بصراحة..."></textarea>' +
      '<div style="display:flex;gap:8px;justify-content:center">' +
      '<button class="btn" id="tSend">ابعتي الإجابة 💬</button>' +
      '<button class="btn" id="tSkip" style="background:rgba(255,255,255,.1)">تخطّي 🙈</button></div>' +
      '<div id="tWho" class="du-sub" style="margin-top:10px"></div>';
    el('duFb').textContent = '';
    el('tSend').onclick = function(){
      var v = el('tIn').value.trim();
      if(!v){ toast('اكتبي إجابتك أو دوسي تخطّي 💭'); return; }
      S.tMine = true;
      S.tAns[S.uid] = {name: S.myName, txt: v, skip: false};
      send('tans', {txt: v, skip: false});
      truthLock();
    };
    el('tSkip').onclick = function(){
      S.tMine = true;
      S.tAns[S.uid] = {name: S.myName, txt: '', skip: true};
      send('tans', {txt: '', skip: true});
      truthLock();
    };
    truthWho();
    later(function(){ if(!S.tMine){ /* gentle nudge */ var f = el('duFb'); if(f) f.textContent = '⏳ مستنيينك...'; } }, 45000);
  }
  function truthLock(){
    el('tSend').disabled = true; el('tSkip').disabled = true; el('tIn').disabled = true;
    truthWho();
    truthMaybeReveal();
  }
  function truthWho(){
    var w = el('tWho');
    if(!w) return;
    var total = S.players.length, got = Object.keys(S.tAns).length;
    w.textContent = 'جاوبوا ' + got + ' من ' + total + ' ⏳';
  }
  function truthMaybeReveal(){
    if(S.st !== 'game' || S.game !== 'truth') return;
    var total = S.players.length;
    if(Object.keys(S.tAns).length < total) return;
    /* everyone answered -> reveal */
    S.st = 'revealing';
    var q = S.tQs[S.tR];
    el('duQ').innerHTML = '<div class="du-word" style="direction:rtl;font-size:1.15rem;line-height:1.8">' + esc(q.q) + '</div>';
    var html = Object.keys(S.tAns).map(function(uid){
      var a = S.tAns[uid];
      return '<div class="du-frow' + (uid === S.uid ? ' me' : '') + '"><span>' + esc(a.name) + '</span><b style="font-weight:600;max-width:65%;text-align:left">' + (a.skip ? 'استحيت 😳' : esc(a.txt)) + '</b></div>';
    }).join('');
    el('duOpts').innerHTML = '<div class="du-final">' + html + '</div>' +
      (S.host ? '<button class="btn du-big" id="tNext">السؤال اللي بعده ›</button>' : '<div class="du-sub">مستنيين المضيفة تقول السؤال اللي بعده...</div>');
    sndOk();
    if(S.host){
      el('tNext').onclick = function(){
        send('tnext', {r: S.tR + 1});
        truthRound(S.tR + 1);
      };
    }
  }
  function truthEnd(){
    S.st = 'result';
    if(typeof window.awardPoints === 'function') window.awardPoints(15, 'لعبتِ الحقيقة 👑');
    el('duelBox').innerHTML =
      '<div class="du-card du-result"><div class="du-crown">👑</div>' +
      '<h3>الضحك كان بطل الليلة 😂💜</h3>' +
      '<div class="du-xp">+15 نقطة في رصيدك ✨</div>' +
      '<button class="btn du-big" id="duAgain">👑 جولة تانية</button>' +
      '<button class="du-leave" id="duHome">← القاعة</button></div>';
    el('duAgain').onclick = function(){ var g = S.game; leave(); S.game = g; connect(mkCode(), true); };
    el('duHome').onclick = function(){ leave(); };
  }

  /* ---------- know-me (2 players) ---------- */
  function knowShell(at){
    S.kMine = []; S.kGuess = []; S.oppK = null; S._oppKReady = false; S.kPhase = 1;
    if(S.qids){
      S.kQs = S.qids.map(function(i){ return window.KM_POOL[i]; }).filter(Boolean);
    } else {
      var rk = rng(hash(S.code + ':know'));
      var ki = window.KM_POOL.map(function(_, i){ return i; });
      for(var k = ki.length - 1; k > 0; k--){ var m = Math.floor(rk() * (k + 1)), t = ki[k]; ki[k] = ki[m]; ki[m] = t; }
      S.kQs = ki.slice(0, 10).map(function(i){ return window.KM_POOL[i]; });
    }
    var wait = at - Date.now();
    el('duelBox').innerHTML = '<div class="du-card"><div id="duQ"><div class="du-count">استعدي... 💜</div></div><div id="duOpts"></div><div class="du-fb" id="duFb"></div></div>';
    later(function(){ knowQ(0); }, Math.max(50, wait));
  }
  function knowQ(i){
    if(S.kPhase === 1 && i >= S.kQs.length){
      S.kPhase = 1.5;
      send('kready', {});
      el('duQ').innerHTML = '<div class="du-word" style="font-size:1.1rem;direction:rtl">خلصتي إجاباتك! مستنيين ' + esc(S.opp ? S.opp.name : 'صاحبتك') + '... ⏳</div>';
      el('duOpts').innerHTML = '';
      knowMaybePhase2();
      return;
    }
    if(S.kPhase === 2 && i >= S.kQs.length){
      S.kPhase = 2.5;
      send('kans', {ans: S.kMine});
      el('duQ').innerHTML = '<div class="du-word" style="font-size:1.1rem;direction:rtl">خمنتي كل حاجة! اللحظة الحاسمة... 👀</div>';
      el('duOpts').innerHTML = '';
      knowMaybeReveal();
      return;
    }
    var q = S.kQs[i];
    var guessing = S.kPhase === 2;
    el('duQ').innerHTML =
      '<div class="du-we">' + (guessing ? '🔮' : '💜') + '</div>' +
      '<div class="du-word" style="direction:rtl;font-size:1.2rem">' + (guessing ? esc(S.opp ? S.opp.name : 'صاحبتك') + ' هتختار إيه؟<br>' : '') + esc(q.q) + '</div>' +
      '<div class="du-sub" style="margin-top:6px">' + (guessing ? 'خمّني إجابتها' : 'جاوبي عن نفسك (سرية 🤫)') + ' • ' + (i + 1) + ' / ' + S.kQs.length + '</div>';
    el('duOpts').innerHTML = q.o.map(function(o, k){
      return '<button class="du-opt" data-k="' + k + '">' + esc(o) + '</button>';
    }).join('');
    el('duOpts').onclick = function(e){
      var b = e.target.closest('.du-opt'); if(!b) return;
      sndTick();
      if(guessing) S.kGuess[i] = +b.dataset.k; else S.kMine[i] = +b.dataset.k;
      knowQ(i + 1);
    };
  }
  function knowMaybePhase2(){
    if(S.game !== 'knowme') return;
    if(S.kPhase === 1.5 && S._oppKReady){
      S.kPhase = 2;
      el('duQ').innerHTML = '<div class="du-word" style="font-size:1.1rem;direction:rtl">دلوقتي خمّني إجابات ' + esc(S.opp ? S.opp.name : 'صاحبتك') + '! 🔮</div>';
      later(function(){ knowQ(0); }, 1200);
    }
  }
  function knowMaybeReveal(){
    if(S.game !== 'knowme') return;
    if(S.kPhase === 2.5 && S.oppK){
      S.kPhase = 3; S.st = 'result';
      var hits = 0, rows = '';
      for(var i = 0; i < S.kQs.length; i++){
        var ok = S.kGuess[i] === S.oppK[i];
        if(ok) hits++;
        rows += '<div class="du-frow"><span>' + esc(S.kQs[i].q) + '</span><b>' + (ok ? '✅' : '❌') + '</b></div>';
      }
      /* opponent's hits on me: I know my answers; she computes hers. Approximate display: show my hits only */
      var xp = hits * 5;
      if(typeof window.awardPoints === 'function') window.awardPoints(xp, 'قد إيه تعرفيني 💜');
      if(hits >= 6){ sndWin(); try { confetti(); } catch(e){} }
      el('duelBox').innerHTML =
        '<div class="du-card du-result"><div class="du-crown">' + (hits >= 6 ? '💜' : (hits >= 3 ? '🤝' : '😅')) + '</div>' +
        '<h3>' + (hits >= 6 ? 'بتعرفو بعض جامد! 💜' : (hits >= 3 ? 'معرفة حلوة 🤝' : 'لسه محتاجين قعدة أكتر 😂')) + '</h3>' +
        '<div class="du-xp">خمّنتي ' + hits + ' من ' + S.kQs.length + ' صح — +' + xp + ' نقطة ✨</div>' +
        '<div class="du-final" style="text-align:right">' + rows + '</div>' +
        '<button class="btn du-big" id="duAgain">💜 العبي تاني</button>' +
        '<button class="du-leave" id="duHome">← القاعة</button></div>';
      el('duAgain').onclick = function(){ var g = S.game; leave(); S.game = g; connect(mkCode(), true); };
      el('duHome').onclick = function(){ leave(); };
    }
  }

  /* ---------- end / result ---------- */
  function endMyGame(){
    if(S.st !== 'game') return;
    S.st = 'ending';
    var payload = {ans: S.myAns, n: S.raceN, ms: S.raceMs, pairs: S.mem ? S.mem.mine.length : 0};
    send('done', payload);
    var f = el('duFb');
    if(f) f.textContent = 'خلصتي! مستنيين ' + (S.opp ? S.opp.name : 'صاحبتك') + '... ⏳';
    later(maybeFinish, 10000);
  }
  function maybeFinish(){
    if(S.st !== 'ending' && S.st !== 'game') return;
    if(!S.oppDone) return;
    S.st = 'result';
    clearTimers();
    var myTotal, oppTotal, unit = '💎';
    if(S.game === 'race'){
      myTotal = S.raceN; oppTotal = S.oppN || 0;
      if(myTotal === oppTotal && !S.oppForfeit){ if(S.raceMs < (S.oppMs || Infinity)) myTotal += 0.5; else oppTotal += 0.5; }
    } else if(S.game === 'memory'){
      myTotal = S.mem.mine.length; oppTotal = S.oppPairs != null ? S.oppPairs : S.mem.opp.length; unit = '🃏';
    } else {
      myTotal = calcScore(S.myAns) + calcBonus(S.myAns, S.oppAns);
      oppTotal = calcScore(S.oppAns) + calcBonus(S.oppAns, S.myAns);
    }
    if(S.oppForfeit) oppTotal = 0;
    showResult(myTotal, oppTotal, unit);
  }
  function showResult(myTotal, oppTotal, unit){
    var oppName = S.opp ? S.opp.name : 'صاحبتك';
    var won = myTotal > oppTotal, tie = myTotal === oppTotal;
    var xp = won ? 30 : (tie ? 15 : 10);
    if(typeof window.awardPoints === 'function') window.awardPoints(xp, won ? 'كسبتِ ' + GAMES[S.game].n + ' 👑' : 'لعبتِ ' + GAMES[S.game].n);
    if(won){ sndWin(); try { confetti(); } catch(e){} }
    el('duelBox').innerHTML =
      '<div class="du-card du-result">' +
      '<div class="du-crown">' + (won ? '👑' : (tie ? '🤝' : '💪')) + '</div>' +
      '<h3>' + (won ? 'مبروووك! كسبتي 🎉' : (tie ? 'تعادل حلو! 🤝' : 'ماتش حلو! المرة الجاية ليكي 💪')) + '</h3>' +
      '<div class="du-final">' +
      '<div class="du-frow me"><span>' + esc(S.myName) + ' (انتي)</span><b>' + unit + ' ' + myTotal + '</b></div>' +
      '<div class="du-frow"><span>' + esc(oppName) + '</span><b>' + unit + ' ' + oppTotal + '</b></div>' +
      '</div>' +
      '<div class="du-xp">+' + xp + ' نقطة في رصيدك ✨</div>' +
      '<button class="btn du-big" id="duAgain">' + GAMES[S.game].i + ' العبي تاني</button>' +
      '<button class="du-leave" id="duHome">← القاعة</button></div>';
    el('duAgain').onclick = function(){
      var g = S.game;
      leave();
      S.game = g;
      connect(mkCode(), true);
      toast('أوضة جديدة اتعملت — ابعتي اللينك تاني 💌');
    };
    el('duHome').onclick = function(){ leave(); };
  }

  /* ---------- boot ---------- */
  function boot(){
    if(!window.supabase){ setTimeout(boot, 400); return; }
    dsb = window.supabase.createClient(SUPA_URL, SUPA_KEY);
    S.uid = sessionStorage.getItem('lingua_duel_uid');
    if(!S.uid){ S.uid = 'u' + Math.random().toString(36).slice(2, 12); sessionStorage.setItem('lingua_duel_uid', S.uid); }
    S.myName = localStorage.getItem('lingua_duel_name') || '';
    dsb.auth.getSession().then(function(r){
      if(r.data && r.data.session){
        dsb.from('profiles').select('display_name').eq('id', r.data.session.user.id).maybeSingle().then(function(pr){
          if(pr.data && pr.data.display_name && !S.myName){
            S.myName = pr.data.display_name;
            var n = el('duName'); if(n) n.value = S.myName;
          }
        });
      }
    });
    render();
    try {
      var q = new URLSearchParams(location.search);
      var dc = q.get('duel'), dl = q.get('lang'), dg = q.get('game');
      if(dg && GAMES[dg]) S.game = dg;
      if(dl && LANGS[dl]) S.lang = dl;
      if(dc && /^[A-Z0-9]{6}$/.test(dc.toUpperCase())){
        if(dg || dl) render();
        el('duCode').value = dc.toUpperCase();
        location.hash = 'duel';
        history.replaceState(null, '', location.pathname + '#duel');
        toast('وصلكي تحدي! اكتبي اسمك ودوسي دخول ⚔️');
      }
    } catch(e){}
  }

  /* menu card */
  try {
    if(!MENU.some(function(m){ return m[0] === 'duel'; })){
      MENU.push(['duel','⚔️','تحدي لايف']); VIEWIDS.push('duel');
      document.getElementById('menuGrid').insertAdjacentHTML('beforeend', '<a class="menu-card" href="#duel"><span class="m-ico">⚔️</span><span class="m-name">تحدي لايف</span></a>');
    }
  } catch(e){}

  boot();
})();


/* ================= v49: new themes + profile chip + theme sync ================= */
(function(){
  /* ---- 6 new luxury themes ---- */
  var NEW_THEMES = {
    ruby:   ['ياقوتي ❤️', '#e11d48'],
    amber:  ['كهرماني 🍯', '#f59e0b'],
    orchid: ['أوركيد 🌺', '#d946ef'],
    bronze: ['برونزي 🏺', '#c08a4e'],
    peach:  ['خوخي 🍑', '#d0608a'],
    lilac:  ['ليلكي 🪻', '#9d7bff']
  };
  try {
    Object.keys(NEW_THEMES).forEach(function(k){
      THEMES[k] = NEW_THEMES[k][0];
      THEME_COLORS[k] = NEW_THEMES[k][1];
    });
    if(typeof window.buildThemeDots === 'function') window.buildThemeDots();
  } catch(e){}

  /* ---- theme sync to profile (saved per user, every device) ---- */
  var SUPA_URL = 'https://yzzlgalxjaaevmytdazf.supabase.co';
  var SUPA_KEY = 'sb_publishable_EmbKVWREHSs3sZ_nBKFyqg_zxv3Z38-';
  var tsb = null, tme = null, tTimer = null;
  function queueThemeSync(t){
    if(!tme) return;
    clearTimeout(tTimer);
    tTimer = setTimeout(function(){
      tsb.from('profiles').update({theme: t}).eq('id', tme.id).then(function(){});
    }, 1500);
  }
  try {
    var _apply = window.applyTheme;
    if(typeof _apply === 'function'){
      window.applyTheme = function(name){
        _apply(name);
        queueThemeSync(name);
        refreshChip();
      };
    }
  } catch(e){}

  /* ---- profile chip in header ---- */
  function lvl(){ return Math.floor(getLifetime() / 200) + 1; }
  function chipName(){
    return localStorage.getItem('lingua_duel_name') || 'ضيفتنا';
  }
  function refreshChip(){
    var c = document.getElementById('lxChip');
    if(!c) return;
    var nm = chipName();
    c.querySelector('.lx-cn').textContent = nm;
    c.querySelector('.lx-cl').textContent = 'لفل ' + lvl() + ' • 💎 ' + getPoints();
    c.querySelector('.lx-ca').textContent = (nm || '؟').charAt(0);
  }
  window.refreshChip = refreshChip;
  function buildChip(){
    var header = document.querySelector('header');
    var pill = header && header.querySelector('.acc-pill');
    if(!header || !pill || document.getElementById('lxChip')) return;
    var chip = document.createElement('a');
    chip.href = '#account';
    chip.id = 'lxChip';
    chip.className = 'lx-chip';
    chip.innerHTML = '<span class="lx-ca">؟</span><span class="lx-cinfo"><b class="lx-cn">ضيفتنا</b><small class="lx-cl">لفل ١</small></span>';
    header.insertBefore(chip, pill);
    refreshChip();
    /* keep XP fresh */
    try {
      var _award = window.awardPoints;
      window.awardPoints = function(n, label){
        if(typeof _award === 'function') _award(n, label);
        setTimeout(refreshChip, 100);
      };
    } catch(e){}
  }

  function boot(){
    buildChip();
    if(!window.supabase){ setTimeout(boot, 400); return; }
    tsb = window.supabase.createClient(SUPA_URL, SUPA_KEY);
    tsb.auth.getSession().then(function(r){
      if(r.data && r.data.session){
        tme = r.data.session.user;
        tsb.from('profiles').select('display_name,theme').eq('id', tme.id).maybeSingle().then(function(pr){
          if(!pr.data) return;
          if(pr.data.display_name){
            try { localStorage.setItem('lingua_duel_name', pr.data.display_name); } catch(e){}
            refreshChip();
          }
          var local = localStorage.getItem('lingua_theme') || 'rose';
          if(pr.data.theme && pr.data.theme !== local && THEMES[pr.data.theme]){
            if(typeof window.applyTheme === 'function') window.applyTheme(pr.data.theme);
          } else if(!pr.data.theme){
            queueThemeSync(local);
          }
        });
      }
    });
  }
  boot();
})();


/* ================= v54: gender choice (ولد/بنت) ================= */
/* first-run picker + account settings + feminine->masculine UI text transform */
(function(){
  var KEY = 'lingua_gender';
  var LG = 'f', firstRun = false;
  try {
    LG = localStorage.getItem(KEY) || '';
    if(!LG){ firstRun = true; LG = 'f'; }
  } catch(e){}
  window.LG = LG;

  var PAIRS = [
    ['انتي','انت'],['إنتي','إنت'],
    ['اكتبيها','اكتبها'],['اكتبي','اكتب'],['اختاري','اختار'],['استمعي','استمع'],['اسمعيها','اسمعها'],
    ['ابعتي','ابعت'],['استعدي','استعد'],['تعالي','تعالى'],['تفضلي','تفضل'],['اختبري','اختبر'],
    ['حمليها','حملها'],['اتكلمي','اتكلم'],['تصبحي','تصبح'],['اتعلمي','اتعلم'],['تتعلمي','تتعلم'],
    ['تكسريها','تكسرها'],['تفتحي','تفتح'],['اتفرجي','اتفرج'],['تدخلي','تدخل'],['تحققي','تحقق'],
    ['انتبهي','انتبه'],['استعجلي','استعجل'],['استخدمي','استخدم'],['تأكدي','تأكد'],['استني','استنى'],
    ['افتحي','افتح'],['اكتشفي','اكتشف'],['اظهري','اظهر'],['امسحيها','امسحها'],['كلميها','كلمها'],
    ['تنشري','تنشر'],['تضيفي','تضيف'],['تحفظي','تحفظ'],['تنامي','تنام'],['وقوليها','وقولها'],
    ['واقتنصي','واقتنص'],['تبدلي','تبدل'],['تجربيها','تجربها'],['جربيها','جربها'],['جربي','جرب'],
    ['تتخيلي','تتخيل'],['اسأليني','اسألني'],['علميني','علمني'],['خمّني','خمّن'],['جاوبي','جاوب'],
    ['اعملي','اعمل'],['كملي','كمل'],['تخطّي','تخطّى'],['العبي','العب'],['دوسي','دوس'],['وصلكي','وصلك'],
    ['تقدري','تقدر'],['تكسبي','تكسب'],['هتقولي','هتقول'],['هتبقي','هتبقى'],['بتديكي','بتديك'],
    ['بتتعلميها','بتتعلمها'],['هتتعلمي','هتتعلم'],['تحسي','تحس'],['هتحسي','هتحس'],['تهربي','تهرب'],
    ['بتخافي','بتخاف'],['بتتفرجي','بتتفرج'],['تحضيري','تحضير'],['تعرفيني','تعرفني'],['هتكسبي','هتكسب'],
    ['بتلاقي','بتلاقى'],['بتساوي','بتساوى'],['بتصحي','بتصحى'],['بتسهري','بتسهر'],
    ['خلصتي','خلصت'],['كسبتي','كسبت'],['وصلتي','وصلت'],['بعتيها','بعتها'],['بعتي','بعت'],
    ['جاوبتي','جاوبت'],['خبطتي','خبطت'],['جريتي','جريت'],['خسرتي','خسرت'],['قولتي','قولت'],
    ['قولتيها','قولتها'],['قلتيلي','قلتلي'],['كلمتي','كلمت'],['عملتي','عملت'],['عملتيها','عملتها'],
    ['نسيتي','نسيت'],['اتناديتي','اتناديت'],['اتصورتي','اتصورت'],['اتكسفتي','اتكسفت'],['ندمتي','ندمت'],
    ['وقعتي','وقعت'],['تعثرتي','تعثرت'],['عديتي','عديت'],['رميتي','رميت'],['لفيتي','لفيت'],
    ['انضميتي','انضميت'],['اتخفيتي','اتخفيت'],['بقيتي','بقيت'],['رجعتي','رجعت'],
    ['استنيناكي','استنيناك'],['ترجعي','ترجع'],['خمنتي','خمنت'],['لعبتي','لعبت'],
    ['جاهزة','جاهز'],['ضيفتنا','ضيفنا'],['صديقتنا','صديقنا'],['مستنية','مستني'],['مستعدة','مستعد'],
    ['المضيفة','المضيف'],['صاحبتك','صاحبك'],['صديقتك','صديقك'],['صاحبتي','صاحبي'],['صاحبة','صاحب'],
    ['عايزة','عايز'],['استحيت','استحى'],['شاطرة','شاطر'],['بطلة','بطل'],
    ['أطعميها','أطعمها'],['دلّعيها','دلّعها'],['سمّيها','سمّها'],['رفيقتي','رفيقي'],['رفيقتك','رفيقك'],
    ['مبسوطة','مبسوط'],['شبعانة','شبعان'],['جوعانة','جوعان'],['صغيرة','صغير'],['حكيمة','حكيم'],
    ['ملكية','ملكي'],['سحرية','سحري'],['كبرت','كبر'],['بقت','بقى'],['دافية','دافي']
  ];
  var MAP = {};
  PAIRS.forEach(function(p){
    MAP[p[0]] = p[1];
    ['و','ف','ل','ب'].forEach(function(pre){ if(!MAP[pre + p[0]]) MAP[pre + p[0]] = pre + p[1]; });
  });
  function toMasc(txt){ return String(txt).replace(/[ء-ي]+/g, function(w){ return MAP[w] || w; }); }
  window.toMasc = toMasc;

  var applying = false;
  function walk(root){
    if(applying || !root) return;
    applying = true;
    try {
      var tw = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null);
      var n;
      while((n = tw.nextNode())){
        if(n.__g0 === undefined) n.__g0 = n.nodeValue;
        var nv = (LG === 'm') ? toMasc(n.__g0) : n.__g0;
        if(n.nodeValue !== nv) n.nodeValue = nv;
      }
      var els = root.querySelectorAll ? root.querySelectorAll('[placeholder]') : [];
      for(var i = 0; i < els.length; i++){
        var x = els[i];
        if(x.__gp0 === undefined) x.__gp0 = x.getAttribute('placeholder') || '';
        var pv = (LG === 'm') ? toMasc(x.__gp0) : x.__gp0;
        if(x.getAttribute('placeholder') !== pv) x.setAttribute('placeholder', pv);
      }
    } finally { applying = false; }
  }
  var moT = null;
  new MutationObserver(function(muts){
    if(applying) return;
    for(var i = 0; i < muts.length; i++){
      var mu = muts[i];
      if(mu.type === 'characterData' && mu.target.__g0 !== undefined){
        var t = mu.target;
        if(t.nodeValue !== t.__g0 && t.nodeValue !== toMasc(t.__g0)) t.__g0 = t.nodeValue;
      }
    }
    clearTimeout(moT);
    moT = setTimeout(function(){ walk(document.body); }, 90);
  }).observe(document.documentElement, {childList: true, subtree: true, characterData: true});

  function markTabs(){
    var on = (LG === 'm') ? 'm' : 'f';
    var bs = document.querySelectorAll('.g-pick');
    for(var i = 0; i < bs.length; i++){ bs[i].classList.toggle('active', bs[i].dataset.g === on); }
  }
  function setGender(g){
    LG = (g === 'm') ? 'm' : 'f';
    window.LG = LG;
    try { localStorage.setItem(KEY, LG); } catch(e){}
    walk(document.body);
    markTabs();
    syncGender();
  }
  window.setGender = setGender;

  /* settings card in حسابي */
  function injectCard(){
    var accMe = document.getElementById('accMe');
    if(!accMe || document.getElementById('genderCard') || !accMe.parentNode) return;
    var c = document.createElement('div');
    c.className = 'acc-card'; c.id = 'genderCard'; c.style.maxWidth = '480px';
    c.innerHTML = '<h3>🚻 نداءك</h3><div class="acc-row">' +
      '<button class="tab g-pick" data-g="m">👦 ولد</button>' +
      '<button class="tab g-pick" data-g="f">👧 بنت</button></div>';
    accMe.parentNode.insertBefore(c, accMe.nextSibling);
    c.addEventListener('click', function(e){
      var b = e.target.closest('[data-g]'); if(!b) return;
      setGender(b.dataset.g);
    });
    markTabs();
  }

  /* first-run picker */
  function showPicker(){
    if(document.getElementById('genderGate')) return;
    var d = document.createElement('div');
    d.id = 'genderGate';
    d.style.cssText = 'position:fixed;inset:0;z-index:99999;display:flex;align-items:center;justify-content:center;background:rgba(7,5,15,.88);backdrop-filter:blur(8px);padding:22px';
    d.innerHTML = '<div style="background:linear-gradient(160deg,#1d1532,#110c1f);border:1.5px solid rgba(232,190,88,.55);border-radius:26px;padding:30px 22px;max-width:340px;width:100%;text-align:center;box-shadow:0 26px 80px rgba(0,0,0,.6)">' +
      '<div style="font-size:2.1rem;margin-bottom:4px">✨</div>' +
      '<h2 style="margin:0 0 6px;color:#f5d67b;font-size:1.4rem">أهلاً بيك في Lingua</h2>' +
      '<p style="color:#cbb6dd;margin:0 0 20px;font-size:.95rem;line-height:1.7">محتاجين نعرف نكلمك إزاي 💜</p>' +
      '<div style="display:flex;gap:12px">' +
      '<button data-g="m" style="flex:1;padding:20px 8px;border-radius:20px;border:1.5px solid rgba(232,190,88,.45);background:rgba(255,255,255,.05);color:#fff;font-size:1.2rem;cursor:pointer">👦<br><b>ولد</b></button>' +
      '<button data-g="f" style="flex:1;padding:20px 8px;border-radius:20px;border:1.5px solid rgba(232,190,88,.45);background:rgba(255,255,255,.05);color:#fff;font-size:1.2rem;cursor:pointer">👧<br><b>بنت</b></button>' +
      '</div></div>';
    document.body.appendChild(d);
    d.addEventListener('click', function(e){
      var b = e.target.closest('[data-g]'); if(!b) return;
      setGender(b.dataset.g);
      d.remove();
    });
  }

  /* profile persistence (mirror theme sync) */
  var SUPA_URL = 'https://yzzlgalxjaaevmytdazf.supabase.co';
  var SUPA_KEY = 'sb_publishable_EmbKVWREHSs3sZ_nBKFyqg_zxv3Z38-';
  var gsb = null, gme = null, gT = null;
  function syncGender(){
    if(!gme || !gsb) return;
    clearTimeout(gT);
    gT = setTimeout(function(){
      gsb.from('profiles').update({gender: LG}).eq('id', gme.id).then(function(){});
    }, 1200);
  }
  function bootG(){
    if(!window.supabase){ setTimeout(bootG, 400); return; }
    gsb = window.supabase.createClient(SUPA_URL, SUPA_KEY);
    gsb.auth.getSession().then(function(r){
      if(r.data && r.data.session){
        gme = r.data.session.user;
        gsb.from('profiles').select('gender').eq('id', gme.id).maybeSingle().then(function(pr){
          if(!pr.data) return;
          if(pr.data.gender && pr.data.gender !== LG){ setGender(pr.data.gender); }
          else if(!pr.data.gender){ syncGender(); }
        });
      }
    });
  }

  function init(){
    walk(document.body);
    injectCard();
    setInterval(injectCard, 1500);
    if(firstRun) setTimeout(showPicker, 500);
    bootG();
  }
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();


/* ================= v58/v68: virtual pet رفيقتي (drawn SVG pet, 4 species, grows with points) ================= */
(function(){
  var KEY_NAME='lingua_pet_name', KEY_ACC='lingua_pet_acc', KEY_FED='lingua_pet_fed', KEY_ST='lingua_pet_stage', KEY_SP='lingua_pet_species';
  /* per-species stage names: egg is shared */
  var SPECIES={
    owl:  {t:'بومة',    stages:['فرخة صغيرة','بومة صغيرة','بومة حكيمة','بومة ملكية']},
    cat:  {t:'قطة',     stages:['بسيسة صغيرة','قطة مرحة','قطة أنيقة','قطة ملكية']},
    dog:  {t:'كلب',     stages:['جرو صغير','كلب وفي','كلب شجاع','كلب ملكي']},
    bird: {t:'عصفورة',  stages:['فرخة صغيرة','عصفورة مرحة','عصفورة جميلة','عصفورة ملكية']}
  };
  var STAGE_MIN=[0,50,200,500,1200];
  var ACCS=[
    {id:'bow',      t:'فيونكة',      stage:1},
    {id:'glasses',  t:'نظارة',        stage:2},
    {id:'necklace', t:'عقد لؤلؤ',     stage:2},
    {id:'scarf',    t:'وشاح',         stage:3},
    {id:'cape',     t:'كاب الأميرات', stage:4},
    {id:'crown',    t:'تاج',          stage:4}
  ];
  function life(){ return window.getLifetime ? getLifetime() : parseInt(localStorage.getItem('lingua_lifetime')||'0',10); }
  function stageOf(l){ var i=0; for(var k=0;k<STAGE_MIN.length;k++){ if(l>=STAGE_MIN[k]) i=k; } return i; }
  function stageName(sp,st){ return st===0 ? 'بيضة سحرية' : SPECIES[sp].stages[st-1]; }
  function pget(k,d){ try{ var v=localStorage.getItem(k); return v===null?d:v; }catch(e){ return d; } }
  function pset(k,v){ try{ localStorage.setItem(k,v); }catch(e){} }
  function today(){ return new Date().toISOString().slice(0,10); }
  function say(m){ if(window.toast) toast(m); }

  function eyeG(x){
    return '<g class="pet-eye">'
      +'<circle cx="'+x+'" cy="-22" r="13" fill="#fff"/>'
      +'<circle cx="'+x+'" cy="-22" r="8" fill="#d9a84e"/>'
      +'<circle cx="'+x+'" cy="-22" r="4" fill="#241b30"/>'
      +'<circle cx="'+(x+3)+'" cy="-25" r="2" fill="#fff"/>'
      +'</g>';
  }
  function accSvg(id){
    if(id==='bow') return '<g transform="translate(34,-48)"><path d="M0,0 L-17,-9 L-17,9 Z" fill="#f07ba0"/><path d="M0,0 L17,-9 L17,9 Z" fill="#f07ba0"/><circle r="4.5" fill="#d14f7c"/></g>';
    if(id==='glasses') return '<g fill="none" stroke="#e9c26a" stroke-width="2.6"><circle cx="-17" cy="-22" r="14.5"/><circle cx="17" cy="-22" r="14.5"/><path d="M-2.5,-22 L2.5,-22"/><path d="M-31.5,-25 L-43,-31"/><path d="M31.5,-25 L43,-31"/></g>';
    if(id==='necklace') return '<g><path d="M-20,2 Q0,14 20,2" fill="none" stroke="#f5e6c8" stroke-width="2.5"/><circle cx="-14" cy="7" r="3" fill="#fff"/><circle cx="-7" cy="10" r="3.4" fill="#fff"/><circle cx="0" cy="11.5" r="4" fill="#fff"/><circle cx="7" cy="10" r="3.4" fill="#fff"/><circle cx="14" cy="7" r="3" fill="#fff"/></g>';
    if(id==='scarf') return '<g><path d="M-34,-6 Q0,10 34,-6 L34,5 Q0,21 -34,5 Z" fill="#b03a5b"/><path d="M18,8 L32,27 L24,32 L12,13 Z" fill="#96304c"/></g>';
    if(id==='cape') return '<g><path d="M-40,-4 Q-54,40 -46,74 Q0,94 46,74 Q54,40 40,-4 Q0,10 -40,-4 Z" fill="#7a2e52" opacity=".92"/><path d="M-40,-4 Q0,10 40,-4" fill="none" stroke="#e9c26a" stroke-width="3"/><circle cx="0" cy="4" r="4" fill="#e9c26a"/></g>';
    if(id==='crown') return '<g transform="translate(0,-64)"><path d="M-16,8 L-16,-6 L-8,2 L0,-10 L8,2 L16,-6 L16,8 Z" fill="#e9c26a" stroke="#b8912f" stroke-width="1.5" stroke-linejoin="round"/><circle cx="-8" cy="4" r="1.8" fill="#b03a5b"/><circle cx="0" cy="4" r="1.8" fill="#3e7cb1"/><circle cx="8" cy="4" r="1.8" fill="#3f9e63"/></g>';
    return '';
  }

  /* species body builders: drawn around origin, eyes at y=-22, body bottom ~y=70 */
  function bodySvg(sp, S){
    var g='';
    if(sp==='owl'){
      g+='<g class="pet-wing pet-wing-l"><ellipse cx="-46" cy="12" rx="15" ry="32" fill="url(#petBody)" transform="rotate(14 -46 12)"/></g>';
      g+='<g class="pet-wing pet-wing-r"><ellipse cx="46" cy="12" rx="15" ry="32" fill="url(#petBody)" transform="rotate(-14 46 12)"/></g>';
      g+='<ellipse cx="0" cy="10" rx="46" ry="56" fill="url(#petBody)"/>';
      g+='<ellipse cx="0" cy="26" rx="29" ry="36" fill="url(#petBelly)"/>';
      if(S.chest) g+='<path d="M-14,16 q14,10 28,0 M-14,28 q14,10 28,0 M-14,40 q14,10 28,0" fill="none" stroke="#b8912f" stroke-width="2" opacity=".8"/>';
      g+='<path d="M-33,-34 L-45,-60 L-16,-44 Z" fill="url(#petBody)"/><path d="M33,-34 L45,-60 L16,-44 Z" fill="url(#petBody)"/>';
      g+=eyeG(-17)+eyeG(17);
      g+='<path d="M-6,-9 L6,-9 L0,2 Z" fill="#e8a13c"/>';
      g+='<path d="M-14,66 l-6,8 M-14,66 l0,9 M-14,66 l6,8 M14,66 l-6,8 M14,66 l0,9 M14,66 l6,8" stroke="#e8a13c" stroke-width="3" fill="none" stroke-linecap="round"/>';
    } else if(sp==='cat'){
      g+='<path d="M38,34 Q66,28 62,-6" fill="none" stroke="url(#petBody)" stroke-width="12" stroke-linecap="round"/>';
      g+='<ellipse cx="0" cy="14" rx="44" ry="52" fill="url(#petBody)"/>';
      g+='<ellipse cx="0" cy="30" rx="27" ry="32" fill="url(#petBelly)"/>';
      g+='<path d="M-34,-32 L-42,-62 L-10,-46 Z" fill="url(#petBody)"/><path d="M-30,-37 L-35,-55 L-15,-44 Z" fill="#f0b8c8"/>';
      g+='<path d="M34,-32 L42,-62 L10,-46 Z" fill="url(#petBody)"/><path d="M30,-37 L35,-55 L15,-44 Z" fill="#f0b8c8"/>';
      g+=eyeG(-16)+eyeG(16);
      g+='<path d="M-5,-8 L5,-8 L0,0 Z" fill="#e88ba0"/>';
      g+='<path d="M0,0 Q-4,6 -10,5 M0,0 Q4,6 10,5" fill="none" stroke="#c76b84" stroke-width="2" stroke-linecap="round"/>';
      g+='<path d="M-40,-14 l-16,-2 M-40,-6 l-16,2 M40,-14 l16,-2 M40,-6 l16,2" stroke="#e8dcc8" stroke-width="2" stroke-linecap="round"/>';
      g+='<path d="M-16,62 l-6,9 M-16,62 l0,10 M-16,62 l6,9 M16,62 l-6,9 M16,62 l0,10 M16,62 l6,9" stroke="#e88ba0" stroke-width="3" fill="none" stroke-linecap="round"/>';
    } else if(sp==='dog'){
      g+='<ellipse cx="-40" cy="-16" rx="12" ry="26" fill="#4a3626" transform="rotate(18 -40 -16)"/>';
      g+='<ellipse cx="40" cy="-16" rx="12" ry="26" fill="#4a3626" transform="rotate(-18 40 -16)"/>';
      g+='<ellipse cx="0" cy="14" rx="44" ry="52" fill="url(#petBodyDog)"/>';
      g+='<ellipse cx="0" cy="28" rx="26" ry="32" fill="url(#petBellyDog)"/>';
      g+='<ellipse cx="0" cy="-4" rx="22" ry="16" fill="url(#petBellyDog)"/>';
      g+=eyeG(-15)+eyeG(15);
      g+='<ellipse cx="0" cy="-10" rx="7" ry="5" fill="#2c1f16"/>';
      g+='<path d="M0,-5 L0,2 M0,2 Q-6,8 -12,5 M0,2 Q6,8 12,5" fill="none" stroke="#2c1f16" stroke-width="2.2" stroke-linecap="round"/>';
      g+='<path d="M-3,8 Q0,16 3,8 Z" fill="#e88ba0"/>';
      g+='<path d="M-16,62 l-6,9 M-16,62 l0,10 M-16,62 l6,9 M16,62 l-6,9 M16,62 l0,10 M16,62 l6,9" stroke="#8a6a45" stroke-width="3" fill="none" stroke-linecap="round"/>';
    } else { /* bird */
      g+='<path d="M0,58 L-14,84 L0,76 L14,84 Z" fill="url(#petBodyBird)"/>';
      g+='<g class="pet-wing pet-wing-l"><ellipse cx="-34" cy="10" rx="12" ry="26" fill="url(#petBodyBird)" transform="rotate(16 -34 10)"/></g>';
      g+='<g class="pet-wing pet-wing-r"><ellipse cx="34" cy="10" rx="12" ry="26" fill="url(#petBodyBird)" transform="rotate(-16 34 10)"/></g>';
      g+='<ellipse cx="0" cy="8" rx="40" ry="50" fill="url(#petBodyBird)"/>';
      g+='<ellipse cx="0" cy="24" rx="24" ry="32" fill="url(#petBellyBird)"/>';
      g+='<path d="M-10,-40 Q0,-52 10,-40" fill="none" stroke="url(#petBodyBird)" stroke-width="5" stroke-linecap="round"/>';
      g+=eyeG(-14)+eyeG(14);
      g+='<path d="M-7,-10 L7,-10 L0,4 Z" fill="#e8a13c"/>';
      g+='<path d="M-12,56 l-5,8 M-12,56 l0,9 M-12,56 l5,8 M12,56 l-5,8 M12,56 l0,9 M12,56 l5,8" stroke="#e8a13c" stroke-width="3" fill="none" stroke-linecap="round"/>';
    }
    return g;
  }

  function defsSvg(){
    return '<defs>'
      +'<radialGradient id="petAura" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#e9c26a" stop-opacity=".45"/><stop offset="100%" stop-color="#e9c26a" stop-opacity="0"/></radialGradient>'
      +'<linearGradient id="petBody" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#6b4f8f"/><stop offset="100%" stop-color="#3e2c52"/></linearGradient>'
      +'<linearGradient id="petBelly" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#f4dcae"/><stop offset="100%" stop-color="#d9a84e"/></linearGradient>'
      +'<linearGradient id="petBodyDog" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#b98a55"/><stop offset="100%" stop-color="#7d5a34"/></linearGradient>'
      +'<linearGradient id="petBellyDog" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#f0e0c8"/><stop offset="100%" stop-color="#d9bd95"/></linearGradient>'
      +'<linearGradient id="petBodyBird" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#4f8f8f"/><stop offset="100%" stop-color="#2c5252"/></linearGradient>'
      +'<linearGradient id="petBellyBird" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#f4e0ae"/><stop offset="100%" stop-color="#e0b84e"/></linearGradient>'
      +'<linearGradient id="petEgg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#fdf3dd"/><stop offset="100%" stop-color="#eed9ae"/></linearGradient>'
      +'</defs>';
  }

  function eggSvg(l){
    var prog=Math.min(49,l);
    var s='<ellipse cx="150" cy="222" rx="70" ry="14" fill="#54380f" opacity=".55"/>';
    s+='<g class="pet-bob"><ellipse cx="150" cy="180" rx="44" ry="54" fill="url(#petEgg)" stroke="#d9b878" stroke-width="2"/>';
    s+='<circle cx="132" cy="160" r="3" fill="#e9c26a" opacity=".7"/><circle cx="168" cy="185" r="2.5" fill="#e9c26a" opacity=".7"/><circle cx="145" cy="205" r="2" fill="#e9c26a" opacity=".7"/>';
    if(prog>=15) s+='<path d="M128,140 l10,14 l-8,10 l12,12" fill="none" stroke="#8a6d3b" stroke-width="2.5" stroke-linecap="round"/>';
    if(prog>=30) s+='<path d="M172,148 l-9,12 l7,9 l-10,12" fill="none" stroke="#8a6d3b" stroke-width="2.5" stroke-linecap="round"/>';
    if(prog>=45) s+='<path d="M140,210 l8,-10 l10,8 l6,-12" fill="none" stroke="#8a6d3b" stroke-width="2.5" stroke-linecap="round"/>';
    s+='</g>';
    return s;
  }

  function sceneSvg(){
    var l=life(), st=stageOf(l);
    var sp=pget(KEY_SP,'owl');
    var s='<svg viewBox="0 0 300 250" class="pet-svg" aria-hidden="true">'+defsSvg();
    s+='<circle cx="252" cy="38" r="20" fill="#f5e3b0" class="pet-moon"/><circle cx="246" cy="33" r="4" fill="#e6cf96"/><circle cx="258" cy="44" r="3" fill="#e6cf96"/>';
    var stars=[[30,30],[70,58],[110,24],[190,60],[222,92],[45,100]];
    for(var i=0;i<stars.length;i++) s+='<circle cx="'+stars[i][0]+'" cy="'+stars[i][1]+'" r="2" fill="#ffe9a8" class="pet-star" style="animation-delay:'+(i*0.45)+'s"/>';
    s+='<path d="M-5,228 Q150,206 305,230" fill="none" stroke="#6b4423" stroke-width="11" stroke-linecap="round"/><path d="M210,222 q18,-14 34,-12" fill="none" stroke="#6b4423" stroke-width="6" stroke-linecap="round"/>';
    if(st===0){
      s+=eggSvg(l);
    } else {
      var S={s:[0,0.62,0.82,1.0,1.08][st], chest:st>=3, aura:st>=4};
      s+='<g transform="translate(150,158) scale('+S.s+')"><g class="pet-bob">';
      if(S.aura) s+='<circle r="100" fill="url(#petAura)" class="pet-aura"/>';
      s+=bodySvg(sp,S);
      var acc=pget(KEY_ACC,'');
      if(acc && accUnlocked(acc,st)) s+=accSvg(acc);
      s+='</g></g>';
    }
    s+='</svg>';
    return s;
  }
  function accUnlocked(id,st){
    for(var i=0;i<ACCS.length;i++) if(ACCS[i].id===id) return st>=ACCS[i].stage;
    return false;
  }

  function burst(cls,n,svgInner){
    var box=document.getElementById('petScene'); if(!box) return;
    for(var i=0;i<n;i++){
      var el=document.createElement('span');
      el.className=cls;
      el.style.left=(38+Math.random()*24)+'%';
      el.style.animationDelay=(Math.random()*0.35)+'s';
      el.innerHTML=svgInner;
      box.appendChild(el);
      (function(node){ setTimeout(function(){ if(node.parentNode) node.parentNode.removeChild(node); },1900); })(el);
    }
  }
  var HEART='<svg viewBox="0 0 24 24" width="18" height="18"><path d="M12,20 C7,15.5 3.5,12.4 3.5,9 C3.5,6.5 5.5,4.8 7.8,4.8 C9.4,4.8 10.9,5.7 12,7.4 C13.1,5.7 14.6,4.8 16.2,4.8 C18.5,4.8 20.5,6.5 20.5,9 C20.5,12.4 17,15.5 12,20 Z" fill="#f07ba0"/></svg>';
  var SPARK='<svg viewBox="0 0 24 24" width="16" height="16"><path d="M12,2 L14,9.5 L22,12 L14,14.5 L12,22 L10,14.5 L2,12 L10,9.5 Z" fill="#e9c26a"/></svg>';

  function celebrate(st){
    say('🎉 '+pget(KEY_NAME,'نور')+' كبرت! بقت '+stageName(pget(KEY_SP,'owl'),st));
    burst('pet-spark',10,SPARK);
  }

  function pickerHtml(){
    var h='<div class="pet-pick"><div class="pet-pick-t">اختاري رفيقتك 🥚✨</div><div class="pet-pick-grid">';
    Object.keys(SPECIES).forEach(function(sp){
      h+='<button type="button" class="pet-pick-card" data-sp="'+sp+'">'
        +'<svg viewBox="-70 -80 140 170" class="pet-pick-svg">'+defsSvg()+'<g>'+bodySvg(sp,{chest:true,aura:false})+'</g></svg>'
        +'<b>'+SPECIES[sp].t+'</b></button>';
    });
    h+='</div></div>';
    return h;
  }

  function render(){
    var box=document.getElementById('petScene'); if(!box) return;
    var sp=pget(KEY_SP,'');
    if(!sp){
      box.innerHTML=pickerHtml();
      var acts0=document.getElementById('petActions'); if(acts0) acts0.innerHTML='';
      Array.prototype.forEach.call(box.querySelectorAll('[data-sp]'),function(b){
        b.addEventListener('click',function(){
          pset(KEY_SP,b.getAttribute('data-sp'));
          say('مبروك! '+SPECIES[b.getAttribute('data-sp')].t+' بقت رفيقتك 🎉');
          burst('pet-spark',10,SPARK);
          render();
        });
      });
      return;
    }
    var l=life(), st=stageOf(l);
    box.innerHTML=sceneSvg();
    var nm=pget(KEY_NAME,'نور');
    var nmEl=document.getElementById('petName'); if(nmEl) nmEl.textContent=nm;
    var stEl=document.getElementById('petStageLbl'); if(stEl) stEl.textContent=stageName(sp,st);
    var nextMin=STAGE_MIN[st+1];
    var pct= nextMin!==undefined ? Math.min(100, Math.round((l - STAGE_MIN[st])/(nextMin - STAGE_MIN[st])*100)) : 100;
    var fEl=document.getElementById('petFill'); if(fEl) fEl.style.width=pct+'%';
    var nxEl=document.getElementById('petNext');
    if(nxEl) nxEl.textContent = nextMin!==undefined ? ('باقي '+(nextMin - l)+' نقطة وتبقى '+stageName(sp,st+1)+' ✨') : 'وصلتي لأعلى مرحلة — ملكية 👑';
    var fed=pget(KEY_FED,'')===today();
    var mEl=document.getElementById('petMood');
    if(mEl) mEl.textContent = fed ? 'مبسوطة وشبعانة النهاردة 😊' : (st===0 ? 'البيضة دافية ومستنية نقاطك 🥚' : 'جوعانة شوية.. أطعميها 🍎');
    var acts=document.getElementById('petActions');
    if(acts){
      var h='<button type="button" class="pet-btn" id="petFeed">'+(fed?'شبعانة ✅':'🍎 أطعميها')+'</button>'
           +'<button type="button" class="pet-btn" id="petLove">🤍 دلّعيها</button>'
           +'<button type="button" class="pet-btn" id="petRen">✏️ سمّيها</button>'
           +'<button type="button" class="pet-btn" id="petSp">🔀 غيّري رفيقتك</button>';
      ACCS.forEach(function(a){
        var un = st>=a.stage;
        var on = pget(KEY_ACC,'')===a.id;
        h+='<button type="button" class="pet-btn pet-acc'+(on?' on':'')+'" data-acc="'+a.id+'"'+(un?'':' disabled')+'>'+(un?(on?'✅ ':'')+a.t:'🔒 '+a.t)+'</button>';
      });
      acts.innerHTML=h;
      wire();
    }
    var oldSt=parseInt(pget(KEY_ST,'-1'),10);
    if(oldSt>=0 && st>oldSt){ celebrate(st); }
    pset(KEY_ST,String(st));
  }

  function wire(){
    var feed=document.getElementById('petFeed');
    if(feed) feed.addEventListener('click',function(){
      if(pget(KEY_FED,'')===today()){ say(pget(KEY_NAME,'نور')+' شبعانة دلوقتي 😊'); return; }
      pset(KEY_FED,today());
      burst('pet-heart',6,HEART);
      if(window.awardPoints) awardPoints(3,'إطعام '+pget(KEY_NAME,'نور'));
      render();
    });
    var love=document.getElementById('petLove');
    if(love) love.addEventListener('click',function(){
      burst('pet-heart',5,HEART);
      var box=document.getElementById('petScene');
      if(box){ box.classList.add('flap'); setTimeout(function(){ box.classList.remove('flap'); },1200); }
      var lines=['بتحبك أوي 💜','بتقولك: يلا نتعلم كلمة جديدة!','مبسوطة معاكي ✨','شكلها بيفرح معاكي!'];
      say(lines[Math.floor(Math.random()*lines.length)]);
    });
    var ren=document.getElementById('petRen');
    if(ren) ren.addEventListener('click',function(){
      var n=window.prompt('عايزة تسمّيها إيه؟', pget(KEY_NAME,'نور'));
      if(n && n.trim()){ pset(KEY_NAME,n.trim().slice(0,20)); render(); }
    });
    var spBtn=document.getElementById('petSp');
    if(spBtn) spBtn.addEventListener('click',function(){
      pset(KEY_SP,'');
      render();
    });
    Array.prototype.forEach.call(document.querySelectorAll('#petActions .pet-acc'),function(b){
      b.addEventListener('click',function(){
        var id=b.getAttribute('data-acc');
        pset(KEY_ACC, pget(KEY_ACC,'')===id ? '' : id);
        render();
      });
    });
  }

  /* re-render whenever points change */
  if(window.awardPoints){
    var _a=window.awardPoints;
    window.awardPoints=function(n,label){ _a(n,label); try{ render(); }catch(e){} };
  }
  window.addEventListener('hashchange',function(){ if(location.hash==='#pet') setTimeout(render,50); });
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',render); else render();
  window.petRender=render;
})();


/* ================= v59: forced app updates + version badge + duel log viewer ================= */
(function(){
  window.LINGUA_VERSION = 'v68';

  /* ---- force updates: reload as soon as a new service worker takes over ---- */
  if('serviceWorker' in navigator){
    var reloaded = false;
    navigator.serviceWorker.addEventListener('controllerchange', function(){
      if(reloaded) return; reloaded = true;
      if(location.hash !== '#duel'){
        location.reload();
        return;
      }
      /* mid-duel: don't kill the game — show a tap-to-update banner */
      var b = document.createElement('div');
      b.style.cssText = 'position:fixed;bottom:86px;left:12px;right:12px;z-index:99999;background:linear-gradient(135deg,#e9c26a,#c99b3e);color:#1c1405;font-weight:800;border-radius:16px;padding:12px 16px;text-align:center;box-shadow:0 8px 30px rgba(0,0,0,.4);cursor:pointer;font-family:inherit';
      b.textContent = '✨ نسخة جديدة من Lingua جاهزة — دوسي هنا بعد ما تخلصي اللعبة عشان تحدّثي';
      b.onclick = function(){ location.hash = ''; setTimeout(function(){ location.reload(); }, 60); };
      document.body.appendChild(b);
    });
    navigator.serviceWorker.ready.then(function(reg){
      try { reg.update(); } catch(e){}
      document.addEventListener('visibilitychange', function(){
        if(!document.hidden){ try { reg.update(); } catch(e){} }
      });
    }).catch(function(){});
  }

  /* ---- tiny version badge inside the duel lobby + duel log viewer ---- */
  function badge(){
    var t = document.getElementById('duelBox');
    if(!t || document.getElementById('duVer')) return;
    var s = document.createElement('div');
    s.id = 'duVer';
    s.style.cssText = 'text-align:center;font-size:.72rem;color:#8a7a52;margin-top:12px;cursor:pointer';
    s.textContent = 'Lingua ' + window.LINGUA_VERSION;
    s.title = 'دوسي مرتين لعرض سجل الاتصال';
    var taps = 0;
    s.addEventListener('click', function(){
      taps++;
      if(taps >= 2){
        taps = 0;
        var log = [];
        try { log = JSON.parse(localStorage.getItem('lingua_duel_log') || '[]'); } catch(e){}
        var box = document.createElement('pre');
        box.style.cssText = 'direction:ltr;text-align:left;font-size:.68rem;color:#cbb;background:rgba(0,0,0,.35);border-radius:12px;padding:10px;margin-top:8px;max-height:180px;overflow:auto;white-space:pre-wrap';
        box.textContent = log.join('\n') || '(no events yet)';
        s.appendChild(box);
      }
    });
    t.appendChild(s);
  }
  window.addEventListener('hashchange', function(){ if(location.hash === '#duel') setTimeout(badge, 900); });
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function(){ setTimeout(badge, 1500); });
  else setTimeout(badge, 1500);
})();


/* ================= v66: Duolingo pack — placement test + daily quests + streak freeze ================= */
(function(){
  /* ---------------- placement test (اختبار تحديد المستوى) ---------------- */
  var PL_LANGS = {en:'🇬🇧 إنجليزي', fr:'🇫🇷 فرنسي', de:'🇩🇪 ألماني', zh:'🇨🇳 صيني', ko:'🇰🇷 كوري'};
  var pl = {lang:'en', qs:[], i:0, right:0, on:false};

  function plStart(lang){
    pl.lang = lang; pl.qs = []; pl.i = 0; pl.right = 0; pl.on = true;
    ['beg','mid','adv'].forEach(function(lv){
      QUIZZES[lang][lv].slice(0,3).forEach(function(q){ pl.qs.push({q:q, lv:lv}); });
    });
    plRender();
  }
  function plRender(){
    var box = document.getElementById('plcBox'); if(!box) return;
    if(pl.i >= pl.qs.length){ return plResult(); }
    var item = pl.qs[pl.i];
    box.innerHTML =
      '<div class="plc-prog">سؤال ' + (pl.i+1) + ' / ' + pl.qs.length + ' ✨</div>' +
      '<div class="plc-bar"><div class="plc-fill" style="width:' + Math.round(pl.i/pl.qs.length*100) + '%"></div></div>' +
      '<div class="q-text">' + item.q.q + '</div>' +
      item.q.opts.map(function(o,idx){ return '<button class="opt" data-i="'+idx+'">'+o+'</button>'; }).join('');
    Array.prototype.forEach.call(box.querySelectorAll('.opt'), function(b){
      b.addEventListener('click', function(){
        var idx = parseInt(b.dataset.i,10);
        Array.prototype.forEach.call(box.querySelectorAll('.opt'), function(o,i){
          if(i===item.q.a) o.classList.add('correct'); else if(i===idx) o.classList.add('wrong');
          o.disabled = true;
        });
        if(idx===item.q.a){ pl.right++; if(window.sndGood) sndGood(); } else if(window.sndBad) sndBad();
        setTimeout(function(){ pl.i++; plRender(); }, 850);
      });
    });
  }
  function plResult(){
    var box = document.getElementById('plcBox');
    var lv = pl.right <= 3 ? 'beg' : (pl.right <= 6 ? 'mid' : 'adv');
    var lvName = {beg:'مبتدئة 🌱', mid:'متوسطة 🌿', adv:'متقدمة 🌳'}[lv];
    var tip = {beg:'هنبدأ من الأساسيات ونبني قاعدة قوية 💪', mid:'عندك قاعدة حلوة — هنركّز على التوسع والثقة 🚀', adv:'مستواك عالي! هنتحداك بمحتوى متقدم 👑'}[lv];
    try { localStorage.setItem('lingua_level_'+pl.lang, lv); } catch(e){}
    if(window.awardPoints) awardPoints(15, 'اختبار المستوى 🎯');
    box.innerHTML =
      '<div class="plc-result">' +
      '<div class="plc-big">' + pl.right + ' / ' + pl.qs.length + '</div>' +
      '<div class="plc-lv">مستواك في ' + PL_LANGS[pl.lang] + ': <b>' + lvName + '</b></div>' +
      '<p class="du-sub">' + tip + '</p>' +
      '<a class="btn du-big" href="#quiz">📝 ابدئي التمارين على مستواك</a>' +
      '<button class="btn" id="plcAgain" style="margin-top:10px">🔄 اعملي الاختبار تاني</button>' +
      '</div>';
    document.getElementById('plcAgain').onclick = function(){ plHome(); };
    pl.on = false;
    if(window.confetti) try{ confetti(); }catch(e){}
  }
  function plHome(){
    var box = document.getElementById('plcBox'); if(!box) return;
    var saved = {};
    Object.keys(PL_LANGS).forEach(function(l){
      var v = localStorage.getItem('lingua_level_'+l);
      if(v) saved[l] = v;
    });
    box.innerHTML =
      '<div class="plc-intro">٩ أسئلة بس وهنعرف مستواك بالظبط — الاختبار بيطلّع من سهلة لصعبة 🎯</div>' +
      '<div class="plc-langs">' + Object.keys(PL_LANGS).map(function(l){
        var s = saved[l] ? '<small class="plc-saved">مستواك: ' + ({beg:'مبتدئة 🌱',mid:'متوسطة 🌿',adv:'متقدمة 🌳'})[saved[l]] + '</small>' : '';
        return '<button class="plc-lcard" data-pl="'+l+'"><b>' + PL_LANGS[l] + '</b>' + s + '</button>';
      }).join('') + '</div>';
    Array.prototype.forEach.call(box.querySelectorAll('[data-pl]'), function(b){
      b.addEventListener('click', function(){ plStart(b.dataset.pl); });
    });
  }

  /* ---------------- daily quests + reward chests (مهام اليوم) ---------------- */
  var QUESTS = [
    {id:'xp',   ico:'💎', t:'اكسبي ٣٠ نقطة', need:30},
    {id:'quiz', ico:'📝', t:'خلّصي اختبار واحد', need:1},
    {id:'duel', ico:'⚔️', t:'العبي لعبة لايف مع صاحبتك', need:1}
  ];
  function qKey(){ return 'lingua_quests'; }
  function qToday(){ return new Date().toDateString(); }
  function qLoad(){
    var st = null;
    try { st = JSON.parse(localStorage.getItem(qKey()) || 'null'); } catch(e){}
    if(!st || st.d !== qToday()){
      st = {d: qToday(), p: {xp:0, quiz:0, duel:0}, claimed: []};
      qSave(st);
    }
    return st;
  }
  function qSave(st){ try { localStorage.setItem(qKey(), JSON.stringify(st)); } catch(e){} }
  function qBump(id, n){
    var st = qLoad();
    if((st.p[id]||0) >= QUESTS.filter(function(q){return q.id===id;})[0].need) return;
    st.p[id] = (st.p[id]||0) + n;
    var q = QUESTS.filter(function(x){return x.id===id;})[0];
    if(st.p[id] >= q.need && st.claimed.indexOf(id) < 0 && (st.p[id] - n) < q.need){
      if(window.toast) toast(q.ico + ' مهمة خلصت! افتحي الكنز من مهام اليوم 🎁');
    }
    qSave(st);
    qRender();
  }
  function qClaim(id){
    var st = qLoad();
    if(st.claimed.indexOf(id) >= 0) return;
    var q = QUESTS.filter(function(x){return x.id===id;})[0];
    if((st.p[id]||0) < q.need) return;
    st.claimed.push(id);
    qSave(st);
    var loot = 10 + Math.floor(Math.random()*16);
    if(window.awardPoints) awardPoints(loot, 'كنز المهام 🎁');
    if(window.confetti) try{ confetti(); }catch(e){}
    qRender();
  }
  function freezeCount(){ return parseInt(localStorage.getItem('lingua_streak_freeze')||'0',10); }
  function streakCount(){ try { return (JSON.parse(localStorage.getItem('lingua_streak'))||{}).count || 0; } catch(e){ return 0; } }
  function buyFreeze(){
    var pts = parseInt(localStorage.getItem('lingua_points')||'0',10);
    if(pts < 100){ if(window.toast) toast('محتاجة ١٠٠ نقطة — اكسبي شوية الأول 💎'); return; }
    localStorage.setItem('lingua_points', String(pts - 100));
    localStorage.setItem('lingua_streak_freeze', String(freezeCount()+1));
    if(window.refreshDash) refreshDash();
    if(window.toast) toast('🧊 اشتريتي تجميد! سلسلتك محمية');
    qRender();
  }
  function qRender(){
    var box = document.getElementById('questBox'); if(!box) return;
    var st = qLoad();
    var h = '<div class="qt-streak">🔥 سلسلتك: <b>' + streakCount() + '</b> يوم &nbsp;•&nbsp; 🧊 تجميد: <b>' + freezeCount() + '</b></div>';
    h += '<div class="qt-grid">';
    QUESTS.forEach(function(q){
      var p = Math.min(st.p[q.id]||0, q.need);
      var done = p >= q.need;
      var claimed = st.claimed.indexOf(q.id) >= 0;
      h += '<div class="qt-card' + (done ? ' done' : '') + '">'
        + '<div class="qt-ico">' + q.ico + '</div>'
        + '<div class="qt-t">' + q.t + '</div>'
        + '<div class="qt-bar"><div class="qt-fill" style="width:' + Math.round(p/q.need*100) + '%"></div></div>'
        + '<div class="qt-p">' + p + ' / ' + q.need + '</div>'
        + (claimed
            ? '<div class="qt-claimed">✅ الكنز اتفتح</div>'
            : (done
                ? '<button class="btn qt-chest" data-claim="'+q.id+'"><svg viewBox="0 0 24 24" width="18" height="18" style="vertical-align:-4px"><rect x="3" y="10" width="18" height="10" rx="2" fill="#8a5a2b"/><rect x="3" y="6" width="18" height="6" rx="2" fill="#a06c35"/><rect x="10.5" y="6" width="3" height="14" fill="#e9c26a"/><circle cx="12" cy="12" r="1.6" fill="#1c1405"/></svg> افتحي الكنز!</button>'
                : ''))
        + '</div>';
    });
    h += '</div>';
    h += '<div class="qt-freeze"><div><b>🧊 تجميد السلسلة</b><br><small>لو يوم فاتك، التجميد بيحمي سلسلتك تلقائيًا. بتكسبي +1 كل ٧ أيام سلسلة 🎁</small></div>'
      + '<button class="btn" id="qtBuyFreeze">اشتري بـ ١٠٠ 💎</button></div>';
    box.innerHTML = h;
    Array.prototype.forEach.call(box.querySelectorAll('[data-claim]'), function(b){
      b.addEventListener('click', function(){ qClaim(b.dataset.claim); });
    });
    var bf = document.getElementById('qtBuyFreeze');
    if(bf) bf.addEventListener('click', buyFreeze);
  }

  /* starter freeze for everyone */
  try { if(localStorage.getItem('lingua_streak_freeze') === null) localStorage.setItem('lingua_streak_freeze', '1'); } catch(e){}

  /* quest tracking via points flow */
  if(window.awardPoints){
    var _a = window.awardPoints;
    window.awardPoints = function(n, label){
      _a(n, label);
      try {
        qBump('xp', n);
        var l = label || '';
        if(/اختبار|تحدي الأسبوع/.test(l)) qBump('quiz', 1);
        if(/لعبتِ|كسبتِ|قد إيه|الحقيقة/.test(l)) qBump('duel', 1);
      } catch(e){}
    };
  }

  window.addEventListener('hashchange', function(){
    if(location.hash === '#quests') setTimeout(qRender, 60);
    if(location.hash === '#placement') setTimeout(plHome, 60);
  });
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function(){ qRender(); plHome(); });
  else { qRender(); plHome(); }
  window.qRender = qRender;
})();


/* ================= v67: listening + dictation + mistakes-only practice ================= */
(function(){
  var LS_LANGS = {en:'🇬🇧 إنجليزي', fr:'🇫🇷 فرنسي', de:'🇩🇪 ألماني', zh:'🇨🇳 صيني', ko:'🇰🇷 كوري'};

  function pick(arr, n, exclude){
    var pool = arr.slice();
    var out = [];
    while(out.length < n && pool.length){
      var i = Math.floor(Math.random()*pool.length);
      var c = pool.splice(i,1)[0];
      if(exclude && exclude.indexOf(c) >= 0) continue;
      out.push(c);
    }
    return out;
  }
  function shuffle(a){ for(var i=a.length-1;i>0;i--){ var j=Math.floor(Math.random()*(i+1)); var t=a[i]; a[i]=a[j]; a[j]=t; } return a; }
  function norm(s){
    return (s||'').toLowerCase().trim()
      .replace(/[أإآ]/g,'ا').replace(/ة/g,'ه').replace(/ى/g,'ي')
      .replace(/[ًٌٍَُِّْ]/g,'').replace(/[.,!?;:'"()\-\s]/g,'');
  }

  /* ---------------- listening + dictation (#listen) ---------------- */
  var ls = {lang:'en', mode:'listen', round:0, total:10, score:0, cur:null};

  function lsHome(){
    var box = document.getElementById('lsBox'); if(!box) return;
    var h = '<div class="ls-modes">'
      + '<button class="ls-mode' + (ls.mode==='listen'?' on':'') + '" data-m="listen">🎧 سمع — اسمعي الكلمة واختاري معناها</button>'
      + '<button class="ls-mode' + (ls.mode==='dict'?' on':'') + '" data-m="dict">✍️ إملاء — اسمعي واكتبي الكلمة</button>'
      + '</div>'
      + '<div class="plc-langs">' + Object.keys(LS_LANGS).map(function(l){
          return '<button class="plc-lcard" data-lsl="'+l+'"><b>' + LS_LANGS[l] + '</b></button>';
        }).join('') + '</div>'
      + '<div class="plc-intro">١٠ جولات — إجابة صح = نقاط 💎</div>';
    box.innerHTML = h;
    Array.prototype.forEach.call(box.querySelectorAll('[data-m]'), function(b){
      b.addEventListener('click', function(){ ls.mode = b.dataset.m; lsHome(); });
    });
    Array.prototype.forEach.call(box.querySelectorAll('[data-lsl]'), function(b){
      b.addEventListener('click', function(){ ls.lang = b.dataset.lsl; ls.round = 0; ls.score = 0; lsNext(); });
    });
  }

  function lsNext(){
    var box = document.getElementById('plcBox') && document.getElementById('lsBox'); if(!box) return;
    box = document.getElementById('lsBox');
    if(ls.round >= ls.total){ return lsDone(); }
    ls.round++;
    var word = pick(DICT[ls.lang], 1)[0];
    ls.cur = word;
    var h = '<div class="plc-prog">جولة ' + ls.round + ' / ' + ls.total + ' 🎧</div>'
      + '<div class="plc-bar"><div class="plc-fill" style="width:' + Math.round((ls.round-1)/ls.total*100) + '%"></div></div>'
      + '<div class="ls-play"><button class="btn du-big" id="lsHear">🔊 اسمعي الكلمة</button></div>';
    if(ls.mode === 'listen'){
      var opts = shuffle([word[1]].concat(pick(DICT[ls.lang].map(function(w){return w[1];}), 3, [word[1]])));
      h += opts.map(function(o){ return '<button class="opt" data-o="'+o.replace(/"/g,'&quot;')+'">'+o+'</button>'; }).join('');
      box.innerHTML = h;
      var speakIt = function(){ speakText(word[0], ls.lang); };
      document.getElementById('lsHear').addEventListener('click', speakIt);
      speakIt();
      Array.prototype.forEach.call(box.querySelectorAll('.opt'), function(b){
        b.addEventListener('click', function(){
          var ok = b.dataset.o === word[1];
          Array.prototype.forEach.call(box.querySelectorAll('.opt'), function(o){
            if(o.dataset.o === word[1]) o.classList.add('correct'); else if(o === b) o.classList.add('wrong');
            o.disabled = true;
          });
          if(ok){ ls.score++; if(window.sndGood) sndGood(); } else if(window.sndBad) sndBad();
          setTimeout(lsNext, 900);
        });
      });
    } else {
      if(ls.lang === 'zh' || ls.lang === 'ko'){
        h += '<div class="plc-intro">الإملاء بالكتابة متاح للإنجليزي والفرنسي والألماني بس — جربي وضع السمع 🎧</div>';
        box.innerHTML = h;
        document.getElementById('lsHear').addEventListener('click', function(){ speakText(word[0], ls.lang); });
        setTimeout(lsNext, 2200);
        return;
      }
      h += '<div class="ls-dict"><input id="lsIn" class="ls-input" placeholder="اكتبي اللي سمعتيه..." autocomplete="off" autocapitalize="off">'
        + '<button class="btn" id="lsGo">✔ تأكدي</button></div>';
      box.innerHTML = h;
      var inp = document.getElementById('lsIn');
      document.getElementById('lsHear').addEventListener('click', function(){ speakText(word[0], ls.lang); });
      speakText(word[0], ls.lang);
      var check = function(){
        var ok = norm(inp.value) === norm(word[0]);
        if(ok){ ls.score++; inp.classList.add('correct'); if(window.sndGood) sndGood(); }
        else { inp.classList.add('wrong'); if(window.sndBad) sndBad();
          box.insertAdjacentHTML('beforeend', '<div class="ls-ans">الصح: <b>' + word[0] + '</b> — ' + word[1] + '</div>'); }
        setTimeout(lsNext, ok ? 800 : 1800);
      };
      document.getElementById('lsGo').addEventListener('click', check);
      inp.addEventListener('keydown', function(e){ if(e.key === 'Enter') check(); });
      inp.focus();
    }
  }

  function lsDone(){
    var box = document.getElementById('lsBox');
    var pts = ls.score * (ls.mode === 'dict' ? 3 : 2);
    if(pts > 0 && window.awardPoints) awardPoints(pts, 'تدريب السمع 🎧');
    box.innerHTML = '<div class="plc-result">'
      + '<div class="plc-big">' + ls.score + ' / ' + ls.total + '</div>'
      + '<div class="plc-lv">' + (ls.score >= 8 ? 'ودانك موسيقية! 🎶' : (ls.score >= 5 ? 'أداء حلو 💜' : 'التكرار بيعلّم الشطار 💪')) + '</div>'
      + '<p class="du-sub">كسبتي ' + pts + ' نقطة من التدريب ده</p>'
      + '<button class="btn du-big" id="lsAgain">🔄 تدريب تاني</button></div>';
    document.getElementById('lsAgain').addEventListener('click', lsHome);
    if(ls.score >= 5 && window.confetti) try{ confetti(); }catch(e){}
  }

  /* ---------------- mistakes-only practice (#mistakes) ---------------- */
  function mLoad(){ try { return JSON.parse(localStorage.getItem('lingua_mistakes') || '[]'); } catch(e){ return []; } }
  function mSave(m){ try { localStorage.setItem('lingua_mistakes', JSON.stringify(m)); } catch(e){} }
  var mPrac = null; /* {list, i, ok:{}} */

  /* hook wrong answers in quiz */
  if(window.answer && !window.__mstHooked){
    window.__mstHooked = true;
    var _ans = window.answer;
    window.answer = function(idx){
      var before = cur && !cur.locked ? {lang: cur.lang, level: cur.level, i: cur.i} : null;
      _ans(idx);
      try {
        if(before && idx !== QUIZZES[before.lang][before.level][before.i].a && !mPrac){
          var m = mLoad();
          var key = before.lang + '|' + before.level + '|' + before.i;
          var ex = m.filter(function(x){ return x.k === key; })[0];
          if(ex) ex.ok = 0; else m.push({k: key, lang: before.lang, level: before.level, qi: before.i, ok: 0});
          mSave(m);
        }
      } catch(e){}
    };
  }

  function mHome(){
    var box = document.getElementById('mstBox'); if(!box) return;
    var m = mLoad();
    if(!m.length){
      box.innerHTML = '<div class="plc-result"><div class="plc-big">✨</div>'
        + '<div class="plc-lv">مفيش أخطاء محفوظة — شطورة!</div>'
        + '<p class="du-sub">أي غلطة في الاختبارات بتتحفظ هنا علشان تتدربي عليها لحد ما تتقنيها</p></div>';
      return;
    }
    box.innerHTML = '<div class="plc-intro">عندك <b style="color:var(--gold,#e9c26a)">' + m.length + '</b> غلطة محفوظة — ردّي على كل واحدة صح <b>مرتين ورا بعض</b> وهتتمسح 🩹</div>'
      + '<div class="plc-langs">' + m.map(function(x, i){
          var q = QUIZZES[x.lang] && QUIZZES[x.lang][x.level] && QUIZZES[x.lang][x.level][x.qi];
          if(!q) return '';
          return '<div class="mst-card"><div class="mst-q">' + q.q + '</div><div class="mst-p">تقدمك: ' + x.ok + ' / 2 ✅</div></div>';
        }).join('') + '</div>'
      + '<button class="btn du-big" id="mstGo">🩹 ابدئي تدريب الأخطاء</button>';
    var g = document.getElementById('mstGo');
    if(g) g.addEventListener('click', function(){ mPrac = {i: 0, list: mLoad()}; mNext(); });
  }

  function mNext(){
    var box = document.getElementById('mstBox'); if(!box) return;
    if(!mPrac || mPrac.i >= mPrac.list.length){
      mPrac = null;
      if(window.refreshDash) refreshDash();
      return mHome();
    }
    var x = mPrac.list[mPrac.i];
    var q = QUIZZES[x.lang][x.level][x.qi];
    box.innerHTML = '<div class="plc-prog">غلطة ' + (mPrac.i+1) + ' / ' + mPrac.list.length + ' — محتاجة ' + (2 - x.ok) + ' صح ورا بعض 🩹</div>'
      + '<div class="q-text">' + q.q + '</div>'
      + q.opts.map(function(o, idx){ return '<button class="opt" data-i="'+idx+'">'+o+'</button>'; }).join('');
    Array.prototype.forEach.call(box.querySelectorAll('.opt'), function(b){
      b.addEventListener('click', function(){
        var idx = parseInt(b.dataset.i, 10);
        var ok = idx === q.a;
        Array.prototype.forEach.call(box.querySelectorAll('.opt'), function(o, i){
          if(i === q.a) o.classList.add('correct'); else if(i === idx) o.classList.add('wrong');
          o.disabled = true;
        });
        var m = mLoad();
        var rec = m.filter(function(r){ return r.k === x.k; })[0];
        if(ok){
          if(window.sndGood) sndGood();
          if(rec){ rec.ok++; if(rec.ok >= 2){ m = m.filter(function(r){ return r.k !== x.k; }); if(window.awardPoints) awardPoints(5, 'أصلحتِ غلطة 🩹'); } }
          x.ok = rec ? rec.ok : 2;
        } else {
          if(window.sndBad) sndBad();
          if(rec) rec.ok = 0;
          x.ok = 0;
        }
        mSave(m);
        setTimeout(function(){ mPrac.i++; mNext(); }, ok ? 800 : 1400);
      });
    });
  }

  window.addEventListener('hashchange', function(){
    if(location.hash === '#listen') setTimeout(lsHome, 60);
    if(location.hash === '#mistakes') setTimeout(mHome, 60);
  });
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function(){ lsHome(); mHome(); });
  else { lsHome(); mHome(); }
  window.lsHome = lsHome; window.mHome = mHome;
})();
