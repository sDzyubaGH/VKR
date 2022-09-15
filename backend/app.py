from operator import le
from sqlite3 import Cursor
from traceback import print_tb
from flask import Flask, request, jsonify
import json
from flask_cors import CORS
import pyodbc 
# import numpy as np
import base64
from config import dbConnect

app = Flask(__name__)
CORS(app)

# conn = pyodbc.connect('Driver={SQL Server};'
#                       'Server=DESKTOP-Q21V9MK;'
#                       'Database=Barriers;'
#                       'Trusted_Connection=yes;')

# cursor = conn.cursor()
# cursor.execute('SELECT * FROM Ограждения')

# for i in cursor:
#     print(i)


@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"


@app.route('/api/getData')
def getData():
    conn = pyodbc.connect(f'Driver={dbConnect[0]}'
                      f'Server={dbConnect[1]}'
                      f'Database={dbConnect[2]}'
                      'Trusted_Connection=yes;')
    cursor = conn.cursor()

    data = {}

    # Изготовитель
    cursor.execute('''SELECT  DISTINCT
      [изготовитель]
  FROM [Barriers].[dbo].[Ограждения]''')


    rows = cursor.fetchall()
    manufacturers = []
    
    for row in rows:
        manufacturers.append(list(row))


    # Высота (мин, макс)
    cursor.execute('''SELECT MIN(высота) as minimum, MAX(высота) as maximum
  FROM [Barriers].[dbo].[Ограждения]''')

    rows = cursor.fetchall()
    height = []
    
    for row in rows:
        height.append(list(row))
    height[0][1] = float('{:.2f}'.format(height[0][1]))

    # ИТТ (мин, макс)
    cursor.execute('''SELECT MIN(фактЗнач) as minimum, MAX(фактЗнач) as maximum
  FROM Испытания_Параметры JOIN Испытания on Испытания_Параметры.НИсп = Испытания.НИсп 
  join Протокол on Испытания.НПр = Протокол.НПр join Ограждения on Протокол.КодОгр = Ограждения.КодОгр 
  WHERE Наименование = \'Индекс тяжести травм\'''')

    rows = cursor.fetchall()
    ITT = []

    for row in rows:
        ITT.append(list(row))

    # Динамический прогиб
    cursor.execute('''SELECT MIN(дин_прогиб), MAX(дин_прогиб)
        FROM Ограждения''')

    rows = cursor.fetchall()
    dynProg = []

    for row in rows:
        dynProg.append(list(row))
    dynProg[0][1] = float('{:.2f}'.format(dynProg[0][1]))
    

    # Шаг стоек
    cursor.execute('''SELECT min(шаг_стоек), max(шаг_стоек)
        FROM Ограждения''')

    rows = cursor.fetchall()
    shStoek = []

    for row in rows:
        shStoek.append(list(row))

    # Рабочая ширина
    cursor.execute('''SELECT min(раб_ширина), max(раб_ширина)
        FROM Ограждения''')

    rows = cursor.fetchall()
    rSh = []

    for row in rows:
        rSh.append(list(row))
    rSh[0][1] = float('{:.2f}'.format(rSh[0][1]))


    # Марки материалов
    cursor.execute('''SELECT  DISTINCT
    Марка  
	FROM Материалы''')
    
    rows = cursor.fetchall()
    matMarks = []

    for row in rows:
        matMarks.append(list(row))
    

    # Пределы текучести
    cursor.execute('''SELECT min(пределТекучести), max(пределТекучести)
   FROM Материалы''')

    rows = cursor.fetchall()
    mPredTek = []

    for row in rows:
        mPredTek.append(list(row))


    data = {
        'manufacturers': manufacturers,
        'height': height,
        'ITT': ITT,
        'dynProg': dynProg,
        'shStoek': shStoek,
        'rSh': rSh,
        'mMarks': matMarks,
        'mPredTek': mPredTek
    }

    cursor.close()
    conn.close()

    print(data)

    return json.dumps(data)


@app.route('/api/postData', methods = ['GET', 'POST'])
def postData():
    # print(request.get_json())
    data = request.get_json()

    conn = pyodbc.connect('Driver={SQL Server};'
                      'Server=DESKTOP-Q21V9MK;'
                      'Database=Barriers;'
                      'Trusted_Connection=yes;')
    cursor = conn.cursor()


#     print(data)
#     classQuery = 'класс = '
    
#     cursor.execute(f'''SELECT * 
# FROM Ограждения WHERE {manufsQuery}''')

#     rows = cursor.fetchall()
#     res = []

#     for row in rows:
#         # res.append(list(row))
#         print(row)

    # print(data)

#     cursor.execute('''SELECT Ограждения.КодОгр, Ограждения.маркировка, Ограждения.изготовитель, ОгрДок.ИмяФ, ОгрДок.Тип
#   FROM Ограждения left JOIN ОгрДок on Ограждения.КодОгр = ОгрДок.КодОгр Where (Ограждения.класс = \'боковое\') and Ограждения.группа = \'мостовое\'''')

    query = '''SELECT DISTINCT Ограждения.КодОгр, Ограждения.маркировка, Ограждения.изготовитель, ОгрДок.ИмяФ, ОгрДок.Тип
  FROM Ограждения left JOIN ОгрДок on Ограждения.КодОгр = ОгрДок.КодОгр left join Протокол on Ограждения.КодОгр = Протокол.КодОгр left join Испытания on Протокол.НПр = Испытания.НПр left join Испытания_Параметры on Испытания_Параметры.НИсп = Испытания.НИсп
  LEFT JOIN Матер_Элем_Огр on Ограждения.КодОгр = Матер_Элем_Огр.КодОгр LEFT JOIN Элемент on Матер_Элем_Огр.КЭл = Элемент.КЭл LEFT JOIN Материалы on Матер_Элем_Огр.КМ = Материалы.КМ

'''

    condition = (
    f'''	WHERE ((Ограждения.высота >= {data["height"]["from"]} and Ограждения.высота <= {data["height"]["to"]}) or Ограждения.высота is NULL)
      and ( (Испытания_Параметры.Наименование = 'Динамический прогиб' and (Испытания_Параметры.фактЗнач >= {data["dynProg"]["from"]} and Испытания_Параметры.фактЗнач <= {data["dynProg"]["to"]}))
		or (Ограждения.дин_прогиб >= {data["dynProg"]["from"]} and Ограждения.дин_прогиб <= {data["dynProg"]["to"]}) )
      and ( (Испытания_Параметры.Наименование = 'Рабочая ширина') and (Испытания_Параметры.фактЗнач >= {data["rSh"]["from"]} and Испытания_Параметры.фактЗнач <= {data["rSh"]["to"]})
		or (Ограждения.раб_ширина >= {data["rSh"]["from"]} and Ограждения.раб_ширина <= {data["rSh"]["to"]}) )
      and ( ((Ограждения.шаг_стоек >= {data["shSt"]["from"]} and Ограждения.шаг_стоек <= {data["shSt"]["to"]}) or Ограждения.шаг_стоек is NULL) 
		or Испытания_Параметры.Наименование = 'Шаг стоек' and (Испытания_Параметры.фактЗнач >= {data["shSt"]["from"]} and Испытания_Параметры.фактЗнач <= {data["shSt"]["to"]}) )'''
    )

    classQuery = ''
    subclass = ''
    group = ''
    subgroup = ''
    typeQuery = ''

    # print (data)

    if data['class'] != 'all':
        classQuery += f' and Ограждения.класс = \'{data["class"]}\''
    
    if data['subclass'] != 'all':
        subclass += f' and Ограждения.подкласс = \'{data["subclass"]}\''
    
    if data['group'] != 'all':
        group += f' and Ограждения.группа = \'"{data["group"]}\''

    if data['subgroup'] != 'all':
        subgroup += f' and Ограждения.подгруппа = \'{data["subgroup"]}\''

    if data['type'] != 'all':
        typeQuery += f' and Ограждения.тип = \'{data["type"]}\''
    

    # Чертеж и КЭ-модель
    chertej = ''
    KEModel = ''
    if data['modelType']['chertej'] != 'no' and data['modelType']['KEModel'] != 'no':
        chertej += f' and (ОгрДок.Тип = \'{data["modelType"]["chertej"]}\''
        KEModel += f' or ОгрДок.Тип = \'{data["modelType"]["KEModel"]}\')'
    # if data['modelType']['KEModel'] != 'no':
    elif data['modelType']['chertej'] != 'no':
        chertej += f' and (ОгрДок.Тип = \'{data["modelType"]["chertej"]}\')'
    elif data['modelType']['KEModel'] != 'no':
        KEModel += f' and (ОгрДок.Тип = \'{data["modelType"]["KEModel"]}\')'


    # Запрос по изготовителям
    manufsQuery = ''
    if len(data["manufs"]) != 0:
        manufsQuery = ' and '
        if(len(data['manufs'])) != 0:
            manufsQuery += '(Ограждения.изготовитель = '
            for i in range(len(data['manufs'])):
                # manufsQuery += f'\'{data['manufs'][i]}\''
                manufsQuery += '\'' + data['manufs'][i] + '\''
                if i != len(data['manufs']) - 1:
                    manufsQuery += ' OR Ограждения.изготовитель = '
                else:
                    manufsQuery += ')'

    # print(manufsQuery)

    # Энергия удара и УУС
    UUSQuery = ''
    enUdaraQuery = ''
    if len(data['UUD']) != 0:
        UUSQuery = ' and (Ограждения.удержСпособн = '
        for i in range(len(data['UUD'])):
            UUSQuery += f'\'{data["UUD"][i]}\''
            if i != len(data['UUD']) - 1:
                UUSQuery += ' OR Ограждения.удержСпособн = '
            else:
                UUSQuery += ')'

    if len(data['enUdara']) != 0:
        enUdaraQuery = ' and (Ограждения.энергияудара = '
        for i in range(len(data['enUdara'])):
            enUdaraQuery += f'{data["enUdara"][i]}'
            if i != len(data['enUdara']) - 1:
                enUdaraQuery += ' OR Ограждения.энергияудара = '
            else:
                enUdaraQuery += ')'

    # print(enUdaraQuery, UUSQuery)

    # Материалы элементов
    mMarks = ''
    mPredTek = ''

    if len(data['mMarks']) != 0:
        mMarks += f'and (Материалы.Марка = '
        for i  in range(len(data['mMarks'])):
            mMarks += f'\'{data["mMarks"][i]}\''
            if i != len(data["mMarks"]) - 1:
                mMarks += ' OR Материалы.Марка = '
            else:
                mMarks += ')'
    
    if len(data["mPredTek"]) != 0:
        mPredTek += f' and (Материалы.пределТекучести >= {data["mPredTek"]["from"]} and Материалы.пределТекучести <= {data["mPredTek"]["to"]})'

    # print(mMarks, mPredTek)



    condition += (
        classQuery + subclass + group + subgroup + typeQuery 
        + chertej + KEModel 
        + enUdaraQuery + UUSQuery
        + manufsQuery
        + mMarks + mPredTek
    )

    cursor.execute(query + condition)


#     cursor.execute('''SELECT Ограждения.КодОгр, Ограждения.маркировка, Ограждения.изготовитель, ОгрДок.ИмяФ, ОгрДок.Тип, ОгрДок.Файл
#   FROM Ограждения RIGHT JOIN ОгрДок on Ограждения.КодОгр = ОгрДок.КодОгр''')

    rows = cursor.fetchall()
    res = {}
    # res = []

    # for row in rows:
    # res.append(list(row))
        # print(row)

    rowsToDelete = []

    # a = []
    for i in range(len(rows)):
        # пропуск ограждений с натурным протоколом
        if rows[i][4] == 'Натурный протокол':
            continue

        a = {
            i: {
                'ogId': rows[i][0],
                'mark': rows[i][1],
                'manuf': rows[i][2],
                'chert': '',
                # 'chertFile': '',
                'KEModel': '',
                # 'KEModelFile': '',
            }
        }

        if rows[i][4] == 'Чертежи':
            a[i]['chert'] = rows[i][3]
            # a[i]['chertFile'] = rows[i][5]
        elif rows[i][4] == 'КЭ-модель':
            a[i]['KEModel'] = rows[i][3]
            # a[i]['KEModelFile'] = rows [i][5]
    
        # f = False
        for j in range(i + 1, len(rows)):
            if rows[i][0] == rows[j][0]:
                # print(rows[i][0], rows[j][0])
                if rows[j][4] == 'Чертежи': 
                    a[i]['chert'] = rows[j][3]
                    # a[i]['chertFile'] = rows[j][5]
                if rows[j][4] == "КЭ-модель":
                    a[i]['KEModel'] = rows[j][3]
                    # a[i]['KEModelFile'] = rows[j][5]

                # if rows[j][4] == 'Чертежи':
                #     a[3] = rows[i][3]
                # elif rows[j][4] == 'КЭ-модель':
                #     a[4] = rows[i][3]

                if j not in rowsToDelete:
                    rowsToDelete.append(j)
        #         # f = True

                
                # rows.remove(rows[j])

        # if f:
        #     continue
        # idx += 1
        # print(a)
        res.update(a)

        # print(res)

    # print(rowsToDelete)

    for row in rowsToDelete:
        del res[row]

    # print(res)
    # if len(res) == 0:
    #     res = {
    #         'noResults': True
    #     }
    # else: res.update({
    #     'noResults': False,
    # })
    return json.dumps(res)


@app.route('/api/getCurrBarrier', methods = ['GET', 'POST'])
def getCurrInfo():
    data = request.get_json()
    id = data["ogId"]

    # print(data)

    conn = pyodbc.connect('Driver={SQL Server};'
                      'Server=DESKTOP-Q21V9MK;'
                      'Database=Barriers;'
                      'Trusted_Connection=yes;')
    cursor = conn.cursor()

    barInfo = {
        'mark': '',
        'class': '',
        'subclass': '',
        'group': '',
        'subgroup': '',
        'type': '',
        'UUS': '',
        'enUdara': 0,
        'height': 0,
        'dynProg': 0,
        'rSh': 0,
        'shSt': 0,
        'manuf': '',
        'ITT': 0,
        'KEModel': '',
        'chert': '',
        'natProt': '',
        'elements': {},
    }

    mainBarInfoQuery = f'''SELECT TOP (1000) [КодОгр]
      ,[маркировка]
      ,[класс]
      ,[подкласс]
      ,[группа]
      ,[подгруппа]
      ,[тип]
      ,[удержСпособн]
      ,[энергияудара]
      ,[высота]
      ,[шаг_стоек]
      ,[изготовитель]
      ,[дин_прогиб]
      ,[раб_ширина]
  FROM [Barriers].[dbo].[Ограждения]
  WHERE Ограждения.КодОгр = {id}'''

    cursor.execute(mainBarInfoQuery)

    rows = cursor.fetchall()

    mainBarInfo = rows[0]

    
    # Поис файлов ограждения (КЭ-модель, Чертежи, Натурный протокол)
    filesQuery = f'''SELECT
	ОгрДок.ИмяФ,
	ОгрДок.Тип
	--ОгрДок.Файл
  FROM [Barriers].[dbo].[ОгрДок] JOIN Ограждения ON ОгрДок.КодОгр = Ограждения.КодОгр
  WHERE Ограждения.КодОгр = {id}'''

    cursor.execute(filesQuery)
    rows = cursor.fetchall()

    if len(rows) != 0:
        for row in rows:
            if row[1] == 'Чертежи':
                barInfo['chert'] = row[0]
            elif row[1] == 'КЭ-модель':
                barInfo['KEModel'] = row[0]
            elif row[1] == 'Натурный протокол':
                barInfo['natProt'] = row[0]


    # print(mainBarInfo)

    # print(rows[0])

    barInfo['mark'] = mainBarInfo[1]
    barInfo['class'] = mainBarInfo[2]
    barInfo['subclass'] = mainBarInfo[3]
    barInfo['group'] = mainBarInfo[4]
    barInfo['subgroup'] = mainBarInfo[5]
    barInfo['type'] = mainBarInfo[6]
    barInfo['UUS'] = mainBarInfo[7]
    barInfo['enUdara'] = mainBarInfo[8]
    try:
        barInfo['height'] = float('{:.2f}'.format(mainBarInfo[9]))
    except TypeError:
        barInfo['height'] = 0
    barInfo['shSt'] = mainBarInfo[10]
    barInfo['manuf'] = mainBarInfo[11]
    try:
        barInfo['dynProg'] = float('{:.2f}'.format(mainBarInfo[12]))
    except TypeError:
        barInfo['dynProg'] = 0
    try:
        barInfo['rSh'] = float('{:.2f}'.format(mainBarInfo[13]))
    except TypeError:
        barInfo['rSh'] = 0

    # print(barInfo)


    dynProgQuery = f'''SELECT DISTINCT Испытания_Параметры.Наименование,
	Испытания_Параметры.фактЗнач
  FROM [Barriers].[dbo].[Ограждения] JOIN Протокол on Ограждения.КодОгр = Протокол.КодОгр JOIN Испытания on Протокол.НПр = Испытания.НПр JOIN Испытания_Параметры on Испытания.НИсп = Испытания_Параметры.НИсп
  WHERE Ограждения.КодОгр = {id} and Испытания_Параметры.Наименование = \'Динамический прогиб\''''

    cursor.execute(dynProgQuery)

    rows = cursor.fetchall()
    if(len(rows) != 0):
        dynProgInfo = rows[0]
        barInfo['dynProg'] = float('{:.2f}'.format(dynProgInfo[1]))
        

    # print(rows)


    rShQuery = f'''SELECT DISTINCT Испытания_Параметры.Наименование,
	Испытания_Параметры.фактЗнач
  FROM [Barriers].[dbo].[Ограждения] JOIN Протокол on Ограждения.КодОгр = Протокол.КодОгр JOIN Испытания on Протокол.НПр = Испытания.НПр JOIN Испытания_Параметры on Испытания.НИсп = Испытания_Параметры.НИсп
  WHERE Ограждения.КодОгр = {id} and (Испытания_Параметры.Наименование = \'Рабочая ширина\' OR Испытания_Параметры.Наименование = \'рабочая ширина\')'''

    cursor.execute(rShQuery)

    rows = cursor.fetchall()
    if(len(rows) != 0):
        rShInfo = rows[0]
        barInfo['dynProgib'] = float('{:.2f}'.format(rShInfo[1]))

    UUSQuery = f'''SELECT DISTINCT Испытания_Параметры.Наименование,
	Испытания_Параметры.фактЗнач
  FROM [Barriers].[dbo].[Ограждения] JOIN Протокол on Ограждения.КодОгр = Протокол.КодОгр JOIN Испытания on Протокол.НПр = Испытания.НПр JOIN Испытания_Параметры on Испытания.НИсп = Испытания_Параметры.НИсп
  WHERE Ограждения.КодОгр = {id} and Испытания_Параметры.Наименование = \'Удерживающая способ\''''

    cursor.execute(UUSQuery)

    rows = cursor.fetchall()
    if(len(rows) != 0):
        UUSInfo = rows[0]
        barInfo['enUdara'] = UUSInfo[1]


    ITTQuery = f'''SELECT DISTINCT Испытания_Параметры.Наименование,
	Испытания_Параметры.фактЗнач
  FROM [Barriers].[dbo].[Ограждения] JOIN Протокол on Ограждения.КодОгр = Протокол.КодОгр JOIN Испытания on Протокол.НПр = Испытания.НПр JOIN Испытания_Параметры on Испытания.НИсп = Испытания_Параметры.НИсп
  WHERE Ограждения.КодОгр = {id} and Испытания_Параметры.Наименование = \'Индекс тяжести травм\''''

    cursor.execute(ITTQuery)

    rows = cursor.fetchall()
    if(len(rows) != 0):
        ITTInfo = rows[0]
        barInfo['ITT'] = ITTInfo[1]
    
    # Элементы и материалы
    elemsAndMaterialsQuery = f'''SELECT DISTINCT
	Элемент.Название, 
	Элемент.markirovra, 
	Элемент.высота, 
	Элемент.длина, 
	Элемент.Принадлежность, 
	Элемент.толщина, 
	Элемент.ширина, 
	Элемент.профиль,
	Элемент.имяФK,
	Элемент.имяФ3D,
	Материалы.Название, 
	Материалы.Марка,
	Материалы.МодУпр,
	Материалы.пределПрочности,
	Материалы.пределТекучести,
	Материалы.ОтУдл,
	Материалы.ОтСуз,
	Материалы.Плотность,
    Элемент.КЭл
	FROM Матер_Элем_Огр JOIN Элемент ON Матер_Элем_Огр.КЭл = Элемент.КЭл
	JOIN Материалы ON Матер_Элем_Огр.КМ = Материалы.КМ
	JOIN Ограждения ON Матер_Элем_Огр.КодОгр = Ограждения.КодОгр
  WHERE Ограждения.КодОгр = {id}'''

    cursor.execute(elemsAndMaterialsQuery)

    rows = cursor.fetchall()
    if(len(rows) != 0):
        for i in range(len(rows)):
            elemsAMaterialsInfo = rows[i]
            # print(elemsAMaterialsInfo[18])

            # Запрос на получение файлов элемента
            getFilesQuery = f'''
                SELECT
                    [тип]
                    ,[ИмяФ]
                    --,[файл]
                FROM [Barriers].[dbo].[ЭлемДок] JOIN Элемент ON ЭлемДок.КЭл = Элемент.КЭл
                WHERE файл IS NOT NULL and Элемент.КЭл = {elemsAMaterialsInfo[18]}
            '''
            cursor.execute(getFilesQuery)
            filesInfo = cursor.fetchall()
            filesObject = {
                'KEModel': '',
                '3DModel': '',
                'chert': ''
            }
            if len(filesInfo) != 0:
                for row in filesInfo:
                    print(row)
                    if row[0] == 'Чертежи':
                        filesObject['chert'] = row[1]
                    elif row[0] == '3D модель':
                        filesObject['3DModel'] = row[1]
                    elif row[0] == 'КЭ модель':
                        filesObject['KEModel'] = row[1]

            elInfo = {
                i: {
                    'name': elemsAMaterialsInfo[0],
                    'mark': elemsAMaterialsInfo[1],
                    'height': elemsAMaterialsInfo[2],
                    'length': elemsAMaterialsInfo[3],
                    'prin': elemsAMaterialsInfo[4],
                    'tolshina': elemsAMaterialsInfo[5],
                    'width': elemsAMaterialsInfo[6],
                    'profile': elemsAMaterialsInfo[7],
                    'elemFiles': filesObject,
                    'mName': elemsAMaterialsInfo[10],
                    'mMark': elemsAMaterialsInfo[11],
                    'mModUpr': elemsAMaterialsInfo[12],
                    'mPredProchn': elemsAMaterialsInfo[13],
                    'mPredTek': elemsAMaterialsInfo[14],
                    'otUdl': elemsAMaterialsInfo[15],
                    'otSuz': elemsAMaterialsInfo[16],
                    'mPlotn': elemsAMaterialsInfo[17],
                }
            }       
            barInfo['elements'].update(elInfo)

    # Файлы элементов


    # print (barInfo)

    return json.dumps(barInfo)


@app.route('/api/getBarFile', methods = ['GET', 'POST'])
def getBarFile():
    
    data = request.get_json()
    fName = data['fName']

    conn = pyodbc.connect('Driver={SQL Server};'
                      'Server=DESKTOP-Q21V9MK;'
                      'Database=Barriers;'
                      'Trusted_Connection=yes;')
    cursor = conn.cursor()

    query = f'''SELECT
	ОгрДок.Файл
  FROM [Barriers].[dbo].[ОгрДок]
  WHERE ОгрДок.ИмяФ = \'{fName}\''''
    print(query)
    cursor.execute(query)
    file = cursor.fetchone()
    # print(file)
    
    return file[0]


@app.route('/api/getElemFile', methods = ['GET', 'POST'])
def getElemFile():
    data = request.get_json()
    fName = data['fName']
    # print(fName)

    conn = pyodbc.connect('Driver={SQL Server};'
                      'Server=DESKTOP-Q21V9MK;'
                      'Database=Barriers;'
                      'Trusted_Connection=yes;')
    cursor = conn.cursor()

    query = f'''
    SELECT
	    ЭлемДок.файл
    FROM Элемент JOIN ЭлемДок ON Элемент.КЭл = ЭлемДок.КЭл
    WHERE ЭлемДок.ИмяФ = \'{fName}\''''
    # print(query)

    cursor.execute(query)
    file = cursor.fetchone()
    # print(file)
    
    return file[0]

        

#     return res[0]

# @app.route('/api/getHeight')
# def getHeight():
#     conn = pyodbc.connect('Driver={SQL Server};'
#                       'Server=DESKTOP-Q21V9MK;'
#                       'Database=Barriers;'
#                       'Trusted_Connection=yes;')
#     cursor = conn.cursor()
#     cursor.execute('''SELECT MIN(высота) as minimum, MAX(высота) as maximum
#   FROM [Barriers].[dbo].[Ограждения]''')

#     rows = cursor.fetchall()
#     height = []
    
#     for row in rows:
#         height.append(list(row))

#     height[0][1] = float('{:.2f}'.format(height[0][1]))

#     cursor.close()
#     conn.close()

#     return json.dumps(height)

@app.route('/api/test')
def open_pdf():
    with open("Output.pdf", "wb") as output_file:
        conn = pyodbc.connect('Driver={SQL Server};'
                      'Server=DESKTOP-Q21V9MK;'
                      'Database=Barriers;'
                      'Trusted_Connection=yes;')
        cursor = conn.cursor()
        cursor.execute('''SELECT top (1) Файл
  FROM [Barriers].[dbo].[ОгрДок] where КодОгр = 66''')
        ablob = cursor.fetchone()
        output_file.write(ablob[0])
    
    return ablob[0]