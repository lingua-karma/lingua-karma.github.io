
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
    const y = new Date(Date.now()-86400000).toDateString();
    st.count = (st.last === y) ? st.count + 1 : 1;
    st.last = today;
    localStorage.setItem('lingua_streak', JSON.stringify(st));
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
  ['map','🚀','مسار التعلم'],['pquiz','🔮','شخصيتك'],['wheel','🎡','عجلة الحظ'],['qotd','❓','سؤال اليوم'],['flash','🃏','كروت سحرية'],['snake','🐍','الثعبان'],['xo','⭕','إكس أو'],['korean','🇰🇷','كوري'],['library','📕','مكتبة'],['food','🍳','المطبخ'],['stories','📚','قصص'],['color','🎨','تلوين'],['capitals','🌍','عواصم'],['ch30','📅','تحدي ٣٠ يوم'],['piano','🎹','بيانو'],['diary','📔','يومياتي'],['khatma','📿','ختمتي'],['weather','🌤️','الجو'],['shooter','🔫','صيد الكلمات'],['runner','🏃‍♀️','الجري'],['fashion','👠','موضة'],['trip','✈️','رحلة'],['places','🏛️','أماكن'],['premium','💎','بريميوم'],['quotes','🎬','اقتباسات'],['ai','🤖','لمى'],['puzzle','🧩','بازل الكلمات'],['hobbies','🎨','هوايات'],['themes','🗂️','كلمات بالموضوع'],['jokes','😂','ضحك'],['mood','🎭','مزاجك'],['wall','💬','حائط الكلام'],['deen','🕌','ركن الروح'],['mushaf','📖','المصحف'],['karma','👑','ركن كارما'],['gbk','💌','كلمة لكارما'],['vent','💭','فضفضة'],['tips','💡','نصايح اللغات'],['settings','🌐','لغة التطبيق']
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
  if(!hist.length) hist = [{role:'assistant', content:'أهلاً يا قمر! 👋 أنا لمى، صاحبتك في لينجوا. اسأليني أي حاجة عن الإنجليزي أو الفرنسي أو الألماني أو الصيني أو الكوري — ترجمة، نطق، قواعد، أي حاجة! 💜'}];
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
      body: JSON.stringify({messages: hist.slice(-9).map(function(m){return {role:m.role, content:m.content};})})})
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
    en: [['I','love','learning','languages'],['How','are','you','today'],['Thank','you','very','much'],['Good','morning','my','friend'],['Where','is','the','library']],
    fr: [['Je','suis','très','content'],['Comment','ça','va'],['Merci','beaucoup','mon','ami'],['Bonjour','tout','le','monde'],['Où','est','la','gare']],
    de: [['Ich','lerne','gern','Deutsch'],['Wie','geht','es','dir'],['Danke','sehr','mein','Freund'],['Guten','Morgen','alle','zusammen'],['Wo','ist','der','Bahnhof']],
    zh: [['我','爱','学习','语言'],['你','好','吗'],['非常','谢谢','你'],['早上好','朋友'],['图书馆','在','哪里']],
    ko: [['저는','언어를','배워요'],['잘','지내요'],['정말','고마워요'],['좋은','아침이에요'],['도서관이','어디예요']]
  };
  var lang = 'en';
  function escH(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
  function shuf(a){ a=a.slice(); for(var i=a.length-1;i>0;i--){ var j=Math.floor(Math.random()*(i+1)); var t=a[i]; a[i]=a[j]; a[j]=t; } return a; }
  function store(){ try{ return JSON.parse(localStorage.getItem('lingua_path_'+lang))||{}; }catch(e){ return {}; } }
  function saveS(s){ try{ localStorage.setItem('lingua_path_'+lang, JSON.stringify(s)); }catch(e){} }
  function unitDone(s,key){ var a=s[key]||[]; return !!(a[0]&&a[1]&&a[2]); }
  function unitOpen(s,u){ return u===0 || unitDone(s, PATH_UNITS[u-1]); }
  function say(t){ try{ var u=new SpeechSynthesisUtterance(t.replace(/ *\(.*?\)/g,'')); u.lang=TTS[lang]; u.rate=.85; speechSynthesis.cancel(); speechSynthesis.speak(u); }catch(e){} }
  function norm(s){ return String(s).toLowerCase().trim().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/ß/g,'ss').replace(/[.!?,؛،'’]/g,'').replace(/\s+/g,' '); }
  function badge(name){
    try{ var b=JSON.parse(localStorage.getItem('lingua_badges'))||[]; if(b.indexOf(name)<0){ b.push(name); localStorage.setItem('lingua_badges', JSON.stringify(b)); } }catch(e){}
  }

  function renderPath(){
    var VOC=window.VOCAB_THEMES||{}; var s = store();
    var doneCount = PATH_UNITS.filter(function(k){ return unitDone(s,k); }).length;
    var html = '<div class="map-bar"><i style="width:'+(doneCount/PATH_UNITS.length*100)+'%"></i></div>'
      + '<div class="path-count">🏅 '+doneCount+' / '+PATH_UNITS.length+' وحدة</div>';
    PATH_UNITS.forEach(function(key,u){
      var th = VOC[key]; if(!th) return;
      var st = s[key]||[false,false,false];
      var done = unitDone(s,key), open = unitOpen(s,u);
      var dots = [0,1,2].map(function(i){ return '<i class="'+(st[i]?'on':'')+'"></i>'; }).join('');
      html += '<div class="pu-row '+(u%2?'r':'l')+'">'
        + '<button class="pu-node '+(done?'done':open?'open':'locked')+'" data-punit="'+u+'"'+(open?'':' disabled')+'>'
        + '<span>'+(done?'🏅':(open?th.rows[0][6]:'🔒'))+'</span></button>'
        + '<div class="pu-info"><b>'+escH(th.name)+'</b><span class="pu-dots">'+dots+'</span></div></div>';
      if(open && !done){
        html += '<div class="pu-lessons">'+[0,1,2].map(function(l){
          var lopen = l===0 || st[l-1];
          return '<button class="pl-btn '+(st[l]?'done':lopen?'open':'locked')+'" data-ulesson="'+u+':'+l+'"'+(lopen?'':' disabled')+'>'
            +(st[l]?'⭐':(lopen?'▶':'🔒'))+' درس '+(l+1)+'</button>';
        }).join('')+'</div>';
      }
    });
    document.getElementById('mapPath').innerHTML = html;
  }

  /* ---- lesson engine ---- */
  var LS = null;
  var overlay, plBody, plBar, plHearts;
  function mkMcq(w, words, dir){
    var others = shuf(words.filter(function(x){ return x!==w; })).slice(0,3);
    var opts = shuf([w].concat(others));
    return {type:'mcq', dir:dir, w:w, opts:opts};
  }
  function mkListen(w, words){
    var others = shuf(words.filter(function(x){ return x!==w; })).slice(0,3);
    return {type:'listen', w:w, opts:shuf([w].concat(others))};
  }
  function mkType(w){ return {type:'type', w:w}; }
  function mkOrder(ui){ var s = SENTS[lang][ui % SENTS[lang].length]; return {type:'order', tiles:shuf(s), ans:s, picked:[]}; }
  function mkMatch(ws){ return {type:'match', pairs:ws, f:shuf(ws), a:shuf(ws), sel:null, got:0}; }

  function startLesson(ui, li){
    var key = PATH_UNITS[ui], th = (window.VOCAB_THEMES||{})[key];
    var words = th.rows.slice(li*10, li*10+10).map(function(r){ return {f:r[LIDX[lang]], a:r[5], e:r[6]}; });
    var exs = [mkMcq(words[0],words), mkMcq(words[1],words), mkListen(words[2],words)];
    exs.push((lang==='zh'||lang==='ko') ? mkListen(words[3],words) : mkType(words[3]));
    exs.push(mkOrder(ui));
    exs.push(mkMatch(words.slice(4,8)));
    LS = {ui:ui, li:li, key:key, exs:exs, i:0, hearts:5, xp:0};
    overlay.classList.add('show');
    document.body.style.overflow='hidden';
    renderEx();
  }
  function drawTop(){
    plBar.style.width = (LS.i/LS.exs.length*100)+'%';
    plHearts.textContent = '❤️'.repeat(LS.hearts)+'🖤'.repeat(5-LS.hearts);
  }
  function correct(){ LS.xp+=10; if(window.awardPoints) awardPoints(10,'تمرين المسار 🚀'); }
  function advance(delay){
    setTimeout(function(){
      LS.i++;
      if(LS.i>=LS.exs.length) return endLesson(true);
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
    LS.hearts--; drawTop();
    if(LS.hearts<=0){ setTimeout(function(){ endLesson(false); }, 700); }
  }
  function endLesson(won){
    plBar.style.width='100%';
    if(won){
      var s=store(); var st=s[LS.key]||[false,false,false]; st[LS.li]=true; s[LS.key]=st; saveS(s);
      if(window.awardPoints) awardPoints(20,'إكمال درس 🚀');
      var unitComplete = st[0]&&st[1]&&st[2];
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
      plBody.innerHTML='<div class="pl-end"><div class="pl-star">💔</div><h3>القلوب خلصت</h3><p>معلش، المحاولة أهم من النتيجة — جربي تاني</p>'
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
    var nb=e.target.closest('[data-punit]');
    if(nb && !nb.disabled){ /* scroll lessons into view */ var row=nb.closest('.pu-row'); var ls=row&&row.nextElementSibling; if(ls&&ls.classList.contains('pu-lessons')) ls.scrollIntoView({behavior:'smooth', block:'center'}); }
  });
  renderPath();
})();
