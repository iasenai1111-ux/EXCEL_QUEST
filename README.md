# 🎮 SUPER SENAI BROS: EXCEL WORLD
> **A Grande Odisséia das Planilhas • Videogame Educacional Super Mario Style**  
> Desenvolvido especialmente para os estudantes do **SENAI-SP**.

---

### 🏛️ Créditos Institucionais & Autoria
- **Instrutor de Formação Profissional do SENAI-SP:** Rafael Pereira  
- **Unidade de Ensino:** Escola SENAI “Orlando Laviero Ferraiuolo”  
- **Disciplina:** Informática Básica, Gestão & Planilhas Eletrônicas (Microsoft Excel)  
- **Repositório Oficial:** [https://github.com/iasenai1111-ux/EXCEL_QUEST](https://github.com/iasenai1111-ux/EXCEL_QUEST)  
- **Acesso Online (GitHub Pages):** [https://iasenai1111-ux.github.io/EXCEL_QUEST/](https://iasenai1111-ux.github.io/EXCEL_QUEST/)

---

## 🎯 Sobre o Jogo

**SUPER SENAI BROS: EXCEL WORLD** é uma fusão criativa entre a lendária atmosfera e mecânicas de exploração e plataforma dos clássicos da era *Super Mario* com o poder analítico das fórmulas do **Microsoft Excel** no ecossistema do **SENAI**.

O jogador assume o comando do herói pelas salas de uma fábrica/laboratório inteligente, saltando em blocos de interrogação `[?]`, interagindo com chefes de setor e resolvendo desafios práticos de planilhas em tempo real (como `SOMA`, `MÉDIA`, `MÁXIMO`, `MÍNIMO`, `CONT.SE`, `SE`, e muito mais).

---

## ✨ Recursos & Funcionalidades

### 1. 🍄 Estilo Visual "Super Mario Bros" & Exploração 2D
- Letreiro 3D arcade multicolorido e blocos clássicos com estética pixel art.
- Mapa de Mundos interativo (Overworld) para navegar entre os setores industriais.
- Salte em blocos `[?]` para coletar moedas 🪙 e dicas de fórmulas.

### 2. 🎸 Trilha Sonora Dupla: 8-Bit Chiptune vs Gravação Original Rock
O jogo conta com um sistema de áudio completo com a lendária música **"Carry on Wayward Son"** (Kansas), com dois modos selecionáveis a qualquer momento:
- **👾 Modo 8-Bit Chiptune Arcade:** Arranjo sintetizado retrô em tempo real via Web Audio API.
- **🎸 Modo Gravação Original Rock (Sem ser bit):** Versão studio rock de alta definição com guitarras elétricas com overdrive, baixo marcante, órgão Hammond e bateria acústica.
- **📂 Carregar MP3 Local:** O aluno ou professor pode clicar em *"Carregar MP3 do Computador"* no menu de som para tocar seu próprio arquivo da música original em alta definição!
- **🎚️ Sliders Independentes:** Controle de volume Master, BGM (Música) e SFX (Efeitos Sonoros), com equalizador dinâmico.

### 3. 💖 Sistema de 3 Vidas & Game Over Estrito
- O jogador começa com **3 Vidas**.
- Respostas erradas nos terminais de planilhas consomem vidas.
- Se perder todas as vidas, ocorre o Game Over que reinicia na Fase 1, garantindo o aprendizado sólido de cada pré-requisito antes do avanço.

### 4. 🥊 Tela de Zeramento Estilo "Street Fighter"
- Ao concluir todos os desafios do jogo, o aluno é recompensado com uma tela comemorativa retrô inspirada nos finais de arcade dos anos 90, com troféu dourado, confetes, placar final e certificado simbólico de conclusão.

### 5. 👨‍🏫 Painel do Professor (Acesso Root)
- Área restrita para o Instrutor **Rafael Pereira**, protegida por senha:
  - **Senha do Professor:** `69617985@@`
- **Recursos para o Docente:**
  - Gabarito oficial de todas as fórmulas de cada fase.
  - Teletransporte e desbloqueio imediato de qualquer nível para demonstração em aula.
  - Modo Trailer cinematográfico para projeção em data-show.
  - Modo Root (invencibilidade para demonstrações ao vivo).

### 6. 📊 Planilhas Reais do Microsoft Excel (.xlsx)
- Botão in-game para baixar o arquivo `.xlsx` gerado na hora, permitindo aos alunos treinarem os mesmos exercícios diretamente no Microsoft Excel do laboratório.

---

## 🕹️ Controles

| Ação | Teclado (PC) | Mobile / Touch |
| :--- | :--- | :--- |
| **Mover** | `W`, `A`, `S`, `D` ou `Setas` | D-Pad virtual na tela |
| **Pular** | `W`, `Seta Cima` ou `Barra de Espaço` | Botão virtual de Pulo |
| **Interagir com Terminais** | `Barra de Espaço` ou `Enter` | Botão de Ação |
| **Alternar Áudio (8-Bit / Original)** | Clique no botão `👾/🎸` no topo | Toque no botão de áudio |
| **Menu de Configurações** | Ícone de engrenagem | Toque na engrenagem |
| **Painel do Professor** | Ícone de capelo docente | Acesso demonstrativo, sem proteção de servidor |

---

## 🚀 Publicação no GitHub Pages

O projeto já conta com o workflow automatizado do **GitHub Actions** em `.github/workflows/deploy.yml`.

### Como publicar:
1. No repositório do GitHub (`https://github.com/iasenai1111-ux/EXCEL_QUEST/settings/pages`):
   - Em **Source**, selecione **GitHub Actions**.
2. Faça o envio (push) das alterações:
   ```bash
   git add .
   git commit -m "feat: SUPER SENAI BROS: EXCEL WORLD - Painel do Professor Root, Gabaritos e Áudio Rock Original"
   git push origin main
   ```
   *(Ou com seu Token pessoal):*
   ```bash
   git push https://<SEU_TOKEN_GITHUB>@github.com/iasenai1111-ux/EXCEL_QUEST.git HEAD:main
   ```
3. O jogo estará disponível em instantes em:
   👉 **`https://iasenai1111-ux.github.io/EXCEL_QUEST/`**

---

## 💻 Execução Local

```bash
# Instalar dependências
npm install

# Rodar servidor local
npm run dev

# Compilar para produção
npm run build
```

---

### 🏫 SENAI — Serviço Nacional de Aprendizagem Industrial
*Escola SENAI “Orlando Laviero Ferraiuolo” — São Paulo/SP*  
*Instrutor de Formação Profissional: Rafael Pereira*
