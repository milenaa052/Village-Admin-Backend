# Aldeia-Admin
Repositório criado para a criação do Microsserviço de Administrador do projeto - https://github.com/milenaa052/Portal-Institucional-Aldeia

# 1 REFERENCIAL TEÓRICO

## 1.1 Fundamentação das tecnologias escolhidas

A definição da stack tecnológica é um dos fatores determinantes para o sucesso no desenvolvimento de sistemas modernos, especialmente no que se refere à escalabilidade, manutenibilidade e qualidade do software. Neste contexto, a utilização integrada de tecnologias como **Node.js**, **NestJS**, **Express**, **TypeScript**, **React**, **MySQL**, **Cypress** e **Jest** configura uma solução robusta e amplamente adotada na indústria de software.

O **Node.js** é empregado como ambiente de execução no backend, permitindo a utilização da linguagem JavaScript no lado do servidor. Sua arquitetura assíncrona e orientada a eventos proporciona alto desempenho no processamento de múltiplas requisições simultâneas, sendo particularmente adequada para aplicações web escaláveis e APIs. O arquiteto de software Martin Moraz afirma que:

> “o Node.js depende de um tempo de execução assíncrono que reduz os tempos ociosos relacionados às operações de Input/Output (I/O). Esta arquitetura não-bloqueio permite um desenvolvimento rápido sem esperar que cada solicitação seja concluída.”

Sobre essa base, o **Express** atua como um framework minimalista para a construção de aplicações web e serviços HTTP, oferecendo flexibilidade na definição de rotas e middlewares. Segundo a Sea Solutions, o Express é amplamente reconhecido como padrão de mercado para construção de APIs em Node.js, sendo descrito como uma escolha “segura” devido à sua simplicidade e grande comunidade.

Complementarmente, o **NestJS** é adotado com o objetivo de impor uma arquitetura mais organizada e modular ao sistema. Inspirado em padrões consolidados de engenharia de software, o NestJS promove a separação de responsabilidades por meio de conceitos como módulos, controladores e serviços, além de oferecer suporte nativo à injeção de dependência.

> “A Nest fornece uma arquitetura de aplicativos pronta para uso que permite que desenvolvedores e equipes criem aplicativos altamente testáveis, escaláveis, acoplados e facilmente manuteníveis.” (NESTJS, 2017).

A utilização do **TypeScript** contribui significativamente para a qualidade do código, ao introduzir tipagem estática ao JavaScript. Tal característica reduz a ocorrência de erros em tempo de execução, melhora a legibilidade e facilita a manutenção do sistema, especialmente em aplicações de maior complexidade.

No que se refere ao desenvolvimento da interface do usuário, o **React** é empregado para a construção de interfaces dinâmicas e reativas, baseadas em componentes reutilizáveis.

> “Essa abordagem envolve a criação de componentes autocontidos menores e mais simples, que são posteriormente combinados para construir interfaces de usuário (UI’s) mais complexas.” (DTI Digital, 2025).

Para o gerenciamento de dados, opta-se pelo **MySQL**, um sistema de gerenciamento de banco de dados relacional amplamente consolidado. Sua adoção se justifica pela confiabilidade, suporte a transações e capacidade de lidar com consultas complexas, garantindo a integridade e consistência dos dados armazenados.

Adicionalmente, a qualidade do software é assegurada por meio da adoção de práticas de testes automatizados. O **Jest** é utilizado para a realização de testes unitários e de integração, permitindo a validação isolada de componentes do sistema. Por sua vez, o **Cypress** é empregado na execução de testes end-to-end, possibilitando a simulação da interação do usuário com a aplicação em ambiente real, garantindo o correto funcionamento dos fluxos principais.

Dessa forma, a combinação dessas tecnologias proporciona uma base sólida para o desenvolvimento de aplicações modernas, assegurando não apenas desempenho e escalabilidade, mas também organização arquitetural e elevado padrão de qualidade de software.

---

# 2 ARQUITETURA E QUALIDADE TÉCNICA DO SISTEMA

## 2.1 Arquitetura da Aplicação

A arquitetura do sistema será baseada no modelo em camadas, promovendo uma separação clara de responsabilidades entre frontend, backend, domínio e persistência de dados. Essa abordagem tem como objetivo garantir maior organização, escalabilidade e facilidade de manutenção.

A aplicação será estruturada em três camadas principais:

### Camada de Apresentação (Frontend)

Desenvolvida em **React**, responsável pela interface com o usuário, exibição de conteúdos culturais e navegação entre as páginas.

### Camada de Aplicação/Serviços (Backend)

Implementada com **Node.js** e **Express**, responsável pelo processamento das requisições, regras de negócio e comunicação com o banco de dados.

### Camada de Dados (Banco de Dados)

Utilizando **MySQL** para armazenamento estruturado das informações.

### Camada de Testes

Garante a qualidade, confiabilidade e funcionamento correto do sistema ao longo de todo o seu ciclo de desenvolvimento. Para isso, são aplicadas práticas de automação de testes que permitem validar tanto o comportamento isolado de componentes quanto o fluxo completo da aplicação.

Além disso, será adotada uma arquitetura baseada em microsserviços, visando maior escalabilidade, melhor separação de responsabilidades e maior tolerância a falhas. A distribuição será organizada da seguinte forma:

- **Dashboard Administrativo:** responsável pela gestão de produtos, categorias e conteúdos do site institucional.
- **Dashboard de Indicadores:** destinado à visualização de relatórios de Business Intelligence, como métricas de sucesso, produtos mais acessados, produtos mais vendidos, taxa de conversão e público mais frequente no sistema através do Metabase.
- **Site Institucional:** frontend completo do site institucional com todas as informações sobre a aldeia, produtos, imagens, endereço e contato.
- **Painel do Cliente:** área de acesso destinada aos usuários autenticados que desejam realizar a compra dos produtos, acessar o histórico de produtos adquiridos e gerenciar suas informações de forma segura e organizada.
- **Aplicação de Testes:** responsável pela execução de testes unitários, de integração, end-to-end e de interface.

Adotaremos containers Docker para o isolamento dos microsserviços, com **Nginx** atuando como proxy reverso, roteando requisições e realizando balanceamento de carga para a comunicação.

O tráfego é centralizado pelo Nginx, que distribui as requisições para os microsserviços de frontend. Estes, por sua vez, consomem as APIs Node.js. Os dados operacionais são persistidos na camada Bronze do MySQL, processados para a camada Silver e consolidados na Gold para visualização estratégica via Metabase. A integridade de todo este fluxo é validada continuamente pelo componente de testes, que executa varreduras de ponta a ponta simulando a jornada do usuário.

### 2.1.1 Estrutura Interna

## Backend

- **Controllers:** responsáveis por receber e responder requisições HTTP.
- **Services:** responsáveis pela implementação das regras de negócio.
- **Repositories/DAO:** responsáveis pela comunicação com o banco de dados.
- **Middleware:** camada responsável pela comunicação entre diferentes serviços e gerenciamento de autenticação.
- **Routes:** definição de rotas da aplicação.

### Exemplo de endpoints

```http
POST /api/products
GET /api/products
PUT /api/products/:id
DELETE /api/products/:id
```

## Frontend

- **Assets:** armazenamento de imagens e ícones.
- **Components:** componentes reutilizáveis.
- **Pages:** páginas construídas a partir dos componentes.
- **Types:** arquivos de tipagem focados nas boas práticas para evitar erros, garantir segurança e legibilidade de código.
- **Routes:** responsável pela definição de rotas.
- **Service:** responsável pela comunicação com o backend via API.
- **Hooks:** destinado para funções que permitem o uso do state.
- **Styles:** arquivos de estilização global.

### Testabilidade no Frontend

```html
<button data-testid="login-button">Entrar</button>
```

## Testes

- **E2E:** testes de fluxo completo da aplicação.
- **Unitary:** validação de funções isoladas.
- **Integration:** validação de integração entre módulos.
- **Interface:** responsável pelos testes de componentes visuais.
- **Config:** configuração de ambientes.
- **Fixtures:** funções reutilizáveis.
- **Mocks:** simulação de dados.

Essa organização evita o acoplamento excessivo e facilita a evolução do sistema, permitindo alterações em uma camada sem impactar diretamente as demais.

## 2.2 Diagrama da Arquitetura
![Diagrama UML](./images//Diagrama%20UML.drawio.png)

## 2.3 Diagrama de Atividades
![Diagrama de Atividades](./images/Diagrama%20de%20Atividades.drawio.png)

# REFERÊNCIAS

DIGITAL, Dti. *React: por que considerá-lo no seu projeto?*. 2025. Disponível em: <https://www.dtidigital.com.br/blog/considere-react-no-seu-projeto>. Acesso em: 20 abr. 2026.

NESTJS. *Philosophy*. Disponível em: <https://docs.nestjs.com/>. Acesso em: 20 abr. 2026.