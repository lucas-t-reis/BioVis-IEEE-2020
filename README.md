# BioVis-IEEE
Data visualization project for the BioVis@IEEE Data Challenge

# Questions to Answer

- [ ] For a given target individual, identify similar cases, including how they are related amongst themselves (such as whether they co-occur in a given family) 
- [ ] Characterize the distribution of clinical attributes for suicide cases in families with high incidence ratios (high relative number of cases)
- [ ] Characterize (i.e, the relationship between cases and their attributes) suicide cases in families with high incidences of a given clinical attribute (such as depression)
- [ ] Compare clinical information for suicide cases with their immediate relatives (siblings, parents, and children).


## Atributes Structure

**TenFamiliesStructure.csv**
```
personID - Chave da pessoa no DB
RelativeID - 
KindredID - Familia
MaID - Mae
PaID - Pai
Sex,Deceased, Suicide
bdate,ddate - data de nascimento e morte
gen - Geraçao na arvore genealogica
age - Atributo derivado de bdate e ddate
```

**TenFamiliesAttributes.csv**
```
personID - Chave da pessoa no DB
FirstBMI - Primeira medida do Indice de Massa Corporal
MaxBMI - Maior IMC registrado 
AgeFirstBMI, AgeMaxBMI - Timestamp dos BMI citos acima
Aged1D e referente a idade do primeiro diagnostico
Nr.Diag - Numero de Diagnosticos
```

