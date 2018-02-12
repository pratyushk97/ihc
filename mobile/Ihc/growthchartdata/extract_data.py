import csv
import json

#csvfile = open('statage.csv', 'r')
#boysjson = open('boys_heights.json', 'w')
#girlsjson = open('girls_heights.json', 'w')

csvfile = open('wtage.csv', 'r')
boysjson = open('boys_weights.json', 'w')
girlsjson = open('girls_weights.json', 'w')

def convert(row):
    obj = {}
    for k in row.keys():
        obj[k] = float(row[k])
    return obj

def extractPoints(obj):
    arr = []
    arr.append({"Sex": obj["Sex"], "Agemos": obj["Agemos"], "P3": obj["P3"]})
    arr.append({"Sex": obj["Sex"], "Agemos": obj["Agemos"], "P5": obj["P5"]})
    arr.append({"Sex": obj["Sex"], "Agemos": obj["Agemos"], "P10": obj["P10"]})
    arr.append({"Sex": obj["Sex"], "Agemos": obj["Agemos"], "P25": obj["P25"]})
    arr.append({"Sex": obj["Sex"], "Agemos": obj["Agemos"], "P50": obj["P50"]})
    arr.append({"Sex": obj["Sex"], "Agemos": obj["Agemos"], "P75": obj["P75"]})
    arr.append({"Sex": obj["Sex"], "Agemos": obj["Agemos"], "P90": obj["P90"]})
    arr.append({"Sex": obj["Sex"], "Agemos": obj["Agemos"], "P95": obj["P95"]})
    return arr

fieldnames = ("Sex", "Agemos", "L", "M", "S", "P3", "P5", "P10", "P25", "P50", \
        "P75", "P90", "P95", "P97")
reader = csv.DictReader(csvfile, fieldnames)

boysjson.write('[')
girlsjson.write('[')

boysCount = 0
girlsCount = 0
boyDone = 0
girlDone = 0

for row in reader:
    obj = convert(row)
    # Sample 1/5 of data points by skipping rows if not multiple of 5
    if obj["Sex"] == 1:
        boysCount = boysCount + 1
        if not boysCount % 5 == 0:
            continue
    else:
        girlsCount = girlsCount + 1
        if not girlsCount % 5 == 0:
            continue
    points = extractPoints(obj)
    # temps to clear first row without comma
    if obj["Sex"] == 1:
        for o in points:
            if boyDone == 0:
                boyDone = 1
            else:
                boysjson.write(',\n')
            json.dump(o, boysjson)
    else:
        for o in points:
            if girlDone == 0:
                girlDone = 1
            else:
                girlsjson.write(',\n')
            json.dump(o, girlsjson)

boysjson.write(']')
girlsjson.write(']')
