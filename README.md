# A fazer

- [ ] Esqueleto da relaçao entre paginas

- Estrutura do Paper: Mínimo 4 páginas
  - **Abstract**
  - **Introdução**
    - O que e visualização, como e feita e pq e importante para resolver esse problema.
  - **Metodologia**
    - Descrever o dataset (atributos, numero de familias...)
  - **Questões respondidas (fotos, descrever,...)**
    - Descrever a questão (o que ela pede)
    - Descrever as visualizações
    - Apontar vantagens/disvantagens de seu uso
    - Evidenciar um dado importante que foi extraído da visualização
  - **Conclusão**
    - Reafirmar as vantagens de usar visualização para extrair informações 'escondidas' em grande volume de dados
    - trabalhos futuros, falar sobre o q faltou e o que poderia ter sido feito melhor
  - **Referências**
    - Referencias artigos que ela passou, livro da disciplina e material teórico.

- https://docs.google.com/presentation/d/18u4T5Y6lpFaYuCQQ2nRFAJpnrGWcj5QvY6PBX_ZekbY/edit?usp=sharing
- https://docs.google.com/document/d/1ehnJ4RLszOWBE1lWKxVz9QsDcDxYHZYfN76qFLSbY4Y/edit?usp=sharing

# BioVis-IEEE
Data visualization project for the BioVis@IEEE Data Challenge


Incluir dados faltantes no datasets? Caso dos 161x173 suicidios
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
Aged1D e referente a idade do primeiro diagnostico?
Nr.Diag - Numero de Diagnosticos?
```

