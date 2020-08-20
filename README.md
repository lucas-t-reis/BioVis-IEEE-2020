# BioVis-IEEE
Data visualization project for the BioVis@IEEE Data Challenge


Incluir dados faltantes no datasets? Caso dos 161x173 suicidios
# Questions to Answer

- [ ] For a given target individual, identify similar cases, including how they are related amongst themselves (such as whether they co-occur in a given family) 

>Identificar Relaçao entre pessoas
>Ideia usar dispersao com formula de distancia customizavel ...

- [ ] Characterize the distribution of clinical attributes for suicide cases in families with high incidence ratios (high relative number of cases)

>Histograma
>Histograma de atributos em grupo?
>Identificar atributos que quando presentes em grupo sao determinantes para o suicidio mas que sozinhos nao contribuem tanto.

- [ ] Characterize (i.e, the relationship between cases and their attributes) suicide cases in families with high incidences of a given clinical attribute (such as depression)

>Barra
>Dado que uma familia tem numero elevado de determinado caso clinico, caracterizar os
>casos de suicidio. 
>AHABDJBCC
>AAABBBCBA

- [ ] Characterize (i.e, the relationship between cases and their attributes) suicide cases in families with high incidences of a given clinical attribute (such as depression)

>Explorar grafo e clicar no vertice mostra em comum

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
Aged1D e referente a idade do primeiro diagnostico?
Nr.Diag - Numero de Diagnosticos?
```

