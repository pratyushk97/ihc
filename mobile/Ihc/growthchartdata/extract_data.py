import csv
import json

csvfile = open('statage.csv', 'r')
boysjson = open('boys_heights.json', 'w')
girlsjson = open('girls_heights.json', 'w')

#csvfile = open('wtage.csv', 'r')
#boysjson = open('boys_weights.json', 'w')
#girlsjson = open('girls_weights.json', 'w')

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

count = 0
for row in reader:
    count = count + 1
    # Sample 1/5 of data points
    if not count % 5 == 0:
        continue
    obj = convert(row)
    points = extractPoints(obj)
    if obj["Sex"] == 1:
        for o in points:
            json.dump(o, boysjson)
            boysjson.write('\n')
    else:
        for o in points:
            json.dump(o, girlsjson)
            girlsjson.write('\n')
