import csv
import json
from collections import defaultdict

hcsvfile = open('statage.csv', 'r')
hboysjson = open('boys_heights.json', 'w')
hgirlsjson = open('girls_heights.json', 'w')

wcsvfile = open('wtage.csv', 'r')
wboysjson = open('boys_weights.json', 'w')
wgirlsjson = open('girls_weights.json', 'w')

def convert(row):
    data = {}
    for k in row.keys():
        data[k] = float(row[k])
    return data

def extractPoints(data, boyObj, girlObj):
    if data["Sex"] == 1:
        obj = boyObj
    else:
        obj = girlObj
    obj["P3"].append([data["Agemos"], data["P3"]])
    obj["P5"].append([data["Agemos"], data["P5"]])
    obj["P10"].append([data["Agemos"], data["P10"]])
    obj["P25"].append([data["Agemos"], data["P25"]])
    obj["P50"].append([data["Agemos"], data["P50"]])
    obj["P75"].append([data["Agemos"], data["P75"]])
    obj["P90"].append([data["Agemos"], data["P90"]])
    obj["P95"].append([data["Agemos"], data["P95"]])
    return

# Sample 1/skipFactor points by skipping other rows
skipFactor = 8

def do(csvfile, boysjson, girlsjson):
    fieldnames = ("Sex", "Agemos", "L", "M", "S", "P3", "P5", "P10", "P25", "P50", \
            "P75", "P90", "P95", "P97")
    reader = csv.DictReader(csvfile, fieldnames)
    boysCount = 0 # count of rows (months)
    girlsCount = 0
    boyDone = 0
    girlDone = 0
    # the return objs
    boyObj = defaultdict(list)
    girlObj = defaultdict(list)
    for row in reader:
        data = convert(row)
        if data["Sex"] == 1:
            boysCount = boysCount + 1
            if not boysCount % skipFactor == 0:
                continue
        else:
            girlsCount = girlsCount + 1
            if not girlsCount % skipFactor == 0:
                continue
        points = extractPoints(data, boyObj, girlObj)
        # temps to clear first row without comma
    json.dump(girlObj, girlsjson)
    json.dump(boyObj, boysjson)

do(hcsvfile, hboysjson, hgirlsjson)
do(wcsvfile, wboysjson, wgirlsjson)
