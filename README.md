# Hvað er Divide and Conquer?

Divide and Conquer er einfaldur turn-based strategy vafraleikur. Hægt er að spila leikinn á https://divide-and-conquer.onrender.com. Eftir að hafa stofnað aðgang fær leikmaður úthlutað slembið land með slembnum gildum. Nýta þarf gildin, *resources* og *troops*, til þess að byggja upp her og hertaka lönd.

![](https://i2.paste.pics/9acec4367fcc3697fb98883bfb6f64df.png?trs=0c3aeea4edce2a83aeb82f5fffa20f1c44589247036e0c15a04fc0f308923c45)

## Markmið
Öðlast dýpri þekkingu á React og Express með því að útfæra sterkan grunn að nokkuð umfangsmiklum leik. Ekki er lögð áhersla á villumeðhöndlun og skilvirkni, heldur frekar að bera fram nokkurs konar proof of concept.

# Útfærsla

Divide and conquer samanstendur af React (með CRA)  framenda og Express RESTful [vefþjónustu](https://github.com/nikhil7e/divide-and-conquer-service), sem bæði nota TypeScript. Framendinn nýtir [react-globe.gl](https://github.com/vasturiano/react-globe.gl) forritasafnið, sem er öflug leið til þess að lýsa gögnum á 3D hnött í vafranum. Forritasafnið notar [ThreeJS](https://github.com/mrdoob/three.js/)/WebGL til þess að útfæra framsetninguna. Því er mælt með að leikurinn sé keyrður á öflugri tölvu, helst með skjákorti svo hægt sé að draga úr loading tíma og töfum. Innifalið í framendanum er .geojson kortaskrá frá [Natural Earth](https://github.com/martynafford/natural-earth-geojson), sem er 1:10m mælikvarða gagnasafn af löndum jarðarins. Þessi gögn voru kortlögð á hnöttinn til þess að líkja eftir jörðinni og gefa leiknum áhugaverðan leikvöll. Innifalið í skránni eru ýmsar upplýsingar um löndin og eru sum þeirra notuð í leiknum, til dæmis mannfjöldi.

Bakendinn heldur utan um leikjastöðuna og lógíkina, sem er nokkuð einföld eins og er. Hægt er að velja á milli nokkurra aðgerða í hverri umferð. Meðal annars geta leikmenn sleppt umferð, byggt upp her, eða gert tilraun til hertaka lönd. Gildi sem notuð eru í aðgerðum eru í flestum tilfellum slembin. Gagnagrunnsaðgerðir eru framkvæmdar með Prisma og PostgreSQL gagnagrunnur var settur upp. Notendaumsjón hefur einnig verið útfærð með jsonwebtokens og hægt er að endurstilla leikjastöðu. Vefþjónustan, gagnagrunnurinn og framendinn eru hýst á Render. 

## Hvernig gekk

 - react-globe.gl forritasafnið er mjög öflugt, en til þess að nota advanced features, eins og til dæmis að blanda saman mismunandi globe layers eða kortleggja geojson gögn á sérstakan hátt, þurfti ég að kafa dýpra í hvernig forritasafnið og ThreeJS virka
 - Hönnun og útfærsla á bakendanum var tiltölulega þægileg miðað við vandamálin sem ég lenti í með react-globe.gl. Hönnun á Prisma schema-inu var þó dálítið bras, því hönnun meðal annars many-to-many sambanda getur verið smá bras í Prisma
 - Ég fékk tækifæri til þess að skoða ítarlegar hvernig component lifecycle virka í React, og auk þess notaði ég useMemo og useRef töluvert
 - Þetta er eitt af fyrstu verkefnum mínum þar sem unnið er með mikið af gögnum og gagnagrunnsaðgerðum. Ég notaði Chrome Devtools stöðugt, og þá sérstaklega React extension-ið og Network flipann til þess að greina og beturumbæta gagnaflæðið á milli framendanum og bakendanum.

## Næstu skref
Æskilegt væri að fínpússa útfærsluna og bæta við ýmsa virkni til þess að gera leikinn skemmtilegri og notendavænni:

 - Bæta við meiri villumeðhöndlun
 - Skipta UI og Globe í betur aðskilin React components
 - Bæta við fleiri aðgerðir og gildi svo leikurinn verði skemmtilegri og hægt sé að 'strategize-a' meira
 - Nota fleiri layers og animations til þess að bæta user experience
 - Láta óleikmanna stýrð lönd velja frá fleiri aðgerðum, þ.e. ekki einungis draga frá slembin gildi í hverri umferð
 - Þjappa og minnka gögn sem geymd eru í framenda og bakenda og fækka gögn sem send eru á milli
 - Bæta við leiðbeiningar og tooltips
 - Bæta jafnvel við multiplayer
