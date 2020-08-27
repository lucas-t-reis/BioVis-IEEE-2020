import csv

pessoas = {}

with open('dataset/TenFamiliesAttributes.csv', newline='') as inputFile:
	reader = csv.DictReader(inputFile)
	for row in reader:
		
		#Initialize
		pessoa = {}
		
		#Attributes
		pessoa['personid'] = int(row['personid'])
		pessoa['alcohol'] = row['alcohol'] == 'True'
		pessoa['psychosis'] = row['psychosis'] == 'True'
		pessoa['anxiety-non-trauma'] = row['anxiety-non-trauma'] == 'True'
		pessoa['somatic disorder'] = row['somatic disorder'] == 'True'
		pessoa['eating'] = row['eating'] == 'True'
		pessoa['bipolar spectrum illness'] = row['bipolar spectrum illness'] == 'True'
		pessoa['depression'] = row['depression'] == 'True'
		pessoa['interpersonal trauma'] = row['interpersonal trauma'] == 'True'
		pessoa['PD-Cluster C-anxiety'] = row['PD-Cluster C-anxiety'] == 'True'
		pessoa['PD-Cluster B-emotional'] = row['PD-Cluster B-emotional'] == 'True'
		pessoa['PD'] = row['PD'] == 'True'
		pessoa['Impulse control disorder'] = row['Impulse control disorder'] == 'True'
		pessoa['obesity'] = row['obesity'] == 'True'
		pessoa['cardiovascular'] = row['cardiovascular'] == 'True'
		pessoa['COPD'] = row['COPD'] == 'True'
		pessoa['asthma'] = row['asthma'] == 'True'
		pessoa['immune-autoimmune'] = row['immune-autoimmune'] == 'True'
		
		#Add to person list
		pessoas[int(row['personid'])] = pessoa

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
	fields = ['personid', 'KindredID', 'suicide', 'sex', 'Age', 'alcohol', 'psychosis', 'anxiety-non-trauma', 'somatic disorder', 'eating', 'bipolar spectrum illness', 'depression', 'interpersonal trauma', 'PD-Cluster C-anxiety', 'PD-Cluster B-emotional', 'PD', 'Impulse control disorder', 'obesity', 'cardiovascular', 'COPD', 'asthma', 'immune-autoimmune']		
	writer = csv.DictWriter(outputFile, fieldnames=fields)

	writer.writeheader()
	for row in pessoas:
		writer.writerow(pessoas[row])