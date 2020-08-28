import csv

pessoas = {}
attributes = ['alcohol', 'psychosis', 'anxiety-non-trauma', 'somatic disorder', 'eating', 'bipolar spectrum illness', 'depression', 'interpersonal trauma', 'PD-Cluster C-anxiety', 'PD-Cluster B-emotional', 'PD', 'Impulse control disorder', 'obesity', 'cardiovascular', 'COPD', 'asthma', 'immune-autoimmune']

# Getting each person and its attributes and grouping according to families
with open('dataset/TenFamiliesAttributes.csv', newline='') as inputFile:
        reader = csv.DictReader(inputFile)
        for row in reader:
                
                #Initialize
                pessoa = {}
                
                #Attributes
                personid = int(row['personid'])
                pessoa['personid'] = personid 

                for attribute in attributes:
                    pessoa[attribute] = row[attribute] == 'True'
                
                #Add to person list
                pessoas[personid] = pessoa

with open('dataset/TenFamiliesStructure.csv', newline='') as inputFile:
        reader = csv.DictReader(inputFile)
        for row in reader:
                
                #Initialize
                pessoa = {}
                personid = int(row['personid'])
                
                #Ignoring non-suiciders
                if personid not in pessoas.keys():
                        continue

                #Attributes
                pessoas[personid]['KindredID'] = int(row['KindredID'])
                pessoas[personid]['suicide'] = row['suicide'] == 'Y'
                pessoas[personid]['sex'] = row['sex']
                pessoas[personid]['Age'] = int(float(row['Age']))

with open('dataset/question3.csv', 'w', newline='') as outputFile:
        fields = ['personid', 'KindredID', 'suicide', 'sex', 'Age'] + attributes
        writer = csv.DictWriter(outputFile, fieldnames=fields)

        writer.writeheader()
        for row in pessoas:
                writer.writerow(pessoas[row])
