import os
OUT=os.path.join(os.path.dirname(__file__),'../project/slides/')
G="background:linear-gradient(to right, #1F6FD0 0%, #1F6FD0 33%, #C0392B 33%, #C0392B 66%, #0B8A83 66%, #0B8A83 100%)"
STIX="'STIX Two Text', 'Times New Roman', serif"
BL,RD,TL,TLD,INK,MU='#1F6FD0','#C0392B','#0B8A83','#0B6F6B','#141B4D','#4A5280'
IMG_={'crate':'0e4e7bcb64a3e8f504876377c4c7ba17','block':'4d692e8682b8bdf3b932af25af21c9c7','ball':'f4a0cacfd76eead58601ce38ab95f4bf','person':'c9f429aa3ecd2eee77badf8dc9666f97','booktable':'cc777b5f2e20dcb319e278252c3c11a8','stage':'7a4304c08214940b92942b76374e878e'}
LEG='''<p style="position:absolute;right:128px;bottom:58px;width:110px;font-size:28px;font-weight:700;text-align:center;color:#FFFFFF;background:#1F6FD0;border-radius:999px;padding:2px 0">&#8207;כוח&#8207;</p>
<p style="position:absolute;right:250px;bottom:58px;width:180px;font-size:28px;font-weight:700;text-align:center;color:#FFFFFF;background:#C0392B;border-radius:999px;padding:2px 0">&#8207;כוח מנוגד&#8207;</p>
<p style="position:absolute;right:442px;bottom:58px;width:170px;font-size:28px;font-weight:700;text-align:center;color:#FFFFFF;background:#0B7A74;border-radius:999px;padding:2px 0">&#8207;כוח שקול&#8207;</p>'''
def bb(bi=None,bo=None):
    s=''
    if bi:s+=f' data-build-in="{bi}"'
    if bo:s+=f' data-build-out="{bo}"'
    return s
def head(i,title,trans='fade'):
    return (f'<section id="{i}" data-transition="{trans}" style="background:#EEF2F9;color:#141B4D;font-family:\'Assistant\', Arial, sans-serif;padding:128px 128px 160px;display:flex;flex-direction:column;gap:24px">\n'
            f'<div style="position:absolute;left:0px;top:0px;width:1920px;height:14px;{G}"></div>\n'
            f'<h2 style="font-family:\'Rubik\', Arial, sans-serif;font-size:60px;font-weight:700;line-height:1.15;text-align:right;color:#141B4D">&#8207;{title}&#8207;</h2>')
def foot(notes,legend=True):
    return f'<p style="position:absolute;left:128px;bottom:64px;width:300px;font-size:28px;text-align:left;color:#4A5280">0 / 0</p>\n'+(LEG+'\n' if legend else '')+f'<aside>{notes}</aside>\n</section>\n'
def P(l,t,w,text,size=32,col=INK,wt=400,al='right',bi=None,bo=None,ex=''):
    return f'<p{bb(bi,bo)} style="position:absolute;left:{l}px;top:{t}px;width:{w}px;font-size:{size}px;font-weight:{wt};line-height:1.35;text-align:{al};color:{col}{ex}">&#8207;{text}&#8207;</p>'
def CARD(l,t,w,text,bg,bd,size=32,bi=None,bo=None,wt=400):
    return P(l,t,w,text,size,INK,wt,'right',bi,bo,f';background:{bg};border:2px solid {bd};border-radius:16px;padding:14px 28px')
def M(l,t,w,math,size,col,al='center',bi=None,bo=None):
    return f'<p{bb(bi,bo)} style="position:absolute;left:{l}px;top:{t}px;width:{w}px;font-family:{STIX};font-size:{size}px;font-weight:600;text-align:{al};color:{col}">&#8206;{math}&#8206;</p>'
def LAB(l,t,w,parts,col,size=36,al='left',bi=None,bo=None):
    jc={'left':'flex-start','right':'flex-end'}.get(al,'center');sm=round(size*0.62)
    inner=''.join(f'<p style="font-family:{STIX};font-weight:600;color:{col};font-size:{sm if k=="s" else size}px;line-height:1.2">{v.replace(" ","&#160;") if k!="s" else v}</p>' for v,k in parts)
    return f'<div{bb(bi,bo)} style="position:absolute;left:{l}px;top:{t}px;width:{w}px;display:flex;flex-direction:row;align-items:flex-end;justify-content:{jc}">{inner}</div>'
def A(x1,y1,x2,y2,col,w=8,bi=None,bo=None,dash=False,head=True):
    return f'<x-connector{bb(bi,bo)}{"" if head else " head=\"none\""} x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" style="color:{col};border-width:{w}px{";border-style:dashed" if dash else ""}"></x-connector>'
def IMG(k,alt,l,t,w,h,i=None,bi=None,bo=None):
    return f'<img{f" id=\"{i}\"" if i else ""}{bb(bi,bo)} src="/_blob/{IMG_[k]}" alt="{alt}" style="position:absolute;left:{l}px;top:{t}px;width:{w}px;height:{h}px;object-fit:contain">'
def BOX(l,t,w,h,style,bi=None,bo=None,i=None,inner=''):
    return f'<div{f" id=\"{i}\"" if i else ""}{bb(bi,bo)} style="position:absolute;left:{l}px;top:{t}px;width:{w}px;height:{h}px;{style}">{inner}</div>'
def RING(l,t,w,h=64,bi=None,bo=None):return BOX(l,t,w,h,'border:4px solid #F4C51C;border-radius:14px',bi,bo)
def HL(l,t,w,h,bi=None,bo=None):return BOX(l,t,w,h,'background:#FFF1B8;border-radius:12px',bi,bo)
def PILL(l,t,w,text,bi=None,bo=None,size=32):
    return P(l,t,w,text,size,INK,600,'center',bi,bo,';background:#FFFFFF;border:3px solid #1E2F8C;border-radius:999px;padding:10px 16px')
STAGE=lambda:IMG('stage','',128,250,780,620)
GRIDCAP=lambda:P(212,836,300,'משבצת אחת = 1N',28,MU,400,'left')
def write(i,parts):
    import sys;sys.path.insert(0,os.path.dirname(os.path.abspath(__file__)));import maslul
    open(OUT+i+'.html','w',encoding='utf8').write(maslul.process('\n'.join(parts)))

# ---------- slide 2: three situations, revealed one at a time ----------
def card(x0,title,bi):
    return [BOX(x0,280,520,420,'background:#FFFFFF;border:2px solid #B9C3E0;border-top:8px solid #1E2F8C;border-radius:20px',bi),P(x0+20,300,480,title,30,INK,700,'right',bi)]
s=[head('s01-open','שלושה מצבים: מה אתם רואים?'),P(128,206,1664,'התבוננו בכל ציור וענו בקול: על כמה גופים מצוירים החצים?',34,MU)]
s+=card(1272,'מצב 1: שני גופים במגע','rise 1')+[IMG('crate','גוף 1',1422,470,110,96,bi='rise 1'),IMG('block','גוף 2',1532,470,110,96,bi='rise 1'),P(1422,490,110,'1',36,INK,700,'center','rise 1'),P(1532,490,110,'2',36,INK,700,'center','rise 1'),
 A(1536,500,1626,500,BL,bi='rise 1'),A(1528,540,1438,540,RD,bi='rise 1'),LAB(1536,404,250,[('F','n'),('1,2','s'),(' = 3 N','n')],BL,34,'left','rise 1'),LAB(1290,580,240,[('F','n'),('2,1','s'),(' = 3 N','n')],RD,34,'right','rise 1')]
s+=card(700,'מצב 2: שני כוחות על גוף K','rise 2')+[IMG('crate','גוף K',905,470,110,96,bi='rise 2'),P(905,490,110,'K',36,INK,700,'center','rise 2'),A(1019,500,1139,500,BL,bi='rise 2'),A(901,540,841,540,RD,bi='rise 2'),
 LAB(1010,416,200,[('F','n'),('1','s'),(' = 4 N','n')],BL,34,'left','rise 2'),LAB(712,580,190,[('F','n'),('2','s'),(' = 2 N','n')],RD,34,'right','rise 2')]
s+=card(128,'מצב 3: שני כוחות על גוף A','rise 3')+[IMG('crate','גוף A',333,520,110,96,bi='rise 3'),P(333,540,110,'A',36,INK,700,'center','rise 3'),A(388,516,388,396,BL,bi='rise 3'),A(447,568,507,568,BL,bi='rise 3'),
 LAB(150,430,230,[('F','n'),('1','s'),(' = 4 N','n')],BL,34,'right','rise 3'),LAB(452,586,190,[('F','n'),('2','s'),(' = 2 N','n')],BL,34,'left','rise 3')]
for x0,t in [(1272,'חץ אחד על כל גוף'),(700,'שני חצים על אותו גוף'),(128,'שני חצים על אותו גוף')]:
    s.append(P(x0+40,636,440,t,30,INK,700,'center','pop 4',None,';background:#FFF1B8;border-radius:999px;padding:4px 0'))
s+=[P(128,722,1664,'האם בכל המצבים אפשר פשוט לחבר את הכוחות? הצביעו:',38,INK,700,'right','rise 5'),
 PILL(1272,792,520,'כן, בכל המצבים','pop 5','fade 6'),PILL(700,792,520,'לא, זה תלוי במצב','pop 5','fade 6'),PILL(128,792,520,'צריך לבדוק קודם','pop 5','fade 6'),
 P(128,792,1664,'מטרת השיעור: להבין מה מחברים, מתי מחברים ואיך הכיוון משפיע.',34,'#FFFFFF',600,'right','rise 6',None,';background:#1E2F8C;border-radius:16px;padding:16px 32px'),
 foot('''מטרה: לעורר הבחנה בין שלושה מצבים, בלי לפתור אותם.
פונים לתלמידים: "התבוננו בכל ציור וענו בקול".
סדר ההקשות: הקשות 1 עד 3: כל מצב מופיע לחוד. אחרי כל אחד שואלים: על כמה גופים מצוירים החצים? מה הערך של כל כוח? הקשה 4: מסכמים את התשובות על כל ציור. הקשה 5: הצבעה, בלי לחשוף תשובה. רושמים על הלוח כמה הצביעו לכל אפשרות. הקשה 6: מטרת השיעור.
במצב 1 שני הגופים נוגעים זה בזה, וכל חץ מצויר על גוף אחר. במצבים 2 ו-3 שני החצים על אותו גוף. הסימון 1,2 יוסבר בהמשך; כרגע מספיק לומר שאלה שני כוחות שונים.
חוזרים להצבעה בשקף האחרון.''')]
write('s01-open',s)

# ---------- slide 6: the book on the table, arrows from the contact point ----------
s=[head('s05-book','ספר מונח על שולחן: אילו כוחות פועלים עליו?'),STAGE(),
 P(150,272,740,'האם פועלים על הספר כוחות?',36,INK,700,'right',None,'fade 1'),
 P(150,272,740,'אם רק המשיכה הייתה פועלת, מה היה קורה לספר?',36,INK,700,'right','fade 1','fade 2'),
 P(150,272,740,'מה אפשר לומר על הכוח השקול על הספר?',36,INK,700,'right','fade 2'),
 IMG('booktable','ספר עבה מונח על שולחן עץ',150,470,560,264),
 A(430,590,430,710,BL,bi='fade 1'),LAB(450,660,260,[('F','n'),('g','s'),(' = 10 N','n')],BL,34,'left','fade 1'),P(724,700,180,'כדור הארץ מושך את הספר מטה',26,BL,700,'right','fade 1'),
 A(430,590,430,470,RD,bi='fade 2'),LAB(450,420,260,[('F','n'),('N','s'),(' = 10 N','n')],RD,34,'left','fade 2'),P(724,404,180,'השולחן דוחף את הספר מעלה',26,RD,700,'right','fade 2'),
 BOX(420,580,20,20,'background:#F4C51C;border:3px solid #141B4D;border-radius:50%','fade 1'),
 P(150,760,560,'החצים יוצאים מנקודת המגע בין הספר לשולחן',26,MU,600,'center','fade 1'),
 GRIDCAP(),
 CARD(960,262,832,'<b>משיכת כדור הארץ:</b> כדור הארץ מושך אליו כל גוף, גם את הספר. לכן החץ פונה מטה.','#E3F2FB',BL,32,'rise 1'),
 CARD(960,400,832,'<b>דחיפת השולחן:</b> הספר לוחץ על השולחן, והשולחן מתכופף מעט מאוד, כמו מזרן קשיח. הוא דוחף את הספר בחזרה, כלפי מעלה.','#FBE7E7',RD,32,'rise 2'),
 P(960,574,832,'בספרים: כוח נורמלי, כלומר ניצב למשטח. מסמנים F עם האות N.',28,MU,400,'right','fade 2'),
 CARD(960,640,832,'<b>החוק הראשון:</b> הספר במנוחה, ולכן שני הכוחות שפועלים עליו מאזנים זה את זה. הכוח השקול על הספר הוא אפס.','#E6F5F4',TL,32,'pop 3'),
 CARD(960,808,832,'הכוחות שווים כי הספר במנוחה, לא בגלל החוק השלישי. שניהם פועלים על אותו גוף.','#FFF1B8','#F4C51C',30,'pop 4',wt=600),
 foot('''מטרה: לזהות את שני הכוחות שפועלים על הספר, ולהסביר את השוויון ביניהם בעזרת החוק הראשון.
מינוח: לא משתמשים כאן במונחים "כוח כובד" ו"כוח תמיכה". אומרים "כדור הארץ מושך את הספר" ו"השולחן דוחף את הספר". הסימונים F עם g ו-F עם N מופיעים כתוויות בלבד.
סדר ההקשות: לפני ההקשה הראשונה: ספר על שולחן, בלי חצים. שואלים: האם פועלים על הספר כוחות? הקשה 1: משיכת כדור הארץ, 10 N, ושאלה: אם רק היא הייתה פועלת, מה היה קורה? (הספר היה נופל). הקשה 2: דחיפת השולחן, 10 N, עם ההסבר האינטואיטיבי: השולחן מתכופף מעט, כמו מזרן, ודוחף בחזרה. הקשה 3: החוק הראשון. הקשה 4: האזהרה.
שני החצים מצוירים מנקודת המגע בין הספר לשולחן, כמו בספר הלימוד.
אפשר להדגים: לוחצים בכף היד על ספוג או על קפיץ. מה מרגישים? הספוג דוחף בחזרה. גם השולחן עושה זאת, רק שהוא קשיח ולכן לא רואים את הכיווץ.
אין שואלים כאן על פעולה ותגובה. את השאלה שומרים לשקף בדיקת ההבנה.''')]
write('s05-book',s)

# ---------- slide 12: check ----------
opt=lambda l,t:BOX(l,t,816,168,'background:#FFFFFF;border:2px solid #B9C3E0;border-radius:20px')
s=[head('s09-check','בדיקת הבנה'),
 P(128,212,1664,'משיכת כדור הארץ ודחיפת השולחן פועלות על הספר. האם הן זוג פעולה ותגובה של החוק השלישי?',38,INK,700),
 opt(976,340),opt(128,340),opt(976,524),opt(128,524),
 P(1008,358,752,'א. כן, משום שהן שוות ומנוגדות.',32,INK,600),P(160,358,752,'ב. לא, משום ששתיהן פועלות על אותו גוף, הספר.',32,INK,600),
 P(1008,542,752,'ג. כן, משום שהספר במנוחה.',32,INK,600),P(160,542,752,'ד. לא, משום שאחת מהן גדולה יותר.',32,INK,600),
 BOX(128,340,816,168,'border:6px solid #4AAE3B;border-radius:20px','fade 1'),P(152,362,110,'נכון',28,INK,700,'center','fade 1',None,';background:#4AAE3B;border-radius:999px;padding:4px 0'),
 P(1008,428,752,'שוויון וכיוון הפוך אינם מספיקים. בודקים על איזה גוף פועל כל כוח.',30,MU,400,'right','fade 1'),
 P(160,428,752,'נכון. זוג פעולה ותגובה פועל תמיד על שני גופים שונים.',30,MU,400,'right','fade 1'),
 P(1008,612,752,'המנוחה מסבירה למה הן שוות (החוק הראשון), אבל לא הופכת אותן לזוג.',30,MU,400,'right','fade 1'),
 P(160,612,752,'בספר במנוחה שתיהן שוות: 10 N כל אחת.',30,MU,400,'right','fade 1'),
 BOX(128,330,1664,622,'background:#EEF2F9','fade 2'),
 IMG('booktable','ספר עבה מונח על שולחן עץ',160,470,560,264,bi='fade 2'),
 A(440,590,440,470,RD,bi='fade 2'),A(440,590,440,710,BL,bi='fade 2'),
 BOX(430,580,20,20,'background:#F4C51C;border:3px solid #141B4D;border-radius:50%','fade 2'),
 LAB(460,420,260,[('F','n'),('N','s'),(' = 10 N','n')],RD,34,'left','fade 2'),P(724,404,200,'השולחן דוחף את הספר מעלה',26,RD,700,'right','fade 2'),
 LAB(460,660,260,[('F','n'),('g','s'),(' = 10 N','n')],BL,34,'left','fade 2'),P(724,700,200,'כדור הארץ מושך את הספר מטה',26,BL,700,'right','fade 2'),
 P(160,800,600,'שני הכוחות פועלים על הספר',30,MU,700,'center','fade 2'),
 CARD(960,360,832,'על הספר פועלים שני כוחות משתי אינטראקציות שונות: אחת עם כדור הארץ ואחת עם השולחן.','#FFFFFF','#B9C3E0',32,'rise 2'),
 CARD(960,520,832,'<b>למה הם שווים?</b> כי הספר במנוחה. זה החוק הראשון, לא השלישי.','#E6F5F4',TL,32,'rise 3'),
 CARD(960,660,832,'<b>ואיפה בני הזוג שלהם?</b> הספר לוחץ על השולחן, והספר מושך את כדור הארץ. הם פועלים על גופים אחרים.','#FFF1B8','#F4C51C',32,'rise 4'),
 foot('''מטרה: לזהות ולתקן את התפיסה השגויה הנפוצה ביותר בנושא.
הפעלה: מציגים רק את השאלה ואת ארבע האפשרויות. התלמידים מכריעים בהצבעה. הקשה 1: התשובה הנכונה, ב, ומשוב קצר לכל אפשרות. הקשה 2: הספר על השולחן ושני הכוחות שפועלים עליו. הקשה 3: למה הם שווים: החוק הראשון. הקשה 4: איפה בני הזוג שלהם.
השאלה שהתלמיד שואל את עצמו: על איזה גוף פועל כל אחד מהכוחות? אם שניהם על אותו גוף, הם אינם זוג פעולה ותגובה.
אפשרות ג היא המלכודת העדינה: היא נכונה בחציה. המנוחה באמת מסבירה את השוויון, אבל זה החוק הראשון.
מי שבחר באפשרות שגויה: מבקשים ממנו לומר במשפט מלא מי מפעיל כל כוח ועל מי.''')]
write('s09-check',s)

# ---------- slide 10: ball and person ----------
s=[head('s07-ball','דוגמה: כדור פוגע באדם'),STAGE(),
 P(160,272,716,'רגע המגע. איזה כוח הכדור מפעיל, ועל מי?',34,INK,700,'right',None,'fade 2'),
 P(160,272,716,'ואיזה כוח האדם מפעיל, ועל מי?',34,INK,700,'right','fade 2'),
 IMG('person','אדם עומד, ידו מושטת אל הכדור',480,370,200,420,i='personobj'),IMG('ball','כדור ברגע המגע ביד',360,482,120,120,i='ballobj'),
 A(486,572,706,572,BL,10,'fade 1'),LAB(712,548,190,[('F','n'),('1,2','s'),(' = 8 N','n')],BL,32,'left','fade 1'),
 A(480,512,260,512,RD,10,'fade 2'),LAB(140,528,212,[('F','n'),('2,1','s'),(' = 8 N','n')],RD,32,'right','fade 2'),
 P(150,806,350,'החץ האדום פועל על הכדור',30,'#7A1D14',700,'center','rise 3',None,';background:#FBE7E7;border-radius:999px;padding:4px 0'),
 P(530,806,350,'החץ הכחול פועל על האדם',30,'#0B3F7A',700,'center','rise 3',None,';background:#E3F2FB;border-radius:999px;padding:4px 0'),
 P(960,262,832,'שאלה: ברגע המגע, מי מפעיל כוח גדול יותר?',38,INK,700,'right',None,'fade 4'),
 P(960,340,832,'א. הכדור, כי הוא נע מהר.',32,INK,600,'right','pop 1','fade 4',';background:#FFFFFF;border:2px solid #B9C3E0;border-radius:14px;padding:10px 24px'),
 P(960,416,832,'ב. האדם, כי הוא כבד יותר.',32,INK,600,'right','pop 1','fade 4',';background:#FFFFFF;border:2px solid #B9C3E0;border-radius:14px;padding:10px 24px'),
 P(960,492,832,'ג. הכוחות שווים בגודלם.',32,INK,600,'right','pop 1','fade 4',';background:#FFFFFF;border:2px solid #B9C3E0;border-radius:14px;padding:10px 24px'),
 BOX(958,490,836,66,'border:5px solid #4AAE3B;border-radius:14px','fade 2','fade 4'),
 CARD(960,580,832,'<b>נכון: ג.</b> הכדור דוחף את האדם ב־8 N, והאדם דוחף את הכדור ב־8 N. כל כוח פועל על גוף אחר.','#E6F5F4',TL,30,'rise 2','fade 4'),
 BOX(960,262,832,350,'background:#FFFFFF;border:2px solid #B9C3E0;border-radius:20px','rise 4'),
 P(992,282,768,'הכדור מפעיל כוח על האדם, והאדם מפעיל באותו רגע כוח שווה בגודלו ומנוגד בכיוונו על הכדור.',32,INK,400,'right','rise 4'),
 M(960,420,832,'F⃗₁,₂ = −F⃗₂,₁',58,INK,'center','rise 4'),
 P(992,540,768,'גוף 1: הכדור. גוף 2: האדם.',30,MU,400,'right','rise 4'),
 CARD(960,640,832,'הכוחות שווים, אבל התוצאה שונה: הכדור הקל משנה כיוון, והאדם הכבד כמעט לא זז.','#FFF1B8','#F4C51C',32,'pop 5',wt=600),
 foot('''מטרה: לזהות זוג פעולה ותגובה במקרה ממשי, ולדעת על איזה גוף פועל כל כוח.
סדר ההקשות: רגע המגע ושאלה: איזה כוח הכדור מפעיל ועל מי? מימין מוצגת השאלה. הקשה 1: החץ הכחול על האדם (8 N) ושלוש התשובות. התלמידים מצביעים. הקשה 2: החץ האדום על הכדור, באותו אורך, ומשוב: התשובה ג. הקשה 3: על איזה גוף פועל כל חץ. הקשה 4: הניסוח והמשוואה. הקשה 5: למה התוצאה שונה.
רוב התלמידים יבחרו בגוף המהיר או הגדול. זו התפיסה השגויה שהשקף מתקן: מבלבלים בין הכוח לבין התוצאה שלו.
הסימון זהה לשקף 8: 1 הוא הכדור, 2 הוא האדם. המספר הראשון מי מפעיל, השני על מי.
במעבדה, תחנה 5: אותה פגיעה כהנפשה, עם הקפאה ברגע המגע וגרירת תוויות.''')]
write('s07-ball',s)

# ---------- slide 5: one axis, one variable at a time ----------
X0=1141
s=[head('s04-axis','כוחות באותו כיוון ובכיוונים מנוגדים'),STAGE(),
 P(160,282,716,'מקרה א: דנה ויואב דוחפים את הארגז יחד, ימינה',34,MU,700,'right',None,'fade 7'),
 P(160,282,716,'מקרה ב: יואב עובר לצד השני ודוחף שמאלה',34,MU,700,'right','fade 7'),
 IMG('crate','ארגז K',420,400,160,140),P(420,438,160,'K',52,INK,700,'center'),
 A(584,420,784,420,BL),LAB(600,356,280,[('F','n'),('1','s'),(' = 4 N','n')],BL,36,'left'),
 A(584,520,684,520,BL,bo='fade 7'),LAB(700,492,200,[('F','n'),('2','s'),(' = 2 N','n')],BL,36,'left',None,'fade 7'),
 A(416,520,316,520,RD,bi='fade 7'),LAB(176,456,240,[('F','n'),('2','s'),(' = 2 N','n')],RD,36,'right','fade 7'),
 RING(592,352,190,64,'fade 2','fade 3'),RING(692,488,190,64,'fade 4','fade 5'),RING(248,452,176,64,'fade 8','fade 9'),
 A(400,670,700,670,TL,12,'fade 6','fade 7'),LAB(400,694,400,[('ΣF','n'),(' = 6 N','n')],TLD,42,'left','fade 6','fade 7'),
 A(400,670,500,670,TL,12,'fade 10'),LAB(400,694,400,[('ΣF','n'),(' = 2 N','n')],TLD,42,'left','fade 10'),
 GRIDCAP(),
 P(960,262,832,'מה גודל הכוח השקול ומה כיוונו?',38,INK,700,'right',None,'fade 7'),
 P(960,262,832,'מה יקרה לכוח השקול כשהחץ של יואב מתהפך?',38,INK,700,'right','fade 7'),
 BOX(960,376,832,330,'background:#E6F5F4;border:2px solid #0B8A83;border-radius:20px','rise 1'),
 HL(X0+170,394,120,66,'fade 2','fade 3'),HL(X0+350,394,120,66,'fade 4','fade 5'),HL(X0+350,394,120,66,'fade 8','fade 9'),
 M(X0,392,170,'ΣF =',52,MU,'center','fade 1'),M(X0+170,392,120,'F₁',52,MU,'center','fade 1'),M(X0+290,392,60,'+',52,MU,'center','fade 1'),M(X0+350,392,120,'F₂',52,MU,'center','fade 1'),
 M(X0,474,170,'=',48,INK,'center','fade 3'),M(X0+170,474,120,'(+4)',48,BL,'center','pop 3'),M(X0+290,474,60,'+',48,INK,'center','fade 5'),
 M(X0+350,474,120,'(+2)',48,BL,'center','pop 5','fade 8'),M(X0+350,474,120,'(−2)',48,RD,'center','pop 9'),
 M(960,554,832,'= +6 N',56,TLD,'center','pop 6','fade 7'),M(960,554,832,'= +2 N',56,TLD,'center','pop 10'),
 P(992,640,768,'הכוח השקול פועל ימינה.',32,INK,400,'right','fade 6','fade 7'),P(992,640,768,'הכוח השקול פועל ימינה, וקטן יותר.',32,INK,400,'right','fade 10'),
 P(960,720,832,'ימינה מציבים עם פלוס, שמאלה עם מינוס.',32,MU,400,'right','rise 1'),
 CARD(960,790,832,'שני הכוחות פועלים על גוף K עצמו. הם אינם זוג כוחות של החוק השלישי.','#FFF1B8','#F4C51C',32,'pop 11',wt=600),
 foot('''מטרה: מעבר מתרשים למשוואה ומשם להצבה, משתנה אחד בכל פעם.
סדר ההקשות: חיזוי בעל פה. הקשה 1: המשוואה הכללית באותיות והכלל: ימינה פלוס, שמאלה מינוס. הקשה 2: מסמנים את F₁: רקע צהוב במשוואה ומסגרת צהובה על התווית שלו בתרשים. שואלים: מה הגודל ומה הכיוון? הקשה 3: מציבים (+4). הקשה 4: מסמנים את F₂. הקשה 5: מציבים (+2). הקשה 6: התוצאה +6 N וחץ השקול. הקשה 7: החץ של יואב מתהפך. הקשה 8: מסמנים שוב את F₂, עכשיו הוא פונה שמאלה. הקשה 9: מציבים (−2). הקשה 10: התוצאה +2 N. הקשה 11: הדגש על גוף K.
שאלה מכוונת בהקשה 8: מה השתנה במשוואה? רק הסימן של הכוח השני. F₁ נשאר (+4).
טעות נפוצה: כלל שטחי של תמיד מחברים או תמיד מחסרים. המשוואה היא תמיד חיבור, והסימן נכנס עם המספר.
במעבדה, תחנה 1: אותה הצבה צעד אחר צעד, ותרגיל גרירה.''')]
write('s04-axis',s)

# ---------- slide 15 (pythagoras): one variable at a time ----------
s=[head('s11-pyth','דוגמה פתורה: חישוב הכוח השקול'),STAGE(),
 IMG('crate','ארגז A',420,550,160,140),P(356,640,60,'A',44,INK,700,'center'),
 A(500,620,500,420,BL),LAB(236,486,250,[('F','n'),('1','s'),(' = 4 N','n')],BL,36,'right'),
 A(500,620,600,620,BL),LAB(612,626,250,[('F','n'),('2','s'),(' = 2 N','n')],BL,36,'left'),
 BOX(500,590,30,30,'border-top:3px solid #141B4D;border-right:3px solid #141B4D'),
 A(500,420,600,420,MU,4,'fade 3',dash=True,head=False),A(600,620,600,420,MU,4,'fade 3',dash=True,head=False),
 RING(330,480,166,64,'fade 4','fade 5'),RING(604,620,146,64,'fade 6','fade 7'),
 A(500,620,600,420,TL,12,'fade 11'),LAB(624,486,280,[('ΣF','n'),(' ≈ 4.47 N','n')],TLD,42,'left','fade 11'),
 P(160,280,716,'בדיקת סבירות: האם הגיוני שהתוצאה גדולה מ־4N אבל קטנה מ־6N?',32,INK,600,'right','pop 12',None,';background:#FFF1B8;border:2px solid #F4C51C;border-radius:16px;padding:14px 24px'),
 GRIDCAP()]
def step(t,label,text,bi,h=None,bg='#FFFFFF',bd='#B9C3E0'):
    inner=f'<p style="font-size:30px;font-weight:700;line-height:1.2;text-align:right;color:#4A5280">&#8207;{label}&#8207;</p>'+(f'<p style="font-size:32px;line-height:1.3;text-align:right;color:#141B4D">&#8207;{text}&#8207;</p>' if text else '')
    return f'<div data-build-in="{bi}" style="position:absolute;left:960px;top:{t}px;width:832px;{f"height:{h}px;" if h else ""}background:{bg};border:2px solid {bd};border-radius:16px;padding:12px 28px;display:flex;flex-direction:column;gap:2px">{inner}</div>'
s+=[step(262,'שלב 1: זיהוי הכוחות והזווית ביניהם','שני הכוחות מאונכים זה לזה.','rise 1'),
    step(378,'שלב 2: בחירת הדרך המתמטית','נשתמש במשפט פיתגורס.','rise 2'),
    step(494,'שלב 3: מסמנים, ואז מציבים','','rise 3',116),
    HL(1336,540,60,62,'fade 4','fade 5'),HL(1486,540,60,62,'fade 6','fade 7'),
    M(1106,540,230,'|ΣF⃗| = √(',46,INK,'right','fade 3'),M(1336,540,60,'F₁',46,INK,'center','fade 3','fade 5'),M(1336,540,60,'4',46,BL,'center','pop 5'),
    M(1396,540,90,'² +',46,INK,'left','fade 3'),M(1486,540,60,'F₂',46,INK,'center','fade 3','fade 7'),M(1486,540,60,'2',46,BL,'center','pop 7'),M(1546,540,60,'²)',46,INK,'left','fade 3'),
    step(620,'שלב 4: מחשבים, צעד אחר צעד','','rise 8',116),
    M(990,666,300,'= √(16 + 4)',42,INK,'center','fade 8'),M(1290,666,190,'= √20',42,INK,'center','fade 9'),M(1480,666,280,'≈ 4.47 N',42,TLD,'center','pop 10'),
    step(746,'שלב 5: משמעות התוצאה','גודל הכוח השקול הוא כ־4.47N, וכיוונו באלכסון, למעלה וימינה.','pop 11',None,'#E6F5F4','#0B8A83'),
    foot('''מטרה: לקשור בין התרשים, הנוסחה, ההצבה והתוצאה, משתנה אחד בכל פעם.
סדר ההקשות: הקשה 1: זיהוי הכוחות והזווית. הקשה 2: פיתגורס. הקשה 3: הנוסחה באותיות, ובמקביל המשולש המקווקו. הקשה 4: מסמנים את F₁: רקע צהוב בנוסחה ומסגרת צהובה על התווית בתרשים. שואלים: מה הערך של F₁? הקשה 5: מציבים 4. הקשה 6: מסמנים את F₂. הקשה 7: מציבים 2. הקשה 8: מעלים בריבוע: 16 ועוד 4. הקשה 9: סכום, שורש 20. הקשה 10: התוצאה בקירוב, 4.47 N. הקשה 11: משמעות התוצאה וחץ השקול. הקשה 12: בדיקת סבירות.
דגש: הקווים העומדים סביב ΣF מסמנים גודל של וקטור. 4.47 ניוטון הוא גודל בלבד. שורש 20 שווה בערך 4.47, לא בדיוק.
במעבדה, תחנה 6: אותה הצבה צעד אחר צעד, ותרגיל גרירה עם 3 ו-4 ניוטון.''')]
write('s11-pyth',s)
print('ok')
