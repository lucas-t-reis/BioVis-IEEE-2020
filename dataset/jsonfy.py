import csv
attributes = ['alcohol', 'psychosis', 'anxiety-non-trauma', 'somatic disorder', 'eating', 'bipolar spectrum illness', 'depression', 'interpersonal trauma', 'PD-Cluster C-anxiety', 'PD-Cluster B-emotional', 'PD', 'Impulse control disorder', 'obesity', 'cardiovascular', 'COPD', 'asthma', 'immune-autoimmune']
family_attributes = {}
with open('dataset/filtered_data.csv', newline='') as inputFile:
        reader = csv.DictReader(inputFile)
        for row in reader:
                family = int(row['KindredID'])
                if family not in family_attributes:
                    family_attributes[family] = {}
                for attribute in attributes:
                    if row[attribute] == 'True':
                        
                        if attribute not in family_attributes[family]:
                            family_attributes[family][attribute] = 0
                        
                        family_attributes[family][attribute] += 1

with open('family_attributes.json', 'w') as file:
    file.write('{"children" : [')
    for (i, key) in enumerate(family_attributes):
        if i != 0:
            file.write(',')
        file.write('\n\t{"name":' + '"' + str(key) + '"' + ',"children":[\n')
        for (j, attribute) in enumerate(family_attributes[key]):
            file.write('\t\t{"name":' + '"' + attribute + '"' + ',"value":' + str(family_attributes[key][attribute]))
            if j != len(family_attributes[key])-1:
                file.write('},\n')
        file.write('}]}')
    file.write('],"name":"root"}')
